import { contextBridge, ipcRenderer } from "electron";
import { IPCMessagePayload, IPCMessageType } from "./ipc/ipcConstants";

contextBridge.exposeInMainWorld("ipcInboxMessageBroker", {
    send: <T extends IPCMessageType>(type: IPCMessageType, payload: IPCMessagePayload<T>) => {
        if (type === "updateNotification") {
            ipcRenderer.send("updateNotification", payload);
        }
    },
});
