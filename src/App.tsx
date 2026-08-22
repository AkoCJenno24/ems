import { useState } from "react"
import { LoginPage } from "@/components/login-page"
import { DashboardPage } from "@/components/dashboard-page"

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

  if (view === "login") {
    return <LoginPage onSuccess={handleLoginSuccess} />
  }

  return (
    <DashboardPage
      userEmail={userEmail}
      onLogout={handleLogout}
    />
  )
}
