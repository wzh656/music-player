import { ipcMain, Notification, dialog } from "electron";
import fs from "node:fs";
import path from "node:path";
import { iconImage } from "../loadImages.mjs"; //加载图标
import download from "../tools/download.mjs"; //下载操作
import fileNameNormalize from "../tools/fileNameNormalize.mjs"; //文件名规范化

export default function () {
  //下载文件
  ipcMain.on("downloadFile", async (_, url: string, name: string) => {
    name = fileNameNormalize(name); //文件名规范化
    console.log("[downloadFile]", url, name);

    //选择路径
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "请选择下载路径",
      properties: ["openDirectory", "createDirectory"],
    });
    if (canceled) return; //取消下载
    const dirPath = filePaths[0];
    const downloadPath = path.resolve(dirPath, name);

    download(url, downloadPath)
      .then(() => {
        new Notification({
          title: "下载完成",
          body: `${name}已下载至${downloadPath}`,
          icon: iconImage,
        }).show();
      })
      .catch((err) => {
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

    //选择路径
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "请选择下载路径",
      properties: ["openDirectory", "createDirectory"],
    });
    if (canceled) return; //取消下载
    const dirPath = filePaths[0];
    const downloadPath = path.resolve(dirPath, name);

    fs.writeFileSync(downloadPath, text); //写入文件

    new Notification({
      title: "下载完成",
      body: `${name}已下载至${downloadPath}`,
      icon: iconImage,
    }).show();
  });
}
