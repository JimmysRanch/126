export interface Pet {
  id: string
  name: string
  breed: string
  weight: number
  weightCategory: 'small' | 'medium' | 'large' | 'giant'
  ownerId: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  pets: Pet[]
}

export interface ServicePricing {
  small: number
  medium: number
  large: number
  giant: number
}

export interface MainService {
  id: string
  name: string
  description: string
  pricing: ServicePricing
}

export interface AddOn {
  id: string
  name: string
  price?: number
  pricing?: ServicePricing
  hasSizePricing: boolean
}

export interface AppointmentService {
  serviceId: string
  serviceName: string
  price: number
  type: 'main' | 'addon'
}

export interface Appointment {
  id: string
  clientId: string
  clientName: string
  petId: string
  petName: string
  petWeight: number
  petWeightCategory: 'small' | 'medium' | 'large' | 'giant'
  groomerId: string
  groomerName: string
  groomerRequested: boolean
  date: string
  startTime: string
  endTime: string
  services: AppointmentService[]
  totalPrice: number
  status: 'scheduled' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled'
  notes?: string
  groomingPreferences?: {
    overallLength?: string
    faceStyle?: string
    handlingNotes?: string[]
    sensitiveAreas?: string[]
    photoWant?: string | null
    photoDontWant?: string | null
  }
  createdAt: string
}

export interface Staff {
  id: string
  name: string
  role: string
  email: string
  phone: string
  status: 'Active' | 'On Leave' | 'Inactive'
  isGroomer: boolean
}

export interface InventoryItem {
  id: string
  name: string
  category: 'retail' | 'supply'
  sku: string
  quantity: number
  price: number
  cost: number
  reorderLevel: number
  supplier?: string
  description?: string
}

export interface InventoryValueSnapshot {
  id: string
  timestamp: string
  totalValue: number
  retailValue: number
  supplyValue: number
  retailPotentialProfit: number
  itemCount: number
  retailCount: number
  supplyCount: number
}

export interface Transaction {
  id: string
  appointmentId?: string
  date: string
  clientId: string
  clientName: string
  items: TransactionItem[]
  subtotal: number
  discount: number
  discountDescription?: string
  additionalFees: number
  additionalFeesDescription?: string
  total: number
  paymentMethod: string
  status: 'pending' | 'completed' | 'refunded'
  type: 'appointment' | 'retail' | 'mixed'
}

export interface TransactionItem {
  id: string
  name: string
  type: 'service' | 'product'
  quantity: number
  price: number
  total: number
}

export function getWeightCategory(weight: number): 'small' | 'medium' | 'large' | 'giant' {
  if (weight <= 25) return 'small'
  if (weight <= 50) return 'medium'
  if (weight <= 80) return 'large'
  return 'giant'
}

export function getPriceForWeight(pricing: ServicePricing, weightCategory: 'small' | 'medium' | 'large' | 'giant'): number {
  return pricing[weightCategory]
}
