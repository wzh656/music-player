<script setup lang="ts">
import { inject, nextTick, reactive, ref, type Ref } from "vue";
// import { PlayMode } from "@/types/PlayMode";
import * as musicController from "@/ts/musicController"; //音乐播放控制器

/* 获取依赖 */
// const playMode = inject("playMode") as Ref<PlayMode>; //播放列表
const playList = inject("playList") as Ref<string[]>; //播放列表
const playListShuffled = inject("playListShuffled") as Ref<string[]>; //打乱后的播放列表
const playState = inject("playState") as Ref<boolean>; //播放状态
const currentSonglist = inject("currentSonglist") as Ref<string | null>; //当前歌单名称
const currentMusic = inject("currentMusic") as Ref<string | null>; //当前播放歌曲
const currentTime = inject("currentTime") as Ref<number>; //当前播放时间
const currentDuration = inject("currentDuration") as Ref<number>; //当前音乐时长
const volume = inject("volume") as Ref<number>; //音量

/* Enter 搜索 */
function onEnter(event: KeyboardEvent) {
  const input = event.currentTarget as HTMLInputElement;
  const value = input.value;
  search(value);
  input.blur(); //失去焦点
}

/* 搜索 */
const searchData = reactive<SearchDataItem[]>([]);
const searching = ref(false); //是否正在搜索
function search(keyword: string, page: number = 1) {
  window.electron.search(keyword, page); //搜索
  searchData.splice(0, searchData.length); //清空结果
  searching.value = true;

  window.electron.onSearchData((data) => {
    console.log("[onSearchData]", data);
    if (data.code != 200 || data.error != "") return;
    searchData.push(...data.data);
    searching.value = false;
  });
}

/* 高亮 */
function onmouseenter(event: MouseEvent) {
  const target = event.target as HTMLSpanElement;
  target.className = "active";
  switch (target.dataset.type) {
    case "index": {
      const next = target.nextSibling as HTMLSpanElement;
      const nextNext = next.nextSibling as HTMLSpanElement;
      next.className = "active";
      nextNext.className = "active";
      break;
    }
    case "name": {
      const next = target.nextSibling as HTMLSpanElement;
      const previous = target.previousSibling as HTMLSpanElement;
      next.className = "active";
      previous.className = "active";
      break;
    }
    case "author": {
      const previous = target.previousSibling as HTMLSpanElement;
      const previousPrevious = previous.previousSibling as HTMLSpanElement;
      previous.className = "active";
      previousPrevious.className = "active";
      break;
    }
  }
}

function onmouseleave(event: MouseEvent) {
  const target = event.target as HTMLSpanElement;
  target.className = "";
  switch (target.dataset.type) {
    case "index": {
      const next = target.nextSibling as HTMLSpanElement;
      const nextNext = next.nextSibling as HTMLSpanElement;
      next.className = "";
      nextNext.className = "";
      break;
    }
    case "name": {
      const next = target.nextSibling as HTMLSpanElement;
      const previous = target.previousSibling as HTMLSpanElement;
      next.className = "";
      previous.className = "";
      break;
    }
    case "author": {
      const previous = target.previousSibling as HTMLSpanElement;
      const previousPrevious = previous.previousSibling as HTMLSpanElement;
      previous.className = "";
      previousPrevious.className = "";
      break;
    }
  }
}

/* 判断vip歌曲 */
async function isVip(item: SearchDataItem) {
  const response = await fetch(item.url);
  return response.url == "https://music.163.com/404";
}

/* 播放音乐 */
async function playMusic(item: SearchDataItem) {
  if (await isVip(item)) return vipDialog();

  currentMusic.value = item.url; //设为当前播放
  playList.value = [item.url]; //设为播放列表
  playListShuffled.value = [item.url]; //设为打乱后的播放列表
  currentSonglist.value = item.title; //设为当前歌单名称
  // playMode.value = PlayMode.loop; //循环播放
  musicController.playMusic(currentMusic.value, {
    volume,
    currentTime,
    duration: currentDuration,
  }); //播放
  playState.value = true; //设为播放状态
}

/* 下载音乐 */
async function downloadMusic(item: SearchDataItem) {
  if (await isVip(item)) {
    window.electron.openUrl(`https://music.163.com/#/song?id=${item.songid}`);
    return vipDialog();
  }

  window.electron.downloadFile(item.url, item.title + ".mp3");
}

/* 下载歌词 */
// const txtMime = "data:application/octet-stream,";
function downloadLyrics(item: SearchDataItem) {
  window.electron.downloadText(item.lrc, item.title + ".lrc");
}

/* vip弹窗 */
const vipDialogShow = ref(false);
let vipDialogId: number | null = null;
function vipDialog() {
  vipDialogShow.value = false;
  nextTick(() => (vipDialogShow.value = true));

  if (vipDialogId) clearTimeout(vipDialogId);
  vipDialogId = setTimeout(() => (vipDialogShow.value = false), 2000);
}
</script>

<template>
  <h1>音乐搜索</h1>
  <input
    type="text"
    placeholder="请输入歌曲名或歌手名，回车搜索"
    @keydown.stop
    @keydown.enter="onEnter"
  />
  <div class="searching" v-if="searching">搜索中，请等待……</div>
  <div class="result">
    <template v-for="(item, index) in searchData" :key="item.songid">
      <span
        @mouseenter="onmouseenter"
        @mouseleave="onmouseleave"
        @click="playMusic(item)"
        data-type="index"
      >
        {{ index + 1 }}
      </span>
      <span
        @mouseenter="onmouseenter"
        @mouseleave="onmouseleave"
        @click="playMusic(item)"
        data-type="name"
      >
        {{ item.title }}
      </span>
      <span
        @mouseenter="onmouseenter"
        @mouseleave="onmouseleave"
        @click="playMusic(item)"
        data-type="author"
      >
        {{ item.author }}
      </span>
      <button @click="downloadMusic(item)">下载音乐</button>
      <button @click="downloadLyrics(item)">下载歌词</button>
    </template>
  </div>
  <Transition name="fade">
    <div class="prop" v-if="vipDialogShow" @click="vipDialogShow = false">
      会员歌曲，无法操作
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@import "@/assets/template.scss";

h1 {
  text-align: center;
}

//搜索框
input {
  flex: none;
  width: 80%;
  height: 2em;
  margin: 1rem auto;
  padding: 1rem;
  @include primaryInput;
}

//搜索中提示
.searching {
  text-align: center;
}

//搜索结果
.result {
  flex: auto;
  width: 100%;
  height: 100%;
  /* margin-bottom: 3rem; */
  padding: 0;

  display: grid;
  grid-template-columns: 2rem 1fr 1fr 4rem 4rem;
  // gap: 1rem;
  overflow-x: hidden;
  overflow-y: overlay;
  @include customScrollbar;

  span {
    padding: 0.5rem;
    text-align: center;
    cursor: pointer;

    &.active {
      background-color: var(--color-background-soft);
    }
  }

  button {
    width: 3rem;
    height: 3rem;
    margin: 0.5rem;
    @include primaryButtonOutline;
    & {
      border-radius: 100%;
    }
  }
}

//vip弹出框
.prop {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  width: max-content;
  line-height: 1.2em;
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
  font-size: 1.2em;
  color: var(--color-theme);
  background-color: var(--color-background-soft);
  box-shadow: 0 0 5px #88888888;
}

//淡入动画，淡出无动画
.fade-enter-active {
  transition:
    opacity 0.3s,
    margin-top 0.3s;
}
.fade-enter-from {
  opacity: 0;
  margin-top: -30px;
}
/* .fade-leave-to {
  opacity: 0;
  margin-top: 5px;
} */
</style>
