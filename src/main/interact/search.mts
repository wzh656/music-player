import { ipcMain, BrowserWindow } from "electron";
import path from "node:path";
import { searchWindow } from "../settings/windows.mjs";
import { MusicPlatform } from "../settings/MusicPlatform.mjs";
import { searchAPI } from "../settings/api.mjs";
import searchInject from "../inject/searchInject.mjs";

function search(keyword: string, platform: MusicPlatform, page: number) {
  return new Promise((resolve) => {
    console.log("[search]", keyword, platform, page);
    const apiUrl: string = searchAPI[platform];

    //保证摧毁上次的窗口
    if (searchWindow.value) searchWindow.value.destroy();

    //创建搜索窗口
    console.log(path.join(__dirname, "../preload/search.mjs"));
    searchWindow.value = new BrowserWindow({
      width: 600,
      height: 400,
      autoHideMenuBar: true,
      show: false,
      webPreferences: {
        devTools: false, //禁用开发者工具
        preload: path.join(__dirname, "../preload/search.mjs"), //必须绝对路径
        sandbox: false, //关闭沙盒模式才能使用preload
      },
    });
    searchWindow.value.loadURL(apiUrl);
    // searchWindow.value.webContents.openDevTools({ mode: "detach" }); // 打开开发工具

    //注入代码
    // console.log(searchInject);
    searchWindow.value.webContents.executeJavaScript(searchInject);
    searchWindow.value.webContents.executeJavaScript(
      `onSearch('${apiUrl}', '${keyword}', '${platform}', ${page})`,
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
    async (_, keyword: string, platform: MusicPlatform, page: number) => {
      return await search(keyword, platform, page);
    },
  );
}
