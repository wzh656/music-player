<script setup lang="ts">
import { inject, ref, type Ref } from "vue";
import * as musicController from "@/ts/audioPlay"; //音乐播放控制器

/* 获取依赖 */
const playList = inject("playList") as Ref<string[]>; //播放列表
const playState = inject("playState") as Ref<boolean>; //播放状态
const currentSonglist = inject("currentSonglist") as Ref<string | null>; //当前歌单名称
const currentMusic = inject("currentMusic") as Ref<string | null>; //当前播放歌曲
const volume = inject("volume") as Ref<number>; //音量大小

/* 获取歌单列表 */
let songLists: Ref<SongLists | null> = ref(null);
window?.electron?.getSongLists().then((list: SongLists) => {
  songLists.value = list;
});

/* 左键播放歌单 */
async function songlistPlay(listName: string) {
  if (!songLists.value) throw new Error("[songlistPlay] 歌单列表为空");

  currentSonglist.value = listName; //设为当前歌单
  const songs = await window?.electron?.getSongListSongs(listName); //获取所有歌曲
  songLists.value[listName].num = songs.length; //更新歌单歌曲数量
  playList.value = songs; //设为播放菜单

  //如果当前有播放歌曲，则暂停
  if (currentMusic.value) {
    musicController.pause();
    playState.value = false;
  }

  //随机播放一首
  const song = songs[~~(Math.random() * songs.length)];
  musicController.playMusic(song, volume);
  playState.value = true;
  currentMusic.value = song;
}

/* 右键歌单设置 */
function songlistMenu(event: MouseEvent, name: string) {
  console.log(event, name);
}
</script>

<template>
  <div v-if="!songLists">歌单加载中...</div>
  <ul v-if="songLists">
    <li
      v-for="(songInfo, listName) in songLists"
      :key="listName"
      :class="{ active: listName == currentSonglist }"
      @click="songlistPlay(listName as string)"
      @contextmenu="songlistMenu($event, listName as string)"
    >
      {{ listName }}
      <span v-if="songInfo.num">({{ songInfo.num }})</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
div {
  text-align: center;
  font-size: 2em;
  margin-top: 2em;
}

ul {
  display: flex;
  flex-direction: column;
  /* gap: 1em; */
  height: 0;
  flex: 1;
  margin: 1rem 0;
  padding: 0;
  list-style: none;

  /* 自定义滚动条 */
  overflow-y: overlay; //滚动条不显示
  //整个滚动条
  &::-webkit-scrollbar {
    width: 8px;
    background: none;
    // background: var(--color-border);
    border-radius: 100rem;
  }
  //滚动条滑块
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-theme-mute);
    border-radius: 100rem;
    transition: background-color 0.3s;

    &:hover {
      background-color: var(--color-theme);
    }
  }

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
</style>
