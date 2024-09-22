import fs from "node:fs";
import { cookiePath } from "../settings/filePath.mjs";

export function getLocalCookie() {
  return fs.readFileSync(cookiePath).toString();
}

export function setLocalCookie(cookie: string) {
  fs.writeFileSync(cookiePath, cookie);
}
