import { orgRepository } from "../../lib/api.js";
import { createFullTreeHTML, createTreeNode } from "./treeNode.js";

export async function fetchChildrenNode({
  parentNode,
  parentCode,
  depth,
  type = "html",
  hidden = true,
}) {
  const data = await orgRepository.fetchDepartmentNode(parentCode);
  type === "html"
    ? appendChildListHTML({
        data,
        parentNode,
        depth,
        hidden,
      })
    : appendChildListNode({
        data,
        parentNode,
        depth,
        hidden,
      });
}

function appendChildListHTML({ data, parentNode, depth, hidden }) {
  const childrenHTML = data
    .map((child) => createTreeNode(child, depth, "html"))
    .join("");

  const childrenUl = document.createElement("ul");
  if (hidden) childrenUl.classList.add("hidden");
  childrenUl.innerHTML = childrenHTML;

  parentNode.appendChild(childrenUl);
}

function appendChildListNode({ data, parentNode, depth, hidden }) {
  const childrenUl = document.createElement("ul");
  if (hidden) childrenUl.classList.add("hidden");

  data.forEach((child) => {
    const childNode = createTreeNode(child, depth, "node");
    childrenUl.appendChild(childNode);
  });

  parentNode.appendChild(childrenUl);
}

let userList = null;

export async function initializeFullTree(rootCode, data) {
  if (!userList) userList = await orgRepository.fetchUserList();
  const rootNode = document.createElement("ul");
  const rootHTML = createFullTreeHTML(rootCode, data, userList);
  rootNode.insertAdjacentHTML("beforeend", rootHTML);

  return rootNode;
}
