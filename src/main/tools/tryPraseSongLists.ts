/* 尝试解析歌单列表 */
import { dialog } from "electron";

export default function (text: string) {
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
