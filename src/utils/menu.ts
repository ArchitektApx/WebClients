import { app, Menu, type MenuItemConstructorOptions } from "electron";
import { uninstallProton } from "../macos/uninstall";
import { clearStorage, isMac, isWindows, openLogFolder } from "./helpers";

interface MenuInsertProps {
    menu: MenuItemConstructorOptions[];
    key: MenuItemConstructorOptions["label"];
    otherOsEntries?: MenuItemConstructorOptions[];
    macEntries?: MenuItemConstructorOptions[];
    allOSEntries?: MenuItemConstructorOptions[];
}

const insertInMenu = ({ menu, key, otherOsEntries, macEntries, allOSEntries }: MenuInsertProps) => {
    const editIndex = menu.findIndex((item) => item.label === key);
    if (!editIndex) return;

    const submenu = menu[editIndex].submenu as MenuItemConstructorOptions[];
    if (isMac && macEntries) {
        menu[editIndex].submenu = [...submenu, ...macEntries];
    } else if (!isMac && otherOsEntries) {
        menu[editIndex].submenu = [...submenu, ...otherOsEntries];
    }

    menu[editIndex].submenu = [...submenu, ...(allOSEntries ?? [])];
};

export const setApplicationMenu = (isPackaged: boolean) => {
    if (isWindows) {
        Menu.setApplicationMenu(null);
        return;
    }

    const temp: MenuItemConstructorOptions[] = [
        {
            label: "File",
            submenu: [
                {
                    label: "Clear application data",
                    type: "normal",
                    click: () => clearStorage(true),
                },
                {
                    label: "Show logs",
                    type: "normal",
                    click: () => openLogFolder(),
                },
                {
                    role: "quit",
                },
            ],
        },
        {
            label: "Edit",
            submenu: [
                { role: "undo" },
                { role: "redo" },
                { type: "separator" },
                { role: "cut" },
                { role: "copy" },
                { role: "paste" },
                { role: "pasteAndMatchStyle", accelerator: isMac ? "Cmd+Shift+V" : "Ctrl+Shift+V" },
                { role: "selectAll" },
            ],
        },
        {
            label: "View",
            submenu: [
                { role: "reload" },
                { role: "forceReload" },
                { type: "separator" },
                { role: "resetZoom" },
                { role: "zoomIn" },
                { role: "zoomOut" },
                { type: "separator" },
                { role: "togglefullscreen" },
            ],
        },
        {
            label: "Window",
            submenu: [{ role: "minimize" }, { role: "close" }, { role: "zoom" }],
        },
    ];

    if (isMac) {
        temp.unshift({
            label: app.name,
            submenu: [
                { role: "about" },
                { type: "separator" },
                { role: "hide" },
                { role: "hideOthers" },
                { role: "unhide" },
                { type: "separator" },
                {
                    label: "Uninstall Proton Mail",
                    type: "normal",
                    click: () => uninstallProton(),
                },
                { type: "separator" },
                { role: "quit" },
            ],
        });

        if (!isPackaged) {
            const submenu = temp[0].submenu as MenuItemConstructorOptions[];
            temp[0].submenu = [...submenu, { type: "separator" }, { role: "services" }];
        }
    }

    insertInMenu({
        menu: temp,
        key: "Edit",
        otherOsEntries: [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }],
        macEntries: [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
                label: "Speech",
                submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
        ],
    });

    if (!isPackaged) {
        insertInMenu({
            menu: temp,
            key: "View",
            allOSEntries: [{ type: "separator" }, { role: "toggleDevTools" }],
        });
    }

    const menu = Menu.buildFromTemplate(temp);
    Menu.setApplicationMenu(menu);
};
