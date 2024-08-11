<script setup lang="ts">
import { inject, reactive, ref, watch, type Ref } from "vue";
import * as musicController from "@/ts/musicController";

/* 获取依赖 */
const currentMusic = inject("currentMusic") as Ref<string | null>; //当前播放歌曲
const currentTime = inject("currentTime") as Ref<number>; //当前播放时间

/* 歌词单行数据类型 */
interface LyricsLineData {
  time: number;
  text: string;
}

/* 歌曲更新时 获取歌词 */
const data: LyricsLineData[] = reactive([]); //歌词数据
watch(currentMusic, async () => {
  if (!currentMusic.value) return;
  const text = await window?.electron?.getLyrics(currentMusic.value);
  data.splice(0, data.length); //清空数据
  if (!text) return; //无歌词

  const lines = text.trim().split("\n");
  for (const [index, line] of Object.entries(lines)) {
    const match = line.trim().match(/\[(\d+):(\d+)\.(\d+)\](.+)/);
    if (!match) continue; //未匹配到则跳过

    const [min, sec, mil, text] = match.slice(1);
    data[+index] = {
      time: Number(min) * 60 + Number(sec) + Number(mil) / 1000,
      text,
    };
  }

  // console.log("[LyricsView]", currentMusic.value, lines, data);
});

/* 监听鼠标滚动 停止自动滚动 */
let autoScroll = true;
let scrollId: null | number = null;
document.addEventListener("wheel", () => {
  autoScroll = false;

  if (scrollId != null) clearTimeout(scrollId);
  scrollId = setTimeout(() => (autoScroll = true), 5000);
});

/* 播放进度时 滚动歌词 */
const lyricsListElem = ref<HTMLElement | null>(null);
const activeIndex = ref(0); //当前高亮行
watch(currentTime, () => {
  if (!lyricsListElem.value) return;

  activeIndex.value =
    data.findIndex((line) => line.time > currentTime.value) - 1;

  /* console.log(
    "[LyricsView]",
    currentTime.value,
    activeIndex.value,
    data[activeIndex.value],
  ); */

  if (!autoScroll) return; //禁止滚动
  if (activeIndex.value > 0) {
    const target = lyricsListElem.value.children[
      activeIndex.value
    ] as HTMLElement;
    lyricsListElem.value.scrollTo({
      top: target.offsetTop - lyricsListElem.value.clientHeight / 2,
      behavior: "smooth",
    }); //平滑滚动
  } else {
    lyricsListElem.value.scrollTo({
      top: 0,
      behavior: "smooth",
    }); //平滑滚动
  }
});

/* 设置播放时间 */
function setCurrentTime(time: number) {
  currentTime.value = time; //设置当前播放时间
  musicController.setCurrentTime(time); //设置播放时间
}
</script>

<template>
  <div v-if="data.length == 0">暂无歌词</div>
  <ul ref="lyricsListElem" v-if="data.length > 0">
    <li
      v-for="(line, index) in data"
      :key="index"
      :class="{ active: index === activeIndex }"
      @click="setCurrentTime(line.time)"
    >
      {{ line.text }}
    </li>
  </ul>
</template>

<style scoped lang="scss">
@import "@/assets/template.scss";

div {
  /* text-align: center; */
  margin: auto;
  font-size: 1.5em;
}

ul {
  @include flex(column);
  height: 100%;
  padding: 0;
  overflow-y: auto;
  @include hiddenScrollbar;
  // @include customScrollbar;

  li {
    display: block;
    margin: 1rem 0;
    text-align: center;
    transition:
      color 0.5s,
      font-size 0.5s;
    cursor: pointer;

    &.active {
      font-size: 1.5em;
      font-weight: bold;
      color: var(--color-text-highlight);
    }
  }
}
</style>
