import { ipcMain } from "electron";
import loginBilibili from "../bilibili/login";

//获取bilibili
const listAPI = "https://api.bilibili.com/x/web-interface/wbi/view/detail?aid=";
const videoAPI = "https://api.bilibili.com/x/player/wbi/playurl?bvid=&cid=";
let cookiesStr: string = "";
export default function () {
  ipcMain.on("searchBilibili", async (_, avid: number) => {
    let listData;

    const response = await fetch(listAPI + avid);
    listData = await response.json();
    console.log("[searchBilibili]", listData);
    if (listData.code != 0) {
      cookiesStr = await loginBilibili();
    }
  });
}
