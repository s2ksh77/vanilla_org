import { search } from "../../lib/api.js";
import { fetchUsersByDepartment } from "../../lib/logic.js";
import { createTable } from "./Table/Table.js";

export default function Content() {
  const Content = document.createElement("div");
  Content.classList.add("content");

  const ContentHeader = `
    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <h3 className="content-title"></h3>
      <input id="searchInput" type="text" placeholder="조직도 검색" />
    </div>
  `;
  Content.innerHTML = ContentHeader;

  Content.setTextContent = (textContent) => {
    Content.querySelector("h3").innerText = `${textContent}`;
  };

  Content.setDepartmentCode = async (code) => {
    const res = await fetchUsersByDepartment(code);

    updateTable(res);
  };

  const updateTable = (data) => {
    const isExistTable = Content.querySelector("table");
    if (isExistTable) Content.removeChild(isExistTable);

    Content.appendChild(createTable(data));
  };

  const handleSearch = async (query) => {
    const res = await search(query);
    if (res.length === 0) await handleEmptyResult();
    else updateTable(res);
  };

  const handleEmptyResult = async () => {
    alert("검색 결과가 없습니다. 전체 리스트로 돌아갑니다.");
    await handleSearch("");
    Content.setTextContent("전체");
  };

  const handleKeydown = async (e) => {
    const query = e.target.value.trim();
    if (e.key === "Enter") {
      handleSearch(query);
      Content.setTextContent(query ? `"${query}" 검색 결과` : "전체");
    } else if (e.key === "Escape") e.target.value = "";
  };

  const input = Content.querySelector("#searchInput");
  input.addEventListener("keydown", handleKeydown);

  return Content;
}
