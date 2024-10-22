/* 规范化文件名 */

const illegalChars = '<>:"/\\|?*'.split("");

export default function (fileName: string) {
  let name = fileName;
  for (const char of illegalChars) name = name.replaceAll(char, ""); // 不得包含非法字符
  name = name.trim().slice(0, 255); // 首尾不能有空字符 长度不超过255
  return name.endsWith(".") ? name.slice(0, -1) : name; // 末尾不能有"."
}
