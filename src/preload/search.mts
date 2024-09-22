import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  /*主进程 -> Search窗口*/
  onSearch: (callback: () => void) => ipcRenderer.on("search", callback),
  searchData: (data: SearchData) => ipcRenderer.send("searchData", data),
});
