import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, PaperPlaneRight, Trash } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { StaffScheduleView } from "@/components/StaffScheduleView"
import { StaffPerformanceView } from "@/components/StaffPerformanceView"
import { StaffPerformanceP8View } from "@/components/StaffPerformanceP8View"
import { PayrollOverview } from "@/components/PayrollOverview"
import CurvedMonitor from "@/components/CurvedMonitor"
import { useIsMobile } from "@/hooks/use-mobile"
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { PerformanceData, EMPTY_PERFORMANCE_DATA } from "@/lib/performance-types"
import { Staff } from "@/lib/types"
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

export const Staff = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState("list")
  const isMobile = useIsMobile()
  const [staffMembers] = useKV<Staff[]>("staff", [])
  const [pendingStaff, setPendingStaff] = useKV<PendingStaff[]>('pending-staff', [])
  const [teamPerformance] = useKV<PerformanceData>("performance-team", EMPTY_PERFORMANCE_DATA)
  const teamPerformanceData = teamPerformance ?? EMPTY_PERFORMANCE_DATA
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [staffToCancel, setStaffToCancel] = useState<string | null>(null)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['list', 'schedule', 'payroll', 'performance', 'p8'].includes(tab)) {
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
      <div className="min-h-screen bg-background text-foreground p-3 sm:p-6">
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
                  Groomers Performance
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
                            <PaperPlaneRight size= {14} className="mr-1.5" />
                            Resend
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleCancelInvite(staff.id)}
                          >
                            <Trash size= {14} className="mr-1.5" />
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
                
                {(staffMembers || []).map((staff) => (
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
                            <div className="text-xs text-muted-foreground">{staff.totalAppointments ?? 0} appts</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 pt-2 border-t border-border">
                          <div className="bg-secondary/30 rounded-md p-2">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                              Hired
                            </div>
                            <div className="text-xs font-semibold">{staff.hireDate ?? "—"}</div>
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
                            <div className="font-semibold">{staff.totalAppointments ?? 0}</div>
                          </div>

                          <div className="text-center w-28">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Hired
                            </div>
                            <div className="font-semibold">{staff.hireDate ?? "—"}</div>
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
              <StaffPerformanceView data={teamPerformanceData} scopeLabel="all groomers" />
            </TabsContent>

            <TabsContent value="p8" className="mt-0">
              <StaffPerformanceP8View />
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
