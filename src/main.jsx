import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./theme.css";
import "./main.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);
