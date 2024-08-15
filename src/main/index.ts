import {
  app,
  BrowserWindow,
  Menu,
  session, //会话 加载插件
  Notification, //通知
} from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import path from "node:path";
import process from "process"; //判断平台

import { icon, iconImage } from "./loadImages"; //加载图标

import { mainWindow } from "./settings/windows"; //主窗口
import { willQuit } from "./settings/willQuit"; //是否即将关闭

import initFile from "./initFile"; //初始化文件
import initTray from "./initTray"; //初始化托盘
import updateThumbnailToolbar from "./updateThumbnailToolbar"; //更新缩略图工具栏
import interact from "./interact"; //交互

/* 创建主窗口 */
function createWindow(): void {
  mainWindow.value = new BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 350,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      devTools: is.dev, //禁用开发者工具
      webSecurity: false, //关闭安全策略 允许本地加载
      preload: path.join(__dirname, "../preload/index.js"), //必须绝对路径
      sandbox: false,
    },
  });
  Menu.setApplicationMenu(null); //清空菜单
  // if (is.dev) mainWindow.value.webContents.openDevTools({ mode: "detach" }); // 打开开发工具

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.value.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.value.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  /* mainWindow.value.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  }); */

  mainWindow.value.on("ready-to-show", () => {
    mainWindow.value!.show();
    updateThumbnailToolbar(false); //初始化缩略图工具栏
  });

  //关闭事件
  mainWindow.value.on("close", (e: Electron.Event) => {
    console.log(willQuit);
    if (willQuit.value) return; //防止阻止托盘退出

    mainWindow.value!.hide();
    e.preventDefault();
    new Notification({
      title: "冈易音乐播放器",
      body: `窗口已隐藏，可在右下角托盘处退出`,
      icon: iconImage,
    }).show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
initFile(); //初始化文件
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.cxstudio.musicplayer");

  const vueDevToolsPath = path.resolve("./extensions/vue-devtools"); //必须绝对路径
  if (is.dev) await session.defaultSession.loadExtension(vueDevToolsPath);

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  interact(); //添加交互监听
  createWindow(); //创建主窗口
  initTray(); //初始化托盘

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
