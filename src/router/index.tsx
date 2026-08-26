import { Suspense, lazy } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EmployeeLayout } from "@/components/layout/employee-layout"
import { LoginPage } from "@/components/login-page"
import { RequireAuthGuard, AdminRouteGuard, AuthRedirectGuard } from "@/router/route-guards"
import { Loader2 } from "lucide-react"
import { useEMSStore } from "@/store/use-ems-store"

// Loading Fallback Component for Suspense
function PageLoadingFallback() {
  return (
    <div className="flex-1 w-full h-[60vh] flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground font-medium">Loading view...</span>
    </div>
  )
}

// Lazy-loaded Admin Portal Pages
const DashboardOverviewPage = lazy(() =>
  import("@/pages/dashboard-overview-page").then((m) => ({ default: m.DashboardOverviewPage }))
)
const EmployeesPage = lazy(() =>
  import("@/pages/employees-page").then((m) => ({ default: m.EmployeesPage }))
)
const AttendancePage = lazy(() =>
  import("@/pages/attendance-page").then((m) => ({ default: m.AttendancePage }))
)
const LeaveManagementPage = lazy(() =>
  import("@/pages/leave-management-page").then((m) => ({ default: m.LeaveManagementPage }))
)
const DepartmentPage = lazy(() =>
  import("@/pages/department-page").then((m) => ({ default: m.DepartmentPage }))
)
const PayrollPage = lazy(() =>
  import("@/pages/payroll-page").then((m) => ({ default: m.PayrollPage }))
)
const PerformancePage = lazy(() =>
  import("@/pages/performance-page").then((m) => ({ default: m.PerformancePage }))
)
const ReportsPage = lazy(() =>
  import("@/pages/reports-page").then((m) => ({ default: m.ReportsPage }))
)
const SettingsPage = lazy(() =>
  import("@/pages/settings-page").then((m) => ({ default: m.SettingsPage }))
)
const SupportPage = lazy(() =>
  import("@/pages/support-page").then((m) => ({ default: m.SupportPage }))
)
const AccountPage = lazy(() =>
  import("@/pages/account-page").then((m) => ({ default: m.AccountPage }))
)
const BillingPage = lazy(() =>
  import("@/pages/billing-page").then((m) => ({ default: m.BillingPage }))
)
const UpgradeToProPage = lazy(() =>
  import("@/pages/upgrade-to-pro-page").then((m) => ({ default: m.UpgradeToProPage }))
)

// Lazy-loaded Employee Self-Service (ESS) Portal Pages
const EmployeeHomePage = lazy(() =>
  import("@/pages/portal/employee-home-page").then((m) => ({ default: m.EmployeeHomePage }))
)
const EmployeeAttendancePage = lazy(() =>
  import("@/pages/portal/employee-attendance-page").then((m) => ({ default: m.EmployeeAttendancePage }))
)
const EmployeeLeavesPage = lazy(() =>
  import("@/pages/portal/employee-leaves-page").then((m) => ({ default: m.EmployeeLeavesPage }))
)
const EmployeePayslipsPage = lazy(() =>
  import("@/pages/portal/employee-payslips-page").then((m) => ({ default: m.EmployeePayslipsPage }))
)
const EmployeePerformancePage = lazy(() =>
  import("@/pages/portal/employee-performance-page").then((m) => ({ default: m.EmployeePerformancePage }))
)
const EmployeeProfilePage = lazy(() =>
  import("@/pages/portal/employee-profile-page").then((m) => ({ default: m.EmployeeProfilePage }))
)
const EmployeeHelpdeskPage = lazy(() =>
  import("@/pages/portal/employee-helpdesk-page").then((m) => ({ default: m.EmployeeHelpdeskPage }))
)

function SmartFallback() {
  const { isAuthenticated, currentUser } = useEMSStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (currentUser?.role === "Admin") {
    return <Navigate to="/" replace />
  }
  return <Navigate to="/portal" replace />
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        {/* Unauthenticated / Login Route with Redirect Guard */}
        <Route element={<AuthRedirectGuard />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Authenticated Routes with RequireAuthGuard */}
        <Route element={<RequireAuthGuard />}>
          {/* Admin / Owner Portal - Protected by AdminRouteGuard */}
          <Route element={<AdminRouteGuard />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<DashboardOverviewPage />} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="leaves" element={<LeaveManagementPage />} />
              <Route path="departments" element={<DepartmentPage />} />
              <Route path="payroll" element={<PayrollPage />} />
              <Route path="performance" element={<PerformancePage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="upgrade-pro" element={<UpgradeToProPage />} />
            </Route>
          </Route>

          {/* Employee Self-Service (ESS) Portal */}
          <Route path="/portal" element={<EmployeeLayout />}>
            <Route index element={<EmployeeHomePage />} />
            <Route path="attendance" element={<EmployeeAttendancePage />} />
            <Route path="leaves" element={<EmployeeLeavesPage />} />
            <Route path="payslips" element={<EmployeePayslipsPage />} />
            <Route path="performance" element={<EmployeePerformancePage />} />
            <Route path="profile" element={<EmployeeProfilePage />} />
            <Route path="helpdesk" element={<EmployeeHelpdeskPage />} />
          </Route>
        </Route>

        {/* Dynamic Fallback route */}
        <Route path="*" element={<SmartFallback />} />
      </Routes>
    </Suspense>
  )
}
