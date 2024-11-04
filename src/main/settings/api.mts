import { MusicPlatform } from "./MusicPlatform.mjs";

/* interface SearchAPIList {
  [key in MusicPlatform]: string;
} */

//音乐搜索API
export const searchAPI = {
  [MusicPlatform.WY]: "https://www.yyssq.cn/",
  [MusicPlatform.QQ]: "https://music.90svip.cn/",
};

//B站视频信息API
export const listAPI =
  "https://api.bilibili.com/x/web-interface/wbi/view/detail?aid=";

//B站获取视频API
export const videoAPI = "https://api.bilibili.com/x/player/wbi/playurl?";
