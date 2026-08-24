"use client"

import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { NavMain } from "@/components/nav-main"
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

const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <IconSmartHome className="size-5! shrink-0" size={20} />,
    },
    {
      title: "Employees",
      url: "/employees",
      icon: <IconUsers className="size-5! shrink-0" size={20} />,
      items: [
        {
          title: "Manage Employee",
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
      icon: <IconCalendarCheck className="size-5! shrink-0" size={20} />,
      items: [
        {
          title: "Live Monitor",
          url: "/attendance?tab=monitor",
        },
        {
          title: "Shift & Schedules",
          url: "/attendance?tab=schedules",
        },
        {
          title: "Regularization Queue",
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
      icon: <IconCalendarOff className="size-5! shrink-0" size={20} />,
      items: [
        {
          title: "Request Inbox",
          url: "/leaves?tab=inbox",
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
    {
      title: "Departments",
      url: "/departments",
      icon: <IconBuildingSkyscraper className="size-5! shrink-0" size={20} />,
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
      icon: <IconReceipt2 className="size-5! shrink-0" size={20} />,
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
          title: "Payslips & Distribution",
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
      icon: <IconChartBar className="size-5! shrink-0" size={20} />,
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
      title: "Reports",
      url: "/reports",
      icon: <IconFileAnalytics className="size-5! shrink-0" size={20} />,
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
    {
      title: "Settings",
      url: "/settings",
      icon: <IconSettings className="size-5! shrink-0" size={20} />,
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
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: <LifeBuoyIcon />,
    },
  ],
}

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

  const currentUser = user || {
    name: currentUserFromStore.name,
    email: currentUserFromStore.email,
    avatar: currentUserFromStore.avatar,
  }

  const handleSelectNav = (title: string, url?: string) => {
    if (url && url !== "#") {
      navigate(url)
    }
    onSelectNav?.(title)
  }

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
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TerminalIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">EMS Enterprise</span>
                <span className="truncate text-xs">Management System</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={navData.navMain}
          activeNav={activeNav}
          currentPath={location.pathname + location.search}
          onSelectNav={handleSelectNav}
        />
        <NavSecondary
          items={navData.navSecondary}
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
