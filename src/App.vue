<script setup lang="ts">
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
</script>

<template>
  <WindowApp class="window">
    <template #title>Music Player</template>
    <template #content>
      <section class="content">
        <pageView class="pageView"></pageView>
        <PlayController></PlayController>
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
      height: 100%;
    }
  }
}
</style>
