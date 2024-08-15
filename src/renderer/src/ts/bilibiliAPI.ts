import { bv2av, av2bv } from "./avbv";

//获取Bvid
export async function getBvid(value: string) {
  if (value.startsWith("BV1") && value.length == 12) {
    return value; //bvid
  } else if (value.startsWith("https://") || value.startsWith("https://")) {
    value = value.replace(/http(s)?:\/\//, "");
    if (value.startsWith("www.bilibili.com/video/BV1")) {
      //电脑版
      const bvid = value.substr("www.bilibili.com/video/".length, 12);
      return bvid;
    } else if (value.startsWith("b23.tv/BV1")) {
      //含bvid的短链
      const bvid = value.substr("b23.tv/".length, 12);
      return bvid;
    } else if (value.startsWith("b23.tv/")) {
      //不含bvid的短链 获取重定向链接
      const response = await fetch("https://" + value);
      value = response.url;
      value = value.replace(/http(s)?:\/\//, "");
      if (value.startsWith("www.bilibili.com/video/BV1")) {
        const bvid = value.substr("www.bilibili.com/video/".length, 12);
        return bvid;
      }
    }
  }
  return null;
}

export { bv2av, av2bv };
