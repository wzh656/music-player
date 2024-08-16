import { nativeImage } from "electron";

import icon from "../../resources/icon.png?asset"; //图标路径
// import exitIcon from "../../resources/exit.png?asset";
import lastIcon from "../../resources/lastIcon.png?asset";
import nextIcon from "../../resources/nextIcon.png?asset";
import playIcon from "../../resources/playIcon.png?asset";
import pauseIcon from "../../resources/pauseIcon.png?asset";

/* 加载图像 */
const iconImage = nativeImage.createFromPath(icon);
// const exitImage = nativeImage.createFromPath(exitIcon);
const lastImage = nativeImage.createFromPath(lastIcon);
const nextImage = nativeImage.createFromPath(nextIcon);
const playImage = nativeImage.createFromPath(playIcon);
const pauseImage = nativeImage.createFromPath(pauseIcon);

export { icon, iconImage, lastImage, nextImage, playImage, pauseImage };
