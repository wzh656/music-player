<script setup lang="ts">
import { ref } from "vue";
import closeIcon from "@/assets/icons/closeIcon.vue";
import maximizeIcon from "@/assets/icons/maximizeIcon.vue";
import minimizeIcon from "@/assets/icons/minimizeIcon.vue";
import unmaximizeIcon from "@/assets/icons/unmaximizeIcon.vue";

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
if (window?.electron?.onChangeMaximum)
  window.electron.onChangeMaximum((value: boolean) => {
    isMaximized.value = value;
  });

//关闭窗口
function close() {
  window.close();
}
</script>

<template>
  <header>
    <img class="logo" src="/favicon.ico" />
    <div class="title"><slot></slot></div>
    <div class="buttons">
      <minimizeIcon @click="minimize" />
      <maximizeIcon @click="switchMaximum" v-if="!isMaximized" />
      <unmaximizeIcon @click="switchMaximum" v-if="isMaximized" />
      <closeIcon @click="close" class="red" />
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
