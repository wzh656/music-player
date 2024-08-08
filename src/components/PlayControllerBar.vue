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
import * as musicController from "@/ts/audioPlay"; //音乐播放控制
import shuffleArray from "@/ts/shuffleArray"; //原地打乱数组

/* 获取依赖 */
const playMode = inject("playMode") as Ref<PlayMode>; //播放模式
const playList = inject("playList") as Ref<string[]>; //播放列表
const playListShuffled = inject("playListShuffled") as Ref<string[]>; //打乱后的播放列表
const currentMusic = inject("currentMusic") as Ref<string | null>; //当前播放音乐
const playState = inject("playState") as Ref<boolean>; //播放状态
const volume = inject("volume") as Ref<number>; //音量

/* 当前音乐名称 */
const currentMusicName = computed(() => {
  if (!currentMusic.value) return "";
  const matchResult = currentMusic.value.match(/([^\\/]+)\..+$/);
  return matchResult ? matchResult[1] : currentMusic.value;
});

/* 播放 */
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

  //播放
  currentMusic.value = list.value[index];
  musicController.playMusic(currentMusic.value, volume);
  playState.value = true;
}

/* 下一首 */
function nextMusic() {
  if (!playList.value.length) return; //当前无歌单
  if (!playListShuffled.value.length) return; //当前无歌单
  if (!currentMusic.value) return; //当前无音乐播放

  const list = playMode.value == PlayMode.random ? playListShuffled : playList;
  let index = list.value.indexOf(currentMusic.value);
  if (++index >= list.value.length) index = 0; //溢出

  //播放
  currentMusic.value = list.value[index];
  musicController.playMusic(currentMusic.value, volume);
  playState.value = true;
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
    <div class="progressBar">
      <div class="thumb"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
div.playController {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 15px 15px 0 0;
  background: var(--color-background-soft);
  transition: background-color 0.5s;

  .musicName {
    padding-bottom: 1rem;
    text-align: center;
    font-weight: bold;
  }

  .progressBar {
    width: 100%;
    height: 5px;
    background-color: var(--color-theme);
    border-radius: 5px;
    margin-top: 1rem;
    cursor: pointer;
  }

  .playButtons {
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    svg {
      width: 36px;
      height: 36px;
      cursor: pointer;
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
}
</style>
