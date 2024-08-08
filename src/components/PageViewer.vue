<script setup lang="ts">
import SongList from "@/views/SongListView.vue";
</script>

<template>
  <div class="pageView">
    <nav>
      <p class="active">歌单</p>
      <p>歌词</p>
      <p>热歌</p>
      <p>设置</p>
    </nav>
    <SongList></SongList>
  </div>
</template>

<style scoped lang="scss">
.pageView {
  display: flex;
  flex-direction: column;

  nav {
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    p {
      padding: 0.5rem;
      padding-bottom: 0;
      margin-bottom: 0.5rem;
      border-bottom: 3px solid var(--color-text);
      border-radius: 0.5rem;
      cursor: pointer;
      transition:
        color 0.3s,
        background-color 0.3s,
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
}
</style>
