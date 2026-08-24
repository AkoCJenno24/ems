import { useState } from "react"
import { useEMSStore } from "@/store/use-ems-store"
import { Button } from "@/components/ui/button"
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
  Target,
  Award,
  Star,
  X,
} from "lucide-react"
import { toast } from "sonner"

export function EmployeePerformancePage() {
  const { personalGoals, updatePersonalGoalProgress, currentUser } = useEMSStore()
  const [showSelfReviewModal, setShowSelfReviewModal] = useState(false)
  const [selfScore, setSelfScore] = useState("4.5")
  const [selfComments, setSelfComments] = useState("")

  const handleProgressChange = (id: string, newProgress: number) => {
    updatePersonalGoalProgress(id, newProgress)
    toast.success("OKR Progress Updated", {
      description: `Milestone updated to ${newProgress}% completion.`,
    })
  }

  const handleSelfReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selfComments.trim()) {
      toast.error("Please add your self-evaluation comments.")
      return
    }

    toast.success("Self-Appraisal Submitted", {
      description: "Your Q3 2026 evaluation has been forwarded to your manager for calibration.",
    })
    setShowSelfReviewModal(false)
  }

  const avgCompletion =
    personalGoals.length > 0
      ? Math.round(
          personalGoals.reduce((a, b) => a + b.currentProgress, 0) /
            personalGoals.length
        )
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Goals & Performance OKRs
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your quarterly objectives, update milestone progress, and participate in review cycles
          </p>
        </div>
        <Button
          onClick={() => setShowSelfReviewModal(true)}
          className="gap-1.5 font-semibold text-xs shadow-xs cursor-pointer"
        >
          <Award className="size-4" />
          Submit Self-Appraisal
        </Button>
      </div>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/80">
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Average OKR Completion
            </span>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-bold text-foreground">
                {avgCompletion}%
              </span>
              <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 text-[10px]">
                On Target
              </Badge>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${avgCompletion}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Objectives
            </span>
            <div className="text-2xl font-bold text-foreground pt-1">
              {personalGoals.length} Key Results
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Assigned for Q3 2026 Evaluation Cycle
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Manager Calibration
            </span>
            <div className="flex items-center gap-1 text-amber-500 pt-1 font-bold text-lg">
              <Star className="size-4 fill-current" />
              <span>4.2 / 5.0</span>
              <span className="text-xs text-muted-foreground font-normal ml-1">
                (Last Cycle: Exceeds Expectations)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Manager: {currentUser.manager || "David Vance"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Cards with Interactive Sliders */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Target className="size-4 text-primary" />
            Quarterly OKRs & Progress Controls
          </CardTitle>
          <CardDescription className="text-xs">
            Drag the progress slider to update milestone completion in real time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {personalGoals.map((goal) => (
            <div
              key={goal.id}
              className="space-y-3 rounded-xl border border-border/70 p-4 bg-muted/20"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {goal.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        goal.status === "Completed"
                          ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-[10px]"
                          : goal.status === "On Track"
                          ? "border-blue-500/30 text-blue-600 bg-blue-500/10 text-[10px]"
                          : "border-amber-500/30 text-amber-600 bg-amber-500/10 text-[10px]"
                      }
                    >
                      {goal.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Due: {goal.dueDate}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {goal.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {goal.targetMetric}
                  </p>
                </div>

                <div className="font-mono text-xl font-bold text-primary self-start sm:self-center">
                  {goal.currentProgress}%
                </div>
              </div>

              {/* Progress Slider Control */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Update Progress Slider:</span>
                  <span className="font-medium text-foreground">{goal.currentProgress}% Complete</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={goal.currentProgress}
                  onChange={(e) =>
                    handleProgressChange(goal.id, parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Self-Appraisal Modal */}
      {showSelfReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <Card className="w-full max-w-lg shadow-xl border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">
                  Q3 2026 Performance Self-Evaluation
                </CardTitle>
                <CardDescription className="text-xs">
                  Review your achievements, strengths, and goals for the upcoming cycle
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSelfReviewModal(false)}
                className="size-7 cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <form onSubmit={handleSelfReviewSubmit}>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="self-score" className="text-xs">Self-Rating Score (1.0 - 5.0)</Label>
                  <select
                    id="self-score"
                    value={selfScore}
                    onChange={(e) => setSelfScore(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none"
                  >
                    <option value="5.0">5.0 - Role Model / Exceptional Impact</option>
                    <option value="4.5">4.5 - Exceeds Expectations</option>
                    <option value="4.0">4.0 - Consistently Meets Expectations</option>
                    <option value="3.0">3.0 - Meets Minimum Standards</option>
                    <option value="2.0">2.0 - Needs Development</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="self-achievements" className="text-xs">
                    Key Deliverables & Major Impact
                  </Label>
                  <textarea
                    id="self-achievements"
                    rows={4}
                    value={selfComments}
                    onChange={(e) => setSelfComments(e.target.value)}
                    placeholder="Highlight core microservices migrated, uptime improvements, mentor contributions, and cross-functional collaborations..."
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-none"
                  />
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-2 border-t p-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSelfReviewModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="font-semibold cursor-pointer">
                  Submit Self-Appraisal
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
