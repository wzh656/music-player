<script setup lang="ts">
import { ref, provide } from "vue";
import WindowApp from "@/components/WindowApp.vue";
import PlayController from "./components/PlayController.vue";
import pageView from "./components/pageView.vue";

/* 深色模式 */
const rootElem = document.querySelector(":root") as HTMLElement; //根元素

//更新颜色风格
function updateColor() {
  if (matchMedia("(prefers-color-scheme: dark)").matches) {
    rootElem.dataset.colorScheme = "dark";
  } else {
    rootElem.dataset.colorScheme = "light";
  }
}

//监听颜色风格改变
matchMedia("(prefers-color-scheme: dark)").addEventListener(
  "change",
  updateColor,
);
updateColor();

/* 注入控制依赖 */
const playList = ref([]); //播放列表
const playMode = ref<PlayMode>("list"); //播放模式
const playState = ref(false); //播放状态
const currentSonglist = ref(null); //当前歌单名称
const currentMusic = ref(null); //当前音乐
const volume = ref(0.8); //音量

provide("playList", playList);
provide("playMode", playMode);
provide("playState", playState);
provide("currentMusic", currentMusic);
provide("currentSonglist", currentSonglist);
provide("volume", volume);
</script>

<template>
  <WindowApp class="window">
    <template #title>Music Player</template>
    <template #content>
      <section class="content">
        <pageView class="pageView"></pageView>
        <PlayController class="playController"></PlayController>
      </section>
    </template>
  </WindowApp>
</template>

<style scoped lang="scss">
.window {
  width: 100%;
  height: 100%;

  .content {
    display: flex;
    flex-direction: column;
    height: 100%;

    .pageView {
      height: 0;
      flex: 1 1 auto;
    }

    .playController {
      flex: 0;
    }
  }
}
</style>
