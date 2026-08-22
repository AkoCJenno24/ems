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
  DollarSign,
  FileText,
  Download,
  Send,
  Plus,
  Search,
  CheckCircle2,
  Eye,
  Calendar,
  X,
  Sparkles,
  Printer,
} from "lucide-react"
import {
  IconCalculator,
  IconSend,
  IconBuildingBank,
  IconReceiptTax,
} from "@tabler/icons-react"

export type PayrollTab = "wizard" | "structures" | "payslips" | "disbursements"

export interface PayrollEmployeeRow {
  id: string
  name: string
  role: string
  department: string
  avatar?: string
  baseSalary: number
  overtimeHours: number
  overtimePay: number
  bonuses: number
  unpaidLeaveDays: number
  unpaidLeaveDeduction: number
  taxDeductions: number
  benefitsDeduction: number
  grossPay: number
  netPay: number
  status: "Calculated" | "Approved" | "Disbursed"
  bankAccountMasked: string
}

export interface SalaryStructureTemplate {
  id: string
  name: string
  targetGroup: string
  basePercent: number
  allowances: { name: string; amount: string; type: "fixed" | "percent" }[]
  deductions: { name: string; amount: string; type: "fixed" | "percent" }[]
  description: string
}

export interface DisbursementBatch {
  id: string
  cycle: string
  paymentMethod: "ACH Direct Deposit" | "SEPA Wire Transfer" | "SWIFT Global"
  bankName: string
  totalAmount: number
  totalEmployees: number
  status: "Ready for Export" | "Disbursed" | "Pending Approval"
  generatedDate: string
  fileFormat: string
}

// Initial Payroll Run Data (August 2026)
const initialPayrollEmployees: PayrollEmployeeRow[] = [
  {
    id: "EMP-101",
    name: "David Kim",
    role: "VP of Engineering",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&dpr=2&q=80",
    baseSalary: 16250, // Monthly ($195k/yr)
    overtimeHours: 0,
    overtimePay: 0,
    bonuses: 1500,
    unpaidLeaveDays: 0,
    unpaidLeaveDeduction: 0,
    taxDeductions: 3905,
    benefitsDeduction: 650,
    grossPay: 17750,
    netPay: 13195,
    status: "Calculated",
    bankAccountMasked: "Chase Bank (•••• 4821)",
  },
  {
    id: "EMP-102",
    name: "Sarah Chen",
    role: "Lead Product Designer",
    department: "Product & Design",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&dpr=2&q=80",
    baseSalary: 11500, // Monthly ($138k/yr)
    overtimeHours: 8.5,
    overtimePay: 666,
    bonuses: 800,
    unpaidLeaveDays: 0,
    unpaidLeaveDeduction: 0,
    taxDeductions: 2850,
    benefitsDeduction: 520,
    grossPay: 12966,
    netPay: 9596,
    status: "Calculated",
    bankAccountMasked: "Bank of America (•••• 9134)",
  },
  {
    id: "EMP-103",
    name: "Marcus Vance",
    role: "DevOps Architect",
    department: "Infrastructure",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&dpr=2&q=80",
    baseSalary: 15160, // Monthly ($182k/yr)
    overtimeHours: 14.0,
    overtimePay: 1450,
    bonuses: 1000,
    unpaidLeaveDays: 1,
    unpaidLeaveDeduction: 689,
    taxDeductions: 3720,
    benefitsDeduction: 580,
    grossPay: 16921,
    netPay: 11932,
    status: "Calculated",
    bankAccountMasked: "Wells Fargo (•••• 3319)",
  },
  {
    id: "EMP-104",
    name: "Elena Rostova",
    role: "HR Operations Lead",
    department: "People & Culture",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&dpr=2&q=80",
    baseSalary: 8333, // Monthly ($100k/yr)
    overtimeHours: 0,
    overtimePay: 0,
    bonuses: 500,
    unpaidLeaveDays: 0,
    unpaidLeaveDeduction: 0,
    taxDeductions: 1940,
    benefitsDeduction: 420,
    grossPay: 8833,
    netPay: 6473,
    status: "Calculated",
    bankAccountMasked: "Citibank (•••• 7742)",
  },
  {
    id: "EMP-105",
    name: "Sophia Martinez",
    role: "FP&A Controller",
    department: "Finance & Operations",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&dpr=2&q=80",
    baseSalary: 11250, // Monthly ($135k/yr)
    overtimeHours: 6.0,
    overtimePay: 460,
    bonuses: 750,
    unpaidLeaveDays: 0,
    unpaidLeaveDeduction: 0,
    taxDeductions: 2740,
    benefitsDeduction: 490,
    grossPay: 12460,
    netPay: 9230,
    status: "Calculated",
    bankAccountMasked: "PNC Bank (•••• 6205)",
  },
  {
    id: "EMP-106",
    name: "Alex Morgan",
    role: "Senior Full-Stack Engineer",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
    baseSalary: 12666, // Monthly ($152k/yr)
    overtimeHours: 12.0,
    overtimePay: 1036,
    bonuses: 900,
    unpaidLeaveDays: 2,
    unpaidLeaveDeduction: 1151,
    taxDeductions: 2980,
    benefitsDeduction: 510,
    grossPay: 13451,
    netPay: 8810,
    status: "Calculated",
    bankAccountMasked: "Silicon Valley Bank (•••• 8092)",
  },
]

const initialStructures: SalaryStructureTemplate[] = [
  {
    id: "STR-01",
    name: "Standard Software Engineering (L1 - L5)",
    targetGroup: "Software Engineers, QA, System Architects",
    basePercent: 70,
    allowances: [
      { name: "Remote Work & Utilities", amount: "$450 / mo", type: "fixed" },
      { name: "Tech Hardware & Learning", amount: "$300 / mo", type: "fixed" },
      { name: "Flexible Wellness Stipend", amount: "$150 / mo", type: "fixed" },
    ],
    deductions: [
      { name: "Federal & State Income Tax", amount: "22.0%", type: "percent" },
      { name: "FICA Social Security & Medicare", amount: "7.65%", type: "percent" },
      { name: "Premium Comprehensive Health & Dental", amount: "$380 / mo", type: "fixed" },
      { name: "401(k) Employee Contribution", amount: "5.0%", type: "percent" },
    ],
    description: "Standardized compensation matrix tailored for engineering and technology roles.",
  },
  {
    id: "STR-02",
    name: "Executive & Senior Leadership Tier",
    targetGroup: "VPs, Directors, Department Leads",
    basePercent: 65,
    allowances: [
      { name: "Executive Retainer & Travel", amount: "$1,200 / mo", type: "fixed" },
      { name: "Discretionary Mobility Allowance", amount: "$600 / mo", type: "fixed" },
      { name: "Executive Health Concierge", amount: "$400 / mo", type: "fixed" },
    ],
    deductions: [
      { name: "Federal & Executive Tax Bracket", amount: "28.0%", type: "percent" },
      { name: "FICA & Medicare", amount: "7.65%", type: "percent" },
      { name: "Executive Benefit Suite", amount: "$650 / mo", type: "fixed" },
      { name: "401(k) Max Contribution", amount: "8.0%", type: "percent" },
    ],
    description: "Executive remuneration framework including governance and travel stipends.",
  },
  {
    id: "STR-03",
    name: "Sales & Commercial Commission Tier",
    targetGroup: "Enterprise Account Execs, Business Dev",
    basePercent: 50,
    allowances: [
      { name: "Client Entertainment & Travel", amount: "$800 / mo", type: "fixed" },
      { name: "Communications & Cell Phone", amount: "$150 / mo", type: "fixed" },
    ],
    deductions: [
      { name: "Standard Income Tax", amount: "20.0%", type: "percent" },
      { name: "FICA & Medicare", amount: "7.65%", type: "percent" },
      { name: "Standard Healthcare", amount: "$320 / mo", type: "fixed" },
    ],
    description: "50/50 Base and uncapped monthly quota commission disbursement model.",
  },
]

const initialBatches: DisbursementBatch[] = [
  {
    id: "BAT-2026-08A",
    cycle: "August 2026 Regular Monthly",
    paymentMethod: "ACH Direct Deposit",
    bankName: "JPMorgan Chase Enterprise Treasury",
    totalAmount: 1759550,
    totalEmployees: 248,
    status: "Ready for Export",
    generatedDate: "Aug 22, 2026 at 09:30 AM",
    fileFormat: "NACHA ACH (.ach)",
  },
  {
    id: "BAT-2026-07A",
    cycle: "July 2026 Regular Monthly",
    paymentMethod: "ACH Direct Deposit",
    bankName: "JPMorgan Chase Enterprise Treasury",
    totalAmount: 1742100,
    totalEmployees: 244,
    status: "Disbursed",
    generatedDate: "Jul 25, 2026 at 10:00 AM",
    fileFormat: "NACHA ACH (.ach)",
  },
  {
    id: "BAT-2026-07-OFF",
    cycle: "July 2026 Mid-Cycle Overtime",
    paymentMethod: "SEPA Wire Transfer",
    bankName: "Barclays Corporate UK",
    totalAmount: 38400,
    totalEmployees: 18,
    status: "Disbursed",
    generatedDate: "Jul 15, 2026 at 02:15 PM",
    fileFormat: "SEPA XML (.xml)",
  },
]

interface PayrollPageProps {
  initialSubTab?: PayrollTab
  onTabChange?: (tab: PayrollTab) => void
}

export function PayrollPage({ initialSubTab = "wizard", onTabChange }: PayrollPageProps) {
  const [currentTab, setCurrentTab] = useState<PayrollTab>(initialSubTab)

  // 1. Wizard States
  const [payrollRows, setPayrollRows] = useState<PayrollEmployeeRow[]>(initialPayrollEmployees)
  const [searchQuery, setSearchQuery] = useState("")
  const [deptFilter, setDeptFilter] = useState("All")
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationComplete, setCalculationComplete] = useState(true)

  // 2. Structures States
  const [structures] = useState<SalaryStructureTemplate[]>(initialStructures)

  // 3. Payslip & Distribution States
  const [selectedPayslipEmployee, setSelectedPayslipEmployee] = useState<PayrollEmployeeRow | null>(null)
  const [isDistributing, setIsDistributing] = useState(false)
  const [distributionSuccess, setDistributionSuccess] = useState(false)

  // 4. Disbursement States
  const [batches] = useState<DisbursementBatch[]>(initialBatches)

  // Sync internal state when parent initialSubTab changes
  React.useEffect(() => {
    if (initialSubTab) {
      setCurrentTab(initialSubTab)
    }
  }, [initialSubTab])

  const handleTabSelect = (tab: PayrollTab) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  // Filtered Payroll Rows
  const filteredPayroll = useMemo(() => {
    return payrollRows.filter((row) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        row.name.toLowerCase().includes(q) ||
        row.role.toLowerCase().includes(q) ||
        row.department.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q)
      const matchesDept = deptFilter === "All" || row.department === deptFilter
      return matchesSearch && matchesDept
    })
  }, [payrollRows, searchQuery, deptFilter])

  // Aggregate Metrics for August Run
  const totalBase = payrollRows.reduce((acc, curr) => acc + curr.baseSalary, 0)
  const totalOT = payrollRows.reduce((acc, curr) => acc + curr.overtimePay, 0)
  const totalBonuses = payrollRows.reduce((acc, curr) => acc + curr.bonuses, 0)
  const totalGross = payrollRows.reduce((acc, curr) => acc + curr.grossPay, 0)
  const totalTaxes = payrollRows.reduce((acc, curr) => acc + curr.taxDeductions + curr.benefitsDeduction, 0)
  const totalUnpaidDeductions = payrollRows.reduce((acc, curr) => acc + curr.unpaidLeaveDeduction, 0)
  const totalNet = payrollRows.reduce((acc, curr) => acc + curr.netPay, 0)

  // 1-Click Run Payroll Calculation Trigger
  const handleRunPayrollCalculation = () => {
    setIsCalculating(true)
    setTimeout(() => {
      setPayrollRows((prev) =>
        prev.map((r) => ({
          ...r,
          status: "Approved",
        }))
      )
      setIsCalculating(false)
      setCalculationComplete(true)
      toast.success("Payroll Calculation Complete", {
        description: `Successfully processed gross compensation ($${totalGross.toFixed(2)}) for 248 employees.`,
      })
    }, 1200)
  }

  // Bulk Distribute Payslips
  const handleBulkDistribute = () => {
    setIsDistributing(true)
    setTimeout(() => {
      setIsDistributing(false)
      setDistributionSuccess(true)
      toast.success("Payslips Distributed", {
        description: "248 encrypted digital payslips released to employee self-service portals.",
      })
      setTimeout(() => setDistributionSuccess(false), 3000)
    }, 1500)
  }

  // Export Bank ACH / CSV File
  const exportDisbursementFile = (batch: DisbursementBatch) => {
    const headers = ["Employee ID", "Employee Name", "Bank", "Routing Number", "Account Number Mask", "Amount ($ USD)", "Payment Type", "Cycle"]
    const rows = payrollRows.map((r) => [
      r.id,
      `"${r.name}"`,
      `"${r.bankAccountMasked.split("(")[0].trim()}"`,
      "021000021",
      `"${r.bankAccountMasked}"`,
      r.netPay.toFixed(2),
      "Direct Deposit PPD",
      `"${batch.cycle}"`,
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `NACHA_ACH_Payment_Batch_${batch.id}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Bank Batch File Exported", {
      description: `NACHA ACH file generated for batch ${batch.id} ($${batch.totalAmount.toLocaleString()}).`,
    })
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Enterprise Payroll Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure salary structures, run 1-click automated calculation wizards, distribute PDF payslips, and generate bank files.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="outline" className="gap-1.5 py-1 px-2.5 text-xs font-semibold">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Cycle: August 2026 (Monthly)</span>
          </Badge>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 overflow-x-auto">
        <button
          onClick={() => handleTabSelect("wizard")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "wizard"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconCalculator className="size-4 text-primary" />
          <span>1. Payroll Run Wizard</span>
        </button>

        <button
          onClick={() => handleTabSelect("structures")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "structures"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconReceiptTax className="size-4 text-blue-500" />
          <span>2. Salary Structure Builder</span>
        </button>

        <button
          onClick={() => handleTabSelect("payslips")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "payslips"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconSend className="size-4 text-emerald-500" />
          <span>3. Payslip Generator & Distributor</span>
        </button>

        <button
          onClick={() => handleTabSelect("disbursements")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "disbursements"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconBuildingBank className="size-4 text-amber-500" />
          <span>4. Bank Disbursement Reports</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: PAYROLL RUN WIZARD */}
      {/* ========================================================================= */}
      {currentTab === "wizard" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Executive Run KPI Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Gross Payroll Expense</span>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <DollarSign className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-foreground">
                ${totalGross.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-muted-foreground">
                Base: ${(totalBase).toLocaleString()} • Bonus: +${totalBonuses.toLocaleString()}
              </span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Overtime Payout (Integrated)</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                +${totalOT.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-muted-foreground">
                From 40.5 logged overtime hours
              </span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Taxes & Deductions</span>
                <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <IconReceiptTax className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">
                -${(totalTaxes + totalUnpaidDeductions).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-muted-foreground">
                Federal Tax + FICA + Unpaid Leave
              </span>
            </Card>

            <Card className="shadow-xs p-4 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-between text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <span>Total Net Direct Disbursement</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                ${totalNet.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-muted-foreground">
                Ready for bank ACH transfer
              </span>
            </Card>
          </div>

          {/* 1-Click Calculation Action Card */}
          <Card className="shadow-xs bg-gradient-to-r from-primary/5 via-muted/30 to-background border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <IconCalculator className="size-5 text-primary" />
                    <span>August 2026 Payroll Execution Engine</span>
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Factors in approved timecards, biometric attendance records, overtime multipliers, unpaid leave deductions, and statutory taxes.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleRunPayrollCalculation}
                    disabled={isCalculating}
                    className="gap-2 cursor-pointer shadow-xs"
                  >
                    {isCalculating ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Calculating 248 Records...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Run 1-Click Payroll Calculation</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {calculationComplete && (
              <CardContent className="pt-0">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                    <span className="font-medium">
                      All 248 employee calculations synchronized with Attendance & Leave Management engines.
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-background text-emerald-600 dark:text-emerald-400 border-emerald-500/40">
                    Zero Calculation Discrepancies
                  </Badge>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Employee Calculation Table */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search employee, role, or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="People & Culture">People & Culture</option>
                    <option value="Finance & Operations">Finance & Operations</option>
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b select-none">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Employee</th>
                      <th className="px-4 py-3 font-semibold">Base Monthly</th>
                      <th className="px-4 py-3 font-semibold">Overtime Pay</th>
                      <th className="px-4 py-3 font-semibold">Bonuses</th>
                      <th className="px-4 py-3 font-semibold">Unpaid Leave</th>
                      <th className="px-4 py-3 font-semibold">Taxes & Benefits</th>
                      <th className="px-4 py-3 font-semibold">Net Payout</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs">
                    {filteredPayroll.map((emp) => (
                      <tr key={emp.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7">
                              {emp.avatar && <AvatarImage src={emp.avatar} alt={emp.name} />}
                              <AvatarFallback className="text-[10px] font-bold bg-muted">
                                {emp.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-foreground">{emp.name}</div>
                              <div className="text-[10px] text-muted-foreground">{emp.role} • {emp.department}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-mono font-medium">
                          ${emp.baseSalary.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 font-mono">
                          {emp.overtimePay > 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              +${emp.overtimePay} ({emp.overtimeHours}h)
                            </span>
                          ) : (
                            <span className="text-muted-foreground">$0.00</span>
                          )}
                        </td>

                        <td className="px-4 py-3 font-mono">
                          {emp.bonuses > 0 ? (
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                              +${emp.bonuses}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">$0.00</span>
                          )}
                        </td>

                        <td className="px-4 py-3 font-mono">
                          {emp.unpaidLeaveDays > 0 ? (
                            <span className="text-destructive font-semibold">
                              -${emp.unpaidLeaveDeduction} ({emp.unpaidLeaveDays}d)
                            </span>
                          ) : (
                            <span className="text-muted-foreground">0 days</span>
                          )}
                        </td>

                        <td className="px-4 py-3 font-mono text-muted-foreground">
                          -${(emp.taxDeductions + emp.benefitsDeduction).toLocaleString()}
                        </td>

                        <td className="px-4 py-3 font-mono font-bold text-foreground">
                          ${emp.netPay.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPayslipEmployee(emp)}
                            className="h-7 text-xs px-2 cursor-pointer gap-1"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View Payslip</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>

            <CardFooter className="p-3 border-t text-xs text-muted-foreground flex justify-between">
              <span>Showing {filteredPayroll.length} calculated employee payroll items</span>
              <span>Direct Bank Deposit Scheduled: Aug 28, 2026</span>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: SALARY STRUCTURE BUILDER */}
      {/* ========================================================================= */}
      {currentTab === "structures" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Configured Salary Structures & Rules</h2>
              <p className="text-xs text-muted-foreground">
                Define standard base pay ratios, statutory and voluntary allowances, benefits, and progressive tax deduction tiers.
              </p>
            </div>
            <Button size="sm" className="gap-1.5 cursor-pointer shadow-xs">
              <Plus className="h-4 w-4" /> Create Custom Structure
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {structures.map((struct) => (
              <Card key={struct.id} className="shadow-xs flex flex-col justify-between hover:border-primary/40 transition-all">
                <CardHeader className="pb-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-xs bg-muted/60">
                      {struct.id}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      Base Ratio: {struct.basePercent}%
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">{struct.name}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">{struct.description}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3.5 pt-0 text-xs">
                  {/* Allowances List */}
                  <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                    <div className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                      <span>Standard Allowances</span>
                      <span className="text-[10px] font-normal">Monthly Fixed</span>
                    </div>
                    {struct.allowances.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-muted-foreground text-[11px]">
                        <span>{item.name}</span>
                        <strong className="text-foreground">{item.amount}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Deductions List */}
                  <div className="p-2.5 rounded-lg bg-orange-500/5 border border-orange-500/20 space-y-1.5">
                    <div className="font-semibold text-orange-700 dark:text-orange-300 flex items-center justify-between">
                      <span>Statutory & Benefit Deductions</span>
                      <span className="text-[10px] font-normal">Pre/Post Tax</span>
                    </div>
                    {struct.deductions.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-muted-foreground text-[11px]">
                        <span>{item.name}</span>
                        <strong className="text-foreground">{item.amount}</strong>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-2 pb-3 border-t text-[11px] text-muted-foreground flex justify-between">
                  <span>Target: {struct.targetGroup}</span>
                  <button className="font-medium text-primary hover:underline cursor-pointer">
                    Edit Rules →
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: PAYSLIP GENERATOR & DISTRIBUTOR */}
      {/* ========================================================================= */}
      {currentTab === "payslips" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Distribution Action Card */}
          <Card className="shadow-xs border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <IconSend className="size-5 text-primary" />
                    <span>Automated Payslip Distribution Hub</span>
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Generate encrypted PDF payslips in bulk and publish them directly to employee self-service portals.
                  </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={handleBulkDistribute}
                    disabled={isDistributing}
                    className="gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isDistributing ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Distributing to 248 Portals...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Distribute All Payslips (248)</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {distributionSuccess && (
              <CardContent className="pt-0">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span>
                    Successfully published 248 payslips to employee portals! Email notifications have been dispatched.
                  </span>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Payslip Employee Roster */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">Generated Payslips Archive</CardTitle>
                <CardDescription className="text-xs">
                  Review and preview individual employee itemized compensation statements.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b select-none">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Employee</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold">Pay Period</th>
                      <th className="px-4 py-3 font-semibold">Gross Pay</th>
                      <th className="px-4 py-3 font-semibold">Net Payout</th>
                      <th className="px-4 py-3 font-semibold">Distribution Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs">
                    {payrollRows.map((emp) => (
                      <tr key={emp.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7">
                              {emp.avatar && <AvatarImage src={emp.avatar} alt={emp.name} />}
                              <AvatarFallback className="text-[10px] font-bold bg-muted">
                                {emp.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-foreground">{emp.name}</div>
                              <div className="text-[10px] text-muted-foreground">{emp.role}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-[10px]">
                            {emp.department}
                          </Badge>
                        </td>

                        <td className="px-4 py-3 font-mono text-muted-foreground">
                          Aug 01 - Aug 31, 2026
                        </td>

                        <td className="px-4 py-3 font-mono font-medium">
                          ${emp.grossPay.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ${emp.netPay.toLocaleString()}
                        </td>

                        <td className="px-4 py-3">
                          <Badge variant="default" className="text-[10px] bg-emerald-600">
                            ✓ Published & Verified
                          </Badge>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPayslipEmployee(emp)}
                            className="h-7 text-xs px-2.5 cursor-pointer gap-1"
                          >
                            <FileText className="h-3.5 w-3.5 text-primary" />
                            <span>Preview Payslip</span>
                          </Button>
                        </td>
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
      {/* SECTION 4: BANK DISBURSEMENT REPORTS */}
      {/* ========================================================================= */}
      {currentTab === "disbursements" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Bank-Ready Disbursement Export Files</h2>
              <p className="text-xs text-muted-foreground">
                Generate compliant NACHA ACH direct deposit batches, SEPA wire transfer archives, and treasury summaries.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {batches.map((batch) => (
              <Card key={batch.id} className="shadow-xs flex flex-col justify-between hover:border-primary/40 transition-all">
                <CardHeader className="pb-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-xs bg-muted/60">
                      {batch.fileFormat}
                    </Badge>
                    <Badge
                      variant={batch.status === "Ready for Export" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {batch.status}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">{batch.cycle}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">{batch.bankName}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs">
                  <div className="p-3 rounded-lg bg-muted/40 border space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Batch Amount:</span>
                      <strong className="font-mono text-sm text-foreground">
                        ${batch.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Transactions:</span>
                      <strong className="text-foreground">{batch.totalEmployees} Employees</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Protocol:</span>
                      <span className="font-medium text-foreground">{batch.paymentMethod}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 pb-3 border-t">
                  <Button
                    onClick={() => exportDisbursementFile(batch)}
                    size="sm"
                    className="w-full gap-1.5 cursor-pointer text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download {batch.fileFormat}</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OFFICIAL PAYSLIP PREVIEW & PDF GENERATOR */}
      {/* ========================================================================= */}
      {selectedPayslipEmployee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-2xl shadow-2xl border-border animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                    EMS
                  </div>
                  <div>
                    <CardTitle className="text-base">Enterprise Management Suite Inc.</CardTitle>
                    <CardDescription className="text-[11px]">
                      Official Employee Earnings Statement • August 2026
                    </CardDescription>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPayslipEmployee(null)}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs">
              {/* Employee & Pay Period Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-muted/40 border">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Employee Name</span>
                  <strong className="text-foreground">{selectedPayslipEmployee.name}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Designation</span>
                  <span className="font-medium text-foreground">{selectedPayslipEmployee.role}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Employee ID</span>
                  <span className="font-mono text-foreground">{selectedPayslipEmployee.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Disbursement Account</span>
                  <span className="font-mono text-[11px] text-foreground">{selectedPayslipEmployee.bankAccountMasked}</span>
                </div>
              </div>

              {/* Earnings & Deductions Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Earnings */}
                <div className="border rounded-lg p-3 space-y-2 bg-card">
                  <div className="font-bold text-xs border-b pb-1.5 flex justify-between text-emerald-700 dark:text-emerald-300">
                    <span>EARNINGS (ALLOWANCES)</span>
                    <span>AMOUNT</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Base Basic Monthly</span>
                    <span className="font-mono">${selectedPayslipEmployee.baseSalary.toLocaleString()}</span>
                  </div>

                  {selectedPayslipEmployee.overtimePay > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Overtime Pay ({selectedPayslipEmployee.overtimeHours}h)</span>
                      <span className="font-mono">+${selectedPayslipEmployee.overtimePay.toLocaleString()}</span>
                    </div>
                  )}

                  {selectedPayslipEmployee.bonuses > 0 && (
                    <div className="flex justify-between text-blue-600 dark:text-blue-400">
                      <span>Performance & Project Bonus</span>
                      <span className="font-mono">+${selectedPayslipEmployee.bonuses.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 border-t font-bold text-foreground">
                    <span>TOTAL GROSS EARNINGS</span>
                    <span className="font-mono">${selectedPayslipEmployee.grossPay.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="border rounded-lg p-3 space-y-2 bg-card">
                  <div className="font-bold text-xs border-b pb-1.5 flex justify-between text-orange-700 dark:text-orange-300">
                    <span>DEDUCTIONS & TAXES</span>
                    <span>AMOUNT</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Federal & State Income Tax</span>
                    <span className="font-mono">-${selectedPayslipEmployee.taxDeductions.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Healthcare & 401(k) Plan</span>
                    <span className="font-mono">-${selectedPayslipEmployee.benefitsDeduction.toLocaleString()}</span>
                  </div>

                  {selectedPayslipEmployee.unpaidLeaveDays > 0 && (
                    <div className="flex justify-between text-destructive">
                      <span>Unpaid Leave ({selectedPayslipEmployee.unpaidLeaveDays} Days)</span>
                      <span className="font-mono">-${selectedPayslipEmployee.unpaidLeaveDeduction.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 border-t font-bold text-foreground">
                    <span>TOTAL DEDUCTIONS</span>
                    <span className="font-mono">
                      -${(selectedPayslipEmployee.taxDeductions + selectedPayslipEmployee.benefitsDeduction + selectedPayslipEmployee.unpaidLeaveDeduction).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Payable Highlight */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider block">
                    NET TAKE-HOME PAYABLE
                  </span>
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    Directly deposited to registered bank routing.
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ${selectedPayslipEmployee.netPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
                <Printer className="h-3.5 w-3.5" /> Print Statement
              </Button>
              <Button
                size="sm"
                onClick={() => setSelectedPayslipEmployee(null)}
                className="cursor-pointer text-xs"
              >
                Close Statement
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
