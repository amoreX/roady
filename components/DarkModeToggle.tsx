"use client"; // Ensure the whole file runs as a client component

import { useDarkMode } from "@/app/context/darkModeContext";

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 px-4 py-3 cursor-pointer rounded-xl bg-gray-200 dark:bg-gray-800 shadow-md"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? "☀️" : "🌙"}
    </button>
  );
}
