<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import * as musicController from "@/ts/musicController"; //音乐播放控制

/* 获取依赖 */
const currentMusic = inject("currentMusic") as Ref<string | null>; //当前播放音乐
const currentTime = inject("currentTime") as Ref<number>; //当前播放时间
const currentDuration = inject("currentDuration") as Ref<number>; //当前音乐时长

/* 计算播放进度style */
const progressStyle = computed(() => {
  return {
    width: `${(currentTime.value / currentDuration.value) * 100}%`,
  };
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
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    //左箭头 快退5s
    //ctrl+左箭头 上一首
    case "ArrowLeft":
      if (!event.ctrlKey) {
        currentTime.value -= 5;
        if (currentTime.value < 0) currentTime.value = 0;

        musicController.setCurrentTime(currentTime.value);
        event.preventDefault();
      }
      break;

    //右箭头 快进5s
    //ctrl+右箭头 下一首
    case "ArrowRight":
      if (!event.ctrlKey) {
        currentTime.value += 5;
        if (currentTime.value > currentDuration.value)
          currentTime.value = currentDuration.value;

        musicController.setCurrentTime(currentTime.value);
        event.preventDefault();
      }
      break;
  }
});
</script>

<template>
  <div class="timeInfo">
    <span>{{ formatTime(currentTime) }}</span>
    <div class="progressBar" @click="setCurrentTime">
      <div class="thumb" :style="progressStyle"></div>
    </div>
    <span>{{ formatTime(currentDuration) }}</span>
  </div>
</template>

<style scoped lang="scss">
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
</style>
