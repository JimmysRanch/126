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
  { id: "1", name: "Sarah Johnson", role: "Senior Groomer", email: "sarah.j@pawhub.com", phone: "(555) 123-4567", status: "Active", specialties: ["Large Breeds", "Show Cuts", "Hand Stripping"], hourlyRate: "$35/hr", totalAppointments: 324, rating: 4.9, hireDate: "Mar 15, 2022" },
  { id: "2", name: "Mike Torres", role: "Groomer", email: "mike.t@pawhub.com", phone: "(555) 234-5678", status: "Active", specialties: ["Anxious Dogs", "Creative Styling", "Nail Care"], hourlyRate: "$28/hr", totalAppointments: 256, rating: 4.8, hireDate: "Aug 20, 2022" },
  { id: "3", name: "Emma Roberts", role: "Spa Specialist", email: "emma.r@pawhub.com", phone: "(555) 345-6789", status: "Active", specialties: ["Spa Treatments", "Small Breeds", "Facials"], hourlyRate: "$32/hr", totalAppointments: 198, rating: 5.0, hireDate: "Jan 10, 2023" },
  { id: "4", name: "Carlos Martinez", role: "Bather", email: "carlos.m@pawhub.com", phone: "(555) 456-7890", status: "Active", specialties: ["De-shedding", "Quick Service", "Puppy Care"], hourlyRate: "$22/hr", totalAppointments: 412, rating: 4.7, hireDate: "May 5, 2023" },
  { id: "5", name: "Lisa Chen", role: "Groomer", email: "lisa.c@pawhub.com", phone: "(555) 567-8901", status: "On Leave", specialties: ["Poodle Cuts", "Color & Styling", "Competition Prep"], hourlyRate: "$30/hr", totalAppointments: 187, rating: 4.9, hireDate: "Nov 12, 2023" }
]

const d1Rows = [
  { count: 3, height: "h-20 sm:h-24", depth: 80 },
  { count: 3, height: "h-28 sm:h-32", depth: 120 },
  { count: 4, height: "h-20 sm:h-24", depth: 100 },
  { count: 3, height: "h-24 sm:h-28", depth: 140 },
]

export const Staff = () => {
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
        staff.id === staffId ? { ...staff, invitedAt: new Date().toISOString() } : staff
      )
    )
    toast.success(`Invitation resent to ${email}`)
  }

  const handleCancelInvite = (staffId: string) => {
    setStaffToCancel(staffId)
    setCancelDialogOpen(true)
  }

  const confirmCancelInvite = () => {
    if (staffToCancel) {
      setPendingStaff((current) => (current || []).filter((staff) => staff.id !== staffToCancel))
      toast.success('Invitation canceled')
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
                {["list", "schedule", "payroll", "performance", "p2", "p3", "p4", "p6", "p7", "p8", "d1"].map(tab => (
                  <Button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    variant={activeTab === tab ? "default" : "secondary"}
                    className={`rounded-full ${isMobile ? 'w-full' : 'px-6'} font-medium transition-all duration-200 ${activeTab === tab ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary/50 hover:bg-secondary"}`}
                  >
                    {tab === "list" ? "Staff List" : tab.toUpperCase()}
                  </Button>
                ))}
              </div>
              {activeTab === "list" && (
                <div className={`${isMobile ? 'w-full order-1' : 'flex-1 flex justify-end'}`}>
                  <Button onClick={() => navigate('/staff/invite')} className={`bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 hover:scale-[1.02] ${isMobile ? 'w-full' : ''}`}>
                    <Plus size={18} className="mr-2" />
                    {isMobile ? "Add Staff" : "Add Staff Member"}
                  </Button>
                </div>
              )}
              {activeTab !== "list" && !isMobile && <div className="flex-1"></div>}
            </div>

            <TabsContent value="d1" className="mt-0">
  <div className="relative min-h-[700px] rounded-3xl border border-slate-700/40 bg-black/80 p-4 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] [perspective:2800px] [transform-style:preserve-3d] overflow-hidden">
    <div
      className="relative mx-auto max-w-6xl"
      style={{
        transform: "rotateX(22deg) rotateY(-5deg) scale(1.06)",
        transformStyle: "preserve-3d",
      }}
    >
      {d1Rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="[transform-style:preserve-3d] mb-[-60px] last:mb-[-20px]"
          style={{
            transform: `rotateX(${16 + rowIdx * 9}deg) rotateY(${(rowIdx - 1.5) * 11}deg)`,
          }}
        >
          <div
            className={`grid gap-6 sm:gap-8 [transform-style:preserve-3d] justify-items-center ${
              row.count === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {Array.from({ length: row.count }).map((_, colIdx) => {
              const center = (row.count - 1) / 2
              const offset = colIdx - center
              const z = row.depth + 100 - Math.abs(offset) * 70
              const rotY = offset * -22
              const rotX = 8 + Math.abs(offset) * 8 + rowIdx * 4
              const tx = offset * 35
              const ty = rowIdx * 24 + Math.abs(offset) * 16

              return (
                <div
                  key={colIdx}
                  className={`${row.height} w-full max-w-[360px] rounded-2xl bg-gradient-to-br from-slate-900 via-black to-slate-950 border border-slate-600/50 shadow-[0_50px_120px_rgba(0,0,0,1),inset_0_2px_10px_rgba(255,255,255,0.03)] [transform-style:preserve-3d] transition-all duration-300 hover:scale-110 hover:z-20 hover:shadow-cyan-900/30`}
                  style={{
                    transform: `translate3d(${tx}px, ${ty}px, ${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-black/30 to-black/60 pointer-events-none" />
                  <div className="absolute inset-[1px] rounded-[15px] border border-cyan-900/30 opacity-70 pointer-events-none" />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
</TabsContent>
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Staff Invitation?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently cancel the pending invitation.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Invitation</AlertDialogCancel>
              <AlertDialogAction onClick={confirmCancelInvite} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Cancel Invitation</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CurvedMonitor>
  )
}
