import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useKV } from "@github/spark/hooks"
import { Appointment } from "@/lib/types"
import { Calendar, CaretLeft, CaretRight, PawPrint } from "@phosphor-icons/react"
import { AppointmentDetailsDialog } from "./AppointmentDetailsDialog"
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks, addMonths, subMonths, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns"

type ViewMode = 'day' | 'week' | 'month'

interface CalendarViewProps {
  statusFilter?: string
}

export function CalendarView({ statusFilter }: CalendarViewProps) {
  const [appointments] = useKV<Appointment[]>("appointments", [])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('week')

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = viewMode === 'week' 
    ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    : [currentDate]

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
  })

  const navigateDate = (direction: 'prev' | 'next') => {
    switch (viewMode) {
      case 'week':
        setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1))
        break
      case 'month':
        setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
        break
      default:
        setCurrentDate(direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1))
    }
  }

  const getHeaderText = () => {
    switch (viewMode) {
      case 'week':
        return `${format(weekStart, 'MMM d')} - ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`
      case 'month':
        return format(currentDate, 'MMMM yyyy')
      default:
        return format(currentDate, 'MMMM d, yyyy')
    }
  }

  const getAppointmentsForSlot = (day: Date, timeSlot: string) => {
    return (appointments || []).filter(apt => {
      const aptDate = new Date(apt.date + 'T00:00:00')
      const matchesDate = isSameDay(aptDate, day) && apt.startTime === timeSlot
      const matchesStatus = !statusFilter || statusFilter === "all" || apt.status === statusFilter
      return matchesDate && matchesStatus
    })
  }

  const getAppointmentsForDay = (day: Date) => {
    return (appointments || []).filter(apt => {
      const aptDate = new Date(apt.date + 'T00:00:00')
      const matchesDate = isSameDay(aptDate, day)
      const matchesStatus = !statusFilter || statusFilter === "all" || apt.status === statusFilter
      return matchesDate && matchesStatus
    })
  }

  const getMonthDays = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = addDays(startDate, 41)
    return eachDayOfInterval({ start: startDate, end: endDate })
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
      <Card className="p-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">{getHeaderText()}</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger 
                  value="day"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Day
                </TabsTrigger>
                <TabsTrigger 
                  value="week"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Week
                </TabsTrigger>
                <TabsTrigger 
                  value="month"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Month
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                <CaretLeft />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                <CaretRight />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        {viewMode === 'month' ? (
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {getMonthDays().map((day, idx) => {
              const dayAppointments = getAppointmentsForDay(day)
              const isCurrentMonth = day.getMonth() === currentDate.getMonth()
              const isToday = isSameDay(day, new Date())
              
              return (
                <div
                  key={idx}
                  className={`min-h-[100px] p-2 border border-border rounded-lg ${
                    isToday ? 'bg-primary/5 border-primary' : ''
                  } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                >
                  <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map(apt => (
                      <button
                        key={apt.id}
                        onClick={() => {
                          setSelectedAppointment(apt)
                          setDetailsOpen(true)
                        }}
                        className={`w-full text-left p-1 rounded text-xs hover:opacity-80 transition-opacity ${getStatusColor(apt.status)}`}
                      >
                        <div className="font-medium truncate flex items-center gap-1">
                          <PawPrint size={10} weight="fill" className="text-primary shrink-0" />
                          {apt.petName}
                        </div>
                        <div className="truncate text-[10px] opacity-80">{apt.startTime}</div>
                      </button>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-[10px] text-muted-foreground text-center">
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className={viewMode === 'week' ? 'min-w-[800px]' : ''}>
              <div className={`grid gap-2 mb-2 ${viewMode === 'week' ? 'grid-cols-[auto_repeat(7,1fr)]' : 'grid-cols-[auto_1fr]'}`}>
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
                  <div key={slot} className={`grid ${viewMode === 'week' ? 'grid-cols-[auto_repeat(7,1fr)]' : 'grid-cols-[auto_1fr]'} ${slotIdx !== timeSlots.length - 1 ? 'border-b border-border' : ''}`}>
                    <div className="text-xs text-muted-foreground p-2 border-r border-border w-[70px]">
                      {slot}
                    </div>
                    {weekDays.map((day, dayIdx) => {
                      const slotAppointments = getAppointmentsForSlot(day, slot)
                      return (
                        <div
                          key={dayIdx}
                          className={`p-1 min-h-[60px] ${viewMode === 'week' && dayIdx !== 6 ? 'border-r border-border' : ''} ${
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
                              <div className="font-medium truncate flex items-center gap-1">
                                <PawPrint size={12} weight="fill" className="text-primary shrink-0" />
                                {apt.petName}
                              </div>
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
        )}
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
