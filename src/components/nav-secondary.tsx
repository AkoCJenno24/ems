import * as React from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  activeNav,
  currentPath,
  onSelectNav,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
  }[]
  activeNav?: string
  currentPath?: string
  onSelectNav?: (title: string, url?: string) => void
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = currentPath ? currentPath.startsWith(item.url) : activeNav === item.title
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  size="sm"
                  isActive={isActive}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    onSelectNav?.(item.title, item.url)
                  }}
                  render={<a href={item.url} />}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
