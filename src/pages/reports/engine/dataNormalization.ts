/**
 * Data Normalization Layer
 * Transforms raw app data into normalized structures for analytics
 */

import {
  NormalizedAppointment,
  NormalizedTransaction,
  NormalizedStaff,
  NormalizedClient,
  NormalizedInventoryItem,
  NormalizedMessage,
  NormalizedService,
  NormalizedDataStore,
  PetSize,
  Channel,
  ClientType,
  PaymentMethod,
  AppointmentStatus,
} from '../types'
import { Appointment, Client, Staff, InventoryItem, Transaction } from '@/lib/types'

/**
 * Normalize appointments from app data
 */
export function normalizeAppointments(
  appointments: Appointment[],
  transactions: Transaction[],
  clients: Client[]
): NormalizedAppointment[] {
  const clientMap = new Map(clients.map(c => [c.id, c]))
  const transactionsByAppt = new Map<string, Transaction>()
  
  transactions.forEach(t => {
    if (t.appointmentId) {
      transactionsByAppt.set(t.appointmentId, t)
    }
  })

  return appointments.map(appt => {
    const client = clientMap.get(appt.clientId)
    const transaction = transactionsByAppt.get(appt.id)
    
    // Determine client type
    const clientAppointments = appointments.filter(a => 
      a.clientId === appt.clientId && 
      new Date(a.date) < new Date(appt.date)
    )
    const clientType: ClientType = clientAppointments.length === 0 ? 'new' : 'returning'
    
    // Calculate durations
    const startParts = appt.startTime.split(':').map(Number)
    const endParts = appt.endTime.split(':').map(Number)
    const scheduledMinutes = (endParts[0] * 60 + endParts[1]) - (startParts[0] * 60 + startParts[1])
    
    // Map status
    const statusMap: Record<string, AppointmentStatus> = {
      'completed': 'completed',
      'paid': 'completed',
      'notified': 'completed',
      'cancelled': 'cancelled',
      'scheduled': 'scheduled',
      'checked-in': 'scheduled',
      'in-progress': 'scheduled',
    }
    const status = statusMap[appt.status] || 'scheduled'
    
    // Determine channel (simplified - in real app would track this)
    const channel: Channel = 'online'
    
    // Calculate amounts in cents
    const subtotalCents = Math.round(appt.totalPrice * 100)
    const discountCents = 0 // Would come from transaction
    const taxCents = transaction ? Math.round((transaction.total - transaction.subtotal - (transaction.tipAmount || 0)) * 100) : 0
    const tipCents = Math.round((appt.tipAmount || 0) * 100)
    const totalCents = subtotalCents + taxCents + tipCents - discountCents
    const netCents = subtotalCents - discountCents
    
    // Payment method from transaction or tip payment method
    const paymentMethod: PaymentMethod = 
      transaction?.paymentMethod?.toLowerCase() === 'cash' ? 'cash' :
      transaction?.paymentMethod?.toLowerCase() === 'card' ? 'card' :
      appt.tipPaymentMethod === 'cash' ? 'cash' :
      appt.tipPaymentMethod === 'card' ? 'card' : 'card'
    
    // Normalize services
    const services: NormalizedService[] = appt.services.map(s => ({
      id: s.serviceId,
      name: s.serviceName,
      category: s.type === 'main' ? 'Main Services' : 'Add-ons',
      priceCents: Math.round(s.price * 100),
      durationMinutes: 30, // Default, would calculate based on service
    }))

    // Map pet weight category
    const petSizeMap: Record<string, PetSize> = {
      'small': 'small',
      'medium': 'medium',
      'large': 'large',
      'giant': 'giant',
    }
    
    return {
      id: appt.id,
      clientId: appt.clientId,
      clientName: appt.clientName,
      petId: appt.petId,
      petName: appt.petName,
      petWeightCategory: petSizeMap[appt.petWeightCategory] || 'medium',
      groomerId: appt.groomerId,
      groomerName: appt.groomerName,
      serviceDate: appt.date,
      checkoutDate: status === 'completed' ? appt.date : undefined,
      transactionDate: transaction?.date,
      startTime: appt.startTime,
      endTime: appt.endTime,
      scheduledDurationMinutes: scheduledMinutes,
      services,
      subtotalCents,
      discountCents,
      taxCents,
      tipCents,
      totalCents,
      netCents,
      status,
      channel,
      clientType,
      paymentMethod,
      rebookedWithin24h: false, // Would calculate from booking data
      rebookedWithin7d: false,
      rebookedWithin30d: false,
      noShowFlag: status === 'no-show',
      lateCancelFlag: false, // Would calculate based on cancellation timing
      reminderSent: true, // Assume reminders sent
      reminderConfirmed: true, // Assume confirmed
      createdAt: appt.createdAt,
    }
  })
}

/**
 * Normalize transactions from app data
 */
export function normalizeTransactions(transactions: Transaction[]): NormalizedTransaction[] {
  return transactions.map(t => {
    const subtotalCents = Math.round(t.subtotal * 100)
    const discountCents = Math.round(t.discount * 100)
    const totalCents = Math.round(t.total * 100)
    const tipCents = Math.round(t.tipAmount * 100)
    const taxCents = totalCents - subtotalCents - tipCents + discountCents
    const refundCents = t.status === 'refunded' ? totalCents : 0
    
    // Estimate processing fee (2.9% + $0.30 for card)
    const isCard = t.paymentMethod.toLowerCase().includes('card')
    const processingFeeCents = isCard ? Math.round(totalCents * 0.029 + 30) : 0
    
    const paymentMethodMap: Record<string, PaymentMethod> = {
      'cash': 'cash',
      'card': 'card',
      'credit card': 'card',
      'debit card': 'card',
    }
    
    return {
      id: t.id,
      appointmentId: t.appointmentId,
      date: t.date,
      clientId: t.clientId,
      clientName: t.clientName,
      subtotalCents,
      discountCents,
      taxCents,
      tipCents,
      totalCents,
      refundCents,
      processingFeeCents,
      netToBank: totalCents - processingFeeCents - refundCents,
      paymentMethod: paymentMethodMap[t.paymentMethod.toLowerCase()] || 'other',
      status: t.status,
    }
  })
}

/**
 * Normalize staff from app data
 */
export function normalizeStaff(staff: Staff[]): NormalizedStaff[] {
  return staff.map(s => ({
    id: s.id,
    name: s.name,
    role: s.role,
    isGroomer: s.isGroomer,
    hourlyRateCents: s.hourlyRate ? Math.round(parseFloat(s.hourlyRate) * 100) : undefined,
    commissionPercent: 40, // Default commission
    hireDate: s.hireDate,
    status: s.status === 'Active' ? 'active' : s.status === 'On Leave' ? 'on-leave' : 'inactive',
  }))
}

/**
 * Normalize clients from app data
 */
export function normalizeClients(clients: Client[], appointments: NormalizedAppointment[]): NormalizedClient[] {
  return clients.map(c => {
    const clientAppointments = appointments
      .filter(a => a.clientId === c.id && a.status === 'completed')
      .sort((a, b) => new Date(a.serviceDate).getTime() - new Date(b.serviceDate).getTime())
    
    const totalSpentCents = clientAppointments.reduce((sum, a) => sum + a.totalCents, 0)
    
    return {
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      createdAt: c.createdAt || new Date().toISOString(),
      firstVisitDate: clientAppointments[0]?.serviceDate,
      lastVisitDate: clientAppointments[clientAppointments.length - 1]?.serviceDate,
      totalVisits: clientAppointments.length,
      totalSpentCents,
      referralSource: c.referralSource,
      city: c.address?.city,
      zip: c.address?.zip,
    }
  })
}

/**
 * Normalize inventory items from app data
 */
export function normalizeInventoryItems(items: InventoryItem[]): NormalizedInventoryItem[] {
  return items.map(i => ({
    id: i.id,
    name: i.name,
    category: i.category,
    sku: i.sku,
    quantityOnHand: i.quantity,
    unitCostCents: Math.round(i.cost * 100),
    reorderLevel: i.reorderLevel,
    linkedServiceIds: [],
    usagePerAppointment: i.category === 'supply' ? 0.1 : 0, // Estimate
  }))
}

/**
 * Generate sample messages (since app doesn't have messages yet)
 */
export function normalizeMessages(): NormalizedMessage[] {
  // Return empty array - messages would be populated when feature exists
  return []
}

/**
 * Extract unique services from appointments
 */
export function extractServices(appointments: NormalizedAppointment[]): NormalizedService[] {
  const serviceMap = new Map<string, NormalizedService>()
  
  appointments.forEach(appt => {
    appt.services.forEach(service => {
      if (!serviceMap.has(service.id)) {
        serviceMap.set(service.id, service)
      }
    })
  })
  
  return Array.from(serviceMap.values())
}

/**
 * Create complete normalized data store from raw app data
 */
export function createNormalizedDataStore(
  rawAppointments: Appointment[],
  rawTransactions: Transaction[],
  rawStaff: Staff[],
  rawClients: Client[],
  rawInventory: InventoryItem[]
): NormalizedDataStore {
  const appointments = normalizeAppointments(rawAppointments, rawTransactions, rawClients)
  const transactions = normalizeTransactions(rawTransactions)
  const staff = normalizeStaff(rawStaff)
  const clients = normalizeClients(rawClients, appointments)
  const inventoryItems = normalizeInventoryItems(rawInventory)
  const messages = normalizeMessages()
  const services = extractServices(appointments)
  
  return {
    appointments,
    transactions,
    staff,
    clients,
    inventoryItems,
    messages,
    services,
  }
}

/**
 * Generate hash for filter state (used for caching)
 */
export function generateFilterHash(filters: Record<string, unknown>): string {
  const sortedKeys = Object.keys(filters).sort()
  const values = sortedKeys.map(k => `${k}:${JSON.stringify(filters[k])}`)
  return values.join('|')
}
