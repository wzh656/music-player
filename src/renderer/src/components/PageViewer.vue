<script setup lang="ts">
import { ref } from "vue";
import SongListView from "@/views/SongListView.vue";
import LyricsView from "@/views/LyricsView.vue";
import RecommendView from "@/views/RecommendView.vue";
import SearchView from "@/views/SearchView.vue";
import SettingsView from "@/views/SettingsView.vue";

const pageView = ref<HTMLElement | null>(null);

//切换页面
enum Pages {
  songList = 1,
  lyrics = 2,
  recommend = 3,
  search = 4,
  setting = 5,
}
const currentPage = ref(Pages.songList);
function switchPage(page: Pages) {
  if (!pageView.value) return;

  if (currentPage.value < page) {
    pageView.value.className = "pageView pageView-left";
  } else if (currentPage.value > page) {
    pageView.value.className = "pageView pageView-right";
  }

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
  <div ref="pageView" class="pageView">
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

    <div class="views">
      <Transition name="pageSwitch">
        <div v-show="currentPage == Pages.songList" class="view">
          <SongListView></SongListView>
        </div>
      </Transition>

      <Transition name="pageSwitch">
        <div v-show="currentPage == Pages.lyrics" class="view">
          <LyricsView></LyricsView>
        </div>
      </Transition>

      <Transition name="pageSwitch">
        <div v-show="currentPage == Pages.recommend" class="view">
          <RecommendView></RecommendView>
        </div>
      </Transition>

      <Transition name="pageSwitch">
        <div v-show="currentPage == Pages.search" class="view">
          <SearchView></SearchView>
        </div>
      </Transition>

      <Transition name="pageSwitch">
        <div v-show="currentPage == Pages.setting" class="view">
          <SettingsView></SettingsView>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/template.scss";

.pageView {
  @include flex(column);

  //导航栏
  nav {
    flex: none;

    @include flex(row);
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

  .views {
    flex: auto;
    @include flex(column);
    height: 100%;
    position: relative;
    overflow: hidden;

    //内容区
    .view {
      flex: auto;
      height: 100%;
      /* padding-bottom: 1rem; */

      @include flex(column);
      @include customScrollbar;
      /* justify-content: center;
    align-items: center; */
    }
  }
}

/* 页面切换动画 */
.pageSwitch-enter-active,
.pageSwitch-leave-active {
  transition:
    opacity 0.5s,
    transform 0.5s;
  width: 100%;
}

.pageView-left {
  .pageSwitch-enter-from {
    position: absolute;
    opacity: 0;
    transform: translateX(100%);
  }

  .pageSwitch-leave-to {
    position: absolute;
    opacity: 0;
    // transform: translateX(-100%);
  }
}

.pageView-right {
  .pageSwitch-enter-from {
    position: absolute;
    opacity: 0;
    transform: translateX(-100%);
  }

  .pageSwitch-leave-to {
    position: absolute;
    opacity: 0;
    // transform: translateX(100%);
  }
}
</style>
