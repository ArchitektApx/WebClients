import type { Runtime } from 'webextension-polyfill';

import { getPersistedSession } from '@proton/pass/auth';
import { backgroundMessage } from '@proton/pass/extension/message';
import { browserLocalStorage, browserSessionStorage } from '@proton/pass/extension/storage';
import browser from '@proton/pass/globals/browser';
import { boot, wakeup } from '@proton/pass/store/actions';
import type {
    Maybe,
    MaybeNull,
    PopupState,
    WorkerInitMessage,
    WorkerMessageResponse,
    WorkerMessageWithSender,
    WorkerWakeUpMessage,
} from '@proton/pass/types';
import { WorkerMessageType, WorkerStatus } from '@proton/pass/types';
import { getErrorMessage } from '@proton/pass/utils/errors';
import { logger } from '@proton/pass/utils/logger';
import { UNIX_HOUR, getEpoch } from '@proton/pass/utils/time';
import { parseUrl } from '@proton/pass/utils/url';
import { workerCanBoot } from '@proton/pass/utils/worker';

import { createDevReloader } from '../../shared/extension';
import WorkerMessageBroker from '../channel';
import { withContext } from '../context';
import store from '../store';

type ActivationServiceState = { updateAvailable: MaybeNull<string>; checkedUpdateAt: number };
const UPDATE_ALARM_NAME = 'PassUpdateAlarm';

export const createActivationService = () => {
    const state: ActivationServiceState = { updateAvailable: null, checkedUpdateAt: 0 };

    if (ENV === 'development') {
        createDevReloader(() => {
            WorkerMessageBroker.ports.broadcast(
                backgroundMessage({
                    type: WorkerMessageType.UNLOAD_CONTENT_SCRIPT,
                })
            );
            setTimeout(() => browser.runtime.reload(), 100);
        }, 'reloading chrome runtime');
    }

    /* Safety-net around worker boot-sequence :
     * Ensures no on-going booting sequence */
    const handleBoot = withContext((ctx) => {
        if (workerCanBoot(ctx.status)) {
            ctx.setStatus(WorkerStatus.BOOTING);

            store.dispatch(boot({}));
        }
    });

    const checkAvailableUpdate = async (): Promise<boolean> => {
        logger.info('[Worker::Activation] checking for update..');
        const now = getEpoch();

        try {
            if (now - state.checkedUpdateAt > UNIX_HOUR) {
                const [updateStatus] = await browser.runtime.requestUpdateCheck();

                if (updateStatus === 'update_available') {
                    logger.info('[Worker::Activation] update detected');
                    return true;
                }
            }

            return false;
        } catch (_) {
            return false;
        } finally {
            state.checkedUpdateAt = now;
        }
    };

    /* Try recovering the session when browser starts up
     * if any session was locally persisted
     * if not in production - use sync.html session to workaround the
     * the SSL handshake (net:ERR_SSL_CLIENT_AUTH_CERT_NEEDED) */
    const handleStartup = withContext(async (ctx) => {
        const { loggedIn } = (await ctx.init({ force: true })).getState();

        if (ENV === 'development' && RESUME_FALLBACK) {
            if (!loggedIn && (await getPersistedSession())) {
                const url = browser.runtime.getURL('/onboarding.html#/resume');
                return browser.windows.create({ url, type: 'popup', height: 600, width: 540 });
            }
        }
    });

    /* On extension update :
     * - Re-init so as to resume session as soon as possible
     * - Re-inject content-scripts to avoid stale extension contexts */
    const handleInstall = withContext(async (ctx, details: Runtime.OnInstalledDetailsType) => {
        if (details.reason === 'update') {
            if (ENV === 'production') {
                /* in production clear the cache on each extension
                 * update in case the state/snapshot data-structure
                 * has changed. FIXME: use version migrations */
                await browserLocalStorage.removeItems(['salt', 'state', 'snapshot']);
            }

            /* firefox will automatically re-inject the content-script
             * if an update is detected (when the extension runtime is
             * reloaded with the update). This is not the case on chrome
             * so we need to manually re-inject the updated script. */
            if (BUILD_TARGET === 'chrome') {
                await Promise.all(
                    (browser.runtime.getManifest().content_scripts ?? []).flatMap(async (cs) => {
                        const tabs = await browser.tabs.query({ url: cs.matches });
                        return tabs.map((tab) => {
                            logger.info(`[ActivationService::onInstall] Re-injecting script on tab ${tab.id}`);
                            return (
                                tab.id !== undefined &&
                                browser.scripting
                                    .executeScript({
                                        target: { tabId: tab.id! },
                                        files: cs.js,
                                    })
                                    .catch((e) =>
                                        logger.info(
                                            `[ActivationService::onInstall] Injection error on tab ${tab.id}`,
                                            e
                                        )
                                    )
                            );
                        });
                    })
                );
            }

            ctx.service.onboarding.onUpdate();
            return ctx.init({ force: true });
        }

        if (details.reason === 'install') {
            try {
                await Promise.all([browserLocalStorage.clear(), browserSessionStorage.clear()]);
                const url = browser.runtime.getURL('/onboarding.html#/success');
                await browser.tabs.create({ url });
            } catch (error: any) {
                logger.warn(`[Worker::Activation] requesting fork failed: ${getErrorMessage(error)}`);
            }

            void ctx.service.settings.onInstall();
            void ctx.service.onboarding.onInstall();
        }
    });

    const handleOnUpdateAvailable = (details: Runtime.OnUpdateAvailableDetailsType) => {
        if (details.version) {
            logger.info(`[Worker::Activation] update available ${details.version}`);
            state.updateAvailable = details.version;

            const popupPorts = WorkerMessageBroker.ports.query((name) => name.startsWith('popup'));

            /* on available update : only reload the runtime to force the
             * the extension update if the popup is not opened to avoid
             * discarding any ongoing user operations*/
            if (popupPorts.length === 0) return browser.runtime.reload();

            /* if we have ports opened to a popup : notify them in order
             * to manually prompt the user for a runtime reload */
            logger.info(`[Worker::Activation] update deferred because popup is active`);
            popupPorts.forEach((port) =>
                port.postMessage(
                    backgroundMessage({
                        type: WorkerMessageType.UPDATE_AVAILABLE,
                    })
                )
            );
        }
    };

    /* When waking up from the pop-up (or page) we need to trigger the background wakeup
     * saga while immediately resolving the worker state so the UI can respond to state
     * changes as soon as possible. Regarding the content-script, we simply wait for a
     * ready state as its less "critical" */
    const handleWakeup = withContext(async (ctx, message: WorkerMessageWithSender<WorkerWakeUpMessage>) => {
        const { status } = await ctx.init({});

        return new Promise<WorkerMessageResponse<WorkerMessageType.WORKER_WAKEUP>>(async (resolve) => {
            const { sender: endpoint, payload } = message;
            const { tabId } = payload;

            const popup = await (async (): Promise<Maybe<PopupState>> => {
                if (message.sender === 'popup') {
                    const tab = await browser.tabs.get(tabId);
                    const { domain } = parseUrl(tab.url ?? '');
                    const items = ctx.service.autofill.getAutofillCandidates({ realm: domain ?? '', subdomain: null });
                    const hasAutofillCandidates = items.length > 0;

                    return {
                        hasAutofillCandidates,
                        initialSearch: hasAutofillCandidates && domain ? domain : '',
                    };
                }
            })();

            switch (message.sender) {
                case 'popup':
                case 'page': {
                    /* dispatch a wakeup action for this specific receiver.
                     * tracking the wakeup's request metadata can be consumed
                     * in the UI to infer wakeup result - see `wakeup.saga.ts` */
                    store.dispatch(wakeup({ status }, endpoint, tabId));

                    resolve({
                        ...ctx.getState(),
                        buffered: WorkerMessageBroker.buffer.flush(),
                        popup,
                    });
                }
                case 'content-script': {
                    /* no need for any redux operations on content-script
                     * wakeup as it doesn't hold any store. */
                    return resolve({
                        ...(await ctx.ensureReady()).getState(),
                        settings: await ctx.service.settings.resolve(),
                    });
                }
            }
        });
    });

    const handleInit = withContext(async (ctx, message: WorkerMessageWithSender<WorkerInitMessage>) =>
        (await ctx.init({ sync: message.payload.sync })).getState()
    );

    /* throttle update checks for updates every hour */
    browser.alarms.create(UPDATE_ALARM_NAME, { periodInMinutes: 60 });
    browser.alarms.onAlarm.addListener(({ name }) => name === UPDATE_ALARM_NAME && checkAvailableUpdate());

    WorkerMessageBroker.registerMessage(WorkerMessageType.WORKER_WAKEUP, handleWakeup);
    WorkerMessageBroker.registerMessage(WorkerMessageType.WORKER_INIT, handleInit);
    WorkerMessageBroker.registerMessage(WorkerMessageType.RESOLVE_TAB, (_, { tab }) => ({ tab }));

    if (ENV === 'development') {
        /* there is no way to test the update sequence locally without
         * creating a custom `update_url` server. In dev mode, trigger
         * the `handleOnUpdateAvailable` callback from the settings */
        WorkerMessageBroker.registerMessage(WorkerMessageType.UPDATE_AVAILABLE, () => {
            handleOnUpdateAvailable({ version: browser.runtime.getManifest().version });
            return true;
        });
    }

    void checkAvailableUpdate();

    return {
        boot: handleBoot,
        onInstall: handleInstall,
        onStartup: handleStartup,
        onUpdateAvailable: handleOnUpdateAvailable,
        getAvailableUpdate: () => state.updateAvailable,
    };
};

export type ActivationService = ReturnType<typeof createActivationService>;
