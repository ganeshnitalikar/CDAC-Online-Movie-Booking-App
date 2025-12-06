import { createContext, useEffect, useMemo, useState } from "react";
import { getAppTheme, themeColors } from "../constants/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
export const ThemeModeContext = createContext();

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("theme-mode");
    return savedMode || "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setThemeMode = (newMode) => {
    if (newMode === "light" || newMode === "dark") {
      setMode(newMode);
    }
  };

  const theme = useMemo(() => getAppTheme(mode), [mode]);
  const colors = useMemo(() => themeColors[mode], [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      colors,
      toggleMode,
      setThemeMode,
      isDark: mode === "dark",
      isLight: mode === "light",
    }),
    [mode, colors]
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
