import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Plus } from "@phosphor-icons/react"
import { CalendarView } from "@/components/appointments/CalendarView"
import { ListView } from "@/components/appointments/ListView"
import { GroomerView } from "@/components/appointments/GroomerView"
import { useIsMobile } from "@/hooks/use-mobile"

export function Appointments() {
  const [activeView, setActiveView] = useState("groomer")
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className={isMobile ? 'order-1' : ''}>
            <h1 className="text-2xl sm:text-3xl font-bold">Appointments</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your grooming schedule</p>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-row' : 'items-center'} gap-2 sm:gap-3 ${isMobile ? 'order-3' : ''}`}>
            <Button
              onClick={() => setActiveView("groomer")}
              variant={activeView === "groomer" ? "default" : "secondary"}
              className={`rounded-full ${isMobile ? 'flex-1' : 'px-6'} font-medium transition-all duration-200 ${
                activeView === "groomer" 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "bg-secondary/50 hover:bg-secondary"
              }`}
            >
              Groomers
            </Button>
            <Button
              onClick={() => setActiveView("list")}
              variant={activeView === "list" ? "default" : "secondary"}
              className={`rounded-full ${isMobile ? 'flex-1' : 'px-6'} font-medium transition-all duration-200 ${
                activeView === "list" 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "bg-secondary/50 hover:bg-secondary"
              }`}
            >
              List
            </Button>
            <Button
              onClick={() => setActiveView("calendar")}
              variant={activeView === "calendar" ? "default" : "secondary"}
              className={`rounded-full ${isMobile ? 'flex-1' : 'px-6'} font-medium transition-all duration-200 ${
                activeView === "calendar" 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "bg-secondary/50 hover:bg-secondary"
              }`}
            >
              Calendar
            </Button>
          </div>

          <div className={`${isMobile ? 'w-full order-2' : ''}`}>
            <Button 
              onClick={() => navigate('/appointments/new')}
              className={`bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 hover:scale-[1.02] ${isMobile ? 'w-full' : ''}`}
            >
              <Plus size={18} className="mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        <div className="mt-6">
          {activeView === "calendar" && <CalendarView />}
          {activeView === "list" && <ListView />}
          {activeView === "groomer" && <GroomerView />}
        </div>
      </div>
    </div>
  )
}
