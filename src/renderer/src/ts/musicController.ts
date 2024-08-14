import { watch, type Ref } from "vue";

const ctx = new AudioContext();
const audio = new Audio();
audio.crossOrigin = "anonymous";
const source = ctx.createMediaElementSource(audio);
const gainNode = ctx.createGain();

//source -> gainNode -> ctx.destination
source.connect(gainNode);
gainNode.connect(ctx.destination);

/* 音乐信息 */
export interface MusicInfo {
  volume: Ref<number>;
  currentTime: Ref<number>;
  duration: Ref<number>;
}

//播放音乐
export function playMusic(src: string, info: MusicInfo) {
  const { volume, currentTime, duration } = info;
  console.log("[play music]", src, info);

  audio.src = src;

  //音量控制
  gainNode.gain.value = volume.value;
  watch(volume, (newVal) => (gainNode.gain.value = newVal));

  //加载完 播放&设置时长
  audio.addEventListener("loadedmetadata", () => {
    audio.play();
    duration.value = audio.duration;
  });

  //同步播放进度
  audio.addEventListener("timeupdate", () => {
    currentTime.value = audio.currentTime;
  });
}

//暂停音乐
export function pause() {
  audio.pause();
}

//继续播放
export function play() {
  audio.play();
}

//设置播放进度
export function setCurrentTime(time: number) {
  audio.currentTime = time;
}

//监听播放结束
export function onEnd(callback: () => void) {
  audio.addEventListener("ended", callback);
}
