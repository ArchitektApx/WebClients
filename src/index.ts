import { BrowserWindow, Notification, app, session, shell } from "electron";
import log from "electron-log/main";
import { moveUninstaller } from "./macos/uninstall";
import { saveAppID } from "./store/idStore";
import { saveAppURL } from "./store/urlStore";
import { checkForUpdates } from "./update";
import { ALLOWED_PERMISSIONS, PARTITION } from "./utils/constants";
import {
    clearStorage,
    isAccoutLite,
    isHostAccount,
    isHostAllowed,
    isHostCalendar,
    isHostMail,
    isLogginOut,
    isMac,
    isUpsellURL,
    isWindows,
    saveWindowsPosition,
} from "./utils/helpers";
import { getSessionID, handleMailToUrls } from "./utils/urlHelpers";
import {
    handleCalendarWindow,
    handleMailWindow,
    initialWindowCreation,
    refreshCalendarPage,
} from "./utils/windowManagement";

if (require("electron-squirrel-startup")) {
    app.quit();
}

// Security addition
app.enableSandbox();

// Config initialization
saveAppURL();
saveAppID();

// Log initialization
log.initialize({ preload: true });
log.info("App start on mac:", isMac, "is windows: ", isWindows);

// Move uninstaller on macOS
moveUninstaller();

// Used to make the app run on Parallels Desktop
// app.commandLine.appendSwitch("no-sandbox");

// Detects if the application is default handler for mailto, works on macOS for now
if (app.isDefaultProtocolClient("mailto")) {
    log.info("App is default mailto client");
} else {
    log.info("App is not default mailto client");
}

app.whenReady().then(() => {
    const secureSession = session.fromPartition(PARTITION, {
        cache: false,
    });

    initialWindowCreation({ session: secureSession, mailVisible: true, calendarVisible: false });

    // Check updates
    checkForUpdates();

    // Trigger blank notification to force presence in settings
    new Notification();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().filter((windows) => windows.isVisible()).length === 0) {
            log.info("Activate app, all windows hidden");
            const window = BrowserWindow.getAllWindows()[0];
            handleMailWindow(window.webContents);
        }
    });

    // Normally this only works on macOS and is not required for Windows
    app.on("open-url", (e, url) => {
        log.info("Opening url", url);
        handleMailToUrls(url);
    });

    // Security addition, reject all permissions except notifications
    secureSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
        const { host, protocol } = new URL(_webContents.getURL());
        if (!isHostAllowed(host, app.isPackaged) || protocol !== "https:") {
            return callback(false);
        }

        if (ALLOWED_PERMISSIONS.includes(_permission)) {
            log.info("Permission request accepted", _permission, host);
            return callback(true);
        }

        log.info("Permission request rejected", _permission, host);
        callback(false);
    });
});

// Only used on macOS to save the windows position when CMD+Q is used
app.on("before-quit", () => {
    if (isMac) {
        saveWindowsPosition(true);
    }
});

// Security addition
app.on("web-contents-created", (_ev, contents) => {
    const preventDefault = (ev: Electron.Event) => {
        ev.preventDefault();
    };

    contents.on("did-navigate-in-page", (ev, url) => {
        if (!isHostAllowed(url, app.isPackaged)) {
            return preventDefault(ev);
        }

        const sessionID = getSessionID(url);
        if (isHostMail(url) && sessionID && !isNaN(sessionID as unknown as any)) {
            log.info("Refresh calendar session", sessionID);
            refreshCalendarPage(+sessionID);
        }
    });

    contents.on("will-attach-webview", preventDefault);

    contents.on("will-navigate", (details) => {
        if (isLogginOut(details.url)) {
            log.info("User is login out, clearing application data");
            // We add a small timeout to let the logout process finish
            clearStorage(true, 500);
            return details;
        }

        if (!isHostAllowed(details.url, app.isPackaged)) {
            return preventDefault(details);
        }

        return details;
    });

    contents.setWindowOpenHandler((details) => {
        const { url } = details;

        if (isHostCalendar(url)) {
            log.info("Open calendar window");
            handleCalendarWindow(contents);
            return { action: "deny" };
        }

        if (isHostMail(url)) {
            log.info("Open mail window");
            handleMailWindow(contents);
            return { action: "deny" };
        }

        if (isHostAccount(url)) {
            // Upsell links should be opened in browser to avoid 3D secure issues
            log.info("Account link");
            if (isAccoutLite(url) || isUpsellURL(url)) {
                log.info("Upsell link or lite account, open in browser", url);
                shell.openExternal(url);
                return { action: "deny" };
            }
            return { action: "allow" };
        } else if (isHostAllowed(url, app.isPackaged)) {
            log.info("Open internal link", url);
            return { action: "allow" };
        } else {
            log.info("Open external link", url);
            shell.openExternal(url);
        }

        return { action: "deny" };
    });
});
