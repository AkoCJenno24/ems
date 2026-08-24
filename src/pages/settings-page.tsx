import { useSearchParams } from "react-router-dom"
import { SettingsPage as SettingsComponent, type SettingsTab } from "@/components/settings-page"

export function SettingsPage() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get("tab") as SettingsTab | null

  return <SettingsComponent initialSubTab={tabParam || "roles"} />
}
