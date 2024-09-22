/* import http from "node:http";
import https from "node:https"; */
import axios from "axios";
import fs from "node:fs";
// import { pipeline as streamPipeline } from "node:stream/promises";

export default async function (url: string, path: string, cookie?: string) {
  axios({
    url,
    method: "get",
    responseType: "stream",
    headers: {
      Cookie: cookie,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      Referer: "https://www.bilibili.com/", //对于直接浏览器调用可能不适用
    },
  }).then(function (response) {
    const writeStream = fs.createWriteStream(path);
    response.data.pipe(writeStream);
  });
  /* const gotStream = got.stream(url, {
    headers: {
      Cookie: cookie,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      Referer: "https://www.bilibili.com/", //对于直接浏览器调用可能不适用
    },
  });
  const writeStream = fs.createWriteStream(path);
  return streamPipeline(gotStream, writeStream); */
}
