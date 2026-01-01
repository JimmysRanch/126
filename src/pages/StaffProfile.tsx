import { ArrowLeft, PencilSimple, Plus, Calendar } from "@phosphor-icons/react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { StatWidget } from "@/components/StatWidget"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export function StaffProfile() {
  const navigate = useNavigate()
  const { staffId } = useParams()

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
  const [activeTab, setActiveTab] = useState("appointments")

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="mt-1 hover:bg-secondary transition-all duration-200"
              onClick={() => navigate('/staff')}
            >
              <ArrowLeft size={24} />
            </Button>
            <div>
              <h1 className="text-[32px] font-bold tracking-tight leading-none">
                {staff.name}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
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
          <div className="flex items-center gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 hover:scale-[1.02]">
              <Calendar size={18} className="mr-2" />
              View Schedule
            </Button>
            <Button
              variant="secondary"
              className="font-semibold transition-all duration-200 hover:scale-[1.02]"
            >
              Contact
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-secondary transition-all duration-200"
            >
              <PencilSimple size={20} />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

        <Card className="p-5 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Staff Information
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</div>
              <div className="font-medium">{staff.email}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Phone</div>
              <div className="font-medium">{staff.phone}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Specialties</div>
              <div className="flex items-center gap-2 flex-wrap">
                {staff.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-secondary/50">
            <TabsTrigger 
              value="appointments" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Upcoming Appointments
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Appointment History
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="mt-4">
            <div className="space-y-3">
              {staff.upcomingAppointments.length > 0 ? (
                staff.upcomingAppointments.map((apt) => (
                  <Card key={apt.id} className="p-4 bg-card border-border">
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
                  </Card>
                ))
              ) : (
                <Card className="p-12 bg-card border-border text-center">
                  <p className="text-muted-foreground">
                    No upcoming appointments scheduled.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-3">
              {staff.recentAppointments.length > 0 ? (
                staff.recentAppointments.map((apt) => (
                  <Card key={apt.id} className="p-4 bg-card border-border">
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
                  </Card>
                ))
              ) : (
                <Card className="p-12 bg-card border-border text-center">
                  <p className="text-muted-foreground">
                    No appointment history available.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-4">
            <Card className="p-12 bg-card border-border text-center">
              <p className="text-muted-foreground">
                Detailed performance analytics and charts will appear here.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
