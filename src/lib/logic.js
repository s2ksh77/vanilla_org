import { fetchDepartmentNode } from "./api.js";

export async function initializeTree(rootCode = "0", targetElement) {
  const rootData = await fetchDepartmentNode(rootCode);
  const rootNode = createTreeNode(rootData[0], 0, "node");

  const rootUl = document.createElement("ul");
  rootUl.appendChild(rootNode);
  targetElement.appendChild(rootUl);
  toggleEventDelegation(targetElement);

  await fetchChildrenNode(rootNode, rootData[0].code, 1);
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
      <button class="toggle-btn">+</button>
      ${department.name}
    </li>
  `;
}

function createTreeNodeElement(department, depth) {
  const li = setupTreeNode(department, depth);
  const toggleBtn = createToggleButton();

  li.insertBefore(toggleBtn, li.firstChild);
  return li;
}

function setupTreeNode(department, depth) {
  const li = document.createElement("li");
  li.classList.add("tree-node");
  li.textContent = department.name;
  li.dataset.code = department.code;
  li.dataset.depth = depth;
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
    const handleToggleButton = async (li, button, code, depth) => {
      const childrenUl = li.querySelector("ul");
      if (!childrenUl) {
        await fetchChildrenNode(li, code, depth + 1);
        button.textContent = "-";
      } else {
        childrenUl.classList.toggle("hidden");
        button.textContent = childrenUl.classList.contains("hidden")
          ? "+"
          : "-";
      }
    };

    if (event.target.classList.contains("toggle-btn")) {
      const li = event.target.closest("li");
      const button = event.target.closest("button");
      const { code, depth } = li.dataset;
      await handleToggleButton(li, button, code, depth);
    }
  };

  targetElement.addEventListener("click", handleEvent);
}