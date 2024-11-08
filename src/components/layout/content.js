import { fetchUsersByDepartment } from "../../lib/logic.js";
import { createTable } from "./Table/Table.js";

export default function Content() {
  const Content = document.createElement("div");
  Content.classList.add("content");

  const ContentHeader = `
    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <h3 className="content-title">타이틀</h3>
      <input placeholder="조직도 검색" />
    </div>
  `;
  Content.innerHTML = ContentHeader;

  Content.setTextContent = (textContent) => {
    Content.querySelector("h3").innerText = `${textContent}`;
  };

  Content.setDepartmentCode = async (code) => {
    const res = await fetchUsersByDepartment(code);

    const isExistTable = Content.querySelector("table");
    if (isExistTable) Content.removeChild(isExistTable);

    Content.appendChild(createTable(res));
  };

  return Content;
}
