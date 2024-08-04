const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  minimize: () => ipcRenderer.send("minimize"),
  switchMaximum: () => ipcRenderer.send("switchMaximum"),
  onChangeMaximum: (callback) =>
    ipcRenderer.on("changeMaximumState", (event, value) => callback(value)),
  getSongList: () => ipcRenderer.invoke("getSongList"),
});
