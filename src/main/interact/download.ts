import { ipcMain, Notification, dialog } from "electron";
import fs from "node:fs";
import path from "node:path";
import request from "request";
import { iconImage } from "../loadImages";

export default function () {
  //下载文件
  ipcMain.on("downloadFile", async (_, url: string, name: string) => {
    console.log("[downloadFile]", url, name);
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "请选择下载路径",
      properties: ["openDirectory", "createDirectory"],
    });
    if (canceled) return; //取消下载
    const selectPath = filePaths[0];
    const downloadPath = path.resolve(selectPath, name);

    const process = fs.createWriteStream(downloadPath);
    request({
      url,
      timeout: 10000,
    }).pipe(process);
    process.on("finish", () => {
      console.log("[downloadFile] finish", downloadPath);
      new Notification({
        title: "下载完成",
        body: `${name}已下载至${downloadPath}`,
        icon: iconImage,
      }).show();
    });
    process.on("error", (err) => {
      console.log("[downloadFile] error", downloadPath, err);
      new Notification({
        title: "下载失败",
        body: `${name}无法下载\n错误类型:${err.name}\n错误信息:${err.message}`,
        icon: iconImage,
      }).show();
    });
  });

  //下载文本文件
  ipcMain.on("downloadText", async (_, text: string, name: string) => {
    console.log("[downloadText]", name);
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "请选择下载路径",
      properties: ["openDirectory", "createDirectory"],
    });
    if (canceled) return; //取消下载
    const path = filePaths[0];
    const downloadPath = path + "/" + name;

    fs.writeFileSync(downloadPath, text); //写入文件

    new Notification({
      title: "下载完成",
      body: `${name}已下载至${downloadPath}`,
      icon: iconImage,
    }).show();
  });
}
