import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Sparkle } from "@phosphor-icons/react"
import { toast } from "sonner"
import { PuppyMascot } from "@/components/PuppyMascot"

export function StaffOnboarding() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
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
    
    navigate(`/dev/staff-profile-setup?email=${encodeURIComponent(email)}`)
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
      
      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <Card className="w-full p-8 bg-card/90 backdrop-blur-sm border-primary/20 shadow-2xl">
          <div className="text-center mb-8">
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
                value={email}
                disabled
                className="bg-muted/50"
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
          
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our terms and conditions
            </p>
          </div>
        </Card>
        
        <div className="hidden lg:block">
          <PuppyMascot />
        </div>
      </div>
    </div>
  )
}
