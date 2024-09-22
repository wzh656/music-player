import { app } from "electron";
import path from "node:path";

export const userdataPath = app.getPath("userData"); //用户数据文件夹路径
export const songListsPath = path.resolve(userdataPath, "songList.json"); //歌单文件路径
export const cookiePath = path.resolve(userdataPath, "cookie.dat"); //cookie文件路径

export const binPath = path.resolve(__dirname, "../../bin"); //二进制程序路径

export const extensionsPath = path.resolve(__dirname, "../../extensions"); //插件路径
export const vueExtensionsPath = path.resolve(extensionsPath, "vue-devtools"); //vue-devtools路径

console.log("[userdataPath]", userdataPath);
console.log("[binPath]", binPath);
