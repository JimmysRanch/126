import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useKV } from "@github/spark/hooks"
import { Appointment, Staff } from "@/lib/types"
import { User, PawPrint, CaretLeft, CaretRight } from "@phosphor-icons/react"
import { AppointmentDetailsDialog } from "./AppointmentDetailsDialog"
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, addWeeks, addMonths, subWeeks, subMonths, isSameDay } from "date-fns"

type ViewMode = 'day' | 'week' | 'month'

interface GroomerViewProps {
  statusFilter?: string
}

export function GroomerView({ statusFilter }: GroomerViewProps) {
  const [appointments] = useKV<Appointment[]>("appointments", [])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('day')

  const groomers = Array.from(
    new Set((appointments || []).map(apt => apt.groomerId))
  ).map(id => {
    const apt = (appointments || []).find(a => a.groomerId === id)
    return {
      id,
      name: apt?.groomerName || 'Unknown'
    }
  })

  const getDateRange = () => {
    switch (viewMode) {
      case 'week':
        return {
          start: startOfWeek(currentDate, { weekStartsOn: 0 }),
          end: endOfWeek(currentDate, { weekStartsOn: 0 })
        }
      case 'month':
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        }
      default:
        return {
          start: currentDate,
          end: currentDate
        }
    }
  }

  const getGroomerAppointments = (groomerId: string) => {
    const { start, end } = getDateRange()
    return (appointments || [])
      .filter(apt => {
        if (apt.groomerId !== groomerId) return false
        
        const matchesStatus = !statusFilter || statusFilter === "all" || apt.status === statusFilter
        if (!matchesStatus) return false
        
        if (apt.status === 'cancelled' && (!statusFilter || statusFilter === "all")) return false
        
        const aptDate = new Date(apt.date + 'T00:00:00')
        if (viewMode === 'day') {
          return isSameDay(aptDate, currentDate)
        }
        return isWithinInterval(aptDate, { start, end })
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`)
        const dateB = new Date(`${b.date}T${b.startTime}`)
        return dateA.getTime() - dateB.getTime()
      })
  }

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
    const { start, end } = getDateRange()
    switch (viewMode) {
      case 'week':
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
      case 'month':
        return format(currentDate, 'MMMM yyyy')
      default:
        return format(currentDate, 'MMMM d, yyyy')
    }
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groomers.map(groomer => {
          const groomerApts = getGroomerAppointments(groomer.id)
        
          return (
            <Card key={groomer.id} className="p-4">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{groomer.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {groomerApts.length} appointment{groomerApts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
              {groomerApts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <PawPrint size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No appointments for this {viewMode}</p>
                </div>
              ) : (
                groomerApts.map(apt => (
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
                      {format(new Date(apt.date + 'T00:00:00'), 'MMM d')} • {apt.startTime}
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
