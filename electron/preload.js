import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  loadConfig: () => ipcRenderer.invoke("load-config"),
  watchLogs: (logFolder, filters) => ipcRenderer.invoke("watch-logs", logFolder, filters),
  onNewLogs: (callback) => ipcRenderer.on("new-logs", (event, data) => callback(data))
});
