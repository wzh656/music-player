/* 初始化缩略图工具栏 */
import { mainWindow } from "./settings/windows";
import { lastImage, pauseImage, playImage, nextImage } from "./loadImages";

export default function (playState: boolean) {
  mainWindow.value!.setThumbarButtons([
    {
      tooltip: "上一首",
      icon: lastImage,
      click() {
        mainWindow.value!.webContents.send("last");
      },
    },
    playState
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
