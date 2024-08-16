import { ipcMain, BrowserWindow } from "electron";
import path from "node:path";
import { searchWindow } from "../settings/windows.mjs";
import { searchAPI } from "../settings/api.mjs";
import searchInject from "../inject/searchInject.mjs";

function search(keyword: string, platform: string, page: number) {
  return new Promise((resolve) => {
    console.log("[search]", keyword, page);

    //创建窗口
    searchWindow.value = new BrowserWindow({
      width: 600,
      height: 400,
      autoHideMenuBar: true,
      show: false,
      webPreferences: {
        devTools: false, //禁用开发者工具
        preload: path.join(__dirname, "../preload/search.js"), //必须绝对路径
      },
    });
    searchWindow.value.loadURL(searchAPI);
    // searchWindow.value.webContents.openDevTools({ mode: "detach" }); // 打开开发工具

    //注入代码
    console.log(searchInject);
    searchWindow.value.webContents.executeJavaScript(searchInject);
    searchWindow.value.webContents.executeJavaScript(
      `onSearch('${keyword}', '${platform}', ${+page})`,
    );

    //返回数据
    ipcMain.on("searchData", (_, data) => {
      console.log("[searchData]", data);
      //mainWindow.value!.webContents.send("searchData", data); //发送搜索结果
      if (searchWindow.value) {
        searchWindow.value!.destroy(); //关闭搜索窗口
        searchWindow.value = null;
      }
      resolve(data); //返回数据
    });
  });
}

export default function () {
  //搜索
  ipcMain.handle(
    "search",
    async (_, keyword: string, platform: string, page: number) => {
      return await search(keyword, platform, page);
    },
  );
}
