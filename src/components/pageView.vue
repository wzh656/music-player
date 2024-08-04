<script setup lang="ts">
import SongList from "@/views/SongList.vue";
</script>

<template>
  <div class="pageView">
    <nav>
      <p class="active">歌单</p>
      <p>歌词</p>
      <p>设置</p>
    </nav>
    <SongList></SongList>
  </div>
</template>

<style scoped lang="scss">
.pageView {
  nav {
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    p {
      padding: 0.5rem;
      padding-bottom: 0;
      margin-bottom: 0.5rem;
      border-bottom: 3px solid var(--color-text);
      cursor: pointer;

      &.active {
        color: var(--color-theme-mute);
        border-bottom: 3px solid var(--color-theme-mute);
      }
    }
  }
}
</style>
