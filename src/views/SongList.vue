<script setup lang="ts">
import { ref, type Ref } from "vue";

let songList: Ref<SongList | null> = ref(null);
window?.electron?.getSongList().then((list) => {
  songList.value = list;
});
</script>

<template>
  <div v-if="!songList">歌单加载中...</div>
  <ul v-if="songList">
    <li v-for="(song, name) in songList" :key="name">{{ name }}</li>
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
  gap: 1em;
  margin-top: 2em;
  padding: 0;
  list-style: none;

  li {
    font-size: 1.5em;
    margin-left: 2em;
    cursor: pointer;
    transition: color 0.5s;

    &:hover {
      color: var(--color-theme-mute);
    }
  }
}
</style>
