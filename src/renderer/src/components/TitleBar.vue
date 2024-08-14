<script setup lang="ts">
import { inject, ref, watch, type Ref } from "vue";
import closeIcon from "@/assets/icons/closeIcon.vue";
import maximizeIcon from "@/assets/icons/maximizeIcon.vue";
import minimizeIcon from "@/assets/icons/minimizeIcon.vue";
import unmaximizeIcon from "@/assets/icons/unmaximizeIcon.vue";
import { ThemeColor } from "@/types/ThemeColor";
import { hexToRgb, rgbToHsl } from "@/ts/colorCalc";

/* 获取依赖 */
const themeColor = inject("themeColor") as Ref<ThemeColor>; //色彩模式

/* 窗口最大化 */
//是否最大化
const isMaximized = ref(false);

//最小化出窗口
function minimize() {
  window.electron.minimize();
}

//切换最大化
function switchMaximum() {
  window.electron.switchMaximum();
  isMaximized.value = !isMaximized.value;
}

//最大化状态切换
// if (window?.electron?.onChangeMaximum)
window.electron.onChangeMaximum((value: boolean) => {
  isMaximized.value = value;
});

//“关闭”窗口
function close() {
  window.close();
}

/* logo颜色 */
const logoElem = ref<HTMLElement | null>(null);
watch(themeColor, (value) => {
  if (!logoElem.value) return;
  const rgb = hexToRgb(value);
  const hsl = rgbToHsl(rgb);
  let deg = hsl[0] * 360 - 0.9937611408199644;
  if (deg < 0) deg += 360;
  if (deg > 360) deg -= 360;
  logoElem.value.style.filter = `hue-rotate(${deg}deg)`;
});
</script>

<template>
  <header>
    <img ref="logoElem" class="logo" src="/favicon.ico" />
    <div class="title"><slot></slot></div>
    <div class="buttons">
      <minimizeIcon @click="minimize" />
      <maximizeIcon v-if="!isMaximized" @click="switchMaximum" />
      <unmaximizeIcon v-if="isMaximized" @click="switchMaximum" />
      <closeIcon class="red" @click="close" />
    </div>
  </header>
</template>

<style scoped lang="scss">
header {
  display: flex;
  width: 100%;
  height: 50px;
  -webkit-app-region: drag; //可拖拽

  .logo,
  .buttons {
    flex: none;
  }

  //窗口图标
  .logo {
    padding: 0.5rem;
    border-radius: 50%;
    transition: filter 0.3s;
  }

  //窗口标题
  .title {
    width: 100%;
    height: 100%;
    margin-left: 0.5rem;
    font-size: 20px;
    line-height: 50px;
  }

  //窗口按钮
  .buttons {
    display: flex;
    width: 150px;
    -webkit-app-region: none; //不可拖拽

    svg {
      width: 50px;
      height: 50px;
      padding: 1rem;
      stroke: var(--color-text);
      fill: var(--color-text);
      transition:
        //hover加粗红色
        background-color 0.3s,
        stroke-width 0.3s,
        //夜间模式切换
        stroke 0.3s,
        fill 0.3s;

      &:hover {
        background-color: var(--color-background-mute);
      }

      //关闭按钮
      &.red {
        stroke-width: 10;
      }
      &.red:hover {
        stroke: white;
        stroke-width: 30;
        background-color: red;
      }
    }
  }
}
</style>
