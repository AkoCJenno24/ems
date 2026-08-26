"use client"

import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { NavMain, type NavGroup } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LifeBuoyIcon, TerminalIcon } from "lucide-react"
import {
  IconSmartHome,
  IconUsers,
  IconPlus,
  IconCalendarCheck,
  IconCalendarOff,
  IconBuildingSkyscraper,
  IconReceipt2,
  IconChartBar,
  IconFileAnalytics,
  IconSettings,
} from "@tabler/icons-react"
import { useEMSStore } from "@/store/use-ems-store"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string
    email: string
    avatar: string
  }
  activeNav?: string
  onSelectNav?: (navTitle: string) => void
  onLogout?: () => void
}

export function AppSidebar({ user, activeNav, onSelectNav, onLogout, ...props }: AppSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUserFromStore = useEMSStore((state) => state.currentUser)
  const leaveRequests = useEMSStore((state) => state.leaveRequests)
  const tickets = useEMSStore((state) => state.tickets)

  const pendingLeaves = leaveRequests.filter((l) => l.status === "Pending")
  const openTickets = tickets.filter((t) => t.status !== "Resolved")

  const currentUser = user || {
    name: currentUserFromStore?.name || "Administrator",
    email: currentUserFromStore?.email || "admin@ems.com",
    avatar: currentUserFromStore?.avatar || "",
  }

  const handleSelectNav = (title: string, url?: string) => {
    if (url && url !== "#") {
      navigate(url)
    }
    onSelectNav?.(title)
  }

  // Organized Functional Groups with dynamic live badges
  const navGroups: NavGroup[] = [
    {
      label: "Workforce Management",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: <IconSmartHome className="size-4.5! shrink-0" />,
        },
        {
          title: "Employees",
          url: "/employees",
          icon: <IconUsers className="size-4.5! shrink-0" />,
          items: [
            {
              title: "Manage Directory",
              url: "/employees",
            },
            {
              title: "Add Employee",
              url: "/employees?action=add",
              icon: <IconPlus className="size-3.5 shrink-0" />,
              isButton: true,
            },
          ],
        },
        {
          title: "Attendance",
          url: "/attendance",
          icon: <IconCalendarCheck className="size-4.5! shrink-0" />,
          items: [
            {
              title: "Live Monitor",
              url: "/attendance?tab=monitor",
            },
            {
              title: "Shift Schedules",
              url: "/attendance?tab=schedules",
            },
            {
              title: "Regularizations",
              url: "/attendance?tab=regularization",
            },
            {
              title: "Overtime Tracker",
              url: "/attendance?tab=overtime",
            },
          ],
        },
        {
          title: "Leave Management",
          url: "/leaves",
          icon: <IconCalendarOff className="size-4.5! shrink-0" />,
          badge: pendingLeaves.length > 0 ? pendingLeaves.length : undefined,
          badgeClassName: "ml-auto bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold px-1.5 h-4.5 min-w-4.5 rounded-full justify-center",
          items: [
            {
              title: "Request Inbox",
              url: "/leaves?tab=inbox",
              badge: pendingLeaves.length > 0 ? `${pendingLeaves.length} new` : undefined,
            },
            {
              title: "Policy Engine",
              url: "/leaves?tab=policies",
            },
            {
              title: "Leave Calendar",
              url: "/leaves?tab=calendar",
            },
          ],
        },
      ],
    },
    {
      label: "Operations & Finance",
      items: [
        {
          title: "Departments",
          url: "/departments",
          icon: <IconBuildingSkyscraper className="size-4.5! shrink-0" />,
          items: [
            {
              title: "Department Setup",
              url: "/departments?tab=departments",
            },
            {
              title: "Designations & Bands",
              url: "/departments?tab=designations",
            },
          ],
        },
        {
          title: "Payroll",
          url: "/payroll",
          icon: <IconReceipt2 className="size-4.5! shrink-0" />,
          items: [
            {
              title: "Payroll Run Wizard",
              url: "/payroll?tab=wizard",
            },
            {
              title: "Salary Structures",
              url: "/payroll?tab=structures",
            },
            {
              title: "Payslips Distribution",
              url: "/payroll?tab=payslips",
            },
            {
              title: "Disbursement Reports",
              url: "/payroll?tab=reports",
            },
          ],
        },
        {
          title: "Performance",
          url: "/performance",
          icon: <IconChartBar className="size-4.5! shrink-0" />,
          items: [
            {
              title: "Review Cycles",
              url: "/performance?tab=reviews",
            },
            {
              title: "Goals & OKRs",
              url: "/performance?tab=goals",
            },
          ],
        },
        {
          title: "Executive Reports",
          url: "/reports",
          icon: <IconFileAnalytics className="size-4.5! shrink-0" />,
          items: [
            {
              title: "Standard Reports",
              url: "/reports?tab=standard",
            },
            {
              title: "Custom Export Builder",
              url: "/reports?tab=custom",
            },
          ],
        },
      ],
    },
    {
      label: "System & Administration",
      items: [
        {
          title: "Settings",
          url: "/settings",
          icon: <IconSettings className="size-4.5! shrink-0" />,
          items: [
            {
              title: "Roles & Permissions",
              url: "/settings?tab=roles",
            },
            {
              title: "Audit Trail",
              url: "/settings?tab=audit",
            },
            {
              title: "System Preferences",
              url: "/settings?tab=preferences",
            },
          ],
        },
      ],
    },
  ]

  const navSecondary = [
    {
      title: "Support Helpdesk",
      url: "/support",
      icon: <LifeBuoyIcon />,
      badge: openTickets.length > 0 ? openTickets.length : undefined,
    },
  ]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => navigate("/")}
              className="cursor-pointer"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-xs">
                <TerminalIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold tracking-tight">EMS Enterprise</span>
                <span className="truncate text-xs text-muted-foreground">Workforce Operating System</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          groups={navGroups}
          activeNav={activeNav}
          currentPath={location.pathname + location.search}
          onSelectNav={handleSelectNav}
        />
        <NavSecondary
          items={navSecondary}
          activeNav={activeNav}
          currentPath={location.pathname}
          onSelectNav={handleSelectNav}
          className="mt-auto"
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={currentUser}
          onLogout={onLogout}
          onSelectNav={(title) => {
            if (title === "Upgrade to Pro") navigate("/upgrade-pro")
            else if (title === "Account") navigate("/account")
            else if (title === "Billing") navigate("/billing")
            onSelectNav?.(title)
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
