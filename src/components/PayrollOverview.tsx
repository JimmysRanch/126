import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { Download, CalendarBlank, Clock, Check, X } from "@phosphor-icons/react"
import { useNavigate, useLocation } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"
import { useKV } from "@github/spark/hooks"
import { Appointment, Transaction } from "@/lib/types"

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
    .map((apt) => new Date(apt.date))
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
  
  const isFinancesTab = location.pathname.startsWith('/finances')

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
        <Card className="p-2 md:p-2.5 border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">CURRENT PERIOD</p>
              <p className="text-lg md:text-xl font-bold mt-0.5">Jan 16 - 31</p>
            </div>
          </div>
        </Card>
        <Card className="p-2 md:p-2.5 border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">GROSS PAY</p>
              <p className="text-lg md:text-xl font-bold mt-0.5">${currentPeriodGross.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-2 md:p-2.5 border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">DEDUCTIONS</p>
              <p className="text-lg md:text-xl font-bold mt-0.5">${currentPeriodDeductions.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-2 md:p-2.5 border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">NET PAY</p>
              <p className="text-lg md:text-xl font-bold mt-0.5">${currentPeriodTotal.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button 
          className={`bg-primary text-primary-foreground hover:bg-primary/90 font-semibold ${isMobile ? 'w-full' : ''}`}
        >
          <Download size={18} className="mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <div className="flex justify-center mb-3">
          <TabsList className={`bg-secondary/50 ${isMobile ? 'grid grid-cols-2 w-full' : ''}`}>
            <TabsTrigger 
              value="current" 
              className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${isMobile ? 'text-xs' : ''}`}
            >
              Current Period
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${isMobile ? 'text-xs' : ''}`}
            >
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="current" className="mt-0 space-y-2">
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
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <Card className="p-8 sm:p-12 bg-card border-border text-center">
            <p className="text-sm sm:text-base text-muted-foreground">
              Historical payroll records will appear here.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
