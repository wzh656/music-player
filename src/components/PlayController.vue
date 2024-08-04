<script setup lang="ts">
import { ref } from "vue";
import playIcon from "@/assets/icons/playIcon.vue";
import stopIcon from "@/assets/icons/stopIcon.vue";
import lastIcon from "@/assets/icons/lastIcon.vue";
import nextIcon from "@/assets/icons/nextIcon.vue";
import randomIcon from "@/assets/icons/randomIcon.vue";
import volumeIcon from "@/assets/icons/volumeIcon.vue";

const playState = ref(false);
</script>

<template>
  <div class="playController">
    <div>
      <randomIcon></randomIcon>
      <lastIcon></lastIcon>
      <playIcon class="playButton" v-show="!playState" />
      <stopIcon class="playButton" v-show="playState" />
      <nextIcon></nextIcon>
      <volumeIcon></volumeIcon>
    </div>
  </div>
</template>

<style scoped lang="scss">
div.playController {
  padding: 1rem;
  border-radius: 15px 15px 0 0;
  background: var(--color-background-soft);
  transition: background-color 0.5s;

  div {
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    svg {
      width: 36px;
      height: 36px;
      cursor: pointer;
    }

    svg.playButton {
      width: 50px;
      height: 50px;
      background-color: var(--color-theme);
      border-radius: 100%;
      stroke: white;
      fill: white;
    }
  }
}
</style>
