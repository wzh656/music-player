# 冈易音乐播放器

一个基于 Electron + Vue + TypeScript 的音乐播放器。

## 功能 (Features)

- [x] 导入本地歌单音乐
- [x] 滚动歌词显示 （同名`.lrc`文件）
- [x] 网易云热歌推荐
- [x] 音乐搜索器
  - 网易云、QQ音乐：在线播放/下载歌曲/下载歌词 （不支持会员歌曲）
  - BiliBili: 音乐/视频批量下载 （首次需登录）
- [x] 任务栏右键直接播放歌单
- [x] 窗口略缩图控制音频播放
- [x] 最小化到托盘播放
- [x] 深色模式/浅色模式随心切换
- [x] 主题色随心切换
- [ ] 自选批量下载
- [ ] 使用说明

### 安装依赖 (Install dependencies)

```bash
$ pnpm install
```

### 调试运行 (Development)

```bash
$ pnpm dev
```

### 构建 (Build)

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```
