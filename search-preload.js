const { ipcRenderer } = require("electron");

function tryData() {
  const data = [];
  const ol = document.querySelector(".aplayer-list > ol");
  console.log("[tryData]", ol);
  if (!ol) return false;
  for (let i = 0; i < ol.children.length; i++) {
    const item = ol.children[i];
    const index = item.children[1].innerText;
    const name = item.children[2].innerText;
    const author = item.children[3].innerText;
    data.push({ index, name, author });
  }
  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  const id = setInterval(() => {
    const data = tryData();
    if (!data) return;

    clearInterval(id);
    console.log("[searchData]", data);
    ipcRenderer.send("searchData", data); // 发送数据给主进程
  }, 500);
});
