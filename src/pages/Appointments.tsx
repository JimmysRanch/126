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
  const [statusFilter, setStatusFilter] = useState("all")
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-background px-3 sm:px-6 pt-2 sm:pt-3 pb-3 sm:pb-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4 sm:mb-6">
          <Card 
            className={`p-2 md:p-2.5 border-border cursor-pointer transition-all duration-200 ${
              statusFilter === "scheduled" 
                ? "border-primary shadow-lg shadow-primary/20 bg-primary/5" 
                : "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            }`}
            onClick={() => setStatusFilter(statusFilter === "scheduled" ? "all" : "scheduled")}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Scheduled</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">24</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className={`p-2 md:p-2.5 border-border cursor-pointer transition-all duration-200 ${
              statusFilter === "checked-in" 
                ? "border-primary shadow-lg shadow-primary/20 bg-primary/5" 
                : "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            }`}
            onClick={() => setStatusFilter(statusFilter === "checked-in" ? "all" : "checked-in")}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Checked In</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">8</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className={`p-2 md:p-2.5 border-border cursor-pointer transition-all duration-200 ${
              statusFilter === "completed" 
                ? "border-primary shadow-lg shadow-primary/20 bg-primary/5" 
                : "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            }`}
            onClick={() => setStatusFilter(statusFilter === "completed" ? "all" : "completed")}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Completed</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">15</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className={`p-2 md:p-2.5 border-border cursor-pointer transition-all duration-200 ${
              statusFilter === "no-show" 
                ? "border-primary shadow-lg shadow-primary/20 bg-primary/5" 
                : "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            }`}
            onClick={() => setStatusFilter(statusFilter === "no-show" ? "all" : "no-show")}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">No Show</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">2</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className={`p-2 md:p-2.5 border-border cursor-pointer transition-all duration-200 ${
              statusFilter === "cancelled" 
                ? "border-primary shadow-lg shadow-primary/20 bg-primary/5" 
                : "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            }`}
            onClick={() => setStatusFilter(statusFilter === "cancelled" ? "all" : "cancelled")}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Canceled</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">3</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-2 md:p-2.5 border-border">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Projected Revenue</p>
                <p className="text-lg md:text-xl font-bold mt-0.5 text-primary">$2,450</p>
              </div>
            </div>
          </Card>
        </div>

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

        <div className="mt-6">
          {activeView === "calendar" && <CalendarView statusFilter={statusFilter} />}
          {activeView === "list" && <ListView statusFilter={statusFilter} />}
          {activeView === "groomer" && <GroomerView statusFilter={statusFilter} />}
        </div>
      </div>
    </div>
  )
}
