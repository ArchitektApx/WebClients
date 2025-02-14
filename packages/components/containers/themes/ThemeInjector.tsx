import { useEffect, useLayoutEffect, useMemo } from 'react';

import { useUserSettings } from '@proton/account/userSettings/hooks';
import useApi from '@proton/components/hooks/useApi';
import { getSilentApi } from '@proton/shared/lib/api/helpers/customConfig';
import { updateTheme } from '@proton/shared/lib/api/settings';
import {
    canGetInboxDesktopInfo,
    getInboxDesktopInfo,
    hasInboxDesktopFeature,
} from '@proton/shared/lib/desktop/ipcHelpers';
import { getIsDrawerApp, postMessageToIframe } from '@proton/shared/lib/drawer/helpers';
import { DRAWER_EVENTS } from '@proton/shared/lib/drawer/interfaces';
import { isElectronMail } from '@proton/shared/lib/helpers/desktop';
import { rootFontSize } from '@proton/shared/lib/helpers/dom';
import type { ThemeSetting } from '@proton/shared/lib/themes/themes';
import { electronAppTheme as defaultElectronAppTheme, getDefaultThemeSetting } from '@proton/shared/lib/themes/themes';
import debounce from '@proton/utils/debounce';
import noop from '@proton/utils/noop';

import useDrawer from '../../hooks/drawer/useDrawer';
import { useTheme } from './ThemeProvider';

export const DrawerThemeInjector = () => {
    const { settings } = useTheme();

    const { iframeSrcMap } = useDrawer();

    useLayoutEffect(() => {
        // If apps are opened in drawer, update their theme too
        if (iframeSrcMap) {
            Object.keys(iframeSrcMap).map((app) => {
                if (getIsDrawerApp(app)) {
                    postMessageToIframe({ type: DRAWER_EVENTS.UPDATE_THEME, payload: { themeSetting: settings } }, app);
                }
            });
        }
    }, [settings]);

    return null;
};

export const ThemeInjector = () => {
    const [userSettings] = useUserSettings();
    const { addListener, settings, setThemeSetting } = useTheme();
    const api = useApi();
    const silentApi = getSilentApi(api);

    const legacyThemeType = userSettings.ThemeType;
    const legacyThemeSettings = useMemo(() => getDefaultThemeSetting(legacyThemeType), [legacyThemeType]);
    const themeSetting = userSettings.Theme && 'Mode' in userSettings.Theme ? userSettings.Theme : legacyThemeSettings;

    useLayoutEffect(() => {
        const theme = (() => {
            if (!isElectronMail) {
                return themeSetting;
            }

            if (canGetInboxDesktopInfo) {
                if (hasInboxDesktopFeature('FullTheme')) {
                    return getInboxDesktopInfo('theme');
                } else if (hasInboxDesktopFeature('ThemeSelection')) {
                    return { ...defaultElectronAppTheme, ...getInboxDesktopInfo('theme') };
                }
            }

            return defaultElectronAppTheme;
        })();

        setThemeSetting(theme);
    }, [themeSetting]);

    useEffect(() => {
        rootFontSize(true);
    }, [settings.FontSize]);

    useEffect(() => {
        const cb = debounce((settings: ThemeSetting) => {
            if (!hasInboxDesktopFeature('ThemeSelection')) {
                silentApi(updateTheme(settings)).catch(noop);
            }
        }, 500);

        const removeListener = addListener(cb);
        return () => {
            removeListener();
        };
    }, []);

    return null;
};
