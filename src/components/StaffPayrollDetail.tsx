import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, CalendarBlank, TrendUp } from "@phosphor-icons/react"
import { useIsMobile } from "@/hooks/use-mobile"

interface PayPeriod {
  period: string
  startDate: string
  endDate: string
  regularHours: number
  overtimeHours: number
  hourlyRate: number
  overtimeRate: number
  regularPay: number
  overtimePay: number
  grossPay: number
  deductions: {
    federalTax: number
    stateTax: number
    socialSecurity: number
    medicare: number
    healthInsurance: number
    retirement: number
  }
  netPay: number
  appointmentsCompleted: number
  tips: number
  bonuses: number
  status: "Pending" | "Approved" | "Paid"
}

interface StaffPayrollDetailProps {
  staffId?: string
  staffName: string
  hourlyRate: number
}

const mockPayPeriods: PayPeriod[] = [
  {
    period: "Jan 16 - Jan 31, 2025",
    startDate: "Jan 16, 2025",
    endDate: "Jan 31, 2025",
    regularHours: 80,
    overtimeHours: 4,
    hourlyRate: 35,
    overtimeRate: 52.5,
    regularPay: 2800,
    overtimePay: 210,
    grossPay: 3010,
    deductions: {
      federalTax: 452,
      stateTax: 90,
      socialSecurity: 187,
      medicare: 44,
      healthInsurance: 150,
      retirement: 90
    },
    netPay: 1997,
    appointmentsCompleted: 42,
    tips: 1180,
    bonuses: 0,
    status: "Pending"
  },
  {
    period: "Jan 1 - Jan 15, 2025",
    startDate: "Jan 1, 2025",
    endDate: "Jan 15, 2025",
    regularHours: 80,
    overtimeHours: 2,
    hourlyRate: 35,
    overtimeRate: 52.5,
    regularPay: 2800,
    overtimePay: 105,
    grossPay: 2905,
    deductions: {
      federalTax: 436,
      stateTax: 87,
      socialSecurity: 180,
      medicare: 42,
      healthInsurance: 150,
      retirement: 87
    },
    netPay: 1923,
    appointmentsCompleted: 39,
    tips: 1050,
    bonuses: 0,
    status: "Paid"
  },
  {
    period: "Dec 16 - Dec 31, 2024",
    startDate: "Dec 16, 2024",
    endDate: "Dec 31, 2024",
    regularHours: 80,
    overtimeHours: 8,
    hourlyRate: 35,
    overtimeRate: 52.5,
    regularPay: 2800,
    overtimePay: 420,
    grossPay: 3220,
    deductions: {
      federalTax: 483,
      stateTax: 97,
      socialSecurity: 200,
      medicare: 47,
      healthInsurance: 150,
      retirement: 97
    },
    netPay: 2146,
    appointmentsCompleted: 48,
    tips: 1420,
    bonuses: 200,
    status: "Paid"
  }
]

export function StaffPayrollDetail({ staffId, staffName, hourlyRate }: StaffPayrollDetailProps) {
  const isMobile = useIsMobile()
  
  const currentPeriod = mockPayPeriods[0]
  const totalDeductions = Object.values(currentPeriod.deductions).reduce((acc, val) => acc + val, 0)

  const yearToDateStats = {
    grossPay: mockPayPeriods.reduce((acc, p) => acc + p.grossPay, 0),
    netPay: mockPayPeriods.reduce((acc, p) => acc + p.netPay, 0),
    tips: mockPayPeriods.reduce((acc, p) => acc + p.tips, 0),
    bonuses: mockPayPeriods.reduce((acc, p) => acc + p.bonuses, 0),
    totalHours: mockPayPeriods.reduce((acc, p) => acc + p.regularHours + p.overtimeHours, 0),
    appointments: mockPayPeriods.reduce((acc, p) => acc + p.appointmentsCompleted, 0)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
        <Button 
          className={`bg-primary text-primary-foreground hover:bg-primary/90 font-semibold ${isMobile ? 'w-full' : ''}`}
        >
          <Download size={18} className="mr-2" />
          Export All Records
        </Button>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-3`}>
        <Card className="p-2 md:p-2.5 border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">YTD GROSS PAY</p>
              <p className="text-lg md:text-xl font-bold mt-0.5">${yearToDateStats.grossPay.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-2 md:p-2.5 border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">YTD NET PAY</p>
              <p className="text-lg md:text-xl font-bold mt-0.5">${yearToDateStats.netPay.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-2 md:p-2.5 border-border ${isMobile ? 'col-span-2' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">YTD TIPS + BONUSES</p>
              <p className="text-lg md:text-xl font-bold mt-0.5">${(yearToDateStats.tips + yearToDateStats.bonuses).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-1">Current Pay Period</h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <CalendarBlank size={16} />
              <span>{currentPeriod.period}</span>
              <Badge 
                variant="outline"
                className={
                  currentPeriod.status === "Paid" 
                    ? "bg-primary text-primary-foreground" 
                    : currentPeriod.status === "Approved"
                    ? "bg-accent/20 text-accent border-accent"
                    : ""
                }
              >
                {currentPeriod.status}
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            {isMobile ? "Export" : "Export Paystub"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div className="bg-secondary/20 rounded-lg p-3 sm:p-4">
              <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Earnings Breakdown
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Regular Hours ({currentPeriod.regularHours}h @ ${currentPeriod.hourlyRate}/hr)
                  </span>
                  <span className="font-semibold">${currentPeriod.regularPay.toLocaleString()}</span>
                </div>
                {currentPeriod.overtimeHours > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Overtime Hours ({currentPeriod.overtimeHours}h @ ${currentPeriod.overtimeRate}/hr)
                    </span>
                    <span className="font-semibold text-primary">${currentPeriod.overtimePay.toLocaleString()}</span>
                  </div>
                )}
                {currentPeriod.bonuses > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">Performance Bonus</span>
                    <span className="font-semibold text-primary">${currentPeriod.bonuses.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-sm sm:text-base font-semibold">Gross Pay</span>
                  <span className="text-base sm:text-lg font-bold text-primary">${currentPeriod.grossPay.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/20 rounded-lg p-3 sm:p-4">
              <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Additional Income
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Tips ({currentPeriod.appointmentsCompleted} appointments)
                  </span>
                  <span className="font-semibold text-primary">${currentPeriod.tips.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Average Tip per Appointment
                  </span>
                  <span className="font-semibold">${(currentPeriod.tips / currentPeriod.appointmentsCompleted).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-secondary/20 rounded-lg p-3 sm:p-4">
              <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Deductions
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Federal Tax</span>
                  <span className="font-semibold">${currentPeriod.deductions.federalTax.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">State Tax</span>
                  <span className="font-semibold">${currentPeriod.deductions.stateTax.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Social Security</span>
                  <span className="font-semibold">${currentPeriod.deductions.socialSecurity.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Medicare</span>
                  <span className="font-semibold">${currentPeriod.deductions.medicare.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Health Insurance</span>
                  <span className="font-semibold">${currentPeriod.deductions.healthInsurance.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">401(k) Contribution</span>
                  <span className="font-semibold">${currentPeriod.deductions.retirement.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-sm sm:text-base font-semibold">Total Deductions</span>
                  <span className="text-base sm:text-lg font-bold">${totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 sm:p-6">
              <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-2">
                Net Pay (Take Home)
              </div>
              <div className="text-2xl sm:text-4xl font-bold text-primary">
                ${currentPeriod.netPay.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-2">
                {((currentPeriod.netPay / currentPeriod.grossPay) * 100).toFixed(1)}% of gross pay
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6 bg-card border-border">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Payment History</h3>
        <div className="space-y-3">
          {mockPayPeriods.map((period, index) => (
            <div 
              key={index}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold">{period.period}</span>
                  <Badge 
                    variant="outline"
                    className={
                      period.status === "Paid" 
                        ? "bg-primary text-primary-foreground text-xs" 
                        : period.status === "Approved"
                        ? "bg-accent/20 text-accent border-accent text-xs"
                        : "text-xs"
                    }
                  >
                    {period.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span>{period.regularHours + period.overtimeHours} hours</span>
                  <span>{period.appointmentsCompleted} appointments</span>
                  {period.tips > 0 && <span className="text-primary">${period.tips} tips</span>}
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-8">
                <div className={`${isMobile ? 'flex-1' : ''}`}>
                  <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Gross Pay
                  </div>
                  <div className="font-semibold">${period.grossPay.toLocaleString()}</div>
                </div>
                <div className={`${isMobile ? 'flex-1' : ''}`}>
                  <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Net Pay
                  </div>
                  <div className="text-base sm:text-lg font-bold text-primary">${period.netPay.toLocaleString()}</div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
