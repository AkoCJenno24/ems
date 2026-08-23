import React, { useState, useMemo } from "react"
import { toast } from "sonner"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Download,
  Check,
  X,
  Plus,
  Coffee,
  ShieldCheck,
} from "lucide-react"
import {
  IconClockCheck,
  IconClockExclamation,
  IconCalendarTime,
  IconCalendarEvent,
  IconReceiptTax,
  IconUsers,
} from "@tabler/icons-react"

// Types
export type AttendanceTab = "monitor" | "shifts" | "regularization" | "overtime"

export interface AttendanceRecord {
  id: string
  name: string
  role: string
  department: string
  avatar?: string
  shift: string
  clockIn: string
  clockOut: string
  workingHours: string
  status: "Present" | "Late" | "Half-Day" | "Absent"
  method: "Biometric (Gate 1)" | "Biometric (Gate 2)" | "Mobile GPS" | "Remote VPN"
  location: string
  date: string
}

export interface ShiftRoster {
  id: string
  name: string
  code: string
  timing: string
  staffCount: number
  gracePeriod: string
  breakDuration: string
  color: string
  activeDays: string
}

export interface HolidayItem {
  id: string
  name: string
  date: string
  day: string
  type: "Public Holiday" | "Company Holiday" | "Optional"
}

export interface RegularizationRequest {
  id: string
  employeeName: string
  department: string
  avatar?: string
  date: string
  type: "Missed Clock-In" | "Missed Clock-Out" | "Biometric Scanner Glitch" | "Power Outage"
  actualPunch: string
  requestedPunch: string
  justification: string
  status: "Pending" | "Approved" | "Rejected"
  appliedAt: string
}

export interface OvertimeRecord {
  id: string
  employeeName: string
  department: string
  avatar?: string
  date: string
  regularHours: string
  overtimeHours: number
  rateMultiplier: "1.5x" | "2.0x" | "2.5x"
  hourlyRate: number
  totalPayout: number
  status: "Approved" | "Pending Audit" | "Processed"
  projectCode: string
}

// Dummy Data
const initialAttendanceList: AttendanceRecord[] = [
  {
    id: "ATT-101",
    name: "Alex Morgan",
    role: "Senior Fullstack Engineer",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
    shift: "General (09:00 - 18:00)",
    clockIn: "08:52 AM",
    clockOut: "--:--",
    workingHours: "6h 45m (In Progress)",
    status: "Present",
    method: "Biometric (Gate 1)",
    location: "SF HQ - 4th Floor",
    date: "Aug 22, 2026",
  },
  {
    id: "ATT-102",
    name: "Sarah Chen",
    role: "Lead Product Designer",
    department: "Product",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&dpr=2&q=80",
    shift: "General (09:00 - 18:00)",
    clockIn: "09:04 AM",
    clockOut: "--:--",
    workingHours: "6h 33m (In Progress)",
    status: "Present",
    method: "Biometric (Gate 2)",
    location: "NY Studio",
    date: "Aug 22, 2026",
  },
  {
    id: "ATT-103",
    name: "Marcus Vance",
    role: "DevOps Architect",
    department: "Infrastructure",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&dpr=2&q=80",
    shift: "Morning (07:00 - 16:00)",
    clockIn: "06:58 AM",
    clockOut: "04:10 PM",
    workingHours: "8h 12m",
    status: "Present",
    method: "Remote VPN",
    location: "Austin, TX (Remote)",
    date: "Aug 22, 2026",
  },
  {
    id: "ATT-104",
    name: "Elena Rostova",
    role: "HR Operations Lead",
    department: "People & Culture",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&dpr=2&q=80",
    shift: "General (09:00 - 18:00)",
    clockIn: "--:--",
    clockOut: "--:--",
    workingHours: "0h 00m",
    status: "Absent",
    method: "Mobile GPS",
    location: "On Approved Medical Leave",
    date: "Aug 22, 2026",
  },
  {
    id: "ATT-105",
    name: "David Kim",
    role: "Frontend Engineer",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&dpr=2&q=80",
    shift: "General (09:00 - 18:00)",
    clockIn: "09:34 AM",
    clockOut: "--:--",
    workingHours: "6h 03m (In Progress)",
    status: "Late",
    method: "Biometric (Gate 1)",
    location: "SF HQ - 2nd Floor",
    date: "Aug 22, 2026",
  },
  {
    id: "ATT-106",
    name: "Sophia Martinez",
    role: "Payroll Specialist",
    department: "Finance",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&dpr=2&q=80",
    shift: "General (09:00 - 18:00)",
    clockIn: "09:12 AM",
    clockOut: "01:45 PM",
    workingHours: "4h 33m",
    status: "Half-Day",
    method: "Biometric (Gate 2)",
    location: "Chicago Branch",
    date: "Aug 22, 2026",
  },
  {
    id: "ATT-107",
    name: "Lucas Wright",
    role: "Growth Marketing Manager",
    department: "Sales & Marketing",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=128&h=128&dpr=2&q=80",
    shift: "General (09:00 - 18:00)",
    clockIn: "08:48 AM",
    clockOut: "--:--",
    workingHours: "6h 49m (In Progress)",
    status: "Present",
    method: "Mobile GPS",
    location: "NY Studio",
    date: "Aug 22, 2026",
  },
  {
    id: "ATT-108",
    name: "Maya Lin",
    role: "QA Automation Engineer",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&dpr=2&q=80",
    shift: "Morning (07:00 - 16:00)",
    clockIn: "07:22 AM",
    clockOut: "03:50 PM",
    workingHours: "8h 28m",
    status: "Late",
    method: "Remote VPN",
    location: "Toronto (Remote)",
    date: "Aug 22, 2026",
  },
]

const initialShifts: ShiftRoster[] = [
  {
    id: "SH-01",
    name: "General Corporate Shift",
    code: "GEN-01",
    timing: "09:00 AM - 06:00 PM",
    staffCount: 140,
    gracePeriod: "15 mins",
    breakDuration: "60 mins (13:00 - 14:00)",
    color: "border-primary bg-primary/5",
    activeDays: "Mon, Tue, Wed, Thu, Fri",
  },
  {
    id: "SH-02",
    name: "Early Morning Tech Roster",
    code: "MOR-02",
    timing: "07:00 AM - 04:00 PM",
    staffCount: 65,
    gracePeriod: "10 mins",
    breakDuration: "45 mins (12:00 - 12:45)",
    color: "border-amber-500 bg-amber-500/5",
    activeDays: "Mon, Tue, Wed, Thu, Fri",
  },
  {
    id: "SH-03",
    name: "Infrastructure Night Watch",
    code: "NIT-03",
    timing: "10:00 PM - 07:00 AM",
    staffCount: 43,
    gracePeriod: "20 mins",
    breakDuration: "60 mins (02:00 - 03:00)",
    color: "border-blue-500 bg-blue-500/5",
    activeDays: "Rotational (7 Days)",
  },
]

const initialHolidays: HolidayItem[] = [
  { id: "HOL-1", name: "Labor & Workforce Day", date: "Sep 01, 2026", day: "Tuesday", type: "Public Holiday" },
  { id: "HOL-2", name: "Autumn Equinox Corporate Break", date: "Oct 14, 2026", day: "Wednesday", type: "Company Holiday" },
  { id: "HOL-3", name: "Veterans Appreciation Day", date: "Nov 11, 2026", day: "Wednesday", type: "Public Holiday" },
  { id: "HOL-4", name: "Thanksgiving Day & Autumn Feast", date: "Nov 26, 2026", day: "Thursday", type: "Public Holiday" },
  { id: "HOL-5", name: "Winter Solstice & Year-End Gala", date: "Dec 24, 2026", day: "Thursday", type: "Company Holiday" },
]

const initialRegularizations: RegularizationRequest[] = [
  {
    id: "REG-801",
    employeeName: "David Kim",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&dpr=2&q=80",
    date: "Aug 21, 2026",
    type: "Missed Clock-In",
    actualPunch: "Missing (--:--)",
    requestedPunch: "09:05 AM",
    justification: "Biometric reader at Gate 1 was unresponsive due to firmware update. Team lead verified on-site presence.",
    status: "Pending",
    appliedAt: "Yesterday at 06:30 PM",
  },
  {
    id: "REG-802",
    employeeName: "Maya Lin",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&dpr=2&q=80",
    date: "Aug 20, 2026",
    type: "Power Outage",
    actualPunch: "07:45 AM (Late)",
    requestedPunch: "07:00 AM",
    justification: "Regional ISP DNS blackout delayed remote VPN session authentication by 45 minutes. Commits logged from 7 AM.",
    status: "Pending",
    appliedAt: "2 days ago",
  },
  {
    id: "REG-803",
    employeeName: "Sophia Martinez",
    department: "Finance",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&dpr=2&q=80",
    date: "Aug 19, 2026",
    type: "Missed Clock-Out",
    actualPunch: "Missing (--:--)",
    requestedPunch: "06:15 PM",
    justification: "Had to rush for emergency dental consultation immediately after quarterly tax audit briefing.",
    status: "Pending",
    appliedAt: "3 days ago",
  },
]

const initialOvertimeList: OvertimeRecord[] = [
  {
    id: "OT-501",
    employeeName: "Marcus Vance",
    department: "Infrastructure",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&dpr=2&q=80",
    date: "Aug 21, 2026",
    regularHours: "8.0 hrs",
    overtimeHours: 4.5,
    rateMultiplier: "1.5x",
    hourlyRate: 65,
    totalPayout: 438.75,
    status: "Approved",
    projectCode: "PROJ-AWS-MIGRATION",
  },
  {
    id: "OT-502",
    employeeName: "Alex Morgan",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
    date: "Aug 20, 2026",
    regularHours: "8.0 hrs",
    overtimeHours: 3.0,
    rateMultiplier: "1.5x",
    hourlyRate: 70,
    totalPayout: 315.00,
    status: "Approved",
    projectCode: "PROJ-CORE-RELEASE",
  },
  {
    id: "OT-503",
    employeeName: "David Kim",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&dpr=2&q=80",
    date: "Aug 18, 2026",
    regularHours: "8.0 hrs",
    overtimeHours: 5.0,
    rateMultiplier: "2.0x",
    hourlyRate: 55,
    totalPayout: 550.00,
    status: "Pending Audit",
    projectCode: "PROJ-HOTFIX-V8",
  },
  {
    id: "OT-504",
    employeeName: "Sophia Martinez",
    department: "Finance",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&dpr=2&q=80",
    date: "Aug 15, 2026",
    regularHours: "8.0 hrs",
    overtimeHours: 6.0,
    rateMultiplier: "2.0x",
    hourlyRate: 48,
    totalPayout: 576.00,
    status: "Processed",
    projectCode: "PROJ-Q3-FISCAL-AUDIT",
  },
]

interface AttendancePageProps {
  initialSubTab?: AttendanceTab
  onTabChange?: (tab: AttendanceTab) => void
}

export function AttendancePage({ initialSubTab = "monitor", onTabChange }: AttendancePageProps) {
  const [currentTab, setCurrentTab] = useState<AttendanceTab>(initialSubTab)

  // Synchronize internal tab state whenever initialSubTab prop changes from sidebar navigation
  React.useEffect(() => {
    if (initialSubTab) {
      setCurrentTab(initialSubTab)
    }
  }, [initialSubTab])

  const handleTabSelect = (tab: AttendanceTab) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  // 1. Live Monitor States
  const [attendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceList)
  const [monitorSearch, setMonitorSearch] = useState("")
  const [monitorStatusFilter, setMonitorStatusFilter] = useState("All")
  const [monitorDeptFilter, setMonitorDeptFilter] = useState("All")

  // 2. Shift & Schedule States
  const [shifts] = useState<ShiftRoster[]>(initialShifts)
  const [holidays, setHolidays] = useState<HolidayItem[]>(initialHolidays)
  const [showAddHolidayModal, setShowAddHolidayModal] = useState(false)
  const [newHolidayName, setNewHolidayName] = useState("")
  const [newHolidayDate, setNewHolidayDate] = useState("")
  const [newHolidayType, setNewHolidayType] = useState<HolidayItem["type"]>("Public Holiday")

  // 3. Regularization States
  const [regularizations, setRegularizations] = useState<RegularizationRequest[]>(initialRegularizations)
  const [selectedReg, setSelectedReg] = useState<RegularizationRequest | null>(null)

  // 4. Overtime States
  const [overtimeList, setOvertimeList] = useState<OvertimeRecord[]>(initialOvertimeList)
  const [overtimeFilter, setOvertimeFilter] = useState("All")

  // Filtered Live Monitor Records
  const filteredAttendance = useMemo(() => {
    return attendanceRecords.filter((rec) => {
      const matchesSearch =
        rec.name.toLowerCase().includes(monitorSearch.toLowerCase()) ||
        rec.role.toLowerCase().includes(monitorSearch.toLowerCase()) ||
        rec.department.toLowerCase().includes(monitorSearch.toLowerCase()) ||
        rec.id.toLowerCase().includes(monitorSearch.toLowerCase())
      const matchesStatus = monitorStatusFilter === "All" || rec.status === monitorStatusFilter
      const matchesDept = monitorDeptFilter === "All" || rec.department === monitorDeptFilter
      return matchesSearch && matchesStatus && matchesDept
    })
  }, [attendanceRecords, monitorSearch, monitorStatusFilter, monitorDeptFilter])

  // Live Monitor Counters
  const presentCount = attendanceRecords.filter((r) => r.status === "Present").length
  const lateCount = attendanceRecords.filter((r) => r.status === "Late").length
  const halfDayCount = attendanceRecords.filter((r) => r.status === "Half-Day").length
  const absentCount = attendanceRecords.filter((r) => r.status === "Absent").length
  const totalCount = attendanceRecords.length

  // Handlers for Regularization
  const handleApproveReg = (id: string) => {
    const reg = regularizations.find((r) => r.id === id)
    setRegularizations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    )
    toast.success("Regularization Approved", {
      description: `Approved ${reg?.type || "missed punch"} for ${reg?.employeeName || "employee"}.`,
    })
    if (selectedReg?.id === id) setSelectedReg(null)
  }

  const handleRejectReg = (id: string) => {
    const reg = regularizations.find((r) => r.id === id)
    setRegularizations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
    )
    toast.error("Regularization Rejected", {
      description: `Rejected regularization request for ${reg?.employeeName || "employee"}.`,
    })
    if (selectedReg?.id === id) setSelectedReg(null)
  }

  // Handlers for Holidays
  const handleAddHolidaySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHolidayName.trim() || !newHolidayDate.trim()) return

    const newHol: HolidayItem = {
      id: `HOL-${Date.now()}`,
      name: newHolidayName.trim(),
      date: newHolidayDate,
      day: "Configured",
      type: newHolidayType,
    }
    setHolidays([...holidays, newHol])
    toast.success("Holiday Added to Calendar", {
      description: `${newHol.name} scheduled for ${newHol.date}.`,
    })
    setNewHolidayName("")
    setNewHolidayDate("")
    setShowAddHolidayModal(false)
  }

  // Handlers for Overtime
  const handleApproveOT = (id: string) => {
    const ot = overtimeList.find((o) => o.id === id)
    setOvertimeList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Approved" } : item))
    )
    toast.success("Overtime Claim Approved", {
      description: `Approved ${ot?.overtimeHours}h OT for ${ot?.employeeName} ($${ot?.totalPayout.toFixed(2)}).`,
    })
  }

  const exportOvertimeCSV = () => {
    const headers = ["ID", "Employee", "Department", "Date", "Regular Hours", "OT Hours", "Multiplier", "Hourly Rate", "Total Payout", "Status", "Project"]
    const rows = overtimeList.map((ot) => [
      ot.id,
      `"${ot.employeeName}"`,
      `"${ot.department}"`,
      `"${ot.date}"`,
      ot.regularHours,
      ot.overtimeHours,
      ot.rateMultiplier,
      `$${ot.hourlyRate}`,
      `$${ot.totalPayout.toFixed(2)}`,
      ot.status,
      ot.projectCode,
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `EMS_Overtime_Audit_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Overtime Audit Exported", {
      description: `Downloaded calculations for ${overtimeList.length} overtime records.`,
    })
  }

  const totalOTHours = overtimeList.reduce((acc, curr) => acc + curr.overtimeHours, 0)
  const totalOTPamount = overtimeList.reduce((acc, curr) => acc + curr.totalPayout, 0)
  const pendingRegCount = regularizations.filter((r) => r.status === "Pending").length

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Page Header & Sub Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance & Operations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor live daily check-ins, manage shift rosters, review regularizations, and calculate overtime.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="outline" className="gap-1.5 py-1 px-2.5 text-xs font-medium">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Today: Friday, Aug 22, 2026</span>
          </Badge>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs Control */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 overflow-x-auto">
        <button
          onClick={() => handleTabSelect("monitor")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "monitor"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconClockCheck className="size-4 text-emerald-500" />
          <span>1. Live Attendance Monitor</span>
        </button>

        <button
          onClick={() => handleTabSelect("shifts")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "shifts"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconCalendarTime className="size-4 text-primary" />
          <span>2. Shift & Schedule Builder</span>
        </button>

        <button
          onClick={() => handleTabSelect("regularization")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "regularization"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconClockExclamation className="size-4 text-amber-500" />
          <span>3. Regularization Queue</span>
          {pendingRegCount > 0 && (
            <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-[10px] h-4">
              {pendingRegCount}
            </Badge>
          )}
        </button>

        <button
          onClick={() => handleTabSelect("overtime")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "overtime"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconReceiptTax className="size-4 text-blue-500" />
          <span>4. Overtime Calculations</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: LIVE ATTENDANCE MONITOR */}
      {/* ========================================================================= */}
      {currentTab === "monitor" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Summary Metric Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Card className="shadow-xs p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Total Expected</span>
                <IconUsers className="size-4 text-primary" />
              </div>
              <div className="text-2xl font-bold mt-1">{totalCount}</div>
              <span className="text-[11px] text-muted-foreground">100% scheduled workforce</span>
            </Card>

            <Card className="shadow-xs p-3.5 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Present</span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                {presentCount}
              </div>
              <span className="text-[11px] text-muted-foreground">{((presentCount / totalCount) * 100).toFixed(1)}% on station</span>
            </Card>

            <Card className="shadow-xs p-3.5 border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Late Arrivals</span>
                <IconClockExclamation className="size-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
                {lateCount}
              </div>
              <span className="text-[11px] text-muted-foreground">&gt; 15m grace period</span>
            </Card>

            <Card className="shadow-xs p-3.5 border-purple-500/30 bg-purple-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Half-Day</span>
                <Coffee className="size-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                {halfDayCount}
              </div>
              <span className="text-[11px] text-muted-foreground">Authorized 4h shifts</span>
            </Card>

            <Card className="shadow-xs p-3.5 border-destructive/30 bg-destructive/5 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-destructive">Absent / Unplanned</span>
                <XCircle className="size-4 text-destructive" />
              </div>
              <div className="text-2xl font-bold mt-1 text-destructive">{absentCount}</div>
              <span className="text-[11px] text-muted-foreground">Requires follow-up</span>
            </Card>
          </div>

          {/* Search & Filter Tool */}
          <Card className="shadow-xs">
            <CardContent className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search live punches by name, department, role, or ID..."
                  value={monitorSearch}
                  onChange={(e) => setMonitorSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={monitorStatusFilter}
                  onChange={(e) => setMonitorStatusFilter(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="All">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Half-Day">Half-Day</option>
                  <option value="Absent">Absent</option>
                </select>

                <select
                  value={monitorDeptFilter}
                  onChange={(e) => setMonitorDeptFilter(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="People & Culture">People & Culture</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Live Roster Table */}
          <Card className="shadow-xs overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b select-none">
                    <tr>
                      <th className="px-4 py-3.5 font-semibold">Employee</th>
                      <th className="px-4 py-3.5 font-semibold">Department</th>
                      <th className="px-4 py-3.5 font-semibold">Shift Roster</th>
                      <th className="px-4 py-3.5 font-semibold">Clock In</th>
                      <th className="px-4 py-3.5 font-semibold">Clock Out</th>
                      <th className="px-4 py-3.5 font-semibold">Total Hours</th>
                      <th className="px-4 py-3.5 font-semibold">Status</th>
                      <th className="px-4 py-3.5 font-semibold">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAttendance.map((rec) => (
                      <tr key={rec.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              {rec.avatar && <AvatarImage src={rec.avatar} alt={rec.name} />}
                              <AvatarFallback className="text-xs bg-muted">
                                {rec.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-semibold text-foreground block text-xs sm:text-sm">{rec.name}</span>
                              <span className="text-[11px] text-muted-foreground">{rec.role}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <Badge variant="secondary" className="font-normal text-xs">
                            {rec.department}
                          </Badge>
                        </td>

                        <td className="px-4 py-3.5 text-xs text-muted-foreground">
                          {rec.shift}
                        </td>

                        <td className="px-4 py-3.5 font-mono text-xs">
                          {rec.clockIn === "--:--" ? (
                            <span className="text-muted-foreground">--:--</span>
                          ) : (
                            <span className={rec.status === "Late" ? "text-amber-600 dark:text-amber-400 font-bold" : "text-emerald-600 dark:text-emerald-400 font-medium"}>
                              {rec.clockIn}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                          {rec.clockOut}
                        </td>

                        <td className="px-4 py-3.5 text-xs font-medium">
                          {rec.workingHours}
                        </td>

                        <td className="px-4 py-3.5">
                          <Badge
                            variant={
                              rec.status === "Present"
                                ? "default"
                                : rec.status === "Late"
                                  ? "secondary"
                                  : rec.status === "Half-Day"
                                    ? "outline"
                                    : "destructive"
                            }
                            className={`text-xs ${
                              rec.status === "Present"
                                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                                : rec.status === "Late"
                                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                                  : rec.status === "Half-Day"
                                    ? "text-purple-600 dark:text-purple-400 border-purple-500/30"
                                    : ""
                            }`}
                          >
                            {rec.status}
                          </Badge>
                        </td>

                        <td className="px-4 py-3.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                            <span>{rec.method}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: SHIFT & SCHEDULE BUILDER */}
      {/* ========================================================================= */}
      {currentTab === "shifts" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Active Shift Rosters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Configured Shift Rosters</h2>
              <p className="text-xs text-muted-foreground">
                Set active work hours, lunch breaks, and automated tardiness grace periods.
              </p>
            </div>
            <Button size="sm" className="gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" /> Create Shift Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shifts.map((shift) => (
              <Card key={shift.id} className={`shadow-xs border-2 ${shift.color} transition-all`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {shift.code}
                    </Badge>
                    <span className="text-xs font-semibold text-primary">{shift.staffCount} Staff Assigned</span>
                  </div>
                  <CardTitle className="text-base mt-2">{shift.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-background/80 border">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Shift Timing:
                    </span>
                    <strong className="text-foreground">{shift.timing}</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-background/80 border">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Grace Period:
                    </span>
                    <strong className="text-foreground">{shift.gracePeriod}</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-background/80 border">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Coffee className="h-3.5 w-3.5 text-blue-500" /> Lunch Break:
                    </span>
                    <strong className="text-foreground">{shift.breakDuration}</strong>
                  </div>

                  <div className="text-[11px] text-muted-foreground pt-1">
                    Active Days: <strong>{shift.activeDays}</strong>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Holiday Calendar Configuration */}
          <Card className="shadow-xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <IconCalendarEvent className="size-5 text-primary" />
                  <span>Corporate Holiday & Non-Working Days Calendar (2026)</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Public and company holidays configured for automated attendance exempts.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddHolidayModal(true)}
                className="gap-1.5 cursor-pointer text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Add Holiday
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b select-none">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Holiday Title</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Day of Week</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {holidays.map((hol) => (
                      <tr key={hol.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{hol.name}</td>
                        <td className="px-4 py-3 font-mono text-xs">{hol.date}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{hol.day}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={hol.type === "Public Holiday" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {hol.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Scheduled
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: REGULARIZATION APPROVAL QUEUE */}
      {/* ========================================================================= */}
      {currentTab === "regularization" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Attendance Regularization Requests</h2>
              <p className="text-xs text-muted-foreground">
                Review employee adjustments for missed punches, biometric errors, and authorized schedule exceptions.
              </p>
            </div>

            <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1.5 py-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{pendingRegCount} Pending Review</span>
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {regularizations.map((reg) => (
              <Card
                key={reg.id}
                className="shadow-xs hover:border-primary/40 transition-all p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <Avatar className="h-10 w-10 mt-0.5">
                    {reg.avatar && <AvatarImage src={reg.avatar} alt={reg.employeeName} />}
                    <AvatarFallback className="text-xs font-semibold bg-muted">
                      {reg.employeeName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{reg.employeeName}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {reg.department}
                      </Badge>
                      <Badge variant="outline" className="font-mono text-[10px] text-amber-600 dark:text-amber-400 border-amber-500/30">
                        {reg.type}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">• For Date: <strong>{reg.date}</strong></span>
                    </div>

                    <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
                      <span>Recorded Punch: <strong className="text-destructive font-mono">{reg.actualPunch}</strong></span>
                      <span>→</span>
                      <span>Requested Adjustment: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{reg.requestedPunch}</strong></span>
                    </div>

                    <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-md border text-foreground/90 italic mt-1">
                      &ldquo;{reg.justification}&rdquo;
                    </p>
                    <span className="text-[10px] text-muted-foreground block pt-0.5">Submitted {reg.appliedAt}</span>
                  </div>
                </div>

                {/* Approval Controls */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {reg.status === "Pending" ? (
                    <>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectReg(reg.id)}
                        className="h-8 text-xs px-3 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproveReg(reg.id)}
                        className="h-8 text-xs px-3 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> Approve Punch
                      </Button>
                    </>
                  ) : (
                    <Badge
                      variant={reg.status === "Approved" ? "default" : "destructive"}
                      className="text-xs py-1 px-2.5"
                    >
                      {reg.status === "Approved" ? "✓ Approved by Admin" : "✗ Rejected"}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: OVERTIME CALCULATIONS */}
      {/* ========================================================================= */}
      {currentTab === "overtime" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Overtime Metric KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="shadow-xs p-4">
              <span className="text-xs font-medium text-muted-foreground block">Total Overtime Hours</span>
              <div className="text-2xl font-bold mt-1 text-primary">{totalOTHours.toFixed(1)} hrs</div>
              <span className="text-[11px] text-muted-foreground">Logged this billing cycle</span>
            </Card>

            <Card className="shadow-xs p-4">
              <span className="text-xs font-medium text-muted-foreground block">Calculated OT Payout</span>
              <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                ${totalOTPamount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-muted-foreground">Ready for payroll sync</span>
            </Card>

            <Card className="shadow-xs p-4">
              <span className="text-xs font-medium text-muted-foreground block">Overtime Multipliers</span>
              <div className="text-sm font-semibold mt-1">
                Standard: <strong className="text-primary">1.5x</strong> • Weekend: <strong className="text-primary">2.0x</strong>
              </div>
              <span className="text-[11px] text-muted-foreground">Compliant with labor policy</span>
            </Card>

            <Card className="shadow-xs p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Payroll Export</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Export verified OT sheets to CSV.</p>
              </div>
              <Button
                size="sm"
                onClick={exportOvertimeCSV}
                className="w-full gap-1.5 cursor-pointer mt-2"
              >
                <Download className="h-3.5 w-3.5" /> Export for Payroll
              </Button>
            </Card>
          </div>

          {/* Overtime Audit Table */}
          <Card className="shadow-xs overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
              <div>
                <CardTitle className="text-base">Excess Working Hours & Overtime Audit</CardTitle>
                <CardDescription className="text-xs">
                  Automated multiplier computation based on regular vs excess hours logged.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={overtimeFilter}
                  onChange={(e) => setOvertimeFilter(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="All">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending Audit">Pending Audit</option>
                  <option value="Processed">Processed</option>
                </select>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b select-none">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Employee</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold">Date Logged</th>
                      <th className="px-4 py-3 font-semibold">Base Shift</th>
                      <th className="px-4 py-3 font-semibold">Excess (OT)</th>
                      <th className="px-4 py-3 font-semibold">Multiplier</th>
                      <th className="px-4 py-3 font-semibold">Calculated Payout</th>
                      <th className="px-4 py-3 font-semibold">Project Code</th>
                      <th className="px-4 py-3 font-semibold text-right">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {overtimeList
                      .filter((ot) => overtimeFilter === "All" || ot.status === overtimeFilter)
                      .map((ot) => (
                        <tr key={ot.id} className="hover:bg-muted/40 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-8 w-8">
                                {ot.avatar && <AvatarImage src={ot.avatar} alt={ot.employeeName} />}
                                <AvatarFallback className="text-xs bg-muted">
                                  {ot.employeeName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-semibold text-foreground text-xs sm:text-sm">{ot.employeeName}</span>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <Badge variant="secondary" className="font-normal text-xs">
                              {ot.department}
                            </Badge>
                          </td>

                          <td className="px-4 py-3.5 font-mono text-xs">{ot.date}</td>

                          <td className="px-4 py-3.5 text-xs text-muted-foreground">{ot.regularHours}</td>

                          <td className="px-4 py-3.5 font-mono text-xs font-bold text-primary">
                            +{ot.overtimeHours} hrs
                          </td>

                          <td className="px-4 py-3.5">
                            <Badge variant="outline" className="font-mono text-[10px] text-blue-600 dark:text-blue-400 border-blue-500/30">
                              {ot.rateMultiplier}
                            </Badge>
                          </td>

                          <td className="px-4 py-3.5 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            ${ot.totalPayout.toFixed(2)}
                          </td>

                          <td className="px-4 py-3.5 font-mono text-[11px] text-muted-foreground">
                            {ot.projectCode}
                          </td>

                          <td className="px-4 py-3.5 text-right">
                            {ot.status === "Pending Audit" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveOT(ot.id)}
                                className="h-7 text-xs px-2 cursor-pointer text-emerald-600 hover:text-emerald-700"
                              >
                                <Check className="h-3 w-3 mr-1" /> Approve
                              </Button>
                            ) : (
                              <Badge
                                variant={ot.status === "Approved" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {ot.status}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL: Add Holiday Modal */}
      {showAddHolidayModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-md shadow-2xl border-border animate-in zoom-in-95">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <IconCalendarEvent className="size-5 text-primary" />
                  <span>Add Calendar Holiday</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddHolidayModal(false)}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Schedule an official non-working day for automated payroll and attendance exempts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="add-holiday-form" onSubmit={handleAddHolidaySubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Holiday Name *
                  </label>
                  <Input
                    placeholder="e.g. Founders Day Celebration"
                    value={newHolidayName}
                    onChange={(e) => setNewHolidayName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Date *
                  </label>
                  <Input
                    type="date"
                    value={newHolidayDate}
                    onChange={(e) => setNewHolidayDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Category
                  </label>
                  <select
                    value={newHolidayType}
                    onChange={(e) => setNewHolidayType(e.target.value as HolidayItem["type"])}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Public Holiday">Public Holiday</option>
                    <option value="Company Holiday">Company Holiday</option>
                    <option value="Optional">Optional Floating Holiday</option>
                  </select>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddHolidayModal(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button form="add-holiday-form" type="submit" className="gap-1.5 cursor-pointer">
                <Plus className="h-4 w-4" /> Save Holiday
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
