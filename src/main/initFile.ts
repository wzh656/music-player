/* 初始化文件 */
import fs from "node:fs";
import path from "node:path";
import { songListsPath } from "./settings/filePath"; //文件路径

export default function () {
  if (!fs.existsSync(path.dirname(songListsPath)))
    fs.mkdirSync(path.dirname(songListsPath));

  if (!fs.existsSync(songListsPath))
    fs.writeFileSync(songListsPath, JSON.stringify([]));
}
