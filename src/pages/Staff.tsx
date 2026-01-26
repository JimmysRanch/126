import { useState, useEffect, type CSSProperties } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, PaperPlaneRight, Trash } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StaffScheduleView } from "@/components/StaffScheduleView"
import { StaffPerformanceView } from "@/components/StaffPerformanceView"
import { StaffPerformanceP8View } from "@/components/StaffPerformanceP8View"
import { PayrollOverview } from "@/components/PayrollOverview"
import GroomerPerformanceP2 from "@/components/GroomerPerformanceP2"
import GroomerPerformanceP3 from "@/pages/GroomerPerformanceP3"
import GroomerPerformanceP4 from "@/pages/GroomerPerformanceP4"
import GroomerPerformanceP6 from "@/pages/GroomerPerformanceP6"
import StaffPerformanceHudP7 from "@/pages/StaffPerformanceHudP7"
import CurvedMonitor from "@/components/CurvedMonitor"
import { useIsMobile } from "@/hooks/use-mobile"
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PendingStaff {
  id: string
  email: string
  invitedAt: string
  status: 'pending'
}

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

const d1Rows = [
  { count: 3, height: "h-20 sm:h-24", depth: 26 },
  { count: 3, height: "h-28 sm:h-32", depth: 40 },
  { count: 4, height: "h-20 sm:h-24", depth: 22 },
  { count: 3, height: "h-24 sm:h-28", depth: 30 },
]

const getRowTransform = (rowIndex: number) => {
  const bend = (rowIndex - 1.25) * 2.5
  const tilt = 12 + rowIndex * 2.2

  return {
    transform: `perspective(1400px) rotateX(${tilt}deg) rotateY(${bend}deg)`,
  }
}

const getCardTransform = (rowIndex: number, cardIndex: number, count: number, depth: number) => {
  const center = (count - 1) / 2
  const offset = cardIndex - center
  const curveX = -offset * 8
  const curveY = (rowIndex - 1.25) * 2.8
  const zDepth = depth - Math.abs(offset) * 16 - rowIndex * 4
  const arcY = rowIndex * 12 + Math.abs(offset) * 3.5
  const arcX = offset * 12

  return {
    transform: `perspective(1400px) translate3d(${arcX}px, ${arcY}px, ${zDepth}px) rotateX(${14 + curveY}deg) rotateY(${curveX}deg)`,
  }
}

const D1Card = ({
  height,
  style,
}: {
  height: string
  style?: CSSProperties
}) => (
  <div
    className={`relative ${height} rounded-[24px] bg-gradient-to-b from-[#21283a] via-[#161c2d] to-[#0a0f1a] border border-[#2a3346]/90 shadow-[0_28px_70px_rgba(4,8,18,0.75),0_0_45px_rgba(59,130,246,0.22)] overflow-hidden transform-gpu [transform-style:preserve-3d]`}
    style={style}
  >
    <div className="absolute inset-[6px] rounded-[20px] border border-[#3b4458]/85 shadow-[inset_0_0_32px_rgba(10,16,30,0.9)]" />
    <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_18%_12%,rgba(125,211,252,0.32),transparent_52%),radial-gradient(circle_at_80%_18%,rgba(253,224,71,0.2),transparent_48%)] opacity-75" />
    <div className="absolute inset-x-6 top-3 h-8 rounded-full bg-white/10 blur-lg" />
    <div className="absolute inset-x-8 bottom-2 h-6 rounded-full bg-black/55 blur-lg opacity-90" />
  </div>
)

export function Staff() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState("list")
  const isMobile = useIsMobile()
  const [pendingStaff, setPendingStaff] = useKV<PendingStaff[]>('pending-staff', [])
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [staffToCancel, setStaffToCancel] = useState<string | null>(null)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['list', 'schedule', 'payroll', 'performance', 'p2', 'p3', 'p4', 'p6', 'p7', 'p8', 'd1'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleResendInvite = (staffId: string, email: string) => {
    setPendingStaff((current) => 
      (current || []).map((staff) => 
        staff.id === staffId 
          ? { ...staff, invitedAt: new Date().toISOString() }
          : staff
      )
    )
    
    toast.success(`Invitation resent to ${email}`, {
      description: 'A new invitation email has been sent.'
    })
  }

  const handleCancelInvite = (staffId: string) => {
    setStaffToCancel(staffId)
    setCancelDialogOpen(true)
  }

  const confirmCancelInvite = () => {
    if (staffToCancel) {
      const canceledStaff = (pendingStaff || []).find(s => s.id === staffToCancel)
      setPendingStaff((current) => 
        (current || []).filter((staff) => staff.id !== staffToCancel)
      )
      
      toast.success('Invitation canceled', {
        description: canceledStaff ? `The invitation to ${canceledStaff.email} has been canceled.` : undefined
      })
    }
    
    setCancelDialogOpen(false)
    setStaffToCancel(null)
  }

  return (
    <CurvedMonitor intensity="subtle" className="w-full h-full">
      <div className="min-h-screen bg-background text-foreground p-2 sm:p-3">
        <div className="max-w-[1600px] mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
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
                onClick={() => setActiveTab("payroll")}
                variant={activeTab === "payroll" ? "default" : "secondary"}
                className={`rounded-full ${isMobile ? 'w-full' : 'px-6'} font-medium transition-all duration-200 ${
                  activeTab === "payroll" 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                Payroll
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
              <Button
                onClick={() => setActiveTab("p2")}
                variant={activeTab === "p2" ? "default" : "secondary"}
                className={`rounded-full ${isMobile ? 'w-full' : 'px-6'} font-medium transition-all duration-200 ${
                  activeTab === "p2" 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                P2
              </Button>
              <Button
                onClick={() => setActiveTab("p3")}
                variant={activeTab === "p3" ? "default" : "secondary"}
                className={`rounded-full ${isMobile ? 'w-full' : 'px-6'} font-medium transition-all duration-200 ${
                  activeTab === "p3" 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                P3
              </Button>
              <Button
                onClick={() => setActiveTab("p4")}
                variant={activeTab === "p4" ? "default" : "secondary"}
                className={`rounded-full ${isMobile ? 'w-full' : 'px-6'} font-medium transition-all duration-200 ${
                  activeTab === "p4" 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                P4
              </Button>
              <Button
                onClick={() => setActiveTab("p6")}
                variant={activeTab === "p6" ? "default" : "secondary"}
                className={`rounded-full ${isMobile ? 'w-full' : 'px-6'} font-medium transition-all duration-200 ${
                  activeTab === "p6" 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                P6
              </Button>
              <Button
                onClick={() => setActiveTab("p7")}
                variant={activeTab === "p7" ? "default" : "secondary"}
                className={`rounded-full ${isMobile ? 'w-full' : 'px-6'} font-medium transition-all duration-200 ${
                  activeTab === "p7" 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                P7
              </Button>
              <Button
                onClick={() => setActiveTab("p8")}
                variant={activeTab === "p8" ? "default" : "secondary"}
                className={`rounded-full ${isMobile ? 'w-full' : 'px-6'} font-medium transition-all duration-200 ${
                  activeTab === "p8"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                P8
              </Button>
              <Button
                onClick={() => setActiveTab("d1")}
                variant={activeTab === "d1" ? "default" : "secondary"}
                className={`rounded-full ${isMobile ? 'w-full' : 'px-6'} font-medium transition-all duration-200 ${
                  activeTab === "d1"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                D1
              </Button>
            </div>

            {activeTab === "list" && (
              <div className={`${isMobile ? 'w-full order-1' : 'flex-1 flex justify-end'}`}>
                <Button 
                  onClick={() => navigate('/staff/invite')}
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
              {(pendingStaff || []).map((staff) => (
                <Card
                  key={staff.id}
                  className="p-3 sm:p-5 bg-card border-border border-dashed opacity-75"
                >
                  {isMobile ? (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold mb-1.5">{staff.email}</h3>
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            <Badge 
                              variant="secondary"
                              className="text-xs bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
                            >
                              Pending Invite
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 pt-2 border-t border-border">
                        <div className="bg-secondary/30 rounded-md p-2">
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                            Invited
                          </div>
                          <div className="text-xs font-semibold">
                            {new Date(staff.invitedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleResendInvite(staff.id, staff.email)}
                        >
                          <PaperPlaneRight size={14} className="mr-1.5" />
                          Resend
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleCancelInvite(staff.id)}
                        >
                          <Trash size={14} className="mr-1.5" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex-1 min-w-0 flex items-center">
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-semibold">{staff.email}</h3>
                          <Badge 
                            variant="secondary"
                            className="text-xs bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
                          >
                            Pending Invite
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            Invited
                          </div>
                          <div className="font-semibold">
                            {new Date(staff.invitedAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResendInvite(staff.id, staff.email)}
                          >
                            <PaperPlaneRight size={16} className="mr-2" />
                            Resend Invite
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleCancelInvite(staff.id)}
                          >
                            <Trash size={16} className="mr-2" />
                            Cancel Invite
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
              
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
                    <div className="flex items-center gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-semibold">{staff.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {staff.role}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 text-sm">
                        <div className="text-center w-24">
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            Status
                          </div>
                          <Badge 
                            variant={staff.status === "Active" ? "default" : "secondary"}
                            className={staff.status === "Active" ? "bg-primary text-primary-foreground text-xs" : "text-xs"}
                          >
                            {staff.status}
                          </Badge>
                        </div>

                        <div className="text-center w-24">
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            Appointments
                          </div>
                          <div className="font-semibold">{staff.totalAppointments}</div>
                        </div>

                        <div className="text-center w-28">
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
            <StaffScheduleView allowEditing={false} />
          </TabsContent>

          <TabsContent value="payroll" className="mt-0">
            <PayrollOverview />
          </TabsContent>

          <TabsContent value="performance" className="mt-0">
            <StaffPerformanceView />
          </TabsContent>

          <TabsContent value="p2" className="mt-0">
            <GroomerPerformanceP2 />
          </TabsContent>

          <TabsContent value="p3" className="mt-0">
            <GroomerPerformanceP3 />
          </TabsContent>

          <TabsContent value="p4" className="mt-0">
            <GroomerPerformanceP4 />
          </TabsContent>

          <TabsContent value="p6" className="mt-0">
            <GroomerPerformanceP6 />
          </TabsContent>

          <TabsContent value="p7" className="mt-0">
            <StaffPerformanceHudP7 />
          </TabsContent>

          <TabsContent value="p8" className="mt-0">
            <StaffPerformanceP8View />
          </TabsContent>

          <TabsContent value="d1" className="mt-0">
            <div className="rounded-[28px] border border-[#1f2534] bg-[#0a0f1a]/95 p-4 sm:p-6 shadow-[0_35px_120px_rgba(15,23,42,0.65)] [perspective:1600px] [transform-style:preserve-3d]">
              <div className="space-y-3 sm:space-y-4">
                {d1Rows.map((row, rowIndex) => (
                  <div
                    key={`${row.count}-${rowIndex}`}
                    className="[transform-style:preserve-3d]"
                    style={getRowTransform(rowIndex)}
                  >
                    <div
                      className={`grid gap-3 sm:gap-4 [transform-style:preserve-3d] ${
                        row.count === 4
                          ? "grid-cols-2 lg:grid-cols-4"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      }`}
                    >
                      {Array.from({ length: row.count }).map((_, cardIndex) => (
                        <D1Card
                          key={`${rowIndex}-${cardIndex}`}
                          height={row.height}
                          style={getCardTransform(rowIndex, cardIndex, row.count, row.depth)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          </Tabs>
        </div>

        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Staff Invitation?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently cancel the pending invitation. The staff member will no longer be able to use the invitation link to join your team.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Invitation</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmCancelInvite}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Cancel Invitation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CurvedMonitor>
  )
}
