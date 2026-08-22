import React, { useState } from "react"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"
import { ManageEmployees } from "@/components/manage-employees"
import { AttendancePage, type AttendanceTab } from "@/components/attendance-page"
import { LeaveManagementPage, type LeaveTab } from "@/components/leave-management-page"
import { DepartmentPage, type DepartmentTab } from "@/components/department-page"
import { PayrollPage, type PayrollTab } from "@/components/payroll-page"
import { PerformancePage, type PerformanceTab } from "@/components/performance-page"
import { ReportsPage, type ReportsTab } from "@/components/reports-page"
import { SettingsPage, type SettingsTab } from "@/components/settings-page"
import { SupportPage, type SupportTab } from "@/components/support-page"
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
  CardFooter,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Clock,
  Megaphone,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Send,
  Check,
  X,
  Bell,
} from "lucide-react"
import {
  IconUsers,
  IconCalendarOff,
  IconClockCheck,
  IconAlertCircle,
  IconUserPlus,
  IconSpeakerphone,
} from "@tabler/icons-react"

interface DashboardPageProps {
  userEmail?: string
  onLogout?: () => void
}

interface ActivityItem {
  id: string
  type: "checkin" | "leave" | "document"
  user: {
    name: string
    avatar?: string
    initials: string
    department: string
  }
  title: string
  description: string
  timestamp: string
  status?: "pending" | "approved" | "completed" | "urgent"
  documentName?: string
  documentSize?: string
}

interface UrgentLeave {
  id: string
  employeeName: string
  department: string
  type: string
  duration: string
  date: string
  reason: string
  status: "Pending" | "Approved" | "Rejected"
}

// Monthly Attendance Data (12 months)
const monthlyAttendanceData = [
  { month: "Jan", rate: 94.5, present: 232, onLeave: 16, late: 8 },
  { month: "Feb", rate: 95.8, present: 236, onLeave: 12, late: 5 },
  { month: "Mar", rate: 96.2, present: 238, onLeave: 10, late: 6 },
  { month: "Apr", rate: 93.9, present: 231, onLeave: 17, late: 9 },
  { month: "May", rate: 97.1, present: 242, onLeave: 8, late: 4 },
  { month: "Jun", rate: 96.4, present: 240, onLeave: 11, late: 5 },
  { month: "Jul", rate: 95.1, present: 235, onLeave: 15, late: 7 },
  { month: "Aug", rate: 96.8, present: 243, onLeave: 9, late: 4 },
  { month: "Sep", rate: 97.5, present: 245, onLeave: 7, late: 3 },
  { month: "Oct", rate: 95.9, present: 239, onLeave: 13, late: 6 },
  { month: "Nov", rate: 96.3, present: 241, onLeave: 11, late: 5 },
  { month: "Dec", rate: 94.8, present: 234, onLeave: 18, late: 8 },
]

const initialActivities: ActivityItem[] = [
  {
    id: "act-1",
    type: "checkin",
    user: {
      name: "Sarah Chen",
      initials: "SC",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&dpr=2&q=80",
      department: "Product",
    },
    title: "Clocked in on time",
    description: "Office HQ - 3rd Floor Design Lab (Biometric Verified)",
    timestamp: "2 mins ago",
    status: "completed",
  },
  {
    id: "act-2",
    type: "leave",
    user: {
      name: "Elena Rostova",
      initials: "ER",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&dpr=2&q=80",
      department: "People & Culture",
    },
    title: "Submitted Urgent Leave Request",
    description: "Annual Medical Leave (3 Days: Aug 24 - Aug 26)",
    timestamp: "14 mins ago",
    status: "urgent",
  },
  {
    id: "act-3",
    type: "document",
    user: {
      name: "David Kim",
      initials: "DK",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&dpr=2&q=80",
      department: "Engineering",
    },
    title: "Uploaded Compliance Document",
    description: "Annual Security & NDA Compliance Form 2026",
    timestamp: "35 mins ago",
    documentName: "NDA_Security_Signed_DK.pdf",
    documentSize: "2.4 MB",
    status: "completed",
  },
  {
    id: "act-4",
    type: "checkin",
    user: {
      name: "Marcus Vance",
      initials: "MV",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&dpr=2&q=80",
      department: "Infrastructure",
    },
    title: "Remote VPN Check-in",
    description: "Verified via Gateway Austin-US-East (IP: 192.168.4.12)",
    timestamp: "1 hour ago",
    status: "completed",
  },
  {
    id: "act-5",
    type: "leave",
    user: {
      name: "Sophia Martinez",
      initials: "SM",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&dpr=2&q=80",
      department: "Finance",
    },
    title: "Leave Request Approved",
    description: "Compensatory Off for Q3 Fiscal Audit Sprint",
    timestamp: "3 hours ago",
    status: "approved",
  },
  {
    id: "act-6",
    type: "document",
    user: {
      name: "Alex Morgan",
      initials: "AM",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
      department: "Engineering",
    },
    title: "Uploaded Performance Self-Evaluation",
    description: "Mid-Year Engineering Leadership Matrix",
    timestamp: "5 hours ago",
    documentName: "Q2_Engineering_Review_AM.pdf",
    documentSize: "1.8 MB",
    status: "completed",
  },
]

const initialUrgentLeaves: UrgentLeave[] = [
  {
    id: "LV-901",
    employeeName: "Elena Rostova",
    department: "People & Culture",
    type: "Emergency Medical",
    duration: "3 Days",
    date: "Aug 24 - Aug 26, 2026",
    reason: "Scheduled family emergency surgical consultation.",
    status: "Pending",
  },
  {
    id: "LV-902",
    employeeName: "Marcus Vance",
    department: "Infrastructure",
    type: "Casual Leave",
    duration: "1 Day",
    date: "Aug 25, 2026",
    reason: "Home utility and fiber broadband relocation inspection.",
    status: "Pending",
  },
  {
    id: "LV-903",
    employeeName: "Lucas Wright",
    department: "Sales & Marketing",
    type: "Paternity Leave",
    duration: "5 Days",
    date: "Aug 28 - Sep 01, 2026",
    reason: "Childcare and family support.",
    status: "Pending",
  },
]

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  type: "leave" | "attendance" | "payroll" | "performance" | "security"
  read: boolean
  targetNav: string
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Urgent Leave Request",
    description: "Elena Rostova submitted medical leave (3 days).",
    time: "10m ago",
    type: "leave",
    read: false,
    targetNav: "Leave Management",
  },
  {
    id: "notif-2",
    title: "Overtime Claim Pending",
    description: "Alex Morgan logged 3.0h overtime on core release.",
    time: "45m ago",
    type: "attendance",
    read: false,
    targetNav: "Attendance",
  },
  {
    id: "notif-3",
    title: "August Payroll Ready",
    description: "Direct deposit ACH disbursement batch generated.",
    time: "2h ago",
    type: "payroll",
    read: false,
    targetNav: "Payroll",
  },
  {
    id: "notif-4",
    title: "Q3 Review Cycle Milestone",
    description: "Manager reviews are due in 4 days (75% submitted).",
    time: "5h ago",
    type: "performance",
    read: true,
    targetNav: "Performance",
  },
]

export function DashboardPage({ userEmail = "admin@ems.company", onLogout }: DashboardPageProps) {
  const [activeNav, setActiveNav] = useState("Dashboard")
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities)
  const [urgentLeaves, setUrgentLeaves] = useState<UrgentLeave[]>(initialUrgentLeaves)
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [activityFilter, setActivityFilter] = useState<"all" | "checkin" | "leave" | "document">("all")
  const [selectedChartRange, setSelectedChartRange] = useState<"6M" | "1Y">("1Y")
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(7) // Default August

  const unreadNotifCount = notifications.filter((n) => !n.read).length

  const handleMarkAllNotificationsAsRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success("Notifications marked as read")
  }

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    )
    if (item.targetNav) {
      setActiveNav(item.targetNav)
    }
  }

  // Quick Action Modal States (when on Dashboard overview)
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
  const [showUrgentLeavesModal, setShowUrgentLeavesModal] = useState(false)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)

  // Add Employee Form States
  const [newEmployeeName, setNewEmployeeName] = useState("")
  const [newEmployeeRole, setNewEmployeeRole] = useState("")
  const [newEmployeeDept, setNewEmployeeDept] = useState("Engineering")

  // Broadcast Form States
  const [broadcastTitle, setBroadcastTitle] = useState("")
  const [broadcastMessage, setBroadcastMessage] = useState("")
  const [broadcastPriority, setBroadcastPriority] = useState("High")
  const [broadcastSuccess, setBroadcastSuccess] = useState(false)

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

  // Quick Actions Handlers
  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmployeeName.trim() || !newEmployeeRole.trim()) return

    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      type: "checkin",
      user: {
        name: newEmployeeName.trim(),
        initials: newEmployeeName.substring(0, 2).toUpperCase(),
        department: newEmployeeDept,
      },
      title: "New Employee Onboarded",
      description: `Assigned as ${newEmployeeRole} in ${newEmployeeDept}`,
      timestamp: "Just now",
      status: "completed",
    }
    setActivities([newAct, ...activities])

    toast.success("Employee Added", {
      description: `${newEmployeeName.trim()} has been registered in ${newEmployeeDept}.`,
    })

    setNewEmployeeName("")
    setNewEmployeeRole("")
    setShowAddEmployeeModal(false)
  }

  const handleApproveLeave = (id: string) => {
    const leave = urgentLeaves.find((l) => l.id === id)
    setUrgentLeaves((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Approved" } : item))
    )
    toast.success("Leave Request Approved", {
      description: `Approved emergency leave for ${leave?.employeeName || "Employee"}.`,
    })
  }

  const handleRejectLeave = (id: string) => {
    const leave = urgentLeaves.find((l) => l.id === id)
    setUrgentLeaves((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Rejected" } : item))
    )
    toast.error("Leave Request Rejected", {
      description: `Rejected leave request for ${leave?.employeeName || "Employee"}.`,
    })
  }

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return

    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      type: "document",
      user: {
        name: "Admin Broadcast",
        initials: "HQ",
        department: "Operations",
      },
      title: `Broadcast: ${broadcastTitle.trim()}`,
      description: broadcastMessage.trim(),
      timestamp: "Just now",
      status: "urgent",
    }
    setActivities([newAct, ...activities])

    toast.success("Broadcast Dispatched", {
      description: `"${broadcastTitle.trim()}" delivered to all staff dashboards.`,
    })

    setBroadcastSuccess(true)
    setTimeout(() => {
      setBroadcastSuccess(false)
      setShowBroadcastModal(false)
      setBroadcastTitle("")
      setBroadcastMessage("")
    }, 1200)
  }

  const currentUserData = {
    name: userEmail.split("@")[0] || "Admin User",
    email: userEmail,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&dpr=2&q=80",
  }

  const filteredActivities = activities.filter((act) => {
    if (activityFilter === "all") return true
    return act.type === activityFilter
  })

  const pendingLeavesCount = urgentLeaves.filter((l) => l.status === "Pending").length

  const chartData =
    selectedChartRange === "6M"
      ? monthlyAttendanceData.slice(6)
      : monthlyAttendanceData

  const activeMonthData =
    hoveredBarIndex !== null && chartData[hoveredBarIndex]
      ? chartData[hoveredBarIndex]
      : chartData[chartData.length - 1]

  const isEmployeeSection =
    activeNav === "Employees" ||
    activeNav === "Manage Employee" ||
    activeNav === "Add Employee"

  const isAttendanceSection =
    activeNav === "Attendance" ||
    activeNav === "Live Monitor" ||
    activeNav === "Shift & Schedules" ||
    activeNav === "Regularization Queue" ||
    activeNav === "Overtime Tracker"

  const isLeaveSection =
    activeNav === "Leave Management" ||
    activeNav === "Request Inbox" ||
    activeNav === "Policy Engine" ||
    activeNav === "Leave Calendar"

  const isDepartmentSection =
    activeNav === "Departments" ||
    activeNav === "Department Setup" ||
    activeNav === "Designations & Bands"

  const isPayrollSection =
    activeNav === "Payroll" ||
    activeNav === "Payroll Run Wizard" ||
    activeNav === "Salary Structures" ||
    activeNav === "Payslips & Distribution" ||
    activeNav === "Disbursement Reports"

  const isPerformanceSection =
    activeNav === "Performance" ||
    activeNav === "Review Cycles" ||
    activeNav === "Goals & OKRs"

  const isReportsSection =
    activeNav === "Reports" ||
    activeNav === "Standard Reports" ||
    activeNav === "Custom Export Builder"

  const isSettingsSection =
    activeNav === "Settings" ||
    activeNav === "Roles & Permissions" ||
    activeNav === "Audit Trail" ||
    activeNav === "System Preferences"

  const isSupportSection =
    activeNav === "Support" ||
    activeNav === "Help & Support" ||
    activeNav === "Support Tickets" ||
    activeNav === "Submit Request" ||
    activeNav === "Knowledge Base" ||
    activeNav === "Service Health"

  const getAttendanceSubTab = (): AttendanceTab => {
    switch (activeNav) {
      case "Shift & Schedules":
        return "shifts"
      case "Regularization Queue":
        return "regularization"
      case "Overtime Tracker":
        return "overtime"
      default:
        return "monitor"
    }
  }

  const handleAttendanceTabChange = (tab: AttendanceTab) => {
    switch (tab) {
      case "shifts":
        setActiveNav("Shift & Schedules")
        break
      case "regularization":
        setActiveNav("Regularization Queue")
        break
      case "overtime":
        setActiveNav("Overtime Tracker")
        break
      default:
        setActiveNav("Live Monitor")
        break
    }
  }

  const getLeaveSubTab = (): LeaveTab => {
    switch (activeNav) {
      case "Policy Engine":
        return "policies"
      case "Leave Calendar":
        return "calendar"
      default:
        return "inbox"
    }
  }

  const handleLeaveTabChange = (tab: LeaveTab) => {
    switch (tab) {
      case "policies":
        setActiveNav("Policy Engine")
        break
      case "calendar":
        setActiveNav("Leave Calendar")
        break
      default:
        setActiveNav("Request Inbox")
        break
    }
  }

  const getDepartmentSubTab = (): DepartmentTab => {
    switch (activeNav) {
      case "Designations & Bands":
        return "designations"
      default:
        return "departments"
    }
  }

  const handleDepartmentTabChange = (tab: DepartmentTab) => {
    switch (tab) {
      case "designations":
        setActiveNav("Designations & Bands")
        break
      default:
        setActiveNav("Department Setup")
        break
    }
  }

  const getPayrollSubTab = (): PayrollTab => {
    switch (activeNav) {
      case "Salary Structures":
        return "structures"
      case "Payslips & Distribution":
        return "payslips"
      case "Disbursement Reports":
        return "disbursements"
      default:
        return "wizard"
    }
  }

  const handlePayrollTabChange = (tab: PayrollTab) => {
    switch (tab) {
      case "structures":
        setActiveNav("Salary Structures")
        break
      case "payslips":
        setActiveNav("Payslips & Distribution")
        break
      case "disbursements":
        setActiveNav("Disbursement Reports")
        break
      default:
        setActiveNav("Payroll Run Wizard")
        break
    }
  }

  const getPerformanceSubTab = (): PerformanceTab => {
    switch (activeNav) {
      case "Goals & OKRs":
        return "goals"
      default:
        return "cycles"
    }
  }

  const handlePerformanceTabChange = (tab: PerformanceTab) => {
    switch (tab) {
      case "goals":
        setActiveNav("Goals & OKRs")
        break
      default:
        setActiveNav("Review Cycles")
        break
    }
  }

  const getReportsSubTab = (): ReportsTab => {
    switch (activeNav) {
      case "Custom Export Builder":
        return "custom"
      default:
        return "standard"
    }
  }

  const handleReportsTabChange = (tab: ReportsTab) => {
    switch (tab) {
      case "custom":
        setActiveNav("Custom Export Builder")
        break
      default:
        setActiveNav("Standard Reports")
        break
    }
  }

  const getSettingsSubTab = (): SettingsTab => {
    switch (activeNav) {
      case "Audit Trail":
        return "audit"
      case "System Preferences":
        return "preferences"
      default:
        return "roles"
    }
  }

  const handleSettingsTabChange = (tab: SettingsTab) => {
    switch (tab) {
      case "audit":
        setActiveNav("Audit Trail")
        break
      case "preferences":
        setActiveNav("System Preferences")
        break
      default:
        setActiveNav("Roles & Permissions")
        break
    }
  }

  const getSupportSubTab = (): SupportTab => {
    switch (activeNav) {
      case "Submit Request":
        return "submit"
      case "Knowledge Base":
        return "knowledge"
      case "Service Health":
        return "status"
      default:
        return "tickets"
    }
  }

  const handleSupportTabChange = (tab: SupportTab) => {
    switch (tab) {
      case "submit":
        setActiveNav("Submit Request")
        break
      case "knowledge":
        setActiveNav("Knowledge Base")
        break
      case "status":
        setActiveNav("Service Health")
        break
      default:
        setActiveNav("Support Tickets")
        break
    }
  }

  // Helper to determine breadcrumb parent and current page cleanly
  const getBreadcrumbData = () => {
    if (isEmployeeSection) {
      return {
        parent: "Employees",
        page: activeNav === "Employees" ? "Manage Employees" : activeNav,
      }
    }
    if (isAttendanceSection) {
      return {
        parent: "Attendance",
        page: activeNav === "Attendance" ? "Live Monitor" : activeNav,
      }
    }
    if (isLeaveSection) {
      return {
        parent: "Leave Management",
        page: activeNav === "Leave Management" ? "Request Inbox" : activeNav,
      }
    }
    if (isDepartmentSection) {
      return {
        parent: "Departments",
        page: activeNav === "Departments" ? "Department Setup" : activeNav,
      }
    }
    if (isPayrollSection) {
      return {
        parent: "Payroll",
        page: activeNav === "Payroll" ? "Payroll Run Wizard" : activeNav,
      }
    }
    if (isPerformanceSection) {
      return {
        parent: "Performance",
        page: activeNav === "Performance" ? "Review Cycles" : activeNav,
      }
    }
    if (isReportsSection) {
      return {
        parent: "Reports",
        page: activeNav === "Reports" ? "Standard Reports" : activeNav,
      }
    }
    if (isSettingsSection) {
      return {
        parent: "Settings",
        page: activeNav === "Settings" ? "Roles & Permissions" : activeNav,
      }
    }
    if (isSupportSection) {
      return {
        parent: "Support",
        page: activeNav === "Support" ? "Support Tickets" : activeNav,
      }
    }
    return {
      parent: null,
      page: activeNav,
    }
  }

  const breadcrumbData = getBreadcrumbData()

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const formatUserName = (email: string) => {
    const raw = email.split("@")[0] || "User"
    return raw
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={currentUserData}
        activeNav={activeNav}
        onSelectNav={(title) => {
          setActiveNav(title)
        }}
        onLogout={onLogout}
      />
      <SidebarInset>
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
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

                {breadcrumbData.parent ? (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveNav(breadcrumbData.parent!)
                        }}
                      >
                        {breadcrumbData.parent}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{breadcrumbData.page}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{breadcrumbData.page}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right Header Badges & Actions */}
          <TooltipProvider>
            <div className="flex items-center gap-2">
              {/* Centralized Notification Bell */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="outline"
                            size="icon"
                            className="relative cursor-pointer"
                          >
                            <Bell className="h-4 w-4" />
                            {unreadNotifCount > 0 && (
                              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground px-1 shadow-xs ring-2 ring-background animate-pulse">
                                {unreadNotifCount}
                              </span>
                            )}
                          </Button>
                        }
                      />
                    }
                  />
                  <TooltipContent>
                    {unreadNotifCount > 0 ? `Notifications (${unreadNotifCount} unread)` : "Notifications"}
                  </TooltipContent>
                </Tooltip>

                <DropdownMenuContent
                  align="end"
                  className="w-80 sm:w-96 p-0 rounded-xl shadow-xl border border-border"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">Notifications</span>
                      {unreadNotifCount > 0 ? (
                        <Badge variant="secondary" className="text-[10px] font-medium py-0 px-1.5 h-4">
                          {unreadNotifCount} new
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] font-normal py-0 px-1.5 h-4 text-muted-foreground">
                          All caught up
                        </Badge>
                      )}
                    </div>
                    {unreadNotifCount > 0 && (
                      <button
                        onClick={handleMarkAllNotificationsAsRead}
                        className="text-xs text-primary hover:underline font-medium cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">
                        No notifications to display
                      </div>
                    ) : (
                      notifications.map((item) => {
                        return (
                          <DropdownMenuItem
                            key={item.id}
                            onClick={() => handleNotificationClick(item)}
                            className={`flex items-start gap-3 p-3 text-xs cursor-pointer transition-colors ${
                              item.read ? "opacity-75 hover:opacity-100" : "bg-primary/5 font-medium"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0 rounded-lg p-1.5 bg-muted">
                              {item.type === "leave" && <IconCalendarOff className="size-4 text-amber-500" />}
                              {item.type === "attendance" && <IconClockCheck className="size-4 text-blue-500" />}
                              {item.type === "payroll" && <FileText className="size-4 text-emerald-500" />}
                              {item.type === "performance" && <CheckCircle2 className="size-4 text-purple-500" />}
                              {item.type === "security" && <ShieldCheck className="size-4 text-rose-500" />}
                            </div>

                            <div className="flex-1 min-w-0 space-y-0.5">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`truncate ${!item.read ? "font-semibold text-foreground" : "text-foreground/90"}`}>
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                  {item.time}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                                {item.description}
                              </p>
                            </div>

                            {!item.read && (
                              <span className="size-2 rounded-full bg-primary shrink-0 self-center" />
                            )}
                          </DropdownMenuItem>
                        )
                      })
                    )}
                  </div>

                  <DropdownMenuSeparator className="m-0" />
                  <div className="p-2 bg-muted/20 text-center">
                    <button
                      onClick={() => {
                        setActiveNav("Dashboard")
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground font-medium cursor-pointer w-full py-1"
                    >
                      View Live Activity Stream →
                    </button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleTheme}
                      className="cursor-pointer"
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
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <TooltipContent>Log out</TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl w-full mx-auto">
          {isEmployeeSection ? (
            /* Manage Employees View (CRUD, Profiles, Search, Filters) */
            <ManageEmployees
              initialOpenAdd={activeNav === "Add Employee"}
              onCloseAdd={() => setActiveNav("Manage Employee")}
            />
          ) : isAttendanceSection ? (
            /* Attendance Section (Live Monitor, Shifts, Regularization, Overtime) */
            <AttendancePage
              initialSubTab={getAttendanceSubTab()}
              onTabChange={handleAttendanceTabChange}
            />
          ) : isLeaveSection ? (
            /* Leave Management Section (Inbox, Policy Engine, Calendar) */
            <LeaveManagementPage
              initialSubTab={getLeaveSubTab()}
              onTabChange={handleLeaveTabChange}
            />
          ) : isDepartmentSection ? (
            /* Department Section (Setup, Leads, Budgets, Designations & Pay Bands) */
            <DepartmentPage
              initialSubTab={getDepartmentSubTab()}
              onTabChange={handleDepartmentTabChange}
            />
          ) : isPayrollSection ? (
            /* Payroll Section (Wizard, Salary Structures, Payslips, Bank Disbursements) */
            <PayrollPage
              initialSubTab={getPayrollSubTab()}
              onTabChange={handlePayrollTabChange}
            />
          ) : isPerformanceSection ? (
            /* Performance Section (Review Cycles, Goal & KPI Tracking) */
            <PerformancePage
              initialSubTab={getPerformanceSubTab()}
              onTabChange={handlePerformanceTabChange}
            />
          ) : isReportsSection ? (
            /* Reports Section (Standard Reports, Custom Data Export Builder) */
            <ReportsPage
              initialSubTab={getReportsSubTab()}
              onTabChange={handleReportsTabChange}
            />
          ) : isSettingsSection ? (
            /* Settings Section (Roles & Permissions, Audit Trail, System Preferences) */
            <SettingsPage
              initialSubTab={getSettingsSubTab()}
              onTabChange={handleSettingsTabChange}
            />
          ) : isSupportSection ? (
            /* Support Section (Tickets, Submit Request, Knowledge Base, Service Status) */
            <SupportPage
              initialSubTab={getSupportSubTab()}
              onTabChange={handleSupportTabChange}
              userEmail={userEmail}
            />
          ) : (
            /* Dashboard Overview View */
            <>
              {/* Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {getTimeGreeting()}, {formatUserName(userEmail)}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Here is your business overview for today.
                  </p>
                </div>

                {/* Quick Action Buttons Toolbar */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUrgentLeavesModal(true)}
                    className="gap-1.5 cursor-pointer relative"
                  >
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    <span>Approve Leaves</span>
                    {pendingLeavesCount > 0 && (
                      <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-[10px] h-4">
                        {pendingLeavesCount}
                      </Badge>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBroadcastModal(true)}
                    className="gap-1.5 cursor-pointer"
                  >
                    <Megaphone className="h-3.5 w-3.5 text-blue-500" />
                    <span>Broadcast</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => setShowAddEmployeeModal(true)}
                    className="gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Employee</span>
                  </Button>
                </div>
              </div>

              {/* 1. SUMMARY METRIC CARDS */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1: Total Active Employees */}
                <Card className="hover:border-primary/40 transition-all shadow-xs">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Active Employees
                    </CardTitle>
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <IconUsers className="size-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight">248</div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs">
                      <Badge variant="secondary" className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-0 font-medium px-1.5 py-0.5 gap-0.5">
                        <ArrowUpRight className="h-3 w-3" /> +4 this mo.
                      </Badge>
                      <span className="text-muted-foreground">96% active roster</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metric 2: On-Leave */}
                <Card className="hover:border-primary/40 transition-all shadow-xs">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      On-Leave Today
                    </CardTitle>
                    <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                      <IconCalendarOff className="size-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight">14</div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 font-medium text-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                        8 Planned
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        6 Emergency/Sick
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metric 3: Attendance Rate */}
                <Card className="hover:border-primary/40 transition-all shadow-xs">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Attendance Rate
                    </CardTitle>
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <IconClockCheck className="size-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight">96.8%</div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs">
                      <Badge variant="secondary" className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-0 font-medium px-1.5 py-0.5 gap-0.5">
                        <TrendingUp className="h-3 w-3" /> +1.2%
                      </Badge>
                      <span className="text-muted-foreground">vs last week (Avg 95.6%)</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metric 4: Pending Approval */}
                <Card className="hover:border-primary/40 transition-all shadow-xs">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Pending Approvals
                    </CardTitle>
                    <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <IconAlertCircle className="size-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight">{pendingLeavesCount + 4}</div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/30 px-1.5 py-0 text-[11px]">
                        {pendingLeavesCount} Urgent Leaves
                      </Badge>
                      <span className="text-muted-foreground">4 Expense/Docs</span>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 2. QUICK-ACTION TRIGGERS CARDS */}
              <section>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Quick Action 1 */}
                  <div
                    onClick={() => setShowAddEmployeeModal(true)}
                    className="group relative flex items-start gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-xs hover:border-primary/50 hover:bg-accent/40 transition-all cursor-pointer"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconUserPlus className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Add New Employee</h3>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        Quickly register a new team member, set departmental roles, and send onboarding credentials.
                      </p>
                    </div>
                  </div>

                  {/* Quick Action 2 */}
                  <div
                    onClick={() => setShowUrgentLeavesModal(true)}
                    className="group relative flex items-start gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-xs hover:border-amber-500/50 hover:bg-accent/40 transition-all cursor-pointer"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Clock className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">Approve Urgent Leaves</h3>
                          {pendingLeavesCount > 0 && (
                            <span className="inline-flex items-center rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive">
                              {pendingLeavesCount} pending
                            </span>
                          )}
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        Review and authorize pending time-off, sick days, and emergency requests instantly.
                      </p>
                    </div>
                  </div>

                  {/* Quick Action 3 */}
                  <div
                    onClick={() => setShowBroadcastModal(true)}
                    className="group relative flex items-start gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-xs hover:border-blue-500/50 hover:bg-accent/40 transition-all cursor-pointer"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <IconSpeakerphone className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Broadcast Announcement</h3>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        Dispatch an organization-wide alert, policy update, or holiday reminder to all employee portals.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. VISUAL CHARTS & 4. ACTIVITY FEED (2-Column Grid) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 3. VISUAL CHARTS: Monthly Attendance Trends (7 Cols) */}
                <Card className="lg:col-span-7 flex flex-col shadow-xs">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <CardTitle className="text-base font-semibold">Monthly Attendance Trends</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          Visual breakdown of present headcount, leaves, and punctuality rate.
                        </CardDescription>
                      </div>

                      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg self-start sm:self-auto">
                        <Button
                          variant={selectedChartRange === "6M" ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => {
                            setSelectedChartRange("6M")
                            setHoveredBarIndex(5)
                          }}
                          className="h-7 text-xs px-2.5 cursor-pointer"
                        >
                          Last 6 Months
                        </Button>
                        <Button
                          variant={selectedChartRange === "1Y" ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => {
                            setSelectedChartRange("1Y")
                            setHoveredBarIndex(7)
                          }}
                          className="h-7 text-xs px-2.5 cursor-pointer"
                        >
                          Full Year (12M)
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between pt-2">
                    {/* Active Highlighted Month Details Card */}
                    {activeMonthData && (
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/40 p-3 border border-border/50 text-xs">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-semibold">
                            Month: {activeMonthData.month}
                          </Badge>
                          <span className="font-medium">
                            Attendance Rate:{" "}
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {activeMonthData.rate}%
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            Present: <strong className="text-foreground">{activeMonthData.present}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-orange-500" />
                            On-Leave: <strong className="text-foreground">{activeMonthData.onLeave}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            Late: <strong className="text-foreground">{activeMonthData.late}</strong>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* SVG Visual Attendance Chart */}
                    <div className="relative h-60 w-full pt-4 pb-2">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-muted-foreground/60">
                        <div className="border-b border-dashed border-border/60 pb-1 flex justify-between">
                          <span>100%</span>
                          <span className="text-[9px]">Target: 98%</span>
                        </div>
                        <div className="border-b border-dashed border-border/60 pb-1">
                          <span>95%</span>
                        </div>
                        <div className="border-b border-dashed border-border/60 pb-1">
                          <span>90%</span>
                        </div>
                        <div className="border-b border-dashed border-border/60 pb-1">
                          <span>85%</span>
                        </div>
                      </div>

                      {/* Chart Bars */}
                      <div className="relative h-full flex items-end justify-between gap-1 sm:gap-2 px-6 pt-3 z-0">
                        {chartData.map((item, idx) => {
                          const isHovered = hoveredBarIndex === idx
                          const minRate = 85
                          const normalizedHeight = Math.max(
                            10,
                            Math.min(100, ((item.rate - minRate) / (100 - minRate)) * 100)
                          )

                          return (
                            <div
                              key={item.month}
                              onMouseEnter={() => setHoveredBarIndex(idx)}
                              className="group/bar flex-1 h-full flex flex-col items-center justify-end cursor-pointer"
                            >
                              <div className="relative w-full max-w-[28px] flex items-end justify-center h-full">
                                <div
                                  style={{ height: `${normalizedHeight}%` }}
                                  className={`w-full rounded-t-md transition-all duration-200 ${
                                    isHovered
                                      ? "bg-primary shadow-md scale-y-105"
                                      : "bg-primary/70 hover:bg-primary/90"
                                  }`}
                                />
                              </div>
                              <span
                                className={`text-[11px] mt-2 transition-colors ${
                                  isHovered
                                    ? "font-bold text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {item.month}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 border-t text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Annual average attendance rate: 95.8% (Exceeds 95% KPI)</span>
                    </div>
                    <div className="text-muted-foreground">Hover bar to inspect monthly records</div>
                  </CardFooter>
                </Card>

                {/* 4. ACTIVITY FEED: Real-time Check-ins, Leaves, Document Uploads (5 Cols) */}
                <Card className="lg:col-span-5 flex flex-col shadow-xs">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <span>Operational Activity</span>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          Live stream of check-ins, leave submissions & uploads.
                        </CardDescription>
                      </div>
                    </div>

                    {/* Activity Feed Filter Tabs */}
                    <div className="flex items-center gap-1 pt-2 overflow-x-auto">
                      <Button
                        variant={activityFilter === "all" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActivityFilter("all")}
                        className="h-7 text-xs px-2.5 rounded-full cursor-pointer"
                      >
                        All ({activities.length})
                      </Button>
                      <Button
                        variant={activityFilter === "checkin" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActivityFilter("checkin")}
                        className="h-7 text-xs px-2.5 rounded-full cursor-pointer"
                      >
                        Check-ins
                      </Button>
                      <Button
                        variant={activityFilter === "leave" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActivityFilter("leave")}
                        className="h-7 text-xs px-2.5 rounded-full cursor-pointer"
                      >
                        Leaves
                      </Button>
                      <Button
                        variant={activityFilter === "document" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActivityFilter("document")}
                        className="h-7 text-xs px-2.5 rounded-full cursor-pointer"
                      >
                        Uploads
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto max-h-[360px] space-y-3 pr-2">
                    {filteredActivities.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-start gap-3 p-2.5 rounded-lg border border-transparent hover:border-border/60 hover:bg-muted/40 transition-colors"
                      >
                        <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                          {act.user.avatar && <AvatarImage src={act.user.avatar} alt={act.user.name} />}
                          <AvatarFallback className="text-[11px] font-semibold bg-muted">
                            {act.user.initials}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-xs truncate">{act.user.name}</span>
                            <span className="text-[10px] text-muted-foreground shrink-0">{act.timestamp}</span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5">
                            {act.type === "checkin" && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-0.5">
                                <Clock className="h-2.5 w-2.5" /> Check-in
                              </Badge>
                            )}
                            {act.type === "leave" && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1 text-orange-600 dark:text-orange-400 border-orange-500/30 gap-0.5">
                                <Calendar className="h-2.5 w-2.5" /> Leave
                              </Badge>
                            )}
                            {act.type === "document" && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1 text-blue-600 dark:text-blue-400 border-blue-500/30 gap-0.5">
                                <FileText className="h-2.5 w-2.5" /> File
                              </Badge>
                            )}
                            <span className="text-xs font-medium truncate">{act.title}</span>
                          </div>

                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{act.description}</p>

                          {act.documentName && (
                            <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1 text-[11px] text-foreground">
                              <FileText className="h-3.5 w-3.5 text-blue-500" />
                              <span className="font-mono text-[10px]">{act.documentName}</span>
                              <span className="text-muted-foreground text-[9px]">({act.documentSize})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>

                  <CardFooter className="pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => setActivityFilter("all")}
                    >
                      Showing {filteredActivities.length} operational log entries
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* MODAL 1: Quick Add Employee Modal (Dashboard shortcut) */}
        {showAddEmployeeModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <Card className="w-full max-w-lg shadow-2xl border-border animate-in zoom-in-95">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IconUserPlus className="size-5 text-primary" />
                    <span>Quick Add New Employee</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAddEmployeeModal(false)}
                    className="h-7 w-7 rounded-full cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Register a new staff profile in the enterprise management directory.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="add-emp-form" onSubmit={handleAddEmployeeSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Full Name
                    </label>
                    <Input
                      placeholder="e.g. Maya Chen"
                      value={newEmployeeName}
                      onChange={(e) => setNewEmployeeName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Job Title / Role
                    </label>
                    <Input
                      placeholder="e.g. Senior QA Engineer"
                      value={newEmployeeRole}
                      onChange={(e) => setNewEmployeeRole(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Department
                    </label>
                    <select
                      value={newEmployeeDept}
                      onChange={(e) => setNewEmployeeDept(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="People & Culture">People & Culture</option>
                      <option value="Finance">Finance</option>
                      <option value="Sales & Marketing">Sales & Marketing</option>
                    </select>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button form="add-emp-form" type="submit" className="gap-1.5 cursor-pointer">
                  <Plus className="h-4 w-4" /> Add Record
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* MODAL 2: Approve Urgent Leaves Modal */}
        {showUrgentLeavesModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <Card className="w-full max-w-2xl shadow-2xl border-border animate-in zoom-in-95">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="size-5 text-amber-500" />
                    <span>Approve Urgent Leave Requests</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowUrgentLeavesModal(false)}
                    className="h-7 w-7 rounded-full cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Pending employee time-off submissions requiring immediate administrative review.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {urgentLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="p-3.5 rounded-lg border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{leave.employeeName}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {leave.department}
                        </Badge>
                        <Badge
                          variant={
                            leave.status === "Approved"
                              ? "default"
                              : leave.status === "Rejected"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {leave.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <strong>{leave.type}</strong> ({leave.duration}): {leave.date}
                      </p>
                      <p className="text-xs text-muted-foreground/80 mt-0.5 italic">
                        &ldquo;{leave.reason}&rdquo;
                      </p>
                    </div>

                    {leave.status === "Pending" ? (
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectLeave(leave.id)}
                          className="h-7 text-xs px-2.5 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5 mr-1" /> Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveLeave(leave.id)}
                          className="h-7 text-xs px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">
                        {leave.status === "Approved" ? "✓ Approved" : "✗ Rejected"}
                      </span>
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <span className="text-xs text-muted-foreground">
                  {pendingLeavesCount} remaining requests
                </span>
                <Button
                  variant="outline"
                  onClick={() => setShowUrgentLeavesModal(false)}
                  className="cursor-pointer"
                >
                  Done
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* MODAL 3: Broadcast Announcement Modal */}
        {showBroadcastModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <Card className="w-full max-w-lg shadow-2xl border-border animate-in zoom-in-95">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IconSpeakerphone className="size-5 text-blue-500" />
                    <span>Broadcast Company Announcement</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowBroadcastModal(false)}
                    className="h-7 w-7 rounded-full cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Send an official notification to all employees in the workforce.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {broadcastSuccess ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                    <p className="font-semibold text-base">Announcement Broadcasted!</p>
                    <p className="text-xs text-muted-foreground">
                      Delivered to all active staff channels.
                    </p>
                  </div>
                ) : (
                  <form id="broadcast-form" onSubmit={handleBroadcastSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        Announcement Title
                      </label>
                      <Input
                        placeholder="e.g. Q3 Townhall Meeting & Holiday Notice"
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        Priority Level
                      </label>
                      <select
                        value={broadcastPriority}
                        onChange={(e) => setBroadcastPriority(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="Normal">Normal Notification</option>
                        <option value="High">High Priority</option>
                        <option value="Urgent">Urgent / Action Required</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        Announcement Message
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Type the message content that will appear on employee dashboards..."
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                        required
                      />
                    </div>
                  </form>
                )}
              </CardContent>
              {!broadcastSuccess && (
                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowBroadcastModal(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button form="broadcast-form" type="submit" className="gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                    <Send className="h-4 w-4" /> Send Broadcast
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
