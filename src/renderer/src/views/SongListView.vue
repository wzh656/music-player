<script setup lang="ts">
import { inject, ref, watch, type Reactive, type Ref } from "vue";
import { PlayMode } from "@/types/PlayMode"; //播放模式
import * as musicController from "@/ts/musicController"; //音乐播放控制器
import shuffleArray from "@/ts/shuffleArray"; //原地打乱数组

/* 获取依赖 */
const songLists = inject("songLists") as Reactive<SongLists>; //歌单列表
const playMode = inject("playMode") as Ref<PlayMode>; //播放列表
const playList = inject("playList") as Ref<string[]>; //播放列表
const playListShuffled = inject("playListShuffled") as Ref<string[]>; //打乱后的播放列表
const playState = inject("playState") as Ref<boolean>; //播放状态
const currentSonglist = inject("currentSonglist") as Ref<string | null>; //当前歌单名称
const currentMusic = inject("currentMusic") as Ref<string | null>; //当前播放歌曲
const currentTime = inject("currentTime") as Ref<number>; //当前播放时间
const currentDuration = inject("currentDuration") as Ref<number>; //当前音乐时长
const volume = inject("volume") as Ref<number>; //音量大小

/* 获取歌单列表 */
window.electron.getSongLists().then((list: SongLists) => {
  songLists.splice(0, songLists.length);
  songLists.push(...list);
});
watch(songLists, () => {
  console.log("[updateSongLists]", songLists);
  window.electron.updateSongLists(JSON.stringify(songLists));
});

/* 播放音乐 */
function playMusic(music: string) {
  currentMusic.value = music; //设为当前播放
  musicController.playMusic(currentMusic.value, {
    volume,
    currentTime,
    duration: currentDuration,
  }); //播放
  playState.value = true; //设为播放状态
}

/* 主进程播放歌单 */
window.electron.onPlaySongList((index: number) => {
  songlistPlay(index);
});

/* 左键播放歌单 */
const currentSonglistIndex = ref<number>(-1); //当前歌单索引
async function songlistPlay(index: number) {
  if (!songLists) throw new Error("[songlistPlay] 歌单列表为空");

  const songListName = songLists[index].name; //歌单名称
  const songs = await window.electron.getSongListSongs(index); //获取所有歌曲
  songLists[index].num = songs.length; //更新歌单歌曲数量

  currentSonglistIndex.value = index; //设为当前歌单索引
  currentSonglist.value = songListName; //设为当前歌单名称
  playList.value = songs; //设为播放歌单
  playListShuffled.value = shuffleArray([...songs]); //设为打乱后的播放歌单

  //如果当前有播放歌曲，则暂停
  if (currentMusic.value) {
    musicController.pause();
    playState.value = false;
  }

  playMusic(
    playMode.value == PlayMode.random
      ? playListShuffled.value[0]
      : playList.value[0],
  ); //播放第一首歌曲
}

/* 右键歌单设置 */
const menuElem = ref<HTMLElement | null>(null); //菜单元素
const menuShow = ref(false); //菜单显示状态
const menuTarget = ref<number | null>(null); //菜单目标
function songlistMenu(event: MouseEvent, index: number) {
  if (!menuElem.value) return;
  menuShow.value = true; //显示菜单
  menuElem.value.style.left = `${event.layerX}px`;
  menuElem.value.style.top = `${event.layerY}px`;
  menuTarget.value = index; //设为菜单目标
}
document.addEventListener("click", () => {
  menuShow.value = false; //隐藏菜单
  menuTarget.value = null; //清除菜单目标
});

//上移
function moveUp() {
  if (menuTarget.value == null) return;
  if (menuTarget.value == 0) return;

  [songLists[menuTarget.value], songLists[menuTarget.value - 1]] = [
    songLists[menuTarget.value - 1],
    songLists[menuTarget.value],
  ];

  if (currentSonglistIndex.value == menuTarget.value)
    currentSonglistIndex.value -= 1;
  else if (currentSonglistIndex.value == menuTarget.value - 1)
    currentSonglistIndex.value += 1;

  menuTarget.value = null;
  menuShow.value = false;
}

//下移
function moveDown() {
  if (menuTarget.value == null) return;
  if (menuTarget.value == songLists.length - 1) return;

  [songLists[menuTarget.value], songLists[menuTarget.value + 1]] = [
    songLists[menuTarget.value + 1],
    songLists[menuTarget.value],
  ];

  if (currentSonglistIndex.value == menuTarget.value)
    currentSonglistIndex.value += 1;
  else if (currentSonglistIndex.value == menuTarget.value + 1)
    currentSonglistIndex.value -= 1;

  menuTarget.value = null;
  menuShow.value = false;
}
</script>

<template>
  <div v-if="!songLists">歌单加载中...</div>
  <div v-if="songLists.length == 0">暂无歌单，请先去设置中添加哦~</div>
  <ul v-if="songLists" class="songlists">
    <li
      v-for="(songList, index) in songLists"
      :key="index"
      :class="{ active: currentSonglistIndex == index }"
      @click="songlistPlay(index)"
      @contextmenu.prevent="songlistMenu($event, index)"
    >
      {{ songList.name }}
      <span v-if="songList.num">({{ songList.num }})</span>
    </li>
  </ul>
  <ul v-show="menuShow" ref="menuElem" class="menu">
    <li :disabled="menuTarget == 0" @click="moveUp">上移</li>
    <li :disabled="menuTarget == songLists.length - 1" @click="moveDown">
      下移
    </li>
  </ul>
</template>

<style scoped lang="scss">
@import "@/assets/template.scss";

div {
  margin-top: 2rem;
  text-align: center;
  font-size: 1.5em;
}

ul.songlists {
  @include flex(column);

  /* gap: 1em; */
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 1rem 0;
  /* padding-bottom: 4rem; */
  list-style: none;

  /* 自定义滚动条 */
  @include customScrollbar;

  li {
    font-size: 1.5em;
    margin: 0 2em;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition:
      color 0.5s,
      background-color 0.5s;

    &:hover {
      color: var(--color-theme-mute);
      background-color: var(--color-background-mute);
    }

    &.active {
      color: var(--color-background);
      background-color: var(--color-theme-mute);
    }
  }
}

ul.menu {
  @include flex(column);
  position: absolute;
  padding: 0;
  border-radius: 0.5rem;
  list-style: none;
  overflow: hidden;
  background-color: var(--color-background-mute);

  li {
    padding: 0.5rem 1rem;

    &[disabled="false"]:hover {
      background-color: var(--color-background-soft);
    }
  }
}
</style>
