import { useState } from "react"
import { useEMSStore } from "@/store/use-ems-store"
import { ClockInWidget } from "@/components/shared/clock-in-widget"
import { StatCard } from "@/components/shared/stat-card"
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
  Clock,
  Calendar,
  CheckCircle2,
  FileQuestion,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react"
import { toast } from "sonner"

export function EmployeeAttendancePage() {
  const { currentUser } = useEMSStore()
  const [showRegularizeModal, setShowRegularizeModal] = useState(false)
  const [regularizeForm, setRegularizeForm] = useState({
    date: "Aug 22, 2026",
    type: "Forgot Check-In",
    actualTime: "09:00 AM",
    reason: "",
  })

  // Sample personal attendance history for current month
  const personalPunches = [
    {
      id: "P-1",
      date: "Today (Aug 23)",
      checkIn: "08:55 AM",
      checkOut: "—",
      hours: "5h 22m",
      overtime: "+0.0h",
      status: "On-Time",
      location: "San Francisco HQ - Gate A",
      verified: true,
    },
    {
      id: "P-2",
      date: "Fri, Aug 22",
      checkIn: "08:48 AM",
      checkOut: "06:15 PM",
      hours: "8h 27m",
      overtime: "+0.5h",
      status: "On-Time",
      location: "San Francisco HQ - Gate A",
      verified: true,
    },
    {
      id: "P-3",
      date: "Thu, Aug 21",
      checkIn: "09:20 AM",
      checkOut: "06:05 PM",
      hours: "7h 45m",
      overtime: "+0.0h",
      status: "Late",
      location: "San Francisco HQ - Gate A",
      verified: true,
    },
    {
      id: "P-4",
      date: "Wed, Aug 20",
      checkIn: "08:52 AM",
      checkOut: "06:00 PM",
      hours: "8h 08m",
      overtime: "+0.0h",
      status: "On-Time",
      location: "Remote VPN",
      verified: true,
    },
    {
      id: "P-5",
      date: "Tue, Aug 19",
      checkIn: "08:30 AM",
      checkOut: "07:00 PM",
      hours: "9h 30m",
      overtime: "+1.5h",
      status: "On-Time",
      location: "San Francisco HQ - Gate B",
      verified: true,
    },
  ]

  const handleRegularizeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!regularizeForm.reason.trim()) {
      toast.error("Please provide a reason for the regularization request.")
      return
    }

    toast.success("Regularization Request Submitted", {
      description: `Correction for ${regularizeForm.date} forwarded to ${currentUser.manager || "manager"} for sign-off.`,
    })
    setShowRegularizeModal(false)
    setRegularizeForm({ ...regularizeForm, reason: "" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            My Attendance & Timesheets
          </h1>
          <p className="text-sm text-muted-foreground">
            View daily punches, work hours telemetry, and request time adjustments
          </p>
        </div>
        <Button
          onClick={() => setShowRegularizeModal(true)}
          variant="outline"
          className="gap-1.5 font-medium cursor-pointer"
        >
          <FileQuestion className="size-4" />
          Request Regularization
        </Button>
      </div>

      {/* Clock In Live Widget */}
      <ClockInWidget />

      {/* Monthly Attendance KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Hours Logged"
          value="142.5 hrs"
          description="August 2026 Pay Period"
          trend={{ value: "+4.2 hrs", isPositive: true, label: "vs standard" }}
          icon={<Clock className="size-5" />}
          iconBgColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="On-Time Rate"
          value="96.5%"
          description="1 late arrival this month"
          trend={{ value: "19 / 20", isPositive: true, label: "days on time" }}
          icon={<CheckCircle2 className="size-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Overtime Accumulated"
          value="6.5 hrs"
          description="Eligible for 1.5x payout"
          trend={{ value: "+2.0 hrs", isPositive: true, label: "this week" }}
          icon={<TrendingUp className="size-5" />}
          iconBgColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Approved Remote Days"
          value="4 days"
          description="Hybrid work policy compliant"
          icon={<ShieldCheck className="size-5" />}
          iconBgColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Daily Punch Timesheet Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              Recent Daily Timesheet Logs
            </CardTitle>
            <CardDescription className="text-xs">
              Detailed check-in/out timestamps and location verification
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/80 text-xs font-semibold text-muted-foreground uppercase bg-muted/30">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Check-In</th>
                  <th className="px-4 py-3">Check-Out</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Overtime</th>
                  <th className="px-4 py-3">Location / Device</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {personalPunches.map((punch) => (
                  <tr key={punch.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {punch.date}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {punch.checkIn}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {punch.checkOut}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {punch.hours}
                    </td>
                    <td className="px-4 py-3 text-purple-600 dark:text-purple-400 font-semibold">
                      {punch.overtime}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                        {punch.location}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={
                          punch.status === "On-Time"
                            ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold text-[11px]"
                            : "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 font-semibold text-[11px]"
                        }
                      >
                        {punch.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Regularization Modal */}
      {showRegularizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <Card className="w-full max-w-md shadow-xl border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">
                  Request Punch Regularization
                </CardTitle>
                <CardDescription className="text-xs">
                  Submit a correction for forgotten punches or system anomalies
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRegularizeModal(false)}
                className="size-7 cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <form onSubmit={handleRegularizeSubmit}>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-date" className="text-xs">Date of Incident</Label>
                  <Input
                    id="reg-date"
                    value={regularizeForm.date}
                    onChange={(e) =>
                      setRegularizeForm({ ...regularizeForm, date: e.target.value })
                    }
                    placeholder="e.g. Aug 22, 2026"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-type" className="text-xs">Adjustment Type</Label>
                    <Input
                      id="reg-type"
                      value={regularizeForm.type}
                      onChange={(e) =>
                        setRegularizeForm({ ...regularizeForm, type: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-time" className="text-xs">Actual Punch Time</Label>
                    <Input
                      id="reg-time"
                      value={regularizeForm.actualTime}
                      onChange={(e) =>
                        setRegularizeForm({
                          ...regularizeForm,
                          actualTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-reason" className="text-xs">Reason / Justification</Label>
                  <textarea
                    id="reg-reason"
                    rows={3}
                    value={regularizeForm.reason}
                    onChange={(e) =>
                      setRegularizeForm({ ...regularizeForm, reason: e.target.value })
                    }
                    placeholder="e.g. Card reader at Gate B failed to register badge; arrived at 09:00 AM."
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-2 border-t p-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRegularizeModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="font-semibold cursor-pointer">
                  Submit for Approval
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
