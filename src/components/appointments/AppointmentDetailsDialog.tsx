import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Appointment } from "@/lib/types"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { format } from "date-fns"
import { PawPrint, User, Clock, CurrencyDollar } from "@phosphor-icons/react"

interface AppointmentDetailsDialogProps {
  appointment: Appointment
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppointmentDetailsDialog({ appointment, open, onOpenChange }: AppointmentDetailsDialogProps) {
  const [appointments, setAppointments] = useKV<Appointment[]>("appointments", [])

  const handleStatusChange = (newStatus: Appointment['status']) => {
    setAppointments((current) => 
      (current || []).map(apt => 
        apt.id === appointment.id ? { ...apt, status: newStatus } : apt
      )
    )
    toast.success(`Appointment ${newStatus}`)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PawPrint size={24} className="text-primary" />
            Appointment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{appointment.petName}</h3>
              <p className="text-muted-foreground">{appointment.clientName}</p>
            </div>
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Date & Time</div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="font-medium">
                  {format(new Date(appointment.date), 'MMM d, yyyy')} at {appointment.startTime}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Groomer</div>
              <div className="flex items-center gap-2">
                <User size={16} />
                <span className="font-medium">{appointment.groomerName}</span>
                {appointment.groomerRequested && (
                  <Badge variant="outline" className="text-xs">Requested</Badge>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Pet Weight</div>
              <div className="font-medium">{appointment.petWeight} lbs ({appointment.petWeightCategory})</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Price</div>
              <div className="flex items-center gap-2">
                <CurrencyDollar size={16} />
                <span className="font-bold text-primary text-xl">${appointment.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <div className="space-y-2">
              {appointment.services.map((service, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{service.serviceName}</div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {service.type}
                    </Badge>
                  </div>
                  <div className="font-semibold">${service.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {appointment.notes && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground">{appointment.notes}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="flex gap-2 flex-wrap">
            {appointment.status === 'scheduled' && (
              <Button onClick={() => handleStatusChange('checked-in')} className="flex-1">
                Check In
              </Button>
            )}
            {appointment.status === 'checked-in' && (
              <Button onClick={() => handleStatusChange('in-progress')} className="flex-1">
                Start Grooming
              </Button>
            )}
            {appointment.status === 'in-progress' && (
              <Button onClick={() => handleStatusChange('completed')} className="flex-1">
                Complete
              </Button>
            )}
            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
              <Button 
                variant="destructive" 
                onClick={() => handleStatusChange('cancelled')}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
