import { ref } from "../framework/index.mjs";
import { BrowserWindow } from "electron";

export const mainWindow = ref<BrowserWindow | null>(null); //主窗口
export const searchWindow = ref<BrowserWindow | null>(null); //搜索窗口
export const bilibiliWindow = ref<BrowserWindow | null>(null); //B站登录窗口
