const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  onSearch: (callback) => ipcRenderer.on("search", callback),
  searchData: (data) => ipcRenderer.send("searchData", data),
});
