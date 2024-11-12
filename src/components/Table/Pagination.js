export function createPagination(totalItems, onPageChange, rowsPerPage = 10) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const pagination = document.createElement("div");
  pagination.classList.add("pagination");

  if (totalItems === 0) return pagination;

  pagination.innerHTML = createPaginationButtons(1, totalPages);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
      updatePagination(pagination, page, totalPages);
    }
  };

  const handleEventDelegation = (event) => {
    const target = event.target;
    const activeButton = pagination.querySelector(".page-btn.active");
    const currentPage = Number(activeButton.textContent);

    if (target.classList.contains("page-btn")) {
      const targetPage = Number(target.textContent);
      if (!isNaN(targetPage) && targetPage > 0) {
        handlePageChange(targetPage);
      }
    } else if (target.classList.contains("prev-btn") && currentPage > 1)
      handlePageChange(currentPage - 1);
    else if (target.classList.contains("next-btn") && currentPage < totalPages)
      handlePageChange(currentPage + 1);
  };

  pagination.addEventListener("click", handleEventDelegation);

  return pagination;
}

function updatePagination(pagination, currentPage, totalPages) {
  const prevButton = pagination.querySelector(".prev-btn");
  const nextButton = pagination.querySelector(".next-btn");

  prevButton.disabled = currentPage <= 1;
  nextButton.disabled = currentPage >= totalPages;

  pagination.querySelectorAll(".page-btn").forEach((btn) => {
    const btnPage = Number(btn.textContent);
    btn.classList.toggle("active", btnPage === currentPage);
  });
}

function createPaginationButtons(currentPage, totalPages) {
  return `
      ${createNavButton("prev", currentPage, totalPages)}
      ${createPageButtons(currentPage, totalPages)}
      ${createNavButton("next", currentPage, totalPages)}
    `;
}

function createPageButtons(currentPage, totalPages) {
  return Array.from({ length: totalPages }, (_, i) => {
    const page = i + 1;
    return `
        <button class="page-btn ${
          page === currentPage ? "active" : ""
        }" data-page="${page}">${page}</button>
      `;
  }).join("");
}

function createNavButton(type, currentPage, totalPages) {
  const isPrev = type === "prev";
  const isDisabled =
    (isPrev && currentPage === 1) || (!isPrev && currentPage === totalPages);
  const page = isPrev ? currentPage - 1 : currentPage + 1;

  return `
      <button class="${type}-btn" ${
    isDisabled ? "disabled" : ""
  } data-page="${page}">${isPrev ? "<" : ">"}</button>
    `;
}
