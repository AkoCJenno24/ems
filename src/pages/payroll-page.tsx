import { useSearchParams } from "react-router-dom"
import { PayrollPage as PayrollComponent, type PayrollTab } from "@/components/payroll-page"

export function PayrollPage() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get("tab") as PayrollTab | null

  return <PayrollComponent initialSubTab={tabParam || "wizard"} />
}
