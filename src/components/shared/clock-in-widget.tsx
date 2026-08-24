import { useState, useEffect } from "react"
import { useEMSStore } from "@/store/use-ems-store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Play,
  Square,
  Coffee,
  MapPin,
  ShieldCheck,
} from "lucide-react"
import { toast } from "sonner"

export function ClockInWidget() {
  const { isClockedIn, clockInTime, clockIn, clockOut } = useEMSStore()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOnBreak, setIsOnBreak] = useState(false)

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handlePunchToggle = () => {
    if (isClockedIn) {
      clockOut()
      toast.warning("Clocked Out", {
        description: "Your session hours have been saved to your timesheet.",
      })
    } else {
      clockIn()
      toast.success("Clocked In Successfully", {
        description: "Your work session has started. Have a productive day!",
      })
    }
  }

  const handleBreakToggle = () => {
    setIsOnBreak(!isOnBreak)
    if (!isOnBreak) {
      toast.info("Break Started", { description: "Timer paused for meal/rest break." })
    } else {
      toast.success("Break Ended", { description: "Welcome back to your active shift." })
    }
  }

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-background via-muted/20 to-primary/5 shadow-xs">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Live Clock & Shift Details */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  isClockedIn
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "border-muted-foreground/30 bg-muted text-muted-foreground font-semibold"
                }
              >
                <span
                  className={`mr-1.5 size-2 rounded-full ${
                    isClockedIn
                      ? isOnBreak
                        ? "bg-amber-500 animate-pulse"
                        : "bg-emerald-500 animate-ping"
                      : "bg-muted-foreground"
                  }`}
                />
                {isClockedIn
                  ? isOnBreak
                    ? "On Break"
                    : "Active Shift (Working)"
                  : "Clocked Out"}
              </Badge>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="size-3 text-primary" />
                <span>San Francisco HQ (Gate A)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {formattedTime}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline-block">
                {formattedDate}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                Shift: <strong className="text-foreground font-medium">09:00 AM – 06:00 PM</strong>
              </span>
              <span>•</span>
              <span>
                Started at:{" "}
                <strong className="text-foreground font-medium">
                  {clockInTime || "Not clocked in"}
                </strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-3.5" /> Biometric Verified
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
            {isClockedIn && (
              <Button
                variant={isOnBreak ? "default" : "outline"}
                size="sm"
                onClick={handleBreakToggle}
                className="gap-1.5 font-medium cursor-pointer"
              >
                <Coffee className="size-4" />
                {isOnBreak ? "Resume Work" : "Take Break"}
              </Button>
            )}

            <Button
              variant={isClockedIn ? "destructive" : "default"}
              size="default"
              onClick={handlePunchToggle}
              className="gap-2 font-semibold shadow-xs cursor-pointer min-w-32"
            >
              {isClockedIn ? (
                <>
                  <Square className="size-4" />
                  Clock Out
                </>
              ) : (
                <>
                  <Play className="size-4 fill-current" />
                  Clock In
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
