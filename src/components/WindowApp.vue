<script setup lang="ts">
import TitleBar from "./TitleBar.vue";
</script>

<template>
  <main class="window">
    <TitleBar>
      <slot name="title"></slot>
    </TitleBar>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </main>
</template>

<style scoped lang="scss">
.window {
  display: flex;
  flex-direction: column;
}
</style>
