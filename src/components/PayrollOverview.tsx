import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { Download, CalendarBlank, Clock, Check, X } from "@phosphor-icons/react"
import { useNavigate, useLocation } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"

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

const mockPayrollData: PayrollData[] = [
  {
    staffId: "1",
    staffName: "Sarah Johnson",
    role: "Senior Groomer",
    payPeriod: "Jan 16 - Jan 31, 2025",
    regularHours: 80,
    overtimeHours: 4,
    hourlyRate: 35,
    grossPay: 3010,
    deductions: 603,
    netPay: 2407,
    status: "Pending",
    appointmentsCompleted: 42,
    tips: 1180
  },
  {
    staffId: "2",
    staffName: "Mike Torres",
    role: "Groomer",
    payPeriod: "Jan 16 - Jan 31, 2025",
    regularHours: 80,
    overtimeHours: 2,
    hourlyRate: 28,
    grossPay: 2324,
    deductions: 465,
    netPay: 1859,
    status: "Approved",
    appointmentsCompleted: 38,
    tips: 836
  },
  {
    staffId: "3",
    staffName: "Emma Roberts",
    role: "Spa Specialist",
    payPeriod: "Jan 16 - Jan 31, 2025",
    regularHours: 80,
    overtimeHours: 0,
    hourlyRate: 32,
    grossPay: 2560,
    deductions: 512,
    netPay: 2048,
    status: "Approved",
    appointmentsCompleted: 35,
    tips: 1050
  },
  {
    staffId: "4",
    staffName: "Carlos Martinez",
    role: "Bather",
    payPeriod: "Jan 16 - Jan 31, 2025",
    regularHours: 80,
    overtimeHours: 6,
    hourlyRate: 22,
    grossPay: 1958,
    deductions: 392,
    netPay: 1566,
    status: "Paid",
    appointmentsCompleted: 52,
    tips: 520
  },
  {
    staffId: "5",
    staffName: "Lisa Chen",
    role: "Groomer",
    payPeriod: "Jan 16 - Jan 31, 2025",
    regularHours: 0,
    overtimeHours: 0,
    hourlyRate: 30,
    grossPay: 0,
    deductions: 0,
    netPay: 0,
    status: "Pending",
    appointmentsCompleted: 0,
    tips: 0
  }
]

export function PayrollOverview() {
  const [activeView, setActiveView] = useState("current")
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile()
  
  const isFinancesTab = location.pathname.startsWith('/finances')

  const currentPeriodTotal = mockPayrollData.reduce((acc, curr) => acc + curr.netPay, 0)
  const currentPeriodGross = mockPayrollData.reduce((acc, curr) => acc + curr.grossPay, 0)
  const currentPeriodDeductions = mockPayrollData.reduce((acc, curr) => acc + curr.deductions, 0)

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
          {mockPayrollData.map((payroll) => (
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
          ))}
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
