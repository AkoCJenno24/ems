import { useSearchParams } from "react-router-dom"
import { PerformancePage as PerformanceComponent, type PerformanceTab } from "@/components/performance-page"

export function PerformancePage() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get("tab")
  const subTab: PerformanceTab = tabParam === "goals" ? "goals" : "cycles"

  return <PerformanceComponent initialSubTab={subTab} />
}
