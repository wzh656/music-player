const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  minimize: () => ipcRenderer.send("minimize"), //最小化
  switchMaximum: () => ipcRenderer.send("switchMaximum"), //切换最大化
  onChangeMaximum: (callback) =>
    ipcRenderer.on("changeMaximumState", (event, value) => callback(value)), //监听最大化状态改变
  getSongLists: () => ipcRenderer.invoke("getSongLists"), //获取歌单列表
  getSongListSongs: (name) => ipcRenderer.invoke("getSongListSongs", name), //获取歌单歌曲
});
