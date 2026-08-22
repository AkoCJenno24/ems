import { useState } from "react"
import { LoginPage } from "@/components/login-page"
import { DashboardPage } from "@/components/dashboard-page"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  const [view, setView] = useState<"login" | "dashboard">("login")
  const [userEmail, setUserEmail] = useState<string>("admin@ems.company")

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email)
    setView("dashboard")
  }

  const handleLogout = () => {
    setView("login")
  }

  return (
    <>
      <Toaster richColors position="top-center" duration={1000} />
      {view === "login" ? (
        <LoginPage onSuccess={handleLoginSuccess} />
      ) : (
        <DashboardPage
          userEmail={userEmail}
          onLogout={handleLogout}
        />
      )}
    </>
  )
}
