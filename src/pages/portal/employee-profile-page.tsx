import { useState } from "react"
import { useEMSStore } from "@/store/use-ems-store"
import { DocumentCard } from "@/components/shared/document-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Shield,
  Edit2,
  Save,
  Lock,
  Key,
} from "lucide-react"
import { toast } from "sonner"

export function EmployeeProfilePage() {
  const { currentUser, employeeDocuments, setCurrentUser, changePassword } = useEMSStore()
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [profileForm, setProfileForm] = useState({
    phone: currentUser?.phone || "",
    location: currentUser?.location || "",
    emergencyContact: "Emergency Contact (+1 555-0199)",
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentUser({
      phone: profileForm.phone,
      location: profileForm.location,
    })
    setIsEditing(false)
    toast.success("Profile Information Updated", {
      description: "Your contact details have been refreshed across the company registry.",
    })
  }

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.")
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match. Please verify.")
      return
    }

    changePassword(passwordForm.newPassword)
    toast.success("Password Changed Successfully", {
      description: "Your new permanent password is active for future sign-ins.",
    })
    setShowPasswordModal(false)
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const safeName = currentUser?.name || "Employee"

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="border-border/80 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary/30 via-primary/10 to-muted" />
        <CardContent className="px-6 pb-6 pt-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between -mt-12">
            <div className="flex items-end gap-4">
              <Avatar className="size-24 border-4 border-background shadow-md">
                <AvatarImage src={currentUser?.avatar} alt={safeName} />
                <AvatarFallback className="text-xl">
                  {safeName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {safeName}
                  </h1>
                  {currentUser?.salaryBand && (
                    <Badge variant="secondary" className="text-xs">
                      {currentUser.salaryBand}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentUser?.jobTitle || currentUser?.title || "Staff"} • {currentUser?.department || "General"}
                </p>
              </div>
            </div>

            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-1.5 font-semibold text-xs cursor-pointer self-start sm:self-auto"
            >
              <Edit2 className="size-3.5" />
              {isEditing ? "Cancel Editing" : "Edit Contact Details"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Contact & Official Employment Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="size-4 text-primary" />
                Personal Contact & Employment Info
              </CardTitle>
              <CardDescription className="text-xs">
                Company registered identity and direct contact channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="prof-phone" className="text-xs">Phone Number</Label>
                      <Input
                        id="prof-phone"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="prof-loc" className="text-xs">Office / Work Location</Label>
                      <Input
                        id="prof-loc"
                        value={profileForm.location}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prof-emergency" className="text-xs">Emergency Contact</Label>
                    <Input
                      id="prof-emergency"
                      value={profileForm.emergencyContact}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          emergencyContact: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      className="cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" className="gap-1.5 font-semibold cursor-pointer">
                      <Save className="size-3.5" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                  <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3 bg-muted/20">
                    <Mail className="size-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">Work Email</span>
                      <div className="font-semibold text-foreground mt-0.5">
                        {currentUser?.email || "employee@ems.com"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3 bg-muted/20">
                    <Phone className="size-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">Direct Phone</span>
                      <div className="font-semibold text-foreground mt-0.5">
                        {currentUser?.phone || "+1 (555) 345-6789"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3 bg-muted/20">
                    <MapPin className="size-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">Primary Location</span>
                      <div className="font-semibold text-foreground mt-0.5">
                        {currentUser?.location || "San Francisco, CA (HQ)"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3 bg-muted/20">
                    <Calendar className="size-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">Joined Organization</span>
                      <div className="font-semibold text-foreground mt-0.5">
                        {currentUser?.joinedDate || "2026-01-01"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Document Vault */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="size-4 text-purple-500" />
                Employee Document Vault
              </CardTitle>
              <CardDescription className="text-xs">
                Official encrypted contracts, tax forms, and policy handbooks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {employeeDocuments.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No documents uploaded yet.
                </div>
              ) : (
                employeeDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    id={doc.id}
                    name={doc.name}
                    category={doc.category}
                    size={doc.size}
                    date={doc.date}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Manager & Banking Info */}
        <div className="space-y-6">
          {/* Direct Manager Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Shield className="size-4 text-blue-500" />
                Reporting Hierarchy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center gap-3 rounded-xl border border-border/70 p-3 bg-muted/20">
                <Avatar className="size-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&h=128&dpr=2&q=80" />
                  <AvatarFallback>DV</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <div className="font-semibold text-foreground">
                    {currentUser?.manager || "System Administrator"}
                  </div>
                  <div className="text-muted-foreground">
                    Operations & Leadership
                  </div>
                  <Badge variant="outline" className="text-[10px] mt-1">
                    Direct Manager
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Credentials */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Lock className="size-4 text-emerald-500" />
                Security Credentials
              </CardTitle>
              <CardDescription className="text-xs">
                Manage your account authentication password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(true)}
                className="w-full gap-2 text-xs font-semibold cursor-pointer"
              >
                <Key className="size-3.5" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-1">
              <h3 className="text-lg font-bold">Change Password</h3>
              <p className="text-xs text-muted-foreground">
                Set a new secure password for your EMS account.
              </p>
            </div>
            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">New Password</label>
                <Input
                  type="password"
                  placeholder="Enter new password (min. 6 characters)"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Confirm New Password</label>
                <Input
                  type="password"
                  placeholder="Re-enter new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
