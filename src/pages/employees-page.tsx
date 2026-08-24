import { useSearchParams } from "react-router-dom"
import { ManageEmployees } from "@/components/manage-employees"

export function EmployeesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isAddOpen = searchParams.get("action") === "add"

  const handleCloseAdd = () => {
    searchParams.delete("action")
    setSearchParams(searchParams, { replace: true })
  }

  return (
    <ManageEmployees
      initialOpenAdd={isAddOpen}
      onCloseAdd={handleCloseAdd}
    />
  )
}
