<script setup lang="ts">
import { computed, inject, watch, type Ref } from "vue";
import lastIcon from "@/assets/icons/lastIcon.vue";
import nextIcon from "@/assets/icons/nextIcon.vue";
import PlayModeIcon from "./playControl/PlayModeIcon.vue"; //播放模式按钮组
import PlayPauseIcon from "./playControl/PlayPauseIcon.vue"; //播放暂停按钮组
import VolumeController from "./playControl/VolumeController.vue"; //音量控制器
import TimeLine from "./playControl/TimeLine.vue"; //播放进度控制器
import { PlayMode } from "@/types/PlayMode"; //播放模式类型
import * as musicController from "@/ts/musicController"; //音乐播放控制

/* 获取依赖 */
const playMode = inject("playMode") as Ref<PlayMode>; //播放模式
const playList = inject("playList") as Ref<string[]>; //播放列表
const playListShuffled = inject("playListShuffled") as Ref<string[]>; //打乱后的播放列表
const playState = inject("playState") as Ref<boolean>; //播放状态
const currentSonglist = inject("currentSonglist") as Ref<string>; //当前歌单名称
const currentMusic = inject("currentMusic") as Ref<string | null>; //当前播放音乐
const currentTime = inject("currentTime") as Ref<number>; //当前播放时间
const currentDuration = inject("currentDuration") as Ref<number>; //当前音乐时长
const volume = inject("volume") as Ref<number>; //音量

/* 计算当前音乐名称 */
const currentMusicName = computed(() => {
  if (!currentMusic.value) return "";
  if (currentMusic.value.startsWith("http"))
    return "在线歌曲 - " + currentSonglist.value;
  const matchResult = currentMusic.value.match(/([^\\/]+)\..+$/);
  return matchResult ? matchResult[0] : currentMusic.value; //0:含后缀名, 1:文件名
});

// 更新任务栏标题
watch(currentMusicName, (newName) => {
  document.title = newName;
});

/* 播放音乐 */
function playMusic(music: string) {
  currentMusic.value = music; //设为当前播放
  musicController.playMusic(currentMusic.value, {
    volume,
    currentTime,
    duration: currentDuration,
  }); //播放
  playState.value = true; //设为播放状态
}

/* 上一首 */
function lastMusic() {
  if (!playList.value.length) return; //当前无歌单
  if (!playListShuffled.value.length) return; //当前无歌单
  if (!currentMusic.value) return; //当前无音乐播放

  const list = playMode.value == PlayMode.random ? playListShuffled : playList;
  let index = list.value.indexOf(currentMusic.value);
  if (--index < 0) index = list.value.length - 1; //溢出

  playMusic(list.value[index]); //播放
}

/* 下一首 */
function nextMusic() {
  if (!playList.value.length) return; //当前无歌单
  if (!playListShuffled.value.length) return; //当前无歌单
  if (!currentMusic.value) return; //当前无音乐播放

  const list = playMode.value == PlayMode.random ? playListShuffled : playList;
  let index = list.value.indexOf(currentMusic.value);
  if (++index >= list.value.length) index = 0; //溢出

  playMusic(list.value[index]); //播放
}

/* 播放结束 */
musicController.onEnd(() => {
  if (playMode.value == PlayMode.loop) {
    if (!currentMusic.value) return; //当前无音乐播放
    playMusic(currentMusic.value); //单曲循环
  } else {
    nextMusic(); //自动下一首
  }
});

/* 键盘控制 */
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    //左箭头 快退5s
    //ctrl+左箭头 上一首
    case "ArrowLeft":
      if (event.ctrlKey) {
        lastMusic();
        event.preventDefault();
      }
      break;

    //右箭头 快进5s
    //ctrl+右箭头 下一首
    case "ArrowRight":
      if (event.ctrlKey) {
        nextMusic();
        event.preventDefault();
      }
      break;
  }
});

/* 任务栏略缩图控制 */
window.electron.onLast(lastMusic);
window.electron.onNext(nextMusic);
</script>

<template>
  <div class="playController">
    <div class="musicName">{{ currentMusicName }}</div>
    <div class="playButtons">
      <PlayModeIcon></PlayModeIcon>
      <lastIcon @click="lastMusic"></lastIcon>
      <PlayPauseIcon></PlayPauseIcon>
      <nextIcon @click="nextMusic"></nextIcon>
      <VolumeController></VolumeController>
    </div>
    <TimeLine></TimeLine>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/template.scss";

.playController {
  @include flex(column);
  gap: 1rem;
  padding: 1rem;
  border-radius: 15px 15px 0 0;
  background: var(--color-background-soft);
  transition: background-color 0.5s;

  //音乐名
  .musicName {
    text-align: center;
    font-weight: bold;
  }

  //控制按钮组
  .playButtons {
    @include flex(row);
    justify-content: space-evenly;
    align-items: center;

    svg {
      width: 36px;
      height: 36px;
      cursor: pointer;
      stroke: var(--color-text);
      fill: var(--color-text);

      box-sizing: content-box;
      padding: 0.5rem;
      border-radius: 36px;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--color-background-mute);
      }
    }
  }
}
</style>
