<script setup lang="ts">
import { computed, inject, ref, type Ref } from "vue";
import volumeIcon from "@/assets/icons/volumeIcon.vue";

/* 获取依赖 */
const volume = inject("volume") as Ref<number>; //音量

/* 音量控制 */
//音量条显示
const volumeControlVisible = ref(false);
function showVolumeControl() {
  volumeControlVisible.value = true;
}
function hideVolumeControl() {
  volumeControlVisible.value = false;
}

//音量条样式
const volumeStyle = computed(() => {
  return {
    height: `${volume.value * 100}%`,
  };
});

//调节音量
const volumeBarElem = ref<HTMLDivElement | null>(null);
const volumeBarDown = ref(false); //鼠标按下时方可调节
function volumeMouseDown() {
  volumeBarDown.value = true;
}
document.addEventListener("mouseup", function () {
  volumeBarDown.value = false; //全局释放鼠标均可触发
});
document.addEventListener("mousemove", function (event: MouseEvent) {
  if (!volumeBarDown.value) return;

  const { top, height } = volumeBarElem.value!.getBoundingClientRect();
  let volumeValue = 1 - (event.pageY - top) / height;
  if (volumeValue < 0.03) volumeValue = 0;
  if (volumeValue > 0.97) volumeValue = 1;
  volumeValue = +volumeValue.toFixed(2);
  volume.value = volumeValue;
  console.log("[volumeChange]", volumeValue);
});

/* 键盘控制 */
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    //上箭头 音量增加
    case "ArrowUp":
      volume.value += 0.1;
      volume.value = +volume.value.toFixed(2);
      if (volume.value > 1) volume.value = 1;
      console.log("[volumeChange]", volume.value);
      event.preventDefault();
      break;

    //下箭头 音量减少
    case "ArrowDown":
      volume.value -= 0.1;
      volume.value = +volume.value.toFixed(2);
      if (volume.value < 0) volume.value = 0;
      console.log("[volumeChange]", volume.value);
      event.preventDefault;
      break;
  }
});
</script>
<template>
  <div
    class="buttonGroup"
    @mouseenter="showVolumeControl"
    @mouseleave="hideVolumeControl"
  >
    <volumeIcon></volumeIcon>
    <Transition name="fade">
      <div
        class="volumeControl"
        v-show="volumeControlVisible || volumeBarDown"
        @mousedown="volumeMouseDown"
      >
        <div class="volumeBar" ref="volumeBarElem">
          <div class="thumb" :style="volumeStyle"></div>
        </div>
      </div>
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
}

.volumeControl {
  position: absolute;
  transform: translateY(-80px);
  padding: 0.5rem 1rem;
  background-color: var(--color-background-mute);
  border-radius: 5px;
  cursor: pointer;

  .volumeBar {
    width: 5px;
    height: 100px;
    background-color: var(--color-theme-soft);
    border-radius: 5px;
    display: flex;
    align-items: end;

    .thumb {
      width: 100%;
      height: 80%;
      background-color: var(--color-theme);
      border-radius: 5px;
    }
  }
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
