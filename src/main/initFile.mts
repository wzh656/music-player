/* 初始化文件 */
import fs from "node:fs";
import {
  userdataPath,
  songListsPath,
  cookiesPath,
} from "./settings/filePath.mjs"; //文件路径

export default function () {
  //用户数据文件夹
  if (!fs.existsSync(userdataPath)) fs.mkdirSync(userdataPath);

  //歌单列表文件
  if (!fs.existsSync(songListsPath))
    fs.writeFileSync(songListsPath, JSON.stringify([]));

  //cookie文件
  if (!fs.existsSync(cookiesPath)) fs.writeFileSync(cookiesPath, "");
}
