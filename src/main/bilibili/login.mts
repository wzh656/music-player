import { BrowserWindow, session } from "electron";
import bilibiliInject from "../inject/bilibiliInject.mjs"; //注入代码 string
import { bilibiliWindow } from "../settings/windows.mjs";

const url = "https://www.bilibili.com/";

/* 登录并获取Cookie */
export default async function (): Promise<string> {
  return new Promise((resolve) => {
    console.log("[LoginBilibili]");

    //保证摧毁上次窗口
    if (bilibiliWindow.value) bilibiliWindow.value.destroy();

    //创建登录窗口
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

    //关闭时获取Cookie
    bilibiliWindow.value.on("close", async () => {
      const cookie = await session.defaultSession.cookies.get({ url });
      const str = cookie
        .map((cookie) => cookie.name + "=" + cookie.value)
        .join("; ");
      console.log("[cookie]", str);
      resolve(str);
    });
  });
}
