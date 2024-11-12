import { initializeTree } from "../Tree/Tree.js";

const tabs = [
  { id: "tab1", label: "조직도 lazy", type: "lazy" },
  { id: "tab2", label: "조직도 full", type: "full" },
];

/**
 * Tabs 구현의도
 * [조직도 1]: 대규모 조직도에서 단계적으로 보여주고자 할 때 lazy 모드를 통한 조직도 트리를 보여줍니다.
 * [조직도 2]: 전체 조직도 구조를 한 번에 확인하고자 할 때 full 모드를 통해 조직도 트리를 보여줍니다.
 * @returns
 */

export function Tabs(content) {
  const TabContainer = document.createElement("div");
  TabContainer.classList.add("tab-container");

  const Wrapper = document.createElement("div");
  Wrapper.classList.add("wrapper");
  Wrapper.appendChild(TabContainer);

  const createTab = (tab, isActive) => {
    const tabElement = document.createElement("div");
    tabElement.className = `tab ${isActive ? "active" : ""}`;
    tabElement.dataset.tab = tab.id;
    tabElement.textContent = tab.label;
    return tabElement;
  };

  const createContentContainer = (tab, isVisible) => {
    const contentContainer = document.createElement("div");
    contentContainer.className = `tab-content-container ${
      isVisible ? "" : "hidden"
    }`;
    contentContainer.dataset.content = tab.id;
    return contentContainer;
  };

  tabs.forEach((tab, index) => {
    TabContainer.appendChild(createTab(tab, index === 0));
    Wrapper.appendChild(createContentContainer(tab, index === 0));
  });

  const renderTree = async (type, container) => {
    container.innerHTML = "";
    const { code, name } = await initializeTree(type, "0", container);
    content.setTextContent(name);
    content.setDepartmentCode(code);
  };

  const toggleTab = (targetElement) => {
    const { tab: dataTabId } = targetElement.dataset;

    tabs.forEach((tab) => {
      const targetTab = TabContainer.querySelector(
        `.tab[data-tab="${tab.id}"]`
      );
      const targetContent = Wrapper.querySelector(
        `.tab-content-container[data-content="${tab.id}"]`
      );
      const isActive = tab.id === dataTabId;

      targetTab.classList.toggle("active", isActive);
      targetContent.classList.toggle("hidden", !isActive);

      if (isActive) renderTree(tab.type, targetContent);
    });
  };

  renderTree(
    "lazy",
    Wrapper.querySelector('.tab-content-container[data-content="tab1"]')
  );

  TabContainer.addEventListener("click", (event) => {
    const tabElement = event.target.closest(".tab");
    if (!tabElement) return;
    toggleTab(tabElement);
  });

  Wrapper.querySelectorAll(".tab-content-container").forEach((container) => {
    container.addEventListener("nodeClick", (event) => {
      const { textContent, code } = event.detail;
      content.setTextContent(textContent);
      content.setDepartmentCode(code);
    });
  });

  return Wrapper;
}
