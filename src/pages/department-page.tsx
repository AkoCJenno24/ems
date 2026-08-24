import { useSearchParams } from "react-router-dom"
import { DepartmentPage as DepartmentComponent, type DepartmentTab } from "@/components/department-page"

export function DepartmentPage() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get("tab") as DepartmentTab | null

  return <DepartmentComponent initialSubTab={tabParam || "departments"} />
}
