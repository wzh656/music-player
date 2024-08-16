/* 创建托盘 */
import { app, Menu, Tray } from "electron";
import { iconImage } from "./loadImages.mjs"; //加载图标
import { mainWindow } from "./settings/windows.mjs"; //主窗口
import { willQuit } from "./settings/willQuit.mjs"; //是否即将关闭应用

export default function () {
  const tray = new Tray(iconImage);
  const contextMenu = Menu.buildFromTemplate([
    { label: "打开应用", click: () => mainWindow.value!.show() },
    {
      label: "退出应用",
      click: () => {
        willQuit.value = true; //防止阻止关闭
        app.quit();
      },
    },
  ]);

  tray.on("click", () => {
    mainWindow.value!.show();
  });

  tray.setToolTip("冈易音乐播放器"); //悬浮提示
  tray.setContextMenu(contextMenu);
}
