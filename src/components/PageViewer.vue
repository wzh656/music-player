<script setup lang="ts">
import { ref } from "vue";
import SongListView from "@/views/SongListView.vue";
import LyricsView from "@/views/LyricsView.vue";
import RecommendView from "@/views/RecommendView.vue";
import SearchView from "@/views/SearchView.vue";
// import Setting from "@/views/SettingView.vue";

//切换页面
enum Pages {
  songList = "songList",
  lyrics = "lyrics",
  recommend = "recommend",
  search = "search",
  setting = "setting",
}
const currentPage = ref(Pages.songList);
function switchPage(page: Pages) {
  switch (page) {
    case Pages.songList:
      currentPage.value = Pages.songList;
      break;
    case Pages.lyrics:
      currentPage.value = Pages.lyrics;
      break;
    case Pages.recommend:
      currentPage.value = Pages.recommend;
      break;
    case Pages.search:
      currentPage.value = Pages.search;
      break;
    case Pages.setting:
      currentPage.value = Pages.setting;
      break;
  }
}
</script>

<template>
  <div class="pageView">
    <nav>
      <p
        :class="{ active: currentPage == Pages.songList }"
        @click="switchPage(Pages.songList)"
      >
        歌单
      </p>
      <p
        :class="{ active: currentPage == Pages.lyrics }"
        @click="switchPage(Pages.lyrics)"
      >
        歌词
      </p>
      <p
        :class="{ active: currentPage == Pages.recommend }"
        @click="switchPage(Pages.recommend)"
      >
        推荐
      </p>
      <p
        :class="{ active: currentPage == Pages.search }"
        @click="switchPage(Pages.search)"
      >
        搜索
      </p>
      <p
        :class="{ active: currentPage == Pages.setting }"
        @click="switchPage(Pages.setting)"
      >
        设置
      </p>
    </nav>
    <div class="view" v-show="currentPage == Pages.songList">
      <SongListView></SongListView>
    </div>
    <div class="view" v-show="currentPage == Pages.lyrics">
      <LyricsView></LyricsView>
    </div>
    <div class="view" v-show="currentPage == Pages.recommend">
      <RecommendView></RecommendView>
    </div>
    <div class="view" v-show="currentPage == Pages.search">
      <SearchView></SearchView>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pageView {
  display: flex;
  flex-direction: column;

  //导航栏
  nav {
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    p {
      padding: 0.5rem;
      padding-bottom: 0;
      margin-bottom: 0.5rem;
      border-bottom: 3px solid var(--color-border-hover);
      border-radius: 0.5rem;
      cursor: pointer;
      transition:
        color 0.5s,
        background-color 0.5s,
        border-bottom 0.3s;

      &:hover {
        color: var(--color-theme-mute);
        background-color: var(--color-background-mute);
        border-bottom: 3px solid var(--color-theme-mute);
      }

      &.active {
        color: var(--color-theme);
        border-bottom: 3px solid var(--color-theme);
      }
    }
  }

  //内容区
  .view {
    flex: auto;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
