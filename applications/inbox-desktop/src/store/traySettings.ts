import Store from "electron-store";

export interface TraySettings {
    closeToTray: boolean;
}

const store = new Store<{ traySettings: TraySettings }>({
    configFileMode: 0o600,
});

const defaultTraySettings = {
    closeToTray: true,
};

export const updateTraySettings = (traySettings: Partial<TraySettings>) => {
    const oldTraySettings = getTraySettings();
    const traySettingsChanged = Array.from(Object.keys(traySettings) as Array<keyof TraySettings>).some(
        (key) => traySettings[key] !== oldTraySettings[key],
    );

    if (!traySettingsChanged) {
        return;
    }

    store.set("traySettings", { ...oldTraySettings, ...traySettings });
};

export const getTraySettings = (): TraySettings => {
    const traySettings = store.get("traySettings");
    if (traySettings) {
        return traySettings;
    }

    store.set("traySettings", defaultTraySettings);
    return defaultTraySettings;
};

export const clearTraySettings = () => {
    store.delete("traySettings");
};
