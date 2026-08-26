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
  Building2,
  Users,
  DollarSign,
  Plus,
  Search,
  Download,
  Edit2,
  Briefcase,
  Layers,
  X,
  Sparkles,
} from "lucide-react"
import {
  IconBuildingSkyscraper,
  IconIdBadge2,
  IconUsers,
} from "@tabler/icons-react"

export type DepartmentTab = "departments" | "designations"

export interface DepartmentItem {
  id: string
  code: string
  name: string
  lead: {
    name: string
    role: string
    email: string
    avatar?: string
  }
  headcount: number
  capacity: number
  annualBudget: number
  spentBudget: number
  costCenter: string
  location: string
  subTeams: string[]
  description: string
}

export interface DesignationItem {
  id: string
  code: string
  title: string
  department: string
  level: "L1 - Entry" | "L2 - Mid" | "L3 - Senior" | "L4 - Lead / Staff" | "L5 - Executive / Director"
  minSalary: number
  maxSalary: number
  medianBenchmark: number
  activeHeadcount: number
  experienceYears: string
  equityStatus: "Market Compliant" | "Adjusted 2026" | "Under Review"
}

// Designations & Pay Bands Data
const initialDesignations: DesignationItem[] = [
  {
    id: "DES-101",
    code: "ENG-L3",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    level: "L3 - Senior",
    minSalary: 135000,
    maxSalary: 175000,
    medianBenchmark: 152000,
    activeHeadcount: 18,
    experienceYears: "5 - 8 Years",
    equityStatus: "Market Compliant",
  },
  {
    id: "DES-102",
    code: "ENG-L4",
    title: "Staff Cloud Systems Architect",
    department: "Engineering",
    level: "L4 - Lead / Staff",
    minSalary: 170000,
    maxSalary: 220000,
    medianBenchmark: 195000,
    activeHeadcount: 6,
    experienceYears: "8+ Years",
    equityStatus: "Adjusted 2026",
  },
  {
    id: "DES-103",
    code: "PRD-L3",
    title: "Senior UX / Product Designer",
    department: "Product & Design",
    level: "L3 - Senior",
    minSalary: 120000,
    maxSalary: 155000,
    medianBenchmark: 138000,
    activeHeadcount: 8,
    experienceYears: "4 - 7 Years",
    equityStatus: "Market Compliant",
  },
  {
    id: "DES-104",
    code: "INF-L4",
    title: "Lead DevOps & SecOps Engineer",
    department: "Infrastructure & Security",
    level: "L4 - Lead / Staff",
    minSalary: 160000,
    maxSalary: 205000,
    medianBenchmark: 182000,
    activeHeadcount: 4,
    experienceYears: "7+ Years",
    equityStatus: "Market Compliant",
  },
  {
    id: "DES-105",
    code: "HR-L2",
    title: "People Operations Specialist",
    department: "People & Culture",
    level: "L2 - Mid",
    minSalary: 75000,
    maxSalary: 95000,
    medianBenchmark: 84000,
    activeHeadcount: 5,
    experienceYears: "2 - 5 Years",
    equityStatus: "Market Compliant",
  },
  {
    id: "DES-106",
    code: "FIN-L3",
    title: "Senior Financial & FP&A Analyst",
    department: "Finance & Operations",
    level: "L3 - Senior",
    minSalary: 110000,
    maxSalary: 140000,
    medianBenchmark: 125000,
    activeHeadcount: 6,
    experienceYears: "4 - 8 Years",
    equityStatus: "Under Review",
  },
  {
    id: "DES-107",
    code: "MKT-L4",
    title: "Director of Enterprise Sales",
    department: "Sales & Marketing",
    level: "L5 - Executive / Director",
    minSalary: 180000,
    maxSalary: 250000,
    medianBenchmark: 215000,
    activeHeadcount: 3,
    experienceYears: "10+ Years",
    equityStatus: "Adjusted 2026",
  },
  {
    id: "DES-108",
    code: "ENG-L1",
    title: "Associate Software Engineer",
    department: "Engineering",
    level: "L1 - Entry",
    minSalary: 85000,
    maxSalary: 110000,
    medianBenchmark: 95000,
    activeHeadcount: 14,
    experienceYears: "0 - 2 Years",
    equityStatus: "Market Compliant",
  },
]

interface DepartmentPageProps {
  initialSubTab?: DepartmentTab
  onTabChange?: (tab: DepartmentTab) => void
}

import { useEMSStore } from "@/store/use-ems-store"

export function DepartmentPage({ initialSubTab = "departments", onTabChange }: DepartmentPageProps) {
  const [currentTab, setCurrentTab] = useState<DepartmentTab>(initialSubTab)
  const storeDepartments = useEMSStore((state) => state.departments)
  const addStoreDepartment = useEMSStore((state) => state.addDepartment)
  const updateStoreDepartment = useEMSStore((state) => state.updateDepartment)

  // 1. Department States
  const departments: DepartmentItem[] = useMemo(() => {
    return storeDepartments.map((d) => {
      const rawBudget = typeof d.budget === "string" ? Number(d.budget.replace(/[^0-9.-]+/g, "")) || 0 : 0
      return {
        id: d.id,
        code: d.code,
        name: d.name,
        lead: {
          name: d.head || "Department Lead",
          role: "Department Lead",
          email: `${(d.head || "lead").toLowerCase().replace(/\s+/g, ".")}@ems.com`,
          avatar: d.headAvatar,
        },
        headcount: d.employeeCount || 0,
        capacity: (d.employeeCount || 0) + 10,
        annualBudget: rawBudget,
        spentBudget: Math.round(rawBudget * 0.6),
        costCenter: `CC-${d.code}`,
        location: "San Francisco, CA (HQ)",
        subTeams: ["Core Team", "Operations"],
        description: d.description || "",
      }
    })
  }, [storeDepartments])

  const [deptSearch, setDeptSearch] = useState("")
  const [showDeptModal, setShowDeptModal] = useState(false)
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null)

  // Department Modal Form States
  const [deptName, setDeptName] = useState("")
  const [deptCode, setDeptCode] = useState("")
  const [deptLeadName, setDeptLeadName] = useState("")
  const [deptLeadRole, setDeptLeadRole] = useState("")
  const [deptLeadEmail, setDeptLeadEmail] = useState("")
  const [deptBudget, setDeptBudget] = useState<number>(500000)
  const [deptCapacity, setDeptCapacity] = useState<number>(30)
  const [deptLocation, setDeptLocation] = useState("")
  const [deptSubTeams, setDeptSubTeams] = useState("")
  const [deptDesc, setDeptDesc] = useState("")

  // 2. Designation States
  const [designations, setDesignations] = useState<DesignationItem[]>(initialDesignations)
  const [desigSearch, setDesigSearch] = useState("")
  const [desigDeptFilter, setDesigDeptFilter] = useState("All")
  const [desigLevelFilter, setDesigLevelFilter] = useState("All")
  const [showDesigModal, setShowDesigModal] = useState(false)

  // Designation Modal Form States
  const [desigTitle, setDesigTitle] = useState("")
  const [desigCode, setDesigCode] = useState("")
  const [desigDept, setDesigDept] = useState("Engineering")
  const [desigLevel, setDesigLevel] = useState<DesignationItem["level"]>("L3 - Senior")
  const [desigMinSalary, setDesigMinSalary] = useState<number>(120000)
  const [desigMaxSalary, setDesigMaxSalary] = useState<number>(160000)
  const [desigMedian, setDesigMedian] = useState<number>(140000)
  const [desigExperience, setDesigExperience] = useState("4 - 7 Years")

  const [prevInitialSubTab, setPrevInitialSubTab] = useState(initialSubTab)
  if (initialSubTab !== prevInitialSubTab) {
    setPrevInitialSubTab(initialSubTab)
    setCurrentTab(initialSubTab)
  }

  const handleTabSelect = (tab: DepartmentTab) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  // Filtered Departments
  const filteredDepartments = useMemo(() => {
    return departments.filter((d) => {
      const q = deptSearch.toLowerCase()
      return (
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.lead.name.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.subTeams.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [departments, deptSearch])

  // Filtered Designations
  const filteredDesignations = useMemo(() => {
    return designations.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(desigSearch.toLowerCase()) ||
        d.code.toLowerCase().includes(desigSearch.toLowerCase())
      const matchesDept = desigDeptFilter === "All" || d.department === desigDeptFilter
      const matchesLevel = desigLevelFilter === "All" || d.level === desigLevelFilter
      return matchesSearch && matchesDept && matchesLevel
    })
  }, [designations, desigSearch, desigDeptFilter, desigLevelFilter])

  // KPIs
  const totalHeadcount = departments.reduce((acc, curr) => acc + curr.headcount, 0)
  const totalCapacity = departments.reduce((acc, curr) => acc + curr.capacity, 0)
  const totalAnnualBudget = departments.reduce((acc, curr) => acc + curr.annualBudget, 0)
  const totalSpentBudget = departments.reduce((acc, curr) => acc + curr.spentBudget, 0)

  // Open Edit Department Modal
  const openEditDept = (dept: DepartmentItem) => {
    setEditingDept(dept)
    setDeptName(dept.name)
    setDeptCode(dept.code)
    setDeptLeadName(dept.lead.name)
    setDeptLeadRole(dept.lead.role)
    setDeptLeadEmail(dept.lead.email)
    setDeptBudget(dept.annualBudget)
    setDeptCapacity(dept.capacity)
    setDeptLocation(dept.location)
    setDeptSubTeams(dept.subTeams.join(", "))
    setDeptDesc(dept.description)
    setShowDeptModal(true)
  }

  // Open Create Department Modal
  const openCreateDept = () => {
    setEditingDept(null)
    setDeptName("")
    setDeptCode("")
    setDeptLeadName("")
    setDeptLeadRole("")
    setDeptLeadEmail("")
    setDeptBudget(600000)
    setDeptCapacity(30)
    setDeptLocation("Austin HQ")
    setDeptSubTeams("Core Operations, Planning")
    setDeptDesc("")
    setShowDeptModal(true)
  }

  // Save Department Form
  const handleSaveDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!deptName.trim() || !deptCode.trim() || !deptLeadName.trim()) return

    if (editingDept) {
      // Edit existing
      updateStoreDepartment(editingDept.id, {
        name: deptName.trim(),
        code: deptCode.trim().toUpperCase(),
        head: deptLeadName.trim(),
        budget: `$${Number(deptBudget).toLocaleString()}`,
        description: deptDesc.trim(),
      })
      toast.success("Department Updated", {
        description: `Changes saved for ${deptName.trim()} (${deptCode.trim().toUpperCase()}).`,
      })
    } else {
      // Create new
      addStoreDepartment({
        name: deptName.trim(),
        code: deptCode.trim().toUpperCase(),
        head: deptLeadName.trim(),
        budget: `$${Number(deptBudget).toLocaleString()}`,
        description: deptDesc.trim() || "Newly established organizational division.",
        color: "bg-blue-500",
        employeeCount: 0,
      })
      toast.success("Department Created", {
        description: `${deptName.trim()} established under ${deptLeadName.trim()}.`,
      })
    }

    setShowDeptModal(false)
  }

  // Save Designation Form
  const handleSaveDesigSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!desigTitle.trim() || !desigCode.trim()) return

    const newDesig: DesignationItem = {
      id: `DES-${Date.now()}`,
      code: desigCode.trim().toUpperCase(),
      title: desigTitle.trim(),
      department: desigDept,
      level: desigLevel,
      minSalary: Number(desigMinSalary),
      maxSalary: Number(desigMaxSalary),
      medianBenchmark: Number(desigMedian),
      activeHeadcount: 0,
      experienceYears: desigExperience.trim(),
      equityStatus: "Market Compliant",
    }

    setDesignations([...designations, newDesig])
    toast.success("Designation & Band Added", {
      description: `${newDesig.title} (${newDesig.code}) added to ${newDesig.department}.`,
    })
    setDesigTitle("")
    setDesigCode("")
    setShowDesigModal(false)
  }

  const exportDesignationsCSV = () => {
    const headers = ["Role Code", "Title", "Department", "Seniority Level", "Min Base Pay", "Max Base Pay", "Median Benchmark", "Active Headcount", "Experience", "Pay Equity"]
    const rows = filteredDesignations.map((d) => [
      d.code,
      `"${d.title}"`,
      `"${d.department}"`,
      `"${d.level}"`,
      `$${d.minSalary.toLocaleString()}`,
      `$${d.maxSalary.toLocaleString()}`,
      `$${d.medianBenchmark.toLocaleString()}`,
      d.activeHeadcount,
      `"${d.experienceYears}"`,
      d.equityStatus,
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `EMS_Job_Directory_PayBands_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Job Directory Exported", {
      description: `Downloaded compensation bands for ${filteredDesignations.length} standardized roles.`,
    })
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departments & Job Directory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure department structures, assign leadership, track budgets, and manage standardized job pay bands.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {currentTab === "departments" ? (
            <Button onClick={openCreateDept} size="sm" className="gap-1.5 cursor-pointer shadow-xs">
              <Plus className="h-4 w-4" /> Add Department
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={exportDesignationsCSV}
                className="gap-1.5 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export Pay Bands CSV</span>
              </Button>
              <Button
                onClick={() => setShowDesigModal(true)}
                size="sm"
                className="gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4" /> Add Designation
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 overflow-x-auto">
        <button
          onClick={() => handleTabSelect("departments")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "departments"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconBuildingSkyscraper className="size-4 text-primary" />
          <span>1. Department & Team Setup ({departments.length})</span>
        </button>

        <button
          onClick={() => handleTabSelect("designations")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "designations"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconIdBadge2 className="size-4 text-amber-500" />
          <span>2. Designation & Job Title Directory ({designations.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: DEPARTMENT & TEAM SETUP */}
      {/* ========================================================================= */}
      {currentTab === "departments" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Total Departments</span>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Building2 className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-foreground">{departments.length} Divisions</div>
              <span className="text-xs text-muted-foreground">Across Austin HQ Campus</span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Total Headcount Capacity</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Users className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                {totalHeadcount} / {totalCapacity} FTEs
              </div>
              <span className="text-xs text-muted-foreground">
                {((totalHeadcount / totalCapacity) * 100).toFixed(1)}% workforce utilization
              </span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Annual Budget Allocated</span>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <DollarSign className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-foreground">
                ${(totalAnnualBudget / 1000000).toFixed(2)}M
              </div>
              <span className="text-xs text-muted-foreground">
                ${(totalSpentBudget / 1000000).toFixed(2)}M spent ({((totalSpentBudget / totalAnnualBudget) * 100).toFixed(0)}%)
              </span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Specialized Squads</span>
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Layers className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">24 Teams</div>
              <span className="text-xs text-muted-foreground">Autonomous cross-functional units</span>
            </Card>
          </div>

          {/* Search Filter */}
          <Card className="shadow-xs">
            <CardContent className="p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search department name, code, lead, location, or squad..."
                  value={deptSearch}
                  onChange={(e) => setDeptSearch(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
              <span className="text-xs text-muted-foreground self-center sm:self-auto">
                Showing {filteredDepartments.length} of {departments.length} departments
              </span>
            </CardContent>
          </Card>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((dept) => {
              const budgetPercent = Math.min(100, Math.round((dept.spentBudget / dept.annualBudget) * 100))
              const capacityPercent = Math.min(100, Math.round((dept.headcount / dept.capacity) * 100))

              return (
                <Card key={dept.id} className="shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between">
                  <CardHeader className="pb-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono font-bold text-xs bg-muted/60">
                          {dept.code}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground font-mono">{dept.costCenter}</span>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDept(dept)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Edit Department"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div>
                      <CardTitle className="text-base font-bold">{dept.name}</CardTitle>
                      <CardDescription className="text-xs line-clamp-2 mt-0.5">
                        {dept.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3.5 pt-0 text-xs">
                    {/* Department Lead Pill */}
                    <div className="p-2.5 rounded-lg bg-muted/40 border flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        {dept.lead.avatar && <AvatarImage src={dept.lead.avatar} alt={dept.lead.name} />}
                        <AvatarFallback className="text-[11px] font-bold bg-muted">
                          {dept.lead.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate text-foreground">{dept.lead.name}</span>
                          <Badge variant="secondary" className="text-[9px] py-0 px-1 font-normal">
                            Lead
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">{dept.lead.role}</p>
                      </div>
                    </div>

                    {/* Headcount Capacity Gauge */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Headcount Roster:</span>
                        <span className="font-semibold text-foreground">
                          {dept.headcount} / {dept.capacity} FTEs ({capacityPercent}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          style={{ width: `${capacityPercent}%` }}
                          className={`h-full rounded-full transition-all ${
                            capacityPercent >= 90
                              ? "bg-emerald-500"
                              : capacityPercent >= 70
                                ? "bg-primary"
                                : "bg-amber-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Annual Budget Progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Annual Budget Allocation:</span>
                        <span className="font-semibold text-foreground">
                          ${(dept.spentBudget / 1000).toFixed(0)}k / ${(dept.annualBudget / 1000).toFixed(0)}k ({budgetPercent}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          style={{ width: `${budgetPercent}%` }}
                          className={`h-full rounded-full transition-all ${
                            budgetPercent > 85
                              ? "bg-orange-500"
                              : "bg-blue-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Squad Tags */}
                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground">Sub-teams & Squads:</span>
                      <div className="flex flex-wrap gap-1">
                        {dept.subTeams.map((team, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-md bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground border font-medium"
                          >
                            {team}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 pb-3 border-t text-[11px] text-muted-foreground flex justify-between">
                    <span>{dept.location}</span>
                    <button
                      onClick={() => openEditDept(dept)}
                      className="font-medium text-primary hover:underline cursor-pointer"
                    >
                      Manage Roster →
                    </button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: DESIGNATION & JOB TITLE DIRECTORY */}
      {/* ========================================================================= */}
      {currentTab === "designations" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Top Banner / Guidelines */}
          <div className="p-3.5 rounded-xl bg-muted/40 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Briefcase className="h-5 w-5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground">Standardized Compensation Framework 2026</h4>
                <p className="text-muted-foreground mt-0.5">
                  Pre-approved salary brackets, leveling criteria (L1-L5), and market benchmarks for fair organizational compensation.
                </p>
              </div>
            </div>
            <Badge variant="outline" className="gap-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 self-start sm:self-auto">
              <Sparkles className="h-3 w-3" /> Annual Pay Equity Certified
            </Badge>
          </div>

          {/* Search & Filters */}
          <Card className="shadow-xs">
            <CardContent className="p-3.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search standardized job title or level code..."
                  value={desigSearch}
                  onChange={(e) => setDesigSearch(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={desigDeptFilter}
                  onChange={(e) => setDesigDeptFilter(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="Infrastructure & Security">Infrastructure & Security</option>
                  <option value="People & Culture">People & Culture</option>
                  <option value="Finance & Operations">Finance & Operations</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                </select>

                <select
                  value={desigLevelFilter}
                  onChange={(e) => setDesigLevelFilter(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="All">All Seniority Levels</option>
                  <option value="L1 - Entry">L1 - Entry</option>
                  <option value="L2 - Mid">L2 - Mid</option>
                  <option value="L3 - Senior">L3 - Senior</option>
                  <option value="L4 - Lead / Staff">L4 - Lead / Staff</option>
                  <option value="L5 - Executive / Director">L5 - Executive / Director</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Job Titles Table */}
          <Card className="shadow-xs overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b select-none">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Role Title & Code</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold">Seniority Level</th>
                      <th className="px-4 py-3 font-semibold">Pay Band Range (Annual)</th>
                      <th className="px-4 py-3 font-semibold">Median Benchmark</th>
                      <th className="px-4 py-3 font-semibold">Active Staff</th>
                      <th className="px-4 py-3 font-semibold">Equity Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs">
                    {filteredDesignations.map((desig) => (
                      <tr key={desig.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-foreground">{desig.title}</div>
                          <span className="font-mono text-[10px] text-muted-foreground">{desig.code}</span>
                        </td>

                        <td className="px-4 py-3.5">
                          <Badge variant="outline" className="text-[10px]">
                            {desig.department}
                          </Badge>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-medium text-foreground">{desig.level}</span>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{desig.experienceYears} exp.</div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-mono font-semibold text-foreground">
                            ${desig.minSalary.toLocaleString()} - ${desig.maxSalary.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-muted-foreground">Standardized USD</span>
                        </td>

                        <td className="px-4 py-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          ${desig.medianBenchmark.toLocaleString()}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 font-medium">
                            <IconUsers className="size-3.5 text-muted-foreground" />
                            <span>{desig.activeHeadcount} Staff</span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <Badge
                            variant={
                              desig.equityStatus === "Market Compliant"
                                ? "default"
                                : desig.equityStatus === "Adjusted 2026"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-[10px]"
                          >
                            {desig.equityStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>

            <CardFooter className="p-3 border-t text-xs text-muted-foreground flex justify-between">
              <span>Total {filteredDesignations.length} standardized designations configured</span>
              <span>All pay bands updated for FY2026</span>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE / EDIT DEPARTMENT */}
      {/* ========================================================================= */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-xl shadow-2xl border-border animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  <span>{editingDept ? `Edit Department: ${editingDept.name}` : "Create New Department"}</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeptModal(false)}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-xs">
                Configure department leadership, operational budget allocation, and squad rosters.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form id="dept-form" onSubmit={handleSaveDeptSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Department Name *
                    </label>
                    <Input
                      placeholder="e.g. Artificial Intelligence & Labs"
                      value={deptName}
                      onChange={(e) => setDeptName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Dept Code *
                    </label>
                    <Input
                      placeholder="e.g. AIL"
                      value={deptCode}
                      onChange={(e) => setDeptCode(e.target.value)}
                      required
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border space-y-2">
                  <span className="text-xs font-semibold text-foreground block">Assigned Department Lead</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-0.5">Lead Name *</label>
                      <Input
                        placeholder="e.g. Dr. Maya Lin"
                        value={deptLeadName}
                        onChange={(e) => setDeptLeadName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-0.5">Official Title</label>
                      <Input
                        placeholder="e.g. Head of AI Research"
                        value={deptLeadRole}
                        onChange={(e) => setDeptLeadRole(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-0.5">Work Email</label>
                    <Input
                      type="email"
                      placeholder="maya.lin@ems.company"
                      value={deptLeadEmail}
                      onChange={(e) => setDeptLeadEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Annual Budget Allocation ($ USD) *
                    </label>
                    <Input
                      type="number"
                      value={deptBudget}
                      onChange={(e) => setDeptBudget(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Headcount Target Capacity (FTEs) *
                    </label>
                    <Input
                      type="number"
                      value={deptCapacity}
                      onChange={(e) => setDeptCapacity(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Location / Floor
                    </label>
                    <Input
                      placeholder="e.g. Austin HQ - Floor 3"
                      value={deptLocation}
                      onChange={(e) => setDeptLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Sub-teams / Squads (comma separated)
                    </label>
                    <Input
                      placeholder="e.g. LLM Engine, Applied Vision, MLOps"
                      value={deptSubTeams}
                      onChange={(e) => setDeptSubTeams(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Department Mission & Scope
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief summary of core departmental goals..."
                    value={deptDesc}
                    onChange={(e) => setDeptDesc(e.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeptModal(false)}
                className="cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button form="dept-form" type="submit" size="sm" className="gap-1.5 cursor-pointer text-xs">
                <Plus className="h-3.5 w-3.5" /> {editingDept ? "Save Changes" : "Create Department"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD DESIGNATION & PAY BAND */}
      {/* ========================================================================= */}
      {showDesigModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-lg shadow-2xl border-border animate-in zoom-in-95">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="size-4 text-amber-500" />
                  <span>Standardize New Role Designation</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDesigModal(false)}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-xs">
                Add an official organizational job title, seniority level, and associated pay band.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form id="desig-form" onSubmit={handleSaveDesigSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Role Title *
                    </label>
                    <Input
                      placeholder="e.g. Lead Security Architect"
                      value={desigTitle}
                      onChange={(e) => setDesigTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Level Code *
                    </label>
                    <Input
                      placeholder="e.g. INF-L4"
                      value={desigCode}
                      onChange={(e) => setDesigCode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Department
                    </label>
                    <select
                      value={desigDept}
                      onChange={(e) => setDesigDept(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Infrastructure & Security">Infrastructure & Security</option>
                      <option value="People & Culture">People & Culture</option>
                      <option value="Finance & Operations">Finance & Operations</option>
                      <option value="Sales & Marketing">Sales & Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Seniority Level
                    </label>
                    <select
                      value={desigLevel}
                      onChange={(e) => setDesigLevel(e.target.value as DesignationItem["level"])}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="L1 - Entry">L1 - Entry</option>
                      <option value="L2 - Mid">L2 - Mid</option>
                      <option value="L3 - Senior">L3 - Senior</option>
                      <option value="L4 - Lead / Staff">L4 - Lead / Staff</option>
                      <option value="L5 - Executive / Director">L5 - Executive / Director</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Min Base ($) *
                    </label>
                    <Input
                      type="number"
                      value={desigMinSalary}
                      onChange={(e) => setDesigMinSalary(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Max Base ($) *
                    </label>
                    <Input
                      type="number"
                      value={desigMaxSalary}
                      onChange={(e) => setDesigMaxSalary(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Median Benchmark
                    </label>
                    <Input
                      type="number"
                      value={desigMedian}
                      onChange={(e) => setDesigMedian(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Experience Requirement
                  </label>
                  <Input
                    placeholder="e.g. 5 - 8 Years"
                    value={desigExperience}
                    onChange={(e) => setDesigExperience(e.target.value)}
                  />
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDesigModal(false)}
                className="cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button form="desig-form" type="submit" size="sm" className="gap-1.5 cursor-pointer text-xs">
                <Plus className="h-3.5 w-3.5" /> Save Designation
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
