import { app, Tray, Menu, nativeImage } from "electron";
import { getMainWindow } from "../view/viewManagement";
import { isLinux, isMac } from "../helpers";
import { join } from "path";
import { macOSExitEvent, windowsAndLinuxExitEvent } from "../view/windowClose";
import { getTraySettings, updateTraySettings } from "../../store/traySettings";

export const createTrayIcon = () => {
    const ASSET_PATH = app.isPackaged ? process.resourcesPath : app.getAppPath();
    const trayIconName = isMac || isLinux ? "icon.png" : "icon.ico";
    const trayIconPath = join(ASSET_PATH, trayIconName);
    const trayIcon = nativeImage.createFromPath(trayIconPath);
    const tray = new Tray(trayIcon);

    const template: Electron.MenuItemConstructorOptions[] = [
        {
            label: "Show Window",
            type: "checkbox",
        },
        {
            label: "Quit",
            type: "normal",
        },
        {
            label: "Close to tray",
            type: "checkbox",
        },
    ];
    const contextMenu = Menu.buildFromTemplate(template);
    const mainWindow = getMainWindow();

    contextMenu.items[0].checked = getMainWindow().isVisible();
    contextMenu.items[0].click = () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        contextMenu.items[0].checked = mainWindow.isVisible();
        // force update the context menu to reflect the change
        tray.setContextMenu(contextMenu);
    };

    contextMenu.items[1].click = () => {
        isMac ? macOSExitEvent(mainWindow) : windowsAndLinuxExitEvent(mainWindow);
    };

    contextMenu.items[2].checked = getTraySettings().closeToTray;
    contextMenu.items[2].click = () => {
        contextMenu.items[2].checked = !contextMenu.items[2].checked;
        updateTraySettings({ closeToTray: contextMenu.items[2].checked });
        tray.setContextMenu(contextMenu);
    };

    tray.setContextMenu(contextMenu);
    return tray;
};
