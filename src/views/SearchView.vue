<script setup lang="ts">
import { reactive } from "vue";

/* Enter 搜索 */
function onkeydown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    search(value);
    input.blur(); //失去焦点
  }
}

/* 处理POST的body信息 */
function handleBody(obj: object) {
  let body = "";
  for (const [key, value] of Object.entries(obj)) {
    body += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
  }
  return body.slice(0, -1);
}

/* 搜索 */
const apiUrl = "https://music.haom.ren/";
const searchData = reactive<SearchDataItem[]>([]);
function search(keyword: string, page: number = 1) {
  window?.electron?.search(keyword, page); //搜索
  searchData.splice(0, searchData.length); //清空结果

  window?.electron?.onSearchData((data) => {
    searchData.push(...data);
    console.log("[onSearchData]", data);
  });
}
</script>

<template>
  <div class="view">
    <h1>音乐搜索</h1>
    <input
      @keydown.stop="onkeydown"
      type="text"
      placeholder="请输入歌曲名或歌手名，回车搜索"
    />
    <ul>
      <li v-for="item in searchData" :key="item.index">
        <span>{{ item.index }}</span>
        <span>{{ item.name }}</span>
        <span>{{ item.author }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  input {
    flex: none;
    width: 80%;
    height: 2em;
    margin: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
  }

  ul {
    flex: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: overlay;

    li {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #ccc;

      display: flex;
      justify-content: space-between;

      span {
      }
    }
  }
}
</style>
