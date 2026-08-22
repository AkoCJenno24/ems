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
  Search,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  ExternalLink,
  ShieldCheck,
  Zap,
  BookOpen,
  Headphones,
  Paperclip,
  X,
  ChevronRight,
  Activity,
  ThumbsUp,
} from "lucide-react"
import {
  IconHeadset,
  IconTicket,
  IconBook,
  IconServer2,
  IconBrandSlack,
} from "@tabler/icons-react"

export type SupportTab = "tickets" | "submit" | "knowledge" | "status"

export interface SupportTicketItem {
  id: string
  subject: string
  category: "Technical Issue" | "Billing & Subscription" | "Feature Request" | "Security & SSO" | "Payroll & Compliance" | "General Inquiry"
  priority: "Low" | "Medium" | "High" | "Critical / Urgent"
  status: "Open" | "In Progress" | "Waiting on Customer" | "Resolved"
  createdAt: string
  updatedAt: string
  assignee: {
    name: string
    role: string
    avatar: string
  }
  requesterEmail: string
  messagesCount: number
  description: string
  affectedModule: string
  resolutionNotes?: string
  conversationHistory: {
    id: string
    sender: string
    senderRole: "Customer" | "Support Engineer" | "System"
    avatar?: string
    timestamp: string
    message: string
  }[]
}

export interface KnowledgeArticle {
  id: string
  title: string
  category: string
  readTime: string
  views: number
  helpfulCount: number
  summary: string
  content: string
}

const initialTickets: SupportTicketItem[] = [
  {
    id: "TKT-8921",
    subject: "NACHA Direct Deposit ACH Batch Export Formatting Issue",
    category: "Payroll & Compliance",
    priority: "Critical / Urgent",
    status: "In Progress",
    createdAt: "Aug 22, 2026, 09:14 AM",
    updatedAt: "15 mins ago",
    assignee: {
      name: "Marcus Vance",
      role: "Senior Fintech Support",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&dpr=2&q=80",
    },
    requesterEmail: "admin@ems.company",
    messagesCount: 3,
    affectedModule: "Payroll & Disbursements",
    description: "When downloading the August 2026 ACH payment file, routing number headers on bank batch #ACH-8849 need custom 940 padding for Chase Bank gateway integration.",
    conversationHistory: [
      {
        id: "msg-1",
        sender: "Enterprise Admin",
        senderRole: "Customer",
        timestamp: "Aug 22, 09:14 AM",
        message: "We generated the monthly payroll direct deposit file, but our bank processing portal flagged line 1 padding format. Need validation on NACHA standard compliance.",
      },
      {
        id: "msg-2",
        sender: "System",
        senderRole: "System",
        timestamp: "Aug 22, 09:15 AM",
        message: "Automated Ticket Dispatch: Priority escalated to Tier-3 Fintech Operations under Enterprise SLA guarantee.",
      },
      {
        id: "msg-3",
        sender: "Marcus Vance",
        senderRole: "Support Engineer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&dpr=2&q=80",
        timestamp: "Aug 22, 09:28 AM",
        message: "Hello! I am reviewing the ACH batch export script. We have applied custom padded header options for Chase and Wells Fargo gateways in v8.2. You can download the refreshed batch directly.",
      },
    ],
  },
  {
    id: "TKT-8840",
    subject: "SAML 2.0 Okta Single Sign-On Certificate Rotation",
    category: "Security & SSO",
    priority: "High",
    status: "Waiting on Customer",
    createdAt: "Aug 21, 2026, 02:40 PM",
    updatedAt: "2 hours ago",
    assignee: {
      name: "Sophia Martinez",
      role: "Identity & Security Specialist",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&dpr=2&q=80",
    },
    requesterEmail: "admin@ems.company",
    messagesCount: 4,
    affectedModule: "Settings & Security",
    description: "Our corporate Okta identity provider x509 encryption certificate expires next week. Need assistance verifying zero-downtime certificate rotation in tenant settings.",
    conversationHistory: [
      {
        id: "msg-1",
        sender: "Enterprise Admin",
        senderRole: "Customer",
        timestamp: "Aug 21, 02:40 PM",
        message: "Need to upload our newly generated Okta IdP certificate without disrupting 248 active SSO employee sessions.",
      },
      {
        id: "msg-2",
        sender: "Sophia Martinez",
        senderRole: "Support Engineer",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&dpr=2&q=80",
        timestamp: "Aug 21, 03:10 PM",
        message: "Hi! You can provide both primary and secondary x509 certs simultaneously in Settings > Security > SSO. Once uploaded, Okta can seamlessly roll over without user logout.",
      },
    ],
  },
  {
    id: "TKT-8795",
    subject: "Add Custom Columns to Department Salary Band Exports",
    category: "Feature Request",
    priority: "Low",
    status: "Open",
    createdAt: "Aug 19, 2026, 11:20 AM",
    updatedAt: "1 day ago",
    assignee: {
      name: "Alex Morgan",
      role: "Product Operations Lead",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
    },
    requesterEmail: "admin@ems.company",
    messagesCount: 2,
    affectedModule: "Departments & Pay Bands",
    description: "Requesting ability to include regional cost-of-living multiplier columns when generating custom organization CSV benchmarks.",
    conversationHistory: [
      {
        id: "msg-1",
        sender: "Enterprise Admin",
        senderRole: "Customer",
        timestamp: "Aug 19, 11:20 AM",
        message: "Would love to see regional compensation tiers (US-West, EU-Central, APAC) broken out automatically in the salary export view.",
      },
    ],
  },
  {
    id: "TKT-8610",
    subject: "Annual Sick Leave Carry-Over Cap Policy Verification",
    category: "General Inquiry",
    priority: "Medium",
    status: "Resolved",
    createdAt: "Aug 14, 2026, 04:15 PM",
    updatedAt: "Aug 15, 2026",
    assignee: {
      name: "Elena Rostova",
      role: "HR Policy Advisory",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&dpr=2&q=80",
    },
    requesterEmail: "admin@ems.company",
    messagesCount: 3,
    affectedModule: "Leave Management",
    description: "Clarification on whether rolling carry-over caps expire automatically on Dec 31 or if a custom fiscal cut-off date can be scheduled.",
    resolutionNotes: "Resolved: Guided admin through Leave Management > Policy Engine > Carry-over Limit expiry triggers.",
    conversationHistory: [
      {
        id: "msg-1",
        sender: "Enterprise Admin",
        senderRole: "Customer",
        timestamp: "Aug 14, 04:15 PM",
        message: "Can we set carry-over leave expiry to March 31 instead of December 31 for our fiscal calendar?",
      },
      {
        id: "msg-2",
        sender: "Elena Rostova",
        senderRole: "Support Engineer",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&dpr=2&q=80",
        timestamp: "Aug 14, 05:00 PM",
        message: "Yes! In Leave Management > Policy Engine > Sick Leave, select 'Fiscal Year Cut-off' and input March 31. Accruals will persist through Q1.",
      },
    ],
  },
]

const initialArticles: KnowledgeArticle[] = [
  {
    id: "KB-101",
    title: "1-Click Payroll Wizard & NACHA Bank Export Setup",
    category: "Payroll & Disbursements",
    readTime: "4 min read",
    views: 1420,
    helpfulCount: 98,
    summary: "Step-by-step guide to calculating net pay with statutory deductions and exporting bank-ready direct deposit files.",
    content: "The Enterprise Payroll Wizard automatically aggregates approved attendance records, overtime hours (1.5x/2.0x multipliers), and unpaid leave deductions. Before running the calculation, ensure your salary structure has active tax and benefit rules configured.",
  },
  {
    id: "KB-102",
    title: "Configuring SAML 2.0 & Enforcing Mandatory 2FA for Tenants",
    category: "Security & Access",
    readTime: "6 min read",
    views: 980,
    helpfulCount: 84,
    summary: "Integrate Okta, Microsoft Entra ID (Azure AD), or Google Workspace with automated role mapping and hardware token security.",
    content: "To configure enterprise SSO, navigate to Settings > System Preferences > Single Sign-On. Enter your Identity Provider (IdP) Entity ID, SSO Target URL, and paste the x509 public key certificate. You can also enforce 2FA hardware keys for all administrative roles.",
  },
  {
    id: "KB-103",
    title: "Setting Up Shift Rosters, Grace Periods & Holiday Calendars",
    category: "Attendance & Schedules",
    readTime: "5 min read",
    views: 875,
    helpfulCount: 76,
    summary: "Create multiple operational shifts (Day, Evening, Night Watch) and automate late-clock-in grace threshold calculations.",
    content: "Under Attendance > Shift & Schedule Builder, you can define custom punch windows, break intervals, and allowable grace periods (e.g. 15 minutes). Punches occurring after the grace period are automatically flagged for manager review.",
  },
  {
    id: "KB-104",
    title: "Managing Leave Accrual Policies & Department Blackout Dates",
    category: "Leave Management",
    readTime: "3 min read",
    views: 640,
    helpfulCount: 52,
    summary: "Prevent staffing shortages during product releases and peak business cycles with strict blackout periods.",
    content: "The Policy Engine allows enterprise admins to configure monthly accrual multipliers, paid versus unpaid leave types, maximum carry-over limits, and department-specific blackout windows.",
  },
  {
    id: "KB-105",
    title: "Assigning Granular Sub-Roles & Access Matrix Governance",
    category: "User Roles & RBAC",
    readTime: "4 min read",
    views: 520,
    helpfulCount: 45,
    summary: "Empower team leads with specific sub-privileges like Leave Approver, Overtime Reviewer, or Disbursement Signer.",
    content: "In Settings > Roles & Permissions, select any primary role (Admin, HR Manager, Department Head) and attach dedicated sub-privileges without granting full root system administrative permissions.",
  },
]

interface SupportPageProps {
  initialSubTab?: SupportTab
  onTabChange?: (tab: SupportTab) => void
  userEmail?: string
}

export function SupportPage({
  initialSubTab = "tickets",
  onTabChange,
  userEmail = "admin@ems.company",
}: SupportPageProps) {
  const [currentTab, setCurrentTab] = useState<SupportTab>(initialSubTab)

  // Ticket States
  const [tickets, setTickets] = useState<SupportTicketItem[]>(initialTickets)
  const [ticketSearch, setTicketSearch] = useState("")
  const [ticketStatusFilter, setTicketStatusFilter] = useState("All")
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState("All")
  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState<SupportTicketItem | null>(null)
  const [newReplyMessage, setNewReplyMessage] = useState("")

  // Submit Ticket Form States
  const [formSubject, setFormSubject] = useState("")
  const [formCategory, setFormCategory] = useState<SupportTicketItem["category"]>("Technical Issue")
  const [formPriority, setFormPriority] = useState<SupportTicketItem["priority"]>("Medium")
  const [formModule, setFormModule] = useState("Dashboard & General")
  const [formDescription, setFormDescription] = useState("")
  const [formAttachments, setFormAttachments] = useState<string[]>([])
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false)

  // Knowledge Base States
  const [kbSearch, setKbSearch] = useState("")
  const [kbCategoryFilter, setKbCategoryFilter] = useState("All")
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null)
  const [helpfulArticles, setHelpfulArticles] = useState<string[]>([])

  // Sync internal sub-tab state when parent initialSubTab changes
  React.useEffect(() => {
    if (initialSubTab) {
      setCurrentTab(initialSubTab)
    }
  }, [initialSubTab])

  const handleTabSelect = (tab: SupportTab) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = ticketSearch.toLowerCase()
      const matchesSearch =
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.affectedModule.toLowerCase().includes(q)

      const matchesStatus = ticketStatusFilter === "All" || t.status === ticketStatusFilter
      const matchesPriority = ticketPriorityFilter === "All" || t.priority === ticketPriorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tickets, ticketSearch, ticketStatusFilter, ticketPriorityFilter])

  // Filtered Knowledge Articles
  const filteredArticles = useMemo(() => {
    return initialArticles.filter((art) => {
      const q = kbSearch.toLowerCase()
      const matchesSearch =
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.content.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q)
      const matchesCat = kbCategoryFilter === "All" || art.category === kbCategoryFilter
      return matchesSearch && matchesCat
    })
  }, [kbSearch, kbCategoryFilter])

  // KPI Metrics
  const totalOpenTickets = tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length
  const resolvedTicketsCount = tickets.filter((t) => t.status === "Resolved").length
  const criticalTicketsCount = tickets.filter((t) => t.priority === "Critical / Urgent" && t.status !== "Resolved").length

  // Handlers
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formSubject.trim() || !formDescription.trim()) {
      toast.error("Required Fields Missing", {
        description: "Please provide a ticket subject and problem description.",
      })
      return
    }

    setIsSubmittingTicket(true)

    setTimeout(() => {
      const newTicketId = `TKT-${Math.floor(8900 + Math.random() * 1000)}`
      const newTicket: SupportTicketItem = {
        id: newTicketId,
        subject: formSubject.trim(),
        category: formCategory,
        priority: formPriority,
        status: "Open",
        createdAt: "Just now",
        updatedAt: "Just now",
        assignee: {
          name: "SaaS Concierge Pool",
          role: "Enterprise Support Queue",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
        },
        requesterEmail: userEmail,
        messagesCount: 1,
        affectedModule: formModule,
        description: formDescription.trim(),
        conversationHistory: [
          {
            id: `msg-${Date.now()}`,
            sender: "Enterprise Admin",
            senderRole: "Customer",
            timestamp: "Just now",
            message: formDescription.trim(),
          },
        ],
      }

      setTickets([newTicket, ...tickets])
      setIsSubmittingTicket(false)
      toast.success("Support Ticket Created", {
        description: `Ticket ${newTicketId} dispatched. Enterprise SLA response within 1 hour.`,
      })

      // Reset form and jump to tickets list
      setFormSubject("")
      setFormDescription("")
      setFormAttachments([])
      handleTabSelect("tickets")
    }, 900)
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicketForDetail || !newReplyMessage.trim()) return

    const newReply = {
      id: `msg-${Date.now()}`,
      sender: "Enterprise Admin",
      senderRole: "Customer" as const,
      timestamp: "Just now",
      message: newReplyMessage.trim(),
    }

    const updated = {
      ...selectedTicketForDetail,
      updatedAt: "Just now",
      messagesCount: selectedTicketForDetail.messagesCount + 1,
      conversationHistory: [...selectedTicketForDetail.conversationHistory, newReply],
    }

    setTickets((prev) =>
      prev.map((t) => (t.id === selectedTicketForDetail.id ? updated : t))
    )
    setSelectedTicketForDetail(updated)
    setNewReplyMessage("")
    toast.success("Reply Sent", {
      description: "Support engineers notified of your response.",
    })
  }

  const handleToggleHelpful = (articleId: string) => {
    if (helpfulArticles.includes(articleId)) {
      setHelpfulArticles(helpfulArticles.filter((id) => id !== articleId))
    } else {
      setHelpfulArticles([...helpfulArticles, articleId])
      toast.success("Feedback Recorded", {
        description: "Thank you for rating this documentation!",
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* 1. Page Header & SaaS Concierge Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help & Enterprise SaaS Support</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Submit technical inquiries, track active SLA tickets, explore self-service documentation, and verify platform system status.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="outline" className="gap-1.5 py-1 px-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>24/7 Enterprise Tier-1 SLA</span>
          </Badge>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
        <button
          onClick={() => handleTabSelect("tickets")}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer truncate ${
            currentTab === "tickets"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconTicket className="size-4 text-primary shrink-0" />
          <span className="truncate">1. Tickets & Inbox</span>
          {totalOpenTickets > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-primary/15 text-primary text-[10px] font-bold shrink-0">
              {totalOpenTickets}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabSelect("submit")}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer truncate ${
            currentTab === "submit"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Plus className="size-4 text-emerald-500 shrink-0" />
          <span className="truncate">2. Submit Request</span>
        </button>

        <button
          onClick={() => handleTabSelect("knowledge")}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer truncate ${
            currentTab === "knowledge"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconBook className="size-4 text-blue-500 shrink-0" />
          <span className="truncate">3. Knowledge Base</span>
        </button>

        <button
          onClick={() => handleTabSelect("status")}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer truncate ${
            currentTab === "status"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconServer2 className="size-4 text-purple-500 shrink-0" />
          <span className="truncate">4. Service Health</span>
        </button>
      </div>

      {/* 3. SUB TAB 1: SUPPORT TICKETS & INBOX */}
      {currentTab === "tickets" && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Active Open Tickets
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <IconHeadset className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOpenTickets}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span>Avg. response: <strong>18 mins</strong></span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Critical Escalations
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <AlertCircle className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{criticalTicketsCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  1-hour engineer assignment
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Resolved Tickets
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolvedTicketsCount}</div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  99.4% Customer CSAT rating
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs bg-linear-to-br from-primary/5 via-background to-background">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Support Plan
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-base font-bold">Enterprise Tier-1</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Direct Slack & Phone Channel
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filter & Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/20 p-3 rounded-xl border border-border">
            <div className="flex flex-1 items-center gap-2 min-w-0">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets by ID, subject, module..."
                  className="pl-9 bg-background h-9 text-xs w-full"
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 shrink-0 text-xs">
                <span className="text-muted-foreground">Status:</span>
                <select
                  aria-label="Filter tickets by status"
                  className="h-9 rounded-md border border-input bg-background px-2 py-1 text-xs font-medium"
                  value={ticketStatusFilter}
                  onChange={(e) => setTicketStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Waiting on Customer">Waiting on Customer</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 text-xs">
                <span className="text-muted-foreground">Priority:</span>
                <select
                  aria-label="Filter tickets by priority"
                  className="h-9 rounded-md border border-input bg-background px-2 py-1 text-xs font-medium"
                  value={ticketPriorityFilter}
                  onChange={(e) => setTicketPriorityFilter(e.target.value)}
                >
                  <option value="All">All Priorities</option>
                  <option value="Critical / Urgent">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <Button
                size="sm"
                onClick={() => handleTabSelect("submit")}
                className="gap-1.5 h-9 text-xs cursor-pointer ml-auto sm:ml-0 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Ticket</span>
              </Button>
            </div>
          </div>

          {/* Tickets Table */}
          <Card className="border-border shadow-xs overflow-hidden">
            <CardHeader className="py-4 px-6 border-b bg-muted/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Support Request Inbox</CardTitle>
                  <CardDescription className="text-xs">
                    Showing {filteredTickets.length} support cases for {userEmail}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border">
                    <tr>
                      <th className="py-3 px-3 sm:px-4 w-24">Ticket ID</th>
                      <th className="py-3 px-3 sm:px-4">Subject & Affected Area</th>
                      <th className="py-3 px-3 sm:px-4 hidden md:table-cell">Category</th>
                      <th className="py-3 px-3 sm:px-4">Priority</th>
                      <th className="py-3 px-3 sm:px-4">Status</th>
                      <th className="py-3 px-3 sm:px-4 hidden lg:table-cell">Assigned Engineer</th>
                      <th className="py-3 px-3 sm:px-4 hidden sm:table-cell">Last Activity</th>
                      <th className="py-3 px-3 sm:px-4 text-right w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredTickets.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-10 text-muted-foreground">
                          No support tickets match your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredTickets.map((t) => {
                        const isCritical = t.priority === "Critical / Urgent"
                        const isHigh = t.priority === "High"

                        return (
                          <tr
                            key={t.id}
                            className="hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={() => setSelectedTicketForDetail(t)}
                          >
                            <td className="py-3.5 px-3 sm:px-4 font-mono font-semibold text-primary">
                              {t.id}
                            </td>
                            <td className="py-3.5 px-3 sm:px-4">
                              <div className="font-semibold text-foreground line-clamp-1">{t.subject}</div>
                              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <span className="px-1.5 py-0.2 rounded bg-muted font-normal">{t.affectedModule}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="size-3 text-muted-foreground" />
                                  {t.messagesCount}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 sm:px-4 hidden md:table-cell">
                              <Badge variant="outline" className="font-normal text-[11px]">
                                {t.category}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-3 sm:px-4">
                              <Badge
                                variant={
                                  isCritical
                                    ? "destructive"
                                    : isHigh
                                      ? "default"
                                      : "secondary"
                                }
                                className={`text-[11px] font-semibold ${
                                  isHigh && !isCritical ? "bg-amber-500 text-white" : ""
                                }`}
                              >
                                {isCritical ? "Critical" : t.priority}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-3 sm:px-4">
                              <Badge
                                variant="outline"
                                className={`text-[11px] font-medium ${
                                  t.status === "Open"
                                    ? "border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5"
                                    : t.status === "In Progress"
                                      ? "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5"
                                      : t.status === "Resolved"
                                        ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                                        : "border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/5"
                                }`}
                              >
                                {t.status}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-3 sm:px-4 hidden lg:table-cell">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={t.assignee.avatar} />
                                  <AvatarFallback className="text-[10px]">
                                    {t.assignee.name.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-foreground">{t.assignee.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 sm:px-4 text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                              {t.updatedAt}
                            </td>
                            <td className="py-3.5 px-3 sm:px-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedTicketForDetail(t)
                                }}
                                className="h-7 text-xs px-2.5 cursor-pointer"
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 4. SUB TAB 2: SUBMIT SUPPORT REQUEST FORM */}
      {currentTab === "submit" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border shadow-xs">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle className="text-base font-semibold">Submit a SaaS Support Request</CardTitle>
              <CardDescription className="text-xs">
                Our global engineer team provides guaranteed resolution times based on SLA priority.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">
                    Subject / Summary <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="E.g. Unable to generate payroll CSV for August cycle"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">
                      Category <span className="text-destructive">*</span>
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as SupportTicketItem["category"])}
                    >
                      <option value="Technical Issue">Technical Issue / Bug</option>
                      <option value="Payroll & Compliance">Payroll & Statutory Compliance</option>
                      <option value="Security & SSO">Security, 2FA & SSO Authentication</option>
                      <option value="Billing & Subscription">Billing, Invoices & Plan Upgrades</option>
                      <option value="Feature Request">Feature Suggestion / Enhancement</option>
                      <option value="General Inquiry">General Usage Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">
                      Urgency / Priority <span className="text-destructive">*</span>
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium"
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as SupportTicketItem["priority"])}
                    >
                      <option value="Low">Low - General cosmetic question</option>
                      <option value="Medium">Medium - Normal operational task</option>
                      <option value="High">High - Impaired system component</option>
                      <option value="Critical / Urgent">Critical - Total blockage / Payroll freeze</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">
                    Affected Platform Module
                  </label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium"
                    value={formModule}
                    onChange={(e) => setFormModule(e.target.value)}
                  >
                    <option value="Dashboard & General">Dashboard Overview & Widgets</option>
                    <option value="Manage Employees">Employee Directory & Profiles</option>
                    <option value="Attendance & Operations">Live Attendance & Shift Rosters</option>
                    <option value="Leave Management">Leave Policies & Request Inbox</option>
                    <option value="Departments & Pay Bands">Department Hierarchy & Pay Bands</option>
                    <option value="Payroll & Disbursements">Payroll Run Wizard & Direct Deposit Files</option>
                    <option value="Performance & Goals">Performance Review Cycles & Goal Calibration</option>
                    <option value="Reports & Analytics">Standard & Custom Data Export Builder</option>
                    <option value="Settings & Security">Roles, RBAC & SSO Settings</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">
                    Detailed Problem Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe what occurred, steps to reproduce, and the expected outcome..."
                    className="w-full rounded-md border border-input bg-background p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Attachments Section */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold">Attachments & Log Snippets (Optional)</label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const filename = `error_screenshot_${Date.now().toString().slice(-4)}.png`
                        setFormAttachments([...formAttachments, filename])
                        toast.success("Attachment Added", { description: `${filename} attached to ticket.` })
                      }}
                      className="text-xs gap-1.5 h-8 cursor-pointer"
                    >
                      <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Attach Log / Screenshot</span>
                    </Button>
                    <span className="text-[11px] text-muted-foreground">Max file size 25MB (PNG, PDF, CSV, TXT)</span>
                  </div>

                  {formAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formAttachments.map((f, idx) => (
                        <Badge key={idx} variant="secondary" className="gap-1.5 text-[11px] py-1">
                          <FileText className="h-3 w-3 text-primary" />
                          <span>{f}</span>
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => setFormAttachments(formAttachments.filter((_, i) => i !== idx))}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleTabSelect("tickets")}
                    className="h-9 text-xs cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingTicket}
                    className="h-9 text-xs gap-1.5 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isSubmittingTicket ? "Submitting..." : "Submit Support Ticket"}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right Help Box */}
          <div className="space-y-4">
            <Card className="border-border shadow-xs bg-linear-to-br from-primary/5 via-background to-background">
              <CardHeader className="pb-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Headphones className="h-5 w-5" />
                </div>
                <CardTitle className="text-sm font-semibold">Priority Concierge SLA</CardTitle>
                <CardDescription className="text-xs">
                  Your tenant is enrolled in the Enterprise SaaS Tier with 24/7 dedicated coverage.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Critical Response</span>
                  <strong className="text-foreground">&lt; 1 Hour</strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">High Priority</span>
                  <strong className="text-foreground">&lt; 4 Hours</strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Normal Inquiries</span>
                  <strong className="text-foreground">&lt; 12 Hours</strong>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Dedicated Support Engineer</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">Marcus Vance</strong>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <IconBrandSlack className="size-4 text-emerald-500" />
                  <span>Direct Slack Connect</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Join our enterprise customer channel for synchronous screen shares and live triaging.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.success("Slack Connect Opened", {
                      description: "Launching #ems-enterprise-support workspace...",
                    })
                  }}
                  className="w-full text-xs gap-2 cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open #ems-support Slack Channel</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 5. SUB TAB 3: KNOWLEDGE BASE & FAQS */}
      {currentTab === "knowledge" && (
        <div className="space-y-6">
          {/* Search Hero */}
          <div className="p-6 rounded-2xl bg-linear-to-br from-primary/10 via-primary/5 to-background border border-primary/20 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground mx-auto flex items-center justify-center shadow-md">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold">Enterprise Knowledge Base & Guides</h2>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto">
              Search through comprehensive configuration articles, regulatory payroll guides, SSO integrations, and operational best practices.
            </p>

            <div className="max-w-md mx-auto relative pt-1">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles (e.g. NACHA ACH, SAML SSO, Grace Periods)..."
                className="pl-9 h-10 bg-background text-xs shadow-xs"
                value={kbSearch}
                onChange={(e) => setKbSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pb-1">
            {["All", "Payroll & Disbursements", "Security & Access", "Attendance & Schedules", "Leave Management", "User Roles & RBAC"].map((cat) => (
              <button
                key={cat}
                onClick={() => setKbCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  kbCategoryFilter === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((art) => {
              const isHelpful = helpfulArticles.includes(art.id)

              return (
                <Card
                  key={art.id}
                  className="border-border shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 text-xs mb-1">
                      <Badge variant="outline" className="font-medium text-[10px]">
                        {art.category}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {art.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-sm font-semibold leading-snug">
                      {art.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2 mt-1">
                      {art.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 border-t bg-muted/10 py-3 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleHelpful(art.id)}
                      className={`flex items-center gap-1 text-[11px] cursor-pointer ${
                        isHelpful ? "text-emerald-600 font-bold" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{art.helpfulCount + (isHelpful ? 1 : 0)} found helpful</span>
                    </button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedArticle(art)}
                      className="h-7 text-xs px-2 text-primary hover:text-primary gap-1 cursor-pointer"
                    >
                      <span>Read Guide</span>
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* 6. SUB TAB 4: SERVICE HEALTH & STATUS */}
      {currentTab === "status" && (
        <div className="space-y-6">
          <Card className="border-border shadow-xs overflow-hidden">
            <CardHeader className="bg-emerald-500/10 border-b border-emerald-500/20 py-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-emerald-950 dark:text-emerald-50">
                    All SaaS Systems Operational
                  </CardTitle>
                  <CardDescription className="text-xs text-emerald-800 dark:text-emerald-300">
                    99.992% Platform Uptime Recorded over last 90 Days
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-emerald-600 text-white font-semibold text-xs py-1 px-3 self-start sm:self-auto">
                No Incidents Reported
              </Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="divide-y divide-border">
                {[
                  { name: "Enterprise Core API Gateway", status: "Operational", latency: "24ms", region: "US-East (N. Virginia)" },
                  { name: "Payroll Calculation Engine & ACH Batching", status: "Operational", latency: "42ms", region: "US-Central (Iowa)" },
                  { name: "SAML 2.0 & SSO Authentication Service", status: "Operational", latency: "18ms", region: "Global Edge" },
                  { name: "Live Geolocation Attendance Punch Ingestion", status: "Operational", latency: "31ms", region: "Global Edge" },
                  { name: "Encrypted Document & Payslip Storage Vault", status: "Operational", latency: "28ms", region: "Multi-Region S3" },
                  { name: "Automated Email & Slack Notification Dispatcher", status: "Operational", latency: "12ms", region: "US-West (Oregon)" },
                ].map((srv, idx) => (
                  <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-foreground">{srv.name}</span>
                      <div className="text-[11px] text-muted-foreground">{srv.region}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] text-muted-foreground font-mono">{srv.latency}</span>
                      <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5 font-semibold text-[11px]">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {srv.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 7. MODAL: TICKET DETAIL & REPLY THREAD */}
      {selectedTicketForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background border border-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b bg-muted/20">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-primary">{selectedTicketForDetail.id}</span>
                  <Badge variant="outline" className="text-xs font-semibold">
                    {selectedTicketForDetail.status}
                  </Badge>
                  <Badge
                    variant={selectedTicketForDetail.priority === "Critical / Urgent" ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {selectedTicketForDetail.priority}
                  </Badge>
                </div>
                <h3 className="text-sm font-bold text-foreground truncate max-w-lg">
                  {selectedTicketForDetail.subject}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedTicketForDetail(null)}
                className="h-8 w-8 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Ticket Info Strip */}
            <div className="px-6 py-2.5 bg-muted/40 border-b flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <div>
                <span>Module: </span>
                <strong className="text-foreground">{selectedTicketForDetail.affectedModule}</strong>
              </div>
              <div>
                <span>Assigned: </span>
                <strong className="text-foreground">{selectedTicketForDetail.assignee.name}</strong>
              </div>
              <div>
                <span>Opened: </span>
                <strong className="text-foreground">{selectedTicketForDetail.createdAt}</strong>
              </div>
            </div>

            {/* Conversation History */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {selectedTicketForDetail.conversationHistory.map((msg) => {
                const isUser = msg.senderRole === "Customer"
                const isSystem = msg.senderRole === "System"

                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center my-2">
                      <span className="inline-block px-3 py-1 rounded-full bg-muted text-[11px] text-muted-foreground italic border border-border">
                        {msg.message} • {msg.timestamp}
                      </span>
                    </div>
                  )
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {msg.sender.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`max-w-[80%] rounded-2xl p-3.5 text-xs space-y-1 ${
                        isUser
                          ? "bg-primary text-primary-foreground rounded-tr-xs"
                          : "bg-muted text-foreground border border-border rounded-tl-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] opacity-80">
                        <span className="font-semibold">{msg.sender} ({msg.senderRole})</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Reply Input Bar */}
            <form onSubmit={handleSendReply} className="p-4 border-t bg-muted/10 flex items-center gap-2">
              <Input
                placeholder="Type a follow-up reply for the support engineering team..."
                value={newReplyMessage}
                onChange={(e) => setNewReplyMessage(e.target.value)}
                className="h-10 text-xs bg-background"
              />
              <Button type="submit" size="sm" className="h-10 px-4 text-xs gap-1.5 cursor-pointer shrink-0">
                <Send className="h-3.5 w-3.5" />
                <span>Send Reply</span>
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: KNOWLEDGE ARTICLE DETAIL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background border border-border w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 px-6 border-b bg-muted/20">
              <div>
                <Badge variant="outline" className="text-[10px] font-medium mb-1">
                  {selectedArticle.category}
                </Badge>
                <h3 className="text-base font-bold">{selectedArticle.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedArticle(null)}
                className="h-8 w-8 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-foreground">
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 font-medium">
                {selectedArticle.summary}
              </div>
              <p>{selectedArticle.content}</p>
              <div className="pt-2 text-muted-foreground">
                For additional questions or complex payroll rule configurations, please submit a ticket directly under <strong>2. Submit New Request</strong>.
              </div>
            </div>

            <div className="p-4 px-6 border-t bg-muted/20 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{selectedArticle.readTime}</span>
              <Button
                size="sm"
                onClick={() => {
                  handleToggleHelpful(selectedArticle.id)
                  setSelectedArticle(null)
                }}
                className="h-8 text-xs gap-1.5 cursor-pointer"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>Mark as Helpful</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
