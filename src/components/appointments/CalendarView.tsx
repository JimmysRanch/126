import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useKV } from "@github/spark/hooks"
import { Appointment } from "@/lib/types"
import { Calendar, CaretLeft, CaretRight, PawPrint } from "@phosphor-icons/react"
import { AppointmentDetailsDialog } from "./AppointmentDetailsDialog"
import { format, addDays, subDays, startOfWeek, addWeeks, isSameDay } from "date-fns"

export function CalendarView() {
  const [appointments] = useKV<Appointment[]>("appointments", [])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
  })

  const getAppointmentsForSlot = (day: Date, timeSlot: string) => {
    return (appointments || []).filter(apt => {
      const aptDate = new Date(apt.date)
      return isSameDay(aptDate, day) && apt.startTime === timeSlot
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400'
      case 'checked-in': return 'bg-yellow-500/20 text-yellow-400'
      case 'in-progress': return 'bg-purple-500/20 text-purple-400'
      case 'completed': return 'bg-green-500/20 text-green-400'
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={24} className="text-primary" />
            <h2 className="text-xl font-semibold">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(subDays(currentDate, 7))}>
              <CaretLeft />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
              <CaretRight />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="text-xs font-medium text-muted-foreground p-2">Time</div>
              {weekDays.map((day, i) => (
                <div key={i} className="text-center p-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-lg font-bold ${isSameDay(day, new Date()) ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              {timeSlots.map((slot, slotIdx) => (
                <div key={slot} className={`grid grid-cols-8 ${slotIdx !== timeSlots.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="text-xs text-muted-foreground p-2 border-r border-border">
                    {slot}
                  </div>
                  {weekDays.map((day, dayIdx) => {
                    const slotAppointments = getAppointmentsForSlot(day, slot)
                    return (
                      <div
                        key={dayIdx}
                        className={`p-1 min-h-[60px] ${dayIdx !== 6 ? 'border-r border-border' : ''} ${
                          isSameDay(day, new Date()) ? 'bg-primary/5' : ''
                        }`}
                      >
                        {slotAppointments.map(apt => (
                          <button
                            key={apt.id}
                            onClick={() => {
                              setSelectedAppointment(apt)
                              setDetailsOpen(true)
                            }}
                            className={`w-full text-left p-2 rounded text-xs mb-1 hover:opacity-80 transition-opacity ${getStatusColor(apt.status)}`}
                          >
                            <div className="font-medium truncate">{apt.petName}</div>
                            <div className="truncate opacity-80">{apt.groomerName}</div>
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

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
