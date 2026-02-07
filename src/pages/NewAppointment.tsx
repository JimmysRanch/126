import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { Appointment, MainService, AddOn, AppointmentService, Client, Staff, getWeightCategory, getPriceForWeight } from "@/lib/types"
import { PawPrint, Receipt, ArrowLeft, Plus, Upload, X, Check, CaretUpDown } from "@phosphor-icons/react"
import { getTodayInBusinessTimezone, getNowInBusinessTimezone } from "@/lib/date-utils"
import {
  DEFAULT_HOURS_OF_OPERATION,
  formatTimeLabel,
  getHoursForDate,
  getTimeSlotsForDate,
  HoursOfOperation,
  isTimeWithinBusinessHours
} from "@/lib/business-hours"

interface BusinessInfo {
  hoursOfOperation?: HoursOfOperation[]
}

export function NewAppointment() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preSelectedClientId = searchParams.get('clientId')
  
  const [appointments, setAppointments] = useKV<Appointment[]>("appointments", [])
  const [clients] = useKV<Client[]>("clients", [])
  const [staffMembers] = useKV<Staff[]>("staff", [])
  const [mainServices] = useKV<MainService[]>("main-services", [])
  const [addOns] = useKV<AddOn[]>("service-addons", [])
  const [businessInfo] = useKV<BusinessInfo>("business-info", {
    hoursOfOperation: DEFAULT_HOURS_OF_OPERATION
  })

  const [selectedClient, setSelectedClient] = useState(preSelectedClientId || "")
  const [selectedPets, setSelectedPets] = useState<string[]>([])
  const [selectedMainService, setSelectedMainService] = useState("")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [selectedGroomer, setSelectedGroomer] = useState("auto")
  const [groomerRequested, setGroomerRequested] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("")
  const [notes, setNotes] = useState("")

  const [overallLength, setOverallLength] = useState("")
  const [faceStyle, setFaceStyle] = useState("")
  const [skipEarTrim, setSkipEarTrim] = useState(false)
  const [skipTailTrim, setSkipTailTrim] = useState(false)
  const [groomingNotes, setGroomingNotes] = useState("")
  const [photoWant, setPhotoWant] = useState<File | null>(null)
  const [photoDontWant, setPhotoDontWant] = useState<File | null>(null)
  const [styleConfirmed, setStyleConfirmed] = useState(false)
  
  const [openClientCombobox, setOpenClientCombobox] = useState(false)
  const [clientSearch, setClientSearch] = useState("")

  const client = (clients || []).find(c => c.id === selectedClient)
  const selectedPetsData = client?.pets.filter(p => selectedPets.includes(p.id)) || []
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
  
  const togglePet = (petId: string) => {
    if (selectedPets.includes(petId)) {
      setSelectedPets(selectedPets.filter(id => id !== petId))
    } else {
      setSelectedPets([...selectedPets, petId])
    }
  }

  const calculateTotal = () => {
    let total = 0

    selectedPetsData.forEach(pet => {
      const weightCategory = getWeightCategory(pet.weight)
      
      if (selectedMainService) {
        const mainService = (mainServices || []).find(s => s.id === selectedMainService)
        if (mainService) {
          total += getPriceForWeight(mainService.pricing, weightCategory)
        }
      }

      selectedAddOns.forEach(addonId => {
        const addon = (addOns || []).find(a => a.id === addonId)
        if (addon) {
          if (addon.hasSizePricing && addon.pricing) {
            total += getPriceForWeight(addon.pricing, weightCategory)
          } else if (addon.price) {
            total += addon.price
          }
        }
      })
    })

    return total
  }

  const getServicesList = (pet: { weight: number }): AppointmentService[] => {
    const services: AppointmentService[] = []
    const weightCategory = getWeightCategory(pet.weight)

    if (selectedMainService) {
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
        const price = addon.hasSizePricing && addon.pricing
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
    if (!selectedClient || selectedPets.length === 0 || !selectedMainService || !appointmentDate || !appointmentTime) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!styleConfirmed) {
      toast.error("Please confirm the style summary")
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

    const groomingPreferences = {
      overallLength,
      faceStyle,
      skipEarTrim,
      skipTailTrim,
      groomingNotes,
      photoWant: photoWant?.name || null,
      photoDontWant: photoDontWant?.name || null
    }

    const newAppointments: Appointment[] = selectedPetsData.map(pet => {
      const weightCategory = getWeightCategory(pet.weight)
      
      return {
        id: Date.now().toString() + "-" + pet.id,
        clientId: selectedClient,
        clientName: client?.name || "",
        petId: pet.id,
        petName: pet.name,
        petWeight: pet.weight,
        petWeightCategory: weightCategory,
        groomerId: groomer.id,
        groomerName: groomer.name,
        groomerRequested: selectedGroomer !== "auto",
        date: appointmentDate,
        startTime: appointmentTime,
        endTime: "",
        services: getServicesList(pet),
        totalPrice: (() => {
          let total = 0
          if (selectedMainService) {
            const mainService = (mainServices || []).find(s => s.id === selectedMainService)
            if (mainService) {
              total += getPriceForWeight(mainService.pricing, weightCategory)
            }
          }
          selectedAddOns.forEach(addonId => {
            const addon = (addOns || []).find(a => a.id === addonId)
            if (addon) {
              if (addon.hasSizePricing && addon.pricing) {
                total += getPriceForWeight(addon.pricing, weightCategory)
              } else if (addon.price) {
                total += addon.price
              }
            }
          })
          return total
        })(),
        status: 'scheduled',
        notes,
        groomingPreferences,
        createdAt: getNowInBusinessTimezone()
      }
    })

    setAppointments((current) => [...(current || []), ...newAppointments])
    toast.success(`${newAppointments.length} appointment${newAppointments.length > 1 ? 's' : ''} created successfully!`)
    navigate('/appointments')
  }

  const total = calculateTotal()

  const getStyleSummary = () => {
    const parts: string[] = []
    if (overallLength && overallLength !== "Breed standard") {
      parts.push(overallLength.toLowerCase() + " body")
    }
    if (faceStyle && faceStyle !== "Breed standard") {
      parts.push(faceStyle.toLowerCase() + " face")
    }
    if (parts.length === 0) return "Breed standard styling"
    return parts.join(", ").charAt(0).toUpperCase() + parts.join(", ").slice(1) + "."
  }

  useEffect(() => {
    if (!appointmentDate || !appointmentTime) return
    if (!isTimeWithinBusinessHours(appointmentDate, appointmentTime, hoursOfOperation)) {
      setAppointmentTime("")
      toast.error("Selected time is outside business hours")
    }
  }, [appointmentDate, appointmentTime, hoursOfOperation])

  // Auto-fill grooming preferences when a pet is selected
  useEffect(() => {
    if (selectedPetsData.length === 1) {
      const pet = selectedPetsData[0]
      // Auto-fill from pet's saved preferences
      if (pet.overallLength) setOverallLength(pet.overallLength)
      if (pet.faceStyle) setFaceStyle(pet.faceStyle)
      if (pet.skipEarTrim !== undefined) setSkipEarTrim(pet.skipEarTrim)
      if (pet.skipTailTrim !== undefined) setSkipTailTrim(pet.skipTailTrim)
      if (pet.groomingNotes) setGroomingNotes(pet.groomingNotes)
    } else if (selectedPetsData.length === 0) {
      // Reset to defaults when no pet is selected
      setOverallLength("")
      setFaceStyle("")
      setSkipEarTrim(false)
      setSkipTailTrim(false)
      setGroomingNotes("")
    }
  }, [selectedPetsData])

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate('/appointments')} className="mb-2">
          <ArrowLeft className="mr-2" />
          Back to Appointments
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Create New Appointment
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <Card className="p-4">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="client" className="text-sm">Client *</Label>
                <Popover open={openClientCombobox} onOpenChange={setOpenClientCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openClientCombobox}
                      className="w-full justify-between h-9 font-normal"
                    >
                      {selectedClient
                        ? (clients || []).find(c => c.id === selectedClient)?.name
                        : "Search or select client..."}
                      <CaretUpDown className="ml-2 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search clients..." />
                      <CommandList>
                        <CommandEmpty>No client found.</CommandEmpty>
                        <CommandGroup>
                          {(clients || []).map((client) => (
                            <CommandItem
                              key={client.id}
                              value={client.name}
                              onSelect={() => {
                                setSelectedClient(client.id)
                                setSelectedPets([])
                                setOpenClientCombobox(false)
                              }}
                            >
                              <Check
                                className={selectedClient === client.id ? "opacity-100" : "opacity-0"}
                              />
                              {client.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {client && client.pets.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-sm">Select Pet(s) *</Label>
                  <div className="flex flex-wrap gap-2">
                    {client.pets.map(pet => (
                      <button
                        key={pet.id}
                        onClick={() => togglePet(pet.id)}
                        className={`px-3 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                          selectedPets.includes(pet.id)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        <PawPrint size={16} />
                        <span className="font-medium text-sm">{pet.name}</span>
                        <span className="text-xs opacity-75">({pet.weight} lbs)</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/clients/new')}
              className="w-full mt-3"
            >
              <Plus className="mr-2" size={16} />
              Create New Client
            </Button>
          </Card>

          <Card className="p-4">
            <h2 className="text-base font-semibold mb-3">Schedule & Details</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-sm">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={getTodayInBusinessTimezone()}
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="time" className="text-sm">Time *</Label>
                <Select
                  value={appointmentTime}
                  onValueChange={setAppointmentTime}
                  disabled={!appointmentDate || isClosedDay}
                >
                  <SelectTrigger id="time" className="h-9">
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

            <div className="space-y-1.5 mb-3">
              <Label htmlFor="groomer" className="text-sm">Groomer</Label>
              <Select value={selectedGroomer} onValueChange={setSelectedGroomer}>
                <SelectTrigger id="groomer" className="h-9">
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

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-sm">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions or notes..."
                rows={2}
                className="text-sm"
              />
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-base font-semibold mb-3">Main Service *</h2>
            <div className="space-y-1.5">
              {(mainServices || []).map(service => {
                const displayPrice = selectedPetsData.length > 0 
                  ? selectedPetsData.reduce((sum, pet) => {
                      const weightCategory = getWeightCategory(pet.weight)
                      return sum + getPriceForWeight(service.pricing, weightCategory)
                    }, 0)
                  : 0
                return (
                  <button
                    key={service.id}
                    disabled={selectedPets.length === 0}
                    onClick={() => setSelectedMainService(service.id)}
                    className={`w-full text-left p-2.5 border rounded-lg transition-all ${
                      selectedMainService === service.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    } ${selectedPets.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{service.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{service.description}</div>
                      </div>
                      {selectedPets.length > 0 && (
                        <div className="text-base font-bold text-primary">
                          ${displayPrice.toFixed(2)}
                          {selectedPets.length > 1 && <span className="text-xs ml-1">({selectedPets.length} pets)</span>}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-base font-semibold mb-3">Add-Ons (Optional)</h2>
            <div className="space-y-1.5">
              {(addOns || []).map(addon => {
                const isSelected = selectedAddOns.includes(addon.id)
                const displayPrice = selectedPetsData.length > 0 
                  ? selectedPetsData.reduce((sum, pet) => {
                      const weightCategory = getWeightCategory(pet.weight)
                      const price = addon.hasSizePricing && addon.pricing
                        ? getPriceForWeight(addon.pricing, weightCategory)
                        : (addon.price || 0)
                      return sum + price
                    }, 0)
                  : 0

                return (
                  <button
                    key={addon.id}
                    disabled={selectedPets.length === 0}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAddOns(selectedAddOns.filter(id => id !== addon.id))
                      } else {
                        setSelectedAddOns([...selectedAddOns, addon.id])
                      }
                    }}
                    className={`w-full text-left p-2 border rounded-lg transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    } ${selectedPets.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={isSelected} disabled={selectedPets.length === 0} className="h-4 w-4" />
                        <span className="font-medium text-sm">{addon.name}</span>
                      </div>
                      {selectedPets.length > 0 && (
                        <div className="font-semibold text-sm text-primary">
                          ${displayPrice.toFixed(2)}
                          {selectedPets.length > 1 && <span className="text-xs ml-1">({selectedPets.length} pets)</span>}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-base font-semibold mb-3">Grooming Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Overall length</Label>
                <RadioGroup value={overallLength} onValueChange={setOverallLength}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Short & neat", "Medium & neat", "Long & fluffy", "Breed standard"].map((option) => (
                      <div key={option} className="flex items-center space-x-1.5">
                        <RadioGroupItem value={option} id={`length-${option}`} />
                        <Label htmlFor={`length-${option}`} className="text-sm font-normal cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-2 block">Face style</Label>
                <RadioGroup value={faceStyle} onValueChange={setFaceStyle}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Short & neat", "Round / Teddy", "Beard / Mustache", "Breed Standard"].map((option) => (
                      <div key={option} className="flex items-center space-x-1.5">
                        <RadioGroupItem value={option} id={`face-${option}`} />
                        <Label htmlFor={`face-${option}`} className="text-sm font-normal cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-2 block">Trim preferences</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="flex items-center space-x-1.5">
                    <Checkbox
                      id="skip-ear-trim"
                      checked={skipEarTrim}
                      onCheckedChange={(checked) => setSkipEarTrim(checked as boolean)}
                    />
                    <Label htmlFor="skip-ear-trim" className="text-sm font-normal cursor-pointer">
                      Skip Ear Trim
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Checkbox
                      id="skip-tail-trim"
                      checked={skipTailTrim}
                      onCheckedChange={(checked) => setSkipTailTrim(checked as boolean)}
                    />
                    <Label htmlFor="skip-tail-trim" className="text-sm font-normal cursor-pointer">
                      Skip Tail Trim
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="grooming-notes" className="text-sm font-medium mb-2 block">Additional notes</Label>
                <Textarea
                  id="grooming-notes"
                  value={groomingNotes}
                  onChange={(e) => setGroomingNotes(e.target.value)}
                  placeholder="Any special grooming instructions..."
                  rows={2}
                  className="text-sm"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Photo I Want</Label>
                  {photoWant ? (
                    <div className="border border-border rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground truncate">{photoWant.name}</span>
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPhotoWant(null)}
                            className="h-6 w-6 p-0 ml-2"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="border border-dashed border-border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Upload size={20} className="text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Upload photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && setPhotoWant(e.target.files[0])}
                      />
                    </label>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Photo I Don't Want</Label>
                  {photoDontWant ? (
                    <div className="border border-border rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground truncate">{photoDontWant.name}</span>
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPhotoDontWant(null)}
                            className="h-6 w-6 p-0 ml-2"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="border border-dashed border-border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Upload size={20} className="text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Upload photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && setPhotoDontWant(e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-2 block">Confirmation</Label>
                <Card className="p-3 bg-muted/30 mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Style summary:</p>
                  <p className="text-sm font-medium">{getStyleSummary()}</p>
                </Card>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="style-confirmation"
                    checked={styleConfirmed}
                    onCheckedChange={(checked) => setStyleConfirmed(checked as boolean)}
                  />
                  <Label htmlFor="style-confirmation" className="text-sm font-normal cursor-pointer">
                    This matches what I want
                  </Label>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-[72px] md:top-[68px]">
            <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Receipt size={18} className="text-primary" />
              <h3 className="font-semibold text-base">Summary</h3>
            </div>

            <div className="space-y-2">
              {selectedPetsData.length > 0 && (
                <div className="pb-2 border-b border-border">
                  <div className="text-xs text-muted-foreground mb-1">Pet{selectedPetsData.length > 1 ? 's' : ''}</div>
                  <div className="space-y-1">
                    {selectedPetsData.map(pet => (
                      <div key={pet.id} className="font-medium text-sm flex items-center gap-1">
                        <PawPrint size={12} />
                        {pet.name}
                        <span className="text-xs text-muted-foreground ml-1">({pet.weight} lbs)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMainService && selectedPetsData.length > 0 && (
                <div className="pb-2 border-b border-border">
                  <div className="text-xs text-muted-foreground mb-1.5">Main Service</div>
                  {(() => {
                    const service = (mainServices || []).find(s => s.id === selectedMainService)
                    const totalPrice = selectedPetsData.reduce((sum, pet) => {
                      const weightCategory = getWeightCategory(pet.weight)
                      return sum + (service ? getPriceForWeight(service.pricing, weightCategory) : 0)
                    }, 0)
                    return (
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{service?.name}</span>
                        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                      </div>
                    )
                  })()}
                </div>
              )}

              {selectedAddOns.length > 0 && selectedPetsData.length > 0 && (
                <div className="pb-2 border-b border-border">
                  <div className="text-xs text-muted-foreground mb-1.5">Add-Ons</div>
                  <div className="space-y-1">
                    {selectedAddOns.map(addonId => {
                      const addon = (addOns || []).find(a => a.id === addonId)
                      const totalPrice = selectedPetsData.reduce((sum, pet) => {
                        const weightCategory = getWeightCategory(pet.weight)
                        const price = addon?.hasSizePricing && addon.pricing
                          ? getPriceForWeight(addon.pricing, weightCategory)
                          : (addon?.price || 0)
                        return sum + price
                      }, 0)
                      return (
                        <div key={addonId} className="flex items-center justify-between text-xs">
                          <span>{addon?.name}</span>
                          <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="pt-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base">Total</span>
                  <span className="font-bold text-primary text-xl">${total.toFixed(2)}</span>
                </div>
                {selectedPets.length > 1 && (
                  <div className="text-xs text-muted-foreground mt-1">For {selectedPets.length} pets</div>
                )}
              </div>

              {appointmentDate && appointmentTime && (
                <div className="pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-1">Scheduled For</div>
                  <div className="font-medium text-sm">{appointmentDate}</div>
                  <div className="font-medium text-sm">{appointmentTime}</div>
                </div>
              )}

              {selectedGroomer !== "auto" && (
                <div className="pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-1">Groomer</div>
                  <div className="font-medium text-sm">
                    {groomers.find(g => g.id === selectedGroomer)?.name}
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1">Client Requested</Badge>
                </div>
              )}
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full mt-4 h-9"
              disabled={
                !selectedClient ||
                selectedPets.length === 0 ||
                !selectedMainService ||
                !appointmentDate ||
                !appointmentTime ||
                !styleConfirmed ||
                isClosedDay ||
                isOutsideBusinessHours
              }
            >
              Create Appointment{selectedPets.length > 1 ? 's' : ''}
            </Button>
          </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
