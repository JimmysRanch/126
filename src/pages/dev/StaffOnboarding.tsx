import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "@phosphor-icons/react"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"
import { Staff } from "@/lib/types"
import { staffOnboardingBackgroundDataUrl } from '@/assets/staffOnboardingBackground'

interface PendingStaff {
  id: string
  email: string
  invitedAt: string
  status: 'pending'
}

interface BusinessInfo {
  companyName?: string
  logoUrl?: string
}

export function StaffOnboarding() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pendingStaff, setPendingStaff] = useKV<PendingStaff[]>('pending-staff', [])
  const [staffMembers, setStaffMembers] = useKV<Staff[]>("staff", [])
  const [businessInfo] = useKV<BusinessInfo>("business-info", {})
  const companyName = businessInfo?.companyName?.trim() || "your business"

  const fallbackName = useMemo(() => {
    if (!email) return "New Staff Member"
    const localPart = email.split('@')[0] || ""
    if (!localPart) return "New Staff Member"
    return localPart
      .replace(/[._-]+/g, " ")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "New Staff Member"
  }, [email])
  
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

    if (!email) {
      toast.error("Missing staff email. Please use the invitation link.")
      return
    }

    const pendingEntry = (pendingStaff || []).find((staff) => staff.email === email)
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
        email,
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

    setPendingStaff((current) => (current || []).filter((staff) => staff.email !== email))
    
    navigate(`/dev/staff-profile-setup?email=${encodeURIComponent(email)}&staffId=${encodeURIComponent(staffId)}`)
  }
  
  return (
    <div
      className="h-screen text-white flex items-center justify-center px-4 py-8 sm:p-6 relative overflow-hidden bg-[#050824]"
      style={{
        backgroundImage: `url(${staffOnboardingBackgroundDataUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-[#050824]/40"></div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/settings')}
        className="fixed top-4 right-4 z-50 bg-white/10 text-white border border-white/20 text-xs hover:bg-white/20"
      >
        <ArrowLeft size={14} className="mr-1" />
        Back to App
      </Button>

      <div className="w-full max-w-xl md:max-w-3xl relative z-10 max-h-[calc(100vh-3rem)]">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-2xl bg-[#53c4ff]/50"></div>
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle_at_30%_25%,#9be6ff,#3aa6ff_55%,#1c5bc9_100%)] border border-[#79d5ff] shadow-[0_0_40px_rgba(81,182,255,0.8)] flex items-center justify-center">
              <div className="text-center leading-tight">
                {businessInfo?.logoUrl ? (
                  <img
                    src={businessInfo.logoUrl}
                    alt={`${companyName} logo`}
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover"
                  />
                ) : (
                  <>
                    <p className="text-3xl sm:text-4xl font-extrabold italic text-white drop-shadow-[0_6px_0_rgba(208,51,156,0.9)]">
                      Scruffy
                    </p>
                    <p className="text-3xl sm:text-4xl font-extrabold italic text-white drop-shadow-[0_6px_0_rgba(208,51,156,0.9)]">
                      Butts
                    </p>
                    <p className="mt-2 text-xs tracking-[0.3em] text-white/90">DOG GROOMING</p>
                    <p className="text-xs tracking-[0.3em] text-white/80">NATALIA TX</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              You&apos;ve been invited to join {companyName}
            </h1>
            <p className="text-sm md:text-base text-white/70">
              Create your staff account to get started.
            </p>
          </div>
        </div>

        <div className="relative mt-6 md:mt-8 mb-6 md:mb-8 rounded-2xl border border-[#79d5ff]/40 bg-[linear-gradient(145deg,rgba(16,43,102,0.88),rgba(8,16,43,0.88))] p-5 sm:p-6 md:p-8 shadow-[0_0_45px_rgba(64,159,255,0.45)]">
          <div className="absolute inset-x-6 -top-2 h-3 rounded-full bg-[#62c9ff] blur-md opacity-70"></div>

          <div className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-white/90">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-white/5 border border-white/20 text-white placeholder:text-white/40"
              />
              <p className="text-xs text-white/50">Protect be yeer hers.</p>
            </div>

            <div className="space-y-3">
              <p className="text-base font-semibold text-white/90">Set your password</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateAccount()
                  }}
                  className="bg-white/5 border border-white/20 text-white placeholder:text-white/50"
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
                  className="bg-white/5 border border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <p className="text-xs text-white/60">Must be at lest 8 characters</p>
            </div>

            <Button
              onClick={handleCreateAccount}
              className="w-full h-12 text-base font-semibold text-white bg-[linear-gradient(180deg,#70d5ff,#3e9dff)] hover:bg-[linear-gradient(180deg,#86ddff,#4ea7ff)] shadow-[0_0_18px_rgba(90,191,255,0.8)]"
            >
              <span className="flex flex-col leading-tight">
                <span>Create Account</span>
                <span className="text-xs font-normal text-white/90">
                  Takes less than a minute
                </span>
              </span>
            </Button>

            <p className="text-center text-xs text-white/60">
              By continuing, you agree to the{" "}
              <span className="underline underline-offset-2">Terms &amp; Privacy Policy</span>
            </p>
          </div>
        </div>
        <div className="relative mt-2 sm:mt-4 h-8 w-full">
          <div className="absolute inset-x-12 bottom-0 h-4 rounded-full bg-[#66ccff] blur-2xl opacity-80"></div>
          <div className="absolute inset-x-20 bottom-0 h-2 rounded-full bg-white/70 blur-lg opacity-70"></div>
        </div>
      </div>
    </div>
  )
}
