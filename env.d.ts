/// <reference types="vite/client" />

interface SongList {
  [key: string]: string[];
}

declare interface Window {
  electron: {
    minimize: () => void;
    switchMaximum: () => void;
    onChangeMaximum: (callback: (bool: boolean) => void) => void;
    getSongList: () => Promise<SongList>;
  };
}
