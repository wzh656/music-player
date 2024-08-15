import { BrowserWindow, dialog, session } from "electron";
import bilibiliInject from "../inject/bilibiliInject"; //注入代码 string

let loginWindow: BrowserWindow | null = null;
const url = "https://www.bilibili.com/";

export default function () {
  return new Promise((resolve) => {
    console.log("[LoginBilibili]");

    dialog.showMessageBox({
      type: "info",
      title: "提示",
      message: "登录bilibili后方可进行搜索\n请登录后再关闭窗口继续",
    });

    loginWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      autoHideMenuBar: true,
      webPreferences: {
        devTools: false, //禁用开发者工具
        // preload: path.join(__dirname, "../preload/search.js"), //必须绝对路径
      },
    });
    loginWindow.loadURL(url);

    //注入代码
    console.log(bilibiliInject);
    loginWindow.webContents.executeJavaScript(bilibiliInject);

    //关闭时获取Cookies
    loginWindow.on("close", async () => {
      const cookies = await session.defaultSession.cookies.get({ url });
      const str = cookies
        .map((cookie) => cookie.name + "=" + cookie.value)
        .join("; ");
      console.log("[cookies]", str);
      resolve(str);
    });
  });
}
