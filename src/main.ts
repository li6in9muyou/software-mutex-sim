import "./app.css";
import Layout from "./view/Layout.svelte";

const app = new Layout({
  target: document.getElementById("app"),
});

export default app;
