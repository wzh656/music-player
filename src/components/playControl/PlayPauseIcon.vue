<script setup lang="ts">
import { inject, type Ref } from "vue";
import playIcon from "@/assets/icons/playIcon.vue";
import stopIcon from "@/assets/icons/stopIcon.vue";
import * as musicController from "@/ts/musicController"; //音乐播放控制

/* 获取依赖 */
const playState = inject("playState") as Ref<boolean>; //播放状态
const currentMusic = inject("currentMusic") as Ref<string | null>; //当前播放音乐

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

/* 键盘控制 */
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    //空格 暂停播放
    case " ":
      playState.value ? pause() : play();
      event.preventDefault();
      break;
  }
});
</script>

<template>
  <div class="buttonGroup">
    <Transition name="fade">
      <playIcon @click="play" v-show="!playState" />
    </Transition>
    <Transition name="fade">
      <stopIcon @click="pause" v-show="playState" />
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.buttonGroup {
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  width: 50px;
  height: 50px;
  cursor: pointer;
  background-color: var(--color-theme);
  border-radius: 100%;
  stroke: white;
  fill: white;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-leave-active {
  position: absolute;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
