import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockStaff = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Groomer",
    email: "sarah.j@pawhub.com",
    phone: "(555) 123-4567",
    status: "Active",
    specialties: ["Large Breeds", "Show Cuts", "Hand Stripping"],
    hourlyRate: "$35/hr",
    totalAppointments: 324,
    rating: 4.9,
    hireDate: "Mar 15, 2022"
  },
  {
    id: "2",
    name: "Mike Torres",
    role: "Groomer",
    email: "mike.t@pawhub.com",
    phone: "(555) 234-5678",
    status: "Active",
    specialties: ["Anxious Dogs", "Creative Styling", "Nail Care"],
    hourlyRate: "$28/hr",
    totalAppointments: 256,
    rating: 4.8,
    hireDate: "Aug 20, 2022"
  },
  {
    id: "3",
    name: "Emma Roberts",
    role: "Spa Specialist",
    email: "emma.r@pawhub.com",
    phone: "(555) 345-6789",
    status: "Active",
    specialties: ["Spa Treatments", "Small Breeds", "Facials"],
    hourlyRate: "$32/hr",
    totalAppointments: 198,
    rating: 5.0,
    hireDate: "Jan 10, 2023"
  },
  {
    id: "4",
    name: "Carlos Martinez",
    role: "Bather",
    email: "carlos.m@pawhub.com",
    phone: "(555) 456-7890",
    status: "Active",
    specialties: ["De-shedding", "Quick Service", "Puppy Care"],
    hourlyRate: "$22/hr",
    totalAppointments: 412,
    rating: 4.7,
    hireDate: "May 5, 2023"
  },
  {
    id: "5",
    name: "Lisa Chen",
    role: "Groomer",
    email: "lisa.c@pawhub.com",
    phone: "(555) 567-8901",
    status: "On Leave",
    specialties: ["Poodle Cuts", "Color & Styling", "Competition Prep"],
    hourlyRate: "$30/hr",
    totalAppointments: 187,
    rating: 4.9,
    hireDate: "Nov 12, 2023"
  }
]

export function Staff() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("list")

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1600px] mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col items-center gap-4 mb-6">
            <TabsList className="bg-secondary/50">
              <TabsTrigger 
                value="list" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Staff List
              </TabsTrigger>
              <TabsTrigger 
                value="schedule" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Schedule
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Performance
              </TabsTrigger>
            </TabsList>

            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 hover:scale-[1.02]"
            >
              <Plus size={18} className="mr-2" />
              Add New Staff
            </Button>
          </div>

          <TabsContent value="list" className="mt-0">
            <div className="grid grid-cols-1 gap-3">
              {mockStaff.map((staff) => (
                <Card
                  key={staff.id}
                  className="p-5 bg-card border-border hover:border-primary/50 transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/staff/${staff.id}`)}
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold">{staff.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {staff.role}
                        </Badge>
                        <Badge 
                          variant={staff.status === "Active" ? "default" : "secondary"}
                          className={staff.status === "Active" ? "bg-primary text-primary-foreground" : ""}
                        >
                          {staff.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-2">
                        <span>{staff.email}</span>
                        <span>{staff.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {staff.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Rate
                        </div>
                        <div className="font-semibold">{staff.hourlyRate}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Appointments
                        </div>
                        <div className="font-semibold">{staff.totalAppointments}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Hired
                        </div>
                        <div className="font-semibold">{staff.hireDate}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>


          </TabsContent>

          <TabsContent value="schedule" className="mt-0">
            <Card className="p-12 bg-card border-border text-center">
              <p className="text-muted-foreground">
                Staff scheduling calendar will appear here.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-0">
            <Card className="p-12 bg-card border-border text-center">
              <p className="text-muted-foreground">
                Staff performance metrics and analytics will appear here.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
