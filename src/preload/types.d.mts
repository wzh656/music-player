import { MusicPlatform } from "@/types/MusicPlatform"; //音乐平台

declare global {
  /* 歌单结构 */
  type SongLists = SongList[];
  interface SongList {
    name: string; //歌单名称
    paths: string[]; //音乐文件路径
    suffixes?: string[]; //音乐文件后缀
    artists?: string[]; //歌手
    num?: number; //歌曲数量
    type?: string[]; //音乐类型
    editing?: boolean; //是否编辑中
    folded?: boolean; //是否折叠
  }

  /* 搜索结果 */
  interface SearchDataItem {
    title?: string; //标题
    name?: string; //标题

    author?: string; //作者
    artist?: string; //作者

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

  /* B站搜索简略结果 */
  interface SearchDataItemBilibiliSimple {
    name: string;
    cid: number;
  }
  type SearchDataBilibiliSimple = SearchDataItemBilibiliSimple[];

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
      onPlaySongList: (callback: (index: number) => void) => void;
      updateSongLists: (songListsStr: string) => void;
      getSongListSongs: (index: number) => Promise<string[]>;
      getSongListArtists: (index: number) => Promise<string[]>;
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
      downloadAudioBilibili: (
        bvid: string,
        cid: number,
        name: string,
      ) => Promsie<boolean>; //下载音频
      downloadVideoBilibili: (
        bvid: string,
        cid: number,
        name: string,
      ) => Promsie<boolean>; //下载视频
      downloadAllAudioBilibili: (
        bvid: string,
        items: SearchDataBilibiliSimple,
      ) => void; //下载所有音频
      downloadAllVideoBilibili: (
        bvid: string,
        items: SearchDataBilibiliSimple,
      ) => void; //下载所有视频
      downloadAllAudioBilibiliProgress: (
        callback: (progress: number) => void,
      ) => void; //下载所有音频进度
      downloadAllVideoBilibiliProgress: (
        callback: (progress: number) => void,
      ) => void; //下载所有视频进度

      onTransAudio: (callback: (filePath: string) => void) => void; //转换音频
      onTransAudioDone: () => void; //转换音频完成

      browseFiles: () => Promise<BrowsePathData>;
      browseDir: (path?: string) => Promise<BrowsePathData>;
    };
  }
}

// export { SongLists };
