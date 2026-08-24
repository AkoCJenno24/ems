import { Navigate, Outlet } from "react-router-dom"
import { useEMSStore } from "@/store/use-ems-store"
import { toast } from "sonner"

export function AdminRouteGuard() {
  const currentUser = useEMSStore((state) => state.currentUser)

  if (currentUser.role !== "Admin") {
    toast.error("Access Restricted", {
      description:
        "Only organization administrators and owners have access to management console and billing.",
    })
    return <Navigate to="/portal" replace />
  }

  return <Outlet />
}
