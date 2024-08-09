<script setup lang="ts">
import { ref, provide } from "vue";
import WindowApp from "@/components/WindowApp.vue";
import PlayController from "@/components/PlayControllerBar.vue";
import PageView from "@/components/PageViewer.vue";
import { PlayMode } from "@/types/PlayMode";

/* 深色模式 */

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
const playMode = ref<PlayMode>(PlayMode.random); //播放模式
const playList = ref([]); //顺序播放列表
const playListShuffled = ref([]); //打乱后的播放列表
const playState = ref(false); //播放状态
const currentSonglist = ref<string | null>(null); //当前歌单名称
const currentMusic = ref<string | null>(null); //当前播放音乐
const currentTime = ref(0); //当前播放时间
const currentDuration = ref(0); //当前播放音乐时长
const volume = ref(0.8); //音量

provide("playMode", playMode);
provide("playList", playList);
provide("playListShuffled", playListShuffled);
provide("playState", playState);
provide("currentMusic", currentMusic);
provide("currentSonglist", currentSonglist);
provide("currentTime", currentTime);
provide("currentDuration", currentDuration);
provide("volume", volume);
</script>

<template>
  <WindowApp class="window">
    <template #title>冈易音乐播放器</template>
    <template #content>
      <section class="content">
        <PageView class="pageView"></PageView>
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
