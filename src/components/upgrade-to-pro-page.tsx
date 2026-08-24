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
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Building2,
  CreditCard,
  Lock,
  ArrowRight,
  X,
  FileCheck,
  Headphones,
} from "lucide-react"

interface UpgradeToProPageProps {
  onBackToDashboard?: () => void
  userEmail?: string
}

interface PlanTier {
  id: "starter" | "pro" | "enterprise"
  name: string
  tagline: string
  monthlyPrice: number
  annualPrice: number
  popular?: boolean
  current?: boolean
  features: string[]
  buttonText: string
  badgeText?: string
}

const PLANS: PlanTier[] = [
  {
    id: "starter",
    name: "Starter Basic",
    tagline: "Essential attendance and team directory for small teams.",
    monthlyPrice: 0,
    annualPrice: 0,
    current: true,
    features: [
      "Up to 15 active employees",
      "Standard Web Clock-in & Attendance",
      "Single-level Leave Approval Workflow",
      "Standard Monthly Payslip Generation",
      "Standard Company Department Directory",
      "Community & Email Support (48h response)",
    ],
    buttonText: "Current Plan",
  },
  {
    id: "pro",
    name: "Professional Suite",
    tagline: "Advanced automation, live biometrics, and payroll compliance.",
    monthlyPrice: 29,
    annualPrice: 24,
    popular: true,
    badgeText: "Most Popular",
    features: [
      "Up to 150 active employees",
      "Live GPS Geofencing & Biometric Sync",
      "Multi-tier Leave Policy Engine & Overtime Calc",
      "Automated Tax Deductions & Bank Direct Deposit",
      "Quarterly Performance Reviews & OKR Tracking",
      "Custom Export Data Builder (CSV, Excel, PDF)",
      "Priority Live Chat Support (under 15m response)",
      "Role-based Granular Permission Matrix",
    ],
    buttonText: "Upgrade to Professional",
  },
  {
    id: "enterprise",
    name: "Enterprise Global",
    tagline: "Dedicated infrastructure, unlimited scale, and custom integrations.",
    monthlyPrice: 99,
    annualPrice: 79,
    badgeText: "Maximum Scale",
    features: [
      "Unlimited active employees & Multi-branch",
      "Custom ERP, Slack, & HRIS API Connectors",
      "Automated Shift Scheduling & Swap Queue",
      "Dedicated Account Manager & HR Compliance SLA",
      "SAML 2.0 / Okta SSO & Realtime Security Audit Trail",
      "Custom SLA 99.99% Uptime Guarantee",
      "Tailored Onboarding & Employee Data Migration",
      "24/7/365 Dedicated Phone & Technical Concierge",
    ],
    buttonText: "Upgrade to Enterprise",
  },
]

export function UpgradeToProPage({ userEmail = "admin@ems.company" }: UpgradeToProPageProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual")
  const [currentPlanId, setCurrentPlanId] = useState<"starter" | "pro" | "enterprise">("starter")
  
  // Checkout Modal State
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanTier | null>(null)
  const [seatCount, setSeatCount] = useState<number>(25)
  const [couponCode, setCouponCode] = useState<string>("")
  const [couponApplied, setCouponApplied] = useState<boolean>(false)
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0)
  
  // Payment Form State
  const [cardNumber, setCardNumber] = useState<string>("4242 •••• •••• 4242")
  const [cardExpiry, setCardExpiry] = useState<string>("08/29")
  const [cardCvc, setCardCvc] = useState<string>("888")
  const [cardName, setCardName] = useState<string>("Corporate Billing")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "invoice" | "paypal">("card")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const handleOpenCheckout = (plan: PlanTier) => {
    if (plan.id === currentPlanId) return
    setSelectedPlanForCheckout(plan)
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return

    const normalized = couponCode.trim().toUpperCase()
    if (normalized === "LAUNCH20" || normalized === "PRO20") {
      setCouponApplied(true)
      setCouponDiscountPercent(20)
      toast.success("Promo code applied: 20% discount activated!")
    } else if (normalized === "VIP50") {
      setCouponApplied(true)
      setCouponDiscountPercent(50)
      toast.success("Promo code applied: VIP 50% discount activated!")
    } else {
      toast.error("Invalid discount coupon code. Try 'LAUNCH20'")
    }
  }

  const handleConfirmUpgrade = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlanForCheckout) return

    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setCurrentPlanId(selectedPlanForCheckout.id)
      const planName = selectedPlanForCheckout.name
      setSelectedPlanForCheckout(null)
      toast.success(`🎉 Congratulations! Your workspace has been upgraded to ${planName}.`, {
        description: `All ${planName} enterprise features are now instantly activated for ${userEmail}.`,
        duration: 5000,
      })
    }, 1200)
  }

  // Price calculations
  const calculatePrice = (plan: PlanTier) => {
    return billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice
  }

  const checkoutUnitPrice = selectedPlanForCheckout ? calculatePrice(selectedPlanForCheckout) : 0
  const subtotal = checkoutUnitPrice * seatCount * (billingCycle === "annual" ? 12 : 1)
  const discountAmount = couponApplied ? Math.round(subtotal * (couponDiscountPercent / 100)) : 0
  const totalAmount = Math.max(0, subtotal - discountAmount)

  return (
    <div className="flex-1 space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium tracking-wide">
          <Sparkles className="size-3.5" />
          <span>EMS Enterprise Scalability</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Empower Your Entire Workforce with <span className="text-primary">Next-Gen Pro</span>
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Upgrade your organization to unlock real-time biometrics, automated tax & payroll computation, granular roles, and comprehensive export builders.
        </p>

        {/* Current Active Plan Status Banner */}
        {currentPlanId !== "starter" && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl inline-flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              Your organization is currently on the <strong>{PLANS.find(p => p.id === currentPlanId)?.name}</strong>.
            </span>
          </div>
        )}

        {/* Billing Cycle Switcher */}
        <div className="flex items-center justify-center pt-2">
          <div className="bg-muted p-1 rounded-xl flex items-center gap-1 border border-border shadow-xs">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === "annual"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4">
        {PLANS.map((plan) => {
          const isCurrent = currentPlanId === plan.id
          const isPro = plan.id === "pro"
          const price = calculatePrice(plan)

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col justify-between transition-all duration-200 ${
                isPro
                  ? "border-primary shadow-lg ring-1 ring-primary/30 dark:bg-card/90"
                  : "border-border shadow-xs hover:border-muted-foreground/40"
              } ${isCurrent ? "bg-muted/10 border-emerald-500/40" : ""}`}
            >
              {plan.badgeText && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge
                    className={
                      isPro
                        ? "bg-primary text-primary-foreground font-semibold px-3 py-0.5 shadow-sm"
                        : "bg-secondary text-secondary-foreground font-medium px-3 py-0.5"
                    }
                  >
                    {plan.badgeText}
                  </Badge>
                </div>
              )}

              <div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                    {isCurrent && (
                      <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 bg-emerald-500/5">
                        Active Now
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs min-h-[32px] mt-1 leading-relaxed">
                    {plan.tagline}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Price display */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      ${price}
                    </span>
                    {price > 0 ? (
                      <span className="text-xs text-muted-foreground font-normal">
                        / employee / month
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground font-normal">
                        forever free
                      </span>
                    )}
                  </div>

                  {billingCycle === "annual" && price > 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      Billed annually (${price * 12}/employee/year)
                    </p>
                  )}

                  <Separator />

                  {/* Feature Checklist */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-foreground tracking-wide uppercase">
                      Plan Inclusions:
                    </p>
                    <ul className="space-y-2 text-xs">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <Check className={`size-4 mt-0.5 shrink-0 ${isPro ? "text-primary font-bold" : "text-emerald-500"}`} />
                          <span className="leading-snug text-foreground/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-4 border-t border-border/50">
                <Button
                  onClick={() => handleOpenCheckout(plan)}
                  disabled={isCurrent}
                  variant={isPro ? "default" : isCurrent ? "outline" : "secondary"}
                  className="w-full font-medium cursor-pointer"
                >
                  {isCurrent ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="size-4 text-emerald-500" />
                      Current Plan
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      {plan.buttonText}
                      <ArrowRight className="size-3.5" />
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Trust & Enterprise Assurance Badges */}
      <div className="rounded-2xl border border-border bg-muted/30 p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="p-2.5 rounded-xl bg-background border border-border shadow-2xs">
            <Lock className="size-5 text-primary" />
          </div>
          <div>
            <h4 className="text-xs font-bold">Bank-Grade 256-Bit</h4>
            <p className="text-[11px] text-muted-foreground">End-to-end data encryption</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="p-2.5 rounded-xl bg-background border border-border shadow-2xs">
            <Zap className="size-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold">99.99% Guaranteed SLA</h4>
            <p className="text-[11px] text-muted-foreground">High availability cloud</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="p-2.5 rounded-xl bg-background border border-border shadow-2xs">
            <FileCheck className="size-5 text-emerald-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold">SOC2 & GDPR Ready</h4>
            <p className="text-[11px] text-muted-foreground">Compliant audit logging</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="p-2.5 rounded-xl bg-background border border-border shadow-2xs">
            <Headphones className="size-5 text-blue-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold">24/7 Dedicated Support</h4>
            <p className="text-[11px] text-muted-foreground">Instant engineer assistance</p>
          </div>
        </div>
      </div>

      {/* Interactive Checkout Modal */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    Checkout & Activation
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    EMS-{selectedPlanForCheckout.id.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
                  Upgrade to {selectedPlanForCheckout.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Complete your billing details to upgrade your company workspace.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanForCheckout(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <Separator />

            {/* Plan Configuration: Seat Selector */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40 p-4 rounded-xl border border-border">
                <div>
                  <Label className="text-xs font-bold text-foreground">
                    Number of Employee Seats
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Estimated active staff members in your EMS workspace.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSeatCount((prev) => Math.max(5, prev - 5))}
                    className="size-8 p-0 cursor-pointer"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={seatCount}
                    onChange={(e) => setSeatCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center font-bold text-sm h-8"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSeatCount((prev) => prev + 5)}
                    className="size-8 p-0 cursor-pointer"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Promo Code Application */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <Input
                  placeholder="Coupon code (e.g. LAUNCH20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="text-xs uppercase"
                  disabled={couponApplied}
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  disabled={couponApplied || !couponCode.trim()}
                  className="cursor-pointer shrink-0 text-xs"
                >
                  {couponApplied ? "Applied ✓" : "Apply Code"}
                </Button>
              </form>

              {couponApplied && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                  <Check className="size-3.5" />
                  <span>Promo code {couponCode.toUpperCase()} applied ({couponDiscountPercent}% OFF total)</span>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-foreground">
                Payment Method
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CreditCard className="size-4 mb-1" />
                  Credit Card
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("invoice")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    paymentMethod === "invoice"
                      ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Building2 className="size-4 mb-1" />
                  Corporate ACH
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    paymentMethod === "paypal"
                      ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className="size-4 mb-1" />
                  PayPal Express
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === "card" && (
                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Cardholder Name</Label>
                    <Input
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="text-xs h-8"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Card Number</Label>
                    <div className="relative">
                      <Input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="text-xs font-mono h-8 pr-8"
                        placeholder="•••• •••• •••• 4242"
                      />
                      <CreditCard className="size-3.5 absolute right-2.5 top-2.5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Expiry (MM/YY)</Label>
                      <Input
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="text-xs font-mono h-8"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">CVC / CVV</Label>
                      <Input
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="text-xs font-mono h-8"
                        placeholder="CVC"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Breakdown */}
            <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  {selectedPlanForCheckout.name} ({seatCount} seats × ${checkoutUnitPrice}/mo)
                </span>
                <span className="font-medium text-foreground">
                  ${subtotal} {billingCycle === "annual" ? "/ yr" : "/ mo"}
                </span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Promo Discount ({couponDiscountPercent}%)</span>
                  <span>-${discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Taxes & Compliance</span>
                <span className="text-foreground">$0.00 (Included)</span>
              </div>

              <Separator className="my-1.5" />

              <div className="flex justify-between text-sm font-bold text-foreground">
                <span>Total Due Today</span>
                <span className="text-primary">${totalAmount}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedPlanForCheckout(null)}
                className="cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmUpgrade}
                disabled={isProcessing}
                className="cursor-pointer gap-2 font-semibold text-xs"
              >
                {isProcessing ? (
                  <>
                    <div className="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="size-3.5" />
                    Pay ${totalAmount} & Activate {selectedPlanForCheckout.name}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
