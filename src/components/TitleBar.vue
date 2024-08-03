<script setup lang="ts">
import { ref } from "vue";

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
      <img @click="minimize" src="@/assets/icons/minimize.svg" />
      <img
        @click="switchMaximum"
        v-if="!isMaximized"
        src="@/assets/icons/maximize.svg"
      />
      <img
        @click="switchMaximum"
        v-if="isMaximized"
        src="@/assets/icons/unmaximize.svg"
      />
      <img @click="close" class="red" src="@/assets/icons/close.svg" />
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

    img {
      width: 50px;
      height: 50px;
      padding: 1rem;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--color-background-mute);
      }
      &.red:hover {
        background-color: red;
      }
    }
  }
}
</style>
