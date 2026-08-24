import React, { useState } from "react"
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
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
import { Input } from "@/components/ui/input"
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
  Search,
  Sparkles,
  User,
  Clock,
  Megaphone,
} from "lucide-react"
import { toast } from "sonner"

interface DashboardLayoutProps {
  onLogout?: () => void
}

export function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const leaveRequests = useEMSStore((state) => state.leaveRequests)
  const tickets = useEMSStore((state) => state.tickets)
  const [globalSearch, setGlobalSearch] = useState("")

  const pendingLeaves = leaveRequests.filter((l) => l.status === "Pending")
  const openTickets = tickets.filter((t) => t.status !== "Resolved")

  // Generate breadcrumb items from pathname
  const getBreadcrumbs = () => {
    const path = location.pathname
    if (path === "/" || path === "") {
      return [{ title: "Enterprise Overview", href: "/" }]
    }

    const segments = path.split("/").filter(Boolean)
    const breadcrumbs = [{ title: "Dashboard", href: "/" }]

    const routeMap: Record<string, string> = {
      employees: "Manage Employees",
      attendance: "Attendance & Shifts",
      leaves: "Leave Management",
      departments: "Departments & Bands",
      payroll: "Payroll & Compensation",
      performance: "Performance & OKRs",
      reports: "Reports & Analytics",
      settings: "Settings & Audit",
      support: "Support & Helpdesk",
      account: "My Account",
      billing: "Billing & Plans",
      "upgrade-pro": "Upgrade to Pro",
    }

    segments.forEach((seg, idx) => {
      const fullPath = "/" + segments.slice(0, idx + 1).join("/")
      breadcrumbs.push({
        title: routeMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
        href: fullPath,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!globalSearch.trim()) return
    const query = globalSearch.toLowerCase()
    if (
      query.includes("emp") ||
      query.includes("alex") ||
      query.includes("sarah") ||
      query.includes("staff")
    ) {
      navigate(`/employees?search=${encodeURIComponent(globalSearch)}`)
    } else if (
      query.includes("attend") ||
      query.includes("shift") ||
      query.includes("clock")
    ) {
      navigate("/attendance")
    } else if (
      query.includes("leave") ||
      query.includes("vacation") ||
      query.includes("holiday")
    ) {
      navigate("/leaves")
    } else if (
      query.includes("pay") ||
      query.includes("salary") ||
      query.includes("tax")
    ) {
      navigate("/payroll")
    } else if (query.includes("dept") || query.includes("engineer")) {
      navigate("/departments")
    } else {
      toast.info(`Searching system for "${globalSearch}"...`)
      navigate(`/reports?query=${encodeURIComponent(globalSearch)}`)
    }
  }

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
      <AppSidebar onLogout={handleLogoutAction} />
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
            {/* Global Search Bar */}
            <form onSubmit={handleGlobalSearch} className="relative hidden lg:block w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anything... (Ctrl+K)"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="h-9 w-full rounded-lg bg-muted/40 pl-8 pr-4 text-xs focus:bg-background"
              />
            </form>

            {/* Notification Drawer Menu */}
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
                {pendingLeaves.length + openTickets.length > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-2">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-sm font-bold">Notifications</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {pendingLeaves.length + openTickets.length} Pending
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-72 space-y-1 overflow-y-auto py-1">
                  {pendingLeaves.length > 0 ? (
                    pendingLeaves.slice(0, 3).map((leave) => (
                      <DropdownMenuItem
                        key={leave.id}
                        onClick={() => navigate("/leaves")}
                        className="cursor-pointer flex flex-col items-start gap-1 p-2 text-xs rounded-md"
                      >
                        <div className="flex w-full items-center justify-between font-semibold">
                          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                            <Clock className="size-3.5" /> Leave Request
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {leave.appliedOn}
                          </span>
                        </div>
                        <p className="text-muted-foreground line-clamp-1">
                          {leave.employeeName} ({leave.leaveType}) - {leave.days} day(s)
                        </p>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-muted-foreground">
                      No urgent pending alerts
                    </div>
                  )}
                  {openTickets.length > 0 && (
                    <DropdownMenuItem
                      onClick={() => navigate("/support")}
                      className="cursor-pointer flex flex-col items-start gap-1 p-2 text-xs rounded-md"
                    >
                      <div className="flex w-full items-center justify-between font-semibold">
                        <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                          <Megaphone className="size-3.5" /> Support Queue
                        </span>
                        <Badge variant="outline" className="text-[9px]">
                          {openTickets.length} Open
                        </Badge>
                      </div>
                      <p className="text-muted-foreground line-clamp-1">
                        Review submitted employee tickets & inquiries
                      </p>
                    </DropdownMenuItem>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/settings?tab=audit")}
                  className="cursor-pointer justify-center text-center text-xs font-medium text-primary"
                >
                  View Full System Audit Trail
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Quick Switch to Employee Portal */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/portal")}
              className="hidden sm:inline-flex gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer"
            >
              <User className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              Employee Portal
            </Button>

            {/* Pro Upgrade Quick Pill */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/upgrade-pro")}
              className="hidden md:inline-flex gap-1.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/5 cursor-pointer"
            >
              <Sparkles className="size-3.5 text-primary" />
              Pro Tier
            </Button>
          </div>
        </header>

        {/* Main Content View Outlet */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
