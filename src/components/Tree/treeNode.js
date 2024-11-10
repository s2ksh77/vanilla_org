import { TREE_IMG } from "../../common/constants.js";

const getTreeImgByDepth = (depth) => TREE_IMG[depth % 4];

export function createRootUl(rootNode) {
  const rootUl = document.createElement("ul");
  rootUl.style.padding = "0px 20px";
  rootUl.appendChild(rootNode);
  return rootUl;
}

export function createTreeNode(department, depth = 0, type = "html") {
  return type === "html"
    ? createTreeNodeHTML(department, depth)
    : createTreeNodeElement(department, depth);
}

function createTreeNodeHTML(department, depth) {
  return `
      <li class="tree-node" data-code="${
        department.code
      }" data-depth="${depth}">
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

export function setInitialSelectedNode(rootNode) {
  const rootWrapper = rootNode.querySelector(".tree-node-wrapper");
  rootWrapper.classList.add("selected");
}
