import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useEMSStore } from "@/store/use-ems-store"
import { StatCard } from "@/components/shared/stat-card"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  CalendarOff,
  ClockCheck,
  AlertCircle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Megaphone,
  CheckCircle2,
  Calendar,
  Send,
  X,
  Check,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
} from "lucide-react"
import { toast } from "sonner"

export function DashboardOverviewPage() {
  const navigate = useNavigate()
  const {
    currentUser,
    employees,
    departments,
    leaveRequests,
    attendanceRecords,
    updateLeaveStatus,
    announcements,
    addAnnouncement,
  } = useEMSStore()

  const [announcementText, setAnnouncementText] = useState("")

  // Computed metrics
  const totalEmployees = employees.length
  const presentEmployees = attendanceRecords.filter((a) => a.status === "On-Time" || a.status === "Remote").length
  const attendanceRate = totalEmployees > 0 ? Math.round((presentEmployees / totalEmployees) * 100) : 96
  const onLeaveEmployees = employees.filter((e) => e.status === "On Leave").length
  const pendingLeaves = leaveRequests.filter((l) => l.status === "Pending")

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!announcementText.trim()) return

    addAnnouncement({
      title: "Company Bulletin",
      content: announcementText,
      author: currentUser.name,
      priority: "normal",
    })
    setAnnouncementText("")
    toast.success("Announcement broadcasted successfully to all staff")
  }

  const handleApproveLeave = (id: string, name: string) => {
    updateLeaveStatus(id, "Approved")
    toast.success(`Leave request for ${name} has been approved`)
  }

  const handleRejectLeave = (id: string, name: string) => {
    updateLeaveStatus(id, "Rejected")
    toast.error(`Leave request for ${name} has been rejected`)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-primary/10 via-background to-secondary/30 p-6 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="size-3.5" />
              EMS Enterprise Control Center
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {currentUser.name.split(" ")[0]}!
            </h1>
            <p className="text-sm text-muted-foreground">
              Here is your workforce operational summary and urgent action queue for today.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => navigate("/employees?action=add")}
              className="gap-1.5 font-medium shadow-xs"
            >
              <Plus className="size-4" />
              Add Employee
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/attendance")}
              className="gap-1.5 font-medium"
            >
              <ClockCheck className="size-4" />
              Live Attendance
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Workforce"
          value={totalEmployees}
          description="Across 5 active departments"
          trend={{ value: "+4.2%", isPositive: true, label: "vs last month" }}
          icon={<Users className="size-5" />}
          iconBgColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          onClick={() => navigate("/employees")}
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          description={`${presentEmployees} checked in today`}
          trend={{ value: "+1.8%", isPositive: true, label: "on-time rate" }}
          icon={<ClockCheck className="size-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          onClick={() => navigate("/attendance")}
        />
        <StatCard
          title="On Leave / Away"
          value={onLeaveEmployees}
          description="Approved annual & sick leaves"
          trend={{ value: "-2", isPositive: true, label: "from yesterday" }}
          icon={<CalendarOff className="size-5" />}
          iconBgColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          onClick={() => navigate("/leaves")}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeaves.length}
          description="Requires manager sign-off"
          badge={
            pendingLeaves.length > 0 ? (
              <Badge variant="destructive" className="text-[10px]">
                Action Required
              </Badge>
            ) : undefined
          }
          icon={<AlertCircle className="size-5" />}
          iconBgColor="bg-rose-500/10 text-rose-600 dark:text-rose-400"
          onClick={() => navigate("/leaves")}
        />
      </div>

      {/* Main Split Content: Approvals & Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Urgent Approvals & Department Overview */}
        <div className="space-y-6 lg:col-span-2">
          {/* Urgent Approvals Queue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <AlertCircle className="size-4 text-amber-500" />
                  Urgent Leave Requests Queue
                </CardTitle>
                <CardDescription className="text-xs">
                  Review and action pending time-off requests
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/leaves")}
                className="gap-1 text-xs text-primary"
              >
                View all ({leaveRequests.length})
                <ArrowUpRight className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent>
              {pendingLeaves.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 py-8 text-center">
                  <CheckCircle2 className="size-8 text-emerald-500" />
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    All caught up!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No pending leave requests requiring approval.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {pendingLeaves.slice(0, 4).map((leave) => (
                    <div
                      key={leave.id}
                      className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback>
                            {leave.employeeName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {leave.employeeName}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {leave.department}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {leave.leaveType}
                            </span>{" "}
                            • {leave.startDate} to {leave.endDate} ({leave.days}{" "}
                            days)
                          </p>
                          <p className="text-xs italic text-muted-foreground/80 line-clamp-1">
                            "{leave.reason}"
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:self-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleApproveLeave(leave.id, leave.employeeName)
                          }
                          className="h-8 gap-1 border-emerald-500/30 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                        >
                          <Check className="size-3.5" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleRejectLeave(leave.id, leave.employeeName)
                          }
                          className="h-8 gap-1 border-rose-500/30 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
                        >
                          <X className="size-3.5" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visual Analytics: 7-Day Attendance Trend & Weekly Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="size-4 text-emerald-500" />
                  Weekly Attendance Velocity & Trends
                </CardTitle>
                <CardDescription className="text-xs">
                  7-Day rolling workforce check-in and punctuality metrics
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
                  96.8% Avg Adherence
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/attendance")}
                  className="gap-1 text-xs text-primary"
                >
                  Live Logs
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Interactive SVG / CSS Trend Bar Chart */}
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2 pt-4 pb-2 items-end h-36 border-b border-border/60">
                  {[
                    { day: "Mon", rate: 94, onTime: 232, late: 12, label: "94%" },
                    { day: "Tue", rate: 97, onTime: 241, late: 5, label: "97%" },
                    { day: "Wed", rate: 98, onTime: 244, late: 3, label: "98%" },
                    { day: "Thu", rate: 96, onTime: 238, late: 8, label: "96%" },
                    { day: "Fri", rate: 95, onTime: 235, late: 10, label: "95%" },
                    { day: "Sat", rate: 89, onTime: 110, late: 2, label: "89%" },
                    { day: "Today", rate: attendanceRate, onTime: presentEmployees, late: 4, label: `${attendanceRate}%`, isCurrent: true },
                  ].map((bar) => (
                    <div key={bar.day} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                        {bar.label}
                      </span>
                      <div className="w-full max-w-[36px] bg-muted/60 rounded-t-md relative flex items-end justify-center overflow-hidden h-24">
                        <div
                          style={{ height: `${bar.rate}%` }}
                          className={`w-full rounded-t-md transition-all duration-500 ${
                            bar.isCurrent
                              ? "bg-emerald-600 dark:bg-emerald-500 shadow-xs"
                              : "bg-primary/70 group-hover:bg-primary"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-medium ${
                          bar.isCurrent ? "font-bold text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Summary Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-center">
                  <div className="rounded-lg bg-muted/30 p-2 border border-border/50">
                    <span className="text-[10px] text-muted-foreground block">On-Time Checkins</span>
                    <strong className="text-sm font-semibold text-foreground">94.5%</strong>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-2 border border-border/50">
                    <span className="text-[10px] text-muted-foreground block">Avg Shift Length</span>
                    <strong className="text-sm font-semibold text-foreground">8.2 hrs</strong>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-2 border border-border/50">
                    <span className="text-[10px] text-muted-foreground block">Remote Workers</span>
                    <strong className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">38 Staff</strong>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-2 border border-border/50">
                    <span className="text-[10px] text-muted-foreground block">Tardiness Grace</span>
                    <strong className="text-sm font-semibold text-amber-600 dark:text-amber-400">12 mins avg</strong>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Department Breakdown & Progress Distribution */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building2 className="size-4 text-blue-500" />
                  Department Headcount & Band Allocations
                </CardTitle>
                <CardDescription className="text-xs">
                  Workforce distribution and operational capacity
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/departments")}
                className="gap-1 text-xs text-primary"
              >
                Manage Departments
                <ArrowUpRight className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {departments.map((dept) => {
                  const percentage = Math.min(100, Math.round((dept.employeeCount / (totalEmployees || 1)) * 100))
                  return (
                    <div
                      key={dept.id}
                      className="flex flex-col gap-2 rounded-xl border border-border/80 p-3.5 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`size-2.5 rounded-full ${dept.color}`} />
                          <span className="text-sm font-semibold text-foreground">
                            {dept.name}
                          </span>
                        </div>
                        <Badge variant="secondary" className="font-bold text-[10px]">
                          {dept.employeeCount} Staff ({percentage}%)
                        </Badge>
                      </div>
                      
                      {/* Visual Capacity Bar */}
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/80"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                        <span>Lead: {dept.head}</span>
                        <span className="font-mono font-medium text-foreground">{dept.budget}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Quick Announcements & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">
                Quick Operations
              </CardTitle>
              <CardDescription className="text-xs">
                Frequently used workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2.5">
              <Button
                variant="outline"
                onClick={() => navigate("/employees?action=add")}
                className="h-auto flex-col items-start gap-1 p-3 text-left"
              >
                <Plus className="size-4 text-blue-500" />
                <span className="text-xs font-semibold">New Hire</span>
                <span className="text-[10px] text-muted-foreground">
                  Onboard employee
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/payroll?tab=wizard")}
                className="h-auto flex-col items-start gap-1 p-3 text-left"
              >
                <FileSpreadsheet className="size-4 text-emerald-500" />
                <span className="text-xs font-semibold">Run Payroll</span>
                <span className="text-[10px] text-muted-foreground">
                  Calculate cycle
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/leaves?tab=calendar")}
                className="h-auto flex-col items-start gap-1 p-3 text-left"
              >
                <Calendar className="size-4 text-purple-500" />
                <span className="text-xs font-semibold">Leave Matrix</span>
                <span className="text-[10px] text-muted-foreground">
                  Team calendar
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/reports?tab=custom")}
                className="h-auto flex-col items-start gap-1 p-3 text-left"
              >
                <TrendingUp className="size-4 text-amber-500" />
                <span className="text-xs font-semibold">Export Data</span>
                <span className="text-[10px] text-muted-foreground">
                  CSV / PDF builder
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Announcements Broadcaster */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Megaphone className="size-4 text-primary" />
                Company Bulletins
              </CardTitle>
              <CardDescription className="text-xs">
                Broadcast messages to the organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handlePostAnnouncement} className="space-y-2">
                <div className="relative">
                  <Input
                    placeholder="Broadcast an update..."
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="pr-10 text-xs"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!announcementText.trim()}
                    className="absolute right-1 top-1 size-7"
                  >
                    <Send className="size-3.5" />
                  </Button>
                </div>
              </form>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="rounded-xl border border-border/70 bg-muted/20 p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-foreground">{ann.title}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {ann.time}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {ann.content}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                      <span>Posted by {ann.author}</span>
                      {ann.priority === "high" && (
                        <Badge
                          variant="outline"
                          className="text-[9px] border-rose-500/30 text-rose-600 dark:text-rose-400"
                        >
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
