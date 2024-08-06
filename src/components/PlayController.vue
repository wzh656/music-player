<script setup lang="ts">
import { inject, type Ref } from "vue";
import playIcon from "@/assets/icons/playIcon.vue";
import stopIcon from "@/assets/icons/stopIcon.vue";
import lastIcon from "@/assets/icons/lastIcon.vue";
import nextIcon from "@/assets/icons/nextIcon.vue";
import randomIcon from "@/assets/icons/randomIcon.vue";
import volumeIcon from "@/assets/icons/volumeIcon.vue";
import * as musicController from "@/ts/audioPlay";

const playState = inject("playState") as Ref<boolean>; //播放状态
const playList = inject("playList") as Ref<string[]>; //播放列表
const currentMusic = inject("currentMusic") as Ref<string>; //当前播放歌曲

//播放
function play() {
  if (!currentMusic.value) return; //当前无音乐播放

  musicController.play();
  playState.value = true;
}

//暂停
function pause() {
  musicController.pause();
  playState.value = false;
}

//上一首
function lastMusic() {
  if (!playList.value.length) return; //当前无音乐播放
}

//下一首
function nextMusic() {
  musicController.nextMusic();
}
</script>

<template>
  <div class="playController">
    <div>
      <randomIcon></randomIcon>
      <lastIcon @click="lastMusic"></lastIcon>
      <playIcon @click="play" class="playButton" v-show="!playState" />
      <stopIcon @click="pause" class="playButton" v-show="playState" />
      <nextIcon @click="nextMusic"></nextIcon>
      <volumeIcon></volumeIcon>
    </div>
  </div>
</template>

<style scoped lang="scss">
div.playController {
  padding: 1rem;
  border-radius: 15px 15px 0 0;
  background: var(--color-background-soft);
  transition: background-color 0.5s;

  div {
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
