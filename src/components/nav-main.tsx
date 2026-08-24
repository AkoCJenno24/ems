import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { ChevronRightIcon } from "lucide-react"

export interface SubNavItem {
  title: string
  url: string
  icon?: React.ReactNode
  isButton?: boolean
  badge?: string | number
}

export interface NavItem {
  title: string
  url: string
  icon: React.ReactNode
  isActive?: boolean
  badge?: string | number
  badgeClassName?: string
  items?: SubNavItem[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

interface NavMainProps {
  groups?: NavGroup[]
  items?: NavItem[]
  activeNav?: string
  currentPath?: string
  onSelectNav?: (title: string, url?: string) => void
}

export function NavMain({
  groups,
  items,
  activeNav,
  currentPath = "",
  onSelectNav,
}: NavMainProps) {
  // Normalize into groups if items were passed directly
  const navGroups: NavGroup[] = groups || (items ? [{ label: "Dashboard", items }] : [])

  const isRouteActive = (itemUrl: string, subItems?: SubNavItem[]) => {
    const cleanCurrent = currentPath.split("?")[0]
    const cleanItem = itemUrl.split("?")[0]

    // Exact match for dashboard
    if (cleanItem === "/" && cleanCurrent === "/") return true
    if (cleanItem === "/" && cleanCurrent !== "/") return false

    // Base route match
    if (cleanItem !== "/" && cleanCurrent.startsWith(cleanItem)) return true

    // Check query params if item has them
    if (itemUrl.includes("?") && currentPath === itemUrl) return true

    // Check sub items
    if (subItems?.length) {
      return subItems.some((sub) => {
        if (sub.url === currentPath) return true
        const cleanSub = sub.url.split("?")[0]
        if (cleanSub !== "/" && cleanCurrent.startsWith(cleanSub)) {
          if (sub.url.includes("?")) {
            return currentPath.includes(sub.url.split("?")[1])
          }
          return true
        }
        return false
      })
    }

    return false
  }

  return (
    <>
      {navGroups.map((group) => (
        <SidebarGroup key={group.label}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarMenu>
            {group.items.map((item) => {
              const hasSubItems = Boolean(item.items?.length)
              const isItemActive = isRouteActive(item.url, item.items) || (activeNav === item.title)

              return (
                <Collapsible
                  key={item.title}
                  defaultOpen={isItemActive}
                  className="group/collapsible"
                  render={<SidebarMenuItem />}
                >
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isItemActive && (!hasSubItems || currentPath === item.url)}
                    onClick={(e) => {
                      e.preventDefault()
                      onSelectNav?.(item.title, item.url)
                    }}
                    render={<a href={item.url} />}
                    className="cursor-pointer font-medium"
                  >
                    {item.icon}
                    <span className="flex-1 truncate">{item.title}</span>

                    {/* Live Badge indicator (e.g. pending requests) */}
                    {item.badge !== undefined && item.badge !== null && item.badge !== 0 && (
                      <Badge
                        variant="secondary"
                        className={
                          item.badgeClassName ||
                          "ml-auto h-4.5 min-w-4.5 px-1.5 py-0 text-[10px] font-bold rounded-full justify-center"
                        }
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>

                  {hasSubItems ? (
                    <>
                      <CollapsibleTrigger
                        render={
                          <SidebarMenuAction className="aria-expanded:rotate-90 transition-transform duration-200" />
                        }
                      >
                        <ChevronRightIcon className="size-3.5 text-muted-foreground" />
                        <span className="sr-only">Toggle {item.title}</span>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="animate-in slide-in-from-top-1 duration-150">
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => {
                            const isThisSubActive =
                              currentPath === subItem.url ||
                              (subItem.url.includes("?") &&
                                currentPath.includes(subItem.url.split("?")[1]))

                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  isActive={isThisSubActive}
                                  className={
                                    subItem.isButton
                                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/95 font-semibold shadow-xs rounded-md my-1 cursor-pointer transition-all [&>svg]:text-primary-foreground justify-center h-7 text-xs"
                                      : "cursor-pointer text-xs"
                                  }
                                  onClick={(e) => {
                                    e.preventDefault()
                                    onSelectNav?.(subItem.title, subItem.url)
                                  }}
                                  render={<a href={subItem.url} />}
                                >
                                  {subItem.icon}
                                  <span className="truncate">{subItem.title}</span>
                                  {subItem.badge && (
                                    <Badge
                                      variant="outline"
                                      className="ml-auto text-[9px] h-4 px-1"
                                    >
                                      {subItem.badge}
                                    </Badge>
                                  )}
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </Collapsible>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
