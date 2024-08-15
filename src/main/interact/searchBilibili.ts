import { ipcMain, dialog } from "electron";
import loginBilibili from "../bilibili/login"; //登录bilbili并获取Cookies
import { listAPI } from "../settings/api"; //API接口
import { getLocalCookies, setLocalCookies } from "../bilibili/localCookies";
import type { listAPIData } from "../bilibili/APIDataType"; //API接口类型

//cookies信息
let cookies = "";

//尝试获取视频信息
async function tryGetList(avid: number) {
  const response = await fetch(listAPI + avid, {
    headers: {
      Cookie: cookies,
    },
  });
  const listData = await response.json();
  console.log("[searchBilibili]", listData);
  return listData as listAPIData;
}

//获取bilibili
export default function () {
  cookies = getLocalCookies(); //获取存储的cookies

  ipcMain.handle("searchBilibili", async (_, avid: number) => {
    //获取播放列表
    let listData: listAPIData = await tryGetList(avid);
    if (listData.code != 0) {
      dialog.showMessageBox({
        type: "info",
        title: "提示",
        message:
          "尝试登录bilibili后方可进行搜索\n请登录后再关闭窗口继续\nmessage: " +
          listData.message,
      });

      cookies = await loginBilibili(); //登录并保存cookies
      setLocalCookies(cookies); //保存cookies

      listData = await tryGetList(avid); //第二次尝试
      if (listData.code != 0) {
        dialog.showMessageBox({
          title: "错误",
          type: "error",
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
    return info;
  });
}
