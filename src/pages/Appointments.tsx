import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
          <div className={`flex ${isMobile ? 'flex-row' : 'items-center'} gap-2 sm:gap-3 ${isMobile ? 'order-2' : ''}`}>
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

          <div className={`${isMobile ? 'w-full order-1' : ''}`}>
            <Button 
              onClick={() => navigate('/appointments/new')}
              className={`bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 hover:scale-[1.02] ${isMobile ? 'w-full' : ''}`}
            >
              <Plus size={18} className="mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
          <Card className="p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-2">Scheduled</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">24</p>
          </Card>
          
          <Card className="p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-2">Checked In</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">8</p>
          </Card>
          
          <Card className="p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-2">Completed</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">15</p>
          </Card>
          
          <Card className="p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-2">No Show</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">2</p>
          </Card>
          
          <Card className="p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-2">Canceled</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">3</p>
          </Card>
          
          <Card className="p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-2">Projected Revenue</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">$2,450</p>
          </Card>
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
