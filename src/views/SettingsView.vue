<script setup lang="ts">
import { inject, ref, type Ref } from "vue";
import { ColorScheme } from "@/types/ColorScheme";

/* 获取依赖 */
const colorScheme = inject("colorScheme") as Ref<ColorScheme>; //色彩模式

/* 切换颜色模式 */
const switchColorScheme = (scheme: ColorScheme) => {
  colorScheme.value = scheme;
};

/* 获取歌单列表 */
let songLists: Ref<SongLists | null> = ref(null);
window?.electron?.getSongLists().then((list: SongLists) => {
  songLists.value = list;
});
</script>

<template>
  <!-- <div class="view"> -->
  <div class="colorScheme">
    <label>色彩模式</label>
    <div class="buttonGroup">
      <button
        @click="switchColorScheme(ColorScheme.auto)"
        :active="colorScheme == ColorScheme.auto"
      >
        跟随系统
      </button>
      <button
        @click="switchColorScheme(ColorScheme.light)"
        :active="colorScheme == ColorScheme.light"
      >
        浅色
      </button>
      <button
        @click="switchColorScheme(ColorScheme.dark)"
        :active="colorScheme == ColorScheme.dark"
      >
        深色
      </button>
    </div>
  </div>
  <div class="songLists">
    <label>歌单列表</label>
    <div v-for="(songInfo, listName) in songLists" :key="listName">
      <p>{{ listName }}</p>
      <ul>
        <li v-for="(path, index) in songInfo.paths" :key="index">
          <input
            type="text"
            v-model="songInfo.paths[index]"
            spellcheck="false"
            @keydown.stop
          />
          <button class="outlineButton">浏览</button>
          <button class="outlineButton">删除</button>
        </li>
        <li><button class="outlineButton">添加路径</button></li>
      </ul>
      <button class="solidButton">删除歌单</button>
    </div>
    <button class="solidButton largeButton">添加歌单</button>
  </div>
  <!-- </div> -->
</template>

<style scoped lang="scss">
@import "@/assets/template.scss";

/* .view {
  flex: auto;
  width: 100%;
  // height: 100%;
  @include flex(column);
  gap: 1rem;
  align-items: center;
  @include customScrollbar;
 */

//标签
div {
  label {
    display: block;
    margin: 1rem;
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
  }
}

//颜色模式
.colorScheme {
  @include flex(column);

  .buttonGroup {
    margin: 0 auto;

    button {
      margin: 0 0.5rem;
      padding: 5px 10px;
      border-radius: 5px;
      @include primaryButtonOutline;
      transition:
        background-color 0.3s,
        color 0.3s;
      cursor: pointer;

      &[active="true"] {
        background-color: var(--color-theme);
        color: var(--vt-c-white);
      }
    }
  }
}

//歌单
.songLists {
  @include flex(column);
  align-items: center;

  button.solidButton {
    padding: 5px 10px;
    @include primaryButton;
  }

  button.outlineButton {
    padding: 5px 10px;
    @include primaryButtonOutline;
  }

  button.largeButton {
    width: 80%;
    max-width: 10rem;
  }

  div {
    margin: 1rem 0;

    p {
      color: var(--color-text);
      // margin: 0.5rem;
      // margin-left: 0;
      padding-left: 5px;
      border-left: 5px solid var(--color-text);
    }

    ul {
      padding-left: 1rem;
      border-left: 2px solid var(--color-border);
      border-bottom-left-radius: 5px;

      li {
        display: block;
        padding: 0.5rem;
        @include flex(row);
        gap: 1rem;

        input {
          padding: 5px 10px;
          @include primaryInput;
        }
      }
    }
  }
}
// }
</style>
