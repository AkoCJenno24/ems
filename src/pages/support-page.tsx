import { useSearchParams } from "react-router-dom"
import { SupportPage as SupportComponent, type SupportTab } from "@/components/support-page"

export function SupportPage() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get("tab") as SupportTab | null

  return <SupportComponent initialSubTab={tabParam || "tickets"} />
}
