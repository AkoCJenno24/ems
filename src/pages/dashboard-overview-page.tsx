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
  const attendanceRate = totalEmployees > 0 ? Math.round((presentEmployees / totalEmployees) * 100) : 100
  const onLeaveEmployees = employees.filter((e) => e.status === "On Leave").length
  const pendingLeaves = leaveRequests.filter((l) => l.status === "Pending")

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!announcementText.trim()) return

    addAnnouncement({
      title: "Company Bulletin",
      content: announcementText,
      author: currentUser?.name || "Administrator",
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

  const displayName = currentUser?.name ? currentUser.name.split(" ")[0] : "Admin"

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
              Welcome back, {displayName}!
            </h1>
            <p className="text-sm text-muted-foreground">
              Here is your workforce operational summary and live Supabase telemetry for today.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => navigate("/employees?action=add")}
              className="gap-1.5 font-medium shadow-xs cursor-pointer"
            >
              <Plus className="size-4" />
              Add Employee
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/attendance")}
              className="gap-1.5 font-medium cursor-pointer"
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
          description={`Across ${departments.length} active departments`}
          trend={{ value: "+100%", isPositive: true, label: "Live Supabase" }}
          icon={<Users className="size-5" />}
          iconBgColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          onClick={() => navigate("/employees")}
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          description={`${presentEmployees} checked in today`}
          trend={{ value: "100%", isPositive: true, label: "on-time rate" }}
          icon={<ClockCheck className="size-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          onClick={() => navigate("/attendance")}
        />
        <StatCard
          title="On Leave / Away"
          value={onLeaveEmployees}
          description={`${pendingLeaves.length} pending approvals`}
          trend={{ value: `${pendingLeaves.length} action req`, isPositive: pendingLeaves.length === 0, label: "" }}
          icon={<CalendarOff className="size-5" />}
          iconBgColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          onClick={() => navigate("/leaves")}
        />
        <StatCard
          title="Action Queue"
          value={pendingLeaves.length}
          description="Requests needing review"
          trend={{
            value: pendingLeaves.length > 0 ? "Pending review" : "All clear",
            isPositive: pendingLeaves.length === 0,
            label: "",
          }}
          icon={<AlertCircle className="size-5" />}
          iconBgColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          onClick={() => navigate("/leaves")}
        />
      </div>

      {/* Main Grid: 2 Cols Left + 1 Col Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols */}
        <div className="space-y-6 lg:col-span-2">
          {/* Pending Approvals Table Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CalendarOff className="size-4 text-purple-500" />
                  Pending Leave Requests
                </CardTitle>
                <CardDescription className="text-xs">
                  Awaiting administrative review and approval
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
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400 mb-2">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    All clear! No pending approvals
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    All employee leave and expense requests have been processed.
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
                            {(leave.employeeName || "User").slice(0, 2).toUpperCase()}
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
                          className="h-8 gap-1 border-emerald-500/30 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400 cursor-pointer"
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
                          className="h-8 gap-1 border-rose-500/30 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400 cursor-pointer"
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

          {/* Department Breakdown & Progress Distribution */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building2 className="size-4 text-blue-500" />
                  Department Headcount & Allocations
                </CardTitle>
                <CardDescription className="text-xs">
                  Workforce distribution across live Supabase departments
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/departments")}
                className="gap-1 text-xs text-primary cursor-pointer"
              >
                Manage Departments
                <ArrowUpRight className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent>
              {departments.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No departments recorded yet. Create your first department in the Departments section.
                </div>
              ) : (
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
                            <span className="size-2.5 rounded-full bg-primary" />
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
                            style={{ width: `${Math.max(5, percentage)}%` }}
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
              )}
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
                className="h-auto flex-col items-start gap-1 p-3 text-left cursor-pointer"
              >
                <Plus className="size-4 text-blue-500" />
                <span className="text-xs font-semibold">New Hire</span>
                <span className="text-[10px] text-muted-foreground">
                  Onboard employee
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/payroll")}
                className="h-auto flex-col items-start gap-1 p-3 text-left cursor-pointer"
              >
                <FileSpreadsheet className="size-4 text-emerald-500" />
                <span className="text-xs font-semibold">Run Payroll</span>
                <span className="text-[10px] text-muted-foreground">
                  Process disbursements
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/leaves")}
                className="h-auto flex-col items-start gap-1 p-3 text-left cursor-pointer"
              >
                <Calendar className="size-4 text-purple-500" />
                <span className="text-xs font-semibold">Leave Matrix</span>
                <span className="text-[10px] text-muted-foreground">
                  Team calendar
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/reports")}
                className="h-auto flex-col items-start gap-1 p-3 text-left cursor-pointer"
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
                    className="absolute right-1 top-1 size-7 cursor-pointer"
                  >
                    <Send className="size-3.5" />
                  </Button>
                </div>
              </form>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {announcements.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No announcements posted yet.
                  </p>
                ) : (
                  announcements.map((ann) => (
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
