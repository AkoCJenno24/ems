"use client"

import * as React from "react"

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
} from '@tabler/icons-react';
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: <IconSmartHome className="size-5! shrink-0" size={20} />,
      isActive: true,
    },
    {
      title: "Employees",
      url: "#",
      icon: <IconUsers className="size-5! shrink-0" size={20} />,
      items: [
        {
          title: "Manage Employee",
          url: "#",
        },
        {
          title: "Add Employee",
          url: "#",
          icon: <IconPlus className="size-3.5 shrink-0" />,
          isButton: true,
        },
      ],
    },
    {
      title: "Attendance",
      url: "#",
      icon: <IconCalendarCheck className="size-5! shrink-0" size={20} />,
      items: [
        {
          title: "Live Monitor",
          url: "#",
        },
        {
          title: "Shift & Schedules",
          url: "#",
        },
        {
          title: "Regularization Queue",
          url: "#",
        },
        {
          title: "Overtime Tracker",
          url: "#",
        },
      ],
    },
    {
      title: "Leave Management",
      url: "#",
      icon: <IconCalendarOff className="size-5! shrink-0" size={20} />,
      items: [
        {
          title: "Request Inbox",
          url: "#",
        },
        {
          title: "Policy Engine",
          url: "#",
        },
        {
          title: "Leave Calendar",
          url: "#",
        },
      ],
    },
    {
      title: "Departments",
      url: "#",
      icon: <IconBuildingSkyscraper className="size-5! shrink-0" size={20} />,
      items: [
        {
          title: "Department Setup",
          url: "#",
        },
        {
          title: "Designations & Bands",
          url: "#",
        },
      ],
    },
    {
      title: "Payroll",
      url: "#",
      icon: <IconReceipt2 className="size-5! shrink-0" size={20} />,
      items: [
        {
          title: "Payroll Run Wizard",
          url: "#",
        },
        {
          title: "Salary Structures",
          url: "#",
        },
        {
          title: "Payslips & Distribution",
          url: "#",
        },
        {
          title: "Disbursement Reports",
          url: "#",
        },
      ],
    },
    {
      title: "Performance",
      url: "#",
      icon: <IconChartBar className="size-5! shrink-0" size={20} />,
      items: [
        {
          title: "Review Cycles",
          url: "#",
        },
        {
          title: "Goals & OKRs",
          url: "#",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: <IconFileAnalytics className="size-5! shrink-0" size={20} />,
      items: [
        {
          title: "Standard Reports",
          url: "#",
        },
        {
          title: "Custom Export Builder",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <IconSettings className="size-5! shrink-0" size={20} />,
      items: [
        {
          title: "Roles & Permissions",
          url: "#",
        },
        {
          title: "Audit Trail",
          url: "#",
        },
        {
          title: "System Preferences",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: (
        <LifeBuoyIcon
        />
      ),
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
  const currentUser = user || data.user

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
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
        <NavMain items={data.navMain} activeNav={activeNav} onSelectNav={onSelectNav} />
        <NavSecondary
          items={data.navSecondary}
          activeNav={activeNav}
          onSelectNav={onSelectNav}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
