import { ipcMain, shell } from "electron";

export default function () {
  //打开外部链接
  ipcMain.on("openUrl", async (_, url) => {
    console.log("[openUrl]", url);
    shell.openExternal(url);
  });
}
