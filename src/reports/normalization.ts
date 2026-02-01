import { Appointment, Client, InventoryItem, Staff, Transaction } from '@/lib/types'
import { NormalizedData, NormalizedAppointment, NormalizedClient, NormalizedInventoryItem, NormalizedStaff, NormalizedTransaction } from './types'

const toCents = (value: number | undefined) => Math.round((value || 0) * 100)

const parseHourlyRate = (rate?: string) => {
  if (!rate) return undefined
  const parsed = Number(rate.replace(/[^0-9.]/g, ''))
  if (Number.isNaN(parsed)) return undefined
  return Math.round(parsed * 100)
}

const deriveServiceCategory = (name: string, type: 'main' | 'addon') => {
  if (type === 'addon') return 'Add-ons'
  const lowered = name.toLowerCase()
  if (lowered.includes('bath')) return 'Bath'
  if (lowered.includes('trim')) return 'Trim'
  if (lowered.includes('full')) return 'Full Groom'
  return 'Grooming'
}

const deriveChannel = (appointment: Appointment) => {
  const note = appointment.notes?.toLowerCase() || ''
  if (note.includes('online')) return 'online'
  if (note.includes('walk')) return 'walk-in'
  return 'phone'
}

export const normalizeReportsData = (params: {
  appointments: Appointment[]
  transactions: Transaction[]
  clients: Client[]
  staff: Staff[]
  inventory: InventoryItem[]
  messages?: Array<{ id: string; channel: string; sentAt: string; cost?: number; delivered?: boolean; confirmed?: boolean; clientId?: string; appointmentId?: string }>
}): NormalizedData => {
  const appointments = params.appointments || []
  const transactions = params.transactions || []
  const clients = params.clients || []
  const staff = params.staff || []
  const inventory = params.inventory || []
  const messages = params.messages || []

  const clientFirstVisit = new Map<string, string>()
  appointments
    .filter((appointment) => appointment.status !== 'cancelled')
    .forEach((appointment) => {
      if (!clientFirstVisit.has(appointment.clientId)) {
        clientFirstVisit.set(appointment.clientId, appointment.date)
      } else if (appointment.date < (clientFirstVisit.get(appointment.clientId) || appointment.date)) {
        clientFirstVisit.set(appointment.clientId, appointment.date)
      }
    })

  const normalizedClients: NormalizedClient[] = clients.map((client) => {
    const firstVisit = clientFirstVisit.get(client.id)
    return {
      id: client.id,
      name: client.name,
      createdAt: client.createdAt,
      city: client.address?.city,
      zip: client.address?.zip,
      type: firstVisit ? 'returning' : 'new',
      referralSource: client.referralSource
    }
  })

  const normalizedStaff: NormalizedStaff[] = staff.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    hourlyRateCents: parseHourlyRate(member.hourlyRate),
    status: member.status
  }))

  const normalizedAppointments: NormalizedAppointment[] = appointments.map((appointment) => {
    const services = appointment.services.map((service) => ({
      id: service.serviceId,
      name: service.serviceName,
      category: deriveServiceCategory(service.serviceName, service.type),
      type: service.type,
      priceCents: toCents(service.price),
      durationMinutes: Math.max(15, Math.round((new Date(`1970-01-01T${appointment.endTime}`)
        .getTime() - new Date(`1970-01-01T${appointment.startTime}`).getTime()) / 60000))
    }))

    return {
      id: appointment.id,
      clientId: appointment.clientId,
      clientName: appointment.clientName,
      petId: appointment.petId,
      petName: appointment.petName,
      petSize: appointment.petWeightCategory,
      staffId: appointment.groomerId,
      staffName: appointment.groomerName,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status,
      channel: deriveChannel(appointment),
      clientType: clientFirstVisit.get(appointment.clientId) === appointment.date ? 'new' : 'returning',
      services,
      totalCents: toCents(appointment.totalPrice),
      tipCents: toCents(appointment.tipAmount),
      createdAt: appointment.createdAt,
      location: undefined
    }
  })

  const normalizedTransactions: NormalizedTransaction[] = transactions.map((transaction) => {
    const subtotal = toCents(transaction.subtotal)
    const discount = toCents(transaction.discount)
    const tip = toCents(transaction.tipAmount)
    const tax = toCents(transaction.additionalFees)
    const total = toCents(transaction.total)
    const refund = transaction.status === 'refunded' ? total : 0
    return {
      id: transaction.id,
      appointmentId: transaction.appointmentId,
      clientId: transaction.clientId,
      clientName: transaction.clientName,
      date: transaction.date,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      subtotalCents: subtotal,
      discountCents: discount,
      refundCents: refund,
      taxCents: tax,
      tipCents: tip,
      totalCents: total,
      items: transaction.items.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        quantity: item.quantity,
        totalCents: toCents(item.total),
        category: item.type === 'product' ? 'Retail' : 'Service'
      }))
    }
  })

  const normalizedInventory: NormalizedInventoryItem[] = inventory.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    unitCostCents: toCents(item.cost),
    quantity: item.quantity,
    reorderLevel: item.reorderLevel,
    linkedServices: []
  }))

  const normalizedMessages = messages.map((message) => ({
    id: message.id,
    channel: message.channel,
    sentAt: message.sentAt,
    costCents: toCents(message.cost || 0),
    delivered: message.delivered ?? true,
    confirmed: message.confirmed ?? false,
    clientId: message.clientId,
    appointmentId: message.appointmentId
  }))

  const serviceCatalog = Array.from(
    new Map(
      normalizedAppointments
        .flatMap((appointment) => appointment.services)
        .map((service) => [service.id, { id: service.id, name: service.name, category: service.category }])
    ).values()
  )

  const locations = []

  return {
    appointments: normalizedAppointments,
    transactions: normalizedTransactions,
    clients: normalizedClients,
    staff: normalizedStaff,
    inventoryItems: normalizedInventory,
    messages: normalizedMessages,
    locations,
    serviceCatalog
  }
}
