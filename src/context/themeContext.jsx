// src/context/ThemeContext.js
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("hs_theme");
    const isLightOrAuto =
      storedTheme === "light" ||
      (storedTheme === "auto" && !window.matchMedia("(prefers-color-scheme: dark)").matches);
    const isDarkOrAuto =
      storedTheme === "dark" ||
      (storedTheme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isLightOrAuto) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else if (isDarkOrAuto) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }

    setIsDark(isDarkOrAuto);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newDark = !prev;
      localStorage.setItem("hs_theme", newDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newDark);
      document.documentElement.classList.toggle("light", !newDark);
      return newDark;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
