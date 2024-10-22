import { ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs";
import { execFile } from "node:child_process";
// import got from "got"; //网络请求
// import ffmpeg from "ffmpeg.js"; //ffmpeg

import {
  showErrorBox, //错误弹窗
  showWarningBox, //警告弹窗
  showSuccessNotification, //成功通知
  showOpenFolderDialog, //选择文件夹
} from "../tools/message.mjs"; //通知

import { binPath } from "../settings/filePath.mjs"; //ffmpeg路径
import { listAPI, videoAPI } from "../settings/api.mjs"; //API接口
import download from "../tools/download.mjs"; //下载操作
import fileNameNormalize from "../tools/fileNameNormalize.mjs"; //文件名规范化
import { getLocalCookie, setLocalCookie } from "../bilibili/localCookie.mjs"; //Cookie操作
import loginBilibili from "../bilibili/login.mjs"; //登录bilbili并获取Cookie
import wbi from "../bilibili/wbi.mjs"; //wbi验证算法
import type { listAPIData, videoAPIData } from "../bilibili/APIDataType.mjs"; //API接口类型
// import { mainWindow } from "../settings/windows.mjs";

//cookie信息
let cookie = "";

//登录并获取cookie
async function login(message: string) {
  showWarningBox(
    "登录bilibili后关闭窗口方可继续操作\n错误信息: " + message,
    "未登录或登录已失效",
  );
  cookie = await loginBilibili(); //登录并保存cookie
  setLocalCookie(cookie); //保存cookie
}

//请求头
const headers = () => ({
  Cookie: cookie,
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
  Referer: "https://www.bilibili.com/",
});

//尝试获取视频信息
async function tryGetList(avid: number) {
  const res = await fetch(listAPI + avid, { headers: headers() });
  const data: listAPIData = await res.json();
  console.log("[tryGetList]", data);
  return data;
}

//尝试获取视频链接 需wbi验证
async function tryGetVideo(bvid: string, cid: number) {
  const query = await wbi({ bvid, cid }, cookie);
  const res = await fetch(videoAPI + query, {
    headers: headers(),
  });
  const data: videoAPIData = await res.json();
  console.log("[tryGetVideo]", data);
  return data;
}

//获取视频列表
async function getList(avid: number) {
  let listData = await tryGetList(avid); //第一次尝试
  if (listData.code != 0) {
    await login(listData.message); //登录同时更新cookie
    listData = await tryGetList(avid); //第二次尝试
    if (listData.code != 0) {
      showErrorBox(listData.message, "获取视频列表失败");
      return null;
    }
  }
  return listData;
}

//获取视频链接
async function getVideo(bvid: string, cid: number) {
  let videoData = await tryGetVideo(bvid, cid); //第一次尝试
  if (videoData.code != 0) {
    await login(videoData.message); //登录同时更新cookie
    videoData = await tryGetVideo(bvid, cid); //第二次尝试
    if (videoData.code != 0) {
      showErrorBox(videoData.message, "获取视频链接失败");
      return null;
    }
  }
  return videoData;
}

//提取为音频
function transAudio(filePath: string, audioPath: string) {
  return new Promise((resolve, reject) => {
    /* console.log(mainWindow.value);
    console.log("[transAudio] filePath:", filePath);
    mainWindow.value?.webContents.send("onTransAudio", filePath); //发送进度
    ipcMain.on("onTransAudioDone", (event, result) => {
      console.log("[onTransAudioDone]", result);
      resolve(result);
    }); */

    const ffmpegPath = path.join(binPath, "ffmpeg.exe"); //ffmpeg路径
    execFile(
      ffmpegPath,
      ["-y", "-hide_banner", "-i", filePath, "-vn", "-c:a", "copy", audioPath],
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stdout, stderr });
        } else {
          resolve(stdout);
        }
      },
    );
  });
}

//交互
export default function () {
  cookie = getLocalCookie(); //获取存储的cookie

  /* 获取播放列表 */
  ipcMain.handle("searchBilibili", async (_, avid: number) => {
    const listData = await getList(avid);
    if (!listData) return null; //失败

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

  /* 下载视频 */
  ipcMain.handle(
    "downloadVideoBilibili",
    async (_, bvid: string, cid: number, name: string) => {
      //选择下载路径
      const selectPath = await showOpenFolderDialog();
      if (!selectPath) return false;

      //获取视频链接
      const videoData = await getVideo(bvid, cid);
      if (!videoData) {
        showErrorBox(videoData, "获取视频链接失败");
        return false;
      }
      if (!videoData?.data?.durl?.[0]?.url) {
        showErrorBox(videoData, "wbi验证失败");
        return false; //wei验证失败
      }

      //下载
      name = fileNameNormalize(name); //规范化文件名
      const downloadPath = path.resolve(selectPath, name + ".mp4"); //视频路径
      console.log("[downloadVideoBilibili] downloadPath:", downloadPath);
      try {
        await download(videoData.data.durl[0].url, downloadPath, cookie); //下载视频
        showSuccessNotification(
          `${name}已下载至${downloadPath}`,
          "视频下载完成",
        );
        return true;
      } catch (err: unknown) {
        showErrorBox(err, `${name}无法下载`, "视频下载失败");
        return false;
      }
    },
  );

  /* 下载音频 */
  ipcMain.handle(
    "downloadAudioBilibili",
    async (_, bvid: string, cid: number, name: string) => {
      //选择下载路径
      const selectPath = await showOpenFolderDialog();
      if (!selectPath) return false;

      //获取视频链接
      const videoData = await getVideo(bvid, cid);
      console.log("[downloadAudioBilibili]", videoData);
      if (!videoData) {
        showErrorBox(videoData, "获取视频链接失败");
        return false;
      }
      if (!videoData?.data?.durl?.[0]?.url) {
        showErrorBox(videoData, "wbi验证失败");
        return false; //wei验证失败
      }

      //下载
      name = fileNameNormalize(name); //规范化文件名
      const downloadPath = path.resolve(selectPath, name + ".mp4"); //视频路径
      const audioPath = path.resolve(selectPath, name + ".m4a"); //音频路径
      try {
        await download(videoData.data.durl[0].url, downloadPath, cookie); //下载视频
        await transAudio(downloadPath, audioPath); //转换音频
        fs.unlinkSync(downloadPath); //删除视频
        showSuccessNotification(`${name}已下载至${audioPath}`, "音频下载完成");
        return true;
      } catch (err: unknown) {
        showErrorBox(err, `${name}无法下载`, "音频下载失败");
        return false;
      }
    },
  );

  /* 下载所有视频 */
  ipcMain.on(
    "downloadAllVideoBilibili",
    async (event, bvid: string, items: SearchDataBilibiliSimple) => {
      //选择下载路径
      const selectPath = await showOpenFolderDialog();
      if (!selectPath)
        return event.sender.send("downloadAllVideoBilibiliProgress", -1);

      for (const [index, item] of Object.entries(items)) {
        const { cid, name: rawName } = item;
        const name = fileNameNormalize(rawName); //规范化文件名

        //获取视频链接
        const videoData = await getVideo(bvid, cid);
        if (!videoData) {
          showErrorBox(videoData, `${index}-${name}: 获取视频链接失败`);
          continue;
        }
        if (!videoData?.data?.durl?.[0]?.url) {
          showErrorBox(videoData, `${index}-${name}: wbi验证失败`);
          continue; //wei验证失败
        }

        //下载
        const downloadPath = path.resolve(selectPath, name + ".mp4"); //视频路径
        console.log("[downloadAllVideoBilibili] downloadPath:", downloadPath);
        try {
          await download(videoData!.data.durl[0].url, downloadPath, cookie); //下载视频
          showSuccessNotification(
            `${name}已下载至${downloadPath}`,
            "视频下载完成",
          );
          event.sender.send("downloadAllVideoBilibiliProgress", +index + 1); //发送进度
        } catch (err: unknown) {
          showErrorBox(err, `${name}无法下载`, "视频下载失败");
        }
      }
    },
  );

  /* 下载所有音频 */
  ipcMain.on(
    "downloadAllAudioBilibili",
    async (event, bvid: string, items: SearchDataBilibiliSimple) => {
      //选择下载路径
      const selectPath = await showOpenFolderDialog();
      if (!selectPath)
        return event.sender.send("downloadAllAudioBilibiliProgress", -1);

      for (const [index, item] of Object.entries(items)) {
        const { cid, name: rawName } = item;
        const name = fileNameNormalize(rawName); //规范化文件名

        //获取音频链接
        const videoData = await getVideo(bvid, cid);
        if (!videoData) {
          showErrorBox(videoData, `${index}-${name}: 获取音频链接失败`);
          continue;
        }
        if (!videoData?.data?.durl?.[0]?.url) {
          showErrorBox(videoData, `${index}-${name}: wbi验证失败`);
          continue; //wei验证失败
        }

        //下载
        const downloadPath = path.resolve(selectPath, name + ".mp4"); //音频路径
        const audioPath = path.resolve(selectPath, name + ".m4a"); //音频路径
        console.log("[downloadAllAudioBilibili] downloadPath:", downloadPath);
        try {
          await download(videoData!.data.durl[0].url, downloadPath, cookie); //下载音频
          await transAudio(downloadPath, audioPath); //转换音频
          fs.unlinkSync(downloadPath); //删除视频
          showSuccessNotification(
            `${name}已下载至${audioPath}`,
            "音频下载完成",
          );
          event.sender.send("downloadAllAudioBilibiliProgress", +index + 1); //发送进度
        } catch (err: unknown) {
          showErrorBox(err, `${name}无法下载`, "音频下载失败");
        }
      }
    },
  );
}
