import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useKV } from "@github/spark/hooks"
import { Appointment, Staff } from "@/lib/types"
import { User, PawPrint, CaretLeft, CaretRight } from "@phosphor-icons/react"
import { AppointmentDetailsDialog } from "./AppointmentDetailsDialog"
import { format, addDays, subDays } from "date-fns"

export function GroomerView() {
  const [appointments] = useKV<Appointment[]>("appointments", [])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  const groomers = Array.from(
    new Set((appointments || []).map(apt => apt.groomerId))
  ).map(id => {
    const apt = (appointments || []).find(a => a.groomerId === id)
    return {
      id,
      name: apt?.groomerName || 'Unknown'
    }
  })

  const getGroomerAppointments = (groomerId: string) => {
    const dateStr = currentDate.toISOString().split('T')[0]
    return (appointments || [])
      .filter(apt => apt.groomerId === groomerId && apt.status !== 'cancelled' && apt.date === dateStr)
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.startTime}`)
        const dateB = new Date(`${b.date} ${b.startTime}`)
        return dateA.getTime() - dateB.getTime()
      })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400'
      case 'checked-in': return 'bg-yellow-500/20 text-yellow-400'
      case 'in-progress': return 'bg-purple-500/20 text-purple-400'
      case 'completed': return 'bg-green-500/20 text-green-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM d, yyyy')}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(subDays(currentDate, 1))}>
              <CaretLeft />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, 1))}>
              <CaretRight />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groomers.map(groomer => {
          const dayApts = getGroomerAppointments(groomer.id)
        
          return (
            <Card key={groomer.id} className="p-4">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{groomer.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {dayApts.length} appointment{dayApts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
              {dayApts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <PawPrint size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No appointments for this day</p>
                </div>
              ) : (
                dayApts.map(apt => (
                  <button
                    key={apt.id}
                    onClick={() => {
                      setSelectedAppointment(apt)
                      setDetailsOpen(true)
                    }}
                    className="w-full text-left p-3 border border-border rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate flex items-center gap-1">
                          <PawPrint size={14} />
                          {apt.petName}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{apt.clientName}</div>
                      </div>
                      <Badge variant="secondary" className={`${getStatusColor(apt.status)} text-xs`}>
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(apt.date), 'MMM d')} • {apt.startTime}
                    </div>
                    <div className="text-sm font-semibold text-primary mt-1">
                      ${apt.totalPrice.toFixed(2)}
                    </div>
                    {apt.groomerRequested && (
                      <Badge variant="outline" className="text-xs mt-2">
                        Client Requested
                      </Badge>
                    )}
                  </button>
                ))
              )}
            </div>
          </Card>
          )
        })}

        {groomers.length === 0 && (
          <Card className="col-span-full p-12">
            <div className="text-center text-muted-foreground">
              <User size={48} className="mx-auto mb-3 opacity-50" />
              <p>No groomers found</p>
              <p className="text-sm mt-1">Appointments will appear here once created</p>
            </div>
          </Card>
        )}
      </div>

      {selectedAppointment && (
        <AppointmentDetailsDialog
          appointment={selectedAppointment}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}
    </div>
  )
}
