import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Info, CurrencyDollar } from "@phosphor-icons/react"
import { toast } from "sonner"

type GuaranteePayoutMode = "both" | "higher"

interface CompensationConfig {
  commission: {
    enabled: boolean
    percentage: number
  }
  hourly: {
    enabled: boolean
    rate: number
  }
  salary: {
    enabled: boolean
    annualAmount: number
  }
  weeklyGuarantee: {
    enabled: boolean
    amount: number
    payoutMode: GuaranteePayoutMode
  }
  teamOverrides: {
    enabled: boolean
    percentage: number
  }
  refundPolicy: {
    reverseOnFullRefund: boolean
    prorateOnPartialRefund: boolean
    reverseOnChargeback: boolean
  }
}

interface StaffCompensationProps {
  staffId?: string
  staffName: string
}

export function StaffCompensation({ staffName }: StaffCompensationProps) {
  const [config, setConfig] = useState<CompensationConfig>({
    commission: { enabled: false, percentage: 0 },
    hourly: { enabled: false, rate: 0 },
    salary: { enabled: false, annualAmount: 0 },
    weeklyGuarantee: { enabled: false, amount: 0, payoutMode: "higher" },
    teamOverrides: { enabled: false, percentage: 0 },
    refundPolicy: {
      reverseOnFullRefund: true,
      prorateOnPartialRefund: true,
      reverseOnChargeback: true
    }
  })

  const validateConfig = (): boolean => {
    if (config.commission.enabled && config.commission.percentage <= 0) {
      toast.error("Commission percentage must be greater than 0")
      return false
    }
    if (config.hourly.enabled && config.hourly.rate <= 0) {
      toast.error("Hourly rate must be greater than 0")
      return false
    }
    if (config.salary.enabled && config.salary.annualAmount <= 0) {
      toast.error("Salary amount must be greater than 0")
      return false
    }
    if (config.weeklyGuarantee.enabled && config.weeklyGuarantee.amount <= 0) {
      toast.error("Weekly guarantee amount must be greater than 0")
      return false
    }
    if (config.weeklyGuarantee.enabled && !config.commission.enabled) {
      toast.error("Weekly Guarantee requires Commission to be enabled")
      return false
    }
    if (config.weeklyGuarantee.enabled && (config.hourly.enabled || config.salary.enabled)) {
      toast.error("Weekly Guarantee cannot be combined with Hourly or Salary")
      return false
    }
    if (config.salary.enabled && config.hourly.enabled) {
      toast.error("Salary and Hourly cannot be enabled together")
      return false
    }
    if (config.salary.enabled && config.commission.enabled) {
      toast.error("Salary and Commission cannot be enabled together")
      return false
    }
    return true
  }

  const handleSave = () => {
    if (!validateConfig()) return
    toast.success("Compensation configuration saved successfully")
  }

  const calculatePaySummary = () => {
    const summary = {
      base: 0,
      commission: 0,
      overrides: 0,
      retail: 0,
      tips: 0,
      overtime: 0,
      total: 0
    }

    if (config.hourly.enabled) {
      summary.base = config.hourly.rate * 40
    }
    if (config.salary.enabled) {
      summary.base = config.salary.annualAmount / 52
    }
    if (config.weeklyGuarantee.enabled) {
      summary.base = config.weeklyGuarantee.amount
    }
    
    summary.commission = 450
    summary.overrides = config.teamOverrides.enabled ? 150 : 0
    summary.retail = 50
    summary.tips = 200
    summary.overtime = config.hourly.enabled ? 120 : 0

    if (config.weeklyGuarantee.enabled && config.weeklyGuarantee.payoutMode === "higher") {
      summary.total = Math.max(summary.base, summary.commission) + summary.overrides + summary.retail + summary.tips + summary.overtime
    } else {
      summary.total = summary.base + summary.commission + summary.overrides + summary.retail + summary.tips + summary.overtime
    }

    return summary
  }

  const paySummary = calculatePaySummary()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compensation Configuration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Set up how {staffName} will be compensated
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="p-6 bg-card border-border space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Label className="text-base font-semibold">Commission on Personal Grooms</Label>
                <p className="text-sm text-muted-foreground">
                  Pay a percentage of every dog this staff member personally grooms
                </p>
              </div>
              <Switch
                checked={config.commission.enabled}
                onCheckedChange={(enabled) => {
                  setConfig(prev => ({
                    ...prev,
                    commission: { ...prev.commission, enabled }
                  }))
                }}
              />
            </div>

            {config.commission.enabled && (
              <div className="pl-4 border-l-2 border-primary/30">
                <Label htmlFor="commission-percentage">Commission Percentage (%)</Label>
                <Input
                  id="commission-percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={config.commission.percentage || ""}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    commission: { ...prev.commission, percentage: parseFloat(e.target.value) || 0 }
                  }))}
                  placeholder="e.g., 50"
                  className="mt-2 max-w-xs"
                />
                <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground flex items-start gap-2">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    Commission is calculated on service revenue (pre-tax, after discounts). Excludes taxes, tips, and retail.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Label className="text-base font-semibold">Hourly Pay</Label>
                <p className="text-sm text-muted-foreground">
                  Guarantee an hourly base rate in addition to any other earnings
                </p>
              </div>
              <Switch
                checked={config.hourly.enabled}
                onCheckedChange={(enabled) => {
                  setConfig(prev => ({
                    ...prev,
                    hourly: { ...prev.hourly, enabled }
                  }))
                }}
              />
            </div>

            {config.hourly.enabled && (
              <div className="pl-4 border-l-2 border-primary/30 space-y-3">
                <div>
                  <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                  <Input
                    id="hourly-rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={config.hourly.rate || ""}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      hourly: { ...prev.hourly, rate: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="e.g., 18.50"
                    className="mt-2 max-w-xs"
                  />
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground flex items-start gap-2">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    Overtime is automatically enabled at 1.5× after 40 hours (Monday–Sunday week)
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Label className="text-base font-semibold">Salary</Label>
                <p className="text-sm text-muted-foreground">
                  Fixed annual compensation
                </p>
              </div>
              <Switch
                checked={config.salary.enabled}
                onCheckedChange={(enabled) => {
                  setConfig(prev => ({
                    ...prev,
                    salary: { ...prev.salary, enabled }
                  }))
                }}
              />
            </div>

            {config.salary.enabled && (
              <div className="pl-4 border-l-2 border-primary/30">
                <Label htmlFor="salary-amount">Annual Salary ($)</Label>
                <Input
                  id="salary-amount"
                  type="number"
                  min="0"
                  step="1000"
                  value={config.salary.annualAmount || ""}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    salary: { ...prev.salary, annualAmount: parseFloat(e.target.value) || 0 }
                  }))}
                  placeholder="e.g., 52000"
                  className="mt-2 max-w-xs"
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Label className="text-base font-semibold">Weekly Guarantee vs Commission</Label>
                <p className="text-sm text-muted-foreground">
                  Guarantee pay per week and choose whether it's paid alongside commission or whichever is higher
                </p>
              </div>
              <Switch
                checked={config.weeklyGuarantee.enabled}
                onCheckedChange={(enabled) => {
                  setConfig(prev => ({
                    ...prev,
                    weeklyGuarantee: { ...prev.weeklyGuarantee, enabled }
                  }))
                }}
              />
            </div>

            {config.weeklyGuarantee.enabled && (
              <div className="pl-4 border-l-2 border-primary/30 space-y-4">
                <div>
                  <Label htmlFor="weekly-guarantee">Weekly Guarantee Amount ($)</Label>
                  <Input
                    id="weekly-guarantee"
                    type="number"
                    min="0"
                    step="50"
                    value={config.weeklyGuarantee.amount || ""}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      weeklyGuarantee: { ...prev.weeklyGuarantee, amount: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="e.g., 800"
                    className="mt-2 max-w-xs"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-3 block">How should the guarantee pay out?</Label>
                  <RadioGroup
                    value={config.weeklyGuarantee.payoutMode}
                    onValueChange={(value) => setConfig(prev => ({
                      ...prev,
                      weeklyGuarantee: { ...prev.weeklyGuarantee, payoutMode: value as GuaranteePayoutMode }
                    }))}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="both" id="payout-both" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="payout-both" className="cursor-pointer">
                          <div className="font-semibold">Pay Both (guarantee + full commission)</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            They receive both the guaranteed amount and whatever commission they earn
                          </p>
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="higher" id="payout-higher" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="payout-higher" className="cursor-pointer">
                          <div className="font-semibold">Pay whichever amount is higher</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Compare their commission earnings to the guarantee and pay the larger amount
                          </p>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Label className="text-base font-semibold">Team Overrides</Label>
                <p className="text-sm text-muted-foreground">
                  Pay them an extra share of appointments completed by groomers they manage
                </p>
              </div>
              <Switch
                checked={config.teamOverrides.enabled}
                onCheckedChange={(enabled) => {
                  setConfig(prev => ({
                    ...prev,
                    teamOverrides: { ...prev.teamOverrides, enabled }
                  }))
                }}
              />
            </div>

            {config.teamOverrides.enabled && (
              <div className="pl-4 border-l-2 border-primary/30">
                <Label htmlFor="team-override-percentage">Override Percentage (%)</Label>
                <Input
                  id="team-override-percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={config.teamOverrides.percentage || ""}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    teamOverrides: { ...prev.teamOverrides, percentage: parseFloat(e.target.value) || 0 }
                  }))}
                  placeholder="e.g., 5"
                  className="mt-2 max-w-xs"
                />
                <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground flex items-start gap-2">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    This amount comes from the business share—groomers below them keep their full commission
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold block mb-3">Refunds / Chargebacks Policy</Label>
              <div className="space-y-3 pl-4 border-l-2 border-primary/30">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <Label className="font-medium">Reverse commission on full refunds</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Commission is clawed back when a full refund is issued
                    </p>
                  </div>
                  <Switch
                    checked={config.refundPolicy.reverseOnFullRefund}
                    onCheckedChange={(checked) => setConfig(prev => ({
                      ...prev,
                      refundPolicy: { ...prev.refundPolicy, reverseOnFullRefund: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <Label className="font-medium">Prorate commission on partial refunds</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Commission is reduced proportionally to the refund amount
                    </p>
                  </div>
                  <Switch
                    checked={config.refundPolicy.prorateOnPartialRefund}
                    onCheckedChange={(checked) => setConfig(prev => ({
                      ...prev,
                      refundPolicy: { ...prev.refundPolicy, prorateOnPartialRefund: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <Label className="font-medium">Reverse commission on chargebacks</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Commission is reversed on disputed payment amounts
                    </p>
                  </div>
                  <Switch
                    checked={config.refundPolicy.reverseOnChargeback}
                    onCheckedChange={(checked) => setConfig(prev => ({
                      ...prev,
                      refundPolicy: { ...prev.refundPolicy, reverseOnChargeback: checked }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CurrencyDollar size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Pay Summary</h3>
              <p className="text-xs text-muted-foreground">Example weekly breakdown based on configuration</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Base / Guarantee</span>
              <span className="font-semibold">${paySummary.base.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Commission</span>
              <span className="font-semibold">${paySummary.commission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Team Overrides</span>
              <span className="font-semibold">${paySummary.overrides.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Retail Commission</span>
              <span className="font-semibold">${paySummary.retail.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Tips (100% to staff)</span>
              <span className="font-semibold">${paySummary.tips.toFixed(2)}</span>
            </div>
            {config.hourly.enabled && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Overtime</span>
                <span className="font-semibold">${paySummary.overtime.toFixed(2)}</span>
              </div>
            )}
            
            <Separator className="my-2" />
            
            <div className="flex justify-between items-center py-3 bg-primary/5 rounded-lg px-4">
              <span className="font-bold">Total Weekly Pay</span>
              <span className="text-2xl font-bold text-primary">${paySummary.total.toFixed(2)}</span>
            </div>
          </div>

          {config.weeklyGuarantee.enabled && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <Info size={14} className="mt-0.5 shrink-0" />
                {config.weeklyGuarantee.payoutMode === "higher"
                  ? "This staff member will receive the higher of the guarantee or their commission earnings, plus all other compensation."
                  : "This staff member will receive the guarantee amount plus their full commission and all other compensation."}
              </p>
            </div>
          )}
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  )
}
