/// <reference types="vite/client" />

/* 歌单列表 */
type SongLists = SongList[];
interface SongList {
  name: string; //歌单名称
  paths: string[]; //音乐文件路径
  num?: number; //歌曲数量
  type?: string[]; //音乐类型
  editing?: boolean; //是否编辑中
  folded?: boolean; //是否折叠
}

/* 搜索结果 */
interface SearchDataItem {
  title: string; //标题
  author: string; //作者
  lrc: string; //歌词
  songid: number; //id
  pic: string; //封面
  url: string; //音频链接
  link: string; //网易云链接
  type: string; //平台类型
}
interface SeartchData {
  code: number;
  data: SearchDataItem[];
  error: string;
}

/* 浏览路径结果 */
interface BrowsePathData {
  canceled: boolean;
  filePaths: string[];
}

/* preload electron 交互 */
declare interface Window {
  electron: {
    minimize: () => void;
    switchMaximum: () => void;
    onChangeMaximum: (callback: (bool: boolean) => void) => void;
    getSongLists: () => Promise<SongLists>;
    updateSongLists: (songLists: string) => void;
    getSongListSongs: (name: string) => Promise<string[]>;
    getLyrics: (path: string) => Promise<string>;
    downloadFile: (url: string, name: string) => void;
    downloadText: (text: string, name: string) => void;
    openUrl: (url: string) => void;
    search: (keyword: string, page: number) => void;
    onSearchData: (callback: (data: SeartchData) => void) => void;
    browseFiles: () => Promise<BrowsePathData>;
    browseDir: (path?: string) => Promise<BrowsePathData>;
  };
}
