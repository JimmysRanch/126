import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StaffScheduleView } from "@/components/StaffScheduleView"
import { useIsMobile } from "@/hooks/use-mobile"

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
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState("list")
  const isMobile = useIsMobile()

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['list', 'schedule', 'performance'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-6">
      <div className="max-w-[1600px] mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            {!isMobile && <div className="flex-1"></div>}
            
            <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-2 sm:gap-3 ${isMobile ? 'order-2' : ''}`}>
              <Button
                onClick={() => setActiveTab("list")}
                variant={activeTab === "list" ? "default" : "secondary"}
                className={`rounded-full ${isMobile ? 'w-full' : 'px-6'} font-medium transition-all duration-200 ${
                  activeTab === "list" 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                Staff List
              </Button>
              <Button
                onClick={() => setActiveTab("schedule")}
                variant={activeTab === "schedule" ? "default" : "secondary"}
                className={`rounded-full ${isMobile ? 'w-full' : 'px-6'} font-medium transition-all duration-200 ${
                  activeTab === "schedule" 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                Schedule
              </Button>
              <Button
                onClick={() => setActiveTab("performance")}
                variant={activeTab === "performance" ? "default" : "secondary"}
                className={`rounded-full ${isMobile ? 'w-full' : 'px-6'} font-medium transition-all duration-200 ${
                  activeTab === "performance" 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                Performance
              </Button>
            </div>

            {activeTab === "list" && (
              <div className={`${isMobile ? 'w-full order-1' : 'flex-1 flex justify-end'}`}>
                <Button 
                  className={`bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 hover:scale-[1.02] ${isMobile ? 'w-full' : ''}`}
                >
                  <Plus size={18} className="mr-2" />
                  {isMobile ? "Add Staff" : "Add Staff Member"}
                </Button>
              </div>
            )}
            {activeTab !== "list" && !isMobile && <div className="flex-1"></div>}
          </div>

          <TabsContent value="list" className="mt-0">
            <div className="grid grid-cols-1 gap-3">
              {mockStaff.map((staff) => (
                <Card
                  key={staff.id}
                  className="p-3 sm:p-5 bg-card border-border hover:border-primary/50 transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/staff/${staff.id}`)}
                >
                  {isMobile ? (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold mb-1.5">{staff.name}</h3>
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {staff.role}
                            </Badge>
                            <Badge 
                              variant={staff.status === "Active" ? "default" : "secondary"}
                              className={staff.status === "Active" ? "bg-primary text-primary-foreground text-xs" : "text-xs"}
                            >
                              {staff.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-muted-foreground">{staff.totalAppointments} appts</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 pt-2 border-t border-border">
                        <div className="bg-secondary/30 rounded-md p-2">
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                            Hired
                          </div>
                          <div className="text-xs font-semibold">{staff.hireDate}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                      </div>

                      <div className="flex items-center gap-8 text-sm">
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
                  )}
                </Card>
              ))}
            </div>


          </TabsContent>

          <TabsContent value="schedule" className="mt-0">
            <StaffScheduleView />
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
