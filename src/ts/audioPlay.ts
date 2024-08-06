import { watch, type Ref } from "vue";

const ctx = new AudioContext();
const audio = new Audio();
const source = ctx.createMediaElementSource(audio);
const gainNode = ctx.createGain();

//source -> gainNode -> ctx.destination
source.connect(gainNode);
gainNode.connect(ctx.destination);

//播放音乐
export function playMusic(src: string, volume: Ref<number>) {
  console.log("[play music]", src, ", volume:", volume.value);

  audio.src = src;

  //音量控制
  gainNode.gain.value = volume.value;
  watch(volume, (newVal) => (gainNode.gain.value = newVal));

  audio.play();
}

//暂停音乐
export function pause() {
  audio.pause();
}

//继续播放
export function play() {
  audio.play();
}
