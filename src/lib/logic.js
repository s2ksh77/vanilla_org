import { TREE_IMG } from "../common/constants.js";
import { fetchDepartmentNode, fetchUserList } from "./api.js";

export async function initializeTree(rootCode = "0", targetElement) {
  const rootData = await fetchDepartmentNode(rootCode);
  const rootNode = createTreeNode(rootData[0], 0, "node");

  const rootUl = document.createElement("ul");
  rootUl.style.padding = "0px 20px";
  rootUl.appendChild(rootNode);
  targetElement.appendChild(rootUl);

  const rootWrapper = rootNode.querySelector(".tree-node-wrapper");
  rootWrapper.classList.add("selected");

  toggleEventDelegation(targetElement);

  await fetchChildrenNode(rootNode, rootData[0].code, 1);

  return rootData[0];
}

export async function fetchChildrenNode(
  parentNode,
  parentCode,
  depth,
  type = "html"
) {
  const childrenData = await fetchDepartmentNode(parentCode);
  type === "html"
    ? appendChildListHTML(childrenData, parentNode, depth, type)
    : appendChildListNode(childrenData, parentNode, depth, type);
}

function appendChildListHTML(childrenData, parentNode, depth, type) {
  const childrenHTML = childrenData
    .map((child) => createTreeNode(child, depth, type))
    .join("");

  const childrenUl = document.createElement("ul");
  childrenUl.innerHTML = childrenHTML;

  parentNode.appendChild(childrenUl);
}

function appendChildListNode(childrenData, parentNode, depth, type) {
  const childrenUl = document.createElement("ul");

  childrenData.forEach((child) => {
    const childNode = createTreeNode(child, depth, type);
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
  const toggleBtn = createToggleButton();

  img.src = getTreeImgByDepth(depth);
  li.classList.add("tree-node");
  wrapper.classList.add("tree-node-wrapper");
  span.classList.add("tree-title");

  wrapper.appendChild(toggleBtn);
  wrapper.appendChild(img);
  wrapper.appendChild(span);

  span.textContent = department.name;
  li.dataset.code = department.code;
  li.dataset.depth = department.depth;
  wrapper.style.setProperty("--depth", depth);
  li.appendChild(wrapper);
  return li;
}

function createToggleButton() {
  const button = document.createElement("button");
  button.textContent = "+";
  button.classList.add("toggle-btn");
  return button;
}

function toggleEventDelegation(targetElement) {
  const handleEvent = async (event) => {
    const { target } = event;
    const li = target.closest("li");

    const handleToggleButton = async (li, button, code, depth) => {
      const childrenUl = li.querySelector("ul");
      if (!childrenUl) {
        await fetchChildrenNode(li, code, Number(depth) + 1);
        button.textContent = "-";
      } else {
        childrenUl.classList.toggle("hidden");
        button.textContent = childrenUl.classList.contains("hidden")
          ? "+"
          : "-";
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
      const textContent = li.querySelector("span").textContent;
      const customEvent = new CustomEvent("nodeClick", {
        detail: { textContent, code },
      });
      targetElement.dispatchEvent(customEvent);
    }
  };

  targetElement.addEventListener("click", handleEvent);
}

export async function fetchUsersByDepartment(departmentCode) {
  const userList = await fetchUserList();
  /** departmentCodePath 에 포함되어있는거 다 줘야하나 */
  return userList.filter((user) => user.departmentCode === departmentCode);
}

const getTreeImgByDepth = (depth) => TREE_IMG[depth % 4];
