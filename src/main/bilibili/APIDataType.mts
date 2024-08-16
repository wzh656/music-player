//视频合集接口返回值
export interface listAPIData {
  code: number;
  message: string;
  ttl: number;
  data: {
    View: {
      bvid: string; // 视频的唯一标识符
      aid: number; // 视频的aid（文章ID）
      videos: number; // 视频的片段数量
      tid: number; // 视频所属的分区ID
      tname: string; // 视频所属分区的名称
      copyright: number; // 版权信息
      pic: string; // 视频封面图片的URL
      title: string; // 视频标题
      pubdate: number; // 视频发布日期（时间戳）
      ctime: number; // 视频创建日期（时间戳）
      desc: string; // 视频描述
      state: number; // 视频状态
      attribute: number; // 视频属性
      duration: number; // 视频时长（秒）
      mission_id: number; // 任务ID
      redirect_url: string; // 重定向URL
      owner: {
        mid: number; // 所有者的用户ID
        name: string; // 所有者的用户名
        face: string; // 所有者的头像URL
      };
      stat: {
        aid: number; // 视频的aid（文章ID）
        view: number; // 观看次数
        danmaku: number; // 弹幕数量
        reply: number; // 回复数量
        favorite: number; // 收藏次数
        coin: number; // 投币次数
        share: number; // 分享次数
        now_rank: number; // 当前排名
        his_rank: number; // 历史最高排名
        like: number; // 点赞次数
        dislike: number; // 点踩次数
        evaluation: string; // 评价
      };
      pages: [
        {
          cid: number; // 分页的唯一标识符
          page: number; // 分页的页码
          from: string; // 分页来源
          part: string; // 分页标题
          duration: number; // 分页时长（秒）
          vid: string; // 视频ID
          weblink: string; // 外部链接
        },
      ];
    };
  };
}

//单个视频信息接口返回值
export interface videoAPIData {
  // 导出一个接口 videoAPIData
  code: number; // 请求返回的状态码
  message: string; // 请求返回的消息
  ttl: number; // 数据的缓存时间
  data: {
    // 数据对象
    from: string; // 视频来源
    result: string; // 请求结果
    message: string; // 请求消息
    quality: number; // 视频质量
    format: string; // 视频格式
    timelength: number; // 视频时长
    accept_format: string; // 可接受的格式
    accept_description: string[]; // 可接受的格式描述
    video_codecid: number; // 视频编码ID
    seek_param: string; // 搜索参数
    seek_type: string; // 搜索类型
    durl: [
      // 视频下载链接数组
      {
        order: number; // 下载链接顺序
        length: number; // 视频长度
        size: number; // 视频大小
        url: string; // 视频下载链接
        backup_url: string[]; // 备用下载链接
      },
    ];
    support_formats: {
      // 支持的格式数组
      quality: number; // 格式质量
      format: string; // 格式
      new_description: string; // 新的描述
      display_desc: string; // 显示的描述
      superscript: string; // 上标
    }[];
  };
}
