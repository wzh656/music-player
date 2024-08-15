import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  shell, //打开外部链接
  session, //会话 加载插件
  dialog, //对话框 文件选择
  Notification, //通知
  nativeImage, //加载图片
  Tray, //托盘
} from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import path from "node:path";
import fs from "node:fs";
import process from "process"; //下载文件
import request from "request"; //下载文件
import * as parser from "music-metadata"; //获取音频文件信息
import icon from "../../resources/icon.png?asset"; //图标路径
// import exitIcon from "../../resources/exit.png?asset";
import lastIcon from "../../resources/lastIcon.png?asset";
import nextIcon from "../../resources/nextIcon.png?asset";
import playIcon from "../../resources/playIcon.png?asset";
import pauseIcon from "../../resources/pauseIcon.png?asset";
import searchInject from "./searchInject"; //注入代码 string

/* 加载图像 */
const iconImage = nativeImage.createFromPath(icon);
// const exitImage = nativeImage.createFromPath(exitIcon);
const lastImage = nativeImage.createFromPath(lastIcon);
const nextImage = nativeImage.createFromPath(nextIcon);
const playImage = nativeImage.createFromPath(playIcon);
const pauseImage = nativeImage.createFromPath(pauseIcon);
const songListsPath = path.join("./userdata/songList.json"); //歌单文件路径

let mainWindow: BrowserWindow | null = null; //主窗口

/* 尝试解析歌单列表 */
function tryPraseSongLists(text: string) {
  let songList: SongLists;
  try {
    songList = JSON.parse(text);
  } catch (err) {
    dialog.showMessageBox({
      type: "error",
      title: "歌单列表解析失败",
      message: "歌单列表解析失败，请检查文件格式",
    });
    songList = [];
  }
  return songList;
}

/* 循环读取列表中文件 */
function readRecursively(paths: string[], fileList = new Set<string>()) {
  for (const filePath of paths)
    if (fs.statSync(filePath).isDirectory()) {
      const newPaths = fs
        .readdirSync(filePath)
        .map((file) => path.join(filePath, file)); //新路径
      readRecursively(newPaths, fileList); //文件夹 递归读取
    } else {
      fileList.add(filePath); //文件 加入列表
    }
  return [...fileList];
}

/* 过滤后缀 */
const MUSIC_SUFFIXS = ["mp3", "flac", "wav", "aac", "m4a"]; //音乐后缀
function filterEndsWith(paths: string[], suffixs: string[]) {
  return paths.filter((path) =>
    suffixs.some((suffix) => path.endsWith("." + suffix)),
  );
}

/* 初始化文件 */
function initFile() {
  if (!fs.existsSync(path.dirname(songListsPath)))
    fs.mkdirSync(path.dirname(songListsPath));

  if (!fs.existsSync(songListsPath))
    fs.writeFileSync(songListsPath, JSON.stringify([]));
}

/* 添加事件交互 */
function addEventListener() {
  //最小化窗口
  ipcMain.on("minimize", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents); //获取发出事件的窗口
    win!.minimize();
  });

  //切换最大化
  ipcMain.on("switchMaximum", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents); //获取发出事件的窗口
    win!.isMaximized() ? win!.unmaximize() : win!.maximize();
  });

  //获取歌单列表
  ipcMain.handle("getSongLists", () => {
    const text = fs.readFileSync(songListsPath).toString();
    const songLists = tryPraseSongLists(text); //尝试解析歌单列表
    const names = songLists.map((item) => item.name); //歌单名称
    updateTaskSonglists(names); //更新任务栏歌单列表
    console.log("[getSongLists]", songLists);
    return songLists;
  });

  //更新歌单列表
  ipcMain.on("updateSongLists", (_, songListsStr: string) => {
    console.log("[updateSongLists]", songListsStr);
    fs.writeFileSync(songListsPath, songListsStr);
    const songLists = tryPraseSongLists(songListsStr); //尝试解析歌单列表
    const names = songLists.map((item) => item.name);
    updateTaskSonglists(names); //更新任务栏歌单列表
  });

  //获取歌单歌曲
  ipcMain.handle("getSongListSongs", (_, index: number) => {
    const text = fs.readFileSync(songListsPath).toString();
    const songLists = tryPraseSongLists(text); //尝试解析歌单列表
    const paths = songLists[index].paths;
    const files = readRecursively(paths); //循环读取列表中文件
    console.log("[getSongListSongs]", index, songLists[index].name);
    return filterEndsWith(files, MUSIC_SUFFIXS); //过滤后缀
  });

  //获取歌手
  ipcMain.handle("getArtist", async (_, path: string) => {
    const metadata = await parser.parseFile(path);
    console.log("[getArtist]", path, metadata);
    return metadata.common.artist ?? "<unknown>";
  });

  //获取歌词
  ipcMain.handle("getLyrics", async (_, path: string) => {
    const lyricsPath = path.slice(0, -4) + ".lrc";
    console.log("[getLyrics]", lyricsPath);
    if (!fs.existsSync(lyricsPath)) return null; //不存在歌词文件
    return fs.readFileSync(lyricsPath).toString();
  });

  //更新播放状态
  ipcMain.on("updatePlayState", (_, playState: boolean) => {
    updateThumbnailToolbar(playState);
  });

  //下载文件
  ipcMain.on("downloadFile", async (_, url: string, name: string) => {
    console.log("[downloadFile]", url, name);
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "请选择下载路径",
      properties: ["openDirectory", "createDirectory"],
    });
    if (canceled) return; //取消下载
    const selectPath = filePaths[0];
    const downloadPath = path.resolve(selectPath, name);

    const process = fs.createWriteStream(downloadPath);
    request({
      url,
      timeout: 10000,
    }).pipe(process);
    process.on("finish", () => {
      console.log("[downloadFile] finish", downloadPath);
      new Notification({
        title: "下载完成",
        body: `${name}已下载至${downloadPath}`,
        icon: iconImage,
      }).show();
    });
    process.on("error", (err) => {
      console.log("[downloadFile] error", downloadPath, err);
      new Notification({
        title: "下载失败",
        body: `${name}无法下载\n错误类型:${err.name}\n错误信息:${err.message}`,
        icon: iconImage,
      }).show();
    });
  });

  //下载文本文件
  ipcMain.on("downloadText", async (_, text, name) => {
    console.log("[downloadText]", name);
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "请选择下载路径",
      properties: ["openDirectory", "createDirectory"],
    });
    if (canceled) return; //取消下载
    const path = filePaths[0];
    const downloadPath = path + "/" + name;

    fs.writeFileSync(downloadPath, text); //写入文件

    new Notification({
      title: "下载完成",
      body: `${name}已下载至${downloadPath}`,
      icon: iconImage,
    }).show();
  });

  //打开外部链接
  ipcMain.on("openUrl", async (_, url) => {
    console.log("[openUrl]", url);
    shell.openExternal(url); //打开外部链接
  });

  //搜索
  let searchWindow: BrowserWindow | null = null;
  const apiUrl = "https://www.yyssq.cn/";
  ipcMain.on("search", async (_, keyword, page) => {
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
    // keyword = keyword.replaceAll("'", " ");
    // const injectPath = path.join(__dirname, "../preload/search-inject.js");
    // const js = fs.readFileSync(injectPath).toString();
    searchWindow.webContents.executeJavaScript(searchInject); //注入代码
    searchWindow.webContents.executeJavaScript(
      `onSearch('${keyword}', ${+page})`,
    ); //注入代码
  });

  ipcMain.on("searchData", (_, data) => {
    console.log("[searchData]", data);
    mainWindow!.webContents.send("searchData", data); //发送搜索结果
    searchWindow!.destroy(); //关闭搜索窗口
    searchWindow = null;
  });

  //浏览文件
  ipcMain.handle("browseFiles", async (_, path) => {
    console.log("[browseFiles]", path);
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "选择文件（可多选）",
      properties: ["openFile", "multiSelections"],
      defaultPath: path,
      filters: [
        { name: "Music", extensions: MUSIC_SUFFIXS },
        { name: "All Files", extensions: ["*"] },
      ],
    });
    return { canceled, filePaths };
  });

  //浏览文件夹
  ipcMain.handle("browseDir", async (_, path) => {
    console.log("[browseDir]", path);
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "选择文件夹",
      properties: ["openDirectory"],
      defaultPath: path,
    });
    return { canceled, filePaths };
  });
}

/* 创建托盘 */
function initTray() {
  const tray = new Tray(iconImage);
  const contextMenu = Menu.buildFromTemplate([
    { label: "打开应用", click: () => mainWindow!.show() },
    { label: "退出应用", role: "quit", click: () => app.exit() },
  ]);

  tray.on("click", () => {
    mainWindow!.show();
  });

  tray.setToolTip("冈易音乐播放器"); //悬浮提示
  tray.setContextMenu(contextMenu);
}

/* 更新任务栏歌单 */
function updateTaskSonglists(names: string[]) {
  app.setUserTasks(
    names.map((name) => ({
      program: process.execPath,
      arguments: `--play-song-list "${name}"`,
      iconPath: process.execPath,
      iconIndex: 0,
      title: name,
      description: "播放 " + name,
    })),
  );
}

/* 初始化缩略图工具栏 */
function updateThumbnailToolbar(playState: boolean) {
  mainWindow!.setThumbarButtons([
    {
      tooltip: "上一首",
      icon: lastImage,
      click() {
        mainWindow!.webContents.send("last");
      },
    },
    playState
      ? {
          tooltip: "暂停",
          icon: pauseImage,
          click() {
            mainWindow!.webContents.send("pause");
          },
        }
      : {
          tooltip: "播放",
          icon: playImage,
          click() {
            mainWindow!.webContents.send("play");
          },
        },
    {
      tooltip: "下一首",
      icon: nextImage,
      click() {
        mainWindow!.webContents.send("next");
      },
    },
  ]);
}

/* 创建主窗口 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
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
  // if (is.dev) mainWindow.webContents.openDevTools({ mode: "detach" }); // 打开开发工具

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  /* mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  }); */

  mainWindow.on("ready-to-show", () => {
    mainWindow!.show();
    updateThumbnailToolbar(false); //初始化缩略图工具栏
  });

  mainWindow.on("close", (e: Electron.Event) => {
    mainWindow!.hide();
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

  addEventListener(); //添加事件监听
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
