import { app, BrowserWindow, ipcMain, Menu, session } from "electron";
import process from "process";
import path from "node:path";
import fs from "node:fs";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const vueDevToolsPath = path.resolve("./extensions/vue-devtools"); //必须绝对路径

/* 循环读取列表中文件 */
function readRecursively(paths, fileList = []) {
  for (const filePath of paths) {
    if (fs.statSync(filePath).isDirectory()) {
      const newPaths = fs
        .readdirSync(filePath)
        .map((file) => path.join(filePath, file)); //新路径
      readRecursively(newPaths, fileList); //文件夹 递归读取
    } else {
      fileList.push(filePath); //文件 加入列表
    }
  }
  return fileList;
}

/* 过滤后缀 */
const MUSIC_SUFFIXS = [".mp3", ".wav", ".flac", ".aac"];
function filterEndsWith(paths, suffixs) {
  return paths.filter((path) =>
    suffixs.some((suffix) => path.endsWith(suffix)),
  );
}

/* 初始化文件 */
const songListPath = path.join("./userdata/songList.json"); //歌单文件路径
function initFile() {
  if (!fs.existsSync(songListPath))
    fs.writeFileSync(songListPath, JSON.stringify({}));
}

/* 添加事件交互 */
function addEventListener() {
  //最小化窗口
  ipcMain.on("minimize", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents); //获取发出事件的窗口
    win.minimize();
  });

  //切换最大化
  ipcMain.on("switchMaximum", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents); //获取发出事件的窗口
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  //获取歌单列表
  ipcMain.handle("getSongLists", () => {
    const text = fs.readFileSync(songListPath);
    console.log(JSON.parse(text));
    return JSON.parse(text);
  });

  //获取歌单歌曲
  ipcMain.handle("getSongListSongs", (event, name) => {
    const text = fs.readFileSync(songListPath);
    const songList = JSON.parse(text);
    const paths = songList[name].paths;
    const files = readRecursively(paths); //循环读取列表中文件
    return filterEndsWith(files, MUSIC_SUFFIXS); //过滤后缀
  });
}

// 创建浏览器窗口
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 350,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      webSecurity: false, //关闭安全策略 允许本地加载
      preload: path.resolve("./preload.js"), //必须绝对路径
    },
  });
  Menu.setApplicationMenu(null); //清空菜单

  addEventListener();
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("changeMaximumState", true);
  });
  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("changeMaximumState", false);
  });

  // mainWindow.loadFile("./dist/index.html"); // 此处跟electron官网路径不同，需要注意
  mainWindow.loadURL("http://localhost:5173/"); // 此处跟electron官网路径不同，需要注意

  mainWindow.webContents.openDevTools({ mode: "detach" }); // 打开开发工具
}

//应用准备完成
initFile(); //初始化文件
app.whenReady().then(async () => {
  // if (process.env.NODE_ENV === "development") {
  await session.defaultSession.loadExtension(vueDevToolsPath);
  // }

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//窗口全部关闭
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
