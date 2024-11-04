export default `
console.log("[search-inject]", typeof $, window.electron);

function onSearch(url, input, platform, page) {
  console.log("[onSearch]", {url, input, platform, page});
  $.ajax({
    type: "POST",
    url,
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
