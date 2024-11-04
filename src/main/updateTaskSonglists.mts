/* 更新任务栏歌单 */
import { app } from "electron";

export default function (names: string[]) {
  app.setUserTasks(
    names.map((name, index) => ({
      program: process.execPath,
      arguments: `--play-song-list ${index}`,
      iconPath: process.execPath,
      iconIndex: 0,
      title: name,
      description: "播放 " + name,
    })),
  );
}
