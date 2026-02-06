import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useKV } from "@github/spark/hooks"
import { Appointment } from "@/lib/types"
import { MagnifyingGlass, PawPrint, User, CaretLeft, CaretRight } from "@phosphor-icons/react"
import { AppointmentDetailsDialog } from "./AppointmentDetailsDialog"
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, addWeeks, addMonths, subWeeks, subMonths } from "date-fns"
import { dateToBusinessDateString, getTodayDateInBusinessTimezone } from "@/lib/date-utils"

type ViewMode = 'day' | 'week' | 'month'

interface ListViewProps {
  statusFilter?: string
}

export function ListView({ statusFilter: externalStatusFilter }: ListViewProps) {
  const [appointments] = useKV<Appointment[]>("appointments", [])
  const [searchQuery, setSearchQuery] = useState("")
  const [localStatusFilter, setLocalStatusFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(() => getTodayDateInBusinessTimezone())
  const [viewMode, setViewMode] = useState<ViewMode>('day')
  
  const statusFilter = externalStatusFilter || localStatusFilter

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

  const { start, end } = getDateRange()

  const filteredAppointments = (appointments || [])
    .filter(apt => {
      const matchesSearch = 
        apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.groomerName.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || apt.status === statusFilter

      const aptDate = new Date(apt.date + 'T00:00:00')
      const matchesDate = viewMode === 'day' 
        ? apt.date === dateToBusinessDateString(currentDate)
        : isWithinInterval(aptDate, { start, end })

      return matchesSearch && matchesStatus && matchesDate
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.startTime}`)
      const dateB = new Date(`${b.date} ${b.startTime}`)
      return dateB.getTime() - dateA.getTime()
    })

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
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(getTodayDateInBusinessTimezone())}>
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
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by client, pet, or groomer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setLocalStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <PawPrint size={48} className="mx-auto mb-3 opacity-50" />
              <p>No appointments found</p>
            </div>
          ) : (
            filteredAppointments.map(apt => (
              <button
                key={apt.id}
                onClick={() => {
                  setSelectedAppointment(apt)
                  setDetailsOpen(true)
                }}
                className="w-full text-left p-4 border border-border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <PawPrint size={16} weight="fill" className="text-primary shrink-0" />
                      <h3 className="font-semibold">{apt.petName}</h3>
                      <Badge variant="secondary" className={getStatusColor(apt.status)}>
                        {apt.status}
                      </Badge>
                      {apt.groomerRequested && (
                        <Badge variant="outline" className="text-xs">
                          Requested
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>{apt.clientName}</span>
                      </div>
                      <div>Groomer: {apt.groomerName}</div>
                      <div>{format(new Date(apt.date + 'T00:00:00'), 'MMM d, yyyy')} at {apt.startTime}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      ${apt.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {apt.services.length} service{apt.services.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
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
