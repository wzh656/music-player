import { ipcMain } from "electron";
import fs from "node:fs";
import { MUSIC_SUFFIXS } from "../settings/musicSuffixs"; //音乐文件后缀
import { songListsPath } from "../settings/filePath"; //歌单列表文件路径
import tryPraseSongLists from "../tools/tryPraseSongLists"; //尝试解析歌单列表
import readRecursively from "../tools/readRecursively"; //循环读取文件
import filterEndsWith from "../tools/filterEndsWith"; //过滤后缀
import updateTaskSonglists from "../updateTaskSonglists"; //更新任务栏歌单

export default function () {
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
}
