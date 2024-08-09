<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import playIcon from "@/assets/icons/playIcon.vue";
import stopIcon from "@/assets/icons/stopIcon.vue";
import lastIcon from "@/assets/icons/lastIcon.vue";
import nextIcon from "@/assets/icons/nextIcon.vue";
import sequenceIcon from "@/assets/icons/sequenceIcon.vue";
import loopIcon from "@/assets/icons/loopIcon.vue";
import randomIcon from "@/assets/icons/randomIcon.vue";
import volumeIcon from "@/assets/icons/volumeIcon.vue";
import { PlayMode } from "@/types/PlayMode"; //播放模式类型
import * as musicController from "@/ts/musicController"; //音乐播放控制
import shuffleArray from "@/ts/shuffleArray"; //原地打乱数组

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

/* 计算播放进度style */
const progressStyle = computed(() => {
  return {
    width: `${(currentTime.value / currentDuration.value) * 100}%`,
  };
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

/* 继续播放 */
function play() {
  if (!currentMusic.value) return; //当前无音乐播放

  musicController.play();
  playState.value = true;
}

/* 暂停 */
function pause() {
  musicController.pause();
  playState.value = false;
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

/* 设置播放时间 */
function setCurrentTime(event: MouseEvent) {
  if (!currentMusic.value) return; //当前无音乐播放

  const target = event.currentTarget as HTMLElement; //设置监听器的元素
  console.log(event.offsetX);
  const progress = event.offsetX / target.clientWidth; //进度
  currentTime.value = progress * currentDuration.value; //设置当前播放时间
  musicController.setCurrentTime(currentTime.value); //设置播放时间
}

/* 切换播放模式 */
function switchPlayMode() {
  switch (playMode.value) {
    case PlayMode.sequence:
      playMode.value = PlayMode.loop; //单曲循环
      break;
    case PlayMode.loop:
      playMode.value = PlayMode.random; //随机播放
      playListShuffled.value = shuffleArray(playListShuffled.value);
      break;
    case PlayMode.random:
      playMode.value = PlayMode.sequence; //顺序播放
      break;
  }
}

/* 格式化时间 */
function formatTime(time: number) {
  const minutes = ~~((time / 60) % 60) + "";
  const seconds = ~~(time % 60) + "";
  if (currentDuration.value > 3600) {
    //超过1h的音频显示小时
    const hours = ~~(time / 3600) + "";
    return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  } else {
    return `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  }
}

/* 键盘控制 */
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    //空格 暂停播放
    case " ":
      playState.value ? pause() : play();
      event.preventDefault();
      break;

    //左箭头 快退5s
    //ctrl+左箭头 上一首
    case "ArrowLeft":
      if (event.ctrlKey) {
        lastMusic();
      } else {
        currentTime.value -= 5;
        musicController.setCurrentTime(currentTime.value);
      }
      event.preventDefault();
      break;

    //右箭头 快进5s
    //ctrl+右箭头 下一首
    case "ArrowRight":
      if (event.ctrlKey) {
        nextMusic();
      } else {
        currentTime.value += 5;
        musicController.setCurrentTime(currentTime.value);
      }
      event.preventDefault();
      break;
  }
});
</script>

<template>
  <div class="playController">
    <div class="musicName">{{ currentMusicName }}</div>
    <div class="playButtons">
      <sequenceIcon
        @click="switchPlayMode"
        v-show="playMode == PlayMode.sequence"
      ></sequenceIcon>
      <loopIcon
        @click="switchPlayMode"
        v-show="playMode == PlayMode.loop"
      ></loopIcon>
      <randomIcon
        @click="switchPlayMode"
        v-show="playMode == PlayMode.random"
      ></randomIcon>
      <lastIcon @click="lastMusic"></lastIcon>
      <playIcon @click="play" class="playButton" v-show="!playState" />
      <stopIcon @click="pause" class="playButton" v-show="playState" />
      <nextIcon @click="nextMusic"></nextIcon>
      <volumeIcon></volumeIcon>
    </div>
    <div class="timeInfo">
      <span>{{ formatTime(currentTime) }}</span>
      <div class="progressBar" @click="setCurrentTime">
        <div class="thumb" :style="progressStyle"></div>
      </div>
      <span>{{ formatTime(currentDuration) }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playController {
  display: flex;
  flex-direction: column;
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
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    svg {
      width: 36px;
      height: 36px;
      cursor: pointer;
      stroke: var(--color-text);
      fill: var(--color-text);
    }

    svg.playButton {
      width: 50px;
      height: 50px;
      background-color: var(--color-theme);
      border-radius: 100%;
      stroke: white;
      fill: white;
    }
  }

  //进度条
  .timeInfo {
    display: flex;
    align-items: center;

    span {
      flex: none;
    }

    .progressBar {
      flex: auto;
      width: 100%;
      height: 5px;
      margin: 0 0.5rem;
      background-color: var(--color-theme-soft);
      border-radius: 5px;
      cursor: pointer;

      .thumb {
        width: 0;
        height: 5px;
        background-color: var(--color-theme);
        border-radius: 5px;
      }
    }
  }
}
</style>
