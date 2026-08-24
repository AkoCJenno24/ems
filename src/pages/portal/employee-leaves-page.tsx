import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useEMSStore } from "@/store/use-ems-store"
import { LeaveBalanceCard } from "@/components/shared/leave-balance-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CalendarOff,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  AlertCircle,
  Users,
  X,
} from "lucide-react"
import { toast } from "sonner"

export function EmployeeLeavesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { currentUser, leaveBalances, leaveRequests, submitLeaveRequest } = useEMSStore()

  const [showApplyModal, setShowApplyModal] = useState(
    searchParams.get("action") === "request"
  )

  const [applyForm, setApplyForm] = useState({
    leaveType: "Annual Leave" as const,
    startDate: "2026-08-28",
    endDate: "2026-08-29",
    days: 2,
    reason: "",
  })

  // Filter personal leaves
  const myLeaves = leaveRequests.filter(
    (l) => l.employeeName === currentUser.name || l.employeeId === currentUser.id
  )

  // Colleague leaves in same department
  const teamLeaves = leaveRequests.filter(
    (l) => l.department === currentUser.department && l.employeeName !== currentUser.name
  )

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!applyForm.reason.trim()) {
      toast.error("Please provide a reason for your leave request.")
      return
    }

    submitLeaveRequest({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: currentUser.department,
      leaveType: applyForm.leaveType,
      startDate: applyForm.startDate,
      endDate: applyForm.endDate,
      days: applyForm.days,
      reason: applyForm.reason,
    })

    toast.success("Leave Request Submitted", {
      description: `Your ${applyForm.days}-day ${applyForm.leaveType} request was routed to ${currentUser.manager || "manager"}.`,
    })

    setShowApplyModal(false)
    searchParams.delete("action")
    setSearchParams(searchParams, { replace: true })
    setApplyForm({
      leaveType: "Annual Leave",
      startDate: "2026-08-28",
      endDate: "2026-08-29",
      days: 2,
      reason: "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            My Time Off & Leaves
          </h1>
          <p className="text-sm text-muted-foreground">
            Apply for vacation or sick days, view quota balances, and track approvals
          </p>
        </div>
        <Button
          onClick={() => setShowApplyModal(true)}
          className="gap-1.5 font-medium shadow-xs cursor-pointer"
        >
          <Plus className="size-4" />
          Apply for Leave
        </Button>
      </div>

      {/* Leave Balance Quotas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <LeaveBalanceCard
          title="Annual Paid Vacation"
          totalDays={leaveBalances.annualLeave.total}
          usedDays={leaveBalances.annualLeave.used}
          color="bg-blue-500"
          icon={<Calendar className="size-4 text-blue-500" />}
        />
        <LeaveBalanceCard
          title="Sick & Medical Leave"
          totalDays={leaveBalances.sickLeave.total}
          usedDays={leaveBalances.sickLeave.used}
          color="bg-emerald-500"
          icon={<AlertCircle className="size-4 text-emerald-500" />}
        />
        <LeaveBalanceCard
          title="Casual & Emergency Days"
          totalDays={leaveBalances.casualLeave.total}
          usedDays={leaveBalances.casualLeave.used}
          color="bg-amber-500"
          icon={<Sparkles className="size-4 text-amber-500" />}
        />
      </div>

      {/* Main Split: My Request History & Department Calendar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: My Application History */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                My Leave History & Status
              </CardTitle>
              <CardDescription className="text-xs">
                Review your submitted time-off requests and approval timelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myLeaves.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 py-10 text-center">
                  <CalendarOff className="size-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    No leave requests found
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You haven't submitted any time off requests yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {myLeaves.map((leave) => (
                    <div
                      key={leave.id}
                      className="flex flex-col gap-2.5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">
                            {leave.leaveType}
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              leave.status === "Approved"
                                ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold text-[11px]"
                                : leave.status === "Pending"
                                ? "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 font-semibold text-[11px]"
                                : "border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 font-semibold text-[11px]"
                            }
                          >
                            {leave.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {leave.startDate} → {leave.endDate} (
                          <strong className="text-foreground">{leave.days} Day(s)</strong>)
                        </div>
                        <p className="text-xs text-muted-foreground/90 italic">
                          "{leave.reason}"
                        </p>
                      </div>

                      <div className="text-left sm:text-right text-xs text-muted-foreground">
                        <div>Applied: {leave.appliedOn}</div>
                        {leave.reviewer && (
                          <div className="font-medium text-foreground">
                            Reviewed by: {leave.reviewer}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Team Coverage Matrix */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="size-4 text-blue-500" />
                Team Coverage & Out-of-Office
              </CardTitle>
              <CardDescription className="text-xs">
                Colleagues in {currentUser.department} on leave
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamLeaves.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground rounded-lg border border-dashed border-border/80">
                  Full team is currently in office.
                </div>
              ) : (
                teamLeaves.map((tl) => (
                  <div
                    key={tl.id}
                    className="flex items-center justify-between rounded-xl border border-border/70 p-3 bg-muted/20 text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-foreground">
                        {tl.employeeName}
                      </span>
                      <div className="text-[11px] text-muted-foreground">
                        {tl.leaveType} • {tl.startDate} to {tl.endDate}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {tl.days}d Away
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <Card className="w-full max-w-md shadow-xl border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">
                  Apply for Leave
                </CardTitle>
                <CardDescription className="text-xs">
                  Submit a time-off request for manager sign-off
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowApplyModal(false)}
                className="size-7 cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <form onSubmit={handleApplySubmit}>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="leave-type" className="text-xs">Leave Category</Label>
                  <select
                    id="leave-type"
                    value={applyForm.leaveType}
                    onChange={(e) =>
                      setApplyForm({
                        ...applyForm,
                        leaveType: e.target.value as any,
                      })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Annual Leave">Annual Paid Vacation (14 days available)</option>
                    <option value="Sick Leave">Sick & Medical Leave (8 days available)</option>
                    <option value="Casual Leave">Casual / Personal Emergency (3 days available)</option>
                    <option value="Unpaid">Unpaid Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={applyForm.startDate}
                      onChange={(e) =>
                        setApplyForm({ ...applyForm, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="end-date" className="text-xs">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={applyForm.endDate}
                      onChange={(e) =>
                        setApplyForm({ ...applyForm, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="days-calc" className="text-xs">Duration (Days)</Label>
                  <Input
                    id="days-calc"
                    type="number"
                    min={1}
                    max={30}
                    value={applyForm.days}
                    onChange={(e) =>
                      setApplyForm({
                        ...applyForm,
                        days: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="leave-reason" className="text-xs">Reason / Handover Notes</Label>
                  <textarea
                    id="leave-reason"
                    rows={3}
                    value={applyForm.reason}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, reason: e.target.value })
                    }
                    placeholder="e.g. Taking scheduled vacation. Alex Morgan will cover active Jira issues."
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-2 border-t p-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="font-semibold cursor-pointer">
                  Submit Request
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
