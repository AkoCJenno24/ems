import { useNavigate } from "react-router-dom"
import { useEMSStore } from "@/store/use-ems-store"
import { ClockInWidget } from "@/components/shared/clock-in-widget"
import { LeaveBalanceCard } from "@/components/shared/leave-balance-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CalendarOff,
  Receipt,
  Target,
  LifeBuoy,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ArrowRight,
  ClockCheck,
  Megaphone,
} from "lucide-react"

export function EmployeeHomePage() {
  const navigate = useNavigate()
  const {
    currentUser,
    leaveBalances,
    leaveRequests,
    personalGoals,
    announcements,
  } = useEMSStore()

  // Filter personal leaves
  const myLeaves = leaveRequests.filter(
    (l) => l.employeeName === currentUser.name || l.employeeId === currentUser.id
  )
  const pendingLeaves = myLeaves.filter((l) => l.status === "Pending")

  const upcomingHolidays = [
    { name: "Labor Day", date: "Sep 07, 2026", daysAway: "15 days away", type: "Public Holiday" },
    { name: "Indigenous Peoples' Day", date: "Oct 12, 2026", daysAway: "50 days away", type: "Federal Holiday" },
    { name: "Veterans Day", date: "Nov 11, 2026", daysAway: "80 days away", type: "Company Holiday" },
  ]

  const upcomingTasks = [
    {
      id: "T-1",
      title: "Submit Q3 Self-Appraisal Review",
      due: "Due in 3 days",
      urgent: true,
      url: "/portal/performance",
    },
    {
      id: "T-2",
      title: "Upload updated W-4 exemptions form",
      due: "Due this month",
      urgent: false,
      url: "/portal/profile",
    },
    {
      id: "T-3",
      title: "Review team sprint goals on Kafka migration",
      due: "Ongoing",
      urgent: false,
      url: "/portal/performance",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Employee Greeting Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Hello, {currentUser.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            {currentUser.jobTitle || currentUser.title} • {currentUser.department} Department
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => navigate("/portal/leaves?action=request")}
            className="gap-1.5 font-medium shadow-xs cursor-pointer"
          >
            <CalendarOff className="size-4" />
            Request Time Off
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/portal/payslips")}
            className="gap-1.5 font-medium cursor-pointer"
          >
            <FileText className="size-4" />
            View Payslip
          </Button>
        </div>
      </div>

      {/* Clock In / Out Live Widget */}
      <ClockInWidget />

      {/* Leave Balances Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            My Time-Off Balances
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/portal/leaves")}
            className="gap-1 text-xs text-primary cursor-pointer"
          >
            Leave History & Request
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <LeaveBalanceCard
            title="Annual Paid Leave"
            totalDays={leaveBalances.annualLeave.total}
            usedDays={leaveBalances.annualLeave.used}
            color="bg-blue-500"
            icon={<Calendar className="size-4 text-blue-500" />}
            onClick={() => navigate("/portal/leaves")}
          />
          <LeaveBalanceCard
            title="Sick & Medical Leave"
            totalDays={leaveBalances.sickLeave.total}
            usedDays={leaveBalances.sickLeave.used}
            color="bg-emerald-500"
            icon={<AlertCircle className="size-4 text-emerald-500" />}
            onClick={() => navigate("/portal/leaves")}
          />
          <LeaveBalanceCard
            title="Casual & Emergency"
            totalDays={leaveBalances.casualLeave.total}
            usedDays={leaveBalances.casualLeave.used}
            color="bg-amber-500"
            icon={<Sparkles className="size-4 text-amber-500" />}
            onClick={() => navigate("/portal/leaves")}
          />
        </div>
      </div>

      {/* Split Grid: Action Items & Performance + Holidays */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: My Goals & Upcoming Action Items */}
        <div className="space-y-6 lg:col-span-2">
          {/* Action Required Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Action Items & Notifications
              </CardTitle>
              <CardDescription className="text-xs">
                Pending tasks and approvals needing your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/60">
                {pendingLeaves.length > 0 && (
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-start gap-3">
                      <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                        <CalendarOff className="size-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          Leave Request Awaiting Manager Approval
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {pendingLeaves[0].leaveType} ({pendingLeaves[0].days} days) - Applied on {pendingLeaves[0].appliedOn}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-500/30 bg-amber-500/10 text-xs">
                      Under Review
                    </Badge>
                  </div>
                )}

                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">
                          {task.title}
                        </h4>
                        {task.urgent && (
                          <Badge variant="destructive" className="text-[10px]">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{task.due}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(task.url)}
                      className="text-xs font-semibold self-start sm:self-center cursor-pointer"
                    >
                      View & Action
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* OKR & Goals Snapshot */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Target className="size-4 text-blue-500" />
                  My Quarterly OKRs & Key Results
                </CardTitle>
                <CardDescription className="text-xs">
                  Active performance milestones for Q3
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/portal/performance")}
                className="gap-1 text-xs text-primary cursor-pointer"
              >
                Manage Goals
                <ArrowRight className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {personalGoals.map((goal) => (
                <div key={goal.id} className="space-y-2 rounded-xl border border-border/70 p-3.5 bg-muted/20">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {goal.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Due: {goal.dueDate}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {goal.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {goal.targetMetric}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {goal.currentProgress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${goal.currentProgress}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Quick Shortcuts & Company Holidays */}
        <div className="space-y-6">
          {/* Quick ESS Shortcuts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">
                Self-Service Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2.5">
              <Button
                variant="outline"
                onClick={() => navigate("/portal/attendance")}
                className="h-auto flex-col items-start gap-1 p-3 text-left cursor-pointer"
              >
                <ClockCheck className="size-4 text-blue-500" />
                <span className="text-xs font-semibold">Timesheet</span>
                <span className="text-[10px] text-muted-foreground">
                  Monthly punches
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/portal/payslips?tab=claims")}
                className="h-auto flex-col items-start gap-1 p-3 text-left cursor-pointer"
              >
                <Receipt className="size-4 text-emerald-500" />
                <span className="text-xs font-semibold">File Claim</span>
                <span className="text-[10px] text-muted-foreground">
                  Expense reimbursement
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/portal/profile")}
                className="h-auto flex-col items-start gap-1 p-3 text-left cursor-pointer"
              >
                <FileText className="size-4 text-purple-500" />
                <span className="text-xs font-semibold">Doc Vault</span>
                <span className="text-[10px] text-muted-foreground">
                  Contracts & tax forms
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/portal/helpdesk")}
                className="h-auto flex-col items-start gap-1 p-3 text-left cursor-pointer"
              >
                <LifeBuoy className="size-4 text-amber-500" />
                <span className="text-xs font-semibold">HR Helpdesk</span>
                <span className="text-[10px] text-muted-foreground">
                  Ask HR or IT
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Company Bulletins & Announcements */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Megaphone className="size-4 text-primary" />
                  Company Bulletins
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  Broadcast Feed
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Official leadership notices and team updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {announcements.length === 0 ? (
                <div className="py-4 text-center text-xs text-muted-foreground">
                  No active bulletins at this time.
                </div>
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
            </CardContent>
          </Card>

          {/* Upcoming Holidays Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Calendar className="size-4 text-purple-500" />
                Upcoming Public Holidays
              </CardTitle>
              <CardDescription className="text-xs">
                Official company calendar days off
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingHolidays.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-border/70 p-3 bg-muted/20 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-foreground">{h.name}</div>
                    <div className="text-muted-foreground">{h.date}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-600 dark:text-purple-400">
                    {h.daysAway}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
