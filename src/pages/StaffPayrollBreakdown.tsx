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
      tipAmount: 45,
      tipPaymentMethod: "Card",
      tipPaidInPayroll: true,
      paymentMethod: "Credit Card",
      staffEarnings: 42.50,
      commissionRate: 50,
      status: "Completed"
    },
    {
      id: "APT-2025-002",
      date: "Jan 28, 2025",
      time: "11:30 AM",
      clientName: "Sarah Johnson",
      petName: "Bella",
      petBreed: "Poodle Mix",
      service: "Bath & Brush",
      serviceDuration: "1h",
      basePrice: 55,
      discountApplied: false,
      discountAmount: 0,
      discountReason: "",
      discountNotes: "",
      finalPrice: 55,
      tipAmount: 20,
      tipPaymentMethod: "Cash",
      tipPaidInPayroll: false,
      paymentMethod: "Cash",
      staffEarnings: 27.50,
      commissionRate: 50,
      status: "Completed"
    },
    {
      id: "APT-2025-003",
      date: "Jan 27, 2025",
      time: "2:00 PM",
      clientName: "Michael Chen",
      petName: "Charlie",
      petBreed: "Labrador",
      service: "De-shedding Treatment",
      serviceDuration: "1.5h",
      basePrice: 75,
      discountApplied: true,
      discountAmount: 15,
      discountReason: "Loyalty program - 10th visit",
      discountNotes: "Customer reached 10 visits milestone. 20% discount applied as per loyalty rewards program.",
      finalPrice: 60,
      tipAmount: 25,
      tipPaymentMethod: "Card",
      tipPaidInPayroll: true,
      paymentMethod: "Credit Card",
      staffEarnings: 30.00,
      commissionRate: 50,
      status: "Completed"
    },
    {
      id: "APT-2025-004",
      date: "Jan 27, 2025",
      time: "10:00 AM",
      clientName: "Emily Rodriguez",
      petName: "Max",
      petBreed: "German Shepherd",
      service: "Full Groom Package",
      serviceDuration: "2.5h",
      basePrice: 110,
      discountApplied: true,
      discountAmount: 30,
      discountReason: "Service recovery - previous appointment issue",
      discountNotes: "Customer experienced scheduling conflict last visit. Manager approved 30% discount as goodwill gesture. Ref: Case #SR-2025-012",
      finalPrice: 80,
      tipAmount: 35,
      tipPaymentMethod: "Card",
      tipPaidInPayroll: true,
      paymentMethod: "Debit Card",
      staffEarnings: 40.00,
      commissionRate: 50,
      status: "Completed"
    },
    {
      id: "APT-2025-005",
      date: "Jan 26, 2025",
      time: "3:30 PM",
      clientName: "David Thompson",
      petName: "Luna",
      petBreed: "Shih Tzu",
      service: "Puppy First Groom",
      serviceDuration: "1h",
      basePrice: 45,
      discountApplied: false,
      discountAmount: 0,
      discountReason: "",
      discountNotes: "",
      finalPrice: 45,
      tipAmount: 15,
      tipPaymentMethod: "Cash",
      tipPaidInPayroll: false,
      paymentMethod: "Credit Card",
      staffEarnings: 22.50,
      commissionRate: 50,
      status: "Completed"
    },
    {
      id: "APT-2025-006",
      date: "Jan 26, 2025",
      time: "1:00 PM",
      clientName: "Amanda White",
      petName: "Rocky",
      petBreed: "Beagle",
      service: "Nail Trim & Ear Cleaning",
      serviceDuration: "30m",
      basePrice: 30,
      discountApplied: true,
      discountAmount: 5,
      discountReason: "Bundle discount - booked with bath service",
      discountNotes: "Customer also booked bath service for next week. Applied 15% discount for bundled services.",
      finalPrice: 25,
      tipAmount: 10,
      tipPaymentMethod: "Card",
      tipPaidInPayroll: true,
      paymentMethod: "Cash",
      staffEarnings: 12.50,
      commissionRate: 50,
      status: "Completed"
    },
    {
      id: "APT-2025-007",
      date: "Jan 25, 2025",
      time: "4:00 PM",
      clientName: "Jessica Martinez",
      petName: "Buddy",
      petBreed: "Mixed Breed",
      service: "Bath & Brush",
      serviceDuration: "1h",
      basePrice: 50,
      discountApplied: false,
      discountAmount: 0,
      discountReason: "",
      discountNotes: "",
      finalPrice: 50,
      tipAmount: 18,
      tipPaymentMethod: "Card",
      tipPaidInPayroll: true,
      paymentMethod: "Credit Card",
      staffEarnings: 25.00,
      commissionRate: 50,
      status: "Completed"
    },
    {
      id: "APT-2025-008",
      date: "Jan 25, 2025",
      time: "10:30 AM",
      clientName: "Robert Williams",
      petName: "Daisy",
      petBreed: "Yorkshire Terrier",
      service: "Show Cut Styling",
      serviceDuration: "2h",
      basePrice: 120,
      discountApplied: true,
      discountAmount: 20,
      discountReason: "Referral program discount",
      discountNotes: "Customer referred by existing client Jennifer Park. Both customers received $20 credit. Referral ID: REF-2025-045",
      finalPrice: 100,
      tipAmount: 40,
      tipPaymentMethod: "Cash",
      tipPaidInPayroll: false,
      paymentMethod: "Credit Card",
      staffEarnings: 50.00,
      commissionRate: 50,
      status: "Completed"
    },
    {
      id: "APT-2025-009",
      date: "Jan 24, 2025",
      time: "2:30 PM",
      clientName: "Patricia Lee",
      petName: "Oliver",
      petBreed: "Cavalier King Charles",
      service: "Full Groom Package",
      serviceDuration: "1.5h",
      basePrice: 85,
      discountApplied: false,
      discountAmount: 0,
      discountReason: "",
      discountNotes: "",
      finalPrice: 85,
      tipAmount: 30,
      tipPaymentMethod: "Card",
      tipPaidInPayroll: true,
      paymentMethod: "Debit Card",
      staffEarnings: 42.50,
      commissionRate: 50,
      status: "Completed"
    },
    {
      id: "APT-2025-010",
      date: "Jan 24, 2025",
      time: "9:30 AM",
      clientName: "Christopher Davis",
      petName: "Zeus",
      petBreed: "Rottweiler",
      service: "Bath & De-shed",
      serviceDuration: "2h",
      basePrice: 90,
      discountApplied: true,
      discountAmount: 18,
      discountReason: "Senior pet discount",
      discountNotes: "Zeus is 12 years old. Applied 20% senior pet discount (ages 10+) as per pricing policy.",
      finalPrice: 72,
      tipAmount: 28,
      tipPaymentMethod: "Card",
      tipPaidInPayroll: true,
      paymentMethod: "Credit Card",
      staffEarnings: 36.00,
      commissionRate: 50,
      status: "Completed"
    }
  ]
}

export function StaffPayrollBreakdown() {
  const { staffId } = useParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [selectedPeriod, setSelectedPeriod] = useState("current")

  const staffData: Record<string, any> = {
    "1": {
      name: "Sarah Johnson",
      role: "Senior Groomer",
      hourlyRate: 35,
      commissionRate: 50
    },
    "2": {
      name: "Mike Torres",
      role: "Groomer",
      hourlyRate: 28,
      commissionRate: 50
    }
  }

  const staff = staffData[staffId as string] || staffData["1"]
  const appointments = mockAppointments[staffId as string] || mockAppointments["1"]

  const totalEarnings = appointments.reduce((sum, apt) => sum + apt.staffEarnings, 0)
  const totalTips = appointments.reduce((sum, apt) => sum + apt.tipAmount, 0)
  const totalTipsInPayroll = appointments.reduce((sum, apt) => sum + (apt.tipPaidInPayroll ? apt.tipAmount : 0), 0)
  const totalTipsCash = appointments.reduce((sum, apt) => sum + (apt.tipPaidInPayroll ? 0 : apt.tipAmount), 0)
  const totalRevenue = appointments.reduce((sum, apt) => sum + apt.finalPrice, 0)
  const totalDiscounts = appointments.reduce((sum, apt) => sum + apt.discountAmount, 0)
  const appointmentsWithDiscount = appointments.filter(apt => apt.discountApplied).length

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-6">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
        <header className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="mt-0.5 sm:mt-1 hover:bg-secondary transition-all duration-200 shrink-0"
              onClick={() => navigate('/staff?tab=payroll')}
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
                <SelectItem value="current">Jan 16 - Jan 31, 2025</SelectItem>
                <SelectItem value="previous">Jan 1 - Jan 15, 2025</SelectItem>
                <SelectItem value="dec2">Dec 16 - Dec 31, 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-5'} gap-2 sm:gap-4`}>
          <Card className="p-3 sm:p-5 bg-card border-border">
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1 sm:mb-2">
              Total Appointments
            </div>
            <div className="text-xl sm:text-3xl font-bold text-primary">
              {appointments.length}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              All completed
            </div>
          </Card>

          <Card className="p-3 sm:p-5 bg-card border-border">
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1 sm:mb-2">
              Commission Earned
            </div>
            <div className="text-xl sm:text-3xl font-bold text-primary">
              ${totalEarnings.toFixed(2)}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              From services
            </div>
          </Card>

          <Card className="p-3 sm:p-5 bg-card border-border">
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1 sm:mb-2">
              Tips Received
            </div>
            <div className="text-xl sm:text-3xl font-bold">
              ${totalTips.toFixed(2)}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              ${(totalTips / appointments.length).toFixed(2)} avg
            </div>
          </Card>

          <Card className="p-3 sm:p-5 bg-card border-border">
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1 sm:mb-2">
              Total Revenue
            </div>
            <div className="text-xl sm:text-3xl font-bold">
              ${totalRevenue.toFixed(2)}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              From services
            </div>
          </Card>

          <Card className={`p-3 sm:p-5 bg-card border-border ${isMobile ? 'col-span-2' : ''}`}>
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1 sm:mb-2">
              Discounts Applied
            </div>
            <div className="text-xl sm:text-3xl font-bold">
              ${totalDiscounts.toFixed(2)}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              {appointmentsWithDiscount} appointments
            </div>
          </Card>
        </div>

        <Card className="p-4 sm:p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold">Appointment Details</h2>
            <Badge variant="secondary" className="text-xs">
              {appointments.length} Total
            </Badge>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <Card
                key={apt.id}
                className="p-3 sm:p-4 bg-secondary/20 border-border hover:border-primary/50 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-sm sm:text-base">{apt.clientName}</h3>
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <PawPrint size={12} weight="fill" className="text-primary" />
                          {apt.petName} - {apt.petBreed}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {apt.id}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                        <span>{apt.date} at {apt.time}</span>
                        <span>•</span>
                        <span>{apt.serviceDuration}</span>
                      </div>
                      <div className="text-sm font-medium mb-2">
                        <Receipt size={16} className="inline mr-2" />
                        {apt.service}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Staff Earnings
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-primary">
                        ${(apt.staffEarnings + (apt.tipPaidInPayroll ? apt.tipAmount : 0)).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {apt.commissionRate}% commission{apt.tipPaidInPayroll ? ' + tips' : ''}
                      </div>
                    </div>
                  </div>

                  <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2 sm:gap-3`}>
                    <div className="bg-background rounded-md p-2 sm:p-3">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                        Base Price
                      </div>
                      <div className="text-sm font-semibold">
                        ${apt.basePrice.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-background rounded-md p-2 sm:p-3">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                        Final Price
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        ${apt.finalPrice.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-background rounded-md p-2 sm:p-3">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                        Tip Amount
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="text-sm font-semibold">
                          ${apt.tipAmount.toFixed(2)}
                        </div>
                        {apt.tipPaymentMethod === "Cash" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                  <Info size={14} weight="fill" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[250px]">
                                <p className="text-xs">This cash tip was paid directly to the groomer at time of service and is not included in payroll.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {apt.tipPaymentMethod === "Cash" && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            Cash
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="bg-background rounded-md p-2 sm:p-3">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                        Payment
                      </div>
                      <div className="text-sm font-semibold">
                        {apt.paymentMethod}
                      </div>
                    </div>
                  </div>

                  {apt.discountApplied && (
                    <div className="mt-3 border-t border-border pt-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-sm">Discount Applied</span>
                            <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                              -${apt.discountAmount.toFixed(2)}
                            </Badge>
                          </div>
                          <div className="text-xs sm:text-sm font-medium text-primary mb-1">
                            {apt.discountReason}
                          </div>
                        </div>
                      </div>
                      {apt.discountNotes && (
                        <div className="flex items-start gap-2 ml-6 mt-2">
                          <WarningCircle size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-xs sm:text-sm text-muted-foreground italic">
                            {apt.discountNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-primary/10 border-2 border-primary">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-2">
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
