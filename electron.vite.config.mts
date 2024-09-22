import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "src/main/index.mts"),
          // searchInject: resolve(__dirname, "src/main/searchInject.ts"),
        },
        output: {
          format: "es",
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "src/preload/index.mts"),
          search: resolve(__dirname, "src/preload/search.mts"),
        },
        output: {
          format: "es",
        },
      },
    },
  },
  renderer: {
    base: "./",
    resolve: {
      alias: {
        "@": resolve("src/renderer/src"),
        //'@renderer': resolve('src/renderer/src')
      },
    },
    plugins: [vue()],
    /* build: {
      rollupOptions: {
        output: {
          format: "es",
        },
      },
    }, */
  },
});
