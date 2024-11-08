export function createTable(data) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const columns = [
    { key: "id", label: "아이디" },
    { key: "name", label: "이름" },
    { key: "departmentName", label: "소속부서" },
    { key: "departmentCode", label: "소속부서 Code" },
    { key: "dutyName", label: "직위" },
    { key: "dutyCode", label: "직위 Code" },
    { key: "departmentNamePath", label: "소속부서 Path" },
    { key: "departmentCodePath", label: "소속부서 Code Path" },
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

  thead.addEventListener("click", (event) => {
    const th = event.target.closest("th");
    if (!th || !["id", "name", "email"].includes(th.dataset.key)) return;

    const key = th.dataset.key;
    data.sort((a, b) => (a[key] > b[key] ? 1 : -1));
    renderTableBody(tbody, data);
  });

  const tbody = document.createElement("tbody");
  renderTableBody(tbody, data);

  table.appendChild(thead);
  table.appendChild(tbody);

  return table;
}

function renderTableBody(tbody, data) {
  tbody.innerHTML = "";

  const rowsHTML = data
    .map(
      (item) => `
      <tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.departmentName}</td>
        <td>${item.departmentCode}</td>
        <td>${item.dutyName}</td>
        <td>${item.dutyCode}</td>
        <td>${item.departmentNamePath}</td>
        <td>${item.departmentCodePath}</td>
        <td>${item.telephoneNumber}</td>
        <td>${item.email}</td>
      </tr>
    `
    )
    .join("");
  tbody.innerHTML = rowsHTML;
}
