import { Tabs } from "../Tab/Tabs.js";

export default function LNB(content) {
  const LNB = document.createElement("div");
  LNB.classList.add("lnb");
  const TabsElement = Tabs(content);

  LNB.innerHTML = `
    <div style="padding: 0 20px;">
      <h3>조직도</h3>
    </div>
  `;
  LNB.appendChild(TabsElement);

  return LNB;
}
