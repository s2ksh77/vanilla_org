import { fetchChildrenNode } from "./appendNode.js";

export function treeEventDelegation(type, targetElement) {
  handleAddClickEvent(type, targetElement);
  if (type === "lazy")
    targetElement.addEventListener("mouseover", handleMouseOverEvent);
}

function handleAddClickEvent(type, targetElement) {
  if (targetElement.handleClickEventHandler)
    targetElement.removeEventListener(
      "click",
      targetElement.handleClickEventHandler
    );

  targetElement.handleClickEventHandler = (e) =>
    handleClickEvent(e, targetElement, type);

  targetElement.addEventListener(
    "click",
    targetElement.handleClickEventHandler
  );
}

async function handleClickEvent(event, targetElement, type = "lazy") {
  const { target } = event;
  const li = target.closest("li");

  if (!li) return;

  const handleToggleButton = async (li, button, code, depth) => {
    const childrenUl = li.querySelector("ul");
    if (!childrenUl && type === "lazy") {
      await fetchChildrenNode({
        parentNode: li,
        parentCode: code,
        depth: Number(depth) + 1,
        type: "html",
        hidden: false,
      });
      button.textContent = "-";
    } else {
      childrenUl.classList.toggle("hidden");
      button.textContent = childrenUl.classList.contains("hidden") ? "+" : "-";
    }
  };

  const toggleSelect = (wrapper) => {
    const selectedElement = targetElement.querySelector(".selected");
    if (selectedElement) selectedElement.classList.remove("selected");
    wrapper.classList.toggle("selected");
  };

  if (target.classList.contains("toggle-btn")) {
    const button = target.closest("button");
    const { code, depth } = li.dataset;
    await handleToggleButton(li, button, code, depth);
  }
  if (
    target.classList.contains("tree-node-wrapper") ||
    target.classList.contains("tree-title")
  ) {
    toggleSelect(target.closest("li div"));
    const { code } = li.dataset;
    const textContent = li.querySelector(".tree-title").textContent;
    const customEvent = new CustomEvent("nodeClick", {
      detail: { textContent, code },
    });
    targetElement.dispatchEvent(customEvent);
  }
}

async function handleMouseOverEvent(event) {
  const { target } = event;
  const li = target.closest("li");

  if (li && target.classList.contains("tree-node-wrapper")) {
    const { code, depth } = li.dataset;
    if (!li.dataset.fetched && code) {
      li.dataset.fetched = true;
      await fetchChildrenNode({
        parentNode: li,
        parentCode: code,
        depth: Number(depth) + 1,
        type: "html",
        hidden: true,
      });
    }
  }
}
