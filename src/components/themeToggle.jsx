// src/components/ThemeSwitch.jsx
import { useContext } from "react";
import { ThemeContext } from "../context/themeContext.jsx";

export default function ThemeSwitch() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="absolute top-5 right-5 z-10 flex items-center space-x-2">
      <span className="text-sm text-gray-700 dark:text-gray-200">🌞 Light</span>
      <label className="inline-flex items-center cursor-pointer">
        <span className="relative">
          <input
            type="checkbox"
            checked={isDark}
            onChange={toggleTheme}
            className="sr-only"
          />
          <div className="w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className={`absolute w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out top-1 ${isDark ? 'left-7' : 'left-1'}`}></div>
        </span>
      </label>
      <span className="text-sm text-gray-700 dark:text-gray-200">🌚 Dark</span>
    </div>
  );
}
