import { ipcMain, dialog } from "electron";
import { MUSIC_SUFFIXS } from "../settings/musicSuffixs.mjs";

export default function () {
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
