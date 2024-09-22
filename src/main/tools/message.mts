import { dialog, Notification } from "electron";
import { iconImage } from "../loadImages.mjs"; //加载图标

//错误弹窗
export function showErrorBox(error: unknown, content = "", title = "错误") {
  console.error(error, content, title);
  return dialog.showMessageBox({
    type: "error",
    title,
    message:
      error instanceof Error
        ? `${content}\n错误类型: ${error.name}\n错误信息: ${error.message}`
        : `${content}\n错误类型: 未知\n错误信息: ${error}`,
  });
}

//错误通知
export function showErrorNotification(
  error: Error,
  content = "",
  title = "错误",
) {
  const notification = new Notification({
    title,
    body:
      error instanceof Error
        ? `${content}\n错误类型: ${error.name}\n错误信息: ${error.message}`
        : `${content}\n错误类型: 未知\n错误信息: ${error}`,
    icon: iconImage,
  });
  notification.show();
  return notification;
}

//警告弹窗
export function showWarningBox(content = "", title = "警告") {
  return dialog.showMessageBox({
    type: "warning",
    title,
    message: content,
  });
}

//成功通知
export function showSuccessNotification(content = "", title = "成功") {
  const notification = new Notification({
    title,
    body: content,
    icon: iconImage,
  });
  notification.show();
  return notification;
}

//选择文件夹弹窗
export async function showOpenFolderDialog(title = "选择文件夹") {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title,
    properties: ["openDirectory", "createDirectory"],
  });
  if (canceled) return null;
  return filePaths[0];
}
