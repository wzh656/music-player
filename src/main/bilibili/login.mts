import { BrowserWindow, session } from "electron";
import bilibiliInject from "../inject/bilibiliInject.mjs"; //注入代码 string
import { bilibiliWindow } from "../settings/windows.mjs";

const url = "https://www.bilibili.com/";

/* 登录并获取Cookies */
export default async function (): Promise<string> {
  return new Promise((resolve) => {
    console.log("[LoginBilibili]");

    bilibiliWindow.value = new BrowserWindow({
      width: 1920,
      height: 1080,
      autoHideMenuBar: true,
      webPreferences: {
        devTools: false, //禁用开发者工具
        // preload: path.join(__dirname, "../preload/search.js"), //必须绝对路径
      },
    });
    bilibiliWindow.value.loadURL(url);

    //注入代码
    console.log(bilibiliInject);
    bilibiliWindow.value.webContents.executeJavaScript(bilibiliInject);

    //关闭时获取Cookies
    bilibiliWindow.value.on("close", async () => {
      const cookies = await session.defaultSession.cookies.get({ url });
      const str = cookies
        .map((cookie) => cookie.name + "=" + cookie.value)
        .join("; ");
      console.log("[cookies]", str);
      resolve(str);
    });
  });
}
