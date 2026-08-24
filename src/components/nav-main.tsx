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
import { ChevronRightIcon } from "lucide-react"

export interface SubNavItem {
  title: string
  url: string
  icon?: React.ReactNode
  isButton?: boolean
}

export interface NavItem {
  title: string
  url: string
  icon: React.ReactNode
  isActive?: boolean
  items?: SubNavItem[]
}

interface NavMainProps {
  items: NavItem[]
  activeNav?: string
  currentPath?: string
  onSelectNav?: (title: string, url?: string) => void
}

export function NavMain({
  items,
  activeNav,
  currentPath,
  onSelectNav,
}: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = Boolean(item.items?.length)
          const isCurrentBaseUrl = currentPath
            ? currentPath.split("?")[0] === item.url.split("?")[0] && item.url !== "#"
            : false
          const isSubItemActive = item.items?.some((sub) =>
            currentPath ? currentPath === sub.url || (currentPath.startsWith(item.url) && currentPath.includes(sub.url.split("?")[1] || "nomatch")) : sub.title === activeNav
          ) ?? false
          const isItemActive = isCurrentBaseUrl || isSubItemActive || (activeNav ? activeNav === item.title : Boolean(item.isActive))

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isItemActive}
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
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
              {hasSubItems ? (
                <>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuAction className="aria-expanded:rotate-90" />
                    }
                  >
                    <ChevronRightIcon />
                    <span className="sr-only">Toggle</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isThisSubActive = currentPath
                          ? currentPath === subItem.url || (subItem.url.includes("?") && currentPath.includes(subItem.url.split("?")[1]))
                          : activeNav === subItem.title

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              isActive={isThisSubActive}
                              className={
                                subItem.isButton
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/95 font-medium shadow-xs rounded-md my-0.5 cursor-pointer transition-all [&>svg]:text-primary-foreground"
                                  : "cursor-pointer"
                              }
                              onClick={(e) => {
                                e.preventDefault()
                                onSelectNav?.(subItem.title, subItem.url)
                              }}
                              render={<a href={subItem.url} />}
                            >
                              {subItem.icon}
                              <span>{subItem.title}</span>
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
  )
}
