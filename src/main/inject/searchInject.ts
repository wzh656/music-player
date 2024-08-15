export default `
console.log("[search-inject]", typeof $, window.electron);

function onSearch(input, platform, page) {
  console.log("[onSearch]", input, page);
  $.ajax({
    type: "POST",
    url: "https://www.yyssq.cn/",
    timeout: 30000,
    data: {
      input,
      filter: "name",
      type: platform,
      page,
    },
    dataType: "json",
    success: (data) => {
      console.log("[searchData]", data);
      window.electron.searchData(data);
    },
  });
}
`;
