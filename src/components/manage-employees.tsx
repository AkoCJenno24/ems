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
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  Edit2,
  Trash2,
  Eye,
  Archive,
  RotateCcw,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  UserCheck,
  Clock,
  Shield,
} from "lucide-react"
import {
  IconUsers,
  IconUserPlus,
  IconUserCheck,
  IconUserOff,
} from "@tabler/icons-react"

export interface Employee {
  id: string
  name: string
  jobTitle: string
  role: "Admin" | "Employee"
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
}

export const initialEmployeeList: Employee[] = [
  {
    id: "EMP-001",
    name: "Alex Morgan",
    jobTitle: "Senior Fullstack Engineer",
    role: "Admin",
    department: "Engineering",
    employmentType: "Full-time",
    status: "Active",
    email: "alex.morgan@ems.company",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA (HQ)",
    joinedDate: "Jan 15, 2023",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80",
    manager: "David Vance",
    salaryBand: "L5 - Senior",
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
    email: "sarah.chen@ems.company",
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
    status: "Remote",
    email: "marcus.vance@ems.company",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX (Remote)",
    joinedDate: "Jun 11, 2023",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&dpr=2&q=80",
    manager: "Alex Morgan",
    salaryBand: "L6 - Staff",
    bio: "Maintains Kubernetes clusters, Terraform clouds, and CI/CD pipelines.",
  },
  {
    id: "EMP-004",
    name: "Elena Rostova",
    jobTitle: "HR Operations Lead",
    role: "Admin",
    department: "People & Culture",
    employmentType: "Full-time",
    status: "On Leave",
    email: "elena.rostova@ems.company",
    phone: "+1 (555) 567-8901",
    location: "San Francisco, CA (HQ)",
    joinedDate: "Nov 04, 2023",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&dpr=2&q=80",
    manager: "Jessica Alba",
    salaryBand: "L4 - Specialist",
    bio: "Oversees employee lifecycle, payroll coordination, and talent engagement.",
  },
  {
    id: "EMP-005",
    name: "David Kim",
    jobTitle: "Frontend Engineer",
    role: "Employee",
    department: "Engineering",
    employmentType: "Full-time",
    status: "Active",
    email: "david.kim@ems.company",
    phone: "+1 (555) 678-9012",
    location: "Seattle, WA",
    joinedDate: "Feb 20, 2024",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&dpr=2&q=80",
    manager: "Alex Morgan",
    salaryBand: "L3 - Mid-level",
    bio: "Specializes in React, Next.js, and performant user interface rendering.",
  },
  {
    id: "EMP-006",
    name: "Sophia Martinez",
    jobTitle: "Payroll Specialist",
    role: "Employee",
    department: "Finance",
    employmentType: "Full-time",
    status: "Active",
    email: "sophia.martinez@ems.company",
    phone: "+1 (555) 789-0123",
    location: "Chicago, IL",
    joinedDate: "May 10, 2024",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&dpr=2&q=80",
    manager: "Robert Thorne",
    salaryBand: "L3 - Specialist",
    bio: "Administers corporate salary disbursement, tax withholdings, and benefit plans.",
  },
  {
    id: "EMP-007",
    name: "Lucas Wright",
    jobTitle: "Growth Marketing Manager",
    role: "Employee",
    department: "Sales & Marketing",
    employmentType: "Full-time",
    status: "Active",
    email: "lucas.wright@ems.company",
    phone: "+1 (555) 890-1234",
    location: "New York, NY",
    joinedDate: "Jul 18, 2024",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=128&h=128&dpr=2&q=80",
    manager: "Clara Oswald",
    salaryBand: "L4 - Manager",
    bio: "Executes enterprise account-based marketing and omni-channel acquisition.",
  },
  {
    id: "EMP-008",
    name: "Maya Lin",
    jobTitle: "QA Automation Engineer",
    role: "Employee",
    department: "Engineering",
    employmentType: "Contract",
    status: "Remote",
    email: "maya.lin@ems.company",
    phone: "+1 (555) 901-2345",
    location: "Toronto, Canada (Remote)",
    joinedDate: "Sep 05, 2024",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&dpr=2&q=80",
    manager: "Alex Morgan",
    salaryBand: "Contractor",
    bio: "Maintains end-to-end Playwright tests and Cypress regression suites.",
  },
  {
    id: "EMP-009",
    name: "Jonathan Reed",
    jobTitle: "Security Compliance Officer",
    role: "Admin",
    department: "Infrastructure",
    employmentType: "Full-time",
    status: "Inactive",
    email: "jonathan.reed@ems.company",
    phone: "+1 (555) 012-3456",
    location: "San Francisco, CA",
    joinedDate: "Oct 12, 2022",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&dpr=2&q=80",
    manager: "Marcus Vance",
    salaryBand: "L5 - Senior",
    bio: "Archived personnel record - previous SOC2 auditor and ISO compliance lead.",
  },
]

import { useEMSStore } from "@/store/use-ems-store"

interface ManageEmployeesProps {
  initialOpenAdd?: boolean
  onCloseAdd?: () => void
}

export function ManageEmployees({ initialOpenAdd = false, onCloseAdd }: ManageEmployeesProps) {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEMSStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDept, setSelectedDept] = useState("All")
  const [selectedRole, setSelectedRole] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Modal / Drawer States
  const [showAddModal, setShowAddModal] = useState(initialOpenAdd)
  const [selectedEmployeeForView, setSelectedEmployeeForView] = useState<Employee | null>(null)
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<Employee | null>(null)
  const [selectedEmployeeForArchive, setSelectedEmployeeForArchive] = useState<Employee | null>(null)

  // Form States (for Add & Edit)
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: "",
    email: "",
    jobTitle: "",
    role: "Employee",
    department: "Engineering",
    employmentType: "Full-time",
    status: "Active",
    phone: "",
    location: "",
    manager: "",
    salaryBand: "",
    bio: "",
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Sync initialOpenAdd prop
  React.useEffect(() => {
    if (initialOpenAdd) {
      setShowAddModal(true)
    }
  }, [initialOpenAdd])

  // Filtered List
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.jobTitle && emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (emp.role && emp.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDept = selectedDept === "All" || emp.department === selectedDept
      const matchesRole = selectedRole === "All" || emp.role === selectedRole
      const matchesStatus = selectedStatus === "All" || emp.status === selectedStatus
      const matchesType = selectedType === "All" || emp.employmentType === selectedType

      return matchesSearch && matchesDept && matchesRole && matchesStatus && matchesType
    })
  }, [employees, searchQuery, selectedDept, selectedRole, selectedStatus, selectedType])

  // Pagination slice
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredEmployees.slice(start, start + itemsPerPage)
  }, [filteredEmployees, currentPage, itemsPerPage])

  // Stats Counters
  const totalCount = employees.length
  const activeCount = employees.filter((e) => e.status === "Active").length
  const onLeaveCount = employees.filter((e) => e.status === "On Leave").length
  const remoteCount = employees.filter((e) => e.status === "Remote").length
  const inactiveCount = employees.filter((e) => e.status === "Inactive").length

  // Select all on current page
  const handleSelectAllCurrent = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedEmployees.map((e) => e.id)
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])))
    } else {
      const pageIds = paginatedEmployees.map((e) => e.id)
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)))
    }
  }

  const isAllCurrentSelected =
    paginatedEmployees.length > 0 &&
    paginatedEmployees.every((e) => selectedIds.includes(e.id))

  const handleToggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // --- CRUD Handlers ---

  // 1. CREATE
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      email: "",
      jobTitle: "",
      role: "Employee",
      department: "Engineering",
      employmentType: "Full-time",
      status: "Active",
      phone: "",
      location: "San Francisco, CA (HQ)",
      manager: "Alex Morgan",
      salaryBand: "L3 - Mid-level",
      bio: "",
    })
    setShowAddModal(true)
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name?.trim() || !formData.jobTitle?.trim()) return

    const newEmp = addEmployee({
      name: formData.name.trim(),
      email:
        formData.email?.trim() ||
        `${formData.name.toLowerCase().replace(/\s+/g, ".")}@ems.company`,
      jobTitle: formData.jobTitle.trim(),
      role: (formData.role as "Admin" | "Employee") || "Employee",
      department: formData.department || "Engineering",
      employmentType: (formData.employmentType as Employee["employmentType"]) || "Full-time",
      status: (formData.status as Employee["status"]) || "Active",
      phone: formData.phone?.trim() || "+1 (555) 000-0000",
      location: formData.location?.trim() || "San Francisco, CA (HQ)",
      joinedDate: "Today",
      manager: formData.manager?.trim() || "Operations",
      salaryBand: formData.salaryBand?.trim() || "Standard",
      bio: formData.bio?.trim() || "New team member onboarded to the workforce.",
      avatar: `https://images.unsplash.com/photo-${1534528741775 + employees.length}?w=128&h=128&dpr=2&q=80`,
    })

    toast.success("Employee Profile Created", {
      description: `${newEmp.name} registered as ${newEmp.jobTitle} (Role: ${newEmp.role}) in ${newEmp.department}.`,
    })
    setShowAddModal(false)
    onCloseAdd?.()
  }

  // 2. UPDATE (Edit)
  const handleOpenEdit = (emp: Employee) => {
    setSelectedEmployeeForEdit(emp)
    setFormData({ ...emp })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployeeForEdit || !formData.name?.trim()) return

    updateEmployee(selectedEmployeeForEdit.id, formData)

    toast.success("Employee Updated", {
      description: `Changes saved for ${formData.name}.`,
    })
    setSelectedEmployeeForEdit(null)
  }

  // 3. ARCHIVE / DEACTIVATE / DELETE
  const handleArchiveConfirm = () => {
    if (!selectedEmployeeForArchive) return

    const willBeActive = selectedEmployeeForArchive.status === "Inactive"
    updateEmployee(selectedEmployeeForArchive.id, {
      status: willBeActive ? "Active" : "Inactive",
    })

    if (willBeActive) {
      toast.success("Employee Reactivated", {
        description: `${selectedEmployeeForArchive.name} status changed to Active.`,
      })
    } else {
      toast.warning("Employee Deactivated", {
        description: `${selectedEmployeeForArchive.name} status changed to Inactive.`,
      })
    }

    setSelectedEmployeeForArchive(null)
  }

  const handlePermanentDelete = (id: string) => {
    const emp = employees.find((e) => e.id === id)
    deleteEmployee(id)
    setSelectedIds((prev) => prev.filter((item) => item !== id))
    setSelectedEmployeeForArchive(null)
    if (selectedEmployeeForView?.id === id) {
      setSelectedEmployeeForView(null)
    }
    toast.error("Employee Deleted", {
      description: `Permanently removed ${emp?.name || "employee"} from database.`,
    })
  }

  // Bulk Actions
  const handleBulkStatusChange = (newStatus: Employee["status"]) => {
    const count = selectedIds.length
    selectedIds.forEach((id) => updateEmployee(id, { status: newStatus }))
    setSelectedIds([])
    toast.success("Bulk Status Updated", {
      description: `Updated status to ${newStatus} for ${count} employees.`,
    })
  }

  const handleBulkDelete = () => {
    const count = selectedIds.length
    selectedIds.forEach((id) => deleteEmployee(id))
    setSelectedIds([])
    toast.error("Bulk Delete", {
      description: `Removed ${count} employees from records.`,
    })
  }

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Job Title", "App Role", "Department", "Type", "Status", "Email", "Phone", "Location", "Joined"]
    const rows = filteredEmployees.map((e) => [
      e.id,
      `"${e.name}"`,
      `"${e.jobTitle || ""}"`,
      `"${e.role || "Employee"}"`,
      `"${e.department}"`,
      e.employmentType,
      e.status,
      e.email,
      `"${e.phone}"`,
      `"${e.location}"`,
      `"${e.joinedDate}"`,
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `EMS_Employees_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Roster Exported", {
      description: `Downloaded CSV with ${filteredEmployees.length} employee records.`,
    })
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Employees</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Search, filter, inspect profiles, and manage employee lifecycle records.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="gap-1.5 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </Button>
        </div>
      </div>

      {/* 2. Top Summary KPI Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card
          onClick={() => setSelectedStatus("All")}
          className={`cursor-pointer transition-all shadow-xs p-3 hover:border-primary/50 ${
            selectedStatus === "All" ? "border-primary bg-primary/5" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Staff</span>
            <IconUsers className="size-4 text-primary" />
          </div>
          <div className="text-2xl font-bold mt-1">{totalCount}</div>
        </Card>

        <Card
          onClick={() => setSelectedStatus("Active")}
          className={`cursor-pointer transition-all shadow-xs p-3 hover:border-emerald-500/50 ${
            selectedStatus === "Active" ? "border-emerald-500 bg-emerald-500/5" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active</span>
            <IconUserCheck className="size-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
            {activeCount}
          </div>
        </Card>

        <Card
          onClick={() => setSelectedStatus("On Leave")}
          className={`cursor-pointer transition-all shadow-xs p-3 hover:border-orange-500/50 ${
            selectedStatus === "On Leave" ? "border-orange-500 bg-orange-500/5" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">On Leave</span>
            <Clock className="size-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">
            {onLeaveCount}
          </div>
        </Card>

        <Card
          onClick={() => setSelectedStatus("Remote")}
          className={`cursor-pointer transition-all shadow-xs p-3 hover:border-blue-500/50 ${
            selectedStatus === "Remote" ? "border-blue-500 bg-blue-500/5" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Remote</span>
            <Building2 className="size-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
            {remoteCount}
          </div>
        </Card>

        <Card
          onClick={() => setSelectedStatus("Inactive")}
          className={`cursor-pointer transition-all shadow-xs p-3 hover:border-destructive/50 col-span-2 sm:col-span-1 ${
            selectedStatus === "Inactive" ? "border-destructive bg-destructive/5" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Archived</span>
            <IconUserOff className="size-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold mt-1 text-muted-foreground">
            {inactiveCount}
          </div>
        </Card>
      </div>

      {/* 3. Search & Filter Bar */}
      <Card className="shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name, role, department, email, ID, location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Department filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground hidden sm:inline">Dept:</span>
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="flex h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="People & Culture">People & Culture</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                </select>
              </div>

              {/* Role filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground hidden sm:inline">Role:</span>
                <select
                  value={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="flex h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="All">All App Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground hidden sm:inline">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="flex h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Remote">Remote</option>
                  <option value="Inactive">Archived / Inactive</option>
                </select>
              </div>

              {/* Type filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground hidden sm:inline">Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="flex h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="All">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>

              {/* Reset Filters button if any filter is active */}
              {(selectedDept !== "All" || selectedRole !== "All" || selectedStatus !== "All" || selectedType !== "All" || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDept("All")
                    setSelectedRole("All")
                    setSelectedStatus("All")
                    setSelectedType("All")
                    setSearchQuery("")
                    setCurrentPage(1)
                  }}
                  className="h-9 text-xs px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
                </Button>
              )}
            </div>
          </div>

          {/* Bulk Selection Action Bar */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/60 border border-border text-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">{selectedIds.length}</span>
                <span className="text-muted-foreground">employee records selected</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange("Active")}
                  className="h-7 text-xs px-2 cursor-pointer"
                >
                  <UserCheck className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Set Active
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange("Inactive")}
                  className="h-7 text-xs px-2 cursor-pointer"
                >
                  <Archive className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> Archive Selected
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="h-7 text-xs px-2 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds([])}
                  className="h-7 text-xs px-2 cursor-pointer"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Main Employees Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b select-none">
                <tr>
                  <th className="px-4 py-3.5 w-10 text-center">
                    <Checkbox
                      checked={isAllCurrentSelected}
                      onCheckedChange={(checked) => handleSelectAllCurrent(Boolean(checked))}
                    />
                  </th>
                  <th className="px-4 py-3.5 font-semibold">Employee</th>
                  <th className="px-4 py-3.5 font-semibold">Job Title</th>
                  <th className="px-4 py-3.5 font-semibold">App Role</th>
                  <th className="px-4 py-3.5 font-semibold">Department</th>
                  <th className="px-4 py-3.5 font-semibold">Status</th>
                  <th className="px-4 py-3.5 font-semibold">Type</th>
                  <th className="px-4 py-3.5 font-semibold">Location</th>
                  <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedEmployees.length > 0 ? (
                  paginatedEmployees.map((emp) => {
                    const isSelected = selectedIds.includes(emp.id)

                    return (
                      <tr
                        key={emp.id}
                        className={`hover:bg-muted/40 transition-colors ${
                          isSelected ? "bg-primary/5" : ""
                        } ${emp.status === "Inactive" ? "opacity-60 bg-muted/20" : ""}`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-3.5 text-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleSelectOne(emp.id)}
                          />
                        </td>

                        {/* Employee (Avatar, Name, Email, ID) */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              {emp.avatar && <AvatarImage src={emp.avatar} alt={emp.name} />}
                              <AvatarFallback className="text-xs font-semibold bg-muted">
                                {emp.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-foreground truncate">{emp.name}</span>
                                <span className="text-[10px] font-mono text-muted-foreground px-1 bg-muted rounded">
                                  {emp.id}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                                <Mail className="h-3 w-3 shrink-0" />
                                {emp.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Job Title */}
                        <td className="px-4 py-3.5">
                          <span className="font-medium text-foreground text-xs sm:text-sm">{emp.jobTitle}</span>
                          {emp.salaryBand && (
                            <span className="block text-[11px] text-muted-foreground">{emp.salaryBand}</span>
                          )}
                        </td>

                        {/* App Role */}
                        <td className="px-4 py-3.5">
                          <Badge
                            variant={emp.role === "Admin" ? "default" : "secondary"}
                            className="text-[11px] font-medium gap-1"
                          >
                            <Shield className="h-3 w-3" />
                            {emp.role || "Employee"}
                          </Badge>
                        </td>

                        {/* Department */}
                        <td className="px-4 py-3.5">
                          <Badge variant="secondary" className="font-normal text-xs gap-1">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            {emp.department}
                          </Badge>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <Badge
                            variant={
                              emp.status === "Active"
                                ? "default"
                                : emp.status === "On Leave"
                                  ? "secondary"
                                  : emp.status === "Remote"
                                    ? "outline"
                                    : "destructive"
                            }
                            className={`text-xs ${
                              emp.status === "Active"
                                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                                : emp.status === "On Leave"
                                  ? "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30"
                                  : emp.status === "Remote"
                                    ? "text-blue-600 dark:text-blue-400 border-blue-500/30"
                                    : ""
                            }`}
                          >
                            {emp.status}
                          </Badge>
                        </td>

                        {/* Employment Type */}
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {emp.employmentType}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-muted-foreground flex items-center gap-1 truncate max-w-[140px]">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {emp.location}
                          </span>
                        </td>

                        {/* Actions (Full CRUD controls) */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Read Profile Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedEmployeeForView(emp)}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                              title="View Full Profile"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {/* Update (Edit) Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(emp)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary cursor-pointer"
                              title="Edit Employee Information"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>

                            {/* Deactivate/Archive Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedEmployeeForArchive(emp)}
                              className={`h-8 w-8 cursor-pointer ${
                                emp.status === "Inactive"
                                  ? "text-emerald-600 hover:text-emerald-700"
                                  : "text-muted-foreground hover:text-destructive"
                              }`}
                              title={emp.status === "Inactive" ? "Reactivate Employee" : "Archive / Deactivate"}
                            >
                              {emp.status === "Inactive" ? (
                                <RotateCcw className="h-4 w-4" />
                              ) : (
                                <Archive className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <IconUsers className="size-8 text-muted-foreground/50" />
                        <p className="font-semibold text-sm">No employees found</p>
                        <p className="text-xs">
                          No matching records for current search and filters.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery("")
                            setSelectedDept("All")
                            setSelectedStatus("All")
                            setSelectedType("All")
                          }}
                          className="mt-2 text-xs cursor-pointer"
                        >
                          Clear all filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>

        {/* 5. Pagination Footer */}
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t text-xs text-muted-foreground">
          <div>
            Showing{" "}
            <strong>
              {filteredEmployees.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}
            </strong>{" "}
            of <strong>{filteredEmployees.length}</strong> employee profiles
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="h-8 w-8 cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 cursor-pointer disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* ========================================================================= */}
      {/* MODAL: 1. CREATE NEW EMPLOYEE (Add) */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-2xl shadow-2xl border-border animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <IconUserPlus className="size-5 text-primary" />
                  <span>Register New Employee</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowAddModal(false)
                    onCloseAdd?.()
                  }}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Fill in personal, departmental, and role details to create an active profile.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              <form id="create-emp-form" onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Full Name *
                    </label>
                    <Input
                      placeholder="e.g. Jordan Miller"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Work Email
                    </label>
                    <Input
                      type="email"
                      placeholder="e.g. jordan.miller@ems.company"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Job Title *
                    </label>
                    <Input
                      placeholder="e.g. Senior Backend Engineer"
                      value={formData.jobTitle || ""}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      App Role (System Access) *
                    </label>
                    <select
                      value={formData.role || "Employee"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as "Admin" | "Employee",
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Employee">Employee (Self-Service Portal Access)</option>
                      <option value="Admin">Admin (Full Console & Billing Access)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Department
                    </label>
                    <select
                      value={formData.department || "Engineering"}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="People & Culture">People & Culture</option>
                      <option value="Finance">Finance</option>
                      <option value="Sales & Marketing">Sales & Marketing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Employment Type
                    </label>
                    <select
                      value={formData.employmentType || "Full-time"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employmentType: e.target.value as Employee["employmentType"],
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Work Status
                    </label>
                    <select
                      value={formData.status || "Active"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as Employee["status"],
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Active">Active</option>
                      <option value="Remote">Remote</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Phone Number
                    </label>
                    <Input
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Work Location
                    </label>
                    <Input
                      placeholder="e.g. San Francisco, CA (HQ)"
                      value={formData.location || ""}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Professional Bio & Responsibilities
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of duties, projects, and specializations..."
                    value={formData.bio || ""}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t p-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false)
                  onCloseAdd?.()
                }}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button form="create-emp-form" type="submit" className="gap-1.5 cursor-pointer">
                <Plus className="h-4 w-4" /> Save & Onboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: 2. READ / VIEW PROFILE DRAWER */}
      {/* ========================================================================= */}
      {selectedEmployeeForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-xl shadow-2xl border-border animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Profile Header */}
            <div className="relative bg-gradient-to-r from-primary/15 via-primary/5 to-background p-6 rounded-t-xl border-b flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-background shadow-md">
                  {selectedEmployeeForView.avatar && (
                    <AvatarImage src={selectedEmployeeForView.avatar} alt={selectedEmployeeForView.name} />
                  )}
                  <AvatarFallback className="text-base font-bold bg-primary text-primary-foreground">
                    {selectedEmployeeForView.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">{selectedEmployeeForView.name}</h2>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {selectedEmployeeForView.id}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{selectedEmployeeForView.jobTitle}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge
                      variant={selectedEmployeeForView.role === "Admin" ? "default" : "secondary"}
                      className="text-[10px] gap-1"
                    >
                      <Shield className="h-3 w-3" />
                      Role: {selectedEmployeeForView.role || "Employee"}
                    </Badge>
                    <Badge
                      variant={
                        selectedEmployeeForView.status === "Active"
                          ? "default"
                          : selectedEmployeeForView.status === "Remote"
                            ? "outline"
                            : selectedEmployeeForView.status === "On Leave"
                              ? "secondary"
                              : "destructive"
                      }
                      className="text-[10px]"
                    >
                      {selectedEmployeeForView.status}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {selectedEmployeeForView.department}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedEmployeeForView(null)}
                className="h-7 w-7 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Profile Content Body */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Bio Summary */}
              {selectedEmployeeForView.bio && (
                <div className="rounded-lg bg-muted/40 p-3.5 border text-xs text-muted-foreground leading-relaxed">
                  <p className="font-medium text-foreground mb-1">About & Responsibilities</p>
                  {selectedEmployeeForView.bio}
                </div>
              )}

              {/* Grid Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg border bg-card">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-muted-foreground block">Email Address</span>
                    <span className="font-medium text-foreground truncate block">
                      {selectedEmployeeForView.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg border bg-card">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-muted-foreground block">Phone Contact</span>
                    <span className="font-medium text-foreground truncate block">
                      {selectedEmployeeForView.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg border bg-card">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-muted-foreground block">Primary Location</span>
                    <span className="font-medium text-foreground truncate block">
                      {selectedEmployeeForView.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg border bg-card">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-muted-foreground block">Joining Date</span>
                    <span className="font-medium text-foreground truncate block">
                      {selectedEmployeeForView.joinedDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg border bg-card">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-muted-foreground block">Employment Model</span>
                    <span className="font-medium text-foreground truncate block">
                      {selectedEmployeeForView.employmentType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg border bg-card">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-muted-foreground block">Reporting Manager</span>
                    <span className="font-medium text-foreground truncate block">
                      {selectedEmployeeForView.manager || "Executive Leadership"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attendance & Leave Quick Stats */}
              <div className="rounded-lg border p-4 bg-muted/20">
                <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Workplace & Attendance Metrics</span>
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-md bg-background border">
                    <div className="font-bold text-emerald-600 text-sm">98.5%</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Attendance Rate</div>
                  </div>
                  <div className="p-2 rounded-md bg-background border">
                    <div className="font-bold text-foreground text-sm">18 Days</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Annual Leaves Left</div>
                  </div>
                  <div className="p-2 rounded-md bg-background border">
                    <div className="font-bold text-foreground text-sm">0</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Disciplinary Flags</div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const emp = selectedEmployeeForView
                  setSelectedEmployeeForView(null)
                  handleOpenEdit(emp)
                }}
                className="gap-1.5 cursor-pointer text-xs"
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit Profile
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => setSelectedEmployeeForView(null)}
                className="cursor-pointer text-xs"
              >
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: 3. UPDATE / EDIT EMPLOYEE */}
      {/* ========================================================================= */}
      {selectedEmployeeForEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-2xl shadow-2xl border-border animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Edit2 className="size-5 text-primary" />
                  <span>Edit Employee Record ({selectedEmployeeForEdit.id})</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedEmployeeForEdit(null)}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Modify details, update organizational assignments, and save changes.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              <form id="edit-emp-form" onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Full Name *
                    </label>
                    <Input
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Work Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Job Title *
                    </label>
                    <Input
                      value={formData.jobTitle || ""}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      App Role (System Access) *
                    </label>
                    <select
                      value={formData.role || "Employee"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as "Admin" | "Employee",
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Employee">Employee (Self-Service Portal Access)</option>
                      <option value="Admin">Admin (Full Console & Billing Access)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Department
                    </label>
                    <select
                      value={formData.department || "Engineering"}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="People & Culture">People & Culture</option>
                      <option value="Finance">Finance</option>
                      <option value="Sales & Marketing">Sales & Marketing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Employment Type
                    </label>
                    <select
                      value={formData.employmentType || "Full-time"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employmentType: e.target.value as Employee["employmentType"],
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status || "Active"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as Employee["status"],
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Remote">Remote</option>
                      <option value="Inactive">Inactive / Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Phone Number
                    </label>
                    <Input
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Work Location
                    </label>
                    <Input
                      value={formData.location || ""}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Bio & Responsibilities
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio || ""}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t p-4">
              <Button
                variant="outline"
                onClick={() => setSelectedEmployeeForEdit(null)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button form="edit-emp-form" type="submit" className="gap-1.5 cursor-pointer">
                <CheckCircle2 className="h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: 4. ARCHIVE / DEACTIVATE / DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {selectedEmployeeForArchive && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-md shadow-2xl border-border animate-in zoom-in-95">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Archive className="size-5 text-destructive" />
                  <span>
                    {selectedEmployeeForArchive.status === "Inactive"
                      ? "Reactivate Employee"
                      : "Archive Employee Record"}
                  </span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedEmployeeForArchive(null)}
                  className="h-7 w-7 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                {selectedEmployeeForArchive.status === "Inactive"
                  ? `Are you sure you want to restore ${selectedEmployeeForArchive.name} to active status?`
                  : `Are you sure you want to archive ${selectedEmployeeForArchive.name}? This will mark them as inactive while preserving past logs.`}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50 border text-xs flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {selectedEmployeeForArchive.avatar && (
                    <AvatarImage src={selectedEmployeeForArchive.avatar} alt={selectedEmployeeForArchive.name} />
                  )}
                  <AvatarFallback className="font-semibold text-xs bg-muted">
                    {selectedEmployeeForArchive.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{selectedEmployeeForArchive.name}</p>
                  <p className="text-muted-foreground">{selectedEmployeeForArchive.jobTitle} • {selectedEmployeeForArchive.department}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t p-4 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePermanentDelete(selectedEmployeeForArchive.id)}
                className="text-destructive hover:bg-destructive/10 text-xs cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Permanent Delete
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEmployeeForArchive(null)}
                  className="cursor-pointer text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant={selectedEmployeeForArchive.status === "Inactive" ? "default" : "destructive"}
                  onClick={handleArchiveConfirm}
                  className="cursor-pointer text-xs"
                >
                  {selectedEmployeeForArchive.status === "Inactive" ? "Reactivate" : "Confirm Archive"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
