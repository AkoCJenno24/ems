"use client"

import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { NavUser } from "@/components/nav-user"
import {
  IconSmartHome,
  IconClockCheck,
  IconCalendarOff,
  IconReceipt2,
  IconTargetArrow,
  IconUser,
  IconHelp,
  IconShield,
} from "@tabler/icons-react"
import { UserCheck } from "lucide-react"
import { useEMSStore } from "@/store/use-ems-store"

interface EmployeeSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onLogout?: () => void
}

export function EmployeeSidebar({ onLogout, ...props }: EmployeeSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = useEMSStore((state) => state.currentUser)
  const leaveRequests = useEMSStore((state) => state.leaveRequests)
  const isAdmin = currentUser.role === "Admin"

  const myLeaves = leaveRequests.filter(
    (l) => l.employeeName === currentUser.name || l.employeeId === currentUser.id
  )
  const myPendingLeaves = myLeaves.filter((l) => l.status === "Pending")

  const employeeNavItems = [
    {
      title: "My Dashboard",
      url: "/portal",
      icon: <IconSmartHome className="size-4.5! shrink-0" />,
    },
    {
      title: "My Attendance",
      url: "/portal/attendance",
      icon: <IconClockCheck className="size-4.5! shrink-0" />,
    },
    {
      title: "Leaves & Time-Off",
      url: "/portal/leaves",
      icon: <IconCalendarOff className="size-4.5! shrink-0" />,
      badge: myPendingLeaves.length > 0 ? myPendingLeaves.length : undefined,
    },
    {
      title: "Payslips & Claims",
      url: "/portal/payslips",
      icon: <IconReceipt2 className="size-4.5! shrink-0" />,
    },
    {
      title: "Goals & Performance",
      url: "/portal/performance",
      icon: <IconTargetArrow className="size-4.5! shrink-0" />,
    },
    {
      title: "Profile & Documents",
      url: "/portal/profile",
      icon: <IconUser className="size-4.5! shrink-0" />,
    },
    {
      title: "Employee Helpdesk",
      url: "/portal/helpdesk",
      icon: <IconHelp className="size-4.5! shrink-0" />,
    },
  ]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => navigate("/portal")}
              className="cursor-pointer"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                <UserCheck className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">EMS Self-Service</span>
                <span className="truncate text-xs text-muted-foreground">
                  Employee Portal
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Employee Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {employeeNavItems.map((item) => {
                const isActive =
                  item.url === "/portal"
                    ? location.pathname === "/portal" || location.pathname === "/portal/"
                    : location.pathname.startsWith(item.url)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      size="default"
                      isActive={isActive}
                      onClick={() => navigate(item.url)}
                      className="cursor-pointer font-medium"
                    >
                      {item.icon}
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge !== undefined && (
                        <Badge
                          variant="secondary"
                          className="ml-auto h-4.5 min-w-4.5 px-1.5 py-0 text-[10px] font-bold rounded-full justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Only show Switch to Admin Console Group if user is Admin/Owner */}
        {isAdmin && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Management Access</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="default"
                    onClick={() => navigate("/")}
                    className="cursor-pointer border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                  >
                    <IconShield className="size-4 text-primary" />
                    <span className="font-semibold">Switch to Admin Console</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: currentUser.name,
            email: currentUser.email,
            avatar: currentUser.avatar,
          }}
          onLogout={onLogout}
          onSelectNav={(title) => {
            if (title === "Account") navigate("/portal/profile")
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
