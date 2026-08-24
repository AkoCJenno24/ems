import React from "react"
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom"
import { EmployeeSidebar } from "@/components/layout/employee-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { useEMSStore } from "@/store/use-ems-store"
import {
  Bell,
  Shield,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"

interface EmployeeLayoutProps {
  onLogout?: () => void
}

export function EmployeeLayout({ onLogout }: EmployeeLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = useEMSStore((state) => state.currentUser)
  const leaveRequests = useEMSStore((state) => state.leaveRequests)
  const isAdmin = currentUser.role === "Admin"

  // My personal leaves
  const myLeaves = leaveRequests.filter(
    (l) => l.employeeName === currentUser.name || l.employeeId === currentUser.id
  )
  const recentLeaveUpdate = myLeaves.find((l) => l.status !== "Pending")

  const getBreadcrumbs = () => {
    const path = location.pathname
    if (path === "/portal" || path === "/portal/") {
      return [{ title: "My Workspace", href: "/portal" }]
    }

    const segments = path.replace("/portal", "").split("/").filter(Boolean)
    const breadcrumbs = [{ title: "Portal", href: "/portal" }]

    const routeMap: Record<string, string> = {
      attendance: "My Attendance",
      leaves: "Leaves & Time-Off",
      payslips: "Payslips & Claims",
      performance: "Goals & Performance",
      profile: "Profile & Documents",
      helpdesk: "Helpdesk & Inquiries",
    }

    segments.forEach((seg, idx) => {
      const fullPath = "/portal/" + segments.slice(0, idx + 1).join("/")
      breadcrumbs.push({
        title: routeMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
        href: fullPath,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout()
    } else {
      toast.success("Logged out successfully")
      navigate("/login")
    }
  }

  return (
    <SidebarProvider>
      <EmployeeSidebar onLogout={handleLogoutAction} />
      <SidebarInset className="flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/95 px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, idx) => {
                  const isLast = idx === breadcrumbs.length - 1
                  return (
                    <React.Fragment key={crumb.href}>
                      <BreadcrumbItem className="hidden md:block">
                        {isLast ? (
                          <BreadcrumbPage className="font-semibold text-foreground">
                            {crumb.title}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink render={<Link to={crumb.href} />}>
                            {crumb.title}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </React.Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Only show Quick Switch to Admin Console if user has Admin role */}
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-1.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/5 cursor-pointer shadow-2xs"
              >
                <Shield className="size-3.5 text-primary" />
                <span className="hidden sm:inline">Admin Console</span>
              </Button>
            )}

            {/* Notification Drawer */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative size-9 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                  />
                }
              >
                <Bell className="size-4" />
                {myLeaves.length > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex size-2">
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-2">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-sm font-bold">My Notifications</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {myLeaves.length} Updates
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-72 space-y-1 overflow-y-auto py-1">
                  {recentLeaveUpdate ? (
                    <DropdownMenuItem
                      onClick={() => navigate("/portal/leaves")}
                      className="cursor-pointer flex flex-col items-start gap-1 p-2 text-xs rounded-md"
                    >
                      <div className="flex w-full items-center justify-between font-semibold">
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="size-3.5" /> Leave{" "}
                          {recentLeaveUpdate.status}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {recentLeaveUpdate.appliedOn}
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-1">
                        {recentLeaveUpdate.leaveType} ({recentLeaveUpdate.days}{" "}
                        days) was {recentLeaveUpdate.status.toLowerCase()} by{" "}
                        {recentLeaveUpdate.reviewer || "Manager"}.
                      </p>
                    </DropdownMenuItem>
                  ) : (
                    <div className="p-3 text-center text-xs text-muted-foreground">
                      No new status alerts
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
