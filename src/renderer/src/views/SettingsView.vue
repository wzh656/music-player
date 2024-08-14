<script setup lang="ts">
import { inject, type Reactive, type Ref } from "vue";
import { ColorScheme } from "@/types/ColorScheme";
import { ThemeColor } from "@/types/ThemeColor";
import { getLightenColor } from "@/ts/colorCalc";

/* 获取依赖 */
const songLists = inject("songLists") as Reactive<SongLists>; //歌单列表
const colorScheme = inject("colorScheme") as Ref<ColorScheme>; //色彩模式
const themeColor = inject("themeColor") as Ref<ThemeColor>; //色彩模式

/* 切换颜色模式 */
function switchColorScheme(scheme: ColorScheme) {
  colorScheme.value = scheme;
}

/* 切换主题色 */
function switchThemeColor(color: ThemeColor) {
  themeColor.value = color;
  document.documentElement.style.setProperty("--color-theme", color);
  document.documentElement.style.setProperty(
    "--color-theme-mute",
    getLightenColor(color, 0.4),
  );
  document.documentElement.style.setProperty(
    "--color-theme-soft",
    getLightenColor(color, 0.8),
  );
}

/* 浏览路径 */
async function browsePath(listIndex: number, pathIndex: number) {
  const path = songLists![listIndex].paths[pathIndex];
  const { canceled, filePaths } = await window.electron.browseDir(path);
  console.log("[onBrowseDir]", canceled, filePaths);
  if (canceled) return;
  songLists![listIndex].paths[pathIndex] = filePaths[0];
}

/* 删除路径 */
function removePath(listIndex: number, index: number) {
  if (songLists![listIndex].paths.length <= 1) return;
  songLists![listIndex].paths.splice(index, 1);
}

/* 添加文件路径 */
async function addFilePath(listIndex: number) {
  const { canceled, filePaths } = await window.electron.browseFiles();
  if (canceled) return;
  const uniquePaths = filePaths.filter(
    (path) => !songLists![listIndex].paths.includes(path),
  ); //去除重复路径
  songLists![listIndex].paths.push(...uniquePaths);
}

/* 添加文件夹路径 */
async function addDirPath(listIndex: number) {
  const { canceled, filePaths } = await window.electron.browseDir();
  if (canceled) return;
  if (songLists![listIndex].paths.includes(filePaths[0])) return;
  songLists![listIndex].paths.push(filePaths[0]);
}

/* 删除歌单 */
function removeSongList(listIndex: number) {
  const listName = songLists![listIndex].name;
  if (!confirm(`确定要删除歌单“${listName}”吗？\n该操作不可撤回`)) return;
  console.log(songLists);
  songLists?.splice(listIndex, 1);
}

/* 添加歌单 */
function addSongList() {
  songLists!.push({
    name: "我的歌单",
    paths: [],
    editing: true,
  });
}
</script>

<template>
  <div class="help">
    <label>帮助</label>
    <div class="buttonGroup">
      <button>使用说明</button>
      <button>关于</button>
    </div>
  </div>
  <div class="colorScheme">
    <label>色彩模式</label>
    <div class="buttonGroup">
      <button
        :active="colorScheme == ColorScheme.auto"
        @click="switchColorScheme(ColorScheme.auto)"
      >
        跟随系统
      </button>
      <button
        :active="colorScheme == ColorScheme.light"
        @click="switchColorScheme(ColorScheme.light)"
      >
        浅色
      </button>
      <button
        :active="colorScheme == ColorScheme.dark"
        @click="switchColorScheme(ColorScheme.dark)"
      >
        深色
      </button>
    </div>
  </div>
  <div class="themeColor">
    <label>主题色</label>
    <div class="buttonGroup">
      <button
        :class="['red', themeColor == ThemeColor.red ? 'active' : '']"
        @click="switchThemeColor(ThemeColor.red)"
      >
        网易红
      </button>
      <button
        class="pink"
        :class="['pink', themeColor == ThemeColor.pink ? 'active' : '']"
        @click="switchThemeColor(ThemeColor.pink)"
      >
        B站粉
      </button>
      <button
        class="green"
        :class="['green', themeColor == ThemeColor.green ? 'active' : '']"
        @click="switchThemeColor(ThemeColor.green)"
      >
        微信绿
      </button>
      <button
        class="blue"
        :class="['blue', themeColor == ThemeColor.blue ? 'active' : '']"
        @click="switchThemeColor(ThemeColor.blue)"
      >
        知乎蓝
      </button>
      <button
        class="cyan"
        :class="['cyan', themeColor == ThemeColor.cyan ? 'active' : '']"
        @click="switchThemeColor(ThemeColor.cyan)"
      >
        Tap青
      </button>
    </div>
  </div>
  <div class="songLists">
    <label>歌单设置</label>
    <div v-for="(songList, listIndex) in songLists" :key="listIndex">
      <p>
        <span
          v-if="!songList.editing"
          @click.right="songList.editing = true"
          @click="songList.folded = !songList.folded"
        >
          {{ songList.name }}
        </span>
        <input
          v-if="songList.editing"
          v-model="songList.name"
          type="text"
          spellcheck="false"
          @blur="songList.editing = false"
          @keydown.stop
          @keydown.enter="songList.editing = false"
        />
      </p>
      <ul v-show="!songList.folded">
        <li v-for="(path, pathIndex) in songList.paths" :key="pathIndex">
          <input
            v-model="songList.paths[pathIndex]"
            type="text"
            spellcheck="false"
            @keydown.stop
          />
          <button
            class="outlineButton"
            @click="browsePath(listIndex, pathIndex)"
          >
            浏览
          </button>
          <button
            class="outlineButton"
            :disabled="songList.paths.length <= 1"
            @click="removePath(listIndex, pathIndex)"
          >
            删除
          </button>
        </li>
        <li>
          <button class="outlineButton" @click="addFilePath(listIndex)">
            添加文件
          </button>
          <button class="outlineButton" @click="addDirPath(listIndex)">
            添加文件夹
          </button>
        </li>
      </ul>
      <button
        v-show="!songList.folded"
        class="solidButton"
        @click="removeSongList(listIndex)"
      >
        删除歌单
      </button>
    </div>
    <button class="solidButton largeButton" @click="addSongList">
      添加歌单
    </button>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/template.scss";

//标签
div {
  margin: 0.5rem 0;

  label {
    display: block;
    margin: 1rem;
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
  }
  .buttonGroup {
    @include flex(row);
    justify-content: center;
    gap: 0.5rem;
  }
}

//帮助
.help {
  .buttonGroup {
    button {
      padding: 5px 10px;
      @include primaryButtonOutline;
    }
  }
}

//颜色模式
.colorScheme {
  .buttonGroup {
    button {
      padding: 5px 10px;
      @include primaryButtonOutline;

      &[active="true"] {
        background-color: var(--color-theme);
        color: var(--vt-c-white);
      }
    }
  }
}

//主题色
.themeColor {
  .buttonGroup {
    button {
      padding: 5px 10px;
    }

    button.red {
      @include customButtonOutline(#f50100);
      &.active {
        @include customButton(#f50100);
      }
    }

    button.pink {
      @include customButtonOutline(#fe65a6);
      &.active {
        @include customButton(#fe65a6);
      }
    }

    button.green {
      @include customButtonOutline(#1aad19);
      &.active {
        @include customButton(#1aad19);
      }
    }

    button.blue {
      @include customButtonOutline(#0c6dfe);
      &.active {
        @include customButton(#0c6dfe);
      }
    }

    button.cyan {
      @include customButtonOutline(#00d9c5);
      &.active {
        @include customButton(#00d9c5);
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
    width: 100%;
    margin: 1rem 0;
    padding-left: 1rem;

    //歌单名称
    p {
      border-left: 5px solid var(--color-border);
      padding-left: 5px;

      span {
        color: var(--color-text);
      }
      input {
        padding: 5px 10px;
        @include primaryInput;
      }
    }

    //歌单路径列表
    ul {
      padding-left: 1rem;
      border-left: 2px solid var(--color-border);
      border-bottom-left-radius: 5px;

      li {
        display: block;
        padding-top: 0.5rem;
        @include flex(row);
        gap: 1rem;

        input {
          padding: 5px 10px;
          @include primaryInput;
        }

        button[disabled] {
          cursor: not-allowed;
          &:hover {
            background-color: transparent;
            color: var(--color-theme);
          }
        }
      }

      li:last-of-type {
        padding-bottom: 0.5rem;
      }
    }
  }
}
</style>
