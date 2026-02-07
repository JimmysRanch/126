import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CreditCard, CheckCircle, Warning, ArrowSquareOut, ShieldCheck, Gear } from "@phosphor-icons/react"
import { toast } from "sonner"
import { useStripeContext, DEFAULT_STRIPE_SETTINGS } from "@/lib/stripe-context"

export function StripeSettings() {
  const { stripeSettings, setStripeSettings, isStripeReady } = useStripeContext()
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [publishableKey, setPublishableKey] = useState(stripeSettings?.publishableKey || '')
  const [confirmDisableOpen, setConfirmDisableOpen] = useState(false)

  const handleToggleEnabled = (enabled: boolean) => {
    if (!enabled && stripeSettings?.enabled) {
      setConfirmDisableOpen(true)
      return
    }
    
    setStripeSettings((current) => ({
      ...(current || DEFAULT_STRIPE_SETTINGS),
      enabled,
    }))
    
    if (enabled) {
      toast.success('Stripe payments enabled')
      setShowKeyInput(true)
    }
  }

  const handleConfirmDisable = () => {
    setStripeSettings((current) => ({
      ...(current || DEFAULT_STRIPE_SETTINGS),
      enabled: false,
    }))
    toast.info('Stripe payments disabled')
    setConfirmDisableOpen(false)
  }

  const handleToggleTestMode = (testMode: boolean) => {
    setStripeSettings((current) => ({
      ...(current || DEFAULT_STRIPE_SETTINGS),
      testMode,
    }))
    toast.info(`Switched to ${testMode ? 'test' : 'live'} mode`)
  }

  const handleSavePublishableKey = () => {
    if (!publishableKey.trim()) {
      toast.error('Please enter a publishable key')
      return
    }

    // Validate the key format
    const isTestKey = publishableKey.startsWith('pk_test_')
    const isLiveKey = publishableKey.startsWith('pk_live_')

    if (!isTestKey && !isLiveKey) {
      toast.error('Invalid Stripe publishable key format. Keys should start with pk_test_ or pk_live_')
      return
    }

    const testMode = isTestKey

    setStripeSettings((current) => ({
      ...(current || DEFAULT_STRIPE_SETTINGS),
      publishableKey: publishableKey.trim(),
      testMode,
      lastUpdated: new Date().toISOString(),
    }))
    
    setShowKeyInput(false)
    toast.success('Stripe publishable key saved')
  }

  const handleStartOnboarding = () => {
    // In a real implementation, this would redirect to Stripe Connect onboarding
    // For this demo, we'll simulate the onboarding completion
    setStripeSettings((current) => ({
      ...(current || DEFAULT_STRIPE_SETTINGS),
      onboardingComplete: true,
      chargesEnabled: true,
      payoutsEnabled: true,
      connectedAccountStatus: 'active',
      lastUpdated: new Date().toISOString(),
    }))
    toast.success('Stripe account setup complete! You can now accept payments.')
  }

  const getStatusBadge = () => {
    if (!stripeSettings?.enabled) {
      return <Badge variant="secondary">Disabled</Badge>
    }
    if (!stripeSettings?.publishableKey) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Setup Required</Badge>
    }
    if (!stripeSettings?.onboardingComplete) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Onboarding Incomplete</Badge>
    }
    if (stripeSettings?.connectedAccountStatus === 'restricted') {
      return <Badge variant="outline" className="border-orange-500 text-orange-500">Restricted</Badge>
    }
    if (isStripeReady) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
    }
    return <Badge variant="secondary">Pending</Badge>
  }

  return (
    <Card className="p-4 md:p-6 bg-card border-border">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Stripe Payments</h2>
              <p className="text-sm text-muted-foreground">
                Accept credit card payments through Stripe
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <Separator />

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="stripe-enabled" className="text-base font-medium">
              Enable Stripe Payments
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow customers to pay with credit and debit cards
            </p>
          </div>
          <Switch
            id="stripe-enabled"
            checked={stripeSettings?.enabled || false}
            onCheckedChange={handleToggleEnabled}
          />
        </div>

        {stripeSettings?.enabled && (
          <>
            <Separator />

            {/* Test/Live Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="test-mode" className="text-base font-medium flex items-center gap-2">
                  Test Mode
                  {stripeSettings?.testMode && (
                    <Badge variant="outline" className="text-xs">
                      Test
                    </Badge>
                  )}
                </Label>
                <p className="text-sm text-muted-foreground">
                  Use test credentials to simulate payments without real charges
                </p>
              </div>
              <Switch
                id="test-mode"
                checked={stripeSettings?.testMode || false}
                onCheckedChange={handleToggleTestMode}
              />
            </div>

            <Separator />

            {/* Publishable Key Configuration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Stripe Publishable Key</Label>
                  <p className="text-sm text-muted-foreground">
                    Your publishable key from the Stripe Dashboard
                  </p>
                </div>
                {!showKeyInput && stripeSettings?.publishableKey && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPublishableKey(stripeSettings?.publishableKey || '')
                      setShowKeyInput(true)
                    }}
                  >
                    <Gear size={16} className="mr-2" />
                    Update Key
                  </Button>
                )}
              </div>

              {showKeyInput || !stripeSettings?.publishableKey ? (
                <div className="space-y-3">
                  <Input
                    type="password"
                    placeholder={`pk_${stripeSettings?.testMode ? 'test' : 'live'}_...`}
                    value={publishableKey}
                    onChange={(e) => setPublishableKey(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSavePublishableKey}>
                      Save Key
                    </Button>
                    {stripeSettings?.publishableKey && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPublishableKey(stripeSettings?.publishableKey || '')
                          setShowKeyInput(false)
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <ShieldCheck size={14} />
                    Your key is stored securely and never shared
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <div>
                    <p className="text-sm font-medium">
                      Key configured ({stripeSettings?.testMode ? 'Test' : 'Live'} mode)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stripeSettings?.publishableKey.substring(0, 12)}...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {stripeSettings?.publishableKey && (
              <>
                <Separator />

                {/* Account Status / Onboarding */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Account Setup</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete your Stripe Connect setup to start accepting payments
                    </p>
                  </div>

                  {!stripeSettings?.onboardingComplete ? (
                    <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                      <div className="flex items-start gap-3">
                        <Warning size={24} className="text-yellow-500 shrink-0 mt-0.5" />
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-yellow-500">Complete Setup Required</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              You need to complete the Stripe onboarding process to start accepting payments.
                              This includes verifying your business information and bank account.
                            </p>
                          </div>
                          <Button onClick={handleStartOnboarding} className="gap-2">
                            <ArrowSquareOut size={16} />
                            Complete Setup
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/10">
                      <div className="flex items-center gap-3">
                        <CheckCircle size={24} className="text-green-500" />
                        <div>
                          <p className="font-medium text-green-400">Account Active</p>
                          <p className="text-sm text-muted-foreground">
                            Your Stripe account is fully set up and ready to accept payments
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Account Capabilities */}
                  {stripeSettings?.onboardingComplete && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className={`p-3 rounded-lg border ${
                        stripeSettings?.chargesEnabled 
                          ? 'border-green-500/30 bg-green-500/10' 
                          : 'border-muted bg-muted/50'
                      }`}>
                        <div className="flex items-center gap-2">
                          {stripeSettings?.chargesEnabled ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Warning size={16} className="text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">Card Payments</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stripeSettings?.chargesEnabled ? 'Enabled' : 'Not available'}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg border ${
                        stripeSettings?.payoutsEnabled 
                          ? 'border-green-500/30 bg-green-500/10' 
                          : 'border-muted bg-muted/50'
                      }`}>
                        <div className="flex items-center gap-2">
                          {stripeSettings?.payoutsEnabled ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Warning size={16} className="text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">Payouts</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stripeSettings?.payoutsEnabled ? 'Enabled' : 'Not available'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Confirm Disable Dialog */}
      <AlertDialog open={confirmDisableOpen} onOpenChange={setConfirmDisableOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable Stripe Payments?</AlertDialogTitle>
            <AlertDialogDescription>
              This will prevent customers from paying with credit or debit cards. 
              Your configuration will be saved so you can re-enable it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDisable}>
              Disable Stripe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
