import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarBlank, Clock, Plus, CheckCircle, XCircle, Warning } from "@phosphor-icons/react"
import { toast } from "sonner"

interface TimeOffRequest {
  id: string
  staffId: string
  staffName: string
  startDate: string
  endDate: string
  reason: string
  type: 'Vacation' | 'Sick' | 'Personal' | 'Other'
  status: 'Pending' | 'Approved' | 'Denied'
  requestedAt: string
  notes?: string
}

interface ScheduleShift {
  id: string
  staffId: string
  staffName: string
  date: string
  startTime: string
  endTime: string
  role: string
}

const mockShifts: ScheduleShift[] = [
  { id: "1", staffId: "1", staffName: "Sarah Johnson", date: "2025-02-01", startTime: "09:00", endTime: "17:00", role: "Senior Groomer" },
  { id: "2", staffId: "2", staffName: "Mike Torres", date: "2025-02-01", startTime: "10:00", endTime: "18:00", role: "Groomer" },
  { id: "3", staffId: "3", staffName: "Emma Roberts", date: "2025-02-01", startTime: "09:00", endTime: "15:00", role: "Spa Specialist" },
  { id: "4", staffId: "4", staffName: "Carlos Martinez", date: "2025-02-01", startTime: "08:00", endTime: "16:00", role: "Bather" },
  { id: "5", staffId: "1", staffName: "Sarah Johnson", date: "2025-02-02", startTime: "09:00", endTime: "17:00", role: "Senior Groomer" },
  { id: "6", staffId: "2", staffName: "Mike Torres", date: "2025-02-02", startTime: "10:00", endTime: "18:00", role: "Groomer" },
]

export function StaffScheduleView({ staffId }: { staffId?: string }) {
  const [timeOffRequests, setTimeOffRequests] = useKV<TimeOffRequest[]>("time-off-requests", [])
  const [scheduleShifts, setScheduleShifts] = useKV<ScheduleShift[]>("schedule-shifts", mockShifts)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  
  const [newRequest, setNewRequest] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'Vacation' as TimeOffRequest['type'],
    notes: ''
  })

  const getWeekDates = (date: Date): Date[] => {
    const week: Date[] = []
    const current = new Date(date)
    current.setDate(current.getDate() - current.getDay())
    
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return week
  }

  const weekDates = getWeekDates(selectedWeek)
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const handleSubmitRequest = () => {
    if (!newRequest.startDate || !newRequest.endDate || !newRequest.reason) {
      toast.error("Please fill in all required fields")
      return
    }

    const request: TimeOffRequest = {
      id: Date.now().toString(),
      staffId: staffId || "1",
      staffName: "Current User",
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      reason: newRequest.reason,
      type: newRequest.type,
      status: 'Pending',
      requestedAt: new Date().toISOString(),
      notes: newRequest.notes
    }

    setTimeOffRequests((current) => [...(current || []), request])
    toast.success("Time-off request submitted")
    setIsRequestDialogOpen(false)
    setNewRequest({ startDate: '', endDate: '', reason: '', type: 'Vacation', notes: '' })
  }

  const handleApproveRequest = (requestId: string) => {
    setTimeOffRequests((current) =>
      (current || []).map(req => 
        req.id === requestId ? { ...req, status: 'Approved' as const } : req
      )
    )
    toast.success("Time-off request approved")
  }

  const handleDenyRequest = (requestId: string) => {
    setTimeOffRequests((current) =>
      (current || []).map(req => 
        req.id === requestId ? { ...req, status: 'Denied' as const } : req
      )
    )
    toast.error("Time-off request denied")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getShiftsForDate = (date: Date, staffId?: string) => {
    const dateStr = date.toISOString().split('T')[0]
    return (scheduleShifts || []).filter(shift => {
      const matchesDate = shift.date === dateStr
      const matchesStaff = !staffId || shift.staffId === staffId
      return matchesDate && matchesStaff
    })
  }

  const filteredRequests = staffId 
    ? (timeOffRequests || []).filter(req => req.staffId === staffId)
    : (timeOffRequests || [])

  const pendingRequests = filteredRequests.filter(req => req.status === 'Pending')
  const approvedRequests = filteredRequests.filter(req => req.status === 'Approved')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(selectedWeek)
              newDate.setDate(newDate.getDate() - 7)
              setSelectedWeek(newDate)
            }}
          >
            Previous Week
          </Button>
          <h3 className="text-lg font-semibold">
            {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(selectedWeek)
              newDate.setDate(newDate.getDate() + 7)
              setSelectedWeek(newDate)
            }}
          >
            Next Week
          </Button>
        </div>

        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              <Plus size={18} className="mr-2" />
              Request Time Off
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle>Request Time Off</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newRequest.startDate}
                    onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newRequest.endDate}
                    onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={newRequest.type} onValueChange={(value) => setNewRequest({ ...newRequest, type: value as TimeOffRequest['type'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vacation">Vacation</SelectItem>
                    <SelectItem value="Sick">Sick Leave</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Input
                  id="reason"
                  placeholder="Brief description"
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional context or details"
                  rows={3}
                  value={newRequest.notes}
                  onChange={(e) => setNewRequest({ ...newRequest, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsRequestDialogOpen(false)
                  setNewRequest({ startDate: '', endDate: '', reason: '', type: 'Vacation', notes: '' })
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleSubmitRequest}
              >
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const shifts = getShiftsForDate(date, staffId)
            const isToday = date.toDateString() === new Date().toDateString()
            
            return (
              <div key={index} className="space-y-2">
                <div className={`text-center p-3 rounded-lg ${isToday ? 'bg-primary/20 border border-primary' : 'bg-secondary/30'}`}>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    {weekDays[index].substring(0, 3)}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? 'text-primary' : ''}`}>
                    {date.getDate()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {shifts.length > 0 ? (
                    shifts.map((shift) => (
                      <div
                        key={shift.id}
                        className="p-2 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        {!staffId && (
                          <div className="text-xs font-semibold mb-1 truncate">
                            {shift.staffName}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} />
                          <span>{shift.startTime}-{shift.endTime}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 rounded-lg bg-muted/20 text-center">
                      <div className="text-xs text-muted-foreground">Off</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {pendingRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Pending Time-Off Requests
          </h3>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="p-4 bg-card border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {!staffId && <h4 className="font-semibold">{request.staffName}</h4>}
                      <Badge variant="outline" className="text-xs">
                        {request.type}
                      </Badge>
                      <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 text-xs">
                        <Warning size={14} className="mr-1" />
                        Pending
                      </Badge>
                    </div>
                    <div className="text-sm mb-2">
                      <CalendarBlank size={16} className="inline mr-2" />
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      <strong>Reason:</strong> {request.reason}
                    </div>
                    {request.notes && (
                      <div className="text-sm text-muted-foreground italic">
                        {request.notes}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      Requested {new Date(request.requestedAt).toLocaleDateString()}
                    </div>
                  </div>
                  {!staffId && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500/30 text-green-600 hover:bg-green-500/10"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-600 hover:bg-red-500/10"
                        onClick={() => handleDenyRequest(request.id)}
                      >
                        <XCircle size={16} className="mr-1" />
                        Deny
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {approvedRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Approved Time Off
          </h3>
          <div className="space-y-3">
            {approvedRequests.map((request) => (
              <Card key={request.id} className="p-4 bg-card border-border opacity-80">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {!staffId && <h4 className="font-semibold">{request.staffName}</h4>}
                      <Badge variant="outline" className="text-xs">
                        {request.type}
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">
                        <CheckCircle size={14} className="mr-1" />
                        Approved
                      </Badge>
                    </div>
                    <div className="text-sm mb-2">
                      <CalendarBlank size={16} className="inline mr-2" />
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Reason:</strong> {request.reason}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredRequests.length === 0 && (
        <Card className="p-12 bg-card border-border text-center">
          <p className="text-muted-foreground">
            No time-off requests yet. Click "Request Time Off" to get started.
          </p>
        </Card>
      )}
    </div>
  )
}
