import { TREE_IMG } from "../common/constants.js";
import { fetchDepartmentNode, fetchUserList } from "./api.js";

export async function initializeTree(rootCode = "0", targetElement) {
  const rootData = await fetchDepartmentNode(rootCode);

  const rootNode = createTreeNode(rootData[0], 0, "node");
  const rootUl = createRootUl(rootNode);
  targetElement.appendChild(rootUl);

  setInitialSelectedNode(rootNode);

  toggleEventDelegation(targetElement);

  await fetchChildrenNode({
    parentNode: rootNode,
    parentCode: rootData[0].code,
    depth: 1,
    type: "html",
    hidden: false,
  });

  return rootData[0];
}

function createRootUl(rootNode) {
  const rootUl = document.createElement("ul");
  rootUl.style.padding = "0px 20px";
  rootUl.appendChild(rootNode);
  return rootUl;
}

function setInitialSelectedNode(rootNode) {
  const rootWrapper = rootNode.querySelector(".tree-node-wrapper");
  rootWrapper.classList.add("selected");
}

export async function fetchChildrenNode({
  parentNode,
  parentCode,
  depth,
  type = "html",
  hidden = true,
}) {
  const childrenData = await fetchDepartmentNode(parentCode);
  type === "html"
    ? appendChildListHTML({
        childrenData,
        parentNode,
        depth,
        hidden,
      })
    : appendChildListNode({
        childrenData,
        parentNode,
        depth,
        hidden,
      });
}

function appendChildListHTML({ childrenData, parentNode, depth, hidden }) {
  const childrenHTML = childrenData
    .map((child) => createTreeNode(child, depth, "html"))
    .join("");

  const childrenUl = document.createElement("ul");
  if (hidden) childrenUl.classList.add("hidden");
  childrenUl.innerHTML = childrenHTML;

  parentNode.appendChild(childrenUl);
}

function appendChildListNode({ childrenData, parentNode, depth, hidden }) {
  const childrenUl = document.createElement("ul");
  if (hidden) childrenUl.classList.add("hidden");

  childrenData.forEach((child) => {
    const childNode = createTreeNode(child, depth, "node");
    childrenUl.appendChild(childNode);
  });

  parentNode.appendChild(childrenUl);
}

export function createTreeNode(department, depth = 0, type = "html") {
  return type === "html"
    ? createTreeNodeHTML(department, depth)
    : createTreeNodeElement(department, depth);
}

function createTreeNodeHTML(department, depth) {
  return `
    <li class="tree-node" data-code="${department.code}" data-depth="${depth}">
      <div class="tree-node-wrapper" style="--depth: ${depth};">
        <button class="toggle-btn">+</button>
        <img src="${getTreeImgByDepth(depth)}" />
        <span class="tree-title">${department.name}</span>
      </div>
    </li>
  `;
}

function createTreeNodeElement(department, depth) {
  return setupTreeNode(department, depth);
}

function setupTreeNode(department, depth) {
  const li = document.createElement("li");
  const wrapper = document.createElement("div");
  const span = document.createElement("span");
  const img = document.createElement("img");
  const toggleBtn = createToggleButton(depth);

  img.src = getTreeImgByDepth(depth);
  li.classList.add("tree-node");
  wrapper.classList.add("tree-node-wrapper");
  span.classList.add("tree-title");

  wrapper.appendChild(toggleBtn);
  wrapper.appendChild(img);
  wrapper.appendChild(span);

  span.textContent = department.name;
  li.dataset.code = department.code;
  li.dataset.depth = depth;
  wrapper.style.setProperty("--depth", depth);
  li.appendChild(wrapper);
  return li;
}

function createToggleButton(depth) {
  const button = document.createElement("button");
  button.textContent = depth === 0 ? "-" : "+";
  button.classList.add("toggle-btn");
  return button;
}

function toggleSelect(targetElement, wrapper) {
  const selectedElement = targetElement.querySelector(".selected");
  if (selectedElement) selectedElement.classList.remove("selected");
  wrapper.classList.toggle("selected");
}

function toggleEventDelegation(targetElement) {
  targetElement.addEventListener("click", (e) =>
    handleClickEvent(e, targetElement)
  );
  targetElement.addEventListener("mouseover", handleMouseOverEvent);
}

async function handleClickEvent(event, targetElement) {
  const { target } = event;
  const li = target.closest("li");

  if (!li) return;

  const handleToggleButton = async (li, button, code, depth) => {
    const childrenUl = li.querySelector("ul");
    if (!childrenUl) {
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

export async function fetchUsersByDepartment(departmentCode) {
  const userList = await fetchUserList();
  return userList.filter((user) => user.departmentCode === departmentCode);
}

const getTreeImgByDepth = (depth) => TREE_IMG[depth % 4];
