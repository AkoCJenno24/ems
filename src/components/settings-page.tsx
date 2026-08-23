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
import { Checkbox } from "@/components/ui/checkbox"
import {
  ShieldCheck,
  Key,
  Lock,
  Download,
  Search,
  Plus,
  CheckCircle2,
  Bell,
  Palette,
  Save,
  X,
} from "lucide-react"
import {
  IconShieldLock,
  IconHistory,
  IconAdjustments,
  IconUsers,
} from "@tabler/icons-react"

export type SettingsTab = "roles" | "audit" | "preferences"

export interface SystemRoleItem {
  id: string
  name: string
  description: string
  usersCount: number
  isDefault: boolean
  isSystem: boolean
  assignedSubRoles: string[]
  permissions: {
    employees: "None" | "Read" | "Full CRUD"
    attendance: "None" | "Read" | "Approve & Manage"
    payroll: "None" | "Read" | "Full Wizard & Disburse"
    performance: "None" | "Read" | "Evaluate & Calibrate"
    reports: "None" | "Standard Only" | "Full Custom Export"
    settings: "None" | "Read" | "Full Admin"
  }
}

export interface AuditLogItem {
  id: string
  timestamp: string
  adminUser: {
    name: string
    email: string
    avatar?: string
    role: string
  }
  actionType: "Salary Update" | "Permission Change" | "Record Edit" | "Auth & Login" | "System Config"
  severity: "Low" | "Medium" | "High"
  targetResource: string
  details: string
  ipAddress: string
  location: string
  status: "Verified" | "Flagged"
}

// Dummy Roles Data
const initialRoles: SystemRoleItem[] = [
  {
    id: "ROLE-1",
    name: "Super Administrator",
    description: "Complete unrestricted access to all enterprise modules, security controls, and payroll disbursements.",
    usersCount: 2,
    isDefault: false,
    isSystem: true,
    assignedSubRoles: ["Global Auditor", "Root Authority"],
    permissions: {
      employees: "Full CRUD",
      attendance: "Approve & Manage",
      payroll: "Full Wizard & Disburse",
      performance: "Evaluate & Calibrate",
      reports: "Full Custom Export",
      settings: "Full Admin",
    },
  },
  {
    id: "ROLE-2",
    name: "HR Operations Lead",
    description: "Manages employee records, leave policy configurations, onboarding documentation, and staffing schedules.",
    usersCount: 6,
    isDefault: false,
    isSystem: true,
    assignedSubRoles: ["Leave Approver", "Onboarding Specialist"],
    permissions: {
      employees: "Full CRUD",
      attendance: "Approve & Manage",
      payroll: "Read",
      performance: "Evaluate & Calibrate",
      reports: "Full Custom Export",
      settings: "Read",
    },
  },
  {
    id: "ROLE-3",
    name: "Payroll & Finance Officer",
    description: "Configures salary structures, executes 1-click payroll wizards, distributes payslips, and exports ACH batches.",
    usersCount: 4,
    isDefault: false,
    isSystem: true,
    assignedSubRoles: ["Overtime Reviewer", "Disbursement Signer"],
    permissions: {
      employees: "Read",
      attendance: "Read",
      payroll: "Full Wizard & Disburse",
      performance: "Read",
      reports: "Full Custom Export",
      settings: "None",
    },
  },
  {
    id: "ROLE-4",
    name: "Department Lead / Manager",
    description: "Reviews team attendance anomalies, approves leave applications, and conducts quarterly KPI calibrations.",
    usersCount: 18,
    isDefault: false,
    isSystem: false,
    assignedSubRoles: ["Leave Approver", "Sprint Evaluator"],
    permissions: {
      employees: "Read",
      attendance: "Approve & Manage",
      payroll: "None",
      performance: "Evaluate & Calibrate",
      reports: "Standard Only",
      settings: "None",
    },
  },
  {
    id: "ROLE-5",
    name: "Employee (Self-Service)",
    description: "Base workforce role for clocking in/out, submitting leave requests, and reviewing individual payslips.",
    usersCount: 218,
    isDefault: true,
    isSystem: true,
    assignedSubRoles: ["Standard Contributor"],
    permissions: {
      employees: "Read",
      attendance: "Read",
      payroll: "None",
      performance: "Read",
      reports: "None",
      settings: "None",
    },
  },
]

// Dummy Audit Logs Data
const initialAuditLogs: AuditLogItem[] = [
  {
    id: "AUD-9821",
    timestamp: "Aug 22, 2026 • 21:45:10 UTC",
    adminUser: {
      name: "Admin User",
      email: "admin@ems.company",
      role: "Super Administrator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&dpr=2&q=80",
    },
    actionType: "Salary Update",
    severity: "High",
    targetResource: "EMP-106 (Alex Morgan)",
    details: "Base pay adjusted: $9,500.00 → $10,200.00/mo (+7.3% Merit Promotion)",
    ipAddress: "192.168.1.45",
    location: "Austin HQ (Internal Gateway)",
    status: "Verified",
  },
  {
    id: "AUD-9820",
    timestamp: "Aug 22, 2026 • 20:12:35 UTC",
    adminUser: {
      name: "Elena Rostova",
      email: "elena.rostova@ems.company",
      role: "HR Operations Lead",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&dpr=2&q=80",
    },
    actionType: "Permission Change",
    severity: "High",
    targetResource: "Role: Department Lead",
    details: "Assigned sub-role: 'Overtime Reviewer' to Marcus Vance (Infrastructure)",
    ipAddress: "192.168.1.78",
    location: "Austin HQ (Floor 3)",
    status: "Verified",
  },
  {
    id: "AUD-9819",
    timestamp: "Aug 22, 2026 • 18:30:14 UTC",
    adminUser: {
      name: "Sophia Martinez",
      email: "sophia.martinez@ems.company",
      role: "Payroll & Finance Officer",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&dpr=2&q=80",
    },
    actionType: "System Config",
    severity: "Medium",
    targetResource: "Disbursement Batch: ACH-2026-08",
    details: "Generated NACHA direct deposit file ($59,291.00 net payout for 248 staff)",
    ipAddress: "10.0.4.12",
    location: "Finance VPN Tunnel",
    status: "Verified",
  },
  {
    id: "AUD-9818",
    timestamp: "Aug 22, 2026 • 15:05:22 UTC",
    adminUser: {
      name: "David Kim",
      email: "david.kim@ems.company",
      role: "Super Administrator",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&dpr=2&q=80",
    },
    actionType: "Record Edit",
    severity: "Low",
    targetResource: "Leave Policy: PTO Annual",
    details: "Updated maximum rollover threshold from 10 days to 12 days per fiscal year",
    ipAddress: "192.168.1.10",
    location: "Executive Boardroom",
    status: "Verified",
  },
  {
    id: "AUD-9817",
    timestamp: "Aug 22, 2026 • 09:14:02 UTC",
    adminUser: {
      name: "Security Watchdog",
      email: "security-bot@ems.company",
      role: "System Service",
    },
    actionType: "Auth & Login",
    severity: "Low",
    targetResource: "SSO Authentication Gateway",
    details: "Admin session initiated via Google Workspace SAML 2.0 (2FA Hardware Key Verified)",
    ipAddress: "203.0.113.195",
    location: "San Francisco, CA (Encrypted)",
    status: "Verified",
  },
]

interface SettingsPageProps {
  initialSubTab?: SettingsTab
  onTabChange?: (tab: SettingsTab) => void
}

export function SettingsPage({ initialSubTab = "roles", onTabChange }: SettingsPageProps) {
  const [currentTab, setCurrentTab] = useState<SettingsTab>(initialSubTab)

  // 1. Roles & Permissions States
  const [roles, setRoles] = useState<SystemRoleItem[]>(initialRoles)
  const [showAddSubRoleModal, setShowAddSubRoleModal] = useState(false)
  const [selectedRoleForSubRole, setSelectedRoleForSubRole] = useState<SystemRoleItem | null>(null)
  const [newSubRoleName, setNewSubRoleName] = useState("")

  // 2. Audit Trail States
  const [auditLogs] = useState<AuditLogItem[]>(initialAuditLogs)
  const [auditSearch, setAuditSearch] = useState("")
  const [auditActionFilter, setAuditActionFilter] = useState("All")
  const [auditSeverityFilter, setAuditSeverityFilter] = useState("All")

  // 3. System Preferences States
  const [companyName, setCompanyName] = useState("Acme Enterprise Global")
  const [portalThemeAccent, setPortalThemeAccent] = useState("slate")
  const [senderEmail, setSenderEmail] = useState("notifications@ems.company")

  // Notification Toggles
  const [notifUrgentLeaves, setNotifUrgentLeaves] = useState(true)
  const [notifPayrollSummary, setNotifPayrollSummary] = useState(true)
  const [notifAttendanceAnomalies, setNotifAttendanceAnomalies] = useState(true)
  const [notifSecurityAlerts, setNotifSecurityAlerts] = useState(true)

  // SSO & 2FA Toggles
  const [ssoEnforced, setSsoEnforced] = useState(true)
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("30")

  const [prefSaveSuccess, setPrefSaveSuccess] = useState(false)

  // Sync internal state when parent initialSubTab changes
  React.useEffect(() => {
    if (initialSubTab) {
      setCurrentTab(initialSubTab)
    }
  }, [initialSubTab])

  const handleTabSelect = (tab: SettingsTab) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const q = auditSearch.toLowerCase()
      const matchesSearch =
        log.adminUser.name.toLowerCase().includes(q) ||
        log.adminUser.email.toLowerCase().includes(q) ||
        log.targetResource.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q)

      const matchesAction = auditActionFilter === "All" || log.actionType === auditActionFilter
      const matchesSeverity = auditSeverityFilter === "All" || log.severity === auditSeverityFilter

      return matchesSearch && matchesAction && matchesSeverity
    })
  }, [auditLogs, auditSearch, auditActionFilter, auditSeverityFilter])

  // Add Sub-Role Submit
  const handleAddSubRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRoleForSubRole || !newSubRoleName.trim()) return

    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRoleForSubRole.id
          ? { ...r, assignedSubRoles: [...r.assignedSubRoles, newSubRoleName.trim()] }
          : r
      )
    )

    toast.success("Sub-Role Assigned", {
      description: `Assigned '${newSubRoleName.trim()}' to ${selectedRoleForSubRole.name}.`,
    })

    setNewSubRoleName("")
    setShowAddSubRoleModal(false)
    setSelectedRoleForSubRole(null)
  }

  // Save System Preferences
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault()
    setPrefSaveSuccess(true)
    toast.success("System Preferences Saved", {
      description: "Company branding, email alerts, and SSO/2FA enforcement updated.",
    })
    setTimeout(() => setPrefSaveSuccess(false), 3000)
  }

  // Export Immutable Audit Logs CSV
  const exportAuditLogCSV = () => {
    const headers = ["Audit ID", "Timestamp", "Admin User", "Role", "Action Type", "Severity", "Target Resource", "Details", "IP Address", "Location", "Status"]
    const rows = filteredAuditLogs.map((log) => [
      log.id,
      `"${log.timestamp}"`,
      `"${log.adminUser.name} (${log.adminUser.email})"`,
      `"${log.adminUser.role}"`,
      `"${log.actionType}"`,
      `"${log.severity}"`,
      `"${log.targetResource}"`,
      `"${log.details}"`,
      `"${log.ipAddress}"`,
      `"${log.location}"`,
      `"${log.status}"`,
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `EMS_Audit_Trail_Security_Log_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Security Audit Log Exported", {
      description: `Downloaded ${filteredAuditLogs.length} immutable audit trail records.`,
    })
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Enterprise Settings & Security</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure granular role permissions, audit immutable administrative actions, and manage company preferences with SSO/2FA enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="outline" className="gap-1.5 py-1 px-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>SOC2 & ISO 27001 Compliant</span>
          </Badge>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 overflow-x-auto">
        <button
          onClick={() => handleTabSelect("roles")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "roles"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconShieldLock className="size-4 text-primary" />
          <span>1. Roles & Permissions ({roles.length})</span>
        </button>

        <button
          onClick={() => handleTabSelect("audit")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "audit"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconHistory className="size-4 text-blue-500" />
          <span>2. Security Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => handleTabSelect("preferences")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            currentTab === "preferences"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconAdjustments className="size-4 text-emerald-500" />
          <span>3. System Preferences & SSO</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: ROLE & PERMISSION MANAGER */}
      {/* ========================================================================= */}
      {currentTab === "roles" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Configured Roles</span>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <IconShieldLock className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-foreground">{roles.length} Active Roles</div>
              <span className="text-[11px] text-muted-foreground">Granular RBAC enabled</span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Total Users Assigned</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <IconUsers className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">248 Users</div>
              <span className="text-[11px] text-muted-foreground">100% directory coverage</span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Custom Sub-Roles</span>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Key className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-foreground">8 Sub-Roles</div>
              <span className="text-[11px] text-muted-foreground">Assigned to department leads</span>
            </Card>

            <Card className="shadow-xs p-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>MFA Enforcement</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">100% Enforced</div>
              <span className="text-[11px] text-muted-foreground">Mandatory for all admin tiers</span>
            </Card>
          </div>

          {/* Roles Roster */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Role Hierarchy & Permission Scopes</h3>
                <p className="text-xs text-muted-foreground">Inspect module capabilities and assign contextual sub-roles.</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {roles.map((role) => (
                <Card key={role.id} className="shadow-xs hover:border-primary/40 transition-all p-4.5">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Role Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base text-foreground">{role.name}</span>
                        {role.isSystem && (
                          <Badge variant="outline" className="text-[10px] bg-muted/60">
                            System Role
                          </Badge>
                        )}
                        {role.isDefault && (
                          <Badge variant="secondary" className="text-[10px]">
                            Default New Hire Role
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {role.usersCount} Active Users
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground">{role.description}</p>

                      {/* Sub-Roles Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-muted-foreground font-medium">Assigned Sub-Roles:</span>
                        {role.assignedSubRoles.map((subRole, sIdx) => (
                          <Badge key={sIdx} variant="secondary" className="text-[10px] font-medium gap-1">
                            <Key className="size-2.5 text-primary" />
                            <span>{subRole}</span>
                          </Badge>
                        ))}
                      </div>

                      {/* Permissions Matrix Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 text-[11px]">
                        <div className="p-2 rounded bg-muted/40 border">
                          <span className="text-[10px] text-muted-foreground block">Employees</span>
                          <span className="font-semibold text-foreground">{role.permissions.employees}</span>
                        </div>
                        <div className="p-2 rounded bg-muted/40 border">
                          <span className="text-[10px] text-muted-foreground block">Attendance</span>
                          <span className="font-semibold text-foreground">{role.permissions.attendance}</span>
                        </div>
                        <div className="p-2 rounded bg-muted/40 border">
                          <span className="text-[10px] text-muted-foreground block">Payroll</span>
                          <span className="font-semibold text-foreground">{role.permissions.payroll}</span>
                        </div>
                        <div className="p-2 rounded bg-muted/40 border">
                          <span className="text-[10px] text-muted-foreground block">Performance</span>
                          <span className="font-semibold text-foreground">{role.permissions.performance}</span>
                        </div>
                        <div className="p-2 rounded bg-muted/40 border">
                          <span className="text-[10px] text-muted-foreground block">Reports</span>
                          <span className="font-semibold text-foreground">{role.permissions.reports}</span>
                        </div>
                        <div className="p-2 rounded bg-muted/40 border">
                          <span className="text-[10px] text-muted-foreground block">Settings</span>
                          <span className="font-semibold text-foreground">{role.permissions.settings}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col items-start lg:items-end justify-between gap-2 shrink-0 lg:border-l lg:pl-5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRoleForSubRole(role)
                          setShowAddSubRoleModal(true)
                        }}
                        className="h-7 text-xs px-2.5 cursor-pointer gap-1"
                      >
                        <Plus className="size-3.5" />
                        <span>Assign Sub-Role</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: AUDIT TRAIL */}
      {/* ========================================================================= */}
      {currentTab === "audit" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Top Filter & Search Bar */}
          <Card className="shadow-xs">
            <CardContent className="p-3.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search admin user, target resource, action details, or IP address..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={auditActionFilter}
                  onChange={(e) => setAuditActionFilter(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="All">All Action Types</option>
                  <option value="Salary Update">Salary Updates</option>
                  <option value="Permission Change">Permission Changes</option>
                  <option value="Record Edit">Record Edits</option>
                  <option value="Auth & Login">Auth & Logins</option>
                  <option value="System Config">System Config</option>
                </select>

                <select
                  value={auditSeverityFilter}
                  onChange={(e) => setAuditSeverityFilter(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="All">All Severities</option>
                  <option value="High">High Severity</option>
                  <option value="Medium">Medium Severity</option>
                  <option value="Low">Low Severity</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportAuditLogCSV}
                  className="gap-1.5 cursor-pointer text-xs h-9"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Audit CSV</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs Table */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm flex items-center gap-2">
                  <IconHistory className="size-4 text-primary" />
                  <span>Immutable Security Event Log</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Cryptographically verified event entries recorded in compliance with audit standards.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {filteredAuditLogs.length} Verified Entries
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b select-none">
                    <tr>
                      <th className="px-3.5 py-2.5 font-semibold">Timestamp</th>
                      <th className="px-3.5 py-2.5 font-semibold">Admin User</th>
                      <th className="px-3.5 py-2.5 font-semibold">Action Category</th>
                      <th className="px-3.5 py-2.5 font-semibold">Target Resource</th>
                      <th className="px-3.5 py-2.5 font-semibold">Event Details</th>
                      <th className="px-3.5 py-2.5 font-semibold">IP & Location</th>
                      <th className="px-3.5 py-2.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs">
                    {filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-3.5 py-3 font-mono text-muted-foreground whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="px-3.5 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              {log.adminUser.avatar && <AvatarImage src={log.adminUser.avatar} alt={log.adminUser.name} />}
                              <AvatarFallback className="text-[9px] font-bold bg-muted">
                                {log.adminUser.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-semibold text-foreground block">{log.adminUser.name}</span>
                              <span className="text-[10px] text-muted-foreground">{log.adminUser.role}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3.5 py-3 whitespace-nowrap">
                          <Badge
                            variant={
                              log.actionType === "Salary Update"
                                ? "default"
                                : log.actionType === "Permission Change"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-[10px]"
                          >
                            {log.actionType}
                          </Badge>
                        </td>
                        <td className="px-3.5 py-3 font-medium text-foreground whitespace-nowrap">
                          {log.targetResource}
                        </td>
                        <td className="px-3.5 py-3 text-muted-foreground max-w-xs">
                          {log.details}
                        </td>
                        <td className="px-3.5 py-3 font-mono text-[11px] whitespace-nowrap">
                          <span className="text-foreground font-semibold block">{log.ipAddress}</span>
                          <span className="text-[10px] text-muted-foreground">{log.location}</span>
                        </td>
                        <td className="px-3.5 py-3 whitespace-nowrap">
                          <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1">
                            <CheckCircle2 className="size-3" /> Verified
                          </Badge>
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
      {/* SECTION 3: SYSTEM PREFERENCES & SSO */}
      {/* ========================================================================= */}
      {currentTab === "preferences" && (
        <form onSubmit={handleSavePreferences} className="space-y-5 animate-in fade-in duration-200">
          {prefSaveSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
              <span>System preferences and security configurations updated successfully!</span>
            </div>
          )}

          {/* 1. Company Branding */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="size-4 text-primary" />
                <span>Company Branding & Portal Appearance</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Customize corporate identity, organization display name, and portal color palettes.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-medium text-foreground block mb-1">Organization Legal Name</label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">Corporate Portal Theme Accent</label>
                  <select
                    value={portalThemeAccent}
                    onChange={(e) => setPortalThemeAccent(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="slate">Slate Standard (Clean Monochromatic)</option>
                    <option value="indigo">Enterprise Indigo</option>
                    <option value="violet">Deep Violet</option>
                    <option value="emerald">Emerald Sustainable</option>
                    <option value="ocean">Ocean Tech Blue</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Email Notifications Engine */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="size-4 text-blue-500" />
                <span>Automated Email Notification Triggers</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Configure administrative alert dispatch rules for urgent leaves, payroll releases, and security anomalies.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5">
              <div className="max-w-md">
                <label className="text-xs font-medium text-foreground block mb-1">System Notification Sender Email</label>
                <Input
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 cursor-pointer transition-colors">
                  <Checkbox
                    checked={notifUrgentLeaves}
                    onCheckedChange={(checked) => setNotifUrgentLeaves(!!checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-foreground block">Urgent Leave Submissions</span>
                    <span className="text-[11px] text-muted-foreground">Instant dispatch to department leads and HR managers.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 cursor-pointer transition-colors">
                  <Checkbox
                    checked={notifPayrollSummary}
                    onCheckedChange={(checked) => setNotifPayrollSummary(!!checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-foreground block">Payroll Disbursement Reports</span>
                    <span className="text-[11px] text-muted-foreground">Notify finance and treasury upon 1-click wizard completion.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 cursor-pointer transition-colors">
                  <Checkbox
                    checked={notifAttendanceAnomalies}
                    onCheckedChange={(checked) => setNotifAttendanceAnomalies(!!checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-foreground block">Weekly Attendance Anomalies</span>
                    <span className="text-[11px] text-muted-foreground">Digest of unresolved clock-in/out and regularization requests.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 cursor-pointer transition-colors">
                  <Checkbox
                    checked={notifSecurityAlerts}
                    onCheckedChange={(checked) => setNotifSecurityAlerts(!!checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-foreground block">Security & Failed Login Alerts</span>
                    <span className="text-[11px] text-muted-foreground">Immediate alerts on unauthorized IP access attempts.</span>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* 3. SSO & Two-Factor Authentication (2FA) */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="size-4 text-emerald-500" />
                <span>Single Sign-On (SSO) & Two-Factor Authentication (2FA)</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Enforce centralized identity management via SAML 2.0 / OIDC and mandatory hardware/TOTP MFA.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 cursor-pointer transition-colors">
                  <Checkbox
                    checked={ssoEnforced}
                    onCheckedChange={(checked) => setSsoEnforced(!!checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-foreground block">Enforce SAML 2.0 / OIDC Single Sign-On</span>
                    <span className="text-[11px] text-muted-foreground">
                      Redirect all employees to Okta / Google Workspace IdP. Password login bypassed.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 cursor-pointer transition-colors">
                  <Checkbox
                    checked={twoFactorEnforced}
                    onCheckedChange={(checked) => setTwoFactorEnforced(!!checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-foreground block">Mandatory 2FA / Hardware Key Token</span>
                    <span className="text-[11px] text-muted-foreground">
                      Require FIDO2 / TOTP verification for all Administrative and Manager actions.
                    </span>
                  </div>
                </label>
              </div>

              <div className="max-w-xs pt-2">
                <label className="text-xs font-medium text-foreground block mb-1">Administrative Session Timeout</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="15">15 Minutes of Inactivity</option>
                  <option value="30">30 Minutes of Inactivity (Recommended)</option>
                  <option value="60">1 Hour of Inactivity</option>
                  <option value="480">8 Hours (Full Shift)</option>
                </select>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end border-t pt-4">
              <Button type="submit" className="gap-1.5 cursor-pointer shadow-xs">
                <Save className="size-4" /> Save System Preferences
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ASSIGN SUB-ROLE */}
      {/* ========================================================================= */}
      {showAddSubRoleModal && selectedRoleForSubRole && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-md shadow-2xl border-border animate-in zoom-in-95">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="size-4 text-primary" />
                  <span>Assign Sub-Role to {selectedRoleForSubRole.name}</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddSubRoleModal(false)}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-xs">
                Define contextual sub-privileges for specific administrative workflows.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form id="subrole-form" onSubmit={handleAddSubRoleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Sub-Role Title *
                  </label>
                  <Input
                    placeholder="e.g. Audit Viewer, Shift Planner, Compliance Signer"
                    value={newSubRoleName}
                    onChange={(e) => setNewSubRoleName(e.target.value)}
                    required
                  />
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border space-y-1.5 text-xs">
                  <span className="font-semibold text-foreground block">Parent Role: {selectedRoleForSubRole.name}</span>
                  <p className="text-muted-foreground text-[11px]">
                    Sub-roles inherit the parent role&apos;s base permissions and grant additional specialized action triggers across approval queues.
                  </p>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddSubRoleModal(false)}
                className="cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button form="subrole-form" type="submit" size="sm" className="gap-1.5 cursor-pointer text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Sub-Role
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
