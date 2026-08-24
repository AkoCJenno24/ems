import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: string
    isPositive?: boolean
    label?: string
  }
  icon?: React.ReactNode
  badge?: React.ReactNode
  iconBgColor?: string
  className?: string
  onClick?: () => void
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon,
  badge,
  iconBgColor = "bg-primary/10 text-primary",
  className,
  onClick,
}: StatCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-md",
        onClick && "cursor-pointer active:scale-[0.99]",
        className
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
          </div>
          {icon && (
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                iconBgColor
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {(trend || description || badge) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 pt-1 text-xs">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-semibold",
                  trend.isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                )}
              >
                {trend.value}
                {trend.label && (
                  <span className="font-normal text-muted-foreground">
                    {trend.label}
                  </span>
                )}
              </span>
            )}
            {description && (
              <span className="text-muted-foreground">{description}</span>
            )}
            {badge && <div className="ml-auto">{badge}</div>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
