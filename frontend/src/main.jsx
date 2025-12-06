import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeModeProvider } from "./context/ThemeContext.jsx";
createRoot(document.getElementById("root")).render(
  <ThemeModeProvider>
    <App />
  </ThemeModeProvider>
);