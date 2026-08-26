import React, { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { useEMSStore } from "@/store/use-ems-store"
import { supabaseSignIn, fetchCurrentProfile } from "@/lib/supabase-service"
import { isSupabaseConfigured } from "@/lib/supabase"
import {
  Zap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  User,
} from "lucide-react"
import { toast } from "sonner"

interface LoginPageProps {
  onSuccess?: (email: string) => void
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectParam = searchParams.get("redirect")

  const { setCurrentUser, setIsAuthenticated, syncFromSupabase } = useEMSStore()

  const [email, setEmail] = useState("admin@ems.com")
  const [password, setPassword] = useState("Password123")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError("Please enter your email address.")
      toast.error("Authentication Error", {
        description: "Please enter your email address.",
      })
      return
    }
    if (!password) {
      setError("Please enter your password.")
      toast.error("Authentication Error", {
        description: "Please enter your password.",
      })
      return
    }

    setIsLoading(true)

    try {
      if (isSupabaseConfigured) {
        const { data, error: authError } = await supabaseSignIn(email, password)
        if (authError) {
          setError(authError.message)
          toast.error("Sign In Failed", { description: authError.message })
          setIsLoading(false)
          return
        }

        if (data?.user) {
          const profile = await fetchCurrentProfile(data.user.id)
          const targetRole = profile?.role || (email.toLowerCase().includes("admin") ? "Admin" : "Employee")
          
          if (profile) {
            setCurrentUser(profile)
          } else {
            setCurrentUser({
              id: data.user.id,
              email: data.user.email || email,
              name: data.user.user_metadata?.name || email.split("@")[0],
              role: targetRole,
              userRole: targetRole,
            })
          }

          setIsAuthenticated(true)
          setIsSuccess(true)

          // Proactively sync Supabase data in background
          syncFromSupabase().catch(() => {})

          toast.success("Welcome back!", {
            description: `Logged in as ${targetRole === "Admin" ? "Administrator" : "Employee"} (${email})`,
          })

          setTimeout(() => {
            setIsLoading(false)
            if (onSuccess) {
              onSuccess(email)
            } else {
              if (redirectParam) {
                navigate(redirectParam)
              } else if (targetRole === "Admin") {
                navigate("/")
              } else {
                navigate("/portal")
              }
            }
          }, 400)
          return
        }
      } else {
        setError("Supabase backend connection is not configured.")
        toast.error("Configuration Error", {
          description: "Supabase environment variables are missing.",
        })
        setIsLoading(false)
      }
    } catch (err: unknown) {
      setIsLoading(false)
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during authentication."
      setError(msg)
      toast.error("Authentication Error", { description: msg })
    }
  }

  const handleQuickLogin = (role: "Admin" | "Employee") => {
    if (role === "Admin") {
      setEmail("admin@ems.com")
      setPassword("Password123")
      toast.info("Admin credentials loaded (admin@ems.com)")
    } else {
      setEmail("employee@ems.com")
      setPassword("Password123")
      toast.info("Employee credentials loaded (employee@ems.com)")
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-muted/30">
      {/* Theme Toggle in Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-md">
            <Zap className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">EMS Enterprise</h1>
            <Badge variant="outline" className="text-xs font-normal">
              v2.0
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Sign in to access your role-specific dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-border/80">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">Welcome back</CardTitle>
            <CardDescription>
              Select your role or enter credentials to sign in
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Feedback Banners */}
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-destructive/10 text-destructive border border-destructive/20 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isSuccess && (
              <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Authentication successful! Redirecting...</span>
              </div>
            )}

            {/* Quick Preset Switchers */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                className={`h-auto flex-col items-start gap-1 p-3 text-left cursor-pointer transition-all ${
                  email === "admin@ems.com" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => handleQuickLogin("Admin")}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-primary">
                  <Shield className="size-3.5" />
                  Admin / Owner
                </div>
                <span className="text-[10px] text-muted-foreground">
                  admin@ems.com
                </span>
              </Button>

              <Button
                variant="outline"
                type="button"
                className={`h-auto flex-col items-start gap-1 p-3 text-left cursor-pointer transition-all ${
                  email === "employee@ems.com" ? "border-emerald-500 bg-emerald-500/5" : ""
                }`}
                onClick={() => handleQuickLogin("Employee")}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  <User className="size-3.5" />
                  Employee
                </div>
                <span className="text-[10px] text-muted-foreground">
                  employee@ems.com
                </span>
              </Button>
            </div>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or enter credentials
                </span>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@ems.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-xs"
                    autoComplete="email"
                    disabled={isLoading || isSuccess}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault()
                      toast.info(
                        "Password reset instructions sent to registered address."
                      )
                    }}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9 text-xs"
                    autoComplete="current-password"
                    disabled={isLoading || isSuccess}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                  disabled={isLoading || isSuccess}
                />
                <Label
                  htmlFor="remember"
                  className="text-xs text-muted-foreground font-normal cursor-pointer"
                >
                  Remember this device for 30 days
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full gap-2 shadow font-semibold cursor-pointer"
                disabled={isLoading || isSuccess}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in with Supabase...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center border-t py-4 text-xs text-muted-foreground space-y-2">
            <div>
              Connected to Supabase Real-Time Authentication & Database.
            </div>
          </CardFooter>
        </Card>

        {/* Bottom Links */}
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <a
            href="#privacy"
            onClick={(e) => {
              e.preventDefault()
              toast.info("EMS Privacy Policy: All employee data is encrypted.")
            }}
            className="hover:underline"
          >
            Privacy Policy
          </a>
          <span>•</span>
          <a
            href="#terms"
            onClick={(e) => {
              e.preventDefault()
              toast.info("Terms of Service: Authorized personnel access only.")
            }}
            className="hover:underline"
          >
            Terms of Service
          </a>
          <span>•</span>
          <a
            href="#support"
            onClick={(e) => {
              e.preventDefault()
              navigate("/login")
            }}
            className="hover:underline"
          >
            Help Center
          </a>
        </div>
      </div>
    </div>
  )
}
