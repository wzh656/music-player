import windowInteract from "./window.mjs"; //窗口交互
import songlistsInteract from "./songLists.mjs"; //歌单交互
import songInteract from "./song.mjs"; //歌曲交互
import downloadInteract from "./download.mjs"; //下载交互
import openExternalInteract from "./openExternal.mjs"; //打开外部链接交互
import searchInteract from "./search.mjs"; //搜索交互
import searchBilibiliInteract from "./searchBilibili.mjs"; //搜索B站交互
import browseInteract from "./browse.mjs"; //浏览文件交互

/* 添加事件交互 */
export default function () {
  windowInteract(); //窗口交互
  songlistsInteract(); //歌单交互
  songInteract(); //歌曲交互
  downloadInteract(); //下载交互
  openExternalInteract(); //打开外部链接交互
  searchInteract(); //搜索交互
  searchBilibiliInteract(); //搜索B站交互
  browseInteract(); //浏览文件交互
}
