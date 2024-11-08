export default function Layout() {
  const layout = document.createElement("div");
  layout.id = "layout";

  const lnb = `
    <div id="lnb">
      <h1>조직도</h1>
      <ul>
        <li>춘식이</li>
    </div>
  `;

  layout.innerHTML = lnb;

  return layout;
}
