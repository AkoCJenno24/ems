import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AppRoutes } from "@/router"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ems-theme-mode">
      <BrowserRouter>
        <Toaster richColors position="top-center" duration={2500} />
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  )
}
