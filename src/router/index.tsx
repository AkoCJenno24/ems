import { Routes, Route, Navigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EmployeeLayout } from "@/components/layout/employee-layout"
import { LoginPage } from "@/components/login-page"
import { AdminRouteGuard } from "@/router/route-guards"

// Admin Portal Pages
import { DashboardOverviewPage } from "@/pages/dashboard-overview-page"
import { EmployeesPage } from "@/pages/employees-page"
import { AttendancePage } from "@/pages/attendance-page"
import { LeaveManagementPage } from "@/pages/leave-management-page"
import { DepartmentPage } from "@/pages/department-page"
import { PayrollPage } from "@/pages/payroll-page"
import { PerformancePage } from "@/pages/performance-page"
import { ReportsPage } from "@/pages/reports-page"
import { SettingsPage } from "@/pages/settings-page"
import { SupportPage } from "@/pages/support-page"
import { AccountPage } from "@/pages/account-page"
import { BillingPage } from "@/pages/billing-page"
import { UpgradeToProPage } from "@/pages/upgrade-to-pro-page"

// Employee Self-Service (ESS) Portal Pages
import { EmployeeHomePage } from "@/pages/portal/employee-home-page"
import { EmployeeAttendancePage } from "@/pages/portal/employee-attendance-page"
import { EmployeeLeavesPage } from "@/pages/portal/employee-leaves-page"
import { EmployeePayslipsPage } from "@/pages/portal/employee-payslips-page"
import { EmployeePerformancePage } from "@/pages/portal/employee-performance-page"
import { EmployeeProfilePage } from "@/pages/portal/employee-profile-page"
import { EmployeeHelpdeskPage } from "@/pages/portal/employee-helpdesk-page"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Admin / Owner Portal Layout & Routes - Protected by AdminRouteGuard */}
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

      {/* Employee Self-Service (ESS) Portal Layout & Routes */}
      <Route path="/portal" element={<EmployeeLayout />}>
        <Route index element={<EmployeeHomePage />} />
        <Route path="attendance" element={<EmployeeAttendancePage />} />
        <Route path="leaves" element={<EmployeeLeavesPage />} />
        <Route path="payslips" element={<EmployeePayslipsPage />} />
        <Route path="performance" element={<EmployeePerformancePage />} />
        <Route path="profile" element={<EmployeeProfilePage />} />
        <Route path="helpdesk" element={<EmployeeHelpdeskPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/portal" replace />} />
    </Routes>
  )
}
