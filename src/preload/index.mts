import { contextBridge, ipcRenderer } from "electron";
import { MusicPlatform } from "../main/settings/MusicPlatform.mjs";

contextBridge.exposeInMainWorld("electron", {
  /* 窗口操作 */
  minimize: () => ipcRenderer.send("minimize"), //最小化
  switchMaximum: () => ipcRenderer.send("switchMaximum"), //切换最大化
  onChangeMaximum: (callback: (value: boolean) => void) =>
    ipcRenderer.on("changeMaximumState", (event: unknown, value: boolean) =>
      callback(value),
    ), //监听最大化状态改变

  /* 歌单歌词文件操作 */
  getSongLists: () => ipcRenderer.invoke("getSongLists"), //获取歌单列表
  onPlaySongList: (callback: (index: number) => void) =>
    ipcRenderer.on("playSongList", (event: unknown, index: number) =>
      callback(index),
    ), //监听播放歌单
  updateSongLists: (songListsStr: string) =>
    ipcRenderer.send("updateSongLists", songListsStr), //更新歌单列表
  getSongListSongs: (name: string) =>
    ipcRenderer.invoke("getSongListSongs", name), //获取歌单歌曲
  getSongListArtists: (name: string) =>
    ipcRenderer.invoke("getSongListArtists", name), //获取歌单歌手
  getLyrics: (path: string) => ipcRenderer.invoke("getLyrics", path), //获取歌词
  getArtist: (path: string) => ipcRenderer.invoke("getArtist", path), //获取歌手

  /* 播放操作 */
  onPlay: (callback: () => void) => ipcRenderer.on("play", () => callback()), //播放
  onPause: (callback: () => void) => ipcRenderer.on("pause", () => callback()), //暂停
  onLast: (callback: () => void) => ipcRenderer.on("last", () => callback()), //上一首
  onNext: (callback: () => void) => ipcRenderer.on("next", () => callback()), //下一首
  updatePlayState: (playState: boolean) =>
    ipcRenderer.send("updatePlayState", playState), //更新播放状态

  /* 下载操作 */
  downloadFile: (url: string, name: string) =>
    ipcRenderer.send("downloadFile", url, name), //下载文件
  downloadText: (text: string, name: string) =>
    ipcRenderer.send("downloadText", text, name), //下载文本文件

  /* 打开链接操作 */
  openUrl: (url: string) => ipcRenderer.send("openUrl", url), //浏览器打开链接

  /* 搜索操作 */
  search: (keyword: string, platform: MusicPlatform, page: number) =>
    ipcRenderer.invoke("search", keyword, platform, page), //搜索
  /* onSearchData: (callback: (data: SearchData) => void) =>
    ipcRenderer.on("searchData", (event, data: SearchData) => callback(data)), //监听搜索结果 */

  /* Bilibili搜索操作 */
  searchBilibili: (avid: number) => ipcRenderer.invoke("searchBilibili", avid), //搜索
  downloadAudioBilibili: (bvid: string, cid: number, name: string) =>
    ipcRenderer.invoke("downloadAudioBilibili", bvid, cid, name), //下载音频
  downloadVideoBilibili: (bvid: string, cid: number, name: string) =>
    ipcRenderer.invoke("downloadVideoBilibili", bvid, cid, name), //下载视频
  downloadAllAudioBilibili: (bvid: string, items: SearchDataBilibiliSimple) =>
    ipcRenderer.send("downloadAllAudioBilibili", bvid, items), //下载所有音频
  downloadAllVideoBilibili: (bvid: string, items: SearchDataBilibiliSimple) =>
    ipcRenderer.send("downloadAllVideoBilibili", bvid, items), //下载所有视频
  downloadAllAudioBilibiliProgress: (callback: (progress: number) => void) =>
    ipcRenderer.on(
      "downloadAllAudioBilibiliProgress",
      (event, progress: number) => callback(progress),
    ), //监听音频下载进度
  downloadAllVideoBilibiliProgress: (callback: (progress: number) => void) =>
    ipcRenderer.on(
      "downloadAllVideoBilibiliProgress",
      (event, progress: number) => callback(progress),
    ), //监听视频下载进度

  /* 音频转换操作 */
  onTransAudio: (callback: (filePath: string) => void) =>
    ipcRenderer.on("onTransAudio", (event, filePath: string) =>
      callback(filePath),
    ), //转换音频
  onTransAudioDone: () => ipcRenderer.send("onTransAudioDone"), //转换音频完成

  /* 选择路径操作 */
  browseFiles: (path: string) => ipcRenderer.invoke("browseFiles", path), //浏览路径
  browseDir: (path: string) => ipcRenderer.invoke("browseDir", path), //浏览路径
});
