import { useSearchParams } from "react-router-dom"
import { AttendancePage as AttendanceComponent, type AttendanceTab } from "@/components/attendance-page"

export function AttendancePage() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get("tab") as AttendanceTab | null

  return <AttendanceComponent initialSubTab={tabParam || "monitor"} />
}
