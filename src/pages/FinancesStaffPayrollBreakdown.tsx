import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, PawPrint, Tag, CreditCard, Money } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useKV } from "@github/spark/hooks"
import { Appointment, Transaction } from "@/lib/types"
import { parseDateStringAsLocal } from "@/lib/date-utils"

interface AppointmentDetail {
  id: string
  date: string
  time: string
  clientName: string
  petName: string
  petBreed: string
  service: string
  serviceDuration: string
  basePrice: number
  discountApplied: boolean
  discountAmount: number
  discountReason: string
  discountNotes: string
  finalPrice: number
  tipAmount: number
  tipPaymentMethod: "Cash" | "Card"
  tipPaidInPayroll: boolean
  paymentMethod: string
  staffEarnings: number
  commissionRate: number
  status: "Completed" | "Cancelled" | "No-Show"
}

const formatDateLabel = (dateString: string) => {
  const date = parseDateStringAsLocal(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const normalizeTipMethod = (method?: string, paymentMethod?: string): "Cash" | "Card" => {
  if (method === "cash") return "Cash"
  if (method === "card") return "Card"
  if (paymentMethod?.toLowerCase().includes("cash")) return "Cash"
  return "Card"
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

export function FinancesStaffPayrollBreakdown() {
  const { staffId } = useParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [appointments] = useKV<Appointment[]>("appointments", [])
  const [transactions] = useKV<Transaction[]>("transactions", [])

  const staffAppointments = (appointments || []).filter(
    (apt) => apt.groomerId === staffId && (apt.status === "completed" || apt.status === "paid")
  )
  const transactionsByAppointment = new Map(
    (transactions || [])
      .filter((transaction) => transaction.appointmentId)
      .map((transaction) => [transaction.appointmentId as string, transaction])
  )
  const appointmentDetails: AppointmentDetail[] = staffAppointments.map((apt) => {
    const transaction = transactionsByAppointment.get(apt.id)
    const tipAmount = transaction?.tipAmount ?? apt.tipAmount ?? 0
    const tipPaymentMethod = normalizeTipMethod(transaction?.tipPaymentMethod ?? apt.tipPaymentMethod, transaction?.paymentMethod)
    const discountAmount = transaction?.discount ?? 0
    const discountApplied = discountAmount > 0
    const finalPrice = transaction ? Math.max(0, transaction.total - tipAmount) : apt.totalPrice
    const commissionRate = 50
    const staffEarnings = finalPrice * (commissionRate / 100)

    return {
      id: apt.id,
      date: formatDateLabel(apt.date),
      time: apt.startTime,
      clientName: apt.clientName,
      petName: apt.petName,
      petBreed: "",
      service: apt.services?.map((service) => service.serviceName).join(", ") || "Service",
      serviceDuration: "—",
      basePrice: apt.totalPrice,
      discountApplied,
      discountAmount,
      discountReason: transaction?.discountDescription ?? "",
      discountNotes: "",
      finalPrice,
      tipAmount,
      tipPaymentMethod,
      tipPaidInPayroll: tipPaymentMethod === "Card",
      paymentMethod: transaction?.paymentMethod ?? "—",
      staffEarnings,
      commissionRate,
      status: apt.status === "completed" || apt.status === "paid" ? "Completed" : "Cancelled"
    }
  })
  const staff = {
    name: staffAppointments[0]?.groomerName ?? "Staff Member",
    role: "Groomer",
    hourlyRate: 0,
    commissionRate: 50
  }
  const payPeriodLabel = getPayPeriodLabel(staffAppointments)

  const totalEarnings = appointmentDetails.reduce((sum, apt) => sum + apt.staffEarnings, 0)
  const totalTips = appointmentDetails.reduce((sum, apt) => sum + apt.tipAmount, 0)
  const totalTipsInPayroll = appointmentDetails.reduce((sum, apt) => sum + (apt.tipPaidInPayroll ? apt.tipAmount : 0), 0)
  const totalTipsCash = appointmentDetails.reduce((sum, apt) => sum + (apt.tipPaidInPayroll ? 0 : apt.tipAmount), 0)
  const totalRevenue = appointmentDetails.reduce((sum, apt) => sum + apt.finalPrice, 0)
  const totalDiscounts = appointmentDetails.reduce((sum, apt) => sum + apt.discountAmount, 0)

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-6">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
        <header className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="mt-0.5 sm:mt-1 hover:bg-secondary transition-all duration-200 shrink-0"
              onClick={() => navigate('/finances?tab=payroll')}
            >
              <ArrowLeft size={isMobile ? 20 : 24} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className={`${isMobile ? 'text-xl' : 'text-[32px]'} font-bold tracking-tight leading-none`}>
                {staff.name} - Payroll Breakdown
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                  {staff.role} • {staff.commissionRate}% Commission Rate
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            className={`font-semibold transition-colors duration-200 ${isMobile ? 'w-full' : ''}`}
          >
            <Download size={18} className="mr-2" />
            Export Report
          </Button>
        </header>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Pay Period:</span>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">{payPeriodLabel}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-5'} gap-3`}>
          <Card className="p-2 md:p-2.5 border-border">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">APPOINTMENTS</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">{appointmentDetails.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-2 md:p-2.5 border-border">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">COMMISSION</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">${totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-2 md:p-2.5 border-border">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">TIPS RECEIVED</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">${totalTips.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-2 md:p-2.5 border-border">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">TOTAL REVENUE</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className={`p-2 md:p-2.5 border-border ${isMobile ? 'col-span-2' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">DISCOUNTS</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">${totalDiscounts.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4 sm:p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold">Appointment Details</h2>
            <Badge variant="secondary">{appointmentDetails.length} total</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Date/Time</th>
                  <th className="text-left p-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Client</th>
                  <th className="text-left p-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Pet</th>
                  <th className="text-left p-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Service</th>
                  <th className="text-right p-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Base</th>
                  <th className="text-right p-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Discount</th>
                  <th className="text-right p-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Final</th>
                  <th className="text-right p-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Tip</th>
                  <th className="text-right p-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Commission</th>
                  <th className="text-right p-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Total Earned</th>
                </tr>
              </thead>
              <tbody>
                {appointmentDetails.map((apt, index) => (
                  <tr 
                    key={apt.id}
                    className={`border-b border-border hover:bg-secondary/20 transition-colors ${index % 2 === 0 ? 'bg-secondary/5' : ''}`}
                  >
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-xs font-medium">{apt.date}</div>
                      <div className="text-xs text-muted-foreground">{apt.time}</div>
                    </td>
                    <td className="p-2">
                      <div className="text-xs font-medium">{apt.clientName}</div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <PawPrint size={12} weight="fill" className="text-primary shrink-0" />
                        <div>
                          <div className="text-xs font-medium">{apt.petName}</div>
                          <div className="text-[10px] text-muted-foreground">{apt.petBreed}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-xs">{apt.service}</div>
                      {apt.discountApplied && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                type="button"
                                className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-0.5"
                              >
                                <Tag size={10} weight="fill" />
                                {apt.discountReason}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px]">
                              <p className="text-xs font-semibold mb-1">{apt.discountReason}</p>
                              {apt.discountNotes && (
                                <p className="text-xs text-muted-foreground">{apt.discountNotes}</p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </td>
                    <td className="p-2 text-right">
                      <div className="text-xs font-medium">${apt.basePrice.toFixed(2)}</div>
                    </td>
                    <td className="p-2 text-right">
                      {apt.discountApplied ? (
                        <div className="text-xs font-medium text-primary">-${apt.discountAmount.toFixed(2)}</div>
                      ) : (
                        <div className="text-xs text-muted-foreground">—</div>
                      )}
                    </td>
                    <td className="p-2 text-right">
                      <div className="text-xs font-semibold">${apt.finalPrice.toFixed(2)}</div>
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className="text-xs font-medium">${apt.tipAmount.toFixed(2)}</div>
                        {apt.tipPaymentMethod === "Cash" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  type="button"
                                  className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Money size={12} weight="fill" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Cash tip - already paid</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {apt.tipPaymentMethod === "Card" && apt.tipPaidInPayroll && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  type="button"
                                  className="inline-flex items-center justify-center text-primary hover:text-primary/80 transition-colors"
                                >
                                  <CreditCard size={12} weight="fill" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Card tip - in payroll</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      <div className="text-xs font-medium">${apt.staffEarnings.toFixed(2)}</div>
                      <div className="text-[10px] text-muted-foreground">{apt.commissionRate}%</div>
                    </td>
                    <td className="p-2 text-right">
                      <div className="text-xs font-bold text-primary">
                        ${(apt.staffEarnings + (apt.tipPaidInPayroll ? apt.tipAmount : 0)).toFixed(2)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 sm:p-6 bg-primary/10 border-2 border-primary rounded-lg">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div className="text-sm font-medium text-foreground">
                Total Payroll Amount (Commission + Tips in Payroll)
              </div>
              <div className="text-2xl sm:text-4xl font-bold text-primary">
                ${(totalEarnings + totalTipsInPayroll).toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ${totalTipsCash.toFixed(2)} in cash tips already paid to groomer
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Commission
                </div>
                <div className="text-lg sm:text-xl font-bold">
                  ${totalEarnings.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Tips (Payroll)
                </div>
                <div className="text-lg sm:text-xl font-bold text-primary">
                  ${totalTipsInPayroll.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Tips (Cash Paid)
                </div>
                <div className="text-lg sm:text-xl font-bold">
                  ${totalTipsCash.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
