import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useEMSStore } from "@/store/use-ems-store"
import { toast } from "sonner"
import { Loader2, ShieldCheck } from "lucide-react"

/**
 * Loading Splash Screen shown when authentication session is resolving
 */
export function AuthLoadingSplash() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background space-y-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 animate-pulse">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <div className="flex items-center space-x-2 text-muted-foreground text-sm font-medium">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span>Verifying security session...</span>
      </div>
    </div>
  )
}

/**
 * Route guard requiring the user to be authenticated.
 * Preserves the target route in the query param `redirect`.
 */
export function RequireAuthGuard() {
  const location = useLocation()
  const { isAuthenticated, isLoadingAuth } = useEMSStore()

  if (isLoadingAuth) {
    return <AuthLoadingSplash />
  }

  if (!isAuthenticated) {
    const redirectParam = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirectParam}`} replace />
  }

  return <Outlet />
}

/**
 * Route guard requiring the user to have the "Admin" role.
 * Non-admin authenticated users are redirected to the ESS portal.
 */
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

/**
 * Route guard for the `/login` route.
 * If already authenticated, redirects directly to the user's dashboard.
 */
export function AuthRedirectGuard() {
  const { isAuthenticated, currentUser } = useEMSStore()

  if (isAuthenticated) {
    if (currentUser.role === "Admin") {
      return <Navigate to="/" replace />
    }
    return <Navigate to="/portal" replace />
  }

  return <Outlet />
}
