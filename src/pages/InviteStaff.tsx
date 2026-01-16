import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, PaperPlaneRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface PendingStaff {
  id: string
  email: string
  invitedAt: string
  status: 'pending'
}

export function InviteStaff() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pendingStaff, setPendingStaff] = useKV<PendingStaff[]>('pending-staff', [])

  const handleSendInvite = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const newPendingStaff: PendingStaff = {
        id: Date.now().toString(),
        email,
        invitedAt: new Date().toISOString(),
        status: 'pending'
      }

      setPendingStaff((current) => [...(current || []), newPendingStaff])

      toast.success(`Invitation sent to ${email}`, {
        description: 'The staff member will receive an email with setup instructions.'
      })

      setTimeout(() => {
        navigate('/staff')
      }, 1500)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4 sm:mb-6 hover:bg-secondary/50"
          onClick={() => navigate('/staff')}
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Staff
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Invite Staff Member</h1>
          <p className="text-muted-foreground">
            Send an invitation to join your team. They'll receive an email with instructions to create their account.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">
                Email Address
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                This email will be used as their username for login
              </p>
              <Input
                id="email"
                type="email"
                placeholder="staff@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-base"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendInvite()
                  }
                }}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSendInvite}
                disabled={isLoading || !email}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold flex-1 sm:flex-initial"
              >
                <PaperPlaneRight size={18} className="mr-2" />
                {isLoading ? 'Sending...' : 'Send Invite'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/staff')}
                disabled={isLoading}
                className="flex-1 sm:flex-initial"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border">
          <h3 className="font-semibold mb-2">What happens next?</h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>• The staff member will receive an email invitation</li>
            <li>• They'll click the link to create their account and password</li>
            <li>• They'll complete their profile with personal information</li>
            <li>• Once approved, they can access the system</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
