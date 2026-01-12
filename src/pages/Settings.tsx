import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash, PencilSimple, CaretUp, CaretDown } from "@phosphor-icons/react"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatPayPeriodType, type PayPeriodType, type PayPeriodSettings } from "@/lib/payroll-utils"
import { format } from 'date-fns'

interface WeightRange {
  min: number
  max: number | null
}

interface WeightRanges {
  small: WeightRange
  medium: WeightRange
  large: WeightRange
  giant: WeightRange
}

interface ServicePricing {
  small: number
  medium: number
  large: number
  giant: number
}

interface BreedPricing {
  breedName: string
  price: number
}

interface MainService {
  id: string
  name: string
  description: string
  pricing: ServicePricing
  pricingStrategy: 'weight' | 'breed' | 'mixed'
  breedPricing?: BreedPricing[]
}

interface AddOn {
  id: string
  name: string
  price?: number
  pricing?: ServicePricing
  hasSizePricing: boolean
}

const DEFAULT_WEIGHT_RANGES: WeightRanges = {
  small: { min: 1, max: 25 },
  medium: { min: 26, max: 50 },
  large: { min: 51, max: 80 },
  giant: { min: 81, max: null }
}

const DEFAULT_MAIN_SERVICES: MainService[] = [
  {
    id: "fresh-bath",
    name: "Fresh Bath",
    description: "Includes Shampoo, Blow Out, Brush Out, Ear Cleaning, Nail Trim",
    pricing: { small: 45, medium: 55, large: 65, giant: 75 },
    pricingStrategy: 'weight'
  },
  {
    id: "trim-up",
    name: "Trim Up",
    description: "Bath + Trim Up: Round Out Paws, Neaten Face, Sanitary Trim",
    pricing: { small: 50, medium: 60, large: 70, giant: 80 },
    pricingStrategy: 'weight'
  },
  {
    id: "deluxe-groom",
    name: "Deluxe Groom",
    description: "Bath + Trim Up + Custom Haircut",
    pricing: { small: 70, medium: 80, large: 90, giant: 100 },
    pricingStrategy: 'weight'
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

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Phoenix", label: "Arizona Time (MT - No DST)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "America/Puerto_Rico", label: "Atlantic Time (AST)" }
]

interface HoursOfOperation {
  day: string
  isOpen: boolean
  openTime: string
  closeTime: string
}

interface BusinessInfo {
  companyName: string
  businessPhone: string
  businessEmail: string
  address: string
  city: string
  state: string
  zipCode: string
  timezone: string
  taxId: string
  website: string
  hoursOfOperation: HoursOfOperation[]
}

export function Settings() {
  const [activeTab, setActiveTab] = useState("staff")
  const [staffPositions, setStaffPositions] = useKV<string[]>("staff-positions", ["Owner", "Groomer", "Front Desk", "Bather"])
  const [newPosition, setNewPosition] = useState("")
  const [editingPosition, setEditingPosition] = useState<string | null>(null)
  const [editPositionValue, setEditPositionValue] = useState("")
  
  const [mainServices, setMainServices] = useKV<MainService[]>("main-services", DEFAULT_MAIN_SERVICES)
  const [addOns, setAddOns] = useKV<AddOn[]>("service-addons", DEFAULT_ADDONS)
  const [weightRanges, setWeightRanges] = useKV<WeightRanges>("weight-ranges", DEFAULT_WEIGHT_RANGES)
  
  const [weightRangeForm, setWeightRangeForm] = useState({
    smallMin: "",
    smallMax: "",
    mediumMin: "",
    mediumMax: "",
    largeMin: "",
    largeMax: "",
    giantMin: ""
  })
  
  const [weightRangeDialogOpen, setWeightRangeDialogOpen] = useState(false)
  
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
    pricingStrategy: "weight" as 'weight' | 'breed' | 'mixed',
    smallPrice: "",
    mediumPrice: "",
    largePrice: "",
    giantPrice: "",
    breedPricing: [] as BreedPricing[]
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
  
  const defaultHoursOfOperation: HoursOfOperation[] = [
    { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '16:00' },
    { day: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '17:00' }
  ]
  
  const [businessInfo, setBusinessInfo] = useKV<BusinessInfo>("business-info", {
    companyName: "",
    businessPhone: "",
    businessEmail: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    timezone: "America/New_York",
    taxId: "",
    website: "",
    hoursOfOperation: defaultHoursOfOperation
  })
  
  const [businessFormData, setBusinessFormData] = useState<BusinessInfo>({
    companyName: "",
    businessPhone: "",
    businessEmail: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    timezone: "America/New_York",
    taxId: "",
    website: "",
    hoursOfOperation: defaultHoursOfOperation
  })
  
  const defaultBiWeeklySettings: PayPeriodSettings = {
    type: 'bi-weekly',
    anchorStartDate: '2024-12-30',
    anchorEndDate: '2025-01-12',
    anchorPayDate: '2025-01-17'
  }
  
  const defaultWeeklySettings: PayPeriodSettings = {
    type: 'weekly',
    anchorStartDate: '2024-12-30',
    anchorEndDate: '2025-01-05',
    anchorPayDate: '2025-01-10'
  }
  
  const [payrollSettings, setPayrollSettings] = useKV<{ payPeriod: PayPeriodSettings }>("payroll-settings", {
    payPeriod: defaultBiWeeklySettings
  })
  
  const [payrollFormData, setPayrollFormData] = useState<PayPeriodSettings>(defaultBiWeeklySettings)
  
  useEffect(() => {
    if (businessInfo) {
      setBusinessFormData({
        ...businessInfo,
        hoursOfOperation: businessInfo.hoursOfOperation || defaultHoursOfOperation
      })
    }
  }, [businessInfo])
  
  useEffect(() => {
    if (payrollSettings) {
      setPayrollFormData(payrollSettings.payPeriod || defaultBiWeeklySettings)
    }
  }, [payrollSettings])

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
        pricingStrategy: service.pricingStrategy || 'weight',
        smallPrice: service.pricing.small.toString(),
        mediumPrice: service.pricing.medium.toString(),
        largePrice: service.pricing.large.toString(),
        giantPrice: service.pricing.giant.toString(),
        breedPricing: service.breedPricing || []
      })
    } else {
      setEditingMainService(null)
      setMainServiceForm({
        name: "",
        description: "",
        pricingStrategy: 'weight',
        smallPrice: "",
        mediumPrice: "",
        largePrice: "",
        giantPrice: "",
        breedPricing: []
      })
    }
    setMainServiceDialogOpen(true)
  }
  
  const openWeightRangeDialog = () => {
    const ranges = weightRanges || DEFAULT_WEIGHT_RANGES
    setWeightRangeForm({
      smallMin: ranges.small.min.toString(),
      smallMax: ranges.small.max?.toString() || "",
      mediumMin: ranges.medium.min.toString(),
      mediumMax: ranges.medium.max?.toString() || "",
      largeMin: ranges.large.min.toString(),
      largeMax: ranges.large.max?.toString() || "",
      giantMin: ranges.giant.min.toString()
    })
    setWeightRangeDialogOpen(true)
  }
  
  const handleSaveWeightRanges = () => {
    const smallMin = parseFloat(weightRangeForm.smallMin)
    const smallMax = parseFloat(weightRangeForm.smallMax)
    const mediumMin = parseFloat(weightRangeForm.mediumMin)
    const mediumMax = parseFloat(weightRangeForm.mediumMax)
    const largeMin = parseFloat(weightRangeForm.largeMin)
    const largeMax = parseFloat(weightRangeForm.largeMax)
    const giantMin = parseFloat(weightRangeForm.giantMin)
    
    if (isNaN(smallMin) || isNaN(smallMax) || isNaN(mediumMin) || isNaN(mediumMax) || 
        isNaN(largeMin) || isNaN(largeMax) || isNaN(giantMin)) {
      toast.error("All weight values must be valid numbers")
      return
    }
    
    setWeightRanges({
      small: { min: smallMin, max: smallMax },
      medium: { min: mediumMin, max: mediumMax },
      large: { min: largeMin, max: largeMax },
      giant: { min: giantMin, max: null }
    })
    
    setWeightRangeDialogOpen(false)
    toast.success("Weight ranges updated successfully")
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
      pricingStrategy: mainServiceForm.pricingStrategy,
      pricing: {
        small: smallPrice,
        medium: mediumPrice,
        large: largePrice,
        giant: giantPrice
      },
      breedPricing: mainServiceForm.breedPricing
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
  
  const handleSaveBusinessInfo = () => {
    if (!businessFormData.companyName.trim()) {
      toast.error("Company name is required")
      return
    }
    
    if (!businessFormData.timezone) {
      toast.error("Timezone is required")
      return
    }
    
    setBusinessInfo(businessFormData)
    toast.success("Business information saved successfully")
  }
  
  const handleBusinessInfoChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleHoursChange = (index: number, field: keyof HoursOfOperation, value: string | boolean) => {
    setBusinessFormData((prev) => {
      const currentHours = prev.hoursOfOperation || defaultHoursOfOperation
      const newHours = [...currentHours]
      newHours[index] = { ...newHours[index], [field]: value }
      return { ...prev, hoursOfOperation: newHours }
    })
  }
  
  const handlePayrollChange = (field: keyof PayPeriodSettings, value: string) => {
    setPayrollFormData((prev) => {
      const updated = { ...prev, [field]: value }
      
      if (field === 'type') {
        const newType = value as PayPeriodType
        if (newType === 'weekly') {
          updated.anchorStartDate = defaultWeeklySettings.anchorStartDate
          updated.anchorEndDate = defaultWeeklySettings.anchorEndDate
          updated.anchorPayDate = defaultWeeklySettings.anchorPayDate
        } else if (newType === 'bi-weekly') {
          updated.anchorStartDate = defaultBiWeeklySettings.anchorStartDate
          updated.anchorEndDate = defaultBiWeeklySettings.anchorEndDate
          updated.anchorPayDate = defaultBiWeeklySettings.anchorPayDate
        }
        return updated
      }
      
      if (field === 'anchorStartDate' && (updated.type === 'weekly' || updated.type === 'bi-weekly')) {
        const startDate = new Date(value)
        if (!isNaN(startDate.getTime())) {
          const periodLength = updated.type === 'weekly' ? 6 : 13
          const endDate = new Date(startDate)
          endDate.setDate(endDate.getDate() + periodLength)
          
          const originalStart = new Date(prev.anchorStartDate)
          const originalEnd = new Date(prev.anchorEndDate)
          const originalPay = new Date(prev.anchorPayDate)
          
          if (!isNaN(originalStart.getTime()) && !isNaN(originalEnd.getTime()) && !isNaN(originalPay.getTime())) {
            const daysBetweenEndAndPay = Math.round((originalPay.getTime() - originalEnd.getTime()) / (1000 * 60 * 60 * 24))
            
            const payDate = new Date(endDate)
            payDate.setDate(payDate.getDate() + daysBetweenEndAndPay)
            
            updated.anchorEndDate = format(endDate, 'yyyy-MM-dd')
            updated.anchorPayDate = format(payDate, 'yyyy-MM-dd')
          }
        }
      }
      
      return updated
    })
  }
  
  const handleResetPayrollDates = () => {
    const defaults = payrollFormData.type === 'weekly' ? defaultWeeklySettings : defaultBiWeeklySettings
    setPayrollFormData((prev) => ({
      ...prev,
      anchorStartDate: defaults.anchorStartDate,
      anchorEndDate: defaults.anchorEndDate,
      anchorPayDate: defaults.anchorPayDate
    }))
    toast.success("Anchor dates reset to defaults")
  }
  
  const handleSavePayrollSettings = () => {
    setPayrollSettings({ payPeriod: payrollFormData })
    toast.success("Payroll settings saved successfully")
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8">
          <h1 className="text-[32px] font-bold tracking-tight leading-none">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your Scruffy Butts application settings.
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
              value="payroll" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Payroll
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
            <Card className="p-6 bg-card border-border">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Business Information</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Configure your business details for receipts, invoices, and system-wide settings. Timezone is critical for appointments, schedules, and all time-based operations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="text-sm font-medium flex items-center gap-1">
                      Company Name
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="company-name"
                      placeholder="Scruffy Butts Dog Grooming"
                      value={businessFormData.companyName}
                      onChange={(e) => handleBusinessInfoChange('companyName', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">This will appear on all receipts and invoices</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-phone" className="text-sm font-medium">
                      Business Phone
                    </Label>
                    <Input
                      id="business-phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={businessFormData.businessPhone}
                      onChange={(e) => handleBusinessInfoChange('businessPhone', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-email" className="text-sm font-medium">
                      Business Email
                    </Label>
                    <Input
                      id="business-email"
                      type="email"
                      placeholder="info@scruffybutts.com"
                      value={businessFormData.businessEmail}
                      onChange={(e) => handleBusinessInfoChange('businessEmail', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium">
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="www.scruffybutts.com"
                      value={businessFormData.website}
                      onChange={(e) => handleBusinessInfoChange('website', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-sm font-medium">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={businessFormData.address}
                      onChange={(e) => handleBusinessInfoChange('address', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="Springfield"
                      value={businessFormData.city}
                      onChange={(e) => handleBusinessInfoChange('city', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium">
                      State
                    </Label>
                    <Input
                      id="state"
                      placeholder="CA"
                      value={businessFormData.state}
                      onChange={(e) => handleBusinessInfoChange('state', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip-code" className="text-sm font-medium">
                      ZIP Code
                    </Label>
                    <Input
                      id="zip-code"
                      placeholder="12345"
                      value={businessFormData.zipCode}
                      onChange={(e) => handleBusinessInfoChange('zipCode', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax-id" className="text-sm font-medium">
                      Tax ID / EIN
                    </Label>
                    <Input
                      id="tax-id"
                      placeholder="12-3456789"
                      value={businessFormData.taxId}
                      onChange={(e) => handleBusinessInfoChange('taxId', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="timezone" className="text-sm font-medium flex items-center gap-1">
                      Business Timezone
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={businessFormData.timezone}
                      onValueChange={(value) => handleBusinessInfoChange('timezone', value)}
                    >
                      <SelectTrigger id="timezone" className="w-full">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      ⚠️ Critical: This timezone will be used for all appointments, staff schedules, drop-off/pick-up times, and system metrics
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <div>
                    <h3 className="text-base font-semibold mb-1">Hours of Operation</h3>
                    <p className="text-sm text-muted-foreground">
                      Set your business hours for each day of the week
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {(businessFormData.hoursOfOperation || defaultHoursOfOperation).map((hours, index) => (
                      <div key={hours.day} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 border border-border">
                        <div className="w-28">
                          <span className="font-medium">{hours.day}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`open-${hours.day}`}
                            checked={hours.isOpen}
                            onCheckedChange={(checked) => handleHoursChange(index, 'isOpen', checked)}
                          />
                          <Label htmlFor={`open-${hours.day}`} className="text-sm cursor-pointer">
                            {hours.isOpen ? 'Open' : 'Closed'}
                          </Label>
                        </div>
                        
                        {hours.isOpen && (
                          <>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`open-time-${hours.day}`} className="text-sm text-muted-foreground w-12">
                                From
                              </Label>
                              <Input
                                id={`open-time-${hours.day}`}
                                type="time"
                                value={hours.openTime}
                                onChange={(e) => handleHoursChange(index, 'openTime', e.target.value)}
                                className="w-32"
                              />
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`close-time-${hours.day}`} className="text-sm text-muted-foreground w-12">
                                To
                              </Label>
                              <Input
                                id={`close-time-${hours.day}`}
                                type="time"
                                value={hours.closeTime}
                                onChange={(e) => handleHoursChange(index, 'closeTime', e.target.value)}
                                className="w-32"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button
                    onClick={handleSaveBusinessInfo}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    Save Business Information
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="payroll" className="mt-0">
            <Card className="p-6 bg-card border-border">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Payroll Settings</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Configure your payroll schedule. The system will automatically calculate when payday is based on your pay period settings.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="pay-period-type" className="text-sm font-medium flex items-center gap-1">
                      Pay Period Frequency
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={payrollFormData.type}
                      onValueChange={(value) => handlePayrollChange('type', value as PayPeriodType)}
                    >
                      <SelectTrigger id="pay-period-type" className="w-full md:w-64">
                        <SelectValue placeholder="Select pay period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        <SelectItem value="semi-monthly">Semi-Monthly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      How often you pay your staff members
                    </p>
                  </div>

                  {(payrollFormData.type === 'weekly' || payrollFormData.type === 'bi-weekly') && (
                    <div className="border-t border-border pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold mb-1">Anchor Pay Period</h3>
                          <p className="text-sm text-muted-foreground">
                            Define a reference pay period. The system will calculate all future pay periods based on these dates.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetPayrollDates}
                          className="text-sm"
                        >
                          Reset to Defaults
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="anchor-start-date" className="text-sm font-medium">
                            Period Start Date
                          </Label>
                          <Input
                            id="anchor-start-date"
                            type="date"
                            value={payrollFormData.anchorStartDate}
                            onChange={(e) => handlePayrollChange('anchorStartDate', e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">First day of the pay period</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="anchor-end-date" className="text-sm font-medium">
                            Period End Date
                          </Label>
                          <Input
                            id="anchor-end-date"
                            type="date"
                            value={payrollFormData.anchorEndDate}
                            onChange={(e) => handlePayrollChange('anchorEndDate', e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">Auto-updates when start date changes</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="anchor-pay-date" className="text-sm font-medium">
                            Pay Date
                          </Label>
                          <Input
                            id="anchor-pay-date"
                            type="date"
                            value={payrollFormData.anchorPayDate}
                            onChange={(e) => handlePayrollChange('anchorPayDate', e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">Auto-updates when start date changes</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-sm text-blue-400">
                          <strong>Tip:</strong> When you change the Period Start Date, the Period End Date and Pay Date will automatically update to maintain the {payrollFormData.type === 'weekly' ? '7-day' : '14-day'} cycle and payment delay.
                        </p>
                      </div>
                    </div>
                  )}

                  {(payrollFormData.type === 'semi-monthly' || payrollFormData.type === 'monthly') && (
                    <div className="border-t border-border pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold mb-1">Payment Schedule</h3>
                          <p className="text-sm text-muted-foreground">
                            {payrollFormData.type === 'semi-monthly' 
                              ? 'Configure when staff get paid for each half of the month (1st-15th and 16th-end of month)'
                              : 'Configure when staff get paid each month'
                            }
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetPayrollDates}
                          className="text-sm"
                        >
                          Reset to Defaults
                        </Button>
                      </div>

                      {payrollFormData.type === 'semi-monthly' ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="first-half-pay-day" className="text-sm font-medium">
                                First Half Pay Day (Day of Month)
                              </Label>
                              <Input
                                id="first-half-pay-day"
                                type="number"
                                min="1"
                                max="31"
                                placeholder="e.g., 20"
                                value={payrollFormData.anchorPayDate ? new Date(payrollFormData.anchorPayDate).getDate() : ''}
                                onChange={(e) => {
                                  const day = parseInt(e.target.value)
                                  if (day >= 1 && day <= 31) {
                                    const date = new Date()
                                    date.setDate(day)
                                    handlePayrollChange('anchorPayDate', format(date, 'yyyy-MM-dd'))
                                  }
                                }}
                              />
                              <p className="text-xs text-muted-foreground">
                                Pay day for the 1st-15th period (e.g., 20 means the 20th of each month)
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="second-half-pay-day" className="text-sm font-medium">
                                Second Half Pay Day (Day of Month)
                              </Label>
                              <Input
                                id="second-half-pay-day"
                                type="number"
                                min="1"
                                max="31"
                                placeholder="e.g., 5"
                                value={payrollFormData.anchorEndDate ? new Date(payrollFormData.anchorEndDate).getDate() : ''}
                                onChange={(e) => {
                                  const day = parseInt(e.target.value)
                                  if (day >= 1 && day <= 31) {
                                    const date = new Date()
                                    date.setDate(day)
                                    handlePayrollChange('anchorEndDate', format(date, 'yyyy-MM-dd'))
                                  }
                                }}
                              />
                              <p className="text-xs text-muted-foreground">
                                Pay day for the 16th-end period (e.g., 5 means the 5th of the next month)
                              </p>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <p className="text-sm text-blue-400">
                              <strong>Example:</strong> If you set first half pay day as 20 and second half as 5, staff will be paid on the 20th for work from the 1st-15th, and on the 5th of the next month for work from the 16th-end of month.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="monthly-pay-day" className="text-sm font-medium">
                              Monthly Pay Day (Day of Month)
                            </Label>
                            <Input
                              id="monthly-pay-day"
                              type="number"
                              min="1"
                              max="31"
                              placeholder="e.g., 1"
                              value={payrollFormData.anchorPayDate ? new Date(payrollFormData.anchorPayDate).getDate() : ''}
                              onChange={(e) => {
                                const day = parseInt(e.target.value)
                                if (day >= 1 && day <= 31) {
                                  const date = new Date()
                                  date.setDate(day)
                                  handlePayrollChange('anchorPayDate', format(date, 'yyyy-MM-dd'))
                                }
                              }}
                            />
                            <p className="text-xs text-muted-foreground">
                              The day of each month when staff get paid (e.g., 1 means the 1st of the next month)
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <p className="text-sm text-blue-400">
                              <strong>Example:</strong> If you set the pay day as 1, staff will be paid on the 1st of each month for the previous month's work.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button
                    onClick={handleSavePayrollSettings}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    Save Payroll Settings
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-0">
            <div className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Weight Size Configuration</h2>
                      <p className="text-sm text-muted-foreground">
                        Define weight ranges for each size category
                      </p>
                    </div>
                    <Button
                      onClick={openWeightRangeDialog}
                      variant="outline"
                      className="font-semibold"
                    >
                      <PencilSimple size={18} className="mr-2" />
                      Edit Weight Ranges
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-secondary/20 p-3 rounded-md border border-border">
                      <div className="text-xs text-muted-foreground mb-1">Small</div>
                      <div className="text-sm font-semibold">
                        {weightRanges?.small.min || 1}-{weightRanges?.small.max || 25} lbs
                      </div>
                    </div>
                    <div className="bg-secondary/20 p-3 rounded-md border border-border">
                      <div className="text-xs text-muted-foreground mb-1">Medium</div>
                      <div className="text-sm font-semibold">
                        {weightRanges?.medium.min || 26}-{weightRanges?.medium.max || 50} lbs
                      </div>
                    </div>
                    <div className="bg-secondary/20 p-3 rounded-md border border-border">
                      <div className="text-xs text-muted-foreground mb-1">Large</div>
                      <div className="text-sm font-semibold">
                        {weightRanges?.large.min || 51}-{weightRanges?.large.max || 80} lbs
                      </div>
                    </div>
                    <div className="bg-secondary/20 p-3 rounded-md border border-border">
                      <div className="text-xs text-muted-foreground mb-1">Giant</div>
                      <div className="text-sm font-semibold">
                        {weightRanges?.giant.min || 81}+ lbs
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-card border-border">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Main Services</h2>
                      <p className="text-sm text-muted-foreground">
                        Core grooming services with flexible pricing strategies
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
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">{service.name}</h3>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                                  {service.pricingStrategy === 'weight' ? 'By Weight' : service.pricingStrategy === 'breed' ? 'By Breed' : 'Mixed Pricing'}
                                </span>
                              </div>
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              
              <div className="space-y-2">
                <Label htmlFor="pricing-strategy">Pricing Strategy</Label>
                <Select
                  value={mainServiceForm.pricingStrategy}
                  onValueChange={(value: 'weight' | 'breed' | 'mixed') => 
                    setMainServiceForm({ ...mainServiceForm, pricingStrategy: value })
                  }
                >
                  <SelectTrigger id="pricing-strategy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">By Weight Only</SelectItem>
                    <SelectItem value="breed">By Breed Only</SelectItem>
                    <SelectItem value="mixed">Mixed (Weight + Breed Exceptions)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {mainServiceForm.pricingStrategy === 'weight' && "Price based on dog's weight using size categories"}
                  {mainServiceForm.pricingStrategy === 'breed' && "Set specific prices for certain breeds (e.g., Doodles cost more)"}
                  {mainServiceForm.pricingStrategy === 'mixed' && "Use weight-based pricing with breed-specific overrides"}
                </p>
              </div>
              
              <div className="space-y-3">
                <Label>Base Weight-Based Pricing</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="small-price" className="text-sm text-muted-foreground">
                      Small ({weightRanges?.small.min || 1}-{weightRanges?.small.max || 25} lbs)
                    </Label>
                    <Input
                      id="small-price"
                      type="number"
                      placeholder="45"
                      value={mainServiceForm.smallPrice}
                      onChange={(e) => setMainServiceForm({ ...mainServiceForm, smallPrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medium-price" className="text-sm text-muted-foreground">
                      Medium ({weightRanges?.medium.min || 26}-{weightRanges?.medium.max || 50} lbs)
                    </Label>
                    <Input
                      id="medium-price"
                      type="number"
                      placeholder="55"
                      value={mainServiceForm.mediumPrice}
                      onChange={(e) => setMainServiceForm({ ...mainServiceForm, mediumPrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="large-price" className="text-sm text-muted-foreground">
                      Large ({weightRanges?.large.min || 51}-{weightRanges?.large.max || 80} lbs)
                    </Label>
                    <Input
                      id="large-price"
                      type="number"
                      placeholder="65"
                      value={mainServiceForm.largePrice}
                      onChange={(e) => setMainServiceForm({ ...mainServiceForm, largePrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="giant-price" className="text-sm text-muted-foreground">
                      Giant ({weightRanges?.giant.min || 81}+ lbs)
                    </Label>
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
              
              {(mainServiceForm.pricingStrategy === 'breed' || mainServiceForm.pricingStrategy === 'mixed') && (
                <div className="space-y-3 p-4 rounded-lg bg-secondary/20 border border-border">
                  <div className="flex items-center justify-between">
                    <Label>Breed-Specific Pricing</Label>
                    <p className="text-xs text-muted-foreground">Coming soon: Add breed exceptions</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This feature will allow you to set custom prices for specific breeds (e.g., Goldendoodles, Poodles).
                  </p>
                </div>
              )}
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
        
        <Dialog open={weightRangeDialogOpen} onOpenChange={setWeightRangeDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Weight Ranges</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-5 py-4">
              <p className="text-sm text-muted-foreground">
                Define the weight ranges for each size category. These ranges are used for pricing throughout the app.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Small</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="small-min" className="text-xs text-muted-foreground">Min (lbs)</Label>
                      <Input
                        id="small-min"
                        type="number"
                        value={weightRangeForm.smallMin}
                        onChange={(e) => setWeightRangeForm({ ...weightRangeForm, smallMin: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="small-max" className="text-xs text-muted-foreground">Max (lbs)</Label>
                      <Input
                        id="small-max"
                        type="number"
                        value={weightRangeForm.smallMax}
                        onChange={(e) => setWeightRangeForm({ ...weightRangeForm, smallMax: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-semibold">Medium</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="medium-min" className="text-xs text-muted-foreground">Min (lbs)</Label>
                      <Input
                        id="medium-min"
                        type="number"
                        value={weightRangeForm.mediumMin}
                        onChange={(e) => setWeightRangeForm({ ...weightRangeForm, mediumMin: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="medium-max" className="text-xs text-muted-foreground">Max (lbs)</Label>
                      <Input
                        id="medium-max"
                        type="number"
                        value={weightRangeForm.mediumMax}
                        onChange={(e) => setWeightRangeForm({ ...weightRangeForm, mediumMax: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-semibold">Large</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="large-min" className="text-xs text-muted-foreground">Min (lbs)</Label>
                      <Input
                        id="large-min"
                        type="number"
                        value={weightRangeForm.largeMin}
                        onChange={(e) => setWeightRangeForm({ ...weightRangeForm, largeMin: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="large-max" className="text-xs text-muted-foreground">Max (lbs)</Label>
                      <Input
                        id="large-max"
                        type="number"
                        value={weightRangeForm.largeMax}
                        onChange={(e) => setWeightRangeForm({ ...weightRangeForm, largeMax: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-semibold">Giant</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="giant-min" className="text-xs text-muted-foreground">Min (lbs)</Label>
                      <Input
                        id="giant-min"
                        type="number"
                        value={weightRangeForm.giantMin}
                        onChange={(e) => setWeightRangeForm({ ...weightRangeForm, giantMin: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Max</Label>
                      <Input disabled value="No max" className="bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setWeightRangeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveWeightRanges} className="bg-primary text-primary-foreground">
                Save Weight Ranges
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
