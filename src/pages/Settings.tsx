import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash, PencilSimple, CaretUp, CaretDown } from "@phosphor-icons/react"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatPayPeriodType, type PayPeriodType, type PayPeriodSettings } from "@/lib/payroll-utils"
import { format, addDays, nextFriday, startOfDay, addWeeks } from 'date-fns'

interface WeightRange {
  id: string
  name: string
  min: number
  max: number | null
}

interface ServicePricing {
  [key: string]: number
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

const DEFAULT_WEIGHT_RANGES: WeightRange[] = [
  { id: 'small', name: 'Small', min: 1, max: 25 },
  { id: 'medium', name: 'Medium', min: 26, max: 50 },
  { id: 'large', name: 'Large', min: 51, max: 80 },
  { id: 'giant', name: 'Giant', min: 81, max: null }
]

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
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("staff")
  const [staffPositionsRaw, setStaffPositionsRaw] = useKV<string[]>("staff-positions", ["Owner", "Groomer", "Front Desk", "Bather"])
  const [newPosition, setNewPosition] = useState("")
  const [editingPosition, setEditingPosition] = useState<string | null>(null)
  const [editPositionValue, setEditPositionValue] = useState("")
  
  const [temperamentOptionsRaw, setTemperamentOptionsRaw] = useKV<string[]>("temperament-options", [
    "Friendly",
    "Energetic",
    "Calm",
    "Nervous",
    "Aggressive",
    "Playful",
    "Shy",
    "Loves treats"
  ])
  const [newTemperament, setNewTemperament] = useState("")
  const [editingTemperament, setEditingTemperament] = useState<string | null>(null)
  const [editTemperamentValue, setEditTemperamentValue] = useState("")
  
  const [mainServicesRaw, setMainServicesRaw] = useKV<MainService[]>("main-services", DEFAULT_MAIN_SERVICES)
  const [addOnsRaw, setAddOnsRaw] = useKV<AddOn[]>("service-addons", DEFAULT_ADDONS)
  const [weightRangesRaw, setWeightRangesRaw] = useKV<WeightRange[]>("weight-ranges", DEFAULT_WEIGHT_RANGES)
  
  const staffPositions = Array.isArray(staffPositionsRaw) ? staffPositionsRaw : ["Owner", "Groomer", "Front Desk", "Bather"]
  const setStaffPositions = (updater: string[] | ((current: string[]) => string[])) => {
    if (typeof updater === 'function') {
      setStaffPositionsRaw((current) => {
        const currentArray = Array.isArray(current) ? current : ["Owner", "Groomer", "Front Desk", "Bather"]
        return updater(currentArray)
      })
    } else {
      setStaffPositionsRaw(updater)
    }
  }
  
  const temperamentOptions = Array.isArray(temperamentOptionsRaw) ? temperamentOptionsRaw : [
    "Friendly",
    "Energetic",
    "Calm",
    "Nervous",
    "Aggressive",
    "Playful",
    "Shy",
    "Loves treats"
  ]
  const setTemperamentOptions = (updater: string[] | ((current: string[]) => string[])) => {
    if (typeof updater === 'function') {
      setTemperamentOptionsRaw((current) => {
        const currentArray = Array.isArray(current) ? current : [
          "Friendly",
          "Energetic",
          "Calm",
          "Nervous",
          "Aggressive",
          "Playful",
          "Shy",
          "Loves treats"
        ]
        return updater(currentArray)
      })
    } else {
      setTemperamentOptionsRaw(updater)
    }
  }
  
  const mainServices = Array.isArray(mainServicesRaw) ? mainServicesRaw : DEFAULT_MAIN_SERVICES
  const setMainServices = (updater: MainService[] | ((current: MainService[]) => MainService[])) => {
    if (typeof updater === 'function') {
      setMainServicesRaw((current) => {
        const currentArray = Array.isArray(current) ? current : DEFAULT_MAIN_SERVICES
        return updater(currentArray)
      })
    } else {
      setMainServicesRaw(updater)
    }
  }
  
  const addOns = Array.isArray(addOnsRaw) ? addOnsRaw : DEFAULT_ADDONS
  const setAddOns = (updater: AddOn[] | ((current: AddOn[]) => AddOn[])) => {
    if (typeof updater === 'function') {
      setAddOnsRaw((current) => {
        const currentArray = Array.isArray(current) ? current : DEFAULT_ADDONS
        return updater(currentArray)
      })
    } else {
      setAddOnsRaw(updater)
    }
  }
  
  const weightRanges = Array.isArray(weightRangesRaw) ? weightRangesRaw : DEFAULT_WEIGHT_RANGES
  const setWeightRanges = (updater: WeightRange[] | ((current: WeightRange[]) => WeightRange[])) => {
    if (typeof updater === 'function') {
      setWeightRangesRaw((current) => {
        const currentArray = Array.isArray(current) ? current : DEFAULT_WEIGHT_RANGES
        return updater(currentArray)
      })
    } else {
      setWeightRangesRaw(updater)
    }
  }
  
  const [editingWeightRangeId, setEditingWeightRangeId] = useState<string | null>(null)
  const [editWeightRangeForm, setEditWeightRangeForm] = useState({
    name: "",
    min: "",
    max: ""
  })
  
  const [weightRangeDialogOpen, setWeightRangeDialogOpen] = useState(false)
  
  const [paymentMethodsRaw, setPaymentMethodsRaw] = useKV<Array<{ id: string; name: string; enabled: boolean }>>("payment-methods", DEFAULT_PAYMENT_METHODS)
  const [newPaymentMethod, setNewPaymentMethod] = useState("")
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<{ id: string; name: string } | null>(null)
  const [editPaymentMethodValue, setEditPaymentMethodValue] = useState("")
  const [deletePaymentMethodId, setDeletePaymentMethodId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  const paymentMethods = Array.isArray(paymentMethodsRaw) ? paymentMethodsRaw : DEFAULT_PAYMENT_METHODS
  const setPaymentMethods = (updater: Array<{ id: string; name: string; enabled: boolean }> | ((current: Array<{ id: string; name: string; enabled: boolean }>) => Array<{ id: string; name: string; enabled: boolean }>)) => {
    if (typeof updater === 'function') {
      setPaymentMethodsRaw((current) => {
        const currentArray = Array.isArray(current) ? current : DEFAULT_PAYMENT_METHODS
        return updater(currentArray)
      })
    } else {
      setPaymentMethodsRaw(updater)
    }
  }
  
  const [mainServiceDialogOpen, setMainServiceDialogOpen] = useState(false)
  const [addOnDialogOpen, setAddOnDialogOpen] = useState(false)
  const [editingMainService, setEditingMainService] = useState<MainService | null>(null)
  const [editingAddOn, setEditingAddOn] = useState<AddOn | null>(null)
  
  const [mainServiceForm, setMainServiceForm] = useState({
    name: "",
    description: "",
    pricingStrategy: "weight" as 'weight' | 'breed' | 'mixed',
    pricing: {} as Record<string, string>,
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
  
  const getNextFriday = (): Date => {
    const today = startOfDay(new Date())
    const friday = nextFriday(today)
    return friday
  }
  
  const getUpcomingFridays = (): Array<{ date: Date; label: string; value: string }> => {
    const fridays: Array<{ date: Date; label: string; value: string }> = []
    const firstFriday = getNextFriday()
    
    for (let i = 0; i < 4; i++) {
      const friday = addWeeks(firstFriday, i)
      const dateStr = format(friday, 'yyyy-MM-dd')
      let label = ''
      
      if (i === 0) {
        label = `This Coming Friday (${format(friday, 'MMM d, yyyy')})`
      } else if (i === 1) {
        label = `Next Friday (${format(friday, 'MMM d, yyyy')})`
      } else if (i === 2) {
        label = `The Friday After That (${format(friday, 'MMM d, yyyy')})`
      } else {
        label = `One More After That (${format(friday, 'MMM d, yyyy')})`
      }
      
      fridays.push({ date: friday, label, value: dateStr })
    }
    
    return fridays
  }
  
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
    } else {
      const nextFri = getNextFriday()
      const payDate = format(nextFri, 'yyyy-MM-dd')
      const periodEnd = addDays(nextFri, -5)
      const periodStart = addDays(periodEnd, -13)
      
      const initialSettings: PayPeriodSettings = {
        type: 'bi-weekly',
        anchorStartDate: format(periodStart, 'yyyy-MM-dd'),
        anchorEndDate: format(periodEnd, 'yyyy-MM-dd'),
        anchorPayDate: payDate
      }
      
      setPayrollFormData(initialSettings)
    }
  }, [payrollSettings])

  const handleAddPosition = () => {
    if (!newPosition.trim()) {
      toast.error("Position name cannot be empty")
      return
    }

    if (staffPositions.includes(newPosition.trim())) {
      toast.error("This position already exists")
      return
    }

    setStaffPositions((current) => [...current, newPosition.trim()])
    setNewPosition("")
    toast.success("Position added successfully")
  }

  const handleDeletePosition = (position: string) => {
    setStaffPositions((current) => current.filter(p => p !== position))
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
      if (staffPositions.includes(editPositionValue.trim())) {
        toast.error("This position already exists")
        return
      }
    }

    setStaffPositions((current) => 
      current.map(p => p === editingPosition ? editPositionValue.trim() : p)
    )
    setEditingPosition(null)
    setEditPositionValue("")
    toast.success("Position updated successfully")
  }

  const handleCancelEditPosition = () => {
    setEditingPosition(null)
    setEditPositionValue("")
  }
  
  const handleAddTemperament = () => {
    if (!newTemperament.trim()) {
      toast.error("Temperament option cannot be empty")
      return
    }

    if (temperamentOptions.includes(newTemperament.trim())) {
      toast.error("This temperament option already exists")
      return
    }

    setTemperamentOptions((current) => [...current, newTemperament.trim()])
    setNewTemperament("")
    toast.success("Temperament option added successfully")
  }

  const handleDeleteTemperament = (temperament: string) => {
    setTemperamentOptions((current) => current.filter(t => t !== temperament))
    toast.success("Temperament option removed successfully")
  }

  const handleEditTemperament = (temperament: string) => {
    setEditingTemperament(temperament)
    setEditTemperamentValue(temperament)
  }

  const handleSaveEditTemperament = () => {
    if (!editTemperamentValue.trim()) {
      toast.error("Temperament option cannot be empty")
      return
    }

    if (editingTemperament && editTemperamentValue.trim() !== editingTemperament) {
      if (temperamentOptions.includes(editTemperamentValue.trim())) {
        toast.error("This temperament option already exists")
        return
      }
    }

    setTemperamentOptions((current) => 
      current.map(t => t === editingTemperament ? editTemperamentValue.trim() : t)
    )
    setEditingTemperament(null)
    setEditTemperamentValue("")
    toast.success("Temperament option updated successfully")
  }

  const handleCancelEditTemperament = () => {
    setEditingTemperament(null)
    setEditTemperamentValue("")
  }
  
  const openMainServiceDialog = (service?: MainService) => {
    if (service) {
      setEditingMainService(service)
      const pricingForm: Record<string, string> = {}
      Object.keys(service.pricing).forEach(key => {
        pricingForm[key] = service.pricing[key].toString()
      })
      setMainServiceForm({
        name: service.name,
        description: service.description,
        pricingStrategy: service.pricingStrategy || 'weight',
        pricing: pricingForm,
        breedPricing: service.breedPricing || []
      })
    } else {
      setEditingMainService(null)
      const pricingForm: Record<string, string> = {}
      weightRanges.forEach(range => {
        pricingForm[range.id] = ""
      })
      setMainServiceForm({
        name: "",
        description: "",
        pricingStrategy: 'weight',
        pricing: pricingForm,
        breedPricing: []
      })
    }
    setMainServiceDialogOpen(true)
  }
  
  const openWeightRangeDialog = () => {
    setWeightRangeDialogOpen(true)
  }
  
  const handleAddWeightRange = () => {
    const newRange: WeightRange = {
      id: `range-${Date.now()}`,
      name: "",
      min: 0,
      max: null
    }
    setWeightRanges((current) => [...current, newRange])
    setEditingWeightRangeId(newRange.id)
    setEditWeightRangeForm({
      name: "",
      min: "0",
      max: ""
    })
  }
  
  const handleDeleteWeightRange = (id: string) => {
    setWeightRanges((current) => current.filter(range => range.id !== id))
    toast.success("Weight range deleted successfully")
  }
  
  const handleEditWeightRange = (range: WeightRange) => {
    setEditingWeightRangeId(range.id)
    setEditWeightRangeForm({
      name: range.name,
      min: range.min.toString(),
      max: range.max?.toString() || ""
    })
  }
  
  const handleSaveWeightRange = () => {
    if (!editingWeightRangeId) return
    
    if (!editWeightRangeForm.name.trim()) {
      toast.error("Range name is required")
      return
    }
    
    const min = parseFloat(editWeightRangeForm.min)
    const max = editWeightRangeForm.max ? parseFloat(editWeightRangeForm.max) : null
    
    if (isNaN(min)) {
      toast.error("Minimum weight must be a valid number")
      return
    }
    
    if (editWeightRangeForm.max && isNaN(max as number)) {
      toast.error("Maximum weight must be a valid number")
      return
    }
    
    setWeightRanges((current) =>
      current.map(range =>
        range.id === editingWeightRangeId
          ? { ...range, name: editWeightRangeForm.name.trim(), min, max }
          : range
      )
    )
    
    setEditingWeightRangeId(null)
    setEditWeightRangeForm({ name: "", min: "", max: "" })
    toast.success("Weight range updated successfully")
  }
  
  const handleCancelEditWeightRange = () => {
    if (editingWeightRangeId) {
      const range = weightRanges.find(r => r.id === editingWeightRangeId)
      if (range && !range.name) {
        setWeightRanges((current) => current.filter(r => r.id !== editingWeightRangeId))
      }
    }
    setEditingWeightRangeId(null)
    setEditWeightRangeForm({ name: "", min: "", max: "" })
  }
  
  const getWeightRangeById = (id: string) => {
    return weightRanges.find(r => r.id === id)
  }
  
  const formatWeightRange = (range: WeightRange) => {
    if (range.max === null) {
      return `${range.min}+ lbs`
    }
    return `${range.min}-${range.max} lbs`
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
    
    const pricing: ServicePricing = {}
    let hasInvalidPrice = false
    
    Object.keys(mainServiceForm.pricing).forEach(key => {
      const price = parseFloat(mainServiceForm.pricing[key])
      if (isNaN(price)) {
        hasInvalidPrice = true
      } else {
        pricing[key] = price
      }
    })
    
    if (hasInvalidPrice) {
      toast.error("All prices must be valid numbers")
      return
    }
    
    const newService: MainService = {
      id: editingMainService?.id || `service-${Date.now()}`,
      name: mainServiceForm.name.trim(),
      description: mainServiceForm.description.trim(),
      pricingStrategy: mainServiceForm.pricingStrategy,
      pricing,
      breedPricing: mainServiceForm.breedPricing
    }
    
    if (editingMainService) {
      setMainServices((current) => 
        current.map(s => s.id === editingMainService.id ? newService : s)
      )
      toast.success("Service updated successfully")
    } else {
      setMainServices((current) => [...current, newService])
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
          current.map(a => a.id === editingAddOn.id ? newAddOn : a)
        )
        toast.success("Add-on updated successfully")
      } else {
        setAddOns((current) => [...current, newAddOn])
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
          current.map(a => a.id === editingAddOn.id ? newAddOn : a)
        )
        toast.success("Add-on updated successfully")
      } else {
        setAddOns((current) => [...current, newAddOn])
        toast.success("Add-on added successfully")
      }
    }
    
    setAddOnDialogOpen(false)
  }
  
  const handleDeleteMainService = (id: string) => {
    setMainServices((current) => current.filter(s => s.id !== id))
    toast.success("Service deleted successfully")
  }
  
  const handleDeleteAddOn = (id: string) => {
    setAddOns((current) => current.filter(a => a.id !== id))
    toast.success("Add-on deleted successfully")
  }
  
  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.trim()) {
      toast.error("Payment method name cannot be empty")
      return
    }

    if (paymentMethods.some(pm => pm.name.toLowerCase() === newPaymentMethod.trim().toLowerCase())) {
      toast.error("This payment method already exists")
      return
    }

    setPaymentMethods((current) => [
      ...current, 
      { id: `pm-${Date.now()}`, name: newPaymentMethod.trim(), enabled: true }
    ])
    setNewPaymentMethod("")
    toast.success("Payment method added successfully")
  }

  const handleDeletePaymentMethod = (id: string) => {
    setDeletePaymentMethodId(id)
    setDeleteDialogOpen(true)
  }
  
  const confirmDeletePaymentMethod = () => {
    if (deletePaymentMethodId) {
      setPaymentMethods((current) =>
        current.filter(pm => pm.id !== deletePaymentMethodId)
      )
      toast.success("Payment method removed successfully")
    }
    setDeleteDialogOpen(false)
    setDeletePaymentMethodId(null)
  }

  const handleTogglePaymentMethod = (id: string) => {
    setPaymentMethods((current) =>
      current.map(pm => pm.id === id ? { ...pm, enabled: !pm.enabled } : pm)
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
      if (paymentMethods.some(pm => pm.name.toLowerCase() === editPaymentMethodValue.trim().toLowerCase())) {
        toast.error("This payment method already exists")
        return
      }
    }

    setPaymentMethods((current) =>
      current.map(pm => pm.id === editingPaymentMethod?.id ? { ...pm, name: editPaymentMethodValue.trim() } : pm)
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
      const methods = [...current]
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
          const nextFri = getNextFriday()
          updated.anchorPayDate = format(nextFri, 'yyyy-MM-dd')
          const periodEnd = addDays(nextFri, -5)
          updated.anchorEndDate = format(periodEnd, 'yyyy-MM-dd')
          const periodStart = addDays(periodEnd, -13)
          updated.anchorStartDate = format(periodStart, 'yyyy-MM-dd')
        }
        return updated
      }
      
      if (field === 'anchorPayDate' && updated.type === 'bi-weekly') {
        const payDate = new Date(value)
        if (!isNaN(payDate.getTime())) {
          const periodEnd = addDays(payDate, -5)
          const periodStart = addDays(periodEnd, -13)
          
          updated.anchorEndDate = format(periodEnd, 'yyyy-MM-dd')
          updated.anchorStartDate = format(periodStart, 'yyyy-MM-dd')
        }
      }
      
      return updated
    })
  }
  
  const handleSavePayrollSettings = () => {
    setPayrollSettings({ payPeriod: payrollFormData })
    toast.success("Payroll settings saved successfully")
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto -mx-6 px-6 mb-6 flex justify-center">
            <TabsList className="bg-secondary/50 inline-flex">
              <TabsTrigger 
                value="staff" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                Staff
              </TabsTrigger>
              <TabsTrigger 
                value="business" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                Business
              </TabsTrigger>
              <TabsTrigger 
                value="payroll" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                Payroll
              </TabsTrigger>
              <TabsTrigger 
                value="services" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                Services
              </TabsTrigger>
              <TabsTrigger 
                value="pets" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                Pets
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="pos" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                POS
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                Appearance
              </TabsTrigger>
              <TabsTrigger 
                value="dev-pages" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                Dev Pages
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="staff" className="mt-0">
            <Card className="p-4 md:p-6 bg-card border-border">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Staff Positions</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Manage the available positions for your staff members. These will appear in the dropdown when adding or editing staff.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-3">
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
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full md:w-auto"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Position
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {staffPositions.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No positions configured. Add your first position above.
                      </div>
                    ) : (
                      staffPositions.map((position) => (
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
                              <div className="flex gap-2 shrink-0">
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
                              <span className="font-medium break-all">{position}</span>
                              <div className="flex gap-2 shrink-0">
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
            <Card className="p-4 md:p-6 bg-card border-border">
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
                      <div key={hours.day} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-4 rounded-lg bg-secondary/20 border border-border">
                        <div className="w-full md:w-28">
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
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 md:flex-1">
                            <div className="flex items-center gap-2 flex-1">
                              <Label htmlFor={`open-time-${hours.day}`} className="text-sm text-muted-foreground w-12">
                                From
                              </Label>
                              <Input
                                id={`open-time-${hours.day}`}
                                type="time"
                                value={hours.openTime}
                                onChange={(e) => handleHoursChange(index, 'openTime', e.target.value)}
                                className="w-full sm:w-32"
                              />
                            </div>
                            
                            <div className="flex items-center gap-2 flex-1">
                              <Label htmlFor={`close-time-${hours.day}`} className="text-sm text-muted-foreground w-12">
                                To
                              </Label>
                              <Input
                                id={`close-time-${hours.day}`}
                                type="time"
                                value={hours.closeTime}
                                onChange={(e) => handleHoursChange(index, 'closeTime', e.target.value)}
                                className="w-full sm:w-32"
                              />
                            </div>
                          </div>
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
            <Card className="p-4 md:p-6 bg-card border-border">
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
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      How often you pay your staff members
                    </p>
                  </div>

                  {payrollFormData.type === 'bi-weekly' && (
                    <>
                      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <h4 className="text-sm font-semibold mb-2 text-primary">Bi-Weekly Payroll Rules</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Pay period: 2 weeks</li>
                          <li>• Work weeks: Monday → Sunday</li>
                          <li>• Payday: Friday</li>
                          <li>• Payroll locks: When the ACH file is sent (default Wednesday night)</li>
                          <li>• Holidays: If Friday is a bank holiday, pay Thursday</li>
                          <li>• Overtime: Over 40 hours in a week = 1.5×</li>
                        </ul>
                      </div>

                      <div className="border-t border-border pt-6 space-y-4">
                        <div>
                          <h3 className="text-base font-semibold mb-1">First Payday Friday</h3>
                          <p className="text-sm text-muted-foreground">
                            Select which Friday you want your first payday to be. The system will calculate all future pay periods from this date.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="first-payday-friday" className="text-sm font-medium">
                            Choose Your First Payday Friday
                          </Label>
                          <Select
                            value={payrollFormData.anchorPayDate}
                            onValueChange={(value) => handlePayrollChange('anchorPayDate', value)}
                          >
                            <SelectTrigger id="first-payday-friday" className="w-full">
                              <SelectValue placeholder="Select a Friday" />
                            </SelectTrigger>
                            <SelectContent>
                              {getUpcomingFridays().map((friday) => (
                                <SelectItem key={friday.value} value={friday.value}>
                                  {friday.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            This will be the Friday you pay your staff for the most recent 2-week period
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <p className="text-sm text-blue-400">
                            <strong>How it works:</strong> If you select {payrollFormData.anchorPayDate && format(new Date(payrollFormData.anchorPayDate), 'MMM d, yyyy')}, your staff will be paid every other Friday starting from that date. The pay period will cover the 2 weeks ending the Sunday before payday.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Refunds / Chargebacks Policy</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Configure how commission is handled when refunds or chargebacks occur
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20">
                      <div className="flex-1">
                        <Label className="font-medium text-base">Reverse commission on full refunds</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Commission is reversed when a full refund is issued
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20">
                      <div className="flex-1">
                        <Label className="font-medium text-base">Prorate commission on partial refunds</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Commission is reduced proportionally to the refund amount
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20">
                      <div className="flex-1">
                        <Label className="font-medium text-base">Reverse commission on chargebacks</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Commission is reversed on disputed payment amounts
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
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
              <Card className="p-4 md:p-6 bg-card border-border">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Weight Size Configuration</h2>
                      <p className="text-sm text-muted-foreground">
                        Define weight ranges for each size category
                      </p>
                    </div>
                    <Button
                      onClick={openWeightRangeDialog}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full md:w-auto"
                    >
                      <PencilSimple size={18} className="mr-2" />
                      Edit Weight Ranges
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {weightRanges.map((range) => (
                      <div key={range.id} className="bg-background/50 p-3 rounded-md">
                        <div className="text-xs text-muted-foreground mb-1">{range.name}</div>
                        <div className="text-lg font-semibold">
                          {formatWeightRange(range)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 md:p-6 bg-card border-border">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Main Services</h2>
                      <p className="text-sm text-muted-foreground">
                        Core grooming services with flexible pricing strategies
                      </p>
                    </div>
                    <Button
                      onClick={() => openMainServiceDialog()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full md:w-auto"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Main Service
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {mainServices.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No main services configured. Add your first service above.
                      </div>
                    ) : (
                      mainServices.map((service) => (
                        <div
                          key={service.id}
                          className="p-5 rounded-lg bg-secondary/20 border border-border hover:border-primary/50 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">{service.name}</h3>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                                  {service.pricingStrategy === 'weight' ? 'By Weight' : service.pricingStrategy === 'breed' ? 'By Breed' : 'Mixed Pricing'}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                            </div>
                            <div className="flex gap-2 self-end md:self-start">
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

              <Card className="p-4 md:p-6 bg-card border-border">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Add-On Services</h2>
                      <p className="text-sm text-muted-foreground">
                        Optional services that can be added to any main service
                      </p>
                    </div>
                    <Button
                      onClick={() => openAddOnDialog()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full md:w-auto"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Add-On
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {addOns.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No add-ons configured. Add your first add-on above.
                      </div>
                    ) : (
                      addOns.map((addOn) => (
                        <div
                          key={addOn.id}
                          className={addOn.hasSizePricing ? "p-5 rounded-lg bg-secondary/20 border border-border hover:border-primary/50 transition-colors" : "flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-lg bg-secondary/20 border border-border hover:border-primary/50 transition-colors"}
                        >
                          {addOn.hasSizePricing && addOn.pricing ? (
                            <>
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-base">{addOn.name}</h3>
                                </div>
                                <div className="flex gap-2 self-end md:self-start">
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
                                <span className="font-medium break-all">{addOn.name}</span>
                                <span className="text-primary font-semibold shrink-0">${addOn.price}</span>
                              </div>
                              <div className="flex gap-2 shrink-0 self-end md:self-auto">
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

          <TabsContent value="pets" className="mt-0">
            <Card className="p-4 md:p-6 bg-card border-border">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Temperament Options</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Manage the available temperament options that appear when adding or editing pets.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                      <Label htmlFor="new-temperament" className="sr-only">New Temperament Option</Label>
                      <Input
                        id="new-temperament"
                        placeholder="Enter new temperament option (e.g., Anxious)"
                        value={newTemperament}
                        onChange={(e) => setNewTemperament(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddTemperament()
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleAddTemperament}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full md:w-auto"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Option
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {temperamentOptions.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No temperament options configured. Add your first option above.
                      </div>
                    ) : (
                      temperamentOptions.map((temperament) => (
                        <div
                          key={temperament}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border hover:border-primary/50 transition-colors"
                        >
                          {editingTemperament === temperament ? (
                            <>
                              <Input
                                value={editTemperamentValue}
                                onChange={(e) => setEditTemperamentValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveEditTemperament()
                                  } else if (e.key === 'Escape') {
                                    handleCancelEditTemperament()
                                  }
                                }}
                                className="flex-1 mr-3"
                                autoFocus
                              />
                              <div className="flex gap-2 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancelEditTemperament}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-primary text-primary-foreground"
                                  onClick={handleSaveEditTemperament}
                                >
                                  Save
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="font-medium break-all">{temperament}</span>
                              <div className="flex gap-2 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-foreground hover:bg-primary/10"
                                  onClick={() => handleEditTemperament(temperament)}
                                >
                                  <PencilSimple size={18} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteTemperament(temperament)}
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

          <TabsContent value="notifications" className="mt-0">
            <Card className="p-8 md:p-12 bg-card border-border text-center">
              <p className="text-muted-foreground">
                Notification settings will appear here.
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-0">
            <Card className="p-4 md:p-6 bg-card border-border">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Appearance Settings</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Customize the look and feel of your Scruffy Butts application.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold mb-2">Appearance Mode</h3>
                  </div>
                  
                  <div className="p-8 md:p-12 text-center rounded-lg bg-secondary/20 border border-border">
                    <p className="text-muted-foreground">
                      Appearance mode options will appear here.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="dev-pages" className="mt-0">
            <Card className="p-4 md:p-6 bg-card border-border">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Dev Pages</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Pages that exist in the app but don't have navigation routes. These are typically accessed through email links or other external triggers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => navigate('/dev/staff-onboarding')}
                    className="p-4 rounded-lg bg-secondary/20 border border-border hover:border-primary/50 transition-colors flex flex-col gap-2 text-left"
                  >
                    <h3 className="font-semibold text-base">Staff Account Creation</h3>
                    <p className="text-sm text-muted-foreground">
                      First page a staff member sees when clicking the email link to create their account.
                    </p>
                    <span className="text-xs text-primary mt-2">Click to view →</span>
                  </button>

                  <button
                    onClick={() => navigate('/dev/staff-profile-setup')}
                    className="p-4 rounded-lg bg-secondary/20 border border-border hover:border-primary/50 transition-colors flex flex-col gap-2 text-left"
                  >
                    <h3 className="font-semibold text-base">Staff Profile Setup</h3>
                    <p className="text-sm text-muted-foreground">
                      Page where staff members complete their profile after account creation.
                    </p>
                    <span className="text-xs text-primary mt-2">Click to view →</span>
                  </button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pos" className="mt-0">
            <Card className="p-4 md:p-6 bg-card border-border">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Payment Methods</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Configure available payment methods for POS transactions. You can add, remove, enable/disable, and reorder payment methods.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-3">
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
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full md:w-auto"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Method
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {paymentMethods.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No payment methods configured. Add your first payment method above.
                      </div>
                    ) : (
                      paymentMethods.map((method, index) => (
                        <div
                          key={method.id}
                          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-lg border transition-colors ${
                            method.enabled 
                              ? 'bg-secondary/20 border-border hover:border-primary/50' 
                              : 'bg-muted/30 border-border/50 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex flex-col shrink-0">
                              <button
                                onClick={() => handleMovePaymentMethod(method.id, 'up')}
                                disabled={index === 0}
                                className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                              >
                                <CaretUp size={18} weight="bold" />
                              </button>
                              <button
                                onClick={() => handleMovePaymentMethod(method.id, 'down')}
                                disabled={index === paymentMethods.length - 1}
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
                                className="flex-1"
                                autoFocus
                              />
                            ) : (
                              <span className="font-medium break-all">{method.name}</span>
                            )}
                          </div>
                          
                          <div className="flex gap-2 items-center self-end md:self-auto">
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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => {
                                    handleCancelEditPaymentMethod()
                                    handleDeletePaymentMethod(method.id)
                                  }}
                                >
                                  <Trash size={16} className="mr-1" />
                                  Delete
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] md:w-full">
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
                  {weightRanges.map((range) => (
                    <div key={range.id} className="space-y-2">
                      <Label htmlFor={`${range.id}-price`} className="text-sm text-muted-foreground">
                        {range.name} ({formatWeightRange(range)})
                      </Label>
                      <Input
                        id={`${range.id}-price`}
                        type="number"
                        placeholder="0"
                        value={mainServiceForm.pricing?.[range.id] || ""}
                        onChange={(e) => setMainServiceForm({ 
                          ...mainServiceForm, 
                          pricing: { ...mainServiceForm.pricing, [range.id]: e.target.value }
                        })}
                      />
                    </div>
                  ))}
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
          <DialogContent className="max-w-lg w-[95vw] md:w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Weight Ranges</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-5 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Define weight ranges for size categories. These ranges are used for pricing throughout the app.
                </p>
                <Button
                  onClick={handleAddWeightRange}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto shrink-0"
                >
                  <Plus size={16} className="mr-2" />
                  Add Range
                </Button>
              </div>
              
              <div className="space-y-3">
                {weightRanges.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No weight ranges configured. Add your first range above.
                  </div>
                ) : (
                  weightRanges.map((range) => (
                    <div
                      key={range.id}
                      className="flex items-start gap-3 p-4 rounded-lg bg-secondary/20 border border-border"
                    >
                      {editingWeightRangeId === range.id ? (
                        <>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor={`edit-name-${range.id}`} className="text-xs text-muted-foreground">
                                Name
                              </Label>
                              <Input
                                id={`edit-name-${range.id}`}
                                placeholder="e.g., Small"
                                value={editWeightRangeForm.name}
                                onChange={(e) => setEditWeightRangeForm({ ...editWeightRangeForm, name: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveWeightRange()
                                  if (e.key === 'Escape') handleCancelEditWeightRange()
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`edit-min-${range.id}`} className="text-xs text-muted-foreground">
                                Min (lbs)
                              </Label>
                              <Input
                                id={`edit-min-${range.id}`}
                                type="number"
                                value={editWeightRangeForm.min}
                                onChange={(e) => setEditWeightRangeForm({ ...editWeightRangeForm, min: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveWeightRange()
                                  if (e.key === 'Escape') handleCancelEditWeightRange()
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`edit-max-${range.id}`} className="text-xs text-muted-foreground">
                                Max (lbs) - leave empty for no max
                              </Label>
                              <Input
                                id={`edit-max-${range.id}`}
                                type="number"
                                placeholder="No max"
                                value={editWeightRangeForm.max}
                                onChange={(e) => setEditWeightRangeForm({ ...editWeightRangeForm, max: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveWeightRange()
                                  if (e.key === 'Escape') handleCancelEditWeightRange()
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 pt-0 md:pt-5 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelEditWeightRange}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="bg-primary text-primary-foreground"
                              onClick={handleSaveWeightRange}
                            >
                              Save
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex-1">
                            <div className="font-semibold text-base mb-1">{range.name}</div>
                            <div className="text-sm text-muted-foreground">{formatWeightRange(range)}</div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-foreground hover:bg-primary/10"
                              onClick={() => handleEditWeightRange(range)}
                            >
                              <PencilSimple size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteWeightRange(range.id)}
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
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setWeightRangeDialogOpen(false)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={addOnDialogOpen} onOpenChange={setAddOnDialogOpen}>
          <DialogContent className="max-w-2xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto">
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
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this payment method? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setDeleteDialogOpen(false)
                setDeletePaymentMethodId(null)
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeletePaymentMethod}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
