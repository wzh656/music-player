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
@import "@/assets/template.scss";

.window {
  @include flex(column);

  header {
    flex: 0;
  }
}
</style>
