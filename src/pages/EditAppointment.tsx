import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useKV } from "@github/spark/hooks"
import { Appointment, Client, MainService, AddOn } from "@/lib/types"
import { toast } from "sonner"
import { ArrowLeft, PawPrint, CurrencyDollar } from "@phosphor-icons/react"
import { format } from "date-fns"

export function EditAppointment() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useKV<Appointment[]>("appointments", [])
  const [clients] = useKV<Client[]>("clients", [])
  const [staff] = useKV<any[]>("staff", [])
  const [mainServices] = useKV<MainService[]>("mainServices", [])
  const [addOns] = useKV<AddOn[]>("addOns", [])

  const appointment = (appointments || []).find(apt => apt.id === appointmentId)

  const [selectedClientId, setSelectedClientId] = useState(appointment?.clientId || "")
  const [selectedPetId, setSelectedPetId] = useState(appointment?.petId || "")
  const [selectedGroomerId, setSelectedGroomerId] = useState(appointment?.groomerId || "")
  const [groomerRequested, setGroomerRequested] = useState(appointment?.groomerRequested || false)
  const [appointmentDate, setAppointmentDate] = useState(appointment?.date || "")
  const [startTime, setStartTime] = useState(appointment?.startTime || "")
  const [selectedMainService, setSelectedMainService] = useState(appointment?.services.find(s => s.type === 'main')?.serviceId || "")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(
    (appointment?.services.filter(s => s.type === 'addon').map(s => s.serviceId)) || []
  )
  const [notes, setNotes] = useState(appointment?.notes || "")
  const [totalPrice, setTotalPrice] = useState(appointment?.totalPrice || 0)

  const selectedClient = clients?.find(c => c.id === selectedClientId)
  const selectedPet = selectedClient?.pets.find(p => p.id === selectedPetId)
  const groomers = staff?.filter(s => s.isGroomer) || []

  useEffect(() => {
    if (!selectedPet || !selectedMainService) {
      setTotalPrice(0)
      return
    }

    let total = 0

    const mainService = mainServices?.find(s => s.id === selectedMainService)
    if (mainService && selectedPet.weightCategory) {
      total += mainService.pricing[selectedPet.weightCategory]
    }

    selectedAddOns.forEach(addonId => {
      const addon = addOns?.find(a => a.id === addonId)
      if (addon) {
        if (addon.hasSizePricing && addon.pricing && selectedPet.weightCategory) {
          total += addon.pricing[selectedPet.weightCategory]
        } else if (addon.price) {
          total += addon.price
        }
      }
    })

    setTotalPrice(total)
  }, [selectedPet, selectedMainService, selectedAddOns, mainServices, addOns])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClientId || !selectedPetId || !selectedGroomerId || !appointmentDate || !startTime || !selectedMainService) {
      toast.error("Please fill in all required fields")
      return
    }

    const client = clients?.find(c => c.id === selectedClientId)
    const pet = client?.pets.find(p => p.id === selectedPetId)
    const groomer = groomers.find(g => g.id === selectedGroomerId)

    if (!client || !pet || !groomer) {
      toast.error("Invalid selection")
      return
    }

    const services: Appointment['services'] = []

    const mainService = mainServices?.find(s => s.id === selectedMainService)
    if (mainService && pet.weightCategory) {
      services.push({
        serviceId: mainService.id,
        serviceName: mainService.name,
        price: mainService.pricing[pet.weightCategory],
        type: 'main'
      })
    }

    selectedAddOns.forEach(addonId => {
      const addon = addOns?.find(a => a.id === addonId)
      if (addon) {
        let price = 0
        if (addon.hasSizePricing && addon.pricing && pet.weightCategory) {
          price = addon.pricing[pet.weightCategory]
        } else if (addon.price) {
          price = addon.price
        }
        services.push({
          serviceId: addon.id,
          serviceName: addon.name,
          price,
          type: 'addon'
        })
      }
    })

    const updatedAppointment: Appointment = {
      ...appointment!,
      clientId: client.id,
      clientName: client.name,
      petId: pet.id,
      petName: pet.name,
      petWeight: pet.weight,
      petWeightCategory: pet.weightCategory,
      groomerId: groomer.id,
      groomerName: groomer.name,
      groomerRequested,
      date: appointmentDate,
      startTime,
      endTime: startTime,
      services,
      totalPrice,
      notes
    }

    setAppointments((current) =>
      (current || []).map(apt => apt.id === appointmentId ? updatedAppointment : apt)
    )

    toast.success("Appointment updated successfully!")
    navigate('/appointments')
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Appointment not found</p>
            <Button onClick={() => navigate('/appointments')} className="mt-4">
              Back to Appointments
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/appointments')}
          className="mb-4 hover:bg-secondary/50"
        >
          <ArrowLeft className="mr-2" />
          Back to Appointments
        </Button>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <PawPrint size={32} className="text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Edit Appointment</h1>
              <p className="text-sm text-muted-foreground">Update appointment details</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Select value={selectedClientId} onValueChange={(value) => {
                  setSelectedClientId(value)
                  setSelectedPetId("")
                }}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pet">Pet *</Label>
                <Select value={selectedPetId} onValueChange={setSelectedPetId} disabled={!selectedClientId}>
                  <SelectTrigger id="pet">
                    <SelectValue placeholder="Select a pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedClient?.pets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id}>
                        <span className="flex items-center gap-2">
                          <PawPrint size={16} />
                          {pet.name} - {pet.weight} lbs ({pet.weightCategory})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'].map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="groomer">Groomer *</Label>
                <Select value={selectedGroomerId} onValueChange={setSelectedGroomerId}>
                  <SelectTrigger id="groomer">
                    <SelectValue placeholder="Select groomer" />
                  </SelectTrigger>
                  <SelectContent>
                    {groomers.map(groomer => (
                      <SelectItem key={groomer.id} value={groomer.id}>
                        {groomer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="requested"
                  checked={groomerRequested}
                  onCheckedChange={(checked) => setGroomerRequested(checked as boolean)}
                />
                <label
                  htmlFor="requested"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Client requested this groomer
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="mainService">Main Service *</Label>
                <Select value={selectedMainService} onValueChange={setSelectedMainService} disabled={!selectedPet}>
                  <SelectTrigger id="mainService" className="mt-2">
                    <SelectValue placeholder="Select main service" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainServices?.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{service.name}</span>
                          {selectedPet && (
                            <span className="ml-4 text-muted-foreground">
                              ${service.pricing[selectedPet.weightCategory].toFixed(2)}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Add-Ons (Optional)</Label>
                <div className="space-y-2 mt-2">
                  {addOns?.map(addon => {
                    const isSelected = selectedAddOns.includes(addon.id)
                    let price = 0
                    if (selectedPet) {
                      if (addon.hasSizePricing && addon.pricing) {
                        price = addon.pricing[selectedPet.weightCategory]
                      } else if (addon.price) {
                        price = addon.price
                      }
                    }

                    return (
                      <div key={addon.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/20 transition-colors">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={addon.id}
                            checked={isSelected}
                            disabled={!selectedPet}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAddOns([...selectedAddOns, addon.id])
                              } else {
                                setSelectedAddOns(selectedAddOns.filter(id => id !== addon.id))
                              }
                            }}
                          />
                          <label
                            htmlFor={addon.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {addon.name}
                          </label>
                        </div>
                        {selectedPet && (
                          <span className="text-sm text-muted-foreground">
                            ${price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions or notes..."
                rows={3}
              />
            </div>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CurrencyDollar size={24} className="text-primary" />
                  <span className="text-lg font-semibold">Total Price</span>
                </div>
                <div className="text-3xl font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/appointments')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
