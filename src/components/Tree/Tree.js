import { fetchDepartmentList, fetchDepartmentNode } from "../../lib/api.js";
import { fetchChildrenNode, initializeFullTree } from "./appendNode.js";
import { treeEventDelegation } from "./events.js";
import {
  createRootUl,
  createTreeNode,
  setInitialSelectedNode,
} from "./treeNode.js";

export async function initializeTree(
  type = "lazy",
  rootCode = "0",
  targetElement
) {
  const rootData =
    type === "lazy"
      ? await renderLazyLoadTree(rootCode, targetElement)
      : await renderFullTree(targetElement);

  return rootData;
}

async function renderLazyLoadTree(rootCode = "0", targetElement) {
  const rootData = await fetchDepartmentNode(rootCode);
  const rootNode = createTreeNode(rootData[0], 0, "node");
  const rootUl = createRootUl(rootNode);
  targetElement.appendChild(rootUl);

  setUpTreeState("lazy", rootNode, targetElement);

  await fetchChildrenNode({
    parentNode: rootNode,
    parentCode: rootData[0].code,
    depth: 1,
    type: "html",
    hidden: false,
  });

  return rootData[0];
}

async function renderFullTree(targetElement) {
  const rootData = await fetchDepartmentList();
  const rootNode = await initializeFullTree("0", rootData);
  targetElement.appendChild(rootNode);

  setUpTreeState("full", rootNode, targetElement);
  return rootData[0];
}

function setUpTreeState(type, rootNode, targetElement) {
  setInitialSelectedNode(rootNode);
  treeEventDelegation(type, targetElement);
}
