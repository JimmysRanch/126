import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash, PencilSimple, CaretUp, CaretDown } from "@phosphor-icons/react"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ServicePricing {
  small: number
  medium: number
  large: number
  giant: number
}

interface MainService {
  id: string
  name: string
  description: string
  pricing: ServicePricing
}

interface AddOn {
  id: string
  name: string
  price?: number
  pricing?: ServicePricing
  hasSizePricing: boolean
}

const DEFAULT_MAIN_SERVICES: MainService[] = [
  {
    id: "fresh-bath",
    name: "Fresh Bath",
    description: "Includes Shampoo, Blow Out, Brush Out, Ear Cleaning, Nail Trim",
    pricing: { small: 45, medium: 55, large: 65, giant: 75 }
  },
  {
    id: "trim-up",
    name: "Trim Up",
    description: "Bath + Trim Up: Round Out Paws, Neaten Face, Sanitary Trim",
    pricing: { small: 50, medium: 60, large: 70, giant: 80 }
  },
  {
    id: "deluxe-groom",
    name: "Deluxe Groom",
    description: "Bath + Trim Up + Custom Haircut",
    pricing: { small: 70, medium: 80, large: 90, giant: 100 }
  }
]

const DEFAULT_ADDONS: AddOn[] = [
  { id: "conditioning", name: "Conditioning Treatment with Massage", price: 20, hasSizePricing: false },
  { id: "paw-pad", name: "Paw Pad Cream", price: 10, hasSizePricing: false },
  { id: "teeth", name: "Teeth Brushing", price: 20, hasSizePricing: false },
  { id: "blueberry", name: "Blueberry Facial", price: 20, hasSizePricing: false },
  { id: "nail-trim", name: "Nail Trim", price: 15, hasSizePricing: false },
  { id: "deshedding", name: "Deshedding", pricing: { small: 20, medium: 25, large: 30, giant: 40 }, hasSizePricing: true }
]

const DEFAULT_PAYMENT_METHODS = [
  { id: "cash", name: "Cash", enabled: true },
  { id: "credit", name: "Credit Card", enabled: true },
  { id: "debit", name: "Debit Card", enabled: true },
  { id: "check", name: "Check", enabled: true }
]

export function Settings() {
  const [activeTab, setActiveTab] = useState("staff")
  const [staffPositions, setStaffPositions] = useKV<string[]>("staff-positions", ["Owner", "Groomer", "Front Desk", "Bather"])
  const [newPosition, setNewPosition] = useState("")
  const [editingPosition, setEditingPosition] = useState<string | null>(null)
  const [editPositionValue, setEditPositionValue] = useState("")
  
  const [mainServices, setMainServices] = useKV<MainService[]>("main-services", DEFAULT_MAIN_SERVICES)
  const [addOns, setAddOns] = useKV<AddOn[]>("service-addons", DEFAULT_ADDONS)
  
  const [paymentMethods, setPaymentMethods] = useKV<Array<{ id: string; name: string; enabled: boolean }>>("payment-methods", DEFAULT_PAYMENT_METHODS)
  const [newPaymentMethod, setNewPaymentMethod] = useState("")
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<{ id: string; name: string } | null>(null)
  const [editPaymentMethodValue, setEditPaymentMethodValue] = useState("")
  
  const [mainServiceDialogOpen, setMainServiceDialogOpen] = useState(false)
  const [addOnDialogOpen, setAddOnDialogOpen] = useState(false)
  const [editingMainService, setEditingMainService] = useState<MainService | null>(null)
  const [editingAddOn, setEditingAddOn] = useState<AddOn | null>(null)
  
  const [mainServiceForm, setMainServiceForm] = useState({
    name: "",
    description: "",
    smallPrice: "",
    mediumPrice: "",
    largePrice: "",
    giantPrice: ""
  })
  
  const [addOnForm, setAddOnForm] = useState({
    name: "",
    hasSizePricing: "false",
    price: "",
    smallPrice: "",
    mediumPrice: "",
    largePrice: "",
    giantPrice: ""
  })

  const handleAddPosition = () => {
    if (!newPosition.trim()) {
      toast.error("Position name cannot be empty")
      return
    }

    if ((staffPositions || []).includes(newPosition.trim())) {
      toast.error("This position already exists")
      return
    }

    setStaffPositions((current) => [...(current || []), newPosition.trim()])
    setNewPosition("")
    toast.success("Position added successfully")
  }

  const handleDeletePosition = (position: string) => {
    setStaffPositions((current) => (current || []).filter(p => p !== position))
    toast.success("Position removed successfully")
  }

  const handleEditPosition = (position: string) => {
    setEditingPosition(position)
    setEditPositionValue(position)
  }

  const handleSaveEditPosition = () => {
    if (!editPositionValue.trim()) {
      toast.error("Position name cannot be empty")
      return
    }

    if (editingPosition && editPositionValue.trim() !== editingPosition) {
      if ((staffPositions || []).includes(editPositionValue.trim())) {
        toast.error("This position already exists")
        return
      }
    }

    setStaffPositions((current) => 
      (current || []).map(p => p === editingPosition ? editPositionValue.trim() : p)
    )
    setEditingPosition(null)
    setEditPositionValue("")
    toast.success("Position updated successfully")
  }

  const handleCancelEditPosition = () => {
    setEditingPosition(null)
    setEditPositionValue("")
  }
  
  const openMainServiceDialog = (service?: MainService) => {
    if (service) {
      setEditingMainService(service)
      setMainServiceForm({
        name: service.name,
        description: service.description,
        smallPrice: service.pricing.small.toString(),
        mediumPrice: service.pricing.medium.toString(),
        largePrice: service.pricing.large.toString(),
        giantPrice: service.pricing.giant.toString()
      })
    } else {
      setEditingMainService(null)
      setMainServiceForm({
        name: "",
        description: "",
        smallPrice: "",
        mediumPrice: "",
        largePrice: "",
        giantPrice: ""
      })
    }
    setMainServiceDialogOpen(true)
  }
  
  const openAddOnDialog = (addOn?: AddOn) => {
    if (addOn) {
      setEditingAddOn(addOn)
      setAddOnForm({
        name: addOn.name,
        hasSizePricing: addOn.hasSizePricing ? "true" : "false",
        price: addOn.price?.toString() || "",
        smallPrice: addOn.pricing?.small.toString() || "",
        mediumPrice: addOn.pricing?.medium.toString() || "",
        largePrice: addOn.pricing?.large.toString() || "",
        giantPrice: addOn.pricing?.giant.toString() || ""
      })
    } else {
      setEditingAddOn(null)
      setAddOnForm({
        name: "",
        hasSizePricing: "false",
        price: "",
        smallPrice: "",
        mediumPrice: "",
        largePrice: "",
        giantPrice: ""
      })
    }
    setAddOnDialogOpen(true)
  }
  
  const handleSaveMainService = () => {
    if (!mainServiceForm.name.trim()) {
      toast.error("Service name is required")
      return
    }
    
    const smallPrice = parseFloat(mainServiceForm.smallPrice)
    const mediumPrice = parseFloat(mainServiceForm.mediumPrice)
    const largePrice = parseFloat(mainServiceForm.largePrice)
    const giantPrice = parseFloat(mainServiceForm.giantPrice)
    
    if (isNaN(smallPrice) || isNaN(mediumPrice) || isNaN(largePrice) || isNaN(giantPrice)) {
      toast.error("All prices must be valid numbers")
      return
    }
    
    const newService: MainService = {
      id: editingMainService?.id || `service-${Date.now()}`,
      name: mainServiceForm.name.trim(),
      description: mainServiceForm.description.trim(),
      pricing: {
        small: smallPrice,
        medium: mediumPrice,
        large: largePrice,
        giant: giantPrice
      }
    }
    
    if (editingMainService) {
      setMainServices((current) => 
        (current || []).map(s => s.id === editingMainService.id ? newService : s)
      )
      toast.success("Service updated successfully")
    } else {
      setMainServices((current) => [...(current || []), newService])
      toast.success("Service added successfully")
    }
    
    setMainServiceDialogOpen(false)
  }
  
  const handleSaveAddOn = () => {
    if (!addOnForm.name.trim()) {
      toast.error("Add-on name is required")
      return
    }
    
    const hasSizePricing = addOnForm.hasSizePricing === "true"
    
    if (hasSizePricing) {
      const smallPrice = parseFloat(addOnForm.smallPrice)
      const mediumPrice = parseFloat(addOnForm.mediumPrice)
      const largePrice = parseFloat(addOnForm.largePrice)
      const giantPrice = parseFloat(addOnForm.giantPrice)
      
      if (isNaN(smallPrice) || isNaN(mediumPrice) || isNaN(largePrice) || isNaN(giantPrice)) {
        toast.error("All prices must be valid numbers")
        return
      }
      
      const newAddOn: AddOn = {
        id: editingAddOn?.id || `addon-${Date.now()}`,
        name: addOnForm.name.trim(),
        hasSizePricing: true,
        pricing: {
          small: smallPrice,
          medium: mediumPrice,
          large: largePrice,
          giant: giantPrice
        }
      }
      
      if (editingAddOn) {
        setAddOns((current) => 
          (current || []).map(a => a.id === editingAddOn.id ? newAddOn : a)
        )
        toast.success("Add-on updated successfully")
      } else {
        setAddOns((current) => [...(current || []), newAddOn])
        toast.success("Add-on added successfully")
      }
    } else {
      const price = parseFloat(addOnForm.price)
      
      if (isNaN(price)) {
        toast.error("Price must be a valid number")
        return
      }
      
      const newAddOn: AddOn = {
        id: editingAddOn?.id || `addon-${Date.now()}`,
        name: addOnForm.name.trim(),
        hasSizePricing: false,
        price
      }
      
      if (editingAddOn) {
        setAddOns((current) => 
          (current || []).map(a => a.id === editingAddOn.id ? newAddOn : a)
        )
        toast.success("Add-on updated successfully")
      } else {
        setAddOns((current) => [...(current || []), newAddOn])
        toast.success("Add-on added successfully")
      }
    }
    
    setAddOnDialogOpen(false)
  }
  
  const handleDeleteMainService = (id: string) => {
    setMainServices((current) => (current || []).filter(s => s.id !== id))
    toast.success("Service deleted successfully")
  }
  
  const handleDeleteAddOn = (id: string) => {
    setAddOns((current) => (current || []).filter(a => a.id !== id))
    toast.success("Add-on deleted successfully")
  }
  
  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.trim()) {
      toast.error("Payment method name cannot be empty")
      return
    }

    if ((paymentMethods || []).some(pm => pm.name.toLowerCase() === newPaymentMethod.trim().toLowerCase())) {
      toast.error("This payment method already exists")
      return
    }

    setPaymentMethods((current) => [
      ...(current || []), 
      { id: `pm-${Date.now()}`, name: newPaymentMethod.trim(), enabled: true }
    ])
    setNewPaymentMethod("")
    toast.success("Payment method added successfully")
  }

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods((current) => (current || []).filter(pm => pm.id !== id))
    toast.success("Payment method removed successfully")
  }

  const handleTogglePaymentMethod = (id: string) => {
    setPaymentMethods((current) =>
      (current || []).map(pm => pm.id === id ? { ...pm, enabled: !pm.enabled } : pm)
    )
  }

  const handleEditPaymentMethod = (method: { id: string; name: string }) => {
    setEditingPaymentMethod(method)
    setEditPaymentMethodValue(method.name)
  }

  const handleSaveEditPaymentMethod = () => {
    if (!editPaymentMethodValue.trim()) {
      toast.error("Payment method name cannot be empty")
      return
    }

    if (editingPaymentMethod && editPaymentMethodValue.trim() !== editingPaymentMethod.name) {
      if ((paymentMethods || []).some(pm => pm.name.toLowerCase() === editPaymentMethodValue.trim().toLowerCase())) {
        toast.error("This payment method already exists")
        return
      }
    }

    setPaymentMethods((current) =>
      (current || []).map(pm => pm.id === editingPaymentMethod?.id ? { ...pm, name: editPaymentMethodValue.trim() } : pm)
    )
    setEditingPaymentMethod(null)
    setEditPaymentMethodValue("")
    toast.success("Payment method updated successfully")
  }

  const handleCancelEditPaymentMethod = () => {
    setEditingPaymentMethod(null)
    setEditPaymentMethodValue("")
  }
  
  const handleMovePaymentMethod = (id: string, direction: 'up' | 'down') => {
    setPaymentMethods((current) => {
      const methods = [...(current || [])]
      const index = methods.findIndex(pm => pm.id === id)
      if (index === -1) return methods
      
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= methods.length) return methods
      
      const temp = methods[index]
      methods[index] = methods[newIndex]
      methods[newIndex] = temp
      return methods
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8">
          <h1 className="text-[32px] font-bold tracking-tight leading-none">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your PawHub application settings.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-secondary/50 mb-6">
            <TabsTrigger 
              value="staff" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Staff
            </TabsTrigger>
            <TabsTrigger 
              value="business" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Business
            </TabsTrigger>
            <TabsTrigger 
              value="services" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Services
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="pos" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              POS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="staff" className="mt-0">
            <Card className="p-6 bg-card border-border">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Staff Positions</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Manage the available positions for your staff members. These will appear in the dropdown when adding or editing staff.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label htmlFor="new-position" className="sr-only">New Position</Label>
                      <Input
                        id="new-position"
                        placeholder="Enter new position (e.g., Senior Groomer)"
                        value={newPosition}
                        onChange={(e) => setNewPosition(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddPosition()
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleAddPosition}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Position
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(staffPositions || []).length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No positions configured. Add your first position above.
                      </div>
                    ) : (
                      (staffPositions || []).map((position) => (
                        <div
                          key={position}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border hover:border-primary/50 transition-colors"
                        >
                          {editingPosition === position ? (
                            <>
                              <Input
                                value={editPositionValue}
                                onChange={(e) => setEditPositionValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveEditPosition()
                                  } else if (e.key === 'Escape') {
                                    handleCancelEditPosition()
                                  }
                                }}
                                className="flex-1 mr-3"
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancelEditPosition}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-primary text-primary-foreground"
                                  onClick={handleSaveEditPosition}
                                >
                                  Save
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="font-medium">{position}</span>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-foreground hover:bg-primary/10"
                                  onClick={() => handleEditPosition(position)}
                                >
                                  <PencilSimple size={18} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeletePosition(position)}
                                >
                                  <Trash size={18} />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="mt-0">
            <Card className="p-12 bg-card border-border text-center">
              <p className="text-muted-foreground">
                Business settings will appear here.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-0">
            <div className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Main Services</h2>
                      <p className="text-sm text-muted-foreground">
                        Core grooming services with size-based pricing
                      </p>
                    </div>
                    <Button
                      onClick={() => openMainServiceDialog()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Main Service
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {(mainServices || []).length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No main services configured. Add your first service above.
                      </div>
                    ) : (
                      (mainServices || []).map((service) => (
                        <div
                          key={service.id}
                          className="p-5 rounded-lg bg-secondary/20 border border-border hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{service.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-foreground hover:bg-primary/10"
                                onClick={() => openMainServiceDialog(service)}
                              >
                                <PencilSimple size={18} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteMainService(service.id)}
                              >
                                <Trash size={18} />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-background/50 p-3 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">Small (1-25 lbs)</div>
                              <div className="text-lg font-semibold">${service.pricing.small}</div>
                            </div>
                            <div className="bg-background/50 p-3 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">Medium (26-50 lbs)</div>
                              <div className="text-lg font-semibold">${service.pricing.medium}</div>
                            </div>
                            <div className="bg-background/50 p-3 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">Large (51-80 lbs)</div>
                              <div className="text-lg font-semibold">${service.pricing.large}</div>
                            </div>
                            <div className="bg-background/50 p-3 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">Giant (81+ lbs)</div>
                              <div className="text-lg font-semibold">${service.pricing.giant}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Add-On Services</h2>
                      <p className="text-sm text-muted-foreground">
                        Optional services that can be added to any main service
                      </p>
                    </div>
                    <Button
                      onClick={() => openAddOnDialog()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Add-On
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(addOns || []).length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No add-ons configured. Add your first add-on above.
                      </div>
                    ) : (
                      (addOns || []).map((addOn) => (
                        <div
                          key={addOn.id}
                          className={addOn.hasSizePricing ? "p-5 rounded-lg bg-secondary/20 border border-border hover:border-primary/50 transition-colors" : "flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border hover:border-primary/50 transition-colors"}
                        >
                          {addOn.hasSizePricing && addOn.pricing ? (
                            <>
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-base">{addOn.name}</h3>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-foreground hover:bg-primary/10"
                                    onClick={() => openAddOnDialog(addOn)}
                                  >
                                    <PencilSimple size={18} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteAddOn(addOn.id)}
                                  >
                                    <Trash size={18} />
                                  </Button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-background/50 p-3 rounded-md">
                                  <div className="text-xs text-muted-foreground mb-1">Small (1-25 lbs)</div>
                                  <div className="text-lg font-semibold">${addOn.pricing.small}</div>
                                </div>
                                <div className="bg-background/50 p-3 rounded-md">
                                  <div className="text-xs text-muted-foreground mb-1">Medium (26-50 lbs)</div>
                                  <div className="text-lg font-semibold">${addOn.pricing.medium}</div>
                                </div>
                                <div className="bg-background/50 p-3 rounded-md">
                                  <div className="text-xs text-muted-foreground mb-1">Large (51-80 lbs)</div>
                                  <div className="text-lg font-semibold">${addOn.pricing.large}</div>
                                </div>
                                <div className="bg-background/50 p-3 rounded-md">
                                  <div className="text-xs text-muted-foreground mb-1">Giant (81+ lbs)</div>
                                  <div className="text-lg font-semibold">${addOn.pricing.giant}</div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{addOn.name}</span>
                                <span className="text-primary font-semibold">${addOn.price}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-foreground hover:bg-primary/10"
                                  onClick={() => openAddOnDialog(addOn)}
                                >
                                  <PencilSimple size={18} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteAddOn(addOn.id)}
                                >
                                  <Trash size={18} />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <Card className="p-12 bg-card border-border text-center">
              <p className="text-muted-foreground">
                Notification settings will appear here.
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="pos" className="mt-0">
            <Card className="p-6 bg-card border-border">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Payment Methods</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Configure available payment methods for POS transactions. You can add, remove, enable/disable, and reorder payment methods.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label htmlFor="new-payment-method" className="sr-only">New Payment Method</Label>
                      <Input
                        id="new-payment-method"
                        placeholder="Enter new payment method (e.g., Venmo, PayPal)"
                        value={newPaymentMethod}
                        onChange={(e) => setNewPaymentMethod(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddPaymentMethod()
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleAddPaymentMethod}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Method
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(paymentMethods || []).length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No payment methods configured. Add your first payment method above.
                      </div>
                    ) : (
                      (paymentMethods || []).map((method, index) => (
                        <div
                          key={method.id}
                          className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                            method.enabled 
                              ? 'bg-secondary/20 border-border hover:border-primary/50' 
                              : 'bg-muted/30 border-border/50 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex flex-col">
                              <button
                                onClick={() => handleMovePaymentMethod(method.id, 'up')}
                                disabled={index === 0}
                                className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                              >
                                <CaretUp size={18} weight="bold" />
                              </button>
                              <button
                                onClick={() => handleMovePaymentMethod(method.id, 'down')}
                                disabled={index === (paymentMethods || []).length - 1}
                                className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                              >
                                <CaretDown size={18} weight="bold" />
                              </button>
                            </div>
                            
                            {editingPaymentMethod?.id === method.id ? (
                              <Input
                                value={editPaymentMethodValue}
                                onChange={(e) => setEditPaymentMethodValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveEditPaymentMethod()
                                  } else if (e.key === 'Escape') {
                                    handleCancelEditPaymentMethod()
                                  }
                                }}
                                className="flex-1 mr-3"
                                autoFocus
                              />
                            ) : (
                              <span className="font-medium">{method.name}</span>
                            )}
                          </div>
                          
                          <div className="flex gap-2 items-center">
                            {editingPaymentMethod?.id === method.id ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancelEditPaymentMethod}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-primary text-primary-foreground"
                                  onClick={handleSaveEditPaymentMethod}
                                >
                                  Save
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleTogglePaymentMethod(method.id)}
                                  className={method.enabled ? '' : 'border-muted-foreground'}
                                >
                                  {method.enabled ? 'Enabled' : 'Disabled'}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-foreground hover:bg-primary/10"
                                  onClick={() => handleEditPaymentMethod(method)}
                                >
                                  <PencilSimple size={18} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeletePaymentMethod(method.id)}
                                >
                                  <Trash size={18} />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={mainServiceDialogOpen} onOpenChange={setMainServiceDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMainService ? "Edit Main Service" : "Add Main Service"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  placeholder="e.g., Fresh Bath"
                  value={mainServiceForm.name}
                  onChange={(e) => setMainServiceForm({ ...mainServiceForm, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service-description">Description</Label>
                <Input
                  id="service-description"
                  placeholder="e.g., Includes Shampoo, Blow Out, Brush Out..."
                  value={mainServiceForm.description}
                  onChange={(e) => setMainServiceForm({ ...mainServiceForm, description: e.target.value })}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Size-Based Pricing</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="small-price" className="text-sm text-muted-foreground">Small (1-25 lbs)</Label>
                    <Input
                      id="small-price"
                      type="number"
                      placeholder="45"
                      value={mainServiceForm.smallPrice}
                      onChange={(e) => setMainServiceForm({ ...mainServiceForm, smallPrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medium-price" className="text-sm text-muted-foreground">Medium (26-50 lbs)</Label>
                    <Input
                      id="medium-price"
                      type="number"
                      placeholder="55"
                      value={mainServiceForm.mediumPrice}
                      onChange={(e) => setMainServiceForm({ ...mainServiceForm, mediumPrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="large-price" className="text-sm text-muted-foreground">Large (51-80 lbs)</Label>
                    <Input
                      id="large-price"
                      type="number"
                      placeholder="65"
                      value={mainServiceForm.largePrice}
                      onChange={(e) => setMainServiceForm({ ...mainServiceForm, largePrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="giant-price" className="text-sm text-muted-foreground">Giant (81+ lbs)</Label>
                    <Input
                      id="giant-price"
                      type="number"
                      placeholder="75"
                      value={mainServiceForm.giantPrice}
                      onChange={(e) => setMainServiceForm({ ...mainServiceForm, giantPrice: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setMainServiceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMainService} className="bg-primary text-primary-foreground">
                {editingMainService ? "Update Service" : "Add Service"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={addOnDialogOpen} onOpenChange={setAddOnDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAddOn ? "Edit Add-On" : "Add Add-On"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="addon-name">Add-On Name</Label>
                <Input
                  id="addon-name"
                  placeholder="e.g., Conditioning Treatment"
                  value={addOnForm.name}
                  onChange={(e) => setAddOnForm({ ...addOnForm, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pricing-type">Pricing Type</Label>
                <Select
                  value={addOnForm.hasSizePricing}
                  onValueChange={(value) => setAddOnForm({ ...addOnForm, hasSizePricing: value })}
                >
                  <SelectTrigger id="pricing-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Fixed Price</SelectItem>
                    <SelectItem value="true">Size-Based Pricing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {addOnForm.hasSizePricing === "false" ? (
                <div className="space-y-2">
                  <Label htmlFor="addon-price">Price</Label>
                  <Input
                    id="addon-price"
                    type="number"
                    placeholder="20"
                    value={addOnForm.price}
                    onChange={(e) => setAddOnForm({ ...addOnForm, price: e.target.value })}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <Label>Size-Based Pricing</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addon-small-price" className="text-sm text-muted-foreground">Small (1-25 lbs)</Label>
                      <Input
                        id="addon-small-price"
                        type="number"
                        placeholder="20"
                        value={addOnForm.smallPrice}
                        onChange={(e) => setAddOnForm({ ...addOnForm, smallPrice: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addon-medium-price" className="text-sm text-muted-foreground">Medium (26-50 lbs)</Label>
                      <Input
                        id="addon-medium-price"
                        type="number"
                        placeholder="25"
                        value={addOnForm.mediumPrice}
                        onChange={(e) => setAddOnForm({ ...addOnForm, mediumPrice: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addon-large-price" className="text-sm text-muted-foreground">Large (51-80 lbs)</Label>
                      <Input
                        id="addon-large-price"
                        type="number"
                        placeholder="30"
                        value={addOnForm.largePrice}
                        onChange={(e) => setAddOnForm({ ...addOnForm, largePrice: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addon-giant-price" className="text-sm text-muted-foreground">Giant (81+ lbs)</Label>
                      <Input
                        id="addon-giant-price"
                        type="number"
                        placeholder="40"
                        value={addOnForm.giantPrice}
                        onChange={(e) => setAddOnForm({ ...addOnForm, giantPrice: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOnDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAddOn} className="bg-primary text-primary-foreground">
                {editingAddOn ? "Update Add-On" : "Add Add-On"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
