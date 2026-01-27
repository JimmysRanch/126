import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { Appointment, MainService, AddOn, AppointmentService, Client, Staff, getWeightCategory, getPriceForWeight } from "@/lib/types"
import { PawPrint, Receipt, User } from "@phosphor-icons/react"
import { getTodayInBusinessTimezone, getNowInBusinessTimezone } from "@/lib/date-utils"
import {
  DEFAULT_HOURS_OF_OPERATION,
  formatTimeLabel,
  getHoursForDate,
  getTimeSlotsForDate,
  HoursOfOperation,
  isTimeWithinBusinessHours
} from "@/lib/business-hours"

interface CreateAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface BusinessInfo {
  hoursOfOperation?: HoursOfOperation[]
}

export function CreateAppointmentDialog({ open, onOpenChange }: CreateAppointmentDialogProps) {
  const [appointments, setAppointments] = useKV<Appointment[]>("appointments", [])
  const [clients] = useKV<Client[]>("clients", [])
  const [staffMembers] = useKV<Staff[]>("staff", [])
  const [mainServices] = useKV<MainService[]>("main-services", [])
  const [addOns] = useKV<AddOn[]>("service-addons", [])
  const [businessInfo] = useKV<BusinessInfo>("business-info", {
    hoursOfOperation: DEFAULT_HOURS_OF_OPERATION
  })

  const [selectedClient, setSelectedClient] = useState("")
  const [selectedPet, setSelectedPet] = useState("")
  const [selectedMainService, setSelectedMainService] = useState("")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [selectedGroomer, setSelectedGroomer] = useState("auto")
  const [groomerRequested, setGroomerRequested] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("")
  const [notes, setNotes] = useState("")

  const client = (clients || []).find(c => c.id === selectedClient)
  const pet = client?.pets.find(p => p.id === selectedPet)
  const weightCategory = pet ? getWeightCategory(pet.weight) : null
  const groomers = (staffMembers || []).filter(member => member.isGroomer)
  const hoursOfOperation = businessInfo?.hoursOfOperation?.length
    ? businessInfo.hoursOfOperation
    : DEFAULT_HOURS_OF_OPERATION
  const hoursForSelectedDate = appointmentDate
    ? getHoursForDate(appointmentDate, hoursOfOperation)
    : null
  const timeSlots = appointmentDate
    ? getTimeSlotsForDate(appointmentDate, hoursOfOperation)
    : []
  const isClosedDay = Boolean(appointmentDate && (!hoursForSelectedDate || !hoursForSelectedDate.isOpen))
  const isOutsideBusinessHours = Boolean(
    appointmentDate &&
      appointmentTime &&
      !isTimeWithinBusinessHours(appointmentDate, appointmentTime, hoursOfOperation)
  )

  const calculateTotal = () => {
    let total = 0

    if (selectedMainService && weightCategory) {
      const mainService = (mainServices || []).find(s => s.id === selectedMainService)
      if (mainService) {
        total += getPriceForWeight(mainService.pricing, weightCategory)
      }
    }

    selectedAddOns.forEach(addonId => {
      const addon = (addOns || []).find(a => a.id === addonId)
      if (addon) {
        if (addon.hasSizePricing && addon.pricing && weightCategory) {
          total += getPriceForWeight(addon.pricing, weightCategory)
        } else if (addon.price) {
          total += addon.price
        }
      }
    })

    return total
  }

  const getServicesList = (): AppointmentService[] => {
    const services: AppointmentService[] = []

    if (selectedMainService && weightCategory) {
      const mainService = (mainServices || []).find(s => s.id === selectedMainService)
      if (mainService) {
        services.push({
          serviceId: mainService.id,
          serviceName: mainService.name,
          price: getPriceForWeight(mainService.pricing, weightCategory),
          type: 'main'
        })
      }
    }

    selectedAddOns.forEach(addonId => {
      const addon = (addOns || []).find(a => a.id === addonId)
      if (addon) {
        const price = addon.hasSizePricing && addon.pricing && weightCategory
          ? getPriceForWeight(addon.pricing, weightCategory)
          : (addon.price || 0)
        
        services.push({
          serviceId: addon.id,
          serviceName: addon.name,
          price,
          type: 'addon'
        })
      }
    })

    return services
  }

  const getAutoGroomer = () => {
    const groomerCounts = groomers.map(g => ({
      ...g,
      count: (appointments || []).filter(apt => apt.groomerId === g.id && apt.status !== 'cancelled').length
    }))
    
    groomerCounts.sort((a, b) => a.count - b.count)
    return groomerCounts[0]
  }

  const handleSubmit = () => {
    if (!selectedClient || !selectedPet || !selectedMainService || !appointmentDate || !appointmentTime) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!isTimeWithinBusinessHours(appointmentDate, appointmentTime, hoursOfOperation)) {
      toast.error("Selected time is outside business hours")
      return
    }

    if (groomers.length === 0) {
      toast.error("Add a groomer before scheduling appointments")
      return
    }

    const groomer = selectedGroomer === "auto" ? getAutoGroomer() : groomers.find(g => g.id === selectedGroomer)
    if (!groomer) {
      toast.error("Could not assign groomer")
      return
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      clientId: selectedClient,
      clientName: client?.name || "",
      petId: selectedPet,
      petName: pet?.name || "",
      petWeight: pet?.weight || 0,
      petWeightCategory: weightCategory || 'medium',
      groomerId: groomer.id,
      groomerName: groomer.name,
      groomerRequested: selectedGroomer !== "auto",
      date: appointmentDate,
      startTime: appointmentTime,
      endTime: "",
      services: getServicesList(),
      totalPrice: calculateTotal(),
      status: 'scheduled',
      notes,
      createdAt: getNowInBusinessTimezone()
    }

    setAppointments((current) => [...(current || []), newAppointment])
    toast.success("Appointment created successfully!")
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setSelectedClient("")
    setSelectedPet("")
    setSelectedMainService("")
    setSelectedAddOns([])
    setSelectedGroomer("auto")
    setGroomerRequested(false)
    setAppointmentDate("")
    setAppointmentTime("")
    setNotes("")
  }

  const total = calculateTotal()
  useEffect(() => {
    if (!appointmentDate || !appointmentTime) return
    if (!isTimeWithinBusinessHours(appointmentDate, appointmentTime, hoursOfOperation)) {
      setAppointmentTime("")
      toast.error("Selected time is outside business hours")
    }
  }, [appointmentDate, appointmentTime, hoursOfOperation])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PawPrint size={24} className="text-primary" />
            Create New Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Select value={selectedClient} onValueChange={(value) => {
                  setSelectedClient(value)
                  setSelectedPet("")
                }}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {(clients || []).map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pet">Pet *</Label>
                <Select value={selectedPet} onValueChange={setSelectedPet} disabled={!selectedClient}>
                  <SelectTrigger id="pet">
                    <SelectValue placeholder="Select pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {client?.pets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} ({pet.weight} lbs)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {pet && (
              <Card className="p-3 bg-muted/50">
                <div className="flex items-center gap-2 text-sm">
                  <PawPrint size={16} />
                  <span className="font-medium">{pet.name}</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{pet.breed}</span>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="secondary">{pet.weight} lbs ({weightCategory})</Badge>
                </div>
              </Card>
            )}

            <Separator />

            <div className="space-y-3">
              <Label>Main Service *</Label>
              <div className="space-y-2">
                {(mainServices || []).map(service => {
                  const price = weightCategory ? getPriceForWeight(service.pricing, weightCategory) : 0
                  return (
                    <button
                      key={service.id}
                      disabled={!pet}
                      onClick={() => setSelectedMainService(service.id)}
                      className={`w-full text-left p-4 border rounded-lg transition-all ${
                        selectedMainService === service.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      } ${!pet ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="font-semibold">{service.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">{service.description}</div>
                        </div>
                        {pet && (
                          <div className="text-lg font-bold text-primary">${price}</div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Add-Ons (Optional)</Label>
              <div className="space-y-2">
                {(addOns || []).map(addon => {
                  const isSelected = selectedAddOns.includes(addon.id)
                  const price = addon.hasSizePricing && addon.pricing && weightCategory
                    ? getPriceForWeight(addon.pricing, weightCategory)
                    : (addon.price || 0)

                  return (
                    <button
                      key={addon.id}
                      disabled={!pet}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedAddOns(selectedAddOns.filter(id => id !== addon.id))
                        } else {
                          setSelectedAddOns([...selectedAddOns, addon.id])
                        }
                      }}
                      className={`w-full text-left p-3 border rounded-lg transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      } ${!pet ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Checkbox checked={isSelected} disabled={!pet} />
                          <span className="font-medium">{addon.name}</span>
                        </div>
                        {pet && (
                          <div className="font-semibold text-primary">${price}</div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={getTodayInBusinessTimezone()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Select
                  value={appointmentTime}
                  onValueChange={setAppointmentTime}
                  disabled={!appointmentDate || isClosedDay}
                >
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {!appointmentDate && (
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        Select a date to see available times.
                      </div>
                    )}
                    {appointmentDate && timeSlots.length === 0 && (
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        No open hours for the selected date.
                      </div>
                    )}
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {appointmentDate && hoursForSelectedDate?.isOpen && (
                  <p className="text-xs text-muted-foreground">
                    Open {formatTimeLabel(hoursForSelectedDate.openTime)} - {formatTimeLabel(hoursForSelectedDate.closeTime)}.
                  </p>
                )}
                {isClosedDay && (
                  <p className="text-xs text-destructive">Selected date is outside business hours.</p>
                )}
                {isOutsideBusinessHours && (
                  <p className="text-xs text-destructive">Selected time is outside business hours.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groomer">Groomer</Label>
              <Select value={selectedGroomer} onValueChange={setSelectedGroomer}>
                <SelectTrigger id="groomer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-Assign (Balance Workload)</SelectItem>
                  {groomers.length === 0 && (
                    <SelectItem value="none" disabled>
                      No groomers available
                    </SelectItem>
                  )}
                  {groomers.map(groomer => (
                    <SelectItem key={groomer.id} value={groomer.id}>
                      {groomer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedGroomer !== "auto" && (
                <p className="text-xs text-muted-foreground">Client requested this specific groomer</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions or notes..."
                rows={3}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <Receipt size={20} className="text-primary" />
                <h3 className="font-semibold">Summary</h3>
              </div>

              <div className="space-y-3">
                {pet && (
                  <div className="pb-3 border-b border-border">
                    <div className="text-sm text-muted-foreground mb-1">Pet</div>
                    <div className="font-medium">{pet.name}</div>
                    <div className="text-xs text-muted-foreground">{pet.weight} lbs ({weightCategory})</div>
                  </div>
                )}

                {selectedMainService && weightCategory && (
                  <div className="pb-3 border-b border-border">
                    <div className="text-sm text-muted-foreground mb-2">Main Service</div>
                    {(() => {
                      const service = (mainServices || []).find(s => s.id === selectedMainService)
                      const price = service ? getPriceForWeight(service.pricing, weightCategory) : 0
                      return (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{service?.name}</span>
                          <span className="font-semibold">${price.toFixed(2)}</span>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {selectedAddOns.length > 0 && weightCategory && (
                  <div className="pb-3 border-b border-border">
                    <div className="text-sm text-muted-foreground mb-2">Add-Ons</div>
                    <div className="space-y-2">
                      {selectedAddOns.map(addonId => {
                        const addon = (addOns || []).find(a => a.id === addonId)
                        const price = addon?.hasSizePricing && addon.pricing
                          ? getPriceForWeight(addon.pricing, weightCategory)
                          : (addon?.price || 0)
                        return (
                          <div key={addonId} className="flex items-center justify-between text-sm">
                            <span>{addon?.name}</span>
                            <span className="font-semibold">${price.toFixed(2)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary text-2xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                {appointmentDate && appointmentTime && (
                  <div className="pt-3 border-t border-border text-sm">
                    <div className="text-muted-foreground mb-1">Scheduled For</div>
                    <div className="font-medium">{appointmentDate}</div>
                    <div className="font-medium">{appointmentTime}</div>
                  </div>
                )}

                {selectedGroomer !== "auto" && (
                  <div className="pt-3 border-t border-border text-sm">
                    <div className="text-muted-foreground mb-1">Groomer</div>
                    <div className="font-medium">
                      {groomers.find(g => g.id === selectedGroomer)?.name}
                    </div>
                    <Badge variant="secondary" className="text-xs mt-1">Client Requested</Badge>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleSubmit} 
                className="w-full mt-6"
                disabled={
                  !selectedClient ||
                  !selectedPet ||
                  !selectedMainService ||
                  !appointmentDate ||
                  !appointmentTime ||
                  isClosedDay ||
                  isOutsideBusinessHours
                }
              >
                Create Appointment
              </Button>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
