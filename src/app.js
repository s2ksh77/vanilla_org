import Layout from "./components/layout/layout.js";

export default function App({ $target }) {
  const $layout = Layout();
  console.log($layout);
  $target.appendChild($layout);
}
