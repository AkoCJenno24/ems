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
  Target,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  Download,
  Star,
  X,
  ArrowUpRight,
} from "lucide-react"
import {
  IconTargetArrow,
  IconCalendarEvent,
} from "@tabler/icons-react"

export type PerformanceTab = "cycles" | "goals"

export interface ReviewCycleItem {
  id: string
  title: string
  type: "Quarterly Evaluation" | "Annual Comprehensive" | "360° Peer Review" | "Probation Clearance"
  startDate: string
  endDate: string
  status: "Active / In Progress" | "Scheduled" | "Completed & Archived"
  participantsCount: number
  completionRate: number
  selfReviewDeadline: string
  managerReviewDeadline: string
  hrCalibrationDeadline: string
  description: string
}

export interface EmployeeGoalItem {
  id: string
  employeeName: string
  role: string
  department: string
  avatar?: string
  objectiveTitle: string
  category: "Technical Excellence" | "Product Delivery" | "Leadership & Mentorship" | "Operational Velocity" | "Revenue & Growth"
  level: "Individual KPI" | "Department OKR" | "Company Priority"
  targetMetric: string
  currentProgress: number // 0-100%
  weightPercent: number
  dueDate: string
  selfScore: number // 1.0 - 5.0
  selfComment: string
  managerScore: number // 1.0 - 5.0
  managerComment: string
  alignmentStatus: "Strongly Aligned" | "Manager Rated Higher" | "Self Rated Higher"
}

// Dummy Performance Cycles
const initialCycles: ReviewCycleItem[] = [
  {
    id: "CYC-2026-Q3",
    title: "Q3 2026 Mid-Year Performance & 360° Feedback",
    type: "Quarterly Evaluation",
    startDate: "Aug 15, 2026",
    endDate: "Sep 30, 2026",
    status: "Active / In Progress",
    participantsCount: 248,
    completionRate: 75,
    selfReviewDeadline: "Aug 31, 2026 (Completed)",
    managerReviewDeadline: "Sep 15, 2026 (In Progress)",
    hrCalibrationDeadline: "Sep 30, 2026",
    description: "Mid-year organizational evaluation covering OKR delivery, core leadership competencies, and peer recognition.",
  },
  {
    id: "CYC-2026-Q4",
    title: "FY2026 Annual Executive Review & Compensation Calibration",
    type: "Annual Comprehensive",
    startDate: "Nov 15, 2026",
    endDate: "Dec 22, 2026",
    status: "Scheduled",
    participantsCount: 260,
    completionRate: 0,
    selfReviewDeadline: "Nov 30, 2026",
    managerReviewDeadline: "Dec 10, 2026",
    hrCalibrationDeadline: "Dec 22, 2026",
    description: "Comprehensive end-of-year review cycle used to calculate annual bonuses, level promotions, and equity adjustments.",
  },
  {
    id: "CYC-2026-Q2",
    title: "Q2 2026 Operational Velocity & Sprint Review",
    type: "Quarterly Evaluation",
    startDate: "May 15, 2026",
    endDate: "Jun 30, 2026",
    status: "Completed & Archived",
    participantsCount: 240,
    completionRate: 100,
    selfReviewDeadline: "May 31, 2026",
    managerReviewDeadline: "Jun 15, 2026",
    hrCalibrationDeadline: "Jun 30, 2026",
    description: "Closed Q2 evaluation cycle. All reviews archived and merit raises disbursed.",
  },
]

// Dummy Goal & KPI Scoring Data
const initialGoals: EmployeeGoalItem[] = [
  {
    id: "KPI-401",
    employeeName: "David Kim",
    role: "VP of Engineering",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&dpr=2&q=80",
    objectiveTitle: "Architect Multi-Region Cloud Failover with 99.99% Uptime",
    category: "Technical Excellence",
    level: "Company Priority",
    targetMetric: "Zero downtime during simulated VPC region blackout",
    currentProgress: 94,
    weightPercent: 35,
    dueDate: "Sep 20, 2026",
    selfScore: 4.8,
    selfComment: "Achieved automated disaster recovery testing across US-East and EU-Central with sub-second DNS switchover.",
    managerScore: 4.8,
    managerComment: "Outstanding technical execution and rock-solid system reliability architecture.",
    alignmentStatus: "Strongly Aligned",
  },
  {
    id: "KPI-402",
    employeeName: "Sarah Chen",
    role: "Lead Product Designer",
    department: "Product & Design",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&dpr=2&q=80",
    objectiveTitle: "Ship Design System v2.0 & Achieve 95% Frontend Adoption",
    category: "Product Delivery",
    level: "Department OKR",
    targetMetric: "100% tokenized UI components adopted across 4 major web apps",
    currentProgress: 90,
    weightPercent: 30,
    dueDate: "Sep 15, 2026",
    selfScore: 4.6,
    selfComment: "Built comprehensive design tokens, documentation hub, and automated Figma-to-code sync.",
    managerScore: 4.7,
    managerComment: "Great leadership bridging design and engineering workflows ahead of schedule.",
    alignmentStatus: "Manager Rated Higher",
  },
  {
    id: "KPI-403",
    employeeName: "Marcus Vance",
    role: "DevOps Architect",
    department: "Infrastructure",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&dpr=2&q=80",
    objectiveTitle: "Optimize CI/CD Pipelines & Reduce Build Time by 40%",
    category: "Operational Velocity",
    level: "Department OKR",
    targetMetric: "Average pull-request build & test runtime under 6 minutes",
    currentProgress: 82,
    weightPercent: 25,
    dueDate: "Sep 25, 2026",
    selfScore: 4.4,
    selfComment: "Implemented distributed build caching and parallelized test runner containers.",
    managerScore: 4.3,
    managerComment: "Noticeable velocity improvements for the entire engineering cohort.",
    alignmentStatus: "Strongly Aligned",
  },
  {
    id: "KPI-404",
    employeeName: "Elena Rostova",
    role: "HR Operations Lead",
    department: "People & Culture",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&dpr=2&q=80",
    objectiveTitle: "Onboard 25 Strategic Hires within 30-Day SLA Window",
    category: "Leadership & Mentorship",
    level: "Individual KPI",
    targetMetric: "100% onboarding compliance and positive 90-day retention score",
    currentProgress: 96,
    weightPercent: 30,
    dueDate: "Sep 30, 2026",
    selfScore: 4.9,
    selfComment: "Exceeded recruitment target with 28 confirmed onboardings and 98% candidate satisfaction.",
    managerScore: 4.8,
    managerComment: "Exceptional talent acquisition velocity and rigorous culture alignment.",
    alignmentStatus: "Strongly Aligned",
  },
  {
    id: "KPI-405",
    employeeName: "Alex Morgan",
    role: "Senior Full-Stack Engineer",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
    objectiveTitle: "Refactor Legacy Billing Microservice to Event-Driven Architecture",
    category: "Technical Excellence",
    level: "Individual KPI",
    targetMetric: "Zero billing invoice dropouts and 3x throughput capacity",
    currentProgress: 75,
    weightPercent: 25,
    dueDate: "Sep 30, 2026",
    selfScore: 4.2,
    selfComment: "Successfully completed Kafka messaging integration; final load testing in progress.",
    managerScore: 4.0,
    managerComment: "Good technical progress, ensure edge-case idempotency testing is complete before GA.",
    alignmentStatus: "Self Rated Higher",
  },
]

interface PerformancePageProps {
  initialSubTab?: PerformanceTab
  onTabChange?: (tab: PerformanceTab) => void
}

export function PerformancePage({ initialSubTab = "cycles", onTabChange }: PerformancePageProps) {
  const [currentTab, setCurrentTab] = useState<PerformanceTab>(initialSubTab)

  // 1. Review Cycles States
  const [cycles, setCycles] = useState<ReviewCycleItem[]>(initialCycles)
  const [showAddCycleModal, setShowAddCycleModal] = useState(false)
  const [newCycleTitle, setNewCycleTitle] = useState("")
  const [newCycleType, setNewCycleType] = useState<ReviewCycleItem["type"]>("Quarterly Evaluation")
  const [newCycleStart, setNewCycleStart] = useState("")
  const [newCycleEnd, setNewCycleEnd] = useState("")
  const [newCycleSelfDeadline, setNewCycleSelfDeadline] = useState("")
  const [newCycleMgrDeadline, setNewCycleMgrDeadline] = useState("")
  const [newCycleDesc, setNewCycleDesc] = useState("")

  // 2. Goal and KPI States
  const [goals, setGoals] = useState<EmployeeGoalItem[]>(initialGoals)
  const [goalSearch, setGoalSearch] = useState("")
  const [goalDeptFilter, setGoalDeptFilter] = useState("All")
  const [goalCategoryFilter, setGoalCategoryFilter] = useState("All")
  const [showAddGoalModal, setShowAddGoalModal] = useState(false)

  // Add Goal Form States
  const [newGoalEmployee, setNewGoalEmployee] = useState("")
  const [newGoalDept, setNewGoalDept] = useState("Engineering")
  const [newGoalRole, setNewGoalRole] = useState("")
  const [newGoalObjective, setNewGoalObjective] = useState("")
  const [newGoalCategory, setNewGoalCategory] = useState<EmployeeGoalItem["category"]>("Technical Excellence")
  const [newGoalLevel, setNewGoalLevel] = useState<EmployeeGoalItem["level"]>("Department OKR")
  const [newGoalTarget, setNewGoalTarget] = useState("")
  const [newGoalWeight, setNewGoalWeight] = useState(25)
  const [newGoalDueDate, setNewGoalDueDate] = useState("")

  // Modal Scoring Evaluation
  const [evaluatingGoal, setEvaluatingGoal] = useState<EmployeeGoalItem | null>(null)
  const [evaluationScore, setEvaluationScore] = useState<number>(4.5)
  const [evaluationFeedback, setEvaluationFeedback] = useState("")

  // Sync internal state when parent initialSubTab changes
  React.useEffect(() => {
    if (initialSubTab) {
      setCurrentTab(initialSubTab)
    }
  }, [initialSubTab])

  const handleTabSelect = (tab: PerformanceTab) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  // Filtered Goals
  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      const q = goalSearch.toLowerCase()
      const matchesSearch =
        g.employeeName.toLowerCase().includes(q) ||
        g.role.toLowerCase().includes(q) ||
        g.objectiveTitle.toLowerCase().includes(q) ||
        g.department.toLowerCase().includes(q)
      const matchesDept = goalDeptFilter === "All" || g.department === goalDeptFilter
      const matchesCategory = goalCategoryFilter === "All" || g.category === goalCategoryFilter
      return matchesSearch && matchesDept && matchesCategory
    })
  }, [goals, goalSearch, goalDeptFilter, goalCategoryFilter])

  // KPIs
  const activeCycle = cycles.find((c) => c.status === "Active / In Progress") || cycles[0]
  const avgOrgScore = (
    goals.reduce((acc, curr) => acc + (curr.selfScore + curr.managerScore) / 2, 0) / goals.length
  ).toFixed(2)
  const totalCompletedGoals = goals.filter((g) => g.currentProgress >= 90).length

  // Save New Cycle Submit
  const handleSaveCycleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCycleTitle.trim() || !newCycleStart.trim()) return

    const newCycle: ReviewCycleItem = {
      id: `CYC-${Date.now()}`,
      title: newCycleTitle.trim(),
      type: newCycleType,
      startDate: newCycleStart,
      endDate: newCycleEnd || newCycleStart,
      status: "Scheduled",
      participantsCount: 248,
      completionRate: 0,
      selfReviewDeadline: newCycleSelfDeadline || "TBD",
      managerReviewDeadline: newCycleMgrDeadline || "TBD",
      hrCalibrationDeadline: newCycleEnd || "TBD",
      description: newCycleDesc.trim() || "Scheduled evaluation timeline.",
    }

    setCycles([newCycle, ...cycles])
    toast.success("Review Cycle Scheduled", {
      description: `${newCycle.title} scheduled for ${newCycle.startDate}.`,
    })
    setNewCycleTitle("")
    setNewCycleStart("")
    setNewCycleEnd("")
    setNewCycleDesc("")
    setShowAddCycleModal(false)
  }

  // Save New Goal Submit
  const handleSaveGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoalEmployee.trim() || !newGoalObjective.trim()) return

    const newGoal: EmployeeGoalItem = {
      id: `KPI-${Date.now()}`,
      employeeName: newGoalEmployee.trim(),
      role: newGoalRole.trim() || "Team Contributor",
      department: newGoalDept,
      objectiveTitle: newGoalObjective.trim(),
      category: newGoalCategory,
      level: newGoalLevel,
      targetMetric: newGoalTarget.trim() || "100% Milestone Completion",
      currentProgress: 25,
      weightPercent: Number(newGoalWeight),
      dueDate: newGoalDueDate || "Dec 31, 2026",
      selfScore: 4.0,
      selfComment: "Target timeline defined. Initial sprint execution underway.",
      managerScore: 4.0,
      managerComment: "Objective aligned with quarterly business roadmap.",
      alignmentStatus: "Strongly Aligned",
    }

    setGoals([newGoal, ...goals])
    toast.success("Goal / OKR Assigned", {
      description: `Objective assigned to ${newGoal.employeeName} (${newGoal.department}).`,
    })
    setNewGoalEmployee("")
    setNewGoalRole("")
    setNewGoalObjective("")
    setNewGoalTarget("")
    setShowAddGoalModal(false)
  }

  // Save Manager Score & Feedback Submit
  const handleSaveEvaluationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!evaluatingGoal) return

    setGoals((prev) =>
      prev.map((g) =>
        g.id === evaluatingGoal.id
          ? {
              ...g,
              managerScore: Number(evaluationScore),
              managerComment: evaluationFeedback.trim() || g.managerComment,
              alignmentStatus:
                Math.abs(g.selfScore - Number(evaluationScore)) < 0.2
                  ? "Strongly Aligned"
                  : Number(evaluationScore) > g.selfScore
                    ? "Manager Rated Higher"
                    : "Self Rated Higher",
            }
          : g
      )
    )

    toast.success("Evaluation Calibrated", {
      description: `Saved manager score (${evaluationScore.toFixed(1)} / 5.0) for ${evaluatingGoal.employeeName}.`,
    })
    setEvaluatingGoal(null)
    setEvaluationFeedback("")
  }

  const exportGoalsCSV = () => {
    const headers = ["KPI ID", "Employee", "Department", "Objective Statement", "Category", "Level", "Progress (%)", "Self Score", "Manager Score", "Due Date"]
    const rows = filteredGoals.map((g) => [
      g.id,
      `"${g.employeeName}"`,
      `"${g.department}"`,
      `"${g.objectiveTitle}"`,
      `"${g.category}"`,
      `"${g.level}"`,
      `${g.currentProgress}%`,
      g.selfScore,
      g.managerScore,
      `"${g.dueDate}"`,
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `EMS_Performance_Goals_Matrix_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Performance Matrix Exported", {
      description: `Downloaded OKR metrics for ${filteredGoals.length} team goals.`,
    })
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance & Talent OKRs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Schedule evaluation cycles, track department/individual goals, and calibrate manager reviews against self-assessments.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {currentTab === "cycles" ? (
            <Button
              onClick={() => setShowAddCycleModal(true)}
              size="sm"
              className="gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" /> Schedule Review Cycle
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={exportGoalsCSV}
                className="gap-1.5 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export Goals CSV</span>
              </Button>
              <Button
                onClick={() => setShowAddGoalModal(true)}
                size="sm"
                className="gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4" /> Set Goal / KPI
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 overflow-x-auto">
        <button
          onClick={() => handleTabSelect("cycles")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "cycles"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconCalendarEvent className="size-4 text-primary" />
          <span>1. Review Cycle Manager ({cycles.length})</span>
        </button>

        <button
          onClick={() => handleTabSelect("goals")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "goals"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconTargetArrow className="size-4 text-emerald-500" />
          <span>2. Goal & KPI Tracking ({goals.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: REVIEW CYCLE MANAGER */}
      {/* ========================================================================= */}
      {currentTab === "cycles" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-xs p-4 border-primary/30 bg-primary/5">
              <div className="flex items-center justify-between text-xs font-medium text-primary">
                <span>Active Cycle</span>
                <Clock className="size-4 text-primary" />
              </div>
              <div className="text-xl font-bold mt-1 text-foreground">Q3 2026 Review</div>
              <span className="text-[11px] text-muted-foreground">Manager Phase in progress</span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Submission Progress</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                {activeCycle.completionRate}%
              </div>
              <span className="text-[11px] text-muted-foreground">
                186 / 248 reviews submitted
              </span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Org-wide Rating Average</span>
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Star className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-foreground flex items-center gap-1">
                <span>{avgOrgScore}</span>
                <span className="text-xs font-normal text-muted-foreground">/ 5.0</span>
              </div>
              <span className="text-[11px] text-muted-foreground">Exceeds 4.0 target standard</span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Key Results Completed</span>
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Award className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                {totalCompletedGoals} / {goals.length} Goals
              </div>
              <span className="text-[11px] text-muted-foreground">Over 90% target delivery</span>
            </Card>
          </div>

          {/* Active & Scheduled Cycles List */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Organizational Performance Schedules</h3>

            <div className="space-y-3.5">
              {cycles.map((cycle) => (
                <Card
                  key={cycle.id}
                  className={`shadow-xs hover:border-primary/40 transition-all p-4.5 ${
                    cycle.status === "Active / In Progress" ? "border-primary/50 shadow-sm" : ""
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Cycle Details & Milestones */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            cycle.status === "Active / In Progress"
                              ? "default"
                              : cycle.status === "Scheduled"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs font-semibold"
                        >
                          {cycle.status}
                        </Badge>
                        <span className="text-base font-bold text-foreground">{cycle.title}</span>
                        <Badge variant="outline" className="text-[11px]">
                          {cycle.type}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground">{cycle.description}</p>

                      {/* Milestone Progress Bar */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                        <div className="p-2 rounded-lg bg-muted/40 border">
                          <span className="text-[10px] text-muted-foreground block font-medium">Phase 1: Self-Assessment</span>
                          <span className="font-semibold text-foreground">{cycle.selfReviewDeadline}</span>
                        </div>

                        <div className="p-2 rounded-lg bg-muted/40 border">
                          <span className="text-[10px] text-muted-foreground block font-medium">Phase 2: Manager Review</span>
                          <span className="font-semibold text-foreground">{cycle.managerReviewDeadline}</span>
                        </div>

                        <div className="p-2 rounded-lg bg-muted/40 border">
                          <span className="text-[10px] text-muted-foreground block font-medium">Phase 3: HR Calibration</span>
                          <span className="font-semibold text-foreground">{cycle.hrCalibrationDeadline}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Completion Gauge & Actions */}
                    <div className="flex flex-col items-start lg:items-end justify-between gap-2.5 shrink-0 min-w-[180px] lg:border-l lg:pl-5">
                      <div className="w-full text-right lg:text-right">
                        <div className="text-xs text-muted-foreground">Submission Progress</div>
                        <div className="text-xl font-bold font-mono text-foreground">
                          {cycle.completionRate}%
                        </div>
                      </div>

                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          style={{ width: `${cycle.completionRate}%` }}
                          className="h-full bg-primary rounded-full transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 w-full justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTabSelect("goals")}
                          className="h-7 text-xs px-2.5 cursor-pointer gap-1 w-full sm:w-auto"
                        >
                          <span>Inspect OKRs</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: GOAL AND KPI TRACKING */}
      {/* ========================================================================= */}
      {currentTab === "goals" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Top Filter Bar */}
          <Card className="shadow-xs">
            <CardContent className="p-3.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search employee, role, or objective statement..."
                  value={goalSearch}
                  onChange={(e) => setGoalSearch(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={goalDeptFilter}
                  onChange={(e) => setGoalDeptFilter(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="People & Culture">People & Culture</option>
                </select>

                <select
                  value={goalCategoryFilter}
                  onChange={(e) => setGoalCategoryFilter(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="All">All Categories</option>
                  <option value="Technical Excellence">Technical Excellence</option>
                  <option value="Product Delivery">Product Delivery</option>
                  <option value="Leadership & Mentorship">Leadership & Mentorship</option>
                  <option value="Operational Velocity">Operational Velocity</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Goal & Evaluation Cards Matrix */}
          <div className="space-y-3.5">
            {filteredGoals.map((goal) => {
              const finalCalibratedScore = ((goal.selfScore * 0.4) + (goal.managerScore * 0.6)).toFixed(2)

              return (
                <Card key={goal.id} className="shadow-xs hover:border-primary/40 transition-all p-4.5">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Employee Profile & Objective */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Avatar className="h-7 w-7">
                          {goal.avatar && <AvatarImage src={goal.avatar} alt={goal.employeeName} />}
                          <AvatarFallback className="text-[10px] font-bold bg-muted">
                            {goal.employeeName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-sm text-foreground">{goal.employeeName}</span>
                        <span className="text-xs text-muted-foreground">({goal.role})</span>
                        <Badge variant="outline" className="text-[10px]">
                          {goal.department}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {goal.level} • Weight: {goal.weightPercent}%
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          <Target className="size-4 text-primary shrink-0" />
                          <span>{goal.objectiveTitle}</span>
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Target Metric: <strong className="text-foreground">{goal.targetMetric}</strong>
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1 pt-1 max-w-md">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">Key Result Delivery:</span>
                          <span className="font-semibold text-foreground">{goal.currentProgress}% Achieved</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            style={{ width: `${goal.currentProgress}%` }}
                            className={`h-full rounded-full ${
                              goal.currentProgress >= 90
                                ? "bg-emerald-500"
                                : goal.currentProgress >= 75
                                  ? "bg-primary"
                                  : "bg-amber-500"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Qualitative Feedback Quotes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-muted/40 border space-y-1">
                          <span className="text-[10px] font-semibold text-muted-foreground block">
                            Employee Self-Assessment Reflection:
                          </span>
                          <p className="text-[11px] text-foreground/90 italic">
                            &ldquo;{goal.selfComment}&rdquo;
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-muted/40 border space-y-1">
                          <span className="text-[10px] font-semibold text-muted-foreground block">
                            Manager Evaluation Notes:
                          </span>
                          <p className="text-[11px] text-foreground/90 italic">
                            &ldquo;{goal.managerComment}&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Scores Comparison & Calibration Action */}
                    <div className="flex flex-col items-start lg:items-end justify-between gap-3 shrink-0 min-w-[210px] lg:border-l lg:pl-5">
                      <div className="w-full space-y-2">
                        {/* Score Badges */}
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-muted-foreground">Self Rating:</span>
                          <span className="font-bold font-mono text-foreground flex items-center gap-1">
                            <Star className="size-3.5 text-amber-500 fill-amber-500" />
                            {goal.selfScore.toFixed(1)} / 5.0
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-muted-foreground">Manager Rating:</span>
                          <span className="font-bold font-mono text-foreground flex items-center gap-1">
                            <Star className="size-3.5 text-primary fill-primary" />
                            {goal.managerScore.toFixed(1)} / 5.0
                          </span>
                        </div>

                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between text-xs font-semibold">
                          <span className="text-primary">Calibrated Score:</span>
                          <span className="font-mono text-sm text-primary">{finalCalibratedScore}</span>
                        </div>
                      </div>

                      <div className="w-full flex items-center justify-between">
                        <Badge
                          variant={
                            goal.alignmentStatus === "Strongly Aligned"
                              ? "default"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {goal.alignmentStatus}
                        </Badge>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEvaluatingGoal(goal)
                            setEvaluationScore(goal.managerScore)
                            setEvaluationFeedback(goal.managerComment)
                          }}
                          className="h-7 text-xs px-2.5 cursor-pointer"
                        >
                          Calibrate Score
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SCHEDULE NEW REVIEW CYCLE */}
      {/* ========================================================================= */}
      {showAddCycleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-lg shadow-2xl border-border animate-in zoom-in-95">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="size-4 text-primary" />
                  <span>Schedule Performance Review Cycle</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddCycleModal(false)}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-xs">
                Configure evaluation timelines, phase milestones, and organizational scope.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form id="cycle-form" onSubmit={handleSaveCycleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Cycle Title *
                  </label>
                  <Input
                    placeholder="e.g. Q4 2026 Annual Evaluation & Promotion Cycle"
                    value={newCycleTitle}
                    onChange={(e) => setNewCycleTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Cycle Type
                    </label>
                    <select
                      value={newCycleType}
                      onChange={(e) => setNewCycleType(e.target.value as ReviewCycleItem["type"])}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Quarterly Evaluation">Quarterly Evaluation</option>
                      <option value="Annual Comprehensive">Annual Comprehensive</option>
                      <option value="360° Peer Review">360° Peer Review</option>
                      <option value="Probation Clearance">Probation Clearance</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Start Date *
                    </label>
                    <Input
                      type="date"
                      value={newCycleStart}
                      onChange={(e) => setNewCycleStart(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border space-y-2">
                  <span className="text-xs font-semibold text-foreground block">Milestone Deadlines</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-0.5">Self-Review Deadline</label>
                      <Input
                        type="date"
                        value={newCycleSelfDeadline}
                        onChange={(e) => setNewCycleSelfDeadline(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-0.5">Manager Review Deadline</label>
                      <Input
                        type="date"
                        value={newCycleMgrDeadline}
                        onChange={(e) => setNewCycleMgrDeadline(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Evaluation Scope & Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe evaluation purpose and guidelines..."
                    value={newCycleDesc}
                    onChange={(e) => setNewCycleDesc(e.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddCycleModal(false)}
                className="cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button form="cycle-form" type="submit" size="sm" className="gap-1.5 cursor-pointer text-xs">
                <Plus className="h-3.5 w-3.5" /> Launch Schedule
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SET NEW GOAL / KPI */}
      {/* ========================================================================= */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-lg shadow-2xl border-border animate-in zoom-in-95">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="size-4 text-emerald-500" />
                  <span>Set New Goal / Key Result</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddGoalModal(false)}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-xs">
                Assign an individual key result or department objective with measurable deliverables.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form id="goal-form" onSubmit={handleSaveGoalSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Employee Name *
                    </label>
                    <Input
                      placeholder="e.g. Maya Chen"
                      value={newGoalEmployee}
                      onChange={(e) => setNewGoalEmployee(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Department
                    </label>
                    <select
                      value={newGoalDept}
                      onChange={(e) => setNewGoalDept(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="People & Culture">People & Culture</option>
                      <option value="Finance & Operations">Finance & Operations</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Objective Statement *
                  </label>
                  <Input
                    placeholder="e.g. Reduce Customer Onboarding Dropoff by 25%"
                    value={newGoalObjective}
                    onChange={(e) => setNewGoalObjective(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Target Measurable Metric *
                  </label>
                  <Input
                    placeholder="e.g. Conversion rate increases from 4.2% to 5.8%"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
                    <select
                      value={newGoalCategory}
                      onChange={(e) => setNewGoalCategory(e.target.value as EmployeeGoalItem["category"])}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Technical Excellence">Technical</option>
                      <option value="Product Delivery">Product</option>
                      <option value="Leadership & Mentorship">Leadership</option>
                      <option value="Operational Velocity">Velocity</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Level Scope</label>
                    <select
                      value={newGoalLevel}
                      onChange={(e) => setNewGoalLevel(e.target.value as EmployeeGoalItem["level"])}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Individual KPI">Individual KPI</option>
                      <option value="Department OKR">Department OKR</option>
                      <option value="Company Priority">Company Priority</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Weight (%)</label>
                    <Input
                      type="number"
                      value={newGoalWeight}
                      onChange={(e) => setNewGoalWeight(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Due Date</label>
                    <Input
                      type="date"
                      value={newGoalDueDate}
                      onChange={(e) => setNewGoalDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddGoalModal(false)}
                className="cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button form="goal-form" type="submit" size="sm" className="gap-1.5 cursor-pointer text-xs">
                <Plus className="h-3.5 w-3.5" /> Save Objective
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CALIBRATE & EVALUATE SCORE */}
      {/* ========================================================================= */}
      {evaluatingGoal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-md shadow-2xl border-border animate-in zoom-in-95">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="size-4 text-primary" />
                  <span>Calibrate Score: {evaluatingGoal.employeeName}</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEvaluatingGoal(null)}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-xs line-clamp-2">
                {evaluatingGoal.objectiveTitle}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form id="eval-form" onSubmit={handleSaveEvaluationSubmit} className="space-y-3.5">
                <div className="p-3 rounded-lg bg-muted/40 border text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Self-Assessment Score:</span>
                    <strong className="text-foreground">{evaluatingGoal.selfScore.toFixed(1)} / 5.0</strong>
                  </div>
                  <p className="text-[11px] text-muted-foreground italic">
                    &ldquo;{evaluatingGoal.selfComment}&rdquo;
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label className="font-medium text-foreground">Manager Rating (1.0 to 5.0)</label>
                    <span className="font-bold font-mono text-primary">{evaluationScore.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={evaluationScore}
                    onChange={(e) => setEvaluationScore(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                    <span>1.0 Needs Impr.</span>
                    <span>3.0 Meets Standard</span>
                    <span>5.0 Outstanding</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Manager Qualitative Feedback
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide specific feedback and future growth goals..."
                    value={evaluationFeedback}
                    onChange={(e) => setEvaluationFeedback(e.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    required
                  />
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEvaluatingGoal(null)}
                className="cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button form="eval-form" type="submit" size="sm" className="gap-1.5 cursor-pointer text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" /> Save Calibration
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
