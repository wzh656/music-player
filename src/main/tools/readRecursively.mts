/* 循环读取列表中文件 */
import fs from "node:fs";
import path from "node:path";

export default function readRecursively(
  paths: string[],
  fileList = new Set<string>(),
) {
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
