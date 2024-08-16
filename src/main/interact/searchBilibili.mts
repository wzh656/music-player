import { ipcMain, dialog, Notification } from "electron";
import path from "node:path";
import got from "got"; //网络请求
import { iconImage } from "../loadImages.mjs"; //加载图标
import download from "../tools/download.mjs"; //下载操作
import { listAPI, videoAPI } from "../settings/api.mjs"; //API接口
import { getLocalCookies, setLocalCookies } from "../bilibili/localCookies.mjs"; //Cookies操作
import loginBilibili from "../bilibili/login.mjs"; //登录bilbili并获取Cookies
import type { listAPIData, videoAPIData } from "../bilibili/APIDataType.mjs"; //API接口类型

//cookies信息
let cookies = "";

//登录并获取cookies
async function login(message: string) {
  dialog.showMessageBox({
    type: "info",
    title: "提示",
    message:
      "尝试登录bilibili后方可进行搜索\n请登录后再关闭窗口继续\nmessage: " +
      message,
  });
  cookies = await loginBilibili(); //登录并保存cookies
  setLocalCookies(cookies); //保存cookies
}

//尝试获取视频信息
async function tryGetList(avid: number) {
  const data: listAPIData = await got(listAPI + avid, {
    headers: {
      Cookie: cookies,
    },
  }).json();
  console.log("[tryGetList]", data);
  return data;
}

//尝试获取视频链接
async function tryGetVideo(bvid: string, cid: number) {
  const data: videoAPIData = await got(
    videoAPI + "bvid=" + bvid + "&cid=" + cid,
    {
      headers: {
        Cookie: cookies,
      },
    },
  ).json();
  console.log("[tryGetVideo]", data);
  return data;
}

//获取bilibili
export default function () {
  cookies = getLocalCookies(); //获取存储的cookies

  //获取播放列表
  ipcMain.handle("searchBilibili", async (_, avid: number) => {
    let listData: listAPIData = await tryGetList(avid);
    if (listData.code != 0) {
      login(listData.message);
      listData = await tryGetList(avid); //第二次尝试
      if (listData.code != 0) {
        dialog.showMessageBox({
          type: "error",
          title: "错误",
          message: "获取失败\nmessage: " + listData.message,
        });
        return null;
      }
    }

    //成功
    const info = listData.data.View.pages.map((page) => ({
      cid: page.cid, //cid
      part: page.part, //标题
      page: page.page, //页码
      duration: page.duration, //时长
    }));
    console.log("[searchBilibili]", info);
    return info;
  });

  //下载音频
  ipcMain.handle(
    "downloadBilibili",
    async (_, bvid: string, cid: number, name: string) => {
      //选择下载路径
      const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "选择文件夹",
        properties: ["openDirectory", "createDirectory"],
      });
      if (canceled) return;

      //获取视频链接
      const videoData = await tryGetVideo(bvid, cid);
      console.log("[downloadBilibili]", videoData);

      //下载
      const downloadPath = path.resolve(filePaths[0], name + ".mp4");
      download(videoData.data.durl[0].url, downloadPath)
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
    },
  );
}
