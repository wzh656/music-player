import { ipcMain } from "electron";
import fs from "node:fs";
import updateThumbnailToolbar from "../updateThumbnailToolbar"; //更新缩略图工具栏
import * as parser from "music-metadata"; //解析音乐信息

export default function () {
  //获取详细信息
  ipcMain.handle("getDetails", async (_, path: string) => {
    const metadata = await parser.parseFile(path);
    console.log("[getDetails]", path, metadata);
    return {
      artist: metadata.common.artist,
      title: metadata.common.title,
      picture: metadata.common.picture,
    };
  });

  //获取歌词
  ipcMain.handle("getLyrics", async (_, path: string) => {
    const lyricsPath = path.slice(0, -4) + ".lrc";
    console.log("[getLyrics]", lyricsPath);
    if (!fs.existsSync(lyricsPath)) return null; //不存在歌词文件
    return fs.readFileSync(lyricsPath).toString();
  });

  //更新播放状态
  ipcMain.on("updatePlayState", (_, playState: boolean) => {
    updateThumbnailToolbar(playState);
  });
}
