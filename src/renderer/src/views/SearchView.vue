<script setup lang="ts">
import { inject, nextTick, reactive, ref, type Ref } from "vue";
// import { PlayMode } from "@/types/PlayMode";
import { MusicPlatform } from "@/types/MusicPlatform"; //音乐平台
import * as musicController from "@/ts/musicController"; //音乐播放控制器
import { getBvid, bv2av } from "@/ts/bilibiliAPI";

/* 获取依赖 */
// const playMode = inject("playMode") as Ref<PlayMode>; //播放列表
const playList = inject("playList") as Ref<string[]>; //播放列表
const playListShuffled = inject("playListShuffled") as Ref<string[]>; //打乱后的播放列表
const playState = inject("playState") as Ref<boolean>; //播放状态
const currentSonglist = inject("currentSonglist") as Ref<string | null>; //当前歌单名称
const currentMusic = inject("currentMusic") as Ref<string | null>; //当前播放歌曲
const currentTime = inject("currentTime") as Ref<number>; //当前播放时间
const currentDuration = inject("currentDuration") as Ref<number>; //当前音乐时长
const currentLyrics = inject("currentLyrics") as Ref<string | null>; //当前音乐歌词
const volume = inject("volume") as Ref<number>; //音量

/* 切换平台 */
const currentPlatform = ref<MusicPlatform>(MusicPlatform.WY);
function switchPlatform(platform: MusicPlatform) {
  currentPlatform.value = platform;
}

/* Enter 搜索 */
function onEnter(event: KeyboardEvent) {
  const input = event.currentTarget as HTMLInputElement;
  const value = input.value;
  search(value);
  input.blur(); //失去焦点
}

function onEnterBilibili(event: KeyboardEvent) {
  const input = event.currentTarget as HTMLInputElement;
  const value = input.value.trim();
  searchBilibili(value);
  input.blur(); //失去焦点
}

/* 搜索 */
const searchData = reactive<SearchDataItem[]>([]);
const searching = ref(false); //是否正在搜索
async function search(keyword: string, page: number = 1) {
  searching.value = true; //正在搜索

  const data = await window.electron.search(
    keyword,
    currentPlatform.value,
    page,
  ); //搜索
  searching.value = false; //搜索完成
  if (data.code != 200 || data.error != "") return;

  //更新搜索结果
  searchData.splice(0, searchData.length);
  searchData.push(...data.data);
}
/* window.electron.onSearchData((data) => {
  console.log("[onSearchData]", data);
  if (data.code != 200 || data.error != "") return;
  searchData.push(...data.data);
  searching.value = false;
}); */

/* bilibili搜索 */
const searchDataBilibili = reactive<SearchDataBilibili>([]);
async function searchBilibili(value: string) {
  searching.value = true;

  const bvid = await getBvid(value);
  console.log(bvid);
  if (!bvid || bvid.length != 12 || !bvid.startsWith("BV1")) {
    searching.value = false;
    return alert("无效的视频链接或bvid");
  }
  const avid = bv2av(bvid as `BV1${string}`);
  const data = await window.electron.searchBilibili(avid);

  searching.value = false;

  if (data == null) return alert("获取视频信息失败");

  searchDataBilibili.splice(0, searchDataBilibili.length);
  searchDataBilibili.push(...data);
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
  currentLyrics.value = item.lrc; //设为当前歌词
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
  vipDialogId = window.setTimeout(() => (vipDialogShow.value = false), 2000);
}

/* 格式化时间 */
function formatTime(sec: number) {
  const minutes = ~~((sec / 60) % 60) + "";
  const seconds = ~~(sec % 60) + "";
  if (sec > 3600) {
    //超过1h的音频显示小时
    const hours = ~~(sec / 3600) + "";
    return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  } else {
    return `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  }
}
</script>

<template>
  <h1>音乐搜索</h1>
  <div class="platform">
    <div
      class="radio"
      :active="currentPlatform == MusicPlatform.WY"
      @click="switchPlatform(MusicPlatform.WY)"
    >
      <div></div>
      <span>网易云</span>
    </div>
    <div
      class="radio"
      :active="currentPlatform == MusicPlatform.KG"
      @click="switchPlatform(MusicPlatform.KG)"
    >
      <div></div>
      <span>酷狗</span>
    </div>
    <div
      class="radio"
      :active="currentPlatform == MusicPlatform.QQ"
      @click="switchPlatform(MusicPlatform.QQ)"
    >
      <div></div>
      <span>QQ音乐</span>
    </div>
    <div
      class="radio"
      :active="currentPlatform == MusicPlatform.BL"
      @click="switchPlatform(MusicPlatform.BL)"
    >
      <div></div>
      <span>Bilibili</span>
    </div>
  </div>
  <input
    v-if="currentPlatform != MusicPlatform.BL"
    type="text"
    placeholder="请输入歌曲名或歌手名，回车搜索"
    spellcheck="false"
    @keydown.stop
    @keydown.enter="onEnter"
  />
  <input
    v-if="currentPlatform == MusicPlatform.BL"
    type="text"
    placeholder="请输入B站视频链接或bvid，回车搜索"
    spellcheck="false"
    @keydown.stop
    @keydown.enter="onEnterBilibili"
  />
  <div v-if="searching" class="searching">搜索中，请等待……</div>
  <div v-if="currentPlatform != MusicPlatform.BL" class="result">
    <template v-for="(item, index) in searchData" :key="item.songid">
      <span
        data-type="index"
        @mouseenter="onmouseenter"
        @mouseleave="onmouseleave"
        @click="playMusic(item)"
      >
        {{ index + 1 }}
      </span>
      <span
        data-type="name"
        @mouseenter="onmouseenter"
        @mouseleave="onmouseleave"
        @click="playMusic(item)"
      >
        {{ item.title }}
      </span>
      <span
        data-type="author"
        @mouseenter="onmouseenter"
        @mouseleave="onmouseleave"
        @click="playMusic(item)"
      >
        {{ item.author }}
      </span>
      <button @click="downloadMusic(item)">下载音乐</button>
      <button @click="downloadLyrics(item)">下载歌词</button>
    </template>
  </div>
  <div v-if="currentPlatform == MusicPlatform.BL" class="result">
    <template v-for="item in searchDataBilibili" :key="item.page">
      <span
        data-type="index"
        @mouseenter="onmouseenter"
        @mouseleave="onmouseleave"
      >
        {{ item.page }}
      </span>
      <span
        data-type="name"
        @mouseenter="onmouseenter"
        @mouseleave="onmouseleave"
      >
        {{ item.part }}
      </span>
      <span
        data-type="author"
        @mouseenter="onmouseenter"
        @mouseleave="onmouseleave"
      >
        {{ formatTime(item.duration) }}
      </span>
      <button @click="">下载音乐</button>
      <button @click="">下载歌词</button>
    </template>
  </div>
  <Transition name="fade">
    <div v-if="vipDialogShow" class="prop" @click="vipDialogShow = false">
      会员歌曲，无法操作
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@import "@/assets/template.scss";

h1 {
  text-align: center;
}

//单选框
.platform {
  @include flex(row);
  justify-content: center;

  .radio {
    @include flex(row);
    align-items: center;
    padding: 0 0.5rem;
    cursor: pointer;

    div {
      width: 1rem;
      height: 1rem;
      margin: 0 0.25rem;
      border-radius: 100%;
      border: 3px solid var(--color-theme);
      transition: background-color 0.3s;
    }
    &[active="true"] div {
      background-color: var(--color-theme);
    }
  }
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
