import { MusicPlatform } from "@/types/MusicPlatform"; //音乐平台

declare global {
  /* 歌单结构 */
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
  interface SearchData {
    code: number;
    data: SearchDataItem[];
    error: string;
  }

  /* B站搜索结果 */
  interface SearchDataItemBilibili {
    cid: number;
    part: string;
    page: number;
    duration: number;
  }
  type SearchDataBilibili = SearchDataItemBilibili[];

  /* 浏览路径结果 */
  interface BrowsePathData {
    canceled: boolean;
    filePaths: string[];
  }

  interface Window {
    electron: {
      minimize: () => void;
      switchMaximum: () => void;
      onChangeMaximum: (callback: (bool: boolean) => void) => void;

      getSongLists: () => Promise<SongLists>;
      updateSongLists: (songListsStr: string) => void;
      getSongListSongs: (index: number) => Promise<string[]>;
      getLyrics: (path: string) => Promise<string>;
      getArtist: (path: string) => Promise<string>;

      onPlay: (callback: () => void) => void;
      onPause: (callback: () => void) => void;
      onLast: (callback: () => void) => void;
      onNext: (callback: () => void) => void;
      updatePlayState: (playState: boolean) => void;

      downloadFile: (url: string, name: string) => void;
      downloadText: (text: string, name: string) => void;

      openUrl: (url: string) => void;

      search: (
        keyword: string,
        platform: MusicPlatform,
        page: number,
      ) => Promise<SearchData>;
      // onSearchData: (callback: (data: SearchData) => void) => void;
      searchBilibili: (avid: number) => Promise<SearchDataBilibili | null>;
      downloadBilibili: (
        bvid: string,
        cid: number,
        name: string,
      ) => Promsie<void>; //下载

      browseFiles: () => Promise<BrowsePathData>;
      browseDir: (path?: string) => Promise<BrowsePathData>;
    };
  }
}

export { SongLists };
