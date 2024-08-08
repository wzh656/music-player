/// <reference types="vite/client" />

/* 歌单列表 */
interface SongLists {
  [key: string]: {
    paths: string[]; //音乐文件路径
    type?: string[]; //音乐类型
    num?: number; //歌曲数量
  };
}

/* preload electron 交互 */
declare interface Window {
  electron: {
    minimize: () => void;
    switchMaximum: () => void;
    onChangeMaximum: (callback: (bool: boolean) => void) => void;
    getSongLists: () => Promise<SongLists>;
    getSongListSongs: (string) => Promise<string[]>;
  };
}
