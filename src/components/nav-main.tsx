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

interface SubNavItem {
  title: string
  url: string
  icon?: React.ReactNode
  isButton?: boolean
}

interface NavItem {
  title: string
  url: string
  icon: React.ReactNode
  isActive?: boolean
  items?: SubNavItem[]
}

interface NavMainProps {
  items: NavItem[]
  activeNav?: string
  onSelectNav?: (title: string) => void
}

export function NavMain({
  items,
  activeNav,
  onSelectNav,
}: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = Boolean(item.items?.length)
          const isSubItemActive = item.items?.some((sub) => sub.title === activeNav) ?? false
          const isItemActive = activeNav ? (activeNav === item.title || isSubItemActive) : Boolean(item.isActive)

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isItemActive || isSubItemActive}
              render={<SidebarMenuItem />}
            >
              <SidebarMenuButton
                tooltip={item.title}
                isActive={activeNav ? activeNav === item.title : Boolean(item.isActive)}
                onClick={(e) => {
                  if (item.url === "#") {
                    e.preventDefault()
                  }
                  onSelectNav?.(item.title)
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
                        const isThisSubActive = activeNav === subItem.title

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
                                if (subItem.url === "#") {
                                  e.preventDefault()
                                }
                                onSelectNav?.(subItem.title)
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
