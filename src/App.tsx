import { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AppRoutes } from "@/router"
import { Toaster } from "@/components/ui/sonner"
import { useEMSStore } from "@/store/use-ems-store"

export default function App() {
  const initializeAuth = useEMSStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <ThemeProvider defaultTheme="system" storageKey="ems-theme-mode">
      <BrowserRouter>
        <Toaster richColors position="top-center" duration={2500} />
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  )
}
