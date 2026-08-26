export type UserRole = "Admin" | "Employee"

export interface CurrentUser {
  id: string
  name: string
  email: string
  avatar: string
  role: UserRole
  jobTitle: string
  title?: string
  department: string
  phone: string
  location: string
  joinedDate: string
  salaryBand?: string
  manager?: string
  bio?: string
  userRole?: UserRole
  password?: string
  temporaryPassword?: string
  mustChangePassword?: boolean
}

export interface Employee {
  id: string
  name: string
  jobTitle: string
  role: UserRole
  department: string
  employmentType: "Full-time" | "Contract" | "Part-time"
  status: "Active" | "On Leave" | "Remote" | "Inactive"
  email: string
  phone: string
  location: string
  joinedDate: string
  avatar?: string
  manager?: string
  salaryBand?: string
  bio?: string
  temporaryPassword?: string
  password?: string
  mustChangePassword?: boolean
}

export interface Department {
  id: string
  name: string
  code: string
  head: string
  headAvatar?: string
  employeeCount: number
  budget: string
  color: string
  description: string
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  date: string
  checkIn: string
  checkOut: string
  status: "On-Time" | "Late" | "Remote" | "Absent" | "Half-Day"
  workHours: string
  overtime: string
  location: string
  verified: boolean
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  department: string
  leaveType: "Annual Leave" | "Sick Leave" | "Parental" | "Casual Leave" | "Emergency" | "Unpaid"
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "Pending" | "Approved" | "Rejected"
  appliedOn: string
  reviewer?: string
  attachmentName?: string
}

export interface SupportTicket {
  id: string
  title: string
  category: "Payroll & Compensation" | "Benefits & Insurance" | "IT & Hardware" | "Workplace & Facilities" | "HR Policies"
  priority: "High" | "Medium" | "Urgent" | "Low"
  status: "In Review" | "Open" | "Resolved"
  submittedBy: string
  submittedAt: string
  department: string
  assignee: string
  responses: number
  description: string
}

export interface AuditLog {
  id: string
  actor: string
  avatar?: string
  action: string
  category: "Access & Auth" | "Employee Management" | "Payroll" | "Permissions" | "System Config"
  timestamp: string
  ip: string
  status: "Success" | "Flagged" | "Failed"
}

export interface SystemSettings {
  companyName: string
  companyDomain: string
  supportEmail: string
  timezone: string
  currency: string
  twoFactorEnforced: boolean
  sessionTimeoutMinutes: number
  autoApproveLeavesBelowDays: number
  emailNotificationsEnabled: boolean
}

export interface ExpenseClaim {
  id: string
  employeeId: string
  employeeName: string
  title: string
  category: "Travel & Mileage" | "Meals & Entertainment" | "Software & Equipment" | "Learning & Training" | "Other"
  amount: number
  currency: string
  date: string
  status: "Pending" | "Approved" | "Reimbursed" | "Rejected"
  receiptName?: string
  notes?: string
}

export interface EmployeeDocument {
  id: string
  name: string
  category: "Contracts" | "Tax & Finance" | "Certifications" | "Benefits & Policies"
  size: string
  date: string
  downloadUrl?: string
}

export interface LeaveBalance {
  annualLeave: { total: number; used: number }
  sickLeave: { total: number; used: number }
  casualLeave: { total: number; used: number }
}

export interface PersonalGoal {
  id: string
  title: string
  category: string
  targetMetric: string
  currentProgress: number
  dueDate: string
  status: "On Track" | "At Risk" | "Completed"
}

export interface Announcement {
  id: string
  title: string
  content: string
  author: string
  time: string
  priority: "high" | "normal"
}
