import { fetchDepartmentNode } from "../../lib/api.js";
import { fetchChildrenNode } from "./appendNode.js";
import { treeEventDelegation } from "./events.js";
import {
  createRootUl,
  createTreeNode,
  setInitialSelectedNode,
} from "./treeNode.js";

export async function initializeTree(rootCode = "0", targetElement) {
  const rootData = await fetchDepartmentNode(rootCode);
  const rootNode = createTreeNode(rootData[0], 0, "node");
  const rootUl = createRootUl(rootNode);
  targetElement.appendChild(rootUl);

  setInitialSelectedNode(rootNode);
  treeEventDelegation(targetElement);

  await fetchChildrenNode({
    parentNode: rootNode,
    parentCode: rootData[0].code,
    depth: 1,
    type: "html",
    hidden: false,
  });

  return rootData[0];
}
