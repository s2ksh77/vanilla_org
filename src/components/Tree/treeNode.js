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

function createTreeNodeHTML(department, depth, type = "lazy", count) {
  const btnText = type === "lazy" ? "+" : "-";
  const title =
    type === "lazy" ? department.name : `${department.name} (${count})`;

  return `
      <li class="tree-node" data-code="${
        department.code
      }" data-depth="${depth}">
        <div class="tree-node-wrapper" style="--depth: ${depth};">
          <button class="toggle-btn">${btnText}</button>
          <img src="${getTreeImgByDepth(depth)}" />
          <span class="tree-title">${title}</span>
        </div>
      </li>
    `;
}

export function createFullTreeHTML(parentCode, data, userList, depth = 0) {
  const children = data.filter((node) => node.parentCode === parentCode);
  if (children.length === 0 && depth !== 0) return "<ul></ul>";

  const childrenHTML = generateChildrenHTML(children, data, userList, depth);

  return depth !== 0 ? `<ul>${childrenHTML}</ul>` : childrenHTML;
}

function generateChildrenHTML(children, data, userList, depth) {
  const userCounts = getUserCountsByDepartment(userList);

  return children
    .map((child) =>
      createChildNodeHTML(child, data, userList, userCounts, depth)
    )
    .join("");
}

function createChildNodeHTML(children, data, userList, userCounts, depth) {
  const userCount = userCounts[children.code] || 0;
  let childrenHTML = createTreeNodeHTML(children, depth + 1, "full", userCount);
  const childTreeHTML = createFullTreeHTML(
    children.code,
    data,
    userList,
    depth + 1
  );

  return childrenHTML.replace("</li>", `${childTreeHTML}</li>`);
}

let userCounts = {};
export function getUserCountsByDepartment(userList) {
  if (Object.keys(userCounts).length === 0) {
    userList.forEach((user) => {
      const departmentCode = user.departmentCode;
      userCounts[departmentCode] = (userCounts[departmentCode] || 0) + 1;
    });
  }
  return userCounts;
}

function createTreeNodeElement(department, depth) {
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
