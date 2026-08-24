import React, { useState } from "react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Building2,
  Download,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  FileText,
  Trash2,
  X,
  Lock,
  Calendar,
  Users,
  HardDrive,
} from "lucide-react"

interface BillingPageProps {
  userEmail?: string
  onNavigateToUpgrade?: () => void
  onBackToDashboard?: () => void
}

interface PaymentMethod {
  id: string
  type: "card" | "ach"
  brand: string
  last4: string
  expiry?: string
  holderName: string
  isDefault: boolean
}

interface InvoiceItem {
  id: string
  number: string
  date: string
  period: string
  amount: string
  status: "paid" | "processing" | "overdue"
  paymentMethod: string
}

const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "card",
    brand: "Visa",
    last4: "4242",
    expiry: "08/29",
    holderName: "EMS Corporate Billing",
    isDefault: true,
  },
  {
    id: "pm-2",
    type: "card",
    brand: "Mastercard",
    last4: "8891",
    expiry: "11/28",
    holderName: "Finance Ops Reserve",
    isDefault: false,
  },
  {
    id: "pm-3",
    type: "ach",
    brand: "Bank of America ACH",
    last4: "0021",
    holderName: "EMS Enterprise Global Inc.",
    isDefault: false,
  },
]

const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: "inv-1",
    number: "INV-2026-008",
    date: "Aug 24, 2026",
    period: "Aug 24, 2026 - Aug 24, 2027",
    amount: "$14,400.00",
    status: "paid",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "inv-2",
    number: "INV-2026-007",
    date: "May 12, 2026",
    period: "May 12, 2026 - Aug 24, 2026",
    amount: "$480.00",
    status: "paid",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "inv-3",
    number: "INV-2025-006",
    date: "Aug 24, 2025",
    period: "Aug 24, 2025 - Aug 24, 2026",
    amount: "$11,520.00",
    status: "paid",
    paymentMethod: "Mastercard •••• 8891",
  },
  {
    id: "inv-4",
    number: "INV-2025-005",
    date: "Jan 10, 2025",
    period: "One-time Data Migration Pack",
    amount: "$500.00",
    status: "paid",
    paymentMethod: "ACH •••• 0021",
  },
]

export function BillingPage({
  userEmail = "admin@ems.company",
  onNavigateToUpgrade,
}: BillingPageProps) {
  // Seats state
  const [totalSeats, setTotalSeats] = useState(50)
  const [usedSeats] = useState(48)
  const [showAddSeatsModal, setShowAddSeatsModal] = useState(false)
  const [additionalSeatsToAdd, setAdditionalSeatsToAdd] = useState(10)
  const [isProcessingSeats, setIsProcessingSeats] = useState(false)

  // Payment Methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS)
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [newCardNumber, setNewCardNumber] = useState("")
  const [newCardHolder, setNewCardHolder] = useState("")
  const [newCardExpiry, setNewCardExpiry] = useState("")
  const [newCardCvc, setNewCardCvc] = useState("")
  const [setAsDefaultMethod, setSetAsDefaultMethod] = useState(false)

  // Invoicing Information state
  const [billingEmail, setBillingEmail] = useState("billing@ems.company")
  const [legalEntityName, setLegalEntityName] = useState("EMS Enterprise Global Inc.")
  const [taxId, setTaxId] = useState("US-EIN 94-3829104")
  const [billingAddress, setBillingAddress] = useState("100 Enterprise Way, Suite 400, New York, NY 10001")
  const [isSavingInvoicing, setIsSavingInvoicing] = useState(false)

  // Invoices state
  const [invoices] = useState<InvoiceItem[]>(INITIAL_INVOICES)
  const [invoiceFilter, setInvoiceFilter] = useState<"all" | "paid" | "processing">("all")
  const [selectedReceipt, setSelectedReceipt] = useState<InvoiceItem | null>(null)

  // Calculated seat metrics
  const seatUsagePercentage = Math.round((usedSeats / totalSeats) * 100)
  const isNearSeatLimit = seatUsagePercentage >= 90
  const pricePerSeatAnnual = 24
  const proRatedAddSeatCost = additionalSeatsToAdd * pricePerSeatAnnual * 12

  // Handlers
  const handleConfirmAddSeats = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessingSeats(true)

    setTimeout(() => {
      setIsProcessingSeats(false)
      setTotalSeats((prev) => prev + additionalSeatsToAdd)
      setShowAddSeatsModal(false)
      toast.success(`🎉 Added ${additionalSeatsToAdd} seats to your workspace!`, {
        description: `Total workspace capacity is now ${totalSeats + additionalSeatsToAdd} employee seats.`,
      })
    }, 1000)
  }

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCardNumber.trim() || !newCardHolder.trim()) {
      toast.error("Please fill in the card details.")
      return
    }

    const last4 = newCardNumber.replace(/\s+/g, "").slice(-4) || "4242"
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: "card",
      brand: "Visa",
      last4,
      expiry: newCardExpiry || "12/29",
      holderName: newCardHolder,
      isDefault: setAsDefaultMethod,
    }

    if (setAsDefaultMethod) {
      setPaymentMethods((prev) =>
        prev.map((pm) => ({ ...pm, isDefault: false })).concat(newMethod)
      )
    } else {
      setPaymentMethods((prev) => [...prev, newMethod])
    }

    setShowAddPaymentModal(false)
    setNewCardNumber("")
    setNewCardHolder("")
    setNewCardExpiry("")
    setNewCardCvc("")
    setSetAsDefaultMethod(false)

    toast.success("Payment method added successfully!")
  }

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({ ...pm, isDefault: pm.id === id }))
    )
    toast.success("Default payment method updated.")
  }

  const handleDeletePaymentMethod = (id: string) => {
    if (paymentMethods.length <= 1) {
      toast.error("You must keep at least one payment method on file.")
      return
    }
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id))
    toast.success("Payment method removed.")
  }

  const handleSaveInvoicingInfo = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingInvoicing(true)
    setTimeout(() => {
      setIsSavingInvoicing(false)
      toast.success("Invoicing & tax details saved!", {
        description: "Future invoice statements will be generated with these business credentials.",
      })
    }, 600)
  }

  const handleDownloadInvoice = (inv: InvoiceItem) => {
    toast.success(`Downloading ${inv.number}.pdf`, {
      description: `Statement for ${inv.period} (${inv.amount}) is ready.`,
    })
  }

  const filteredInvoices = invoices.filter((inv) => {
    if (invoiceFilter === "paid") return inv.status === "paid"
    if (invoiceFilter === "processing") return inv.status === "processing"
    return true
  })

  return (
    <div className="flex-1 space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Billing & Subscriptions
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your organization's subscription plan, active seats, payment methods, and invoice history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs px-3 py-1 font-semibold">
            Active Subscription
          </Badge>
        </div>
      </div>

      {/* Top Row: Current Plan Card + Seat Usage Meter */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Active Plan Overview */}
        <Card className="md:col-span-6 border-primary/30 shadow-xs bg-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Current Plan
              </span>
              <Badge className="bg-primary text-primary-foreground text-xs font-medium">
                Annual Billing
              </Badge>
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
              Professional Suite
              <Sparkles className="size-4 text-primary" />
            </CardTitle>
            <CardDescription className="text-xs">
              Includes live GPS geofencing, automated payroll computation, OKRs, and priority chat support.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-foreground">$24</span>
              <span className="text-xs text-muted-foreground">/ seat / month ($14,400.00/year for {totalSeats} seats)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/40 border border-border text-xs">
              <div>
                <p className="text-[11px] text-muted-foreground">Renewal Date</p>
                <p className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                  <Calendar className="size-3.5 text-primary" />
                  August 24, 2027
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Payment Schedule</p>
                <p className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                  <CreditCard className="size-3.5 text-emerald-500" />
                  Auto-renews annually
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/50 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToUpgrade}
              className="text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <Sparkles className="size-3.5 text-primary" />
              Change or Upgrade Plan
            </Button>
            <span className="text-[11px] text-muted-foreground">
              Account: <strong className="text-foreground">{userEmail}</strong>
            </span>
          </CardFooter>
        </Card>

        {/* Seat & Resource Usage Meter */}
        <Card className="md:col-span-6 border-border shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="size-4 text-primary" />
                Employee Seat Capacity
              </CardTitle>
              {isNearSeatLimit && (
                <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px]">
                  <AlertTriangle className="size-3 mr-1" />
                  Near Capacity ({seatUsagePercentage}%)
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              Active staff members occupying EMS enterprise licenses.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Seat Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  <strong>{usedSeats}</strong> of <strong>{totalSeats}</strong> seats utilized
                </span>
                <span className="font-bold text-foreground">{seatUsagePercentage}%</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isNearSeatLimit ? "bg-amber-500" : "bg-primary"
                  }`}
                  style={{ width: `${seatUsagePercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {totalSeats - usedSeats} license seats remaining for new hires.
              </p>
            </div>

            {/* Storage Progress */}
            <div className="p-3 rounded-xl bg-muted/30 border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <HardDrive className="size-4 text-blue-500" />
                <div>
                  <p className="font-semibold text-foreground">Document & Biometric Storage</p>
                  <p className="text-[11px] text-muted-foreground">38.4 GB of 100 GB Used (38%)</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/5">
                Optimal
              </Badge>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/50">
            <Button
              onClick={() => setShowAddSeatsModal(true)}
              className="w-full text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <Plus className="size-3.5" />
              Add More Employee Seats
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Middle Row: Payment Methods + Billing Information */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Payment Methods Manager */}
        <Card className="md:col-span-6 border-border shadow-xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CreditCard className="size-4 text-primary" />
                Payment Methods
              </CardTitle>
              <CardDescription className="text-xs">
                Cards and bank accounts used for subscription charges.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddPaymentModal(true)}
              className="text-xs gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="size-3.5" />
              Add Method
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  pm.isDefault ? "bg-primary/5 border-primary/30" : "bg-card border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${pm.isDefault ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {pm.type === "ach" ? (
                      <Building2 className="size-4" />
                    ) : (
                      <CreditCard className="size-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        {pm.brand} •••• {pm.last4}
                      </span>
                      {pm.isDefault && (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] py-0 px-1.5">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {pm.holderName} {pm.expiry ? `(Expires ${pm.expiry})` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {!pm.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefaultPayment(pm.id)}
                      className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Make Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePaymentMethod(pm.id)}
                    className="size-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Invoicing Contacts & Tax Information */}
        <Card className="md:col-span-6 border-border shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Receipt className="size-4 text-primary" />
              Invoicing Details & Tax ID
            </CardTitle>
            <CardDescription className="text-xs">
              Entity information printed on all generated invoice receipts.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSaveInvoicingInfo}>
            <CardContent className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Billing Email</Label>
                  <Input
                    type="email"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Tax ID / VAT Number</Label>
                  <Input
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="text-xs h-8"
                    placeholder="e.g. US-EIN 94-3829104"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Legal Company Name</Label>
                <Input
                  value={legalEntityName}
                  onChange={(e) => setLegalEntityName(e.target.value)}
                  className="text-xs h-8"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Registered Billing Address</Label>
                <Input
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="text-xs h-8"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="pt-2 border-t border-border/50 flex justify-end">
              <Button
                type="submit"
                disabled={isSavingInvoicing}
                size="sm"
                className="text-xs font-semibold cursor-pointer"
              >
                {isSavingInvoicing ? "Saving..." : "Save Invoicing Info"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Bottom Row: Invoices & Receipts History Table */}
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              Invoice & Statement History
            </CardTitle>
            <CardDescription className="text-xs">
              View and download past tax statements and receipts.
            </CardDescription>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setInvoiceFilter("all")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                invoiceFilter === "all" ? "bg-background text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
              }`}
            >
              All Invoices
            </button>
            <button
              type="button"
              onClick={() => setInvoiceFilter("paid")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                invoiceFilter === "paid" ? "bg-background text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
              }`}
            >
              Paid
            </button>
            <button
              type="button"
              onClick={() => setInvoiceFilter("processing")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                invoiceFilter === "processing" ? "bg-background text-foreground font-semibold shadow-2xs" : "text-muted-foreground"
              }`}
            >
              Processing
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted/40 border-y border-border text-muted-foreground">
                <tr>
                  <th className="py-3 px-4 font-semibold">Invoice Number</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Billing Period</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Payment Method</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {inv.number}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {inv.date}
                    </td>
                    <td className="py-3.5 px-4 text-foreground/90 font-medium">
                      {inv.period}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {inv.amount}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {inv.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4">
                      {inv.status === "paid" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                          Paid ✓
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 border-amber-500/30 text-[10px]">
                          Processing
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReceipt(inv)}
                          className="text-xs h-7 px-2 cursor-pointer"
                        >
                          View Receipt
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(inv)}
                          className="text-xs h-7 px-2 cursor-pointer gap-1"
                        >
                          <Download className="size-3" />
                          PDF
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL 1: Add Seats Quick Dialog */}
      {showAddSeatsModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">Add Employee Seats</h3>
                <p className="text-xs text-muted-foreground">
                  Expand your organization's license capacity immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSeatsModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAddSeats} className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-foreground">Additional Seats</p>
                    <p className="text-[11px] text-muted-foreground">
                      Current: {totalSeats} → New Total: {totalSeats + additionalSeatsToAdd} seats
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAdditionalSeatsToAdd((prev) => Math.max(5, prev - 5))}
                      className="size-8 p-0 cursor-pointer"
                    >
                      -
                    </Button>
                    <span className="font-bold text-sm w-12 text-center">
                      +{additionalSeatsToAdd}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAdditionalSeatsToAdd((prev) => prev + 5)}
                      className="size-8 p-0 cursor-pointer"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[5, 10, 25].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAdditionalSeatsToAdd(preset)}
                      className={`py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        additionalSeatsToAdd === preset
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      +{preset} Seats
                    </button>
                  ))}
                </div>
              </div>

              {/* Pro-rated calculation breakdown */}
              <div className="space-y-2 p-3 rounded-xl bg-muted/20 border border-border text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Price per seat</span>
                  <span>${pricePerSeatAnnual} / month</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Billing frequency</span>
                  <span>Annual pro-rated cycle</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>Charge to Visa •••• 4242</span>
                  <span className="text-primary">${proRatedAddSeatCost.toLocaleString()}.00</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddSeatsModal(false)}
                  className="cursor-pointer text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessingSeats}
                  className="cursor-pointer text-xs font-semibold gap-1.5"
                >
                  {isProcessingSeats ? (
                    <>
                      <div className="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Expanding Seats...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-3.5" />
                      Confirm & Expand Capacity
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Payment Method Dialog */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">Add Payment Method</h3>
                <p className="text-xs text-muted-foreground">
                  Add a secure corporate credit or debit card.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPaymentModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddPaymentMethod} className="space-y-3.5">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Cardholder Name</Label>
                <Input
                  value={newCardHolder}
                  onChange={(e) => setNewCardHolder(e.target.value)}
                  className="text-xs h-8"
                  placeholder="e.g. Acme Corp Treasury"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Card Number</Label>
                <div className="relative">
                  <Input
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                    className="text-xs font-mono h-8 pr-8"
                    placeholder="4242 •••• •••• 4242"
                    required
                  />
                  <Lock className="size-3.5 absolute right-2.5 top-2.5 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Expiry (MM/YY)</Label>
                  <Input
                    value={newCardExpiry}
                    onChange={(e) => setNewCardExpiry(e.target.value)}
                    className="text-xs font-mono h-8"
                    placeholder="08/29"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">CVC / CVV</Label>
                  <Input
                    value={newCardCvc}
                    onChange={(e) => setNewCardCvc(e.target.value)}
                    className="text-xs font-mono h-8"
                    placeholder="888"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="set-default-check"
                  type="checkbox"
                  checked={setAsDefaultMethod}
                  onChange={(e) => setSetAsDefaultMethod(e.target.checked)}
                  className="size-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <Label htmlFor="set-default-check" className="text-xs text-muted-foreground cursor-pointer">
                  Set as default payment method for recurring invoices
                </Label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="cursor-pointer text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" className="cursor-pointer text-xs font-semibold">
                  Save Card
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: View Statement Receipt */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs">
                  Official Statement Receipt
                </Badge>
                <h3 className="text-xl font-bold mt-1">{selectedReceipt.number}</h3>
                <p className="text-xs text-muted-foreground">Issued on {selectedReceipt.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Billed To:</span>
                <span className="font-semibold text-foreground text-right">{legalEntityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax ID / VAT:</span>
                <span className="font-mono text-foreground">{taxId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Period:</span>
                <span className="text-foreground">{selectedReceipt.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="text-foreground">{selectedReceipt.paymentMethod}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-base font-bold">
                <span>Total Paid:</span>
                <span className="text-primary">{selectedReceipt.amount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedReceipt(null)}
                className="cursor-pointer text-xs"
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleDownloadInvoice(selectedReceipt)
                  setSelectedReceipt(null)
                }}
                className="cursor-pointer text-xs gap-1.5"
              >
                <Download className="size-3.5" />
                Download PDF Statement
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
