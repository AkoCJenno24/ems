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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Download,
  Clock,
  CheckCircle2,
  Eye,
  FileSpreadsheet,
  X,
  Printer,
  SlidersHorizontal,
  Check,
} from "lucide-react"
import {
  IconFileAnalytics,
  IconClockCheck,
  IconReceipt2,
  IconCalendarOff,
  IconUserMinus,
  IconDatabaseExport,
} from "@tabler/icons-react"

export type ReportsTab = "standard" | "custom"

export interface StandardReportItem {
  id: string
  title: string
  category: "Attendance" | "Payroll" | "Leave" | "Turnover"
  description: string
  lastGenerated: string
  recordCount: number
  fileSize: string
  badgeText: string
  sampleColumns: string[]
}

export interface CustomExportRecord {
  id: string
  name: string
  department: string
  employmentType: "Full-Time" | "Part-Time" | "Contractor"
  role: string
  attendanceRate: string
  leaveDaysTaken: number
  monthlyGross: number
  monthlyNet: number
  status: "Active" | "On-Leave"
}

// Dummy Standard Reports
const standardReportsList: StandardReportItem[] = [
  {
    id: "REP-ATT-01",
    title: "Monthly Attendance & Punch Adherence Log",
    category: "Attendance",
    description: "Detailed daily record of biometric check-ins, tardiness grace breaches, half-days, and verified working hours.",
    lastGenerated: "Today at 08:30 AM",
    recordCount: 248,
    fileSize: "1.4 MB",
    badgeText: "96.8% Org Adherence",
    sampleColumns: ["Emp ID", "Name", "Department", "Shift", "Punches (In/Out)", "Late Mins", "Overtime", "Status"],
  },
  {
    id: "REP-PAY-02",
    title: "Executive Compensation & Payroll Summary",
    category: "Payroll",
    description: "Itemized gross payouts, integrated overtime multipliers, taxable withholdings, benefit deductions, and net disbursements.",
    lastGenerated: "Aug 22, 2026",
    recordCount: 248,
    fileSize: "2.1 MB",
    badgeText: "$1.75M Net Disbursed",
    sampleColumns: ["Emp ID", "Name", "Base Salary", "OT Hours", "OT Pay", "Bonus", "Taxes & FICA", "Net Pay"],
  },
  {
    id: "REP-LV-03",
    title: "Corporate Leave Liability & Accrual Exposure",
    category: "Leave",
    description: "Financial exposure audit calculating unpaid vacation liability balance, statutory carry-over limits, and sick leave usage.",
    lastGenerated: "Aug 20, 2026",
    recordCount: 248,
    fileSize: "890 KB",
    badgeText: "$184,250 Liability",
    sampleColumns: ["Emp ID", "Name", "Dept", "PTO Accrued", "PTO Used", "Balance Remaining", "Cash Equivalent ($)"],
  },
  {
    id: "REP-TUR-04",
    title: "Workforce Retention & Turnover Rate Analysis",
    category: "Turnover",
    description: "Annualized voluntary vs involuntary turnover breakdown, average tenure by department, and onboarding velocity.",
    lastGenerated: "Aug 18, 2026",
    recordCount: 42,
    fileSize: "650 KB",
    badgeText: "3.2% Low Turnover",
    sampleColumns: ["Metric", "Engineering", "Product", "Infrastructure", "People", "Finance", "Sales", "Total Org"],
  },
]

// Dummy Dataset for Custom Export Builder
const sampleCustomDataset: CustomExportRecord[] = [
  { id: "EMP-101", name: "David Kim", department: "Engineering", employmentType: "Full-Time", role: "VP of Engineering", attendanceRate: "98.5%", leaveDaysTaken: 2, monthlyGross: 17750, monthlyNet: 13195, status: "Active" },
  { id: "EMP-102", name: "Sarah Chen", department: "Product & Design", employmentType: "Full-Time", role: "Lead Product Designer", attendanceRate: "96.0%", leaveDaysTaken: 4, monthlyGross: 12966, monthlyNet: 9596, status: "Active" },
  { id: "EMP-103", name: "Marcus Vance", department: "Infrastructure", employmentType: "Full-Time", role: "DevOps Architect", attendanceRate: "94.2%", leaveDaysTaken: 1, monthlyGross: 16921, monthlyNet: 11932, status: "Active" },
  { id: "EMP-104", name: "Elena Rostova", department: "People & Culture", employmentType: "Full-Time", role: "HR Operations Lead", attendanceRate: "99.0%", leaveDaysTaken: 3, monthlyGross: 8833, monthlyNet: 6473, status: "On-Leave" },
  { id: "EMP-105", name: "Sophia Martinez", department: "Finance & Operations", employmentType: "Full-Time", role: "FP&A Controller", attendanceRate: "97.5%", leaveDaysTaken: 0, monthlyGross: 12460, monthlyNet: 9230, status: "Active" },
  { id: "EMP-106", name: "Alex Morgan", department: "Engineering", employmentType: "Full-Time", role: "Senior Full-Stack Engineer", attendanceRate: "95.0%", leaveDaysTaken: 5, monthlyGross: 13451, monthlyNet: 8810, status: "Active" },
  { id: "EMP-107", name: "Maya Lin", department: "Engineering", employmentType: "Contractor", role: "Frontend Contractor", attendanceRate: "93.0%", leaveDaysTaken: 0, monthlyGross: 9500, monthlyNet: 9500, status: "Active" },
  { id: "EMP-108", name: "Lucas Wright", department: "Sales & Marketing", employmentType: "Full-Time", role: "VP of Global Growth", attendanceRate: "95.5%", leaveDaysTaken: 1, monthlyGross: 15500, monthlyNet: 11200, status: "Active" },
]

interface ReportsPageProps {
  initialSubTab?: ReportsTab
  onTabChange?: (tab: ReportsTab) => void
}

export function ReportsPage({ initialSubTab = "standard", onTabChange }: ReportsPageProps) {
  const [currentTab, setCurrentTab] = useState<ReportsTab>(initialSubTab)

  // 1. Standard Reports States
  const [previewReport, setPreviewReport] = useState<StandardReportItem | null>(null)

  // 2. Custom Export Builder States
  const [exportDataset, setExportDataset] = useState("all")
  const [exportDept, setExportDept] = useState("All")
  const [exportType, setExportType] = useState("All")
  const [exportDateStart, setExportDateStart] = useState("2026-08-01")
  const [exportDateEnd, setExportDateEnd] = useState("2026-08-31")
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("csv")

  // Selected Columns Toggles
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "id",
    "name",
    "department",
    "role",
    "employmentType",
    "attendanceRate",
    "leaveDaysTaken",
    "monthlyGross",
    "monthlyNet",
  ])

  const [exportSuccess, setExportSuccess] = useState(false)

  // Sync internal state when parent initialSubTab changes
  React.useEffect(() => {
    if (initialSubTab) {
      setCurrentTab(initialSubTab)
    }
  }, [initialSubTab])

  const handleTabSelect = (tab: ReportsTab) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  // Filtered Custom Dataset
  const filteredCustomData = useMemo(() => {
    return sampleCustomDataset.filter((item) => {
      const matchesDept = exportDept === "All" || item.department === exportDept
      const matchesType = exportType === "All" || item.employmentType === exportType
      return matchesDept && matchesType
    })
  }, [exportDept, exportType])

  const toggleColumn = (colKey: string) => {
    if (selectedColumns.includes(colKey)) {
      if (selectedColumns.length > 1) {
        setSelectedColumns(selectedColumns.filter((c) => c !== colKey))
      }
    } else {
      setSelectedColumns([...selectedColumns, colKey])
    }
  }

  // Export Standard Report File
  const handleDownloadStandardReport = (report: StandardReportItem, format: "csv" | "excel" | "pdf") => {
    const csvContent = `data:text/csv;charset=utf-8,${report.sampleColumns.join(",")}\n` +
      `EMP-101,"David Kim","${report.category}","Standard Record 1","Verified","Aug 2026"\n` +
      `EMP-102,"Sarah Chen","${report.category}","Standard Record 2","Verified","Aug 2026"\n` +
      `EMP-103,"Marcus Vance","${report.category}","Standard Record 3","Verified","Aug 2026"`

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `EMS_${report.title.replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().slice(0, 10)}.${format === "excel" ? "xlsx" : format === "pdf" ? "pdf" : "csv"}`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Standard Report Downloaded", {
      description: `${report.title} (${format.toUpperCase()}) successfully exported.`,
    })
  }

  // Trigger Custom Data Export Download
  const handleExecuteCustomExport = () => {
    const headerMap: Record<string, string> = {
      id: "Employee ID",
      name: "Full Name",
      department: "Department",
      role: "Job Title",
      employmentType: "Employment Type",
      attendanceRate: "Attendance Rate",
      leaveDaysTaken: "Leaves Taken (Days)",
      monthlyGross: "Monthly Gross ($)",
      monthlyNet: "Monthly Net ($)",
    }

    const activeHeaders = selectedColumns.map((c) => headerMap[c] || c)
    const rows = filteredCustomData.map((row) => {
      return selectedColumns.map((col) => {
        const val = row[col as keyof CustomExportRecord]
        if (typeof val === "string") return `"${val}"`
        return val
      })
    })

    const csvContent = "data:text/csv;charset=utf-8," + [activeHeaders.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `EMS_Custom_Export_${exportDataset}_${new Date().toISOString().slice(0, 10)}.${exportFormat === "excel" ? "xlsx" : exportFormat === "pdf" ? "pdf" : "csv"}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Custom Dataset Exported", {
      description: `Generated ${exportFormat.toUpperCase()} file with ${filteredCustomData.length} records across ${selectedColumns.length} fields.`,
    })

    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 3000)
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Enterprise Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Export standard operational reports or build multi-parameter custom datasets filtered by dates, departments, and payroll metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="outline" className="gap-1.5 py-1 px-2.5 text-xs font-semibold">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Updated: FY2026 Q3 Real-Time</span>
          </Badge>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 overflow-x-auto">
        <button
          onClick={() => handleTabSelect("standard")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "standard"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconFileAnalytics className="size-4 text-primary" />
          <span>1. Standard Report Generator (4)</span>
        </button>

        <button
          onClick={() => handleTabSelect("custom")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "custom"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconDatabaseExport className="size-4 text-emerald-500" />
          <span>2. Custom Data Export Builder</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: STANDARD REPORT GENERATOR */}
      {/* ========================================================================= */}
      {currentTab === "standard" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Executive Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Monthly Attendance Rate</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <IconClockCheck className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">96.8%</div>
              <span className="text-[11px] text-muted-foreground">Adherence across 248 staff</span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Monthly Payroll Gross</span>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <IconReceipt2 className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-foreground">$2.14M</div>
              <span className="text-[11px] text-muted-foreground">August 2026 Disbursed</span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Leave Liability Exposure</span>
                <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <IconCalendarOff className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">$184,250</div>
              <span className="text-[11px] text-muted-foreground">Accrued unused PTO days</span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Annual Turnover Rate</span>
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <IconUserMinus className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">3.2%</div>
              <span className="text-[11px] text-muted-foreground">96.8% workforce retention</span>
            </Card>
          </div>

          {/* Standard Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {standardReportsList.map((report) => (
              <Card key={report.id} className="shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between">
                <CardHeader className="pb-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-xs bg-muted/60">
                      {report.id}
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {report.badgeText}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">{report.title}</CardTitle>
                    <CardDescription className="text-xs mt-0.5 line-clamp-2">
                      {report.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs">
                  <div className="p-2.5 rounded-lg bg-muted/40 border space-y-1">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Records Included:</span>
                      <strong className="text-foreground">{report.recordCount} Verified Rows</strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Last Generated:</span>
                      <span className="text-foreground">{report.lastGenerated}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">Sample Audit Columns:</span>
                    <div className="flex flex-wrap gap-1">
                      {report.sampleColumns.map((col, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-md bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground border font-mono"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 pb-3 border-t flex flex-wrap items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewReport(report)}
                    className="h-7 text-xs px-2.5 cursor-pointer gap-1"
                  >
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Quick Preview</span>
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      onClick={() => handleDownloadStandardReport(report, "csv")}
                      className="h-7 text-xs px-2.5 cursor-pointer gap-1 shadow-xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download CSV</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadStandardReport(report, "excel")}
                      className="h-7 text-xs px-2 cursor-pointer"
                      title="Download Excel"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: CUSTOM DATA EXPORT BUILDER */}
      {/* ========================================================================= */}
      {currentTab === "custom" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Query Filter Matrix Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-primary" />
                <span>Custom Filter & Parameter Matrix</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Select target datasets, multi-department boundaries, date ranges, and custom column fields.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Primary Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Dataset Domain</label>
                  <select
                    value={exportDataset}
                    onChange={(e) => setExportDataset(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="all">Consolidated Enterprise Directory</option>
                    <option value="attendance">Attendance & Punch Records</option>
                    <option value="payroll">Payroll & Net Disbursements</option>
                    <option value="leaves">Leave Applications & Balances</option>
                    <option value="performance">Performance & OKR Calibrations</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Department Scope</label>
                  <select
                    value={exportDept}
                    onChange={(e) => setExportDept(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="All">All Departments (Enterprise)</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="People & Culture">People & Culture</option>
                    <option value="Finance & Operations">Finance & Operations</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Employment Type</label>
                  <select
                    value={exportType}
                    onChange={(e) => setExportType(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="All">All Worker Classifications</option>
                    <option value="Full-Time">Full-Time Regular (FTE)</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contractor">Contractor / 1099</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Output File Format</label>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant={exportFormat === "csv" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExportFormat("csv")}
                      className="flex-1 h-9 text-xs cursor-pointer font-mono"
                    >
                      .CSV
                    </Button>
                    <Button
                      type="button"
                      variant={exportFormat === "excel" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExportFormat("excel")}
                      className="flex-1 h-9 text-xs cursor-pointer font-mono"
                    >
                      .XLSX
                    </Button>
                    <Button
                      type="button"
                      variant={exportFormat === "pdf" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExportFormat("pdf")}
                      className="flex-1 h-9 text-xs cursor-pointer font-mono"
                    >
                      .PDF
                    </Button>
                  </div>
                </div>
              </div>

              {/* Date Span Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-3 rounded-lg bg-muted/40 border">
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Audit Start Date</label>
                  <Input
                    type="date"
                    value={exportDateStart}
                    onChange={(e) => setExportDateStart(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Audit End Date</label>
                  <Input
                    type="date"
                    value={exportDateEnd}
                    onChange={(e) => setExportDateEnd(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              {/* Columns Selector Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground block">
                  Select Custom Columns to Include in Output File:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
                  {[
                    { key: "id", label: "Employee ID" },
                    { key: "name", label: "Full Name" },
                    { key: "department", label: "Department" },
                    { key: "role", label: "Job Title" },
                    { key: "employmentType", label: "Worker Type" },
                    { key: "attendanceRate", label: "Attendance %" },
                    { key: "leaveDaysTaken", label: "Leaves Taken" },
                    { key: "monthlyGross", label: "Gross Salary ($)" },
                    { key: "monthlyNet", label: "Net Payout ($)" },
                  ].map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-muted/30 cursor-pointer select-none transition-colors"
                    >
                      <Checkbox
                        checked={selectedColumns.includes(col.key)}
                        onCheckedChange={() => toggleColumn(col.key)}
                      />
                      <span className="text-[11px] font-medium text-foreground">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t pt-4">
              <div className="text-xs text-muted-foreground">
                Query matches <strong>{filteredCustomData.length} records</strong> across {selectedColumns.length} selected fields.
              </div>

              <Button
                onClick={handleExecuteCustomExport}
                className="gap-1.5 cursor-pointer shadow-xs w-full sm:w-auto"
              >
                <Download className="h-4 w-4" />
                <span>Export Dataset ({exportFormat.toUpperCase()})</span>
              </Button>
            </CardFooter>
          </Card>

          {exportSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
              <span>
                Export completed successfully! Your file has been formatted and downloaded.
              </span>
            </div>
          )}

          {/* Live Preview Table */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Live Query Preview</CardTitle>
              <CardDescription className="text-xs">
                Real-time sample view of exported data structure based on active criteria.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b select-none">
                    <tr>
                      {selectedColumns.includes("id") && <th className="px-3 py-2.5 font-semibold">ID</th>}
                      {selectedColumns.includes("name") && <th className="px-3 py-2.5 font-semibold">Name</th>}
                      {selectedColumns.includes("department") && <th className="px-3 py-2.5 font-semibold">Department</th>}
                      {selectedColumns.includes("role") && <th className="px-3 py-2.5 font-semibold">Role</th>}
                      {selectedColumns.includes("employmentType") && <th className="px-3 py-2.5 font-semibold">Type</th>}
                      {selectedColumns.includes("attendanceRate") && <th className="px-3 py-2.5 font-semibold">Attendance</th>}
                      {selectedColumns.includes("leaveDaysTaken") && <th className="px-3 py-2.5 font-semibold">Leaves</th>}
                      {selectedColumns.includes("monthlyGross") && <th className="px-3 py-2.5 font-semibold">Gross ($)</th>}
                      {selectedColumns.includes("monthlyNet") && <th className="px-3 py-2.5 font-semibold">Net ($)</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs font-mono">
                    {filteredCustomData.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                        {selectedColumns.includes("id") && <td className="px-3 py-2.5 text-muted-foreground">{row.id}</td>}
                        {selectedColumns.includes("name") && <td className="px-3 py-2.5 font-sans font-medium text-foreground">{row.name}</td>}
                        {selectedColumns.includes("department") && <td className="px-3 py-2.5 font-sans text-muted-foreground">{row.department}</td>}
                        {selectedColumns.includes("role") && <td className="px-3 py-2.5 font-sans text-muted-foreground">{row.role}</td>}
                        {selectedColumns.includes("employmentType") && (
                          <td className="px-3 py-2.5">
                            <Badge variant="outline" className="text-[10px] font-sans">
                              {row.employmentType}
                            </Badge>
                          </td>
                        )}
                        {selectedColumns.includes("attendanceRate") && <td className="px-3 py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">{row.attendanceRate}</td>}
                        {selectedColumns.includes("leaveDaysTaken") && <td className="px-3 py-2.5 text-muted-foreground">{row.leaveDaysTaken} days</td>}
                        {selectedColumns.includes("monthlyGross") && <td className="px-3 py-2.5 text-foreground">${row.monthlyGross.toLocaleString()}</td>}
                        {selectedColumns.includes("monthlyNet") && <td className="px-3 py-2.5 font-bold text-foreground">${row.monthlyNet.toLocaleString()}</td>}
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
      {/* MODAL: STANDARD REPORT PREVIEW */}
      {/* ========================================================================= */}
      {previewReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-2xl shadow-2xl border-border animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <IconFileAnalytics className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{previewReport.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {previewReport.description}
                    </CardDescription>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewReport(null)}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-muted/40 border">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Report Category</span>
                  <strong className="text-foreground">{previewReport.category}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Total Records</span>
                  <span className="font-mono text-foreground">{previewReport.recordCount} Verified Rows</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">File Size</span>
                  <span className="font-mono text-foreground">{previewReport.fileSize}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-foreground block">Verified Dataset Schema:</span>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  {previewReport.sampleColumns.map((col, idx) => (
                    <div key={idx} className="p-2 rounded bg-card border flex items-center gap-2">
                      <Check className="size-3 text-emerald-500" />
                      <span>{col}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5 cursor-pointer text-xs"
              >
                <Printer className="h-3.5 w-3.5" /> Print Summary
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewReport(null)}
                  className="cursor-pointer text-xs"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleDownloadStandardReport(previewReport, "csv")
                    setPreviewReport(null)
                  }}
                  className="gap-1.5 cursor-pointer text-xs"
                >
                  <Download className="h-3.5 w-3.5" /> Download Full CSV
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
