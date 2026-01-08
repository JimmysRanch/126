import { ArrowLeft, PencilSimple, Phone, Envelope } from "@phosphor-icons/react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { StatWidget } from "@/components/StatWidget"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { StaffScheduleView } from "@/components/StaffScheduleView"
import { StaffPayrollDetail } from "@/components/StaffPayrollDetail"
import { useKV } from "@github/spark/hooks"
import { useIsMobile } from "@/hooks/use-mobile"

export function StaffProfile() {
  const navigate = useNavigate()
  const { staffId } = useParams()
  const [staffPositions] = useKV<string[]>("staff-positions", ["Owner", "Groomer", "Front Desk", "Bather"])

  const staffData = {
    "1": {
      name: "Sarah Johnson",
      role: "Senior Groomer",
      email: "sarah.j@pawhub.com",
      phone: "(555) 123-4567",
      hireDate: "Mar 15, 2022",
      status: "Active",
      hourlyRate: "$35/hr",
      specialties: ["Large Breeds", "Show Cuts", "Hand Stripping"],
      stats: {
        totalAppointments: 324,
        completionRate: "98%",
        avgRating: 4.9,
        revenue: "$45,280",
        avgTip: "$28",
        noShows: 3,
        cancellations: 8,
        lateArrivals: 2
      },
      upcomingAppointments: [
        {
          id: "1",
          client: "George moodys",
          pet: "Trying",
          service: "Full Groom Package",
          date: "Jan 28, 2025",
          time: "9:00 AM",
          duration: "2h",
          status: "Confirmed"
        },
        {
          id: "2",
          client: "Sarah Johnson",
          pet: "Bella",
          service: "Bath & Brush",
          date: "Jan 28, 2025",
          time: "11:30 AM",
          duration: "1h",
          status: "Confirmed"
        },
        {
          id: "3",
          client: "Michael Chen",
          pet: "Charlie",
          service: "Nail Trim",
          date: "Jan 28, 2025",
          time: "2:00 PM",
          duration: "30m",
          status: "Pending"
        }
      ],
      recentAppointments: [
        {
          id: "1",
          client: "George moodys",
          pet: "Trying",
          service: "Full Groom Package",
          date: "Jan 15, 2025",
          time: "9:00 AM",
          cost: "$85",
          tip: "$45",
          rating: 5,
          notes: "Client very happy with the cut!"
        },
        {
          id: "2",
          client: "Emily Rodriguez",
          pet: "Rocky",
          service: "Bath & Brush",
          date: "Jan 14, 2025",
          time: "1:30 PM",
          cost: "$55",
          tip: "$20",
          rating: 5,
          notes: "Rocky was well-behaved today."
        },
        {
          id: "3",
          client: "David Thompson",
          pet: "Coco",
          service: "Luxury Spa Package",
          date: "Jan 12, 2025",
          time: "10:00 AM",
          cost: "$120",
          tip: "$35",
          rating: 5,
          notes: "Perfect spa day!"
        }
      ]
    },
    "2": {
      name: "Mike Torres",
      role: "Groomer",
      email: "mike.t@pawhub.com",
      phone: "(555) 234-5678",
      hireDate: "Aug 20, 2022",
      status: "Active",
      hourlyRate: "$28/hr",
      specialties: ["Anxious Dogs", "Creative Styling", "Nail Care"],
      stats: {
        totalAppointments: 256,
        completionRate: "96%",
        avgRating: 4.8,
        revenue: "$38,620",
        avgTip: "$22",
        noShows: 5,
        cancellations: 12,
        lateArrivals: 4
      },
      upcomingAppointments: [],
      recentAppointments: []
    }
  }

  const staff = staffData[staffId as keyof typeof staffData] || staffData["1"]
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-6">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
        <header className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="mt-0.5 sm:mt-1 hover:bg-secondary transition-all duration-200 shrink-0"
              onClick={() => navigate('/staff')}
            >
              <ArrowLeft size={isMobile ? 20 : 24} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className={`${isMobile ? 'text-xl' : 'text-[32px]'} font-bold tracking-tight leading-none`}>
                {staff.name}
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                  {staff.role} • SINCE {staff.hireDate.toUpperCase()}
                </p>
                <Badge 
                  variant={staff.status === "Active" ? "default" : "secondary"}
                  className={staff.status === "Active" ? "bg-primary text-primary-foreground text-xs" : "text-xs"}
                >
                  {staff.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className={`font-semibold transition-colors duration-200 ${isMobile ? 'flex-1' : ''}`}
                >
                  Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Contact {staff.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                    <Phone size={20} className="text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Phone</div>
                      <div className="font-medium">{staff.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                    <Envelope size={20} className="text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Email</div>
                      <div className="font-medium">{staff.email}</div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-secondary transition-colors duration-200 shrink-0"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <PencilSimple size={isMobile ? 18 : 20} />
            </Button>
          </div>
        </header>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-card border-border max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Staff Member Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <Card className="p-6 bg-secondary/20 border-border">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={staff.name.split(' ')[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={staff.name.split(' ')[1]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Select defaultValue={staff.role}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(staffPositions || []).map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue={staff.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={staff.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue={staff.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street Address</Label>
                    <Input id="streetAddress" placeholder="123 Market Street" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Austin" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select defaultValue="Texas">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Texas">Texas</SelectItem>
                        <SelectItem value="California">California</SelectItem>
                        <SelectItem value="New York">New York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" placeholder="73301" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hiredDate">Hired Date</Label>
                    <Input id="hiredDate" type="date" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Add context about certifications, specialties, or scheduling preferences."
                      rows={3}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-secondary/20 border-border">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyFirstName">First Name</Label>
                    <Input id="emergencyFirstName" placeholder="Jane" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyLastName">Last Name</Label>
                    <Input id="emergencyLastName" placeholder="Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Phone Number</Label>
                    <Input id="emergencyPhone" placeholder="(512) 555-0100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelation">Relation</Label>
                    <Input id="emergencyRelation" placeholder="Spouse, Parent, Sibling, etc." />
                  </div>
                </div>
              </Card>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-4 sm:mb-6">
            <TabsList className={`bg-secondary/50 ${isMobile ? 'grid grid-cols-2 w-full gap-1' : ''}`}>
              <TabsTrigger 
                value="overview" 
                className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${isMobile ? 'text-xs' : ''}`}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="payroll" 
                className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${isMobile ? 'text-xs' : ''}`}
              >
                Payroll
              </TabsTrigger>
              <TabsTrigger 
                value="schedule" 
                className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${isMobile ? 'text-xs' : ''}`}
              >
                Schedule
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${isMobile ? 'text-xs' : ''}`}
              >
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4">
              <StatWidget
                stats={[
                  { label: "TOTAL APPTS", value: staff.stats.totalAppointments.toString() },
                  { label: "COMPLETION RATE", value: staff.stats.completionRate }
                ]}
                onClick={() => console.log('Total Appointments clicked')}
              />

              <StatWidget
                stats={[
                  { label: "REVENUE", value: staff.stats.revenue },
                  { label: "AVG TIP", value: staff.stats.avgTip }
                ]}
                onClick={() => console.log('Revenue clicked')}
              />

              <StatWidget
                stats={[
                  { label: "AVG RATING", value: staff.stats.avgRating.toString() },
                  { label: "HOURLY RATE", value: staff.hourlyRate }
                ]}
                onClick={() => console.log('Rating clicked')}
              />

              <StatWidget
                stats={[
                  { label: "NO-SHOWS", value: staff.stats.noShows.toString() },
                  { label: "CANCELS", value: staff.stats.cancellations.toString() }
                ]}
                onClick={() => console.log('No-shows clicked')}
              />

              <StatWidget
                stats={[
                  { label: "LATE", value: staff.stats.lateArrivals.toString() }
                ]}
                onClick={() => console.log('Late arrivals clicked')}
              />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4">
                  Upcoming Appointments
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {staff.upcomingAppointments.length > 0 ? (
                    staff.upcomingAppointments.map((apt) => (
                      <Card key={apt.id} className="p-3 sm:p-4 bg-card border-border">
                        {isMobile ? (
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-1.5">{apt.client}</h4>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <Badge variant="secondary" className="text-xs">
                                    {apt.pet}
                                  </Badge>
                                  <Badge 
                                    variant={apt.status === "Confirmed" ? "default" : "secondary"}
                                    className={apt.status === "Confirmed" ? "bg-primary text-primary-foreground text-xs" : "text-xs"}
                                  >
                                    {apt.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="font-semibold text-sm">{apt.date}</div>
                                <div className="text-xs text-muted-foreground">{apt.time}</div>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {apt.service} • {apt.duration}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{apt.client}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {apt.pet}
                                </Badge>
                                <Badge 
                                  variant={apt.status === "Confirmed" ? "default" : "secondary"}
                                  className={apt.status === "Confirmed" ? "bg-primary text-primary-foreground text-xs" : "text-xs"}
                                >
                                  {apt.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {apt.service}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{apt.date}</div>
                              <div className="text-sm text-muted-foreground">{apt.time} • {apt.duration}</div>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8 sm:p-12 bg-card border-border text-center">
                      <p className="text-sm sm:text-base text-muted-foreground">
                        No upcoming appointments scheduled.
                      </p>
                    </Card>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4">
                  Recent Appointments
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {staff.recentAppointments.length > 0 ? (
                    staff.recentAppointments.map((apt) => (
                      <Card key={apt.id} className="p-3 sm:p-4 bg-card border-border">
                        {isMobile ? (
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <h4 className="font-semibold text-sm">{apt.client}</h4>
                                  <div className="text-xs text-primary">
                                    {apt.rating} ⭐
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                                  <Badge variant="secondary" className="text-xs">
                                    {apt.pet}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground mb-1">
                                  {apt.service}
                                </div>
                                {apt.notes && (
                                  <div className="text-xs text-muted-foreground italic">
                                    "{apt.notes}"
                                  </div>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <div className="font-semibold text-sm">{apt.date}</div>
                                <div className="text-xs text-muted-foreground">{apt.time}</div>
                                <div className="text-xs font-semibold text-primary mt-1">
                                  {apt.cost} + {apt.tip}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{apt.client}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {apt.pet}
                                </Badge>
                                <div className="text-xs text-primary">
                                  {apt.rating} ⭐
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground mb-1">
                                {apt.service}
                              </div>
                              {apt.notes && (
                                <div className="text-xs text-muted-foreground italic">
                                  "{apt.notes}"
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{apt.date}</div>
                              <div className="text-sm text-muted-foreground">{apt.time}</div>
                              <div className="text-sm font-semibold text-primary mt-1">
                                {apt.cost} + {apt.tip} tip
                              </div>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8 sm:p-12 bg-card border-border text-center">
                      <p className="text-sm sm:text-base text-muted-foreground">
                        No appointment history available.
                      </p>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <Card className="p-8 sm:p-12 bg-card border-border text-center">
              <p className="text-sm sm:text-base text-muted-foreground">
                Complete activity history showing all actions performed by this staff member will appear here.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="payroll" className="mt-0">
            <StaffPayrollDetail 
              staffId={staffId}
              staffName={staff.name}
              hourlyRate={parseFloat(staff.hourlyRate.replace('$', '').replace('/hr', ''))}
            />
          </TabsContent>

          <TabsContent value="schedule" className="mt-0">
            <StaffScheduleView staffId={staffId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
