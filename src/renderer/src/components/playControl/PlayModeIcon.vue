<script setup lang="ts">
import { inject, type Ref } from "vue";
import sequenceIcon from "@/assets/icons/sequenceIcon.vue";
import loopIcon from "@/assets/icons/loopIcon.vue";
import randomIcon from "@/assets/icons/randomIcon.vue";
import { PlayMode } from "@/types/PlayMode"; //播放模式类型
import shuffleArray from "@/ts/shuffleArray"; //原地打乱数组

/* 获取依赖 */
const playMode = inject("playMode") as Ref<PlayMode>; //播放模式
const playListShuffled = inject("playListShuffled") as Ref<string[]>; //打乱后的播放列表

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
  <div class="buttonGroup">
    <Transition name="slide">
      <sequenceIcon
        v-show="playMode == PlayMode.sequence"
        @click="switchPlayMode"
      ></sequenceIcon>
    </Transition>
    <Transition name="slide">
      <loopIcon
        v-show="playMode == PlayMode.loop"
        @click="switchPlayMode"
      ></loopIcon>
    </Transition>
    <Transition name="slide">
      <randomIcon
        v-show="playMode == PlayMode.random"
        @click="switchPlayMode"
      ></randomIcon>
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

/* 滑动动画 */
.slide-enter-active,
.slide-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s ease-out;
}
.slide-leave-active {
  position: absolute;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
