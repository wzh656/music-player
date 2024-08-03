import { app, BrowserWindow, ipcMain, Menu } from "electron";
import process from "process";
import path from "node:path";
// import { fileURLToPath } from "url";

/* const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); */

// 添加事件交互
function addEventListener() {
  ipcMain.on("minimize", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents); //获取发出事件的窗口
    win.minimize();
  });

  ipcMain.on("switchMaximum", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents); //获取发出事件的窗口
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
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
      preload: path.resolve("./preload.js"), //path.join(__dirname, "preload.js"),
    },
  });
  Menu.setApplicationMenu(null); //清空菜单

  addEventListener();
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("change-maximum-state", true);
  });
  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("change-maximum-state", false);
  });

  mainWindow.loadFile("./dist/index.html"); // 此处跟electron官网路径不同，需要注意

  // mainWindow.webContents.openDevTools(); // 打开开发工具
}

//应用准备完成
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//窗口全部关闭
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
