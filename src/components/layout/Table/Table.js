import { getDepartmentName } from "../../../lib/utils.js";
import { createPagination } from "./Pagination.js";

export function createTable(data) {
  const table = document.createElement("table");
  const thead = createTableHeader();
  const rowsPerPage = 10;
  const tbody = createTableBody(data, 1, rowsPerPage);

  const onPageChange = (page) =>
    updateTableBody(tbody, data, page, rowsPerPage);

  const pagination = createPagination(data.length, onPageChange, rowsPerPage);

  table.appendChild(thead);
  table.appendChild(tbody);
  table.appendChild(pagination);

  return table;
}

function createTableHeader() {
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const columns = [
    { key: "name", label: "이름" },
    { key: "id", label: "닉네임" },
    { key: "dutyName", label: "직위" },
    { key: "departmentNamePath", label: "소속부서" },
    { key: "telephoneNumber", label: "핸드폰" },
    { key: "email", label: "Email" },
  ];

  columns.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col.label;
    th.style.cursor = "pointer";
    th.dataset.key = col.key;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  return thead;
}

function createTableBody(data, page, rowsPerPage = 10) {
  const tbody = document.createElement("tbody");
  updateTableBody(tbody, data, page, rowsPerPage);
  return tbody;
}

function updateTableBody(tbody, data, page, rowsPerPage = 10) {
  tbody.innerHTML = "";
  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 20px;">소속 구성원이 없습니다.</td>
      </tr>
    `;
    return;
  }
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const currentData = data.slice(start, end);

  tbody.innerHTML = currentData
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.id}</td>
          <td>${item.dutyName}</td>
          <td>${getDepartmentName(item.departmentNamePath)}</td>
          <td>${item.telephoneNumber}</td>
          <td>${item.email}</td>
        </tr>
      `
    )
    .join("");
}
