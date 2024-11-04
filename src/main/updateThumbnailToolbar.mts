/* 初始化缩略图工具栏 */
import { lastImage, pauseImage, playImage, nextImage } from "./loadImages.mjs"; // 图片资源
import { mainWindow } from "./settings/windows.mjs"; // 主窗口
import { playState } from "./settings/playState.mjs"; // 播放状态

// let currentPlayState = false;

export default function () {
  // currentPlayState = playState ?? currentPlayState;

  mainWindow.value!.setThumbarButtons([
    {
      tooltip: "上一首",
      icon: lastImage,
      click() {
        mainWindow.value!.webContents.send("last");
      },
    },
    playState.value
      ? {
          tooltip: "暂停",
          icon: pauseImage,
          click() {
            mainWindow.value!.webContents.send("pause");
          },
        }
      : {
          tooltip: "播放",
          icon: playImage,
          click() {
            mainWindow.value!.webContents.send("play");
          },
        },
    {
      tooltip: "下一首",
      icon: nextImage,
      click() {
        mainWindow.value!.webContents.send("next");
      },
    },
  ]);
}
