import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Sparkle } from "@phosphor-icons/react"
import { toast } from "sonner"
import accountImage from '@/assets/images/13360FA3-D47D-48D3-A65A-6BB641E09F62.png'
import { useKV } from "@github/spark/hooks"
import { Staff } from "@/lib/types"

interface PendingStaff {
  id: string
  email: string
  invitedAt: string
  status: 'pending'
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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.35_0.15_195),transparent_50%)] opacity-30"></div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/settings')}
        className="fixed top-4 right-4 z-50 bg-card/80 backdrop-blur-sm border border-border text-xs"
      >
        <ArrowLeft size={14} className="mr-1" />
        Back to App
      </Button>
      
      <div className="w-full max-w-4xl relative z-10">
        <Card className="w-full overflow-hidden bg-card/90 backdrop-blur-sm border-primary/20 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-10 order-2 lg:order-1">
              <div className="text-center lg:text-left mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Sparkle size={32} className="text-primary" weight="duotone" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Welcome to Scruffy Butts!</h1>
                <p className="text-muted-foreground text-sm">
                  Let's set up your account and get you started
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailInput}
                    placeholder="you@example.com"
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be your username
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Create Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateAccount()
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateAccount()
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                </div>
                
                <Button
                  onClick={handleCreateAccount}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 text-base"
                >
                  Create Account
                </Button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border text-center lg:text-left">
                <p className="text-xs text-muted-foreground">
                  By creating an account, you agree to our terms and conditions
                </p>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-8 order-1 lg:order-2 min-h-[280px] lg:min-h-0">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl"></div>
                <img 
                  src={accountImage} 
                  alt="Welcome puppy mascot" 
                  className="relative w-64 h-auto object-contain animate-[float_6s_ease-in-out_infinite]"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
