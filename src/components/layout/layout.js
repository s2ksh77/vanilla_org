import { initializeTree } from "../../lib/logic.js";

export default function Layout() {
  const layout = document.createElement("div");
  layout.id = "layout";

  const initializeNode = async () => await initializeTree("0", layout);
  initializeNode();

  return layout;
}
