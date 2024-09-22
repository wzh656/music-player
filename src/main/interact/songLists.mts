import { ipcMain } from "electron";
import fs from "node:fs";
import { MUSIC_SUFFIXS } from "../settings/musicSuffixs.mjs"; //音乐文件后缀
import { songListsPath } from "../settings/filePath.mjs"; //歌单列表文件路径
import tryPraseSongLists from "../tools/tryPraseSongLists.mjs"; //尝试解析歌单列表
import readRecursively from "../tools/readRecursively.mjs"; //循环读取文件
import {
  filterWithSuffixes,
  filterWithArtists,
  getAllArtists,
} from "../tools/filterSongs.mjs"; //过滤后缀
import updateTaskSonglists from "../updateTaskSonglists.mjs"; //更新任务栏歌单

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
  ipcMain.handle("getSongListSongs", async (_, index: number) => {
    const text = fs.readFileSync(songListsPath).toString();
    const songLists = tryPraseSongLists(text); //尝试解析歌单列表

    const suffixes = songLists[index].suffixes ?? MUSIC_SUFFIXS; //歌单歌曲后缀
    const artists = songLists[index].artists; //歌单歌手列表

    const paths = songLists[index].paths; //歌单路径列表
    const files = readRecursively(paths); //循环读取列表中文件
    console.log("[getSongListSongs]", index, songLists[index].name);

    let songs = filterWithSuffixes(files, suffixes); //过滤后缀
    if (artists) songs = await filterWithArtists(songs, artists); //过滤歌手
    return songs;
  });

  //获取歌单所有歌手
  ipcMain.handle("getSongListArtists", (_, index: number) => {
    const text = fs.readFileSync(songListsPath).toString();
    const songLists = tryPraseSongLists(text); //尝试解析歌单列表

    const suffixes = songLists[index].suffixes ?? MUSIC_SUFFIXS; //歌单歌曲后缀

    const paths = songLists[index].paths; //歌单路径列表
    const files = readRecursively(paths); //循环读取列表中文件
    console.log("[getSongListArtists]", index, songLists[index].name);

    const songs = filterWithSuffixes(files, suffixes); //过滤后缀
    const artists = getAllArtists(songs); //获取所有歌手
    return artists;
  });
}
