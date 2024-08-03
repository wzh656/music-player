<script setup lang="ts">
import WindowApp from "@/components/WindowApp.vue";
import PlayController from "./components/PlayController.vue";

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
</script>

<template>
  <WindowApp class="window">
    <template #title>Music Player</template>
    <template #content>
      <section>
        <PlayController></PlayController>
      </section>
    </template>
  </WindowApp>
</template>

<style scoped>
.window {
  width: 100%;
  height: 100%;
}
</style>
