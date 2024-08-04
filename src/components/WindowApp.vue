<script setup lang="ts">
import TitleBar from "./TitleBar.vue";
</script>

<template>
  <main class="window">
    <TitleBar>
      <slot name="title"></slot>
    </TitleBar>
    <slot name="content"></slot>
  </main>
</template>

<style scoped lang="scss">
.window {
  display: flex;
  flex-direction: column;

  header {
    flex: 0;
  }
}
</style>
