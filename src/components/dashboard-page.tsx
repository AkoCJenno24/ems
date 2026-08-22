import React, { useState } from "react"
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Users,
  UserCheck,
  Clock,
  Building2,
  Search,
  Plus,
  TrendingUp,
  Sun,
  Moon,
  LogOut,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"

interface DashboardPageProps {
  userEmail?: string
  onLogout?: () => void
}

interface Employee {
  id: string
  name: string
  role: string
  department: string
  status: "Active" | "On Leave" | "Remote"
  email: string
  joinedDate: string
}

const initialEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "Alex Morgan",
    role: "Senior Fullstack Engineer",
    department: "Engineering",
    status: "Active",
    email: "alex.morgan@ems.company",
    joinedDate: "Jan 15, 2023",
  },
  {
    id: "EMP-002",
    name: "Sarah Chen",
    role: "Lead Product Designer",
    department: "Product",
    status: "Active",
    email: "sarah.chen@ems.company",
    joinedDate: "Mar 02, 2023",
  },
  {
    id: "EMP-003",
    name: "Marcus Vance",
    role: "DevOps Architect",
    department: "Infrastructure",
    status: "Remote",
    email: "marcus.vance@ems.company",
    joinedDate: "Jun 11, 2023",
  },
  {
    id: "EMP-004",
    name: "Elena Rostova",
    role: "HR Operations Lead",
    department: "People & Culture",
    status: "On Leave",
    email: "elena.rostova@ems.company",
    joinedDate: "Nov 04, 2023",
  },
  {
    id: "EMP-005",
    name: "David Kim",
    role: "Frontend Engineer",
    department: "Engineering",
    status: "Active",
    email: "david.kim@ems.company",
    joinedDate: "Feb 20, 2024",
  },
]

export function DashboardPage({ userEmail = "admin@ems.company", onLogout }: DashboardPageProps) {
  const [activeNav, setActiveNav] = useState("Dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [newEmployeeName, setNewEmployeeName] = useState("")
  const [newEmployeeRole, setNewEmployeeRole] = useState("")
  const [newEmployeeDept, setNewEmployeeDept] = useState("Engineering")
  const [showAddModal, setShowAddModal] = useState(false)
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  )

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmployeeName.trim() || !newEmployeeRole.trim()) return

    const newEmp: Employee = {
      id: `EMP-00${employees.length + 1}`,
      name: newEmployeeName.trim(),
      role: newEmployeeRole.trim(),
      department: newEmployeeDept,
      status: "Active",
      email: `${newEmployeeName.toLowerCase().replace(/\s+/g, ".")}@ems.company`,
      joinedDate: "Just now",
    }

    setEmployees([newEmp, ...employees])
    setNewEmployeeName("")
    setNewEmployeeRole("")
    setShowAddModal(false)
  }

  const currentUserData = {
    name: userEmail.split("@")[0] || "Admin User",
    email: userEmail,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&dpr=2&q=80",
  }

  const handleNavSelect = (navTitle: string) => {
    setActiveNav(navTitle)
    if (navTitle === "Add employee") {
      setShowAddModal(true)
    }
  }

  const isEmployeeSection = activeNav === "Employees" || activeNav === "Manage employee" || activeNav === "Add employee"

  return (
    <SidebarProvider>
      <AppSidebar
        user={currentUserData}
        activeNav={activeNav}
        onSelectNav={handleNavSelect}
        onLogout={onLogout}
      />
      <SidebarInset>
        {/* Top Header / Navigation */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveNav("Dashboard")
                    }}
                  >
                    EMS
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                {isEmployeeSection ? (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveNav("Manage employee")
                        }}
                      >
                        Employees
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {activeNav === "Add employee" ? "Add Employee" : "Manage Employee"}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard Overview</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right Header Actions */}
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:inline-flex gap-1.5 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>{userEmail}</span>
              </Badge>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleTheme}
                    >
                      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                  }
                />
                <TooltipContent>
                  {isDark ? "Switch to light mode" : "Switch to dark mode"}
                </TooltipContent>
              </Tooltip>

              {onLogout && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onLogout}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <TooltipContent>
                    Log out
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </header>

        {/* Main Dashboard Body */}
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {activeNav === "Add employee"
                  ? "Add New Employee"
                  : isEmployeeSection
                  ? "Manage Employees"
                  : "Enterprise Overview"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {activeNav === "Add employee"
                  ? "Quickly register new staff members and assign their roles."
                  : isEmployeeSection
                  ? "View, filter, and manage staff records across all departments."
                  : "Monitor team directory, active staff, and workplace metrics in real-time."}
              </p>
            </div>
            <Button
              onClick={() => {
                const nextState = !showAddModal
                setShowAddModal(nextState)
                if (nextState) {
                  setActiveNav("Add employee")
                } else if (activeNav === "Add employee") {
                  setActiveNav("Manage employee")
                }
              }}
              className="gap-1.5 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              {showAddModal || activeNav === "Add employee" ? "Close Form" : "Add Employee"}
            </Button>
          </div>

          {/* 3 Metric Summary Cards (sidebar-08 top grid pattern) */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length} Active</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  +12% headcount growth this quarter
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4 Active Units</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Engineering, Product, Infrastructure, People
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Attendance & Shifts</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.4% On Schedule</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  All critical operations covered
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Add Employee Drawer/Card if open */}
          {showAddModal && (
            <Card className="border-primary/30 shadow-sm animate-in fade-in slide-in-from-top-2">
              <CardHeader>
                <CardTitle className="text-lg">Quick Add New Employee</CardTitle>
                <CardDescription>
                  Register a new staff member to the company roster.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddEmployee} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <Input
                    placeholder="Full name (e.g. Maya Lin)"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Role (e.g. QA Specialist)"
                    value={newEmployeeRole}
                    onChange={(e) => setNewEmployeeRole(e.target.value)}
                    required
                  />
                  <select
                    value={newEmployeeDept}
                    onChange={(e) => setNewEmployeeDept(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="People & Culture">People & Culture</option>
                    <option value="Sales">Sales</option>
                  </select>
                  <Button type="submit" className="gap-1.5">
                    <UserCheck className="h-4 w-4" /> Save Record
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Main Content Area: Employee Directory */}
          <Card className="flex-1">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Team Directory & Records</CardTitle>
                <CardDescription>
                  Manage active workforce, permissions, and departmental assignments.
                </CardDescription>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search name, role, department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
                    <tr>
                      <th className="px-4 py-3 font-medium">Employee</th>
                      <th className="px-4 py-3 font-medium">Department</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-muted/40 transition-colors">
                          <td className="px-4 py-3.5 font-medium">
                            <div className="flex flex-col">
                              <span>{emp.name}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {emp.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge variant="secondary" className="font-normal text-xs">
                              {emp.department}
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground">{emp.role}</td>
                          <td className="px-4 py-3.5">
                            <Badge
                              variant={
                                emp.status === "Active"
                                  ? "default"
                                  : emp.status === "Remote"
                                    ? "outline"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {emp.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            {emp.joinedDate}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                          No employee records match &ldquo;{searchQuery}&rdquo;.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
