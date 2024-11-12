import LNB from "./lnb.js";
import Content from "./content.js";

export default function Layout() {
  const layout = document.createElement("div");
  layout.classList.add("layout");

  const content = Content();
  const lnb = LNB(content);

  layout.appendChild(lnb);
  layout.appendChild(content);

  return layout;
}
