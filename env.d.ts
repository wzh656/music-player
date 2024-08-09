/// <reference types="vite/client" />

/* 歌单列表 */
interface SongLists {
  [key: string]: {
    paths: string[]; //音乐文件路径
    type?: string[]; //音乐类型
    num?: number; //歌曲数量
  };
}

/* 搜索结果 */
interface SearchDataItem {
  index: number;
  name: string;
  author: string;
}

/* preload electron 交互 */
declare interface Window {
  electron: {
    minimize: () => void;
    switchMaximum: () => void;
    onChangeMaximum: (callback: (bool: boolean) => void) => void;
    getSongLists: () => Promise<SongLists>;
    getSongListSongs: (name: string) => Promise<string[]>;
    getLyrics: (path: string) => Promise<string>;
    downloadFile: (url: string, name: string) => void;
    openUrl: (url: string) => void;
    search: (keyword: string, page: number) => void;
    onSearchData: (callback: (data: SearchDataItem[]) => void) => void;
  };
}
