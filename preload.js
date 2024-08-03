const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  minimize: () => ipcRenderer.send("minimize"),
  switchMaximum: () => ipcRenderer.send("switchMaximum"),
  onChangeMaximum: (callback) =>
    ipcRenderer.on("change-maximum-state", (event, value) => callback(value)),
});
