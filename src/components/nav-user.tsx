"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { ChevronsUpDownIcon, SparklesIcon, BadgeCheckIcon, CreditCardIcon, LogOutIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useEMSStore } from "@/store/use-ems-store"

export function NavUser({
  user,
  onLogout,
  onSelectNav,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  onLogout?: () => void
  onSelectNav?: (navTitle: string) => void
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const currentUser = useEMSStore((state) => state.currentUser)
  const logout = useEMSStore((state) => state.logout)
  const isAdmin = currentUser?.role === "Admin"
  const safeName = user?.name || currentUser?.name || "User"
  const safeEmail = user?.email || currentUser?.email || "user@ems.com"
  const safeAvatar = user?.avatar || currentUser?.avatar || ""

  const handleLogout = async () => {
    try {
      if (onLogout) {
        onLogout()
      } else {
        await logout()
        toast.success("Logged out successfully")
        navigate("/login", { replace: true })
      }
    } catch {
      await logout()
      navigate("/login", { replace: true })
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted cursor-pointer" />
            }
          >
            <Avatar>
              <AvatarImage src={safeAvatar} alt={safeName} />
              <AvatarFallback>
                {safeName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{safeName}</span>
              <span className="truncate text-xs text-muted-foreground">{safeEmail}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-64 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 px-2 py-2 text-left text-sm">
                  <Avatar className="size-9 border border-border">
                    <AvatarImage src={safeAvatar} alt={safeName} />
                    <AvatarFallback>
                      {safeName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                    <span className="truncate font-semibold text-foreground">{safeName}</span>
                    <div className="mt-1">
                      <Badge variant="outline" className="w-fit text-[10px] font-normal truncate max-w-[190px]">
                        {currentUser?.jobTitle || currentUser?.title || "Employee"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => onSelectNav?.("Upgrade to Pro")}
                    className="cursor-pointer font-medium text-primary hover:text-primary focus:text-primary focus:bg-primary/10"
                  >
                    <SparklesIcon className="text-primary size-4" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => onSelectNav?.("Account")}
                className="cursor-pointer"
              >
                <BadgeCheckIcon className="size-4" />
                {isAdmin ? "Account" : "My Profile & Documents"}
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => onSelectNav?.("Billing")}
                  className="cursor-pointer"
                >
                  <CreditCardIcon className="size-4" />
                  Billing & Subscriptions
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOutIcon className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
