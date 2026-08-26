import { supabase, isSupabaseConfigured } from "./supabase"
import type {
  CurrentUser,
  Employee,
  Department,
  AttendanceRecord,
  LeaveRequest,
  SupportTicket,
  Announcement,
  LeaveBalance,
  PersonalGoal,
  AuditLog,
} from "@/store/types"

/**
 * Supabase Data & Auth Service Layer
 * Provides typed functions to interact with Supabase backend.
 */

// ==============================================================================
// AUTHENTICATION
// ==============================================================================

export async function supabaseSignIn(email: string, password: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error("Supabase is not configured in .env") }
  }
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function supabaseSignUp(
  email: string,
  password: string,
  metadata?: { name?: string; role?: "Admin" | "Employee"; jobTitle?: string }
) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error("Supabase is not configured in .env") }
  }
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
}

export async function supabaseSignOut() {
  if (!isSupabaseConfigured) return { error: null }
  return await supabase.auth.signOut()
}

export async function supabaseGetSession() {
  if (!isSupabaseConfigured) return { session: null }
  const { data } = await supabase.auth.getSession()
  return { session: data.session }
}

export async function fetchCurrentProfile(userId: string): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured) return null
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (error || !data) return null

    return {
      id: data.employee_id || data.id,
      name: data.name || "User",
      email: data.email,
      role: (data.role as "Admin" | "Employee") || "Employee",
      userRole: (data.role as "Admin" | "Employee") || "Employee",
      jobTitle: data.job_title || data.title || "Team Member",
      title: data.title || data.job_title || "Team Member",
      department: data.department_name || "General",
      phone: data.phone || "",
      location: data.location || "San Francisco, CA (HQ)",
      avatar: data.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
      joinedDate: data.joining_date || "2026-01-01",
      salaryBand: data.salary ? `$${Number(data.salary).toLocaleString()}/yr` : undefined,
      manager: data.manager_name || undefined,
      bio: data.bio || undefined,
    }
  } catch {
    return null
  }
}

// ==============================================================================
// EMPLOYEES & PROFILES
// ==============================================================================

export async function fetchSupabaseEmployees(): Promise<Employee[]> {
  if (!isSupabaseConfigured) return []
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (error || !data) return []

    return data.map((p) => ({
      id: p.employee_id || p.id,
      name: p.name,
      jobTitle: p.job_title || p.title || "Staff",
      role: (p.role as "Admin" | "Employee") || "Employee",
      department: p.department_name || "General",
      employmentType: (p.employment_type as "Full-time" | "Contract" | "Part-time") || "Full-time",
      status: (p.status as "Active" | "On Leave" | "Remote" | "Inactive") || "Active",
      email: p.email,
      phone: p.phone || "",
      location: p.location || "San Francisco, CA (HQ)",
      joinedDate: p.joining_date || "2026-01-01",
      avatar: p.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
      salaryBand: p.salary ? `$${Number(p.salary).toLocaleString()}/yr` : undefined,
      manager: p.manager_name || undefined,
      bio: p.bio || undefined,
    }))
  } catch {
    return []
  }
}

export async function updateSupabaseProfile(
  identifier: string,
  updates: Partial<Employee>
) {
  if (!isSupabaseConfigured) return null
  try {
    const dbUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.jobTitle !== undefined) {
      dbUpdates.job_title = updates.jobTitle
      dbUpdates.title = updates.jobTitle
    }
    if (updates.role !== undefined) dbUpdates.role = updates.role
    if (updates.department !== undefined) dbUpdates.department_name = updates.department
    if (updates.employmentType !== undefined) dbUpdates.employment_type = updates.employmentType
    if (updates.status !== undefined) dbUpdates.status = updates.status
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone
    if (updates.location !== undefined) dbUpdates.location = updates.location
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio
    if (updates.manager !== undefined) dbUpdates.manager_name = updates.manager

    const { data, error } = await supabase
      .from("profiles")
      .update(dbUpdates)
      .or(`id.eq.${identifier},employee_id.eq.${identifier}`)
      .select()
      .single()

    if (error) console.warn("Supabase updateProfile error:", error)
    return data
  } catch (err) {
    console.warn("Supabase updateProfile exception:", err)
    return null
  }
}

export async function deleteSupabaseProfile(identifier: string) {
  if (!isSupabaseConfigured) return null
  try {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .or(`id.eq.${identifier},employee_id.eq.${identifier}`)

    if (error) console.warn("Supabase deleteProfile error:", error)
    return !error
  } catch {
    return false
  }
}

// ==============================================================================
// DEPARTMENTS
// ==============================================================================

export async function fetchSupabaseDepartments(): Promise<Department[]> {
  if (!isSupabaseConfigured) return []
  try {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .order("name", { ascending: true })

    if (error || !data) return []

    return data.map((d) => ({
      id: d.id,
      name: d.name,
      code: d.code,
      head: d.head_name || "Department Lead",
      headAvatar: d.head_avatar || undefined,
      employeeCount: d.employee_count || 0,
      budget: `$${Number(d.budget || 0).toLocaleString()}`,
      color: "bg-blue-500",
      description: d.description || "",
    }))
  } catch {
    return []
  }
}

export async function createSupabaseDepartment(dept: Omit<Department, "id">) {
  if (!isSupabaseConfigured) return null
  try {
    const rawBudget = typeof dept.budget === "string" ? Number(dept.budget.replace(/[^0-9.-]+/g, "")) : 0
    const { data, error } = await supabase
      .from("departments")
      .insert({
        name: dept.name,
        code: dept.code,
        head_name: dept.head,
        head_avatar: dept.headAvatar,
        employee_count: dept.employeeCount || 0,
        budget: rawBudget,
        description: dept.description,
      })
      .select()
      .single()

    if (error) console.warn("Supabase createDepartment error:", error)
    return data
  } catch {
    return null
  }
}

export async function updateSupabaseDepartment(id: string, updates: Partial<Department>) {
  if (!isSupabaseConfigured) return null
  try {
    const dbUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.code !== undefined) dbUpdates.code = updates.code
    if (updates.head !== undefined) dbUpdates.head_name = updates.head
    if (updates.headAvatar !== undefined) dbUpdates.head_avatar = updates.headAvatar
    if (updates.employeeCount !== undefined) dbUpdates.employee_count = updates.employeeCount
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.budget !== undefined) {
      dbUpdates.budget = typeof updates.budget === "string" ? Number(updates.budget.replace(/[^0-9.-]+/g, "")) : updates.budget
    }

    const { data, error } = await supabase
      .from("departments")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single()

    if (error) console.warn("Supabase updateDepartment error:", error)
    return data
  } catch {
    return null
  }
}

export async function deleteSupabaseDepartment(id: string) {
  if (!isSupabaseConfigured) return false
  try {
    const { error } = await supabase.from("departments").delete().eq("id", id)
    return !error
  } catch {
    return false
  }
}

// ==============================================================================
// ATTENDANCE
// ==============================================================================

export async function fetchSupabaseAttendance(): Promise<AttendanceRecord[]> {
  if (!isSupabaseConfigured) return []
  try {
    const { data, error } = await supabase
      .from("attendance_records")
      .select("*, profiles(name, department_name, employee_id)")
      .order("date", { ascending: false })

    if (error || !data) return []

    return data.map((a) => {
      const p = a.profiles as { employee_id?: string; name?: string; department_name?: string } | null
      return {
        id: a.id,
        employeeId: p?.employee_id || a.user_id,
        employeeName: p?.name || "Employee",
        department: p?.department_name || "Engineering",
        date: a.date,
        checkIn: a.check_in ? new Date(a.check_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--",
        checkOut: a.check_out ? new Date(a.check_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—",
        status: (a.status as "On-Time" | "Late" | "Remote" | "Absent" | "Half-Day") || "On-Time",
        workHours: a.work_hours ? `${a.work_hours} hrs` : "0.0 hrs",
        overtime: "+0.0h",
        location: a.location || "Office HQ",
        verified: true,
      }
    })
  } catch {
    return []
  }
}

export async function createSupabaseAttendanceRecord(record: {
  userId?: string
  status?: string
  location?: string
  checkIn?: string
  notes?: string
}) {
  if (!isSupabaseConfigured) return null
  try {
    const { data: authData } = await supabase.auth.getUser()
    const targetUserId = record.userId || authData.user?.id
    if (!targetUserId) return null

    const { data, error } = await supabase
      .from("attendance_records")
      .upsert(
        {
          user_id: targetUserId,
          date: new Date().toISOString().split("T")[0],
          check_in: new Date().toISOString(),
          status: record.status || "On Time",
          location: record.location || "Office HQ",
          notes: record.notes,
        },
        { onConflict: "user_id,date" }
      )
      .select()
      .single()

    if (error) console.warn("Supabase recordAttendance error:", error)
    return data
  } catch {
    return null
  }
}

// ==============================================================================
// LEAVE REQUESTS & BALANCES
// ==============================================================================

export async function fetchSupabaseLeaves(): Promise<LeaveRequest[]> {
  if (!isSupabaseConfigured) return []
  try {
    const { data, error } = await supabase
      .from("leave_requests")
      .select("*, profiles(name, department_name, employee_id)")
      .order("applied_on", { ascending: false })

    if (error || !data) return []

    return data.map((l) => {
      const p = l.profiles as { employee_id?: string; name?: string; department_name?: string } | null
      return {
        id: l.id,
        employeeId: p?.employee_id || l.user_id,
        employeeName: p?.name || "Employee",
        department: p?.department_name || "Engineering",
        leaveType: (l.leave_type as "Annual Leave" | "Sick Leave" | "Parental" | "Casual Leave" | "Emergency" | "Unpaid") || "Annual Leave",
        startDate: l.start_date,
        endDate: l.end_date,
        days: l.days,
        reason: l.reason,
        status: (l.status as "Pending" | "Approved" | "Rejected") || "Pending",
        appliedOn: l.applied_on ? new Date(l.applied_on).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      }
    })
  } catch {
    return []
  }
}

export async function createSupabaseLeaveRequest(leave: {
  leaveType: string
  startDate: string
  endDate: string
  days: number
  reason: string
}) {
  if (!isSupabaseConfigured) return null
  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user?.id) return null

    const { data, error } = await supabase
      .from("leave_requests")
      .insert({
        user_id: authData.user.id,
        leave_type: leave.leaveType,
        start_date: leave.startDate,
        end_date: leave.endDate,
        days: leave.days,
        reason: leave.reason,
        status: "Pending",
      })
      .select()
      .single()

    if (error) console.warn("Supabase createLeaveRequest error:", error)
    return data
  } catch {
    return null
  }
}

export async function updateSupabaseLeaveStatus(
  id: string,
  status: "Approved" | "Rejected",
  reviewerId?: string
) {
  if (!isSupabaseConfigured) return null
  try {
    const { data, error } = await supabase
      .from("leave_requests")
      .update({
        status,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) console.warn("Supabase updateLeaveStatus error:", error)
    return data
  } catch {
    return null
  }
}

export async function fetchSupabaseLeaveBalances(userId?: string): Promise<LeaveBalance | null> {
  if (!isSupabaseConfigured) return null
  try {
    let targetId = userId
    if (!targetId) {
      const { data: authData } = await supabase.auth.getUser()
      targetId = authData.user?.id
    }
    if (!targetId) return null

    const { data, error } = await supabase
      .from("leave_balances")
      .select("*")
      .eq("user_id", targetId)
      .single()

    if (error || !data) return null

    return {
      annualLeave: { total: data.annual_total || 20, used: data.annual_used || 0 },
      sickLeave: { total: data.sick_total || 10, used: data.sick_used || 0 },
      casualLeave: { total: data.casual_total || 5, used: data.casual_used || 0 },
    }
  } catch {
    return null
  }
}

// ==============================================================================
// ANNOUNCEMENTS
// ==============================================================================

export async function fetchSupabaseAnnouncements(): Promise<Announcement[]> {
  if (!isSupabaseConfigured) return []
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })

    if (error || !data) return []

    return data.map((ann) => ({
      id: ann.id,
      title: ann.title,
      content: ann.content,
      author: ann.author_name || "HR Operations",
      time: ann.created_at ? new Date(ann.created_at).toLocaleDateString() : "Today",
      priority: (ann.priority?.toLowerCase() === "high" || ann.priority?.toLowerCase() === "urgent") ? "high" : "normal",
    }))
  } catch {
    return []
  }
}

export async function createSupabaseAnnouncement(ann: {
  title: string
  content: string
  authorName?: string
  priority?: string
  category?: string
}) {
  if (!isSupabaseConfigured) return null
  try {
    const { data: authData } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from("announcements")
      .insert({
        title: ann.title,
        content: ann.content,
        author_id: authData.user?.id,
        author_name: ann.authorName || "Operations",
        priority: ann.priority || "Normal",
        category: ann.category || "General",
      })
      .select()
      .single()

    if (error) console.warn("Supabase createAnnouncement error:", error)
    return data
  } catch {
    return null
  }
}

// ==============================================================================
// SUPPORT TICKETS
// ==============================================================================

export async function fetchSupabaseTickets(): Promise<SupportTicket[]> {
  if (!isSupabaseConfigured) return []
  try {
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*, profiles(name, department_name)")
      .order("created_at", { ascending: false })

    if (error || !data) return []

    return data.map((t) => {
      const p = t.profiles as { name?: string; department_name?: string } | null
      return {
        id: t.ticket_number || t.id,
        title: t.subject,
        category: (t.category as "Payroll & Compensation" | "Benefits & Insurance" | "IT & Hardware" | "Workplace & Facilities" | "HR Policies") || "IT & Hardware",
        priority: (t.priority as "High" | "Medium" | "Urgent" | "Low") || "Medium",
        status: t.status === "Resolved" ? "Resolved" : t.status === "In Progress" ? "In Review" : "Open",
        submittedBy: p?.name || "Employee",
        submittedAt: t.created_at ? new Date(t.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        department: p?.department_name || "General",
        assignee: "IT Helpdesk",
        responses: Array.isArray(t.responses) ? t.responses.length : 0,
        description: t.description || "",
      }
    })
  } catch {
    return []
  }
}

export async function createSupabaseTicket(ticket: {
  subject: string
  category: string
  priority: string
  description: string
}) {
  if (!isSupabaseConfigured) return null
  try {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user?.id) return null

    const ticketNumber = `TCK-${Math.floor(1000 + Math.random() * 9000)}`

    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        ticket_number: ticketNumber,
        user_id: authData.user.id,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: "Open",
        description: ticket.description,
        responses: [],
      })
      .select()
      .single()

    if (error) console.warn("Supabase createTicket error:", error)
    return data
  } catch {
    return null
  }
}

export async function updateSupabaseTicketStatus(id: string, status: string) {
  if (!isSupabaseConfigured) return null
  try {
    const { data, error } = await supabase
      .from("support_tickets")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .or(`id.eq.${id},ticket_number.eq.${id}`)
      .select()
      .single()

    if (error) console.warn("Supabase updateTicketStatus error:", error)
    return data
  } catch {
    return null
  }
}

// ==============================================================================
// PERSONAL GOALS & AUDIT LOGS
// ==============================================================================

export async function fetchSupabasePersonalGoals(userId?: string): Promise<PersonalGoal[]> {
  if (!isSupabaseConfigured) return []
  try {
    let query = supabase.from("personal_goals").select("*").order("created_at", { ascending: false })
    if (userId) query = query.eq("user_id", userId)
    const { data, error } = await query

    if (error || !data) return []

    return data.map((g) => ({
      id: g.id,
      title: g.title,
      category: g.category || "Professional Growth",
      targetMetric: g.title,
      currentProgress: g.progress || 0,
      dueDate: g.target_date || "2026-12-31",
      status: (g.status as "On Track" | "At Risk" | "Completed") || "On Track",
    }))
  } catch {
    return []
  }
}

export async function fetchSupabaseAuditLogs(): Promise<AuditLog[]> {
  if (!isSupabaseConfigured) return []
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (error || !data) return []

    return data.map((l) => ({
      id: l.id,
      actor: l.actor_name || "System",
      action: l.action,
      category: l.entity_type || "System",
      timestamp: l.created_at ? new Date(l.created_at).toLocaleTimeString() : "Just now",
      ip: l.ip_address || "127.0.0.1",
      status: "Success",
    }))
  } catch {
    return []
  }
}

export async function createSupabaseAuditLog(log: {
  actorName: string
  actorEmail?: string
  action: string
  entityType: string
  entityId?: string
  ipAddress?: string
}) {
  if (!isSupabaseConfigured) return null
  try {
    const { data: authData } = await supabase.auth.getUser()
    const { data, error } = await supabase.from("audit_logs").insert({
      user_id: authData.user?.id,
      actor_name: log.actorName,
      actor_email: log.actorEmail || "user@ems.company",
      action: log.action,
      entity_type: log.entityType,
      entity_id: log.entityId,
      ip_address: log.ipAddress || "127.0.0.1",
    })

    if (error) console.warn("Supabase auditLog error:", error)
    return data
  } catch {
    return null
  }
}
