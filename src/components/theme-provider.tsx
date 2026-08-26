import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  isDark: false,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

function subscribeSystemTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {}
  const mql = window.matchMedia("(prefers-color-scheme: dark)")
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

function getSystemThemeSnapshot() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ems-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const isSystemDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemThemeSnapshot,
    () => false
  )

  const isDark = theme === "dark" || (theme === "system" && isSystemDark)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(isDark ? "dark" : "light")
  }, [isDark])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
    isDark,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
