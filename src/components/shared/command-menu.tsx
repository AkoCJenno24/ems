"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import { useEMSStore } from "@/store/use-ems-store"
import {
  IconSmartHome,
  IconUsers,
  IconCalendarCheck,
  IconCalendarOff,
  IconBuildingSkyscraper,
  IconReceipt2,
  IconChartBar,
  IconFileAnalytics,
  IconSettings,
  IconClockPlay,
  IconClockStop,
  IconUserPlus,
  IconFilePlus,
  IconSun,
  IconMoon,
  IconShield,
  IconUser,
} from "@tabler/icons-react"
import { toast } from "sonner"

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const navigate = useNavigate()
  const { employees, currentUser, isClockedIn, clockIn, clockOut } = useEMSStore()
  const isAdmin = currentUser.role === "Admin"

  const runCommand = React.useCallback(
    (command: () => void) => {
      onOpenChange(false)
      command()
    },
    [onOpenChange]
  )

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search workforce..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          {isClockedIn ? (
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  clockOut()
                  toast.success("Clocked Out Successfully")
                })
              }
            >
              <IconClockStop className="text-destructive size-4" />
              <span>Clock Out (End Work Session)</span>
            </CommandItem>
          ) : (
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  clockIn()
                  toast.success("Clocked In Successfully")
                })
              }
            >
              <IconClockPlay className="text-emerald-500 size-4" />
              <span>Clock In (Start Work Session)</span>
            </CommandItem>
          )}

          {isAdmin ? (
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  navigate("/employees?action=add")
                })
              }
            >
              <IconUserPlus className="text-primary size-4" />
              <span>Add New Employee Profile</span>
            </CommandItem>
          ) : (
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  navigate("/portal/leaves")
                })
              }
            >
              <IconFilePlus className="text-primary size-4" />
              <span>Submit Leave Request</span>
            </CommandItem>
          )}

          {isAdmin ? (
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  navigate("/portal")
                })
              }
            >
              <IconUser className="text-emerald-600 size-4" />
              <span>Switch to Employee Self-Service Portal</span>
            </CommandItem>
          ) : (
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  navigate("/")
                })
              }
            >
              <IconShield className="text-primary size-4" />
              <span>Switch to Admin Management Console</span>
            </CommandItem>
          )}
        </CommandGroup>

        <CommandSeparator />

        {/* Employee Roster Quick Jump */}
        {isAdmin && employees.length > 0 && (
          <>
            <CommandGroup heading="Employees">
              {employees.slice(0, 5).map((emp) => (
                <CommandItem
                  key={emp.id}
                  value={`${emp.name} ${emp.jobTitle} ${emp.department} ${emp.id}`}
                  onSelect={() =>
                    runCommand(() => {
                      navigate("/employees")
                    })
                  }
                >
                  <IconUser className="size-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{emp.name}</span>
                  <span className="text-muted-foreground text-[11px] ml-1">
                    — {emp.jobTitle} ({emp.department})
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Navigation Pages */}
        <CommandGroup heading="Navigation">
          {isAdmin ? (
            <>
              <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
                <IconSmartHome className="size-4" />
                <span>Dashboard Overview</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/employees"))}>
                <IconUsers className="size-4" />
                <span>Manage Employees</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/attendance"))}>
                <IconCalendarCheck className="size-4" />
                <span>Attendance & Shifts</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/leaves"))}>
                <IconCalendarOff className="size-4" />
                <span>Leave Management</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/departments"))}>
                <IconBuildingSkyscraper className="size-4" />
                <span>Departments & Designations</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/payroll"))}>
                <IconReceipt2 className="size-4" />
                <span>Payroll Runs & Payslips</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/performance"))}>
                <IconChartBar className="size-4" />
                <span>Performance & OKRs</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/reports"))}>
                <IconFileAnalytics className="size-4" />
                <span>Executive Reports & Exports</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
                <IconSettings className="size-4" />
                <span>Settings & Permissions</span>
              </CommandItem>
            </>
          ) : (
            <>
              <CommandItem onSelect={() => runCommand(() => navigate("/portal"))}>
                <IconSmartHome className="size-4" />
                <span>My Portal Dashboard</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/portal/attendance"))}>
                <IconCalendarCheck className="size-4" />
                <span>My Attendance Records</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/portal/leaves"))}>
                <IconCalendarOff className="size-4" />
                <span>My Leave Requests</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/portal/payslips"))}>
                <IconReceipt2 className="size-4" />
                <span>My Payslips & Claims</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/portal/performance"))}>
                <IconChartBar className="size-4" />
                <span>My Goals & Reviews</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/portal/profile"))}>
                <IconUser className="size-4" />
                <span>My Profile & Documents</span>
              </CommandItem>
            </>
          )}
        </CommandGroup>

        <CommandSeparator />

        {/* Theme Preferences */}
        <CommandGroup heading="Appearance">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                document.documentElement.classList.remove("dark")
                localStorage.setItem("theme", "light")
                toast.info("Switched to Light theme")
              })
            }
          >
            <IconSun className="size-4 text-amber-500" />
            <span>Light Mode</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                document.documentElement.classList.add("dark")
                localStorage.setItem("theme", "dark")
                toast.info("Switched to Dark theme")
              })
            }
          >
            <IconMoon className="size-4 text-blue-400" />
            <span>Dark Mode</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
