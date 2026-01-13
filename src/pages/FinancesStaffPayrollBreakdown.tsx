import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Receipt, Tag, WarningCircle, PawPrint, CreditCard, Money, Info } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

const mockAppointments: Record<string, AppointmentDetail[]> = {
  "1": [
    {
      id: "APT-2025-001",
      date: "Jan 28, 2025",
      time: "9:00 AM",
      clientName: "George Moodys",
      petName: "Trying",
      petBreed: "Golden Retriever",
      service: "Full Groom Package",
      serviceDuration: "2h",
      basePrice: 95,
      discountApplied: true,
      discountAmount: 10,
      discountReason: "First-time client discount",
      discountNotes: "Promotional offer for new customers during January. Applied automatically at booking.",
      finalPrice: 85,
      tipAmount: 20,
      tipPaymentMethod: "Card",
      tipPaidInPayroll: true,
      paymentMethod: "Credit Card",
      staffEarnings: 42.50,
      commissionRate: 50,
      status: "Completed"
    },
  ],
  "2": [],
  "3": [],
  "4": [],
  "5": []
}

const staffData: Record<string, { name: string; role: string; hourlyRate: number; commissionRate: number }> = {
  "1": { name: "Sarah Johnson", role: "Senior Groomer", hourlyRate: 35, commissionRate: 50 },
  "2": { name: "Mike Torres", role: "Groomer", hourlyRate: 28, commissionRate: 40 },
  "3": { name: "Emma Roberts", role: "Spa Specialist", hourlyRate: 32, commissionRate: 45 },
  "4": { name: "Carlos Martinez", role: "Bather", hourlyRate: 22, commissionRate: 30 },
  "5": { name: "Lisa Chen", role: "Groomer", hourlyRate: 30, commissionRate: 40 }
}

export function FinancesStaffPayrollBreakdown() {
  const { staffId } = useParams<{ staffId: string }>()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [selectedPeriod, setSelectedPeriod] = useState("current")

  const staff = staffData[staffId || "1"]
  const appointments = mockAppointments[staffId || "1"] || []

  const totalRegularHours = 80
  const totalOvertimeHours = staffId === "1" ? 4 : staffId === "4" ? 6 : staffId === "2" ? 2 : 0
  const totalHours = totalRegularHours + totalOvertimeHours

  const regularPay = totalRegularHours * staff.hourlyRate
  const overtimePay = totalOvertimeHours * staff.hourlyRate * 1.5
  const commissionEarnings = appointments.reduce((sum, apt) => sum + apt.staffEarnings, 0)
  const tipEarnings = appointments.reduce((sum, apt) => apt.tipPaidInPayroll ? sum + apt.tipAmount : sum, 0)
  
  const grossPay = regularPay + overtimePay + commissionEarnings + tipEarnings
  const taxWithholding = grossPay * 0.20
  const netPay = grossPay - taxWithholding

  const totalAppointments = appointments.filter(apt => apt.status === "Completed").length
  const totalServiceRevenue = appointments.reduce((sum, apt) => apt.status === "Completed" ? sum + apt.finalPrice : sum, 0)

  return (
    <div className="min-h-screen bg-background text-foreground p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 md:mb-6">
          <Button 
            variant="ghost" 
            className="gap-2 -ml-2 mb-3 md:mb-4"
            onClick={() => navigate('/finances?tab=payroll')}
          >
            <ArrowLeft size={18} />
            Back to Payroll
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{staff.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{staff.role}</Badge>
                <Badge variant="outline">${staff.hourlyRate}/hr</Badge>
                <Badge variant="outline">{staff.commissionRate}% commission</Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Jan 16 - Jan 31, 2025</SelectItem>
                  <SelectItem value="previous">Jan 1 - Jan 15, 2025</SelectItem>
                  <SelectItem value="dec2">Dec 16 - Dec 31, 2024</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gap-2 bg-primary text-primary-foreground">
                <Download size={18} />
                {!isMobile && "Export"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <Card className="p-3 border-border">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
              Total Hours
            </div>
            <div className="text-xl md:text-2xl font-bold">{totalHours}h</div>
            {totalOvertimeHours > 0 && (
              <div className="text-xs text-primary mt-1">+{totalOvertimeHours}h OT</div>
            )}
          </Card>

          <Card className="p-3 border-border">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
              Appointments
            </div>
            <div className="text-xl md:text-2xl font-bold">{totalAppointments}</div>
            <div className="text-xs text-muted-foreground mt-1">Completed</div>
          </Card>

          <Card className="p-3 border-border">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
              Service Revenue
            </div>
            <div className="text-xl md:text-2xl font-bold">${totalServiceRevenue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">Total sales</div>
          </Card>

          <Card className="p-3 border-border">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
              Gross Pay
            </div>
            <div className="text-xl md:text-2xl font-bold">${grossPay.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">Before tax</div>
          </Card>

          <Card className="p-3 border-border bg-primary/10">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
              Net Pay
            </div>
            <div className="text-xl md:text-2xl font-bold text-primary">${netPay.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">After deductions</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2 border-border">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold">Earnings Breakdown</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div>
                  <div className="font-semibold mb-1">Regular Hours</div>
                  <div className="text-sm text-muted-foreground">{totalRegularHours}h @ ${staff.hourlyRate}/hr</div>
                </div>
                <div className="text-xl font-bold">${regularPay.toLocaleString()}</div>
              </div>

              {totalOvertimeHours > 0 && (
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <div className="font-semibold mb-1">Overtime Hours</div>
                    <div className="text-sm text-muted-foreground">{totalOvertimeHours}h @ ${(staff.hourlyRate * 1.5).toFixed(2)}/hr</div>
                  </div>
                  <div className="text-xl font-bold text-primary">${overtimePay.toLocaleString()}</div>
                </div>
              )}

              {commissionEarnings > 0 && (
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <div className="font-semibold mb-1">Commission</div>
                    <div className="text-sm text-muted-foreground">{staff.commissionRate}% on ${totalServiceRevenue.toLocaleString()}</div>
                  </div>
                  <div className="text-xl font-bold">${commissionEarnings.toLocaleString()}</div>
                </div>
              )}

              {tipEarnings > 0 && (
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <div className="font-semibold mb-1">Tips (Paid in Payroll)</div>
                    <div className="text-sm text-muted-foreground">From {totalAppointments} appointments</div>
                  </div>
                  <div className="text-xl font-bold">${tipEarnings.toLocaleString()}</div>
                </div>
              )}
            </div>
          </Card>

          <Card className="border-border">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold">Deductions</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div>
                  <div className="font-semibold mb-1">Tax Withholding</div>
                  <div className="text-sm text-muted-foreground">20% of gross</div>
                </div>
                <div className="text-xl font-bold">-${taxWithholding.toLocaleString()}</div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gross Pay</span>
                  <span className="font-semibold">${grossPay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Total Deductions</span>
                  <span className="font-semibold">-${taxWithholding.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                  <span className="font-bold">Net Pay</span>
                  <span className="text-2xl font-bold text-primary">${netPay.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Appointment Details</h2>
              <p className="text-sm text-muted-foreground">{totalAppointments} completed appointments this period</p>
            </div>
          </div>
          <div className="divide-y divide-border">
            {appointments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No appointments recorded for this period
              </div>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} className="p-4 hover:bg-muted/50 transition-colors">
                  {isMobile ? (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{apt.clientName}</h3>
                            <Badge variant={apt.status === "Completed" ? "default" : "secondary"} className="text-xs">
                              {apt.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <PawPrint size={14} />
                            <span>{apt.petName} ({apt.petBreed})</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {apt.date} at {apt.time}
                          </div>
                        </div>
                      </div>

                      <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Service:</span>
                          <span className="font-medium">{apt.service}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Base Price:</span>
                          <span className="font-medium">${apt.basePrice}</span>
                        </div>
                        {apt.discountApplied && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Discount:</span>
                            <span className="font-medium text-destructive">-${apt.discountAmount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm pt-2 border-t border-border">
                          <span className="text-muted-foreground">Final Price:</span>
                          <span className="font-bold">${apt.finalPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Your Earnings:</span>
                          <span className="font-bold text-primary">${apt.staffEarnings}</span>
                        </div>
                        {apt.tipAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tip:</span>
                            <span className="font-medium text-primary">+${apt.tipAmount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-3">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{apt.clientName}</h3>
                          <Badge variant={apt.status === "Completed" ? "default" : "secondary"} className="text-xs">
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <PawPrint size={14} />
                          <span>{apt.petName} ({apt.petBreed})</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {apt.date} at {apt.time}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <div className="text-sm font-medium mb-1">{apt.service}</div>
                        <div className="text-xs text-muted-foreground">{apt.serviceDuration} duration</div>
                        <div className="text-xs text-muted-foreground mt-1">{apt.paymentMethod}</div>
                      </div>

                      <div className="col-span-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Base:</span>
                            <span className="font-medium">${apt.basePrice}</span>
                          </div>
                          {apt.discountApplied && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex justify-between text-sm cursor-help">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                      <Tag size={12} />
                                      Discount:
                                    </span>
                                    <span className="font-medium text-destructive">-${apt.discountAmount}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <div className="space-y-1">
                                    <div className="font-semibold text-xs">{apt.discountReason}</div>
                                    <div className="text-xs text-muted-foreground">{apt.discountNotes}</div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <div className="flex justify-between text-sm pt-1 border-t border-border">
                            <span className="text-muted-foreground">Final:</span>
                            <span className="font-bold">${apt.finalPrice}</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Commission:</span>
                            <span className="font-semibold text-primary">${apt.staffEarnings}</span>
                          </div>
                          <div className="text-xs text-muted-foreground text-right">
                            {apt.commissionRate}% of ${apt.finalPrice}
                          </div>
                          {apt.tipAmount > 0 && (
                            <div className="flex justify-between text-sm pt-1 border-t border-border">
                              <span className="text-muted-foreground flex items-center gap-1">
                                {apt.tipPaymentMethod === "Cash" ? <Money size={12} /> : <CreditCard size={12} />}
                                Tip:
                              </span>
                              <span className="font-semibold text-primary">+${apt.tipAmount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
