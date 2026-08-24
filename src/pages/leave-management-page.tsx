import { useSearchParams } from "react-router-dom"
import { LeaveManagementPage as LeaveComponent, type LeaveTab } from "@/components/leave-management-page"

export function LeaveManagementPage() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get("tab") as LeaveTab | null

  return <LeaveComponent initialSubTab={tabParam || "inbox"} />
}
