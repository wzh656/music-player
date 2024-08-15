//视频信息接口返回值
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
