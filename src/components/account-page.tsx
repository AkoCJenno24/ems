import React, { useState } from "react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  ShieldCheck,
  Smartphone,
  Sliders,
  Camera,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  QrCode,
  Laptop,
  Calendar,
  Copy,
  CheckCircle2,
  X,
} from "lucide-react"

interface AccountPageProps {
  userEmail?: string
  onBackToDashboard?: () => void
}

type AccountSubTab = "profile" | "security" | "sessions" | "preferences"

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&dpr=2&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&dpr=2&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&dpr=2&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&dpr=2&q=80",
]

interface SessionItem {
  id: string
  device: string
  browser: string
  ip: string
  location: string
  lastActive: string
  isCurrent: boolean
  type: "desktop" | "mobile" | "tablet"
}

const INITIAL_SESSIONS: SessionItem[] = [
  {
    id: "sess-1",
    device: "Windows 11 PC",
    browser: "Chrome 128.0",
    ip: "192.168.1.104",
    location: "New York, USA",
    lastActive: "Active Now",
    isCurrent: true,
    type: "desktop",
  },
  {
    id: "sess-2",
    device: "MacBook Pro 16\"",
    browser: "Safari 17.5",
    ip: "172.56.21.89",
    location: "Boston, USA",
    lastActive: "2 hours ago",
    isCurrent: false,
    type: "desktop",
  },
  {
    id: "sess-3",
    device: "iPhone 15 Pro",
    browser: "EMS Mobile App v2.4",
    ip: "198.51.100.45",
    location: "New York, USA",
    lastActive: "Yesterday at 6:45 PM",
    isCurrent: false,
    type: "mobile",
  },
  {
    id: "sess-4",
    device: "iPad Air 5th Gen",
    browser: "Safari Mobile",
    ip: "198.51.100.48",
    location: "New York, USA",
    lastActive: "3 days ago",
    isCurrent: false,
    type: "tablet",
  },
]

export function AccountPage({ userEmail = "admin@ems.company" }: AccountPageProps) {
  const [activeTab, setActiveTab] = useState<AccountSubTab>("profile")

  // Profile Form States
  const [firstName, setFirstName] = useState("Jenno")
  const [lastName, setLastName] = useState("Administrator")
  const [email, setEmail] = useState(userEmail)
  const [jobTitle, setJobTitle] = useState("Enterprise Operations Lead")
  const [department, setDepartment] = useState("Executive & Operations")
  const [phone, setPhone] = useState("+1 (555) 382-9011")
  const [timezone, setTimezone] = useState("America/New_York")
  const [bio, setBio] = useState(
    "Senior administrator managing organization workforce operations, multi-tier approvals, and compliance policies."
  )
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&dpr=2&q=80"
  )
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // 2FA States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [totpCode, setTotpCode] = useState("")
  const [copiedKey, setCopiedKey] = useState(false)

  // Sessions State
  const [sessions, setSessions] = useState<SessionItem[]>(INITIAL_SESSIONS)

  // Preferences State
  const [language, setLanguage] = useState("en-US")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
  const [timeFormat, setTimeFormat] = useState("12h")
  const [currency, setCurrency] = useState("USD ($)")
  const [googleCalSync, setGoogleCalSync] = useState(true)
  const [outlookCalSync, setOutlookCalSync] = useState(false)

  // Password strength calculation
  const getPasswordStrength = (pw: string) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const pwStrengthScore = getPasswordStrength(newPassword)
  const pwStrengthLabels = ["Weak", "Fair", "Good", "Strong"]
  const pwStrengthColors = [
    "bg-rose-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
  ]

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    setTimeout(() => {
      setIsSavingProfile(false)
      toast.success("Profile updated successfully!", {
        description: "Your personal details and contact preferences have been saved.",
      })
    }, 600)
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      toast.error("Please enter your current password.")
      return
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.")
      return
    }

    setIsUpdatingPassword(true)
    setTimeout(() => {
      setIsUpdatingPassword(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password changed successfully!", {
        description: "Please use your new password for your next login.",
      })
    }, 800)
  }

  const handleCopySecretKey = () => {
    navigator.clipboard.writeText("HXDM-4982-PLWQ-8821")
    setCopiedKey(true)
    toast.success("2FA Secret Key copied to clipboard")
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault()
    if (totpCode.length < 6) {
      toast.error("Please enter the full 6-digit authenticator code.")
      return
    }
    setTwoFactorEnabled(true)
    setShow2FAModal(false)
    setTotpCode("")
    toast.success("Two-Factor Authentication activated!", {
      description: "Your account is now secured with authenticator app verification.",
    })
  }

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    toast.success("Session revoked", {
      description: "The selected device has been logged out successfully.",
    })
  }

  const handleRevokeAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent))
    toast.success("All other sessions signed out", {
      description: "All other active browser and mobile sessions have been terminated.",
    })
  }

  const handleSavePreferences = () => {
    toast.success("Account preferences updated", {
      description: "Regional and calendar sync settings have been applied.",
    })
  }

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Account Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your personal profile, credentials, security, and workspace preferences.
          </p>
        </div>
        <Badge variant="outline" className="text-xs px-3 py-1 bg-primary/5 text-primary border-primary/20 self-start sm:self-auto">
          Enterprise Account
        </Badge>
      </div>

      {/* Inner Sub-Navigation + Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Sub-Sidebar Menu */}
        <div className="md:col-span-3 space-y-1">
          <div className="bg-card border border-border rounded-xl p-1.5 shadow-2xs space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <User className="size-4 shrink-0" />
              <span>General Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <ShieldCheck className="size-4 shrink-0" />
              <span>Security & Password</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sessions")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "sessions"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Smartphone className="size-4 shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <span>Active Sessions</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === "sessions" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {sessions.length}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preferences")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "preferences"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Sliders className="size-4 shrink-0" />
              <span>Preferences</span>
            </button>
          </div>

          {/* Quick Account Info Card */}
          <div className="hidden md:block p-4 rounded-xl bg-muted/40 border border-border text-xs space-y-2 mt-4">
            <p className="font-semibold text-foreground">Verified Credentials</p>
            <div className="space-y-1 text-muted-foreground text-[11px]">
              <p>Role: <strong>Admin / Superuser</strong></p>
              <p>Organization: <strong>EMS Enterprise</strong></p>
              <p>Security Status: <strong className="text-emerald-600 dark:text-emerald-400">High Protection</strong></p>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-9 space-y-6">
          {/* TAB 1: GENERAL PROFILE */}
          {activeTab === "profile" && (
            <Card className="border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg">General Profile Details</CardTitle>
                <CardDescription className="text-xs">
                  Update your public profile photo, identity, and contact information.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveProfile}>
                <CardContent className="space-y-6">
                  {/* Interactive Avatar Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="relative group">
                      <Avatar className="size-20 border-2 border-primary/20 shadow-sm">
                        <AvatarImage src={avatarUrl} alt={firstName} />
                        <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                          {firstName[0]}{lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="avatar-file-input"
                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Upload new photo"
                      >
                        <Camera className="size-5" />
                      </label>
                      <input
                        id="avatar-file-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const tempUrl = URL.createObjectURL(file)
                            setAvatarUrl(tempUrl)
                            toast.success("Profile photo uploaded")
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-foreground">Profile Avatar</h4>
                        <span className="text-[10px] text-muted-foreground">PNG, JPG or WEBP up to 5MB</span>
                      </div>

                      {/* Avatar Preset Buttons */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground mr-1">Presets:</span>
                        {AVATAR_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatarUrl(preset)}
                            className={`size-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                              avatarUrl === preset ? "border-primary scale-110 shadow-xs" : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img src={preset} alt={`Preset ${idx + 1}`} className="size-full object-cover" />
                          </button>
                        ))}

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAvatarUrl("")
                            toast.info("Avatar reset to default initials")
                          }}
                          className="text-[11px] text-muted-foreground hover:text-destructive h-7 px-2 cursor-pointer ml-1"
                        >
                          Remove Photo
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Profile Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="first-name" className="text-xs font-semibold">
                        First Name
                      </Label>
                      <Input
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="text-xs h-9"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="last-name" className="text-xs font-semibold">
                        Last Name
                      </Label>
                      <Input
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="text-xs h-9"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email" className="text-xs font-semibold">
                          Work Email
                        </Label>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <Check className="size-3" /> Verified
                        </span>
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-xs h-9 bg-muted/20"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-semibold">
                        Contact Phone
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="job-title" className="text-xs font-semibold">
                        Job Title
                      </Label>
                      <Input
                        id="job-title"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="department" className="text-xs font-semibold">
                        Department
                      </Label>
                      <Input
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="timezone" className="text-xs font-semibold">
                        Primary Work Timezone
                      </Label>
                      <select
                        id="timezone"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="America/New_York">(GMT-05:00) Eastern Time (US & Canada)</option>
                        <option value="America/Chicago">(GMT-06:00) Central Time (US & Canada)</option>
                        <option value="America/Los_Angeles">(GMT-08:00) Pacific Time (US & Canada)</option>
                        <option value="Europe/London">(GMT+00:00) London / UTC</option>
                        <option value="Europe/Paris">(GMT+01:00) Central European Time (Paris, Berlin)</option>
                        <option value="Asia/Singapore">(GMT+08:00) Singapore, Hong Kong, Manila</option>
                        <option value="Asia/Tokyo">(GMT+09:00) Tokyo, Osaka</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="bio" className="text-xs font-semibold">
                        Professional Summary / Bio
                      </Label>
                      <textarea
                        id="bio"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full rounded-md border border-input bg-background p-3 text-xs shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring leading-relaxed"
                        placeholder="Brief summary of your role and responsibilities..."
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                  <Button
                    type="submit"
                    disabled={isSavingProfile}
                    className="cursor-pointer text-xs font-semibold"
                  >
                    {isSavingProfile ? (
                      <span className="flex items-center gap-1.5">
                        <div className="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Saving Changes...
                      </span>
                    ) : (
                      "Save Profile Changes"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Password Change Card */}
              <Card className="border-border shadow-xs">
                <CardHeader>
                  <CardTitle className="text-lg">Change Password</CardTitle>
                  <CardDescription className="text-xs">
                    Ensure your account is protected with a strong, unique alphanumeric passphrase.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdatePassword}>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="current-pw" className="text-xs font-semibold">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="current-pw"
                          type={showCurrentPw ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="text-xs h-9 pr-9"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showCurrentPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="new-pw" className="text-xs font-semibold">
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="new-pw"
                            type={showNewPw ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="text-xs h-9 pr-9"
                            placeholder="At least 8 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPw(!showNewPw)}
                            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {showNewPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="confirm-pw" className="text-xs font-semibold">
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm-pw"
                            type={showConfirmPw ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="text-xs h-9 pr-9"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPw(!showConfirmPw)}
                            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {showConfirmPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Password Strength:</span>
                          <span className="font-semibold text-foreground">
                            {pwStrengthLabels[Math.max(0, pwStrengthScore - 1)] || "Very Weak"}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 h-1.5">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`rounded-full transition-all ${
                                pwStrengthScore >= step
                                  ? pwStrengthColors[pwStrengthScore - 1]
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground pt-1">
                          <span className={newPassword.length >= 8 ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                            ✓ 8+ Characters
                          </span>
                          <span className={/[A-Z]/.test(newPassword) ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                            ✓ Uppercase Letter
                          </span>
                          <span className={/[0-9]/.test(newPassword) ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                            ✓ Numeric Digit
                          </span>
                          <span className={/[^A-Za-z0-9]/.test(newPassword) ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                            ✓ Special Symbol
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex items-center justify-end pt-4 border-t border-border/50">
                    <Button
                      type="submit"
                      disabled={isUpdatingPassword || !newPassword}
                      className="cursor-pointer text-xs font-semibold"
                    >
                      {isUpdatingPassword ? "Updating Password..." : "Update Password"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Two-Factor Authentication (2FA) Card */}
              <Card className="border-border shadow-xs">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Two-Factor Authentication (2FA)</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Add an extra layer of security by requiring a verification code when signing in.
                      </CardDescription>
                    </div>
                    {twoFactorEnabled ? (
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                        Enabled & Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Disabled
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="p-2.5 rounded-xl bg-background border border-border shadow-2xs">
                      <KeyRound className="size-5 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="text-xs font-bold text-foreground">Authenticator App (TOTP)</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Use apps like Google Authenticator, Microsoft Authenticator, 1Password, or Authy to generate one-time login verification codes.
                      </p>
                    </div>
                    <div>
                      {twoFactorEnabled ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setTwoFactorEnabled(false)
                            toast.warning("2FA has been disabled.")
                          }}
                          className="text-xs cursor-pointer text-destructive hover:bg-destructive/10"
                        >
                          Disable
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setShow2FAModal(true)}
                          className="text-xs cursor-pointer"
                        >
                          Setup 2FA
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: ACTIVE SESSIONS */}
          {activeTab === "sessions" && (
            <Card className="border-border shadow-xs">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">Active Login Sessions</CardTitle>
                  <CardDescription className="text-xs">
                    Review and manage all devices currently logged into your EMS account.
                  </CardDescription>
                </div>
                {sessions.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRevokeAllOtherSessions}
                    className="text-xs text-destructive hover:bg-destructive/10 cursor-pointer self-start sm:self-auto"
                  >
                    Sign Out Other Devices
                  </Button>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      session.isCurrent
                        ? "bg-primary/5 border-primary/30"
                        : "bg-card border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2 rounded-lg ${session.isCurrent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {session.type === "desktop" ? (
                          <Laptop className="size-4" />
                        ) : (
                          <Smartphone className="size-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {session.device}
                          </span>
                          {session.isCurrent && (
                            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] py-0 px-1.5">
                              Current Device
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span>{session.browser}</span>
                          <span>•</span>
                          <span>{session.location}</span>
                          <span>•</span>
                          <span className="font-mono">{session.ip}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-muted-foreground hidden sm:inline">
                        {session.lastActive}
                      </span>
                      {!session.isCurrent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
                          className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2.5 cursor-pointer"
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* TAB 4: PREFERENCES */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <Card className="border-border shadow-xs">
                <CardHeader>
                  <CardTitle className="text-lg">Regional & Localization Preferences</CardTitle>
                  <CardDescription className="text-xs">
                    Customize how dates, times, currency, and language appear throughout your dashboard.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Display Language</Label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs"
                      >
                        <option value="en-US">English (United States)</option>
                        <option value="en-GB">English (United Kingdom)</option>
                        <option value="es-ES">Español (Spanish)</option>
                        <option value="fr-FR">Français (French)</option>
                        <option value="de-DE">Deutsch (German)</option>
                        <option value="ja-JP">日本語 (Japanese)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Date Display Format</Label>
                      <select
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 08/23/2026)</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 23/08/2026)</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Time Format</Label>
                      <select
                        value={timeFormat}
                        onChange={(e) => setTimeFormat(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs"
                      >
                        <option value="12h">12-Hour (e.g. 02:45 PM)</option>
                        <option value="24h">24-Hour (e.g. 14:45)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Default Currency Symbol</Label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs"
                      >
                        <option value="USD ($)">USD - US Dollar ($)</option>
                        <option value="EUR (€)">EUR - Euro (€)</option>
                        <option value="GBP (£)">GBP - British Pound (£)</option>
                        <option value="JPY (¥)">JPY - Japanese Yen (¥)</option>
                        <option value="SGD ($)">SGD - Singapore Dollar ($)</option>
                      </select>
                    </div>
                  </div>

                  <Separator />

                  {/* Calendar Sync Options */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-foreground">Calendar Integrations</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                        <div className="flex items-center gap-3">
                          <Calendar className="size-4 text-blue-500" />
                          <div>
                            <p className="text-xs font-semibold">Google Calendar Two-Way Sync</p>
                            <p className="text-[11px] text-muted-foreground">Sync approved leaves and attendance shifts directly to your Google Calendar.</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={googleCalSync}
                          onChange={(e) => setGoogleCalSync(e.target.checked)}
                          className="size-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                        <div className="flex items-center gap-3">
                          <Calendar className="size-4 text-amber-500" />
                          <div>
                            <p className="text-xs font-semibold">Microsoft Outlook 365 Sync</p>
                            <p className="text-[11px] text-muted-foreground">Publish shifts and department holidays to your Outlook schedule.</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={outlookCalSync}
                          onChange={(e) => setOutlookCalSync(e.target.checked)}
                          className="size-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-end pt-4 border-t border-border/50">
                  <Button
                    onClick={handleSavePreferences}
                    className="cursor-pointer text-xs font-semibold"
                  >
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Interactive 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">Set Up Authenticator App</h3>
                <p className="text-xs text-muted-foreground">
                  Scan the QR code with Google Authenticator or 1Password.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShow2FAModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* QR Code Simulation */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-border text-center">
              <div className="size-36 border-4 border-gray-800 rounded-lg flex items-center justify-center bg-gray-950 p-2">
                <QrCode className="size-full text-white" />
              </div>
              <p className="text-[10px] text-gray-500 mt-2 font-mono">
                Scan with any TOTP compatible app
              </p>
            </div>

            {/* Manual Secret Key */}
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Or enter manual secret key</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value="HXDM-4982-PLWQ-8821"
                  className="font-mono text-xs h-8 bg-muted/40"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopySecretKey}
                  className="h-8 px-2.5 cursor-pointer"
                >
                  {copiedKey ? <CheckCircle2 className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </Button>
              </div>
            </div>

            {/* Verification Code Form */}
            <form onSubmit={handleVerify2FA} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Enter 6-Digit Code from App</Label>
                <Input
                  maxLength={6}
                  placeholder="123456"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                  className="text-center font-mono text-base tracking-widest h-10 font-bold"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShow2FAModal(false)}
                  className="cursor-pointer text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={totpCode.length < 6}
                  className="cursor-pointer text-xs font-semibold"
                >
                  Verify & Enable 2FA
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
