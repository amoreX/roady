"use client"

import { createContext, useContext, useState, ReactNode } from "react"

const DarkModeContext = createContext<{
  isDarkMode: boolean
  toggleDarkMode: () => void
} | null>(null)

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
    document.documentElement.classList.toggle("dark", !isDarkMode)
    document.documentElement.style.transition = "background-color 0.3s ease";
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider")
  }
  return context
}
