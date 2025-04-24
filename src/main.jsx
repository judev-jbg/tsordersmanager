import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import "./main.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <Router>
    <App />
  </Router>
);
