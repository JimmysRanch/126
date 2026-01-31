import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "@phosphor-icons/react"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"
import { Staff } from "@/lib/types"

interface PendingStaff {
  id: string
  email: string
  invitedAt: string
  status: 'pending'
}

interface BusinessInfo {
  companyName: string
}

export function StaffOnboarding() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const [emailInput, setEmailInput] = useState(email)
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pendingStaff, setPendingStaff] = useKV<PendingStaff[]>('pending-staff', [])
  const [staffMembers, setStaffMembers] = useKV<Staff[]>("staff", [])
  const [businessInfo] = useKV<BusinessInfo>("business-info", { companyName: "" })
  const businessName = businessInfo?.companyName?.trim() || "your business"

  useEffect(() => {
    if (email) {
      setEmailInput(email)
    }
  }, [email])

  const fallbackName = useMemo(() => {
    if (!emailInput) return "New Staff Member"
    const localPart = emailInput.split('@')[0] || ""
    if (!localPart) return "New Staff Member"
    return localPart
      .replace(/[._-]+/g, " ")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "New Staff Member"
  }, [emailInput])
  
  const handleCreateAccount = () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    const accountEmail = emailInput.trim()

    if (!accountEmail) {
      toast.error("Please enter your email address.")
      return
    }

    const pendingEntry = (pendingStaff || []).find((staff) => staff.email === accountEmail)
    const staffId = pendingEntry?.id ?? (crypto.randomUUID?.() ?? Date.now().toString())
    const hireDate = new Date().toLocaleDateString()

    setStaffMembers((current) => {
      const list = Array.isArray(current) ? current : []
      const existingIndex = list.findIndex(
        (staff) => staff.id === staffId || staff.email === email
      )
      const existing = existingIndex >= 0 ? list[existingIndex] : undefined
      const nextStaff: Staff = {
        id: staffId,
        name: existing?.name?.trim() ? existing.name : fallbackName,
        role: existing?.role ?? "Groomer",
        email: accountEmail,
        phone: existing?.phone ?? "",
        status: existing?.status ?? "Active",
        isGroomer: existing?.isGroomer ?? true,
        specialties: existing?.specialties ?? [],
        hourlyRate: existing?.hourlyRate ?? undefined,
        totalAppointments: existing?.totalAppointments ?? 0,
        hireDate: existing?.hireDate ?? hireDate
      }

      if (existingIndex >= 0) {
        const updated = [...list]
        updated[existingIndex] = nextStaff
        return updated
      }
      return [...list, nextStaff]
    })

    setPendingStaff((current) => (current || []).filter((staff) => staff.email !== accountEmail))
    
    navigate(`/dev/staff-profile-setup?email=${encodeURIComponent(accountEmail)}&staffId=${encodeURIComponent(staffId)}`)
  }
  
  return (
    <div className="h-screen w-full text-foreground relative overflow-hidden bg-[radial-gradient(circle_at_50%_15%,rgba(37,99,235,0.35),transparent_60%),radial-gradient(circle_at_50%_110%,rgba(56,189,248,0.55),transparent_70%),linear-gradient(180deg,rgba(2,6,23,0.95),rgba(2,6,23,0.98))] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(56,189,248,0.35),transparent_60%)]"></div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.55),transparent_65%)]"></div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/settings')}
        className="fixed top-4 right-4 z-50 bg-card/80 backdrop-blur-sm border border-border text-xs"
      >
        <ArrowLeft size={14} className="mr-1" />
        Back to App
      </Button>

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center gap-5 px-4 py-6 sm:py-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              You&apos;ve been invited to join {businessName}
            </h1>
            <p className="text-sm text-sky-100/80 max-w-xl">
              Create your staff account to get started.
            </p>
          </div>
        </div>

        <div className="w-full max-w-xl rounded-[28px] border border-sky-300/60 bg-sky-400/10 shadow-[0_25px_80px_rgba(37,99,235,0.55)] backdrop-blur-xl">
          <Card className="w-full rounded-[26px] bg-gradient-to-br from-blue-900/70 via-blue-900/60 to-indigo-900/60 text-white border border-sky-200/30 shadow-[0_18px_55px_rgba(59,130,246,0.45)]">
            <div className="p-6 sm:p-8 space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-sky-50">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailInput}
                    placeholder="Email"
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="bg-sky-500/15 border-sky-200/50 text-white placeholder:text-sky-100/70 h-11 focus-visible:ring-sky-300/60"
                  />
                  <p className="text-xs text-slate-300/80">Protect it by keeping it secure.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-sky-50">
                    Set your password
                  </Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateAccount()
                      }}
                      className="bg-sky-500/15 border-sky-200/50 text-white placeholder:text-sky-100/70 h-11 focus-visible:ring-sky-300/60"
                    />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateAccount()
                      }}
                      className="bg-sky-500/15 border-sky-200/50 text-white placeholder:text-sky-100/70 h-11 focus-visible:ring-sky-300/60"
                    />
                  </div>
                  <p className="text-xs text-slate-300/80">Must be at least 8 characters.</p>
                </div>

                <div className="text-center text-xs text-slate-200/70">
                  Trusted by professional grooming teams.
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleCreateAccount}
                  className="w-full bg-gradient-to-b from-sky-200 via-sky-300 to-sky-400 text-slate-900 hover:from-sky-100 hover:via-sky-200 hover:to-sky-300 font-semibold h-11 text-base shadow-[0_10px_24px_rgba(59,130,246,0.5)]"
                >
                  Create Account
                </Button>
                <p className="text-[11px] text-slate-300/80 text-center">
                  By continuing, you agree to the Terms &amp; Privacy Policy.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
