import { useSearchParams } from "react-router-dom"
import { ReportsPage as ReportsComponent, type ReportsTab } from "@/components/reports-page"

export function ReportsPage() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get("tab") as ReportsTab | null

  return <ReportsComponent initialSubTab={tabParam || "standard"} />
}
