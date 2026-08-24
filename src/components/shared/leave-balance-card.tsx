import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface LeaveBalanceCardProps {
  title: string
  totalDays: number
  usedDays: number
  unit?: string
  color?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export function LeaveBalanceCard({
  title,
  totalDays,
  usedDays,
  unit = "Days",
  color = "bg-primary",
  icon,
  onClick,
}: LeaveBalanceCardProps) {
  const remainingDays = Math.max(0, totalDays - usedDays)
  const percentUsed = Math.min(100, Math.round((usedDays / totalDays) * 100))

  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-md",
        onClick && "cursor-pointer active:scale-[0.99]"
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </span>
            <div className="flex items-baseline gap-1.5 pt-0.5">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {remainingDays}
              </span>
              <span className="text-xs text-muted-foreground">
                / {totalDays} {unit} Left
              </span>
            </div>
          </div>
          {icon && (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              {icon}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 space-y-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full transition-all duration-500 rounded-full", color)}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>{usedDays} {unit} Used</span>
            <span>{percentUsed}% Consumed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
