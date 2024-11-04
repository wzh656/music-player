import {
  app,
  BrowserWindow,
  Menu,
  session, // 会话 加载插件
  Notification, // 通知
} from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import path from "node:path";
import process from "process"; // 判断平台

import { icon, iconImage } from "./loadImages.mjs"; // 加载图标
import { vueExtensionsPath } from "./settings/filePath.mjs"; // 路径

import { mainWindow } from "./settings/windows.mjs"; // 主窗口
import { willQuit } from "./settings/willQuit.mjs"; // 是否即将关闭
import { playState } from "./settings/playState.mjs"; // 播放状态

import { showErrorBox } from "./tools/message.mjs"; // 错误提示框
import initFile from "./initFile.mjs"; // 初始化文件
import initTray from "./initTray.mjs"; // 初始化托盘
import updateThumbnailToolbar from "./updateThumbnailToolbar.mjs"; // 更新缩略图工具栏
import interact from "./interact/index.mjs"; // 交互

/* 创建主窗口 */
function createWindow(): void {
  mainWindow.value = new BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 350,
    maxWidth: 500,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      devTools: is.dev, //禁用开发者工具
      webSecurity: false, //关闭安全策略 允许本地加载
      preload: path.resolve(__dirname, "../preload/index.mjs"), //必须绝对路径
      sandbox: false, //关闭沙盒模式才能使用preload
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
    updateThumbnailToolbar(); // 初始化缩略图工具栏
  });

  //关闭事件
  mainWindow.value.on("close", (e: Electron.Event) => {
    console.log(willQuit);
    if (willQuit.value) return; // 防止阻止托盘退出

    mainWindow.value!.hide();
    e.preventDefault(); // 阻止窗口关闭
    if (playState.value) return; // 正在播放时不提示
    new Notification({
      title: "冈易音乐播放器",
      body: `窗口已隐藏，可在右下角托盘处退出`,
      icon: iconImage,
    }).show();
  });
}

/* 判断是否多开 */
interface AdditionalData {
  args: string[];
}
const additionalData: AdditionalData = { args: process.argv.slice(1) };
const gotTheLock = app.requestSingleInstanceLock(additionalData);
if (!gotTheLock) {
  // 第二个实例运行 退出
  console.log("Another instance is already running, quitting.");
  app.quit();
} else {
  // 第一个实例运行 监听第二个实例传过来的参数
  app.on(
    "second-instance",
    (event, commandLine, workingDirectory, additionalData) => {
      // additionalData: 从第二个实例中接收到的数据
      console.log("[second-instance]", additionalData);

      if (!mainWindow.value) return;

      // 是否有意图播放歌单
      let isIntentToPlaySongList = false;
      if (additionalData) {
        const data = additionalData as AdditionalData;
        for (let i = 0; i < data.args.length; i++)
          if (data.args[i] == "--play-song-list") {
            const index = +data.args[i + 1];
            if (isNaN(index)) {
              showErrorBox(data.args[i + 1], "歌单ID必须为数字", "错误");
              return;
            }
            mainWindow.value.webContents.send("playSongList", index); //播放歌单
            isIntentToPlaySongList = true;
            break;
          }
      }

      // 有人试图运行第二个实例，我们应该关注我们的窗口
      if (isIntentToPlaySongList) return; // 播放歌单无需显示窗口
      mainWindow.value.show(); //显示窗口
      if (mainWindow.value.isMinimized()) mainWindow.value.restore(); //恢复窗口
      mainWindow.value.focus(); //聚焦窗口
    },
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
initFile(); //初始化文件
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.cxstudio.musicplayer");

  //加载插件
  if (is.dev) await session.defaultSession.loadExtension(vueExtensionsPath);

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
