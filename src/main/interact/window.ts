import { BrowserWindow, ipcMain } from "electron";

export default function () {
  //最小化窗口
  ipcMain.on("minimize", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents); //获取发出事件的窗口
    win!.minimize();
  });

  //切换最大化
  ipcMain.on("switchMaximum", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents); //获取发出事件的窗口
    win!.isMaximized() ? win!.unmaximize() : win!.maximize();
  });
}
