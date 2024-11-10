export default function LNB() {
  const LNB = document.createElement("div");
  LNB.classList.add("lnb");

  LNB.innerHTML = `
    <div style="padding: 0 20px;">
      <h3>조직도</h3>
    </div>
  `;

  return LNB;
}
