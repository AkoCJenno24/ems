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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Search,
  Download,
  Check,
  X,
  MessageSquare,
} from "lucide-react"
import {
  IconCalendarOff,
  IconCalendarEvent,
  IconAdjustments,
} from "@tabler/icons-react"

export type LeaveTab = "inbox" | "policies" | "calendar"

export interface LeaveRequest {
  id: string
  employeeName: string
  role: string
  department: string
  avatar?: string
  leaveType: "Annual Paid Leave" | "Medical / Sick Leave" | "Parental Leave" | "Unpaid Emergency" | "Compensatory Off"
  isPaid: boolean
  startDate: string
  endDate: string
  durationDays: number
  reason: string
  remainingBalance: number
  totalAllowed: number
  status: "Pending" | "Approved" | "Rejected"
  appliedDate: string
  reviewerNote?: string
  departmentConflictCount: number // How many other dept colleagues are away during this time
}

export interface LeavePolicy {
  id: string
  title: string
  type: "Paid" | "Unpaid" | "Partially Paid"
  accrualRate: string
  annualQuota: string
  maxCarryOver: string
  noticePeriod: string
  maxConsecutive: string
  description: string
  color: string
}

export interface BlackoutDate {
  id: string
  title: string
  startDate: string
  endDate: string
  department: string
  reason: string
  level: "Strict Freeze" | "Manager Discretion"
}

export interface CalendarStaffLeave {
  id: string
  name: string
  department: string
  avatar?: string
  role: string
  leaveType: "Annual" | "Sick" | "Parental" | "Unpaid"
  startDay: number
  endDay: number
  dateRange: string
}

// Dummy Data
const initialLeaveRequests: LeaveRequest[] = [
  {
    id: "LR-301",
    employeeName: "Elena Rostova",
    role: "HR Operations Lead",
    department: "People & Culture",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&dpr=2&q=80",
    leaveType: "Medical / Sick Leave",
    isPaid: true,
    startDate: "Aug 24, 2026",
    endDate: "Aug 26, 2026",
    durationDays: 3,
    reason: "Scheduled outpatient surgical treatment and follow-up medical recovery.",
    remainingBalance: 9,
    totalAllowed: 12,
    status: "Pending",
    appliedDate: "Today at 09:15 AM",
    departmentConflictCount: 0,
  },
  {
    id: "LR-302",
    employeeName: "Marcus Vance",
    role: "DevOps Architect",
    department: "Infrastructure",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&dpr=2&q=80",
    leaveType: "Annual Paid Leave",
    isPaid: true,
    startDate: "Aug 27, 2026",
    endDate: "Aug 28, 2026",
    durationDays: 2,
    reason: "Family relocation and home fiber network setup assistance.",
    remainingBalance: 14,
    totalAllowed: 20,
    status: "Pending",
    appliedDate: "Yesterday at 04:30 PM",
    departmentConflictCount: 1,
  },
  {
    id: "LR-303",
    employeeName: "Sarah Chen",
    role: "Lead Product Designer",
    department: "Product",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&dpr=2&q=80",
    leaveType: "Annual Paid Leave",
    isPaid: true,
    startDate: "Sep 02, 2026",
    endDate: "Sep 08, 2026",
    durationDays: 5,
    reason: "Annual vacation and international UX conference participation.",
    remainingBalance: 16,
    totalAllowed: 20,
    status: "Pending",
    appliedDate: "Aug 20, 2026",
    departmentConflictCount: 2,
  },
  {
    id: "LR-304",
    employeeName: "David Kim",
    role: "Frontend Engineer",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&dpr=2&q=80",
    leaveType: "Compensatory Off",
    isPaid: true,
    startDate: "Aug 25, 2026",
    endDate: "Aug 25, 2026",
    durationDays: 1,
    reason: "Comp off for weekend emergency cloud outage deployment sprint.",
    remainingBalance: 3,
    totalAllowed: 5,
    status: "Approved",
    appliedDate: "Aug 19, 2026",
    reviewerNote: "Approved per DevOps overtime agreement.",
    departmentConflictCount: 0,
  },
  {
    id: "LR-305",
    employeeName: "Lucas Wright",
    role: "Growth Marketing Manager",
    department: "Sales & Marketing",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=128&h=128&dpr=2&q=80",
    leaveType: "Parental Leave",
    isPaid: true,
    startDate: "Sep 10, 2026",
    endDate: "Sep 24, 2026",
    durationDays: 10,
    reason: "Paternity bonding leave following new infant arrival.",
    remainingBalance: 30,
    totalAllowed: 60,
    status: "Pending",
    appliedDate: "Aug 18, 2026",
    departmentConflictCount: 0,
  },
]

const initialPolicies: LeavePolicy[] = [
  {
    id: "POL-01",
    title: "Annual Paid Time Off (PTO)",
    type: "Paid",
    accrualRate: "1.66 days / month",
    annualQuota: "20 Days / Year",
    maxCarryOver: "Up to 5 days (Lapses March 31)",
    noticePeriod: "5 Business Days in advance",
    maxConsecutive: "14 Calendar Days",
    description: "Standard vacation entitlement for all full-time confirmed employees.",
    color: "border-primary bg-primary/5",
  },
  {
    id: "POL-02",
    title: "Medical & Sick Absence",
    type: "Paid",
    accrualRate: "1.0 day / month",
    annualQuota: "12 Days / Year",
    maxCarryOver: "0 days (Non-cumulative)",
    noticePeriod: "Same day (within 2h of shift start)",
    maxConsecutive: "5 Days without medical board review",
    description: "Health recovery and hospitalization days. Medical certificate mandatory for > 2 days.",
    color: "border-orange-500 bg-orange-500/5",
  },
  {
    id: "POL-03",
    title: "Parental & Childcare Leave",
    type: "Paid",
    accrualRate: "Event-based grant",
    annualQuota: "60 Days (Primary) / 15 Days (Secondary)",
    maxCarryOver: "N/A (Within 12 months of birth)",
    noticePeriod: "30 Days advance notice",
    maxConsecutive: "60 Days continuous",
    description: "Maternity and paternity leaves for newborn care or legal adoption.",
    color: "border-blue-500 bg-blue-500/5",
  },
  {
    id: "POL-04",
    title: "Unpaid Sabbatical / Emergency",
    type: "Unpaid",
    accrualRate: "On-demand authorization",
    annualQuota: "Up to 30 Days / Year",
    maxCarryOver: "0 days",
    noticePeriod: "10 Business Days",
    maxConsecutive: "30 Days",
    description: "Extended personal leaves without remuneration upon executive VP approval.",
    color: "border-purple-500 bg-purple-500/5",
  },
]

const initialBlackouts: BlackoutDate[] = [
  {
    id: "BO-01",
    title: "Q3 Fiscal Financial Audit & Tax Filing",
    startDate: "Sep 25, 2026",
    endDate: "Sep 30, 2026",
    department: "Finance & Accounting",
    reason: "Mandatory corporate tax closing and shareholder dividend auditing.",
    level: "Strict Freeze",
  },
  {
    id: "BO-02",
    title: "Core Enterprise Platform v3.0 Global Launch",
    startDate: "Oct 01, 2026",
    endDate: "Oct 08, 2026",
    department: "Engineering & Infrastructure",
    reason: "All-hands production deployment and 24/7 reliability war room.",
    level: "Strict Freeze",
  },
  {
    id: "BO-03",
    title: "Q4 Black Friday & Cyber Week Campaign",
    startDate: "Nov 20, 2026",
    endDate: "Nov 30, 2026",
    department: "Sales & Marketing",
    reason: "Peak customer acquisition and enterprise contract closure window.",
    level: "Manager Discretion",
  },
]

const augustCalendarStaffLeaves: CalendarStaffLeave[] = [
  { id: "CL-1", name: "Elena Rostova", department: "People & Culture", role: "HR Operations", leaveType: "Sick", startDay: 24, endDay: 26, dateRange: "Aug 24 - Aug 26" },
  { id: "CL-2", name: "Marcus Vance", department: "Infrastructure", role: "DevOps Architect", leaveType: "Annual", startDay: 27, endDay: 28, dateRange: "Aug 27 - Aug 28" },
  { id: "CL-3", name: "Sarah Chen", department: "Product", role: "Design Lead", leaveType: "Annual", startDay: 28, endDay: 31, dateRange: "Aug 28 - Aug 31" },
  { id: "CL-4", name: "Alex Morgan", department: "Engineering", role: "Senior Engineer", leaveType: "Annual", startDay: 10, endDay: 14, dateRange: "Aug 10 - Aug 14" },
  { id: "CL-5", name: "Sophia Martinez", department: "Finance", role: "Payroll Lead", leaveType: "Sick", startDay: 18, endDay: 19, dateRange: "Aug 18 - Aug 19" },
]

interface LeaveManagementPageProps {
  initialSubTab?: LeaveTab
  onTabChange?: (tab: LeaveTab) => void
}

export function LeaveManagementPage({ initialSubTab = "inbox", onTabChange }: LeaveManagementPageProps) {
  const [currentTab, setCurrentTab] = useState<LeaveTab>(initialSubTab)

  // 1. Leave Requests States
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests)
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [deptFilter, setDeptFilter] = useState("All")

  // Modal Review Note States
  const [selectedRequestForNote, setSelectedRequestForNote] = useState<LeaveRequest | null>(null)
  const [reviewerNoteText, setReviewerNoteText] = useState("")

  // 2. Policies & Blackout States
  const [policies] = useState<LeavePolicy[]>(initialPolicies)
  const [blackouts, setBlackouts] = useState<BlackoutDate[]>(initialBlackouts)
  const [showAddBlackoutModal, setShowAddBlackoutModal] = useState(false)
  const [newBlackoutTitle, setNewBlackoutTitle] = useState("")
  const [newBlackoutStart, setNewBlackoutStart] = useState("")
  const [newBlackoutEnd, setNewBlackoutEnd] = useState("")
  const [newBlackoutDept, setNewBlackoutDept] = useState("All Departments")
  const [newBlackoutReason, setNewBlackoutReason] = useState("")

  // 3. Calendar View States
  const [calendarDeptFilter, setCalendarDeptFilter] = useState("All")

  // Sync internal state when parent initialSubTab changes
  React.useEffect(() => {
    if (initialSubTab) {
      setCurrentTab(initialSubTab)
    }
  }, [initialSubTab])

  const handleTabSelect = (tab: LeaveTab) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((req) => {
      const matchesSearch =
        req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "All" || req.status === statusFilter
      const matchesType = typeFilter === "All" || req.leaveType === typeFilter
      const matchesDept = deptFilter === "All" || req.department === deptFilter
      return matchesSearch && matchesStatus && matchesType && matchesDept
    })
  }, [leaveRequests, searchQuery, statusFilter, typeFilter, deptFilter])

  // KPI Counters
  const pendingCount = leaveRequests.filter((r) => r.status === "Pending").length
  const approvedCount = leaveRequests.filter((r) => r.status === "Approved").length
  const rejectedCount = leaveRequests.filter((r) => r.status === "Rejected").length

  // Handlers for Request Actions
  const handleApprove = (id: string) => {
    const req = leaveRequests.find((r) => r.id === id)
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    )
    toast.success("Leave Request Approved", {
      description: `Approved ${req?.durationDays} days ${req?.leaveType} for ${req?.employeeName}.`,
    })
  }

  const handleReject = (id: string) => {
    const req = leaveRequests.find((r) => r.id === id)
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
    )
    toast.error("Leave Request Rejected", {
      description: `Rejected ${req?.leaveType} application for ${req?.employeeName}.`,
    })
  }

  // Bulk Actions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequestIds(filteredRequests.map((r) => r.id))
    } else {
      setSelectedRequestIds([])
    }
  }

  const handleToggleSelectOne = (id: string) => {
    if (selectedRequestIds.includes(id)) {
      setSelectedRequestIds(selectedRequestIds.filter((i) => i !== id))
    } else {
      setSelectedRequestIds([...selectedRequestIds, id])
    }
  }

  const handleBulkApprove = () => {
    const count = selectedRequestIds.length
    setLeaveRequests((prev) =>
      prev.map((r) => (selectedRequestIds.includes(r.id) ? { ...r, status: "Approved" } : r))
    )
    setSelectedRequestIds([])
    toast.success("Bulk Approvals Complete", {
      description: `Successfully approved ${count} leave applications.`,
    })
  }

  const handleBulkReject = () => {
    const count = selectedRequestIds.length
    setLeaveRequests((prev) =>
      prev.map((r) => (selectedRequestIds.includes(r.id) ? { ...r, status: "Rejected" } : r))
    )
    setSelectedRequestIds([])
    toast.error("Bulk Rejections Complete", {
      description: `Rejected ${count} leave applications.`,
    })
  }

  const handleSaveReviewerNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRequestForNote) return

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequestForNote.id
          ? { ...r, reviewerNote: reviewerNoteText.trim() }
          : r
      )
    )
    toast.success("Reviewer Note Attached", {
      description: `Note saved to request ${selectedRequestForNote.id}.`,
    })
    setSelectedRequestForNote(null)
    setReviewerNoteText("")
  }

  const handleAddBlackoutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlackoutTitle.trim() || !newBlackoutStart.trim()) return

    const newBO: BlackoutDate = {
      id: `BO-${Date.now()}`,
      title: newBlackoutTitle.trim(),
      startDate: newBlackoutStart,
      endDate: newBlackoutEnd || newBlackoutStart,
      department: newBlackoutDept,
      reason: newBlackoutReason.trim() || "Operational peak freeze.",
      level: "Strict Freeze",
    }
    setBlackouts([...blackouts, newBO])
    toast.success("Blackout Period Enforced", {
      description: `${newBO.title} scheduled from ${newBO.startDate} to ${newBO.endDate}.`,
    })
    setNewBlackoutTitle("")
    setNewBlackoutStart("")
    setNewBlackoutEnd("")
    setNewBlackoutReason("")
    setShowAddBlackoutModal(false)
  }

  const exportLeavesCSV = () => {
    const headers = ["ID", "Employee", "Role", "Department", "Leave Type", "Paid", "Start Date", "End Date", "Days", "Status", "Reason"]
    const rows = filteredRequests.map((r) => [
      r.id,
      `"${r.employeeName}"`,
      `"${r.role}"`,
      `"${r.department}"`,
      `"${r.leaveType}"`,
      r.isPaid ? "Paid" : "Unpaid",
      `"${r.startDate}"`,
      `"${r.endDate}"`,
      r.durationDays,
      r.status,
      `"${r.reason}"`,
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `EMS_Leave_Records_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Leave Records Exported", {
      description: `Downloaded CSV with ${filteredRequests.length} leave records.`,
    })
  }

  // Filtered Calendar Staff
  const filteredCalendarStaff = useMemo(() => {
    return augustCalendarStaffLeaves.filter((s) => {
      if (calendarDeptFilter === "All") return true
      return s.department === calendarDeptFilter
    })
  }, [calendarDeptFilter])

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leave Management & Policies</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure leave entitlement rules, process staff applications, and view bird&apos;s-eye team availability.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={exportLeavesCSV}
            className="gap-1.5 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Leaves CSV</span>
          </Button>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs Control */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 overflow-x-auto">
        <button
          onClick={() => handleTabSelect("inbox")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "inbox"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconCalendarOff className="size-4 text-primary" />
          <span>1. Leave Request Inbox</span>
          {pendingCount > 0 && (
            <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-[10px] h-4">
              {pendingCount}
            </Badge>
          )}
        </button>

        <button
          onClick={() => handleTabSelect("policies")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "policies"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconAdjustments className="size-4 text-amber-500" />
          <span>2. Policy Engine & Blackout Dates</span>
        </button>

        <button
          onClick={() => handleTabSelect("calendar")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "calendar"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconCalendarEvent className="size-4 text-emerald-500" />
          <span>3. Company Leave Calendar</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: LEAVE REQUEST INBOX */}
      {/* ========================================================================= */}
      {currentTab === "inbox" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="shadow-xs p-3.5 border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Pending Review</span>
                <Clock className="size-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{pendingCount}</div>
              <span className="text-[11px] text-muted-foreground">Action required</span>
            </Card>

            <Card className="shadow-xs p-3.5 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Approved This Month</span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{approvedCount + 18}</div>
              <span className="text-[11px] text-muted-foreground">Total 54 days approved</span>
            </Card>

            <Card className="shadow-xs p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Active Today On-Leave</span>
                <IconCalendarOff className="size-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">14 Staff</div>
              <span className="text-[11px] text-muted-foreground">8 Planned, 6 Emergency</span>
            </Card>

            <Card className="shadow-xs p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Rejected / Closed</span>
                <XCircle className="size-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-1 text-muted-foreground">{rejectedCount + 2}</div>
              <span className="text-[11px] text-muted-foreground">With reviewer feedback</span>
            </Card>
          </div>

          {/* Search & Filter Bar */}
          <Card className="shadow-xs">
            <CardContent className="p-4 space-y-3">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search applicant name, department, role, or reason..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="All">All Leave Types</option>
                    <option value="Annual Paid Leave">Annual Paid Leave</option>
                    <option value="Medical / Sick Leave">Medical / Sick Leave</option>
                    <option value="Parental Leave">Parental Leave</option>
                    <option value="Compensatory Off">Compensatory Off</option>
                  </select>

                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
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
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={
                      filteredRequests.length > 0 &&
                      filteredRequests.every((r) => selectedRequestIds.includes(r.id))
                    }
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                  />
                  <span>Select all visible applications ({filteredRequests.length})</span>
                </label>
                <span>Showing {filteredRequests.length} applications</span>
              </div>

              {/* Bulk Action Controls */}
              {selectedRequestIds.length > 0 && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/60 border border-border text-xs animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">{selectedRequestIds.length}</span>
                    <span className="text-muted-foreground">time-off requests selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleBulkApprove}
                      className="h-7 text-xs px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" /> Bulk Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleBulkReject}
                      className="h-7 text-xs px-2.5 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5 mr-1" /> Bulk Reject
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRequestIds([])}
                      className="h-7 text-xs px-2 cursor-pointer"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Request Applications List */}
          <div className="space-y-3">
            {filteredRequests.map((req) => {
              const isSelected = selectedRequestIds.includes(req.id)

              return (
                <Card
                  key={req.id}
                  className={`shadow-xs hover:border-primary/40 transition-all p-4 ${
                    isSelected ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Applicant Info & Details */}
                    <div className="flex items-start gap-3.5">
                      <div className="pt-1">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSelectOne(req.id)}
                        />
                      </div>

                      <Avatar className="h-10 w-10">
                        {req.avatar && <AvatarImage src={req.avatar} alt={req.employeeName} />}
                        <AvatarFallback className="text-xs font-semibold bg-muted">
                          {req.employeeName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{req.employeeName}</span>
                          <span className="text-xs text-muted-foreground">({req.role})</span>
                          <Badge variant="secondary" className="text-[10px]">
                            {req.department}
                          </Badge>
                          <Badge
                            variant={req.isPaid ? "default" : "outline"}
                            className="text-[10px]"
                          >
                            {req.leaveType} • {req.isPaid ? "Paid" : "Unpaid"}
                          </Badge>
                        </div>

                        {/* Date span & Balance */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            {req.startDate} - {req.endDate} ({req.durationDays} {req.durationDays > 1 ? "Days" : "Day"})
                          </span>
                          <span>•</span>
                          <span>
                            Leave Balance: <strong className="text-foreground">{req.remainingBalance}</strong> / {req.totalAllowed} days left
                          </span>
                          <span>•</span>
                          <span className="text-[11px]">Applied {req.appliedDate}</span>
                        </div>

                        {/* Justification quote */}
                        <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-md border text-foreground/90 italic">
                          &ldquo;{req.reason}&rdquo;
                        </p>

                        {/* Staffing Shortage Overlap Warning */}
                        {req.departmentConflictCount > 0 && req.status === "Pending" && (
                          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                            <span>Staffing Overlap Alert: {req.departmentConflictCount} other member(s) in {req.department} have approved leave on these dates.</span>
                          </div>
                        )}

                        {/* Reviewer Note if present */}
                        {req.reviewerNote && (
                          <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                            <MessageSquare className="h-3 w-3 shrink-0" />
                            <span>Admin Note: {req.reviewerNote}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRequestForNote(req)
                          setReviewerNoteText(req.reviewerNote || "")
                        }}
                        className="h-8 text-xs px-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Add Note"
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1" /> Note
                      </Button>

                      {req.status === "Pending" ? (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(req.id)}
                            className="h-8 text-xs px-2.5 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5 mr-1" /> Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(req.id)}
                            className="h-8 text-xs px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                        </>
                      ) : (
                        <Badge
                          variant={req.status === "Approved" ? "default" : "destructive"}
                          className="text-xs py-1 px-2.5"
                        >
                          {req.status === "Approved" ? "✓ Approved" : "✗ Rejected"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: POLICY ENGINE & BLACKOUT DATES */}
      {/* ========================================================================= */}
      {currentTab === "policies" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Policy Engine Rules */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Configured Leave Policies & Accruals</h2>
              <p className="text-xs text-muted-foreground">
                Set statutory accrual rates, maximum annual carry-over limits, paid/unpaid classifications, and notice rules.
              </p>
            </div>
            <Button size="sm" className="gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" /> Create Custom Policy
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((pol) => (
              <Card key={pol.id} className={`shadow-xs border-2 ${pol.color}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={pol.type === "Paid" ? "default" : "outline"} className="text-xs font-semibold">
                      {pol.type} Leave
                    </Badge>
                    <span className="text-xs font-bold text-foreground">{pol.annualQuota}</span>
                  </div>
                  <CardTitle className="text-base mt-1.5">{pol.title}</CardTitle>
                  <CardDescription className="text-xs">{pol.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-background/80 border">
                    <span className="text-muted-foreground">Accrual Velocity:</span>
                    <strong className="text-foreground">{pol.accrualRate}</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-background/80 border">
                    <span className="text-muted-foreground">Max Carry-over to Next Year:</span>
                    <strong className="text-foreground">{pol.maxCarryOver}</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-background/80 border">
                    <span className="text-muted-foreground">Notice Period Required:</span>
                    <strong className="text-foreground">{pol.noticePeriod}</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-background/80 border">
                    <span className="text-muted-foreground">Max Consecutive Days Limit:</span>
                    <strong className="text-foreground">{pol.maxConsecutive}</strong>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Blackout Dates & Peak Staffing Freeze */}
          <Card className="shadow-xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="size-5 text-amber-500" />
                  <span>Blackout Dates & Operational Peak Freeze</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Periods where leave submissions are restricted to ensure maximum workforce availability during business-critical operations.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddBlackoutModal(true)}
                className="gap-1.5 cursor-pointer text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Add Blackout Period
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b select-none">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Freeze Title</th>
                      <th className="px-4 py-3 font-semibold">Date Range</th>
                      <th className="px-4 py-3 font-semibold">Impacted Department</th>
                      <th className="px-4 py-3 font-semibold">Restriction Level</th>
                      <th className="px-4 py-3 font-semibold">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {blackouts.map((bo) => (
                      <tr key={bo.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-foreground">{bo.title}</td>
                        <td className="px-4 py-3.5 font-mono text-xs text-foreground">
                          {bo.startDate} - {bo.endDate}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant="secondary" className="text-xs">
                            {bo.department}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge
                            variant={bo.level === "Strict Freeze" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {bo.level}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground">{bo.reason}</td>
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
      {/* SECTION 3: COMPANY LEAVE CALENDAR */}
      {/* ========================================================================= */}
      {currentTab === "calendar" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Bird's Eye Staffing Heatmap Overview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>Team Availability & Staffing Heatmap</span>
                <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                  August 2026
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">
                Bird&apos;s-eye timeline of planned employee leaves to identify and prevent departmental coverage shortages.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={calendarDeptFilter}
                onChange={(e) => setCalendarDeptFilter(e.target.value)}
                className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="People & Culture">People & Culture</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          {/* Department Coverage Health Warning Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-start gap-3 text-xs">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground">Staffing Shortage Advisory (Aug 27 - Aug 31)</h4>
              <p className="text-muted-foreground mt-0.5">
                <strong>Product</strong> and <strong>Infrastructure</strong> have 2 key architects on planned annual vacation concurrently. Cross-functional escalation contacts have been designated.
              </p>
            </div>
          </div>

          {/* Visual Timeline Grid */}
          <Card className="shadow-xs overflow-hidden">
            <CardHeader className="pb-3 border-b">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-foreground">Active Leave Records Timeline</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Annual Vacation
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Sick / Medical
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Parental
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {filteredCalendarStaff.map((staff) => (
                <div key={staff.id} className="p-3 rounded-lg border bg-card hover:bg-muted/20 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px] font-bold bg-muted">
                          {staff.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-semibold text-xs text-foreground">{staff.name}</span>
                        <span className="text-[11px] text-muted-foreground ml-1.5">({staff.department})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium">
                      <Badge
                        variant={staff.leaveType === "Annual" ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {staff.leaveType} Leave
                      </Badge>
                      <span className="font-mono text-xs">{staff.dateRange}</span>
                    </div>
                  </div>

                  {/* Visual Month Bar (31 Days) */}
                  <div className="relative h-4 w-full bg-muted/60 rounded-full overflow-hidden flex">
                    <div
                      style={{
                        marginLeft: `${((staff.startDay - 1) / 31) * 100}%`,
                        width: `${Math.max(4, ((staff.endDay - staff.startDay + 1) / 31) * 100)}%`,
                      }}
                      className={`h-full rounded-full ${
                        staff.leaveType === "Annual"
                          ? "bg-emerald-500"
                          : staff.leaveType === "Sick"
                            ? "bg-orange-500"
                            : "bg-blue-500"
                      } shadow-xs`}
                    />
                  </div>

                  <div className="flex justify-between text-[9px] text-muted-foreground/60 px-1 pt-1 font-mono">
                    <span>Aug 01</span>
                    <span>Aug 10</span>
                    <span>Aug 20</span>
                    <span>Aug 31</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL: Add Reviewer Note */}
      {selectedRequestForNote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-md shadow-2xl border-border animate-in zoom-in-95">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="size-4 text-primary" />
                  <span>Reviewer Note for {selectedRequestForNote.employeeName}</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedRequestForNote(null)}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-xs">
                Attach an administrative remark or handover requirement to this application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="reviewer-note-form" onSubmit={handleSaveReviewerNote} className="space-y-3">
                <textarea
                  rows={4}
                  placeholder="e.g. Approved provided standby engineer covers weekend escalation..."
                  value={reviewerNoteText}
                  onChange={(e) => setReviewerNoteText(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  required
                />
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRequestForNote(null)}
                className="cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button
                form="reviewer-note-form"
                type="submit"
                size="sm"
                className="gap-1.5 cursor-pointer text-xs"
              >
                <Check className="h-3.5 w-3.5" /> Save Note
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* MODAL: Add Blackout Period */}
      {showAddBlackoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-md shadow-2xl border-border animate-in zoom-in-95">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-500" />
                  <span>Configure Blackout Period</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddBlackoutModal(false)}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-xs">
                Restrict leave approvals during critical operational periods.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="add-blackout-form" onSubmit={handleAddBlackoutSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Event / Campaign Title *
                  </label>
                  <Input
                    placeholder="e.g. End of Year System Upgrade"
                    value={newBlackoutTitle}
                    onChange={(e) => setNewBlackoutTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Start Date *
                    </label>
                    <Input
                      type="date"
                      value={newBlackoutStart}
                      onChange={(e) => setNewBlackoutStart(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={newBlackoutEnd}
                      onChange={(e) => setNewBlackoutEnd(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Impacted Department
                  </label>
                  <select
                    value={newBlackoutDept}
                    onChange={(e) => setNewBlackoutDept(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="All Departments">All Departments</option>
                    <option value="Engineering & Infrastructure">Engineering & Infrastructure</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="People & Culture">People & Culture</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Operational Reason
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe business criticality..."
                    value={newBlackoutReason}
                    onChange={(e) => setNewBlackoutReason(e.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddBlackoutModal(false)}
                className="cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button form="add-blackout-form" type="submit" size="sm" className="gap-1.5 cursor-pointer text-xs">
                <Plus className="h-3.5 w-3.5" /> Save Blackout Window
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
