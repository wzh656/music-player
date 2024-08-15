import fs from "node:fs";
import { cookiesPath } from "../settings/filePath";

export function getLocalCookies() {
  return fs.readFileSync(cookiesPath).toString();
}

export function setLocalCookies(cookies: string) {
  fs.writeFileSync(cookiesPath, cookies);
}
