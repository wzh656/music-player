<script setup lang="ts">
import { ref, provide, watch } from "vue";
import WindowApp from "@/components/WindowApp.vue";
import PlayController from "@/components/PlayControllerBar.vue";
import PageView from "@/components/PageViewer.vue";
import { PlayMode } from "@/types/PlayMode";
import { ColorScheme } from "@/types/ColorScheme";

/* 注入依赖 */
const playMode = ref<PlayMode>(PlayMode.random); //播放模式
const playList = ref([]); //顺序播放列表
const playListShuffled = ref([]); //打乱后的播放列表
const playState = ref(false); //播放状态
const currentSonglist = ref<string | null>(null); //当前歌单名称
const currentMusic = ref<string | null>(null); //当前播放音乐
const currentTime = ref(0); //当前播放时间
const currentDuration = ref(0); //当前播放音乐时长
const volume = ref(0.8); //音量
const colorScheme = ref<ColorScheme>(ColorScheme.auto); //颜色风格

provide("playMode", playMode);
provide("playList", playList);
provide("playListShuffled", playListShuffled);
provide("playState", playState);
provide("currentMusic", currentMusic);
provide("currentSonglist", currentSonglist);
provide("currentTime", currentTime);
provide("currentDuration", currentDuration);
provide("volume", volume);
provide("colorScheme", colorScheme);

/* 同步设置 */
//播放模式
if (
  localStorage.playMode &&
  Object.values(PlayMode).includes(localStorage.playMode)
)
  playMode.value = localStorage.playMode;
localStorage.playMode = playMode.value;

watch(playMode, (newVal) => {
  localStorage.playMode = newVal;
});

//音量
if (localStorage.volume && !isNaN(+localStorage.volume))
  volume.value = +localStorage.volume;
localStorage.volume = volume.value;

watch(volume, (newVal) => {
  localStorage.volume = newVal;
});

//颜色模式
if (
  localStorage.colorScheme &&
  Object.keys(ColorScheme).includes(localStorage.colorScheme)
)
  colorScheme.value = localStorage.colorScheme;
localStorage.colorScheme = colorScheme.value;

watch(colorScheme, (newVal) => {
  localStorage.colorScheme = newVal;
  if (newVal == ColorScheme.auto) updateColor();
  else rootElem.dataset.colorScheme = newVal;
});

/* 颜色模式 */
const rootElem = document.querySelector(":root") as HTMLElement; //根元素

//更新颜色风格
function updateColor() {
  if (colorScheme.value != ColorScheme.auto) return;

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
@import "@/assets/template.scss";

.window {
  width: 100%;
  height: 100%;

  .content {
    @include flex(column);
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
