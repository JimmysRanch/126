import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Info, CurrencyDollar, Plus, X } from "@phosphor-icons/react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type GuaranteePayoutMode = "both" | "higher"

interface TeamOverride {
  staffId: string
  staffName: string
  percentage: number
}

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
    overrides: TeamOverride[]
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
    teamOverrides: { enabled: false, overrides: [] }
  })
  const switchHighlightClass = "data-[state=unchecked]:bg-muted/70 data-[state=unchecked]:border-muted-foreground/40"

  const availableStaff = [
    { id: "1", name: "Sarah Johnson" },
    { id: "2", name: "Mike Thompson" },
    { id: "3", name: "Jessica Lee" },
  ]

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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compensation Configuration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Combine hourly pay, commission, guarantees, and team overrides to match how this team member earns.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="p-6 bg-card border-border space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Label className="text-base font-semibold">Commission on personal grooms</Label>
                <p className="text-sm text-muted-foreground">
                  Pay a percentage of every dog this staff member personally grooms.
                </p>
              </div>
              <Switch
                checked={config.commission.enabled}
                className={switchHighlightClass}
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
                <Label htmlFor="commission-percentage">Commission %</Label>
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
                  placeholder="50"
                  className="mt-2 max-w-[200px]"
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Label className="text-base font-semibold">Hourly pay</Label>
                <p className="text-sm text-muted-foreground">
                  Guarantee an hourly base rate in addition to any other earnings.
                </p>
              </div>
              <Switch
                checked={config.hourly.enabled}
                className={switchHighlightClass}
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
                  <Label htmlFor="hourly-rate">Hourly rate ($)</Label>
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
                    placeholder="1"
                    className="mt-2 max-w-[200px]"
                  />
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
                  Track an annual salary amount for reporting and payroll exports.
                </p>
              </div>
              <Switch
                checked={config.salary.enabled}
                className={switchHighlightClass}
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
                <Label htmlFor="salary-amount">Salary (annual $)</Label>
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
                  placeholder="1000"
                  className="mt-2 max-w-[200px]"
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Label className="text-base font-semibold">Weekly guarantee vs. commission</Label>
                <p className="text-sm text-muted-foreground">
                  Guarantee pay per week and choose whether it's paid alongside their commission or whichever amount is higher.
                </p>
              </div>
              <Switch
                checked={config.weeklyGuarantee.enabled}
                className={switchHighlightClass}
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
                  <Label htmlFor="weekly-guarantee">Weekly guarantee ($)</Label>
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
                    placeholder="500"
                    className="mt-2 max-w-[200px]"
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
                          <div className="font-semibold">Pay the weekly guarantee and their commission</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            They receive both the guaranteed amount and whatever commission they earn.
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
                            Compare their commission earnings to the guarantee and pay the larger amount.
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
                <Label className="text-base font-semibold">Team overrides</Label>
                <p className="text-sm text-muted-foreground">
                  Pay them an extra share of the appointments completed by groomers they manage. This amount comes out of the business share—the groomers below them keep their full commission.
                </p>
              </div>
              <Switch
                checked={config.teamOverrides.enabled}
                className={switchHighlightClass}
                onCheckedChange={(enabled) => {
                  setConfig(prev => ({
                    ...prev,
                    teamOverrides: { ...prev.teamOverrides, enabled }
                  }))
                }}
              />
            </div>

            {config.teamOverrides.enabled && (
              <div className="pl-4 border-l-2 border-primary/30 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add additional staff members first to set up override relationships.
                </p>

                <div className="space-y-3">
                  {config.teamOverrides.overrides.map((override, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Team member</Label>
                        <p className="text-sm text-foreground mt-1">{override.staffName}</p>
                      </div>
                      <div className="w-40">
                        <Label className="text-sm font-medium">Override % of appointment revenue</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={override.percentage}
                          onChange={(e) => {
                            const newOverrides = [...config.teamOverrides.overrides]
                            newOverrides[index] = { ...newOverrides[index], percentage: parseFloat(e.target.value) || 0 }
                            setConfig(prev => ({
                              ...prev,
                              teamOverrides: { ...prev.teamOverrides, overrides: newOverrides }
                            }))
                          }}
                          placeholder="20"
                          className="mt-1"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOverrides = config.teamOverrides.overrides.filter((_, i) => i !== index)
                          setConfig(prev => ({
                            ...prev,
                            teamOverrides: { ...prev.teamOverrides, overrides: newOverrides }
                          }))
                        }}
                        className="mt-6 text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const firstAvailable = availableStaff.find(s => !config.teamOverrides.overrides.some(o => o.staffId === s.id))
                      if (firstAvailable) {
                        setConfig(prev => ({
                          ...prev,
                          teamOverrides: {
                            ...prev.teamOverrides,
                            overrides: [...prev.teamOverrides.overrides, { staffId: firstAvailable.id, staffName: firstAvailable.name, percentage: 0 }]
                          }
                        }))
                      }
                    }}
                    className="w-full"
                    disabled={config.teamOverrides.overrides.length >= availableStaff.length}
                  >
                    <Plus size={16} className="mr-2" />
                    Add override
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CurrencyDollar size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Pay Summary</h3>
              <p className="text-xs text-muted-foreground">Compensation structure for this staff member</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            {!config.commission.enabled && !config.hourly.enabled && !config.salary.enabled && !config.weeklyGuarantee.enabled && !config.teamOverrides.enabled && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No compensation configured yet. Enable at least one compensation method above.
              </div>
            )}

            {config.commission.enabled && (
              <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">Commission</span>
                <span className="font-bold">{config.commission.percentage}%</span>
              </div>
            )}

            {config.hourly.enabled && (
              <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">Hourly Rate</span>
                <span className="font-bold">${config.hourly.rate.toFixed(2)}/hr</span>
              </div>
            )}

            {config.salary.enabled && (
              <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">Annual Salary</span>
                <span className="font-bold">${config.salary.annualAmount.toLocaleString()}</span>
              </div>
            )}

            {config.weeklyGuarantee.enabled && (
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-muted/30">
                  <span className="text-sm font-medium">Weekly Guarantee</span>
                  <span className="font-bold">${config.weeklyGuarantee.amount.toFixed(2)}</span>
                </div>
                <div className="pl-3 py-2 border-l-2 border-primary/30">
                  <p className="text-xs text-muted-foreground">
                    {config.weeklyGuarantee.payoutMode === "higher" 
                      ? "Pay whichever is higher: guarantee or commission" 
                      : "Pay both guarantee + full commission"}
                  </p>
                </div>
              </div>
            )}

            {config.teamOverrides.enabled && config.teamOverrides.overrides.length > 0 && (
              <div className="space-y-2">
                {config.teamOverrides.overrides.map((override, index) => (
                  <div key={index} className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-muted/30">
                    <span className="text-sm font-medium">Team Override ({override.staffName})</span>
                    <span className="font-bold">{override.percentage}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Selected Compensation</h4>
            
            {!config.commission.enabled && !config.hourly.enabled && !config.salary.enabled && !config.weeklyGuarantee.enabled && !config.teamOverrides.enabled && (
              <p className="text-sm text-muted-foreground italic">No compensation configured yet</p>
            )}

            <div className="space-y-1">
              {config.commission.enabled && (
                <p className="text-sm">• {config.commission.percentage}% commission</p>
              )}

              {config.hourly.enabled && (
                <p className="text-sm">• ${config.hourly.rate.toFixed(2)}/hr</p>
              )}

              {config.salary.enabled && (
                <p className="text-sm">• ${config.salary.annualAmount.toLocaleString()} salary</p>
              )}

              {config.weeklyGuarantee.enabled && config.weeklyGuarantee.payoutMode === "higher" && (
                <p className="text-sm">• ${config.weeklyGuarantee.amount.toFixed(2)} guarantee or {config.commission.percentage}% commission—whichever is higher</p>
              )}

              {config.weeklyGuarantee.enabled && config.weeklyGuarantee.payoutMode === "both" && (
                <p className="text-sm">• ${config.weeklyGuarantee.amount.toFixed(2)} guarantee + {config.commission.percentage}% commission</p>
              )}

              {config.teamOverrides.enabled && config.teamOverrides.overrides.length > 0 && (
                <>
                  {config.teamOverrides.overrides.map((override, index) => (
                    <p key={index} className="text-sm">• {override.percentage}% team override on {override.staffName}'s appointments</p>
                  ))}
                </>
              )}
            </div>
          </div>
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
