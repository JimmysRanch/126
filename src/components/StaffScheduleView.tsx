import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarBlank, Clock, Plus, CheckCircle, XCircle, Warning, Copy, Trash, PencilSimple, X } from "@phosphor-icons/react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TimeOffRequest {
  id: string
  staffId: string
  staffName: string
  startDate: string
  endDate: string
  reason: string
  type: 'Vacation' | 'Sick' | 'Personal'
  status: 'Pending' | 'Approved' | 'Denied' | 'Cancelled'
  requestedAt: string
  notes?: string
}

interface WorkBlock {
  id: string
  startTime: string
  endTime: string
  isBreak?: boolean
}

interface WeeklyTemplate {
  monday: WorkBlock[]
  tuesday: WorkBlock[]
  wednesday: WorkBlock[]
  thursday: WorkBlock[]
  friday: WorkBlock[]
  saturday: WorkBlock[]
  sunday: WorkBlock[]
}

interface DateOverride {
  id: string
  date: string
  blocks: WorkBlock[]
  isUnavailable?: boolean
}

interface StaffSchedule {
  staffId: string
  weeklyTemplate: WeeklyTemplate
  dateOverrides: DateOverride[]
  setupComplete: boolean
}

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const MOCK_STAFF = [
  { id: "1", name: "Sarah Johnson", role: "Groomer" },
  { id: "2", name: "Mike Torres", role: "Groomer" },
  { id: "3", name: "Emma Roberts", role: "Bather" },
  { id: "4", name: "Carlos Martinez", role: "Front Desk" },
]

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = h.toString().padStart(2, '0')
      const minute = m.toString().padStart(2, '0')
      slots.push(`${hour}:${minute}`)
    }
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()

function getEmptyWeeklyTemplate(): WeeklyTemplate {
  return {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  }
}

export function StaffScheduleView({ staffId, isOwner = true }: { staffId?: string; isOwner?: boolean }) {
  const [timeOffRequests, setTimeOffRequests] = useKV<TimeOffRequest[]>("time-off-requests", [])
  const [staffSchedules, setStaffSchedules] = useKV<StaffSchedule[]>("staff-schedules", [])
  const [roleFilter, setRoleFilter] = useState<string>("All")
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null)
  const [editingDay, setEditingDay] = useState<keyof WeeklyTemplate | null>(null)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [revokeRequestId, setRevokeRequestId] = useState<string | null>(null)
  
  const [newRequest, setNewRequest] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'Vacation' as TimeOffRequest['type'],
    notes: ''
  })

  const [newBlock, setNewBlock] = useState({
    startTime: '09:00',
    endTime: '17:00',
    isBreak: false
  })

  const getWeekDates = (date: Date): Date[] => {
    const week: Date[] = []
    const current = new Date(date)
    const day = current.getDay()
    const diff = current.getDate() - day + (day === 0 ? -6 : 1)
    current.setDate(diff)
    
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return week
  }

  const weekDates = getWeekDates(selectedWeek)

  const getStaffSchedule = (sId: string): StaffSchedule => {
    const existing = (staffSchedules || []).find(s => s.staffId === sId)
    if (existing) return existing
    
    return {
      staffId: sId,
      weeklyTemplate: getEmptyWeeklyTemplate(),
      dateOverrides: [],
      setupComplete: false
    }
  }

  const updateStaffSchedule = (sId: string, updates: Partial<StaffSchedule>) => {
    setStaffSchedules((current) => {
      const schedules = current || []
      const existingIndex = schedules.findIndex(s => s.staffId === sId)
      
      if (existingIndex >= 0) {
        const updated = [...schedules]
        updated[existingIndex] = { ...updated[existingIndex], ...updates }
        return updated
      } else {
        return [...schedules, {
          staffId: sId,
          weeklyTemplate: getEmptyWeeklyTemplate(),
          dateOverrides: [],
          setupComplete: false,
          ...updates
        }]
      }
    })
  }

  const getAvailabilityForDate = (sId: string, date: Date): WorkBlock[] => {
    const schedule = getStaffSchedule(sId)
    const dateStr = date.toISOString().split('T')[0]
    
    const approvedTimeOff = (timeOffRequests || []).filter(req => 
      req.staffId === sId &&
      req.status === 'Approved' &&
      dateStr >= req.startDate &&
      dateStr <= req.endDate
    )
    
    if (approvedTimeOff.length > 0) {
      return []
    }
    
    const override = schedule.dateOverrides.find(o => o.date === dateStr)
    if (override) {
      return override.isUnavailable ? [] : override.blocks
    }
    
    const dayOfWeek = DAYS_OF_WEEK[date.getDay() === 0 ? 6 : date.getDay() - 1]
    return schedule.weeklyTemplate[dayOfWeek]
  }

  const handleSubmitRequest = () => {
    if (!newRequest.startDate || !newRequest.endDate || !newRequest.reason) {
      toast.error("Please fill in all required fields")
      return
    }

    const currentStaffId = staffId || "1"
    const staffName = MOCK_STAFF.find(s => s.id === currentStaffId)?.name || "Current User"

    const request: TimeOffRequest = {
      id: Date.now().toString(),
      staffId: currentStaffId,
      staffName,
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

  const handleRevokeRequest = () => {
    if (revokeRequestId) {
      setTimeOffRequests((current) =>
        (current || []).map(req => 
          req.id === revokeRequestId ? { ...req, status: 'Cancelled' as const } : req
        )
      )
      toast.success("Time-off approval revoked")
    }
    setRevokeDialogOpen(false)
    setRevokeRequestId(null)
  }

  const handleAddBlock = () => {
    if (!editingStaffId || !editingDay) return
    
    const schedule = getStaffSchedule(editingStaffId)
    const blocks = schedule.weeklyTemplate[editingDay]
    
    const newWorkBlock: WorkBlock = {
      id: Date.now().toString(),
      startTime: newBlock.startTime,
      endTime: newBlock.endTime,
      isBreak: newBlock.isBreak
    }
    
    updateStaffSchedule(editingStaffId, {
      weeklyTemplate: {
        ...schedule.weeklyTemplate,
        [editingDay]: [...blocks, newWorkBlock]
      },
      setupComplete: true
    })
    
    toast.success(`${newBlock.isBreak ? 'Break' : 'Work'} block added`)
    setNewBlock({ startTime: '09:00', endTime: '17:00', isBreak: false })
  }

  const handleRemoveBlock = (sId: string, day: keyof WeeklyTemplate, blockId: string) => {
    const schedule = getStaffSchedule(sId)
    const blocks = schedule.weeklyTemplate[day].filter(b => b.id !== blockId)
    
    updateStaffSchedule(sId, {
      weeklyTemplate: {
        ...schedule.weeklyTemplate,
        [day]: blocks
      }
    })
    
    toast.success("Block removed")
  }

  const handleCopyLastWeek = () => {
    toast.info("Copy last week - feature coming soon")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredStaff = roleFilter === "All" 
    ? MOCK_STAFF 
    : MOCK_STAFF.filter(s => s.role === roleFilter)

  const displayStaff = staffId 
    ? MOCK_STAFF.filter(s => s.id === staffId)
    : filteredStaff

    ? (timeOffRequests || []).filter(req => req.staffId === staffId)
    : (timeOffRequests || [])

  const pendingRequests = filteredRequests.filter(req => req.status === 'Pending')
  const approvedRequests = filteredRequests.filter(req => req.status === 'Approved')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
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

        <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          {!staffId && (RoleFilter}>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                <SelectItem value="Groomer">Groomers</SelectItem>
                <SelectItem value="Bather">Bathers</SelectItem>
                <SelectItem value="Front Desk">Front Desk</SelectItem>
              </SelectContent>
            </Select>
          )}

          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLastWeek}
            >
              <Copy size={16} className="mr-2" />
              Copy Last Week
          )}
          )}
estDialogOpen}>
          <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
            <DialogTrigger asChild>-semibold">
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

                  <Label htmlFor="type">Type *</Label>
                  <Label htmlFor="type">Type *</Label>as TimeOffRequest['type'] })}>
                  <Select value={newRequest.type} onValueChange={(value) => setNewRequest({ ...newRequest, type: value as TimeOffRequest['type'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vacation">Vacation (unpaid)</SelectItem>
                      <SelectItem value="Sick">Sick Leave</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason *</Label>
                    id="reason"
                    id="reason"
                    placeholder="Brief description"
                    value={newRequest.reason}}
                    onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                </div>


                  <Label htmlFor="notes">Additional Notes</Label>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"ails"
                    placeholder="Any additional context or details"
                    rows={3}
                    value={newRequest.notes}
                    onChange={(e) => setNewRequest({ ...newRequest, notes: e.target.value })}
                </div>
              </div>
              <DialogFooter>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRequestDialogOpen(false)'Vacation', notes: '' })
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
                </Button>ter>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
order">
      <Card className="p-4 bg-card border-border">
        <div className="space-y-4">
          {displayStaff.map((staff) => {
            const schedule = getStaffSchedule(staff.id)
            
            return (b-4 last:pb-0">
              <div key={staff.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold">{staff.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {staff.role}
                    </Badge>& (
                    {!schedule.setupComplete && (t-yellow-600 border-yellow-500/30">
                      <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-500/30">
                        Needs Schedule
                      </Badge>
                    )}
                  </div>
                  {isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingStaffId(staff.id)
                        setEditingDay('monday')
                        setIsEditDialogOpen(true)
                      }}
                    >size={16} className="mr-2" />
                      <PencilSimple size={16} className="mr-2" />
                      Edit Schedule
                    </Button>
                  )}
                </div>
    <div className="grid grid-cols-7 gap-2">
                <div className="grid grid-cols-7 gap-2">
                  {weekDates.map((date, index) => {
                    const blocks = getAvailabilityForDate(staff.id, date)
                    const isToday = date.toDateString() === new Date().toDateString()
                    const hasApprovedTimeOff = (timeOffRequests || []).some(req => {
                      const dateStr = date.toISOString().split('T')[0]
                      return req.staffId === staff.id &&
                        req.status === 'Approved' &&
                        dateStr >= req.startDate &&
                        dateStr <= req.endDate
                    })
                    
                    return (ace-y-2">
                      <div key={index} className="space-y-2">
                        <div className={`text-center p-2 rounded-lg ${isToday ? 'bg-primary/20 border border-primary' : 'bg-secondary/30'}`}>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {DAY_LABELS[index].substring(0, 3)}
                          </div>sm font-bold ${isToday ? 'text-primary' : ''}`}>
                          <div className={`text-sm font-bold ${isToday ? 'text-primary' : ''}`}>
                            {date.getDate()}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          {hasApprovedTimeOff ? ( border border-red-500/30 text-center">
                            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                              <div className="text-xs font-semibold text-red-600">Time Off</div>
                            </div>
                          ) : blocks.length > 0 ? (
                            blocks.filter(b => !b.isBreak).map((block) => (
                              <div
                                key={block.id}ry/30 hover:bg-primary/20 transition-colors"
                                className="p-2 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors"
                              >nter gap-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock size={12} />span>
                                  <span>{block.startTime}-{block.endTime}</span>
                                </div>
                              </div>
                            ))
                          ) : (nded-lg bg-muted/20 text-center">
                            <div className="p-2 rounded-lg bg-muted/20 text-center">
                              <div className="text-xs text-muted-foreground">Off</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            )
          })}
        </div>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-border max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Weekly Schedule - {editingStaffId && MOCK_STAFF.find(s => s.id === editingStaffId)?.name}
            </DialogTitle>
            <DialogDescription>
              Define the repeating weekly availability. This will apply every week unless overridden.
            </DialogDescription>
          </DialogHeader>
          
          {editingStaffId && (
            <div className="space-y-4 pt-4">
              <div className="flex gap-2 border-b pb-2">
                {DAYS_OF_WEEK.map((day, idx) => (
                  <Button
                    key={day}
                    variant={editingDay === day ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditingDay(day)}
                    className={editingDay === day ? "bg-primary text-primary-foreground" : ""}
                  >
                    {DAY_LABELS[idx]}
                  </Button>
                ))}
              </div>

              {editingDay && (
                <div className="space-y-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 space-y-2">
                      <Label>Start Time</Label>
                      <Select value={newBlock.startTime} onValueChange={(value) => setNewBlock({ ...newBlock, startTime: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {TIME_SLOTS.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 space-y-2">
                      <Label>End Time</Label>
                      <Select value={newBlock.endTime} onValueChange={(value) => setNewBlock({ ...newBlock, endTime: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {TIME_SLOTS.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isBreak"
                        checked={newBlock.isBreak}
                        onChange={(e) => setNewBlock({ ...newBlock, isBreak: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="isBreak" className="cursor-pointer">Break</Label>
                    </div>

                    <Button onClick={handleAddBlock}>
                      <Plus size={16} className="mr-2" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Current Blocks</Label>
                    <div className="space-y-2">
                      {getStaffSchedule(editingStaffId).weeklyTemplate[editingDay].length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                          No blocks defined. Staff is unavailable on this day.
                        </div>
                      ) : (
                        getStaffSchedule(editingStaffId).weeklyTemplate[editingDay].map((block) => (
                          <div key={block.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                            <div className="flex items-center gap-3">
                              <Clock size={16} />
                              <span className="font-semibold">{block.startTime} - {block.endTime}</span>
                              {block.isBreak && (
                                <Badge variant="outline" className="text-xs">Break</Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveBlock(editingStaffId, editingDay, block.id)}
                            >
                              <Trash size={16} className="text-destructive" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingStaffId(null)
                setEditingDay(null)
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  {isOwner && (
                  {isOwner && (
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
                  {isOwner && (
                  {isOwner && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setRevokeRequestId(request.id)
                        setRevokeDialogOpen(true)
                      }}
                    >
                      <X size={16} className="mr-1" />
                      Revoke
                    </Button>
                  )}
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


      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Approved Time Off?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the approved time-off request and make the staff member available for scheduling again during those dates. This action is logged and the staff member will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeRequest}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Time Off
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}
