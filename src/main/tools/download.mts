/* import http from "node:http";
import https from "node:https"; */
import got from "got";
import fs from "node:fs";
import { pipeline as streamPipeline } from "node:stream/promises";

export default function (url: string, path: string) {
  const gotStream = got.stream(url);
  const writeStream = fs.createWriteStream(path);
  return streamPipeline(gotStream, writeStream);
}
