import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import {
  supabaseSignOut,
  supabaseGetSession,
  fetchCurrentProfile,
  fetchSupabaseEmployees,
  fetchSupabaseDepartments,
  fetchSupabaseAttendance,
  fetchSupabaseLeaves,
  fetchSupabaseAnnouncements,
  fetchSupabaseTickets,
  fetchSupabaseLeaveBalances,
  fetchSupabasePersonalGoals,
  fetchSupabaseAuditLogs,
  createSupabaseDepartment,
  updateSupabaseDepartment,
  deleteSupabaseDepartment,
  updateSupabaseProfile,
  deleteSupabaseProfile,
  createSupabaseAttendanceRecord,
  createSupabaseLeaveRequest,
  updateSupabaseLeaveStatus,
  createSupabaseAnnouncement,
  createSupabaseTicket,
  updateSupabaseTicketStatus,
  createSupabaseAuditLog,
} from "@/lib/supabase-service"
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
  // Authentication & Session
  isAuthenticated: boolean
  isLoadingAuth: boolean
  setIsAuthenticated: (val: boolean) => void
  setIsLoadingAuth: (val: boolean) => void
  initializeAuth: () => Promise<void>
  logout: () => Promise<void>
  syncFromSupabase: () => Promise<void>

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
  submitTicket: (ticket: {
    title: string
    category: SupportTicket["category"]
    priority: SupportTicket["priority"]
    department?: string
    description: string
    status?: SupportTicket["status"]
    submittedBy?: string
    assignee?: string
  }) => void
  updateTicketStatus: (id: string, status: SupportTicket["status"]) => void

  // Audit Logs
  auditLogs: AuditLog[]
  addAuditLog: (log: Omit<AuditLog, "id" | "timestamp">) => void

  // System Settings
  settings: SystemSettings
  updateSettings: (updates: Partial<SystemSettings>) => void
}

const defaultCurrentUser: CurrentUser = {
  id: "USR-001",
  name: "User",
  email: "user@ems.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
  role: "Employee",
  userRole: "Employee",
  jobTitle: "Team Member",
  title: "Team Member",
  department: "General",
  phone: "",
  location: "Headquarters",
  joinedDate: "2026-01-01",
  salaryBand: undefined,
  manager: undefined,
}

export const useEMSStore = create<EMSStoreState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoadingAuth: true,
      setIsAuthenticated: (val: boolean) => set({ isAuthenticated: val }),
      setIsLoadingAuth: (val: boolean) => set({ isLoadingAuth: val }),

      initializeAuth: async () => {
        set({ isLoadingAuth: true })
        if (!isSupabaseConfigured) {
          set({ isLoadingAuth: false })
          return
        }

        try {
          const { session } = await supabaseGetSession()
          if (session?.user) {
            const profile = await fetchCurrentProfile(session.user.id)
            if (profile) {
              set({
                currentUser: profile,
                isAuthenticated: true,
                isLoadingAuth: false,
              })
            } else {
              set({
                currentUser: {
                  ...defaultCurrentUser,
                  id: session.user.id,
                  email: session.user.email || "",
                  name: session.user.email?.split("@")[0] || "User",
                },
                isAuthenticated: true,
                isLoadingAuth: false,
              })
            }
            // Fetch live database records
            await get().syncFromSupabase()
          } else {
            set({
              isAuthenticated: false,
              isLoadingAuth: false,
            })
          }

          // Register reactive auth state change listener
          supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (event === "SIGNED_IN" && currentSession?.user) {
              const profile = await fetchCurrentProfile(currentSession.user.id)
              if (profile) {
                set({ currentUser: profile, isAuthenticated: true, isLoadingAuth: false })
              }
              get().syncFromSupabase().catch(() => {})
            } else if (event === "SIGNED_OUT") {
              set({
                currentUser: defaultCurrentUser,
                isAuthenticated: false,
                isLoadingAuth: false,
                employees: [],
                departments: [],
                attendanceRecords: [],
                leaveRequests: [],
                announcements: [],
                tickets: [],
                personalGoals: [],
                auditLogs: [],
              })
            }
          })
        } catch (err) {
          console.warn("Auth initialization error:", err)
          set({ isLoadingAuth: false })
        }
      },

      logout: async () => {
        if (isSupabaseConfigured) {
          try {
            await supabaseSignOut()
          } catch (err) {
            console.error("Supabase logout error:", err)
          }
        }
        set({
          isAuthenticated: false,
          currentUser: defaultCurrentUser,
          employees: [],
          departments: [],
          attendanceRecords: [],
          leaveRequests: [],
          announcements: [],
          tickets: [],
          personalGoals: [],
          auditLogs: [],
        })
      },

      syncFromSupabase: async () => {
        if (!isSupabaseConfigured) return
        try {
          const [emps, depts, att, leaves, anns, tcks, balance, goals, logs] = await Promise.all([
            fetchSupabaseEmployees(),
            fetchSupabaseDepartments(),
            fetchSupabaseAttendance(),
            fetchSupabaseLeaves(),
            fetchSupabaseAnnouncements(),
            fetchSupabaseTickets(),
            fetchSupabaseLeaveBalances(),
            fetchSupabasePersonalGoals(),
            fetchSupabaseAuditLogs(),
          ])

          set((state) => ({
            employees: emps || [],
            departments: depts || [],
            attendanceRecords: att || [],
            leaveRequests: leaves || [],
            announcements: anns || [],
            tickets: tcks || [],
            leaveBalances: balance || state.leaveBalances,
            personalGoals: goals || [],
            auditLogs: logs || [],
          }))
        } catch (err) {
          console.warn("Supabase data synchronization error:", err)
        }
      },

      currentUser: defaultCurrentUser,
      setCurrentUser: (updates) =>
        set((state) => ({ currentUser: { ...state.currentUser, ...updates } })),

      loginAsRole: (role: UserRole) => {
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            role,
            userRole: role,
          },
          isAuthenticated: true,
        }))
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

      announcements: [],
      addAnnouncement: (ann) => {
        const newAnn: Announcement = {
          id: `ANN-${Date.now()}`,
          time: "Just now",
          ...ann,
        }
        set((state) => ({
          announcements: [newAnn, ...state.announcements],
        }))
        // Persist to Supabase
        createSupabaseAnnouncement({
          title: ann.title,
          content: ann.content,
          authorName: ann.author,
          priority: ann.priority,
        }).catch(() => {})
      },

      isClockedIn: false,
      clockInTime: null,
      todayWorkMinutes: 0,
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
        createSupabaseAttendanceRecord({
          status: "On Time",
          location: "Web Self-Service Punch",
          notes: `Clock in at ${timeStr}`,
        }).catch(() => {})
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
        annualLeave: { total: 20, used: 0 },
        sickLeave: { total: 10, used: 0 },
        casualLeave: { total: 5, used: 0 },
      },
      updateLeaveBalances: (updates) =>
        set((state) => ({ leaveBalances: { ...state.leaveBalances, ...updates } })),

      employees: [],
      addEmployee: (emp) => {
        const id = `EMP-${Math.floor(1000 + Math.random() * 9000)}`
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
        updateSupabaseProfile(id, newEmp).catch(() => {})
        get().addAuditLog({
          actor: get().currentUser.name,
          action: `Created employee profile: ${newEmp.name} (${newEmp.jobTitle} • Role: ${newEmp.role})`,
          category: "Employee Management",
          ip: "192.168.1.1",
          status: "Success",
        })
        return newEmp
      },
      updateEmployee: (id, updates) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }))
        updateSupabaseProfile(id, updates).catch(() => {})
      },
      deleteEmployee: (id) => {
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
        })
        deleteSupabaseProfile(id).catch(() => {})
      },

      departments: [],
      addDepartment: (dept) => {
        const id = `DEP-${Date.now()}`
        set((state) => ({
          departments: [...state.departments, { id, ...dept }],
        }))
        createSupabaseDepartment(dept).catch(() => {})
      },
      updateDepartment: (id, updates) => {
        set((state) => ({
          departments: state.departments.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        }))
        updateSupabaseDepartment(id, updates).catch(() => {})
      },
      deleteDepartment: (id) => {
        set((state) => ({
          departments: state.departments.filter((d) => d.id !== id),
        }))
        deleteSupabaseDepartment(id).catch(() => {})
      },

      attendanceRecords: [],
      addAttendanceRecord: (record) => {
        const id = `ATT-${Date.now()}`
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

      leaveRequests: [],
      submitLeaveRequest: (req) => {
        const id = `LV-${Date.now()}`
        const newLeave: LeaveRequest = {
          id,
          ...req,
          status: "Pending",
          appliedOn: new Date().toISOString().split("T")[0],
        }
        set((state) => ({
          leaveRequests: [newLeave, ...state.leaveRequests],
        }))
        createSupabaseLeaveRequest({
          leaveType: req.leaveType,
          startDate: req.startDate,
          endDate: req.endDate,
          days: req.days,
          reason: req.reason,
        }).catch(() => {})
      },
      updateLeaveStatus: (id, status) => {
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
        })
        updateSupabaseLeaveStatus(id, status).catch(() => {})
      },

      expenseClaims: [],
      submitExpenseClaim: (claim) => {
        const id = `EXP-${Date.now()}`
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

      personalGoals: [],
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

      employeeDocuments: [],

      tickets: [],
      submitTicket: (ticket) => {
        const id = `TCK-${Date.now()}`
        const user = get().currentUser
        const newTicket: SupportTicket = {
          id,
          title: ticket.title,
          category: ticket.category,
          priority: ticket.priority,
          department: ticket.department || user.department || "General",
          description: ticket.description,
          status: ticket.status || "Open",
          submittedBy: ticket.submittedBy || user.name || "Employee",
          assignee: ticket.assignee || "IT Helpdesk",
          submittedAt: "Just now",
          responses: 0,
        }
        set((state) => ({
          tickets: [newTicket, ...state.tickets],
        }))
        createSupabaseTicket({
          subject: ticket.title,
          category: ticket.category,
          priority: ticket.priority,
          description: ticket.description,
        }).catch(() => {})
      },
      updateTicketStatus: (id, status) => {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id ? { ...t, status } : t
          ),
        }))
        updateSupabaseTicketStatus(id, status).catch(() => {})
      },

      auditLogs: [],
      addAuditLog: (log) => {
        const id = `AUD-${Date.now()}`
        set((state) => ({
          auditLogs: [{ id, timestamp: "Just now", ...log }, ...state.auditLogs],
        }))
        createSupabaseAuditLog({
          actorName: log.actor,
          action: log.action,
          entityType: log.category,
          ipAddress: log.ip,
        }).catch(() => {})
      },

      settings: {
        companyName: "EMS Enterprise Corp",
        companyDomain: "ems.com",
        supportEmail: "support@ems.com",
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
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        isClockedIn: state.isClockedIn,
        clockInTime: state.clockInTime,
        todayWorkMinutes: state.todayWorkMinutes,
        leaveBalances: state.leaveBalances,
        settings: state.settings,
      }),
    }
  )
)
