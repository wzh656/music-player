console.log("[search-inject]", typeof $, window.electron);

function onSearch(input, page) {
  console.log("[onSearch]", input, page);
  $.ajax({
    type: "POST",
    url: "https://www.yyssq.cn/",
    timeout: 30000,
    data: {
      input,
      filter: "name",
      type: "netease",
      page,
    },
    dataType: "json",
    success: (data) => {
      console.log("[searchData]", data);
      window.electron.searchData(data); // 将数据发送给主进程
    },
  });
}
