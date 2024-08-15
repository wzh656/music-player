import { ipcMain, BrowserWindow } from "electron";
import path from "node:path";
import { mainWindow } from "../settings/windows";
import searchInject from "../inject/searchInject";

export default function () {
  //搜索
  let searchWindow: BrowserWindow | null = null;
  const apiUrl = "https://www.yyssq.cn/";
  ipcMain.on(
    "search",
    async (_, keyword: string, platform: string, page: number) => {
      console.log("[search]", keyword, page);
      searchWindow = new BrowserWindow({
        width: 600,
        height: 400,
        autoHideMenuBar: true,
        show: false,
        webPreferences: {
          devTools: false, //禁用开发者工具
          preload: path.join(__dirname, "../preload/search.js"), //必须绝对路径
        },
      });
      searchWindow.loadURL(apiUrl);
      // searchWindow.webContents.openDevTools({ mode: "detach" }); // 打开开发工具

      //注入代码
      console.log(searchInject);
      searchWindow.webContents.executeJavaScript(searchInject);
      searchWindow.webContents.executeJavaScript(
        `onSearch('${keyword}', '${platform}', ${+page})`,
      );
    },
  );

  ipcMain.on("searchData", (_, data) => {
    console.log("[searchData]", data);
    mainWindow.value!.webContents.send("searchData", data); //发送搜索结果
    searchWindow!.destroy(); //关闭搜索窗口
    searchWindow = null;
  });
}
