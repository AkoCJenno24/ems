import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useEMSStore } from "@/store/use-ems-store"
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
  FileText,
  Download,
  DollarSign,
  CreditCard,
  Plus,
  X,
} from "lucide-react"
import { toast } from "sonner"

export function EmployeePayslipsPage() {
  const [searchParams] = useSearchParams()
  const { currentUser, expenseClaims, submitExpenseClaim } = useEMSStore()

  const [activeTab, setActiveTab] = useState<"payslip" | "claims">(
    searchParams.get("tab") === "claims" ? "claims" : "payslip"
  )

  const [selectedMonth, setSelectedMonth] = useState("August 2026")
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [claimForm, setClaimForm] = useState({
    title: "",
    category: "Software & Equipment" as const,
    amount: "",
    notes: "",
  })

  // Payslip calculations for L5 Senior Engineer
  const earnings = [
    { label: "Basic Salary", amount: 7500.0 },
    { label: "House Rent Allowance (HRA)", amount: 2500.0 },
    { label: "Special & Internet Allowance", amount: 650.0 },
    { label: "Quarterly Performance Bonus", amount: 1200.0 },
  ]

  const deductions = [
    { label: "Federal Income Tax (W-4)", amount: 1650.0 },
    { label: "State Withholding Tax", amount: 580.0 },
    { label: "401(k) Retirement Match (6%)", amount: 600.0 },
    { label: "Comprehensive Medical & Dental", amount: 220.0 },
  ]

  const grossEarnings = earnings.reduce((acc, curr) => acc + curr.amount, 0)
  const totalDeductions = deductions.reduce((acc, curr) => acc + curr.amount, 0)
  const netTakeHome = grossEarnings - totalDeductions

  const handleDownloadPayslip = () => {
    toast.success("Generating Official Payslip PDF", {
      description: `Payslip_${currentUser.name.replace(/\s+/g, "_")}_${selectedMonth.replace(/\s+/g, "_")}.pdf downloaded.`,
    })
  }

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAmount = parseFloat(claimForm.amount)
    if (!claimForm.title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid title and claim amount.")
      return
    }

    submitExpenseClaim({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      title: claimForm.title,
      category: claimForm.category,
      amount: parsedAmount,
      currency: "USD",
      receiptName: "receipt_uploaded.pdf",
      notes: claimForm.notes,
    })

    toast.success("Expense Claim Filed", {
      description: `$${parsedAmount.toFixed(2)} claim submitted to Finance for reimbursement.`,
    })
    setShowClaimModal(false)
    setClaimForm({
      title: "",
      category: "Software & Equipment",
      amount: "",
      notes: "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            My Payslips & Expense Claims
          </h1>
          <p className="text-sm text-muted-foreground">
            Access monthly digital pay statements, tax breakdowns, and file reimbursements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border/80 p-1 bg-muted/40 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("payslip")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === "payslip"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Payslips
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("claims")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === "claims"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Expense Claims ({expenseClaims.length})
            </button>
          </div>
          {activeTab === "claims" && (
            <Button
              onClick={() => setShowClaimModal(true)}
              className="gap-1.5 font-semibold text-xs shadow-xs cursor-pointer"
            >
              <Plus className="size-3.5" />
              File Claim
            </Button>
          )}
        </div>
      </div>

      {activeTab === "payslip" ? (
        <div className="space-y-6">
          {/* Top Metric Highlights */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Net Take-Home Pay"
              value={`$${netTakeHome.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              description={`Disbursed for ${selectedMonth}`}
              trend={{ value: "Paid on Aug 25", isPositive: true }}
              icon={<DollarSign className="size-5" />}
              iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              title="Gross Earnings"
              value={`$${grossEarnings.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              description="Basic + Allowances + Bonus"
              icon={<CreditCard className="size-5" />}
              iconBgColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            />
            <StatCard
              title="Total Deductions & Tax"
              value={`$${totalDeductions.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              description="Taxes & 401(k) retirement"
              icon={<FileText className="size-5" />}
              iconBgColor="bg-rose-500/10 text-rose-600 dark:text-rose-400"
            />
          </div>

          {/* Payslip Digital Ledger Card */}
          <Card className="border-border/80">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold">
                    Official Salary Statement
                  </CardTitle>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10 text-[10px]">
                    Direct Deposit Verified
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Pay Period: {selectedMonth} • Disbursed via Chase Direct ACH
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs focus-visible:outline-none"
                >
                  <option value="August 2026">August 2026</option>
                  <option value="July 2026">July 2026</option>
                  <option value="June 2026">June 2026</option>
                  <option value="May 2026">May 2026</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPayslip}
                  className="gap-1.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/5 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  PDF Payslip
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Employee & Bank Info Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/20 p-4 border border-border/70 text-xs sm:grid-cols-4">
                <div>
                  <span className="text-muted-foreground">Employee Name</span>
                  <div className="font-semibold text-foreground mt-0.5">{currentUser.name}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Employee ID / Band</span>
                  <div className="font-semibold text-foreground mt-0.5">{currentUser.id} ({currentUser.salaryBand})</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Designation</span>
                  <div className="font-semibold text-foreground mt-0.5">{currentUser.title}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Bank Account</span>
                  <div className="font-semibold text-foreground mt-0.5">•••• •••• 9842 (Chase)</div>
                </div>
              </div>

              {/* Itemized Table Breakdown */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Earnings Column */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Earnings Breakdown
                  </h4>
                  <div className="divide-y divide-border/60 rounded-xl border border-border/70 overflow-hidden">
                    {earnings.map((e, idx) => (
                      <div key={idx} className="flex justify-between p-3 text-xs">
                        <span className="text-foreground">{e.label}</span>
                        <span className="font-semibold font-mono text-foreground">
                          ${e.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between p-3 bg-muted/40 font-bold text-xs">
                      <span>Total Gross Earnings</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">
                        ${grossEarnings.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deductions Column */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Deductions & Taxes
                  </h4>
                  <div className="divide-y divide-border/60 rounded-xl border border-border/70 overflow-hidden">
                    {deductions.map((d, idx) => (
                      <div key={idx} className="flex justify-between p-3 text-xs">
                        <span className="text-foreground">{d.label}</span>
                        <span className="font-semibold font-mono text-foreground">
                          -${d.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between p-3 bg-muted/40 font-bold text-xs">
                      <span>Total Deductions</span>
                      <span className="font-mono text-rose-600 dark:text-rose-400">
                        -${totalDeductions.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay Highlight Bar */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-primary/10 border border-primary/20 p-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-primary">
                    Net Disbursed Take-Home Pay
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Directly deposited into your registered checking account.
                  </p>
                </div>
                <div className="font-mono text-2xl font-bold text-primary">
                  ${netTakeHome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Expense Claims Tab */
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">
                  My Reimbursement Claims
                </CardTitle>
                <CardDescription className="text-xs">
                  Track business expenses, software subscriptions, and meal allowances
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowClaimModal(true)}
                size="sm"
                className="gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <Plus className="size-3.5" />
                Submit New Claim
              </Button>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/60">
                {expenseClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="flex flex-col gap-2.5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {claim.title}
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            claim.status === "Approved" || claim.status === "Reimbursed"
                              ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-[10px]"
                              : "border-amber-500/30 text-amber-600 bg-amber-500/10 text-[10px]"
                          }
                        >
                          {claim.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{claim.category}</span>
                        <span>•</span>
                        <span>Filed: {claim.date}</span>
                        {claim.notes && (
                          <>
                            <span>•</span>
                            <span className="italic">"{claim.notes}"</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="font-mono text-base font-bold text-foreground">
                      ${claim.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submit Expense Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <Card className="w-full max-w-md shadow-xl border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">
                  File Expense Claim
                </CardTitle>
                <CardDescription className="text-xs">
                  Submit a receipt for corporate expense reimbursement
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowClaimModal(false)}
                className="size-7 cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <form onSubmit={handleClaimSubmit}>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="claim-title" className="text-xs">Expense Title</Label>
                  <Input
                    id="claim-title"
                    placeholder="e.g. AWS Cloud Certification Voucher"
                    value={claimForm.title}
                    onChange={(e) =>
                      setClaimForm({ ...claimForm, title: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="claim-cat" className="text-xs">Category</Label>
                    <select
                      id="claim-cat"
                      value={claimForm.category}
                      onChange={(e) =>
                        setClaimForm({
                          ...claimForm,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none"
                    >
                      <option value="Software & Equipment">Software & Equipment</option>
                      <option value="Learning & Training">Learning & Training</option>
                      <option value="Meals & Entertainment">Meals & Entertainment</option>
                      <option value="Travel & Mileage">Travel & Mileage</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="claim-amount" className="text-xs">Amount ($ USD)</Label>
                    <Input
                      id="claim-amount"
                      type="number"
                      step="0.01"
                      placeholder="150.00"
                      value={claimForm.amount}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, amount: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="claim-notes" className="text-xs">Justification Notes</Label>
                  <textarea
                    id="claim-notes"
                    rows={3}
                    value={claimForm.notes}
                    onChange={(e) =>
                      setClaimForm({ ...claimForm, notes: e.target.value })
                    }
                    placeholder="Provide details or business justification..."
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-none"
                  />
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-2 border-t p-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClaimModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="font-semibold cursor-pointer">
                  Submit Claim
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
