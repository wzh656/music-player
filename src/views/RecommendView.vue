<script setup lang="ts">
import { inject, ref, type Ref } from "vue";
import { PlayMode } from "@/types/PlayMode";
import * as musicController from "@/ts/musicController"; //音乐播放控制器

/* 获取依赖 */
const playMode = inject("playMode") as Ref<PlayMode>; //播放列表
const playList = inject("playList") as Ref<string[]>; //播放列表
const playListShuffled = inject("playListShuffled") as Ref<string[]>; //打乱后的播放列表
const playState = inject("playState") as Ref<boolean>; //播放状态
const currentSonglist = inject("currentSonglist") as Ref<string | null>; //当前歌单名称
const currentMusic = inject("currentMusic") as Ref<string | null>; //当前播放歌曲
const currentTime = inject("currentTime") as Ref<number>; //当前播放时间
const currentDuration = inject("currentDuration") as Ref<number>; //当前音乐时长
const volume = inject("volume") as Ref<number>; //音量

//API返回类型
interface HotSongData {
  success: boolean;
  sort: string;
  info: {
    id: number;
    name: string;
    auther: string;
    pic_url: string;
    url: string;
    update_time: string;
  };
}

const apiUrls = {
  hot: "https://api.vvhan.com/api/wyMusic/热歌榜?type=json",
  new: "https://api.vvhan.com/api/wyMusic/新歌榜?type=json",
  rising: "https://api.vvhan.com/api/wyMusic/飙升榜?type=json",
  original: "https://api.vvhan.com/api/wyMusic/原创榜?type=json",
};
const songAuthor = ref("未知歌手");
const songName = ref("未知名称");
const songPicUrl = ref("");
const songUrl = ref("");
const vipSong = ref(false);

//随机推荐
let lastClickTime = Date.now();
async function fetchSong(apiUrl: string) {
  if (Date.now() - lastClickTime < 1000) return;
  lastClickTime = Date.now();

  const data = await fetch(apiUrl);
  const json: HotSongData = await data.json();
  console.log("[fetchSong]", json);

  if (!json.success) return;
  songName.value = json.info.name;
  songAuthor.value = json.info.auther;
  songUrl.value = json.info.url;
  songPicUrl.value = json.info.pic_url;

  const response = await fetch(songUrl.value);
  if (response.url == "https://music.163.com/404") {
    vipSong.value = true; //VIP歌曲
  } else {
    vipSong.value = false; //非VIP歌曲
  }
  console.log("[fetchSong]", apiUrl, response, vipSong);
}
function hotRecommend() {
  fetchSong(apiUrls.hot);
}
function newRecommend() {
  fetchSong(apiUrls.new);
}
function risingRecommend() {
  fetchSong(apiUrls.rising);
}
function originalRecommend() {
  fetchSong(apiUrls.original);
}

/* 播放音乐 */
function playMusic() {
  currentMusic.value = songUrl.value; //设为当前播放
  playList.value = [songUrl.value]; //设为播放列表
  playListShuffled.value = [songUrl.value]; //设为打乱后的播放列表
  currentSonglist.value = songName.value; //设为当前歌单名称
  playMode.value = PlayMode.loop; //循环播放
  musicController.playMusic(currentMusic.value, {
    volume,
    currentTime,
    duration: currentDuration,
  }); //播放
  playState.value = true; //设为播放状态
}

/* 下载音乐 */
function download() {
  window?.electron?.downloadFile(songUrl.value, songName.value + ".mp3");
}

/* 打开网页 */
function openWeb() {
  const matchResult = songUrl.value.match(/id=(\d+)/);
  if (!matchResult) return;
  const songId = matchResult[1];
  console.log(`https://music.163.com/#/song?id=${songId}`);
  window?.electron?.openUrl(`https://music.163.com/#/song?id=${songId}`);
}
</script>

<template>
  <div class="view">
    <h1>网易云推荐</h1>
    <p><small>（部分会员歌曲可能无法下载播放）</small></p>
    <div class="recommend-buttons">
      <button @click="hotRecommend" class="hot">热歌推荐</button>
      <button @click="newRecommend" class="new">新歌推荐</button>
      <button @click="risingRecommend" class="rising">飙升推荐</button>
      <button @click="originalRecommend" class="original">原创推荐</button>
    </div>
    <div class="song" v-if="songPicUrl">
      <img :src="songPicUrl" @click="playMusic" :disabled="vipSong" />
      <div class="info">
        <div class="name">{{ songName }}</div>
        <div class="author">{{ songAuthor }}</div>
        <div class="buttons">
          <button @click.stop="download" :disabled="vipSong">下载</button>
          <button @click.stop="openWeb">打开</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.view {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 1rem;
  flex-direction: column;
  overflow-y: overlay;
  &::-webkit-scrollbar {
    display: none;
  }

  //标题
  h1 {
    text-align: center;
    font-size: 1.8em;
  }

  //所有按钮
  .recommend-buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 1rem auto;

    button {
      flex: 0 1 40%;
      margin: 0.5rem;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      font-size: 1em;
      color: white;
      cursor: pointer;
      /* background: none;
      border: 1px solid var(--color-theme);
      color: var(--color-theme); */
      &.hot {
        background: linear-gradient(45deg, #ff0000, #ff8888);
      }
      &.new {
        background: linear-gradient(45deg, #55ff00, #b0ff88);
      }
      &.rising {
        background: linear-gradient(45deg, #8000ff, #c388ff);
      }
      &.original {
        background: linear-gradient(45deg, #ffc400, #ffe388);
      }

      &:active {
        background-color: var(--color-theme-soft);
      }
    }
  }

  //歌曲卡片
  .song {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin: 0.5rem;
    padding: 0.5rem;
    margin-bottom: 3rem;
    border-radius: 1rem;
    background-color: var(--color-border);
    box-shadow: 1px 1px 5px var(--color-border-hover);

    //歌曲卡片 歌曲图片
    img {
      width: 100px;
      height: 100px;
      margin: 1rem;
      border-radius: 5px;
      background-color: gray;
      cursor: pointer;
      &[disabled="true"] {
        cursor: not-allowed;
      }

      &::after {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }

    //歌曲卡片 歌曲信息
    .info {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      //歌曲卡片 歌曲信息 名称
      .name {
        font-size: 1.2em;
        font-weight: bold;
      }

      //歌曲卡片 歌曲信息 作者
      .author {
        font-size: 1em;
        color: #999;
      }

      //歌曲卡片 歌曲信息 按钮
      .buttons {
        display: flex;
        margin: 0 auto;

        button {
          margin: 0.5rem;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-size: 1em;
          color: white;
          background-color: var(--color-theme);
          cursor: pointer;

          &:active {
            background-color: var(--color-theme-mute);
          }

          &[disabled] {
            background-color: var(--color-theme-soft);
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style>
