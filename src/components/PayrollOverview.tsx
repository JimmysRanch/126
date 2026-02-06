import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import { Download, CalendarBlank, Clock, Check, Info } from "@phosphor-icons/react"
import { useNavigate, useLocation } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"
import { useKV } from "@github/spark/hooks"
import { Appointment, Transaction } from "@/lib/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  getCurrentPayPeriod, 
  getPreviousPayPeriod, 
  getUpcomingPayPeriod, 
  formatPayPeriodRange, 
  getPayPeriodSettings,
  getPayPeriodScheduleDescription,
  type PayPeriodSettings
} from "@/lib/payroll-utils"
import { parseDateStringAsLocal } from "@/lib/date-utils"

interface PayrollData {
  staffId: string
  staffName: string
  role: string
  payPeriod: string
  regularHours: number
  overtimeHours: number
  hourlyRate: number
  grossPay: number
  deductions: number
  netPay: number
  status: "Pending" | "Approved" | "Paid"
  appointmentsCompleted: number
  tips: number
}

const getPayPeriodLabel = (staffAppointments: Appointment[]) => {
  if (staffAppointments.length === 0) return "No completed appointments"
  const sortedDates = staffAppointments
    .map((apt) => parseDateStringAsLocal(apt.date))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())
  if (sortedDates.length === 0) return "No completed appointments"
  const start = sortedDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  const end = sortedDates[sortedDates.length - 1].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  return `${start} - ${end}`
}

export function PayrollOverview() {
  const [activeView, setActiveView] = useState("current")
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile()
  const [appointments] = useKV<Appointment[]>("appointments", [])
  const [transactions] = useKV<Transaction[]>("transactions", [])
  // Used as dependency to trigger recalculation when settings change
  const [payrollSettingsKV] = useKV<{ payPeriod: PayPeriodSettings }>("payroll-settings", null)
  
  const isFinancesTab = location.pathname.startsWith('/finances')

  // Calculate pay periods based on user settings
  // We use payrollSettingsKV as a dependency to re-trigger calculation when settings change
  const payPeriods = useMemo(() => {
    const settings = getPayPeriodSettings()
    const currentPeriod = getCurrentPayPeriod()
    const previousPeriod = getPreviousPayPeriod()
    const nextPeriod = getUpcomingPayPeriod(1)
    const upcomingPeriod = getUpcomingPayPeriod(2)
    
    return {
      settings,
      current: currentPeriod,
      previous: previousPeriod,
      next: nextPeriod,
      upcoming: upcomingPeriod,
      currentDisplay: formatPayPeriodRange(currentPeriod),
      previousDisplay: formatPayPeriodRange(previousPeriod),
      nextDisplay: formatPayPeriodRange(nextPeriod),
      upcomingDisplay: formatPayPeriodRange(upcomingPeriod),
      scheduleDescription: getPayPeriodScheduleDescription(settings.type)
    }
  }, [payrollSettingsKV])

  const transactionMap = new Map(
    (transactions || [])
      .filter((transaction) => transaction.appointmentId)
      .map((transaction) => [transaction.appointmentId as string, transaction])
  )
  const completedAppointments = (appointments || []).filter(
    (apt) => apt.status === "completed" || apt.status === "paid"
  )
  const staffSummary = completedAppointments.reduce((acc, apt) => {
    const transaction = transactionMap.get(apt.id)
    const tipAmount = transaction?.tipAmount ?? apt.tipAmount ?? 0
    const revenue = transaction ? Math.max(0, transaction.total - tipAmount) : apt.totalPrice
    const existing = acc.get(apt.groomerId) ?? {
      staffId: apt.groomerId,
      staffName: apt.groomerName,
      role: "Groomer",
      appointments: [] as Appointment[],
      grossPay: 0,
      tips: 0,
      appointmentsCompleted: 0
    }
    existing.grossPay += revenue
    existing.tips += tipAmount
    existing.appointmentsCompleted += 1
    existing.appointments.push(apt)
    acc.set(apt.groomerId, existing)
    return acc
  }, new Map<string, { staffId: string; staffName: string; role: string; appointments: Appointment[]; grossPay: number; tips: number; appointmentsCompleted: number }>())
  const payrollData: PayrollData[] = Array.from(staffSummary.values()).map((summary) => {
    const payPeriod = getPayPeriodLabel(summary.appointments)
    const grossPay = summary.grossPay
    const netPay = grossPay + summary.tips
    return {
      staffId: summary.staffId,
      staffName: summary.staffName,
      role: summary.role,
      payPeriod,
      regularHours: 0,
      overtimeHours: 0,
      hourlyRate: 0,
      grossPay,
      deductions: 0,
      netPay,
      status: "Pending",
      appointmentsCompleted: summary.appointmentsCompleted,
      tips: summary.tips
    }
  })

  const currentPeriodTotal = payrollData.reduce((acc, curr) => acc + curr.netPay, 0)
  const currentPeriodGross = payrollData.reduce((acc, curr) => acc + curr.grossPay, 0)
  const currentPeriodDeductions = payrollData.reduce((acc, curr) => acc + curr.deductions, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-primary text-primary-foreground"
      case "Approved":
        return "bg-accent/20 text-accent border-accent"
      case "Pending":
        return "bg-secondary text-secondary-foreground"
      default:
        return ""
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <Check size={14} weight="bold" />
      case "Approved":
        return <Check size={14} />
      case "Pending":
        return <Clock size={14} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-3`}>
        <Popover>
          <PopoverTrigger asChild>
            <Card className="p-2 md:p-2.5 border-border cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">CURRENT PERIOD</p>
                    <CalendarBlank size={12} className="text-muted-foreground" />
                  </div>
                  <p className="text-lg md:text-xl font-bold mt-0.5">{payPeriods.currentDisplay}</p>
                </div>
              </div>
            </Card>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Payroll Periods</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-primary/10 border border-primary/30 rounded-md">
                  <p className="font-semibold text-primary">Current</p>
                  <p className="text-muted-foreground">{payPeriods.currentDisplay}</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <p className="font-semibold">Previous</p>
                  <p className="text-muted-foreground">{payPeriods.previousDisplay}</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <p className="font-semibold">Next</p>
                  <p className="text-muted-foreground">{payPeriods.nextDisplay}</p>
                </div>
                <div className="p-2 bg-muted rounded-md opacity-60">
                  <p className="font-semibold">Upcoming</p>
                  <p className="text-muted-foreground">{payPeriods.upcomingDisplay}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{payPeriods.scheduleDescription}</p>
            </div>
          </PopoverContent>
        </Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">GROSS PAY</p>
                      <Info size={10} className="text-muted-foreground" />
                    </div>
                    <p className="text-lg md:text-xl font-bold mt-0.5">${currentPeriodGross.toLocaleString()}</p>
                    <p className="text-[9px] text-muted-foreground">Total before deductions</p>
                  </div>
                </div>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Total earnings before taxes and other deductions are applied</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Card className="p-2 md:p-2.5 border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">DEDUCTIONS</p>
              <p className="text-lg md:text-xl font-bold mt-0.5">${currentPeriodDeductions.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">NET PAY</p>
                      <Info size={10} className="text-muted-foreground" />
                    </div>
                    <p className="text-lg md:text-xl font-bold mt-0.5">${currentPeriodTotal.toLocaleString()}</p>
                    <p className="text-[9px] text-muted-foreground">Take-home amount</p>
                  </div>
                </div>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Final amount paid to employees after all deductions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          variant="outline"
          className={`font-semibold ${isMobile ? 'flex-1' : ''}`}
          onClick={() => setActiveView("history")}
        >
          <Clock size={18} className="mr-2" />
          History
        </Button>
        <Button 
          className={`bg-primary text-primary-foreground hover:bg-primary/90 font-semibold ${isMobile ? 'flex-1' : ''}`}
        >
          <Download size={18} className="mr-2" />
          Export Report
        </Button>
      </div>

      <div className="space-y-2">
        {activeView === "current" ? (
          <>
            {payrollData.length === 0 ? (
              <Card className="p-4 text-center text-muted-foreground">No payroll activity yet.</Card>
            ) : (
              payrollData.map((payroll) => (
              <Card
                key={payroll.staffId}
                className="p-3 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  const path = isFinancesTab 
                    ? `/finances/staff/${payroll.staffId}/payroll-breakdown`
                    : `/staff/${payroll.staffId}/payroll-breakdown`
                  navigate(path)
                }}
              >
                {isMobile ? (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold mb-1">{payroll.staffName}</h3>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {payroll.role}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={`${getStatusColor(payroll.status)} text-xs`}
                          >
                            <span className="mr-1">{getStatusIcon(payroll.status)}</span>
                            {payroll.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-bold text-primary">${payroll.netPay.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground">Net Pay</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                      <div className="bg-secondary/30 rounded-md p-2">
                        <div className="text-[10px] text-muted-foreground mb-0.5">
                          Hours
                        </div>
                        <div className="text-xs font-semibold">
                          {payroll.regularHours}h
                          {payroll.overtimeHours > 0 && (
                            <span className="text-primary ml-1">+{payroll.overtimeHours} OT</span>
                          )}
                        </div>
                      </div>
                      <div className="bg-secondary/30 rounded-md p-2">
                        <div className="text-[10px] text-muted-foreground mb-0.5">
                          Gross Pay
                        </div>
                        <div className="text-xs font-semibold">${payroll.grossPay.toLocaleString()}</div>
                      </div>
                      <div className="bg-secondary/30 rounded-md p-2">
                        <div className="text-[10px] text-muted-foreground mb-0.5">
                          Appointments
                        </div>
                        <div className="text-xs font-semibold">{payroll.appointmentsCompleted}</div>
                      </div>
                      <div className="bg-secondary/30 rounded-md p-2">
                        <div className="text-[10px] text-muted-foreground mb-0.5">
                          Tips
                        </div>
                        <div className="text-xs font-semibold text-primary">${payroll.tips.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold">{payroll.staffName}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {payroll.role}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={`${getStatusColor(payroll.status)}`}
                        >
                          <span className="mr-1.5">{getStatusIcon(payroll.status)}</span>
                          {payroll.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarBlank size={16} />
                          <span>{payroll.payPeriod}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>
                            {payroll.regularHours}h regular
                            {payroll.overtimeHours > 0 && (
                              <span className="text-primary ml-1">+ {payroll.overtimeHours}h OT</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Appointments
                        </div>
                        <div className="font-semibold">{payroll.appointmentsCompleted}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Tips
                        </div>
                        <div className="font-semibold text-primary">${payroll.tips.toLocaleString()}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Gross Pay
                        </div>
                        <div className="font-semibold">${payroll.grossPay.toLocaleString()}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Deductions
                        </div>
                        <div className="font-semibold">${payroll.deductions.toLocaleString()}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Net Pay
                        </div>
                        <div className="text-xl font-bold text-primary">${payroll.netPay.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
          </>
        ) : (
          <Card className="p-8 sm:p-12 bg-card border-border text-center">
            <p className="text-sm sm:text-base text-muted-foreground">
              Historical payroll records will appear here.
            </p>
            <Button 
              variant="outline"
              className="mt-4"
              onClick={() => setActiveView("current")}
            >
              Back to Current Period
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
