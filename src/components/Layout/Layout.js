import { initializeTree } from "../Tree/Tree.js";
import LNB from "./lnb.js";
import Content from "./content.js";

export default function Layout() {
  const layout = document.createElement("div");
  layout.classList.add("layout");

  const lnb = LNB();
  const content = Content();

  const initializeNode = async () => {
    const { code, name } = await initializeTree("0", lnb);
    content.setTextContent(name);
    content.setDepartmentCode(code);
  };
  initializeNode();

  lnb.addEventListener("nodeClick", (event) => {
    const { textContent, code } = event.detail;
    content.setTextContent(textContent);
    content.setDepartmentCode(code);
  });

  layout.appendChild(lnb);
  layout.appendChild(content);

  return layout;
}
