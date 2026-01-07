import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "@phosphor-icons/react"
import { CalendarView } from "@/components/appointments/CalendarView"
import { ListView } from "@/components/appointments/ListView"
import { GroomerView } from "@/components/appointments/GroomerView"
import { useIsMobile } from "@/hooks/use-mobile"

export function Appointments() {
  const [activeView, setActiveView] = useState("calendar")
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your grooming schedule</p>
        </div>
        <Button onClick={() => navigate('/appointments/new')} className="w-full sm:w-auto">
          <Plus className="mr-2" />
          New Appointment
        </Button>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'w-auto'}`}>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="groomer">Groomers</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <CalendarView />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <ListView />
        </TabsContent>

        <TabsContent value="groomer" className="mt-6">
          <GroomerView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
