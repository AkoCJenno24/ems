import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type {
  CurrentUser,
  UserRole,
  Employee,
  Department,
  AttendanceRecord,
  LeaveRequest,
  SupportTicket,
  AuditLog,
  SystemSettings,
  ExpenseClaim,
  EmployeeDocument,
  LeaveBalance,
  PersonalGoal,
  Announcement,
} from "./types"

interface EMSStoreState {
  // Current logged in user & role
  currentUser: CurrentUser
  setCurrentUser: (user: Partial<CurrentUser>) => void
  loginAsRole: (role: UserRole) => void
  changePassword: (newPassword: string) => void

  // Announcements & Bulletins
  announcements: Announcement[]
  addAnnouncement: (ann: Omit<Announcement, "id" | "time">) => void

  // Time & Punch Tracking
  isClockedIn: boolean
  clockInTime: string | null
  todayWorkMinutes: number
  clockIn: () => void
  clockOut: () => void

  // Leave Balances
  leaveBalances: LeaveBalance
  updateLeaveBalances: (updates: Partial<LeaveBalance>) => void

  // Employees
  employees: Employee[]
  addEmployee: (emp: Omit<Employee, "id">) => Employee
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  deleteEmployee: (id: string) => void

  // Departments
  departments: Department[]
  addDepartment: (dept: Omit<Department, "id">) => void
  updateDepartment: (id: string, updates: Partial<Department>) => void
  deleteDepartment: (id: string) => void

  // Attendance
  attendanceRecords: AttendanceRecord[]
  addAttendanceRecord: (record: Omit<AttendanceRecord, "id">) => void
  updateAttendanceStatus: (id: string, status: AttendanceRecord["status"]) => void

  // Leaves
  leaveRequests: LeaveRequest[]
  submitLeaveRequest: (req: Omit<LeaveRequest, "id" | "appliedOn" | "status">) => void
  updateLeaveStatus: (id: string, status: "Approved" | "Rejected") => void

  // Expense Claims
  expenseClaims: ExpenseClaim[]
  submitExpenseClaim: (claim: Omit<ExpenseClaim, "id" | "status" | "date">) => void
  updateExpenseClaimStatus: (id: string, status: ExpenseClaim["status"]) => void

  // Personal Goals / OKRs
  personalGoals: PersonalGoal[]
  updatePersonalGoalProgress: (id: string, progress: number) => void

  // Employee Documents
  employeeDocuments: EmployeeDocument[]

  // Support Tickets
  tickets: SupportTicket[]
  submitTicket: (ticket: Omit<SupportTicket, "id" | "submittedAt" | "responses">) => void
  updateTicketStatus: (id: string, status: SupportTicket["status"]) => void

  // Audit Logs
  auditLogs: AuditLog[]
  addAuditLog: (log: Omit<AuditLog, "id" | "timestamp">) => void

  // System Settings
  settings: SystemSettings
  updateSettings: (updates: Partial<SystemSettings>) => void
}

const adminUserPreset: CurrentUser = {
  id: "EMP-001",
  name: "Alex Morgan",
  email: "admin@ems.company",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
  role: "Admin",
  jobTitle: "Head of Operations & Engineering",
  title: "Head of Operations & Engineering",
  department: "Engineering",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA (HQ)",
  joinedDate: "Jan 15, 2023",
  salaryBand: "L7 - Executive",
  manager: "Executive Board",
  userRole: "Admin",
}

const employeeUserPreset: CurrentUser = {
  id: "EMP-002",
  name: "Sarah Chen",
  email: "employee@ems.company",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&dpr=2&q=80",
  role: "Employee",
  jobTitle: "Lead Product Designer",
  title: "Lead Product Designer",
  department: "Product",
  phone: "+1 (555) 345-6789",
  location: "New York, NY",
  joinedDate: "Mar 02, 2023",
  salaryBand: "L5 - Lead",
  manager: "Emily Watson",
  userRole: "Employee",
}

const initialEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "Alex Morgan",
    jobTitle: "Senior Fullstack Engineer",
    role: "Admin",
    department: "Engineering",
    employmentType: "Full-time",
    status: "Active",
    email: "admin@ems.company",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA (HQ)",
    joinedDate: "Jan 15, 2023",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
    manager: "David Vance",
    salaryBand: "L7 - Executive",
    bio: "Leads enterprise core infrastructure and real-time backend microservices.",
  },
  {
    id: "EMP-002",
    name: "Sarah Chen",
    jobTitle: "Lead Product Designer",
    role: "Employee",
    department: "Product",
    employmentType: "Full-time",
    status: "Active",
    email: "employee@ems.company",
    phone: "+1 (555) 345-6789",
    location: "New York, NY",
    joinedDate: "Mar 02, 2023",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&dpr=2&q=80",
    manager: "Emily Watson",
    salaryBand: "L5 - Lead",
    bio: "Directs design systems, accessibility standards, and employee mobile apps.",
  },
  {
    id: "EMP-003",
    name: "Marcus Vance",
    jobTitle: "DevOps Architect",
    role: "Employee",
    department: "Infrastructure",
    employmentType: "Full-time",
    status: "Active",
    email: "marcus.vance@ems.company",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX (Remote)",
    joinedDate: "Aug 10, 2022",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&h=128&dpr=2&q=80",
    manager: "David Vance",
    salaryBand: "L6 - Staff",
    bio: "Orchestrates multi-cloud Kubernetes clusters and CI/CD security pipelines.",
  },
  {
    id: "EMP-004",
    name: "Elena Rostova",
    jobTitle: "Finance Operations Director",
    role: "Admin",
    department: "Finance",
    employmentType: "Full-time",
    status: "Active",
    email: "elena.rostova@ems.company",
    phone: "+1 (555) 567-8901",
    location: "Chicago, IL",
    joinedDate: "Nov 01, 2021",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&dpr=2&q=80",
    manager: "Executive Board",
    salaryBand: "L7 - Director",
    bio: "Oversees global payroll distributions, corporate audit, and compliance.",
  },
  {
    id: "EMP-005",
    name: "James Wilson",
    jobTitle: "HR People Partner",
    role: "Employee",
    department: "Human Resources",
    employmentType: "Full-time",
    status: "On Leave",
    email: "james.wilson@ems.company",
    phone: "+1 (555) 678-9012",
    location: "San Francisco, CA (HQ)",
    joinedDate: "Jun 14, 2023",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&dpr=2&q=80",
    manager: "Sarah Jenkins",
    salaryBand: "L4 - Mid-Senior",
    bio: "Handles talent acquisition, employee wellbeing, and benefits management.",
  },
  {
    id: "EMP-006",
    name: "Priya Sharma",
    jobTitle: "Data Science Lead",
    role: "Employee",
    department: "Engineering",
    employmentType: "Full-time",
    status: "Remote",
    email: "priya.sharma@ems.company",
    phone: "+1 (555) 789-0123",
    location: "Seattle, WA (Remote)",
    joinedDate: "Jan 10, 2024",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&dpr=2&q=80",
    manager: "Alex Morgan",
    salaryBand: "L5 - Lead",
    bio: "Spearheads predictive workforce analytics and business intelligence telemetry.",
  },
]

const initialDepartments: Department[] = [
  {
    id: "DEP-001",
    name: "Engineering",
    code: "ENG",
    head: "Alex Morgan",
    headAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
    employeeCount: 78,
    budget: "$1.42M",
    color: "bg-blue-500",
    description: "Core software engineering, QA automation, and developer platforms.",
  },
  {
    id: "DEP-002",
    name: "Product & Design",
    code: "PRD",
    head: "Sarah Chen",
    headAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&dpr=2&q=80",
    employeeCount: 32,
    budget: "$620K",
    color: "bg-purple-500",
    description: "Product management, user research, and UI/UX design systems.",
  },
  {
    id: "DEP-003",
    name: "Infrastructure & DevOps",
    code: "INF",
    head: "Marcus Vance",
    headAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&h=128&dpr=2&q=80",
    employeeCount: 24,
    budget: "$510K",
    color: "bg-emerald-500",
    description: "Cloud architecture, reliability engineering, and system security.",
  },
  {
    id: "DEP-004",
    name: "Finance & Accounting",
    code: "FIN",
    head: "Elena Rostova",
    headAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&dpr=2&q=80",
    employeeCount: 22,
    budget: "$380K",
    color: "bg-amber-500",
    description: "Financial planning, global payroll, tax compliance, and auditing.",
  },
  {
    id: "DEP-005",
    name: "Human Resources",
    code: "HR",
    head: "James Wilson",
    headAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&dpr=2&q=80",
    employeeCount: 18,
    budget: "$290K",
    color: "bg-rose-500",
    description: "Talent acquisition, organizational culture, benefits, and workplace wellness.",
  },
]

const initialAttendance: AttendanceRecord[] = [
  {
    id: "ATT-001",
    employeeId: "EMP-001",
    employeeName: "Alex Morgan",
    department: "Engineering",
    date: "Today",
    checkIn: "08:55 AM",
    checkOut: "—",
    status: "On-Time",
    workHours: "5h 22m",
    overtime: "+0.0h",
    location: "SF HQ - Gate A",
    verified: true,
  },
  {
    id: "ATT-002",
    employeeId: "EMP-002",
    employeeName: "Sarah Chen",
    department: "Product",
    date: "Today",
    checkIn: "09:02 AM",
    checkOut: "—",
    status: "On-Time",
    workHours: "5h 15m",
    overtime: "+0.0h",
    location: "NYC Office - Fl 4",
    verified: true,
  },
  {
    id: "ATT-003",
    employeeId: "EMP-003",
    employeeName: "Marcus Vance",
    department: "Infrastructure",
    date: "Today",
    checkIn: "08:30 AM",
    checkOut: "—",
    status: "Remote",
    workHours: "5h 47m",
    overtime: "+0.5h",
    location: "Remote VPN",
    verified: true,
  },
  {
    id: "ATT-004",
    employeeId: "EMP-004",
    employeeName: "Elena Rostova",
    department: "Finance",
    date: "Today",
    checkIn: "09:35 AM",
    checkOut: "—",
    status: "Late",
    workHours: "4h 42m",
    overtime: "+0.0h",
    location: "Chicago Office",
    verified: true,
  },
  {
    id: "ATT-005",
    employeeId: "EMP-005",
    employeeName: "James Wilson",
    department: "Human Resources",
    date: "Today",
    checkIn: "—",
    checkOut: "—",
    status: "Absent",
    workHours: "0h 0m",
    overtime: "+0.0h",
    location: "On Approved Leave",
    verified: false,
  },
]

const initialLeaves: LeaveRequest[] = [
  {
    id: "LV-2024-001",
    employeeId: "EMP-005",
    employeeName: "James Wilson",
    department: "Human Resources",
    leaveType: "Annual Leave",
    startDate: "Aug 20, 2026",
    endDate: "Aug 27, 2026",
    days: 5,
    reason: "Scheduled family vacation and travel.",
    status: "Approved",
    appliedOn: "Aug 10, 2026",
    reviewer: "Sarah Jenkins",
  },
  {
    id: "LV-2024-002",
    employeeId: "EMP-001",
    employeeName: "Alex Morgan",
    department: "Engineering",
    leaveType: "Casual Leave",
    startDate: "Aug 28, 2026",
    endDate: "Aug 29, 2026",
    days: 2,
    reason: "Attending React Advanced Conference.",
    status: "Pending",
    appliedOn: "Aug 21, 2026",
  },
  {
    id: "LV-2024-003",
    employeeId: "EMP-004",
    employeeName: "Elena Rostova",
    department: "Finance",
    leaveType: "Sick Leave",
    startDate: "Sep 02, 2026",
    endDate: "Sep 03, 2026",
    days: 2,
    reason: "Routine medical checkup and recovery.",
    status: "Pending",
    appliedOn: "Aug 22, 2026",
  },
]

const initialExpenseClaims: ExpenseClaim[] = [
  {
    id: "EXP-201",
    employeeId: "EMP-001",
    employeeName: "Alex Morgan",
    title: "AWS Cloud Practitioner Exam Voucher",
    category: "Learning & Training",
    amount: 150.0,
    currency: "USD",
    date: "Aug 18, 2026",
    status: "Approved",
    receiptName: "aws-certification-receipt.pdf",
    notes: "Approved under quarterly engineering learning budget.",
  },
  {
    id: "EXP-202",
    employeeId: "EMP-001",
    employeeName: "Alex Morgan",
    title: "Client Onboarding Dinner - Fintech Team",
    category: "Meals & Entertainment",
    amount: 184.5,
    currency: "USD",
    date: "Aug 22, 2026",
    status: "Pending",
    receiptName: "client_dinner_sf.jpg",
    notes: "Dinner with Lead Architect from Stripe partner team.",
  },
]

const initialPersonalGoals: PersonalGoal[] = [
  {
    id: "G-101",
    title: "Event-Driven Microservices Migration",
    category: "Technical Architecture",
    targetMetric: "Migrate core auth & notification bus to Kafka with 99.99% uptime",
    currentProgress: 80,
    dueDate: "Sep 30, 2026",
    status: "On Track",
  },
  {
    id: "G-102",
    title: "Mentorship & Junior Developer Onboarding",
    category: "Leadership & Culture",
    targetMetric: "Pair program with 2 junior engineers weekly and conduct code walkthroughs",
    currentProgress: 60,
    dueDate: "Oct 15, 2026",
    status: "On Track",
  },
  {
    id: "G-103",
    title: "Lighthouse Web Performance & A11y Audit",
    category: "Product Velocity",
    targetMetric: "Achieve 95+ performance scores on all primary EMS dashboard routes",
    currentProgress: 45,
    dueDate: "Nov 01, 2026",
    status: "At Risk",
  },
]

const initialEmployeeDocuments: EmployeeDocument[] = [
  {
    id: "DOC-01",
    name: "Employment_Agreement_Alex_Morgan.pdf",
    category: "Contracts",
    size: "1.4 MB",
    date: "Jan 15, 2023",
  },
  {
    id: "DOC-02",
    name: "Standard_Health_Benefits_Plan_2026.pdf",
    category: "Benefits & Policies",
    size: "2.8 MB",
    date: "Jan 01, 2026",
  },
  {
    id: "DOC-03",
    name: "Corporate_Intellectual_Property_NDA.pdf",
    category: "Contracts",
    size: "650 KB",
    date: "Jan 15, 2023",
  },
  {
    id: "DOC-04",
    name: "W4_Federal_Tax_Withholding_2026.pdf",
    category: "Tax & Finance",
    size: "420 KB",
    date: "Feb 10, 2026",
  },
]

const initialTickets: SupportTicket[] = [
  {
    id: "TCK-8921",
    title: "Payroll tax withholdings adjustment for Q3",
    category: "Payroll & Compensation",
    priority: "High",
    status: "In Review",
    submittedBy: "Marcus Vance",
    submittedAt: "2 hours ago",
    department: "Infrastructure",
    assignee: "Elena Rostova",
    responses: 3,
    description: "Need to update my W4 exemptions and state withholdings after relocating to Austin.",
  },
  {
    id: "TCK-8920",
    title: "Request for second 4K monitor and USB-C dock",
    category: "IT & Hardware",
    priority: "Medium",
    status: "Open",
    submittedBy: "Sarah Chen",
    submittedAt: "Yesterday",
    department: "Product",
    assignee: "IT Desk",
    responses: 1,
    description: "Design workflow requires dual high-gamut external monitors for color fidelity testing.",
  },
]

const initialAuditLogs: AuditLog[] = [
  {
    id: "AUD-101",
    actor: "Admin User",
    action: "Updated system session security timeout to 30 mins",
    category: "System Config",
    timestamp: "10 mins ago",
    ip: "192.168.1.45",
    status: "Success",
  },
  {
    id: "AUD-102",
    actor: "Elena Rostova",
    action: "Generated August 2026 Draft Payroll Ledger",
    category: "Payroll",
    timestamp: "1 hour ago",
    ip: "10.0.4.12",
    status: "Success",
  },
  {
    id: "AUD-103",
    actor: "System Sentinel",
    action: "Automated biometric attendance sync completed (248 records)",
    category: "Access & Auth",
    timestamp: "3 hours ago",
    ip: "127.0.0.1",
    status: "Success",
  },
]

const initialAnnouncements: Announcement[] = [
  {
    id: "ANN-1",
    title: "Q3 All-Hands Townhall Meeting",
    content:
      "Join us this Friday at 3:00 PM EST via Google Meet. Leadership will present financial metrics and product roadmap.",
    author: "Alex Morgan",
    time: "2 hours ago",
    priority: "high",
  },
  {
    id: "ANN-2",
    title: "Office Network Maintenance Window",
    content:
      "Infrastructure will be upgrading core switches on Sunday between 02:00 AM - 05:00 AM UTC. Expect brief VPN blips.",
    author: "Marcus Vance",
    time: "Yesterday",
    priority: "normal",
  },
]

export const useEMSStore = create<EMSStoreState>()(
  persist(
    (set, get) => ({
      currentUser: adminUserPreset,
      setCurrentUser: (updates) =>
        set((state) => ({ currentUser: { ...state.currentUser, ...updates } })),

      loginAsRole: (role: UserRole) => {
        if (role === "Admin") {
          set({ currentUser: adminUserPreset })
        } else {
          set({ currentUser: employeeUserPreset })
        }
      },

      changePassword: (newPassword: string) => {
        const currentId = get().currentUser.id
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            password: newPassword,
            temporaryPassword: undefined,
            mustChangePassword: false,
          },
          employees: state.employees.map((e) =>
            e.id === currentId
              ? {
                  ...e,
                  password: newPassword,
                  temporaryPassword: undefined,
                  mustChangePassword: false,
                }
              : e
          ),
        }))
        get().addAuditLog({
          actor: get().currentUser.name,
          action: "Security credentials updated (Password changed)",
          category: "Access & Auth",
          ip: "192.168.1.1",
          status: "Success",
        })
      },

      announcements: initialAnnouncements,
      addAnnouncement: (ann) => {
        const newAnn: Announcement = {
          id: `ANN-${Date.now()}`,
          time: "Just now",
          ...ann,
        }
        set((state) => ({
          announcements: [newAnn, ...state.announcements],
        }))
      },

  isClockedIn: true,
  clockInTime: "08:55 AM",
  todayWorkMinutes: 320,
  clockIn: () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    set({ isClockedIn: true, clockInTime: timeStr })
    get().addAttendanceRecord({
      employeeId: get().currentUser.id,
      employeeName: get().currentUser.name,
      department: get().currentUser.department,
      date: "Today",
      checkIn: timeStr,
      checkOut: "—",
      status: "On-Time",
      workHours: "Just started",
      overtime: "+0.0h",
      location: "Web Self-Service Punch",
      verified: true,
    })
    get().addAuditLog({
      actor: get().currentUser.name,
      action: `Self-Service Clock In recorded at ${timeStr}`,
      category: "Access & Auth",
      ip: "192.168.1.1",
      status: "Success",
    })
  },
  clockOut: () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    set({ isClockedIn: false })
    get().addAuditLog({
      actor: get().currentUser.name,
      action: `Self-Service Clock Out recorded at ${timeStr}`,
      category: "Access & Auth",
      ip: "192.168.1.1",
      status: "Success",
    })
  },

  leaveBalances: {
    annualLeave: { total: 20, used: 6 },
    sickLeave: { total: 10, used: 2 },
    casualLeave: { total: 5, used: 2 },
  },
  updateLeaveBalances: (updates) =>
    set((state) => ({ leaveBalances: { ...state.leaveBalances, ...updates } })),

  employees: initialEmployees,
  addEmployee: (emp) => {
    const id = `EMP-00${get().employees.length + 1}`
    const newEmp: Employee = { id, ...emp }
    set((state) => {
      const updatedDepts = state.departments.map((d) =>
        d.name === emp.department
          ? { ...d, employeeCount: d.employeeCount + 1 }
          : d
      )
      return {
        employees: [newEmp, ...state.employees],
        departments: updatedDepts,
      }
    })
    get().addAuditLog({
      actor: get().currentUser.name,
      action: `Created new employee profile: ${newEmp.name} (${newEmp.jobTitle} • Role: ${newEmp.role})`,
      category: "Employee Management",
      ip: "192.168.1.1",
      status: "Success",
    })
    return newEmp
  },
  updateEmployee: (id, updates) =>
    set((state) => ({
      employees: state.employees.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),
  deleteEmployee: (id) =>
    set((state) => {
      const emp = state.employees.find((e) => e.id === id)
      return {
        employees: state.employees.filter((e) => e.id !== id),
        departments: emp
          ? state.departments.map((d) =>
              d.name === emp.department
                ? { ...d, employeeCount: Math.max(0, d.employeeCount - 1) }
                : d
            )
          : state.departments,
      }
    }),

  departments: initialDepartments,
  addDepartment: (dept) => {
    const id = `DEP-00${get().departments.length + 1}`
    set((state) => ({
      departments: [...state.departments, { id, ...dept }],
    }))
  },
  updateDepartment: (id, updates) =>
    set((state) => ({
      departments: state.departments.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),
  deleteDepartment: (id) =>
    set((state) => ({
      departments: state.departments.filter((d) => d.id !== id),
    })),

  attendanceRecords: initialAttendance,
  addAttendanceRecord: (record) => {
    const id = `ATT-00${get().attendanceRecords.length + 1}`
    set((state) => ({
      attendanceRecords: [{ id, ...record }, ...state.attendanceRecords],
    }))
  },
  updateAttendanceStatus: (id, status) =>
    set((state) => ({
      attendanceRecords: state.attendanceRecords.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    })),

  leaveRequests: initialLeaves,
  submitLeaveRequest: (req) => {
    const id = `LV-2024-00${get().leaveRequests.length + 1}`
    const newLeave: LeaveRequest = {
      id,
      ...req,
      status: "Pending",
      appliedOn: "Today",
    }
    set((state) => ({
      leaveRequests: [newLeave, ...state.leaveRequests],
    }))
  },
  updateLeaveStatus: (id, status) =>
    set((state) => {
      const target = state.leaveRequests.find((l) => l.id === id)
      let updatedBalances = state.leaveBalances
      if (status === "Approved" && target && target.employeeName === state.currentUser.name) {
        if (target.leaveType === "Annual Leave") {
          updatedBalances = {
            ...state.leaveBalances,
            annualLeave: {
              ...state.leaveBalances.annualLeave,
              used: state.leaveBalances.annualLeave.used + target.days,
            },
          }
        } else if (target.leaveType === "Sick Leave") {
          updatedBalances = {
            ...state.leaveBalances,
            sickLeave: {
              ...state.leaveBalances.sickLeave,
              used: state.leaveBalances.sickLeave.used + target.days,
            },
          }
        }
      }

      return {
        leaveBalances: updatedBalances,
        leaveRequests: state.leaveRequests.map((l) =>
          l.id === id
            ? { ...l, status, reviewer: get().currentUser.name }
            : l
        ),
      }
    }),

  expenseClaims: initialExpenseClaims,
  submitExpenseClaim: (claim) => {
    const id = `EXP-${200 + get().expenseClaims.length + 1}`
    const newClaim: ExpenseClaim = {
      id,
      ...claim,
      date: "Today",
      status: "Pending",
    }
    set((state) => ({
      expenseClaims: [newClaim, ...state.expenseClaims],
    }))
  },
  updateExpenseClaimStatus: (id, status) =>
    set((state) => ({
      expenseClaims: state.expenseClaims.map((c) =>
        c.id === id ? { ...c, status } : c
      ),
    })),

  personalGoals: initialPersonalGoals,
  updatePersonalGoalProgress: (id, progress) =>
    set((state) => ({
      personalGoals: state.personalGoals.map((g) =>
        g.id === id
          ? {
              ...g,
              currentProgress: progress,
              status: progress >= 100 ? "Completed" : progress >= 50 ? "On Track" : "At Risk",
            }
          : g
      ),
    })),

  employeeDocuments: initialEmployeeDocuments,

  tickets: initialTickets,
  submitTicket: (ticket) => {
    const id = `TCK-${8920 + get().tickets.length + 1}`
    set((state) => ({
      tickets: [
        {
          id,
          ...ticket,
          submittedAt: "Just now",
          responses: 0,
        },
        ...state.tickets,
      ],
    }))
  },
  updateTicketStatus: (id, status) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),

  auditLogs: initialAuditLogs,
  addAuditLog: (log) => {
    const id = `AUD-${100 + get().auditLogs.length + 1}`
    set((state) => ({
      auditLogs: [{ id, timestamp: "Just now", ...log }, ...state.auditLogs],
    }))
  },

  settings: {
    companyName: "EMS Enterprise Corp",
    companyDomain: "ems.company",
    supportEmail: "support@ems.company",
    timezone: "America/New_York (EST)",
    currency: "USD ($)",
    twoFactorEnforced: true,
    sessionTimeoutMinutes: 30,
    autoApproveLeavesBelowDays: 1,
    emailNotificationsEnabled: true,
  },
  updateSettings: (updates) =>
    set((state) => ({
      settings: { ...state.settings, ...updates },
    })),
    }),
    {
      name: "ems-enterprise-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        isClockedIn: state.isClockedIn,
        clockInTime: state.clockInTime,
        todayWorkMinutes: state.todayWorkMinutes,
        leaveBalances: state.leaveBalances,
        employees: state.employees,
        departments: state.departments,
        attendanceRecords: state.attendanceRecords,
        leaveRequests: state.leaveRequests,
        announcements: state.announcements,
        expenseClaims: state.expenseClaims,
        personalGoals: state.personalGoals,
        tickets: state.tickets,
        auditLogs: state.auditLogs,
        settings: state.settings,
      }),
    }
  )
)
