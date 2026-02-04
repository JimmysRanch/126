/**
 * Demo Data Generator
 * Creates realistic demo data for the grooming salon management app
 * including staff, clients, pets, appointments, and transactions
 */

import { format, subDays, addDays, setHours, setMinutes } from 'date-fns'
import { v4 as uuid } from 'uuid'
import type { 
  Client, 
  Pet, 
  Appointment, 
  AppointmentService, 
  Staff, 
  Transaction, 
  TransactionItem 
} from './types'

// Demo mode storage key
const DEMO_MODE_KEY = 'demo-mode-enabled'
const DEMO_DATA_IDS_KEY = 'demo-data-ids'

// Helper to generate unique IDs with demo prefix for easy identification
const demoId = (prefix: string) => `demo-${prefix}-${uuid().slice(0, 8)}`

// Demo staff data - 2 groomers and 1 bather
const DEMO_STAFF: Staff[] = [
  {
    id: 'demo-staff-groomer-1',
    name: 'Sarah Mitchell',
    role: 'Groomer',
    email: 'sarah.m@scruffybutts.demo',
    phone: '(555) 123-4567',
    status: 'Active',
    isGroomer: true,
    specialties: ['Poodle cuts', 'Terrier hand-stripping', 'Show grooming'],
    hourlyRate: '50',
    totalAppointments: 156,
    rating: 4.9,
    hireDate: '2023-06-15'
  },
  {
    id: 'demo-staff-groomer-2',
    name: 'Marcus Chen',
    role: 'Groomer',
    email: 'marcus.c@scruffybutts.demo',
    phone: '(555) 234-5678',
    status: 'Active',
    isGroomer: true,
    specialties: ['Asian fusion cuts', 'Large breeds', 'Dematting'],
    hourlyRate: '45',
    totalAppointments: 124,
    rating: 4.8,
    hireDate: '2023-09-01'
  },
  {
    id: 'demo-staff-bather-1',
    name: 'Emily Rodriguez',
    role: 'Bather',
    email: 'emily.r@scruffybutts.demo',
    phone: '(555) 345-6789',
    status: 'Active',
    isGroomer: false,
    specialties: ['Deshedding treatments', 'Puppy bathing', 'Medicated baths'],
    hourlyRate: '18',
    totalAppointments: 89,
    rating: 4.7,
    hireDate: '2024-01-10'
  }
]

// Demo staff profile details
const DEMO_STAFF_PROFILES: Record<string, {
  name: string
  role: string
  email: string
  phone: string
  address: string
  emergencyContact: { name: string; relation: string; phone: string }
  hireDate: string
  status: 'Active' | 'On Leave' | 'Inactive'
  hourlyRate: number
  specialties: string[]
  stats: { totalAppointments: number; revenue: string; avgTip: string; noShows: number; lateArrivals: number }
  upcomingAppointments: Array<{ id: string; client: string; pet: string; service: string; date: string; time: string }>
  recentAppointments: Array<{ id: string; client: string; pet: string; service: string; date: string; time: string }>
}> = {
  'demo-staff-groomer-1': {
    name: 'Sarah Mitchell',
    role: 'Groomer',
    email: 'sarah.m@scruffybutts.demo',
    phone: '(555) 123-4567',
    address: '123 Groomer Lane, Pet City, CA 90210',
    emergencyContact: { name: 'John Mitchell', relation: 'Spouse', phone: '(555) 111-2222' },
    hireDate: '2023-06-15',
    status: 'Active',
    hourlyRate: 50,
    specialties: ['Poodle cuts', 'Terrier hand-stripping', 'Show grooming'],
    stats: { totalAppointments: 156, revenue: '$12,480', avgTip: '$18.50', noShows: 3, lateArrivals: 5 },
    upcomingAppointments: [],
    recentAppointments: []
  },
  'demo-staff-groomer-2': {
    name: 'Marcus Chen',
    role: 'Groomer',
    email: 'marcus.c@scruffybutts.demo',
    phone: '(555) 234-5678',
    address: '456 Clipper Ave, Dogtown, CA 90211',
    emergencyContact: { name: 'Lisa Chen', relation: 'Sister', phone: '(555) 222-3333' },
    hireDate: '2023-09-01',
    status: 'Active',
    hourlyRate: 45,
    specialties: ['Asian fusion cuts', 'Large breeds', 'Dematting'],
    stats: { totalAppointments: 124, revenue: '$9,920', avgTip: '$15.75', noShows: 2, lateArrivals: 4 },
    upcomingAppointments: [],
    recentAppointments: []
  },
  'demo-staff-bather-1': {
    name: 'Emily Rodriguez',
    role: 'Bather',
    email: 'emily.r@scruffybutts.demo',
    phone: '(555) 345-6789',
    address: '789 Suds Street, Washville, CA 90212',
    emergencyContact: { name: 'Maria Rodriguez', relation: 'Mother', phone: '(555) 333-4444' },
    hireDate: '2024-01-10',
    status: 'Active',
    hourlyRate: 18,
    specialties: ['Deshedding treatments', 'Puppy bathing', 'Medicated baths'],
    stats: { totalAppointments: 89, revenue: '$4,450', avgTip: '$8.25', noShows: 1, lateArrivals: 2 },
    upcomingAppointments: [],
    recentAppointments: []
  }
}

// Demo staff compensation configurations
const DEMO_STAFF_COMPENSATION: Record<string, {
  commission: { enabled: boolean; percentage: number }
  hourly: { enabled: boolean; rate: number }
  salary: { enabled: boolean; annualAmount: number }
  weeklyGuarantee: { enabled: boolean; amount: number; payoutMode: 'both' | 'higher' }
  teamOverrides: { enabled: boolean; overrides: Array<{ staffId: string; staffName: string; percentage: number }> }
}> = {
  'demo-staff-groomer-1': {
    commission: { enabled: true, percentage: 50 },
    hourly: { enabled: false, rate: 0 },
    salary: { enabled: false, annualAmount: 0 },
    weeklyGuarantee: { enabled: true, amount: 600, payoutMode: 'higher' },
    teamOverrides: { enabled: false, overrides: [] }
  },
  'demo-staff-groomer-2': {
    commission: { enabled: true, percentage: 45 },
    hourly: { enabled: false, rate: 0 },
    salary: { enabled: false, annualAmount: 0 },
    weeklyGuarantee: { enabled: true, amount: 500, payoutMode: 'higher' },
    teamOverrides: { enabled: false, overrides: [] }
  },
  'demo-staff-bather-1': {
    commission: { enabled: false, percentage: 0 },
    hourly: { enabled: true, rate: 18 },
    salary: { enabled: false, annualAmount: 0 },
    weeklyGuarantee: { enabled: false, amount: 0, payoutMode: 'higher' },
    teamOverrides: { enabled: false, overrides: [] }
  }
}

// Demo staff schedules (weekly templates)
const DEMO_STAFF_SCHEDULES = [
  {
    staffId: 'demo-staff-groomer-1',
    weeklyTemplate: {
      monday: [{ id: 'mon-1', startTime: '09:00', endTime: '17:00' }],
      tuesday: [{ id: 'tue-1', startTime: '09:00', endTime: '17:00' }],
      wednesday: [{ id: 'wed-1', startTime: '09:00', endTime: '17:00' }],
      thursday: [{ id: 'thu-1', startTime: '09:00', endTime: '17:00' }],
      friday: [{ id: 'fri-1', startTime: '09:00', endTime: '15:00' }],
      saturday: [],
      sunday: []
    },
    dateOverrides: [],
    setupComplete: true
  },
  {
    staffId: 'demo-staff-groomer-2',
    weeklyTemplate: {
      monday: [],
      tuesday: [{ id: 'tue-1', startTime: '10:00', endTime: '18:00' }],
      wednesday: [{ id: 'wed-1', startTime: '10:00', endTime: '18:00' }],
      thursday: [{ id: 'thu-1', startTime: '10:00', endTime: '18:00' }],
      friday: [{ id: 'fri-1', startTime: '10:00', endTime: '18:00' }],
      saturday: [{ id: 'sat-1', startTime: '09:00', endTime: '14:00' }],
      sunday: []
    },
    dateOverrides: [],
    setupComplete: true
  },
  {
    staffId: 'demo-staff-bather-1',
    weeklyTemplate: {
      monday: [{ id: 'mon-1', startTime: '08:00', endTime: '14:00' }],
      tuesday: [{ id: 'tue-1', startTime: '08:00', endTime: '14:00' }],
      wednesday: [{ id: 'wed-1', startTime: '08:00', endTime: '14:00' }],
      thursday: [{ id: 'thu-1', startTime: '08:00', endTime: '14:00' }],
      friday: [{ id: 'fri-1', startTime: '08:00', endTime: '14:00' }],
      saturday: [],
      sunday: []
    },
    dateOverrides: [],
    setupComplete: true
  }
]

// Demo pet data
const PET_NAMES = ['Buddy', 'Max', 'Luna', 'Bella', 'Charlie', 'Cooper', 'Daisy', 'Lucy', 'Milo', 'Rocky', 
  'Tucker', 'Bailey', 'Bear', 'Duke', 'Sadie', 'Molly', 'Finn', 'Penny', 'Winston', 'Oliver']

const DOG_BREEDS = [
  { name: 'Golden Retriever', weight: 65 },
  { name: 'Labrador Retriever', weight: 70 },
  { name: 'German Shepherd', weight: 75 },
  { name: 'Poodle (Standard)', weight: 55 },
  { name: 'French Bulldog', weight: 25 },
  { name: 'Yorkshire Terrier', weight: 7 },
  { name: 'Shih Tzu', weight: 12 },
  { name: 'Maltese', weight: 6 },
  { name: 'Cocker Spaniel', weight: 28 },
  { name: 'Pomeranian', weight: 5 },
  { name: 'Schnauzer (Miniature)', weight: 15 },
  { name: 'Bichon Frise', weight: 12 },
  { name: 'Bernese Mountain Dog', weight: 95 },
  { name: 'Cavalier King Charles', weight: 15 },
  { name: 'Australian Shepherd', weight: 55 }
]

const CLIENT_NAMES = [
  { first: 'Jennifer', last: 'Thompson' },
  { first: 'Michael', last: 'Anderson' },
  { first: 'Sarah', last: 'Williams' },
  { first: 'David', last: 'Martinez' },
  { first: 'Emily', last: 'Garcia' },
  { first: 'Robert', last: 'Johnson' },
  { first: 'Amanda', last: 'Brown' },
  { first: 'Christopher', last: 'Davis' },
  { first: 'Jessica', last: 'Wilson' },
  { first: 'Matthew', last: 'Taylor' },
  { first: 'Ashley', last: 'Moore' },
  { first: 'Daniel', last: 'Jackson' },
  { first: 'Nicole', last: 'White' },
  { first: 'Andrew', last: 'Harris' },
  { first: 'Stephanie', last: 'Clark' }
]

// Services and pricing
const MAIN_SERVICES = [
  { id: 'fresh-bath', name: 'Fresh Bath', pricing: { small: 45, medium: 55, large: 65, giant: 75 } },
  { id: 'trim-up', name: 'Trim Up', pricing: { small: 50, medium: 60, large: 70, giant: 80 } },
  { id: 'deluxe-groom', name: 'Deluxe Groom', pricing: { small: 70, medium: 80, large: 90, giant: 100 } }
]

const ADDONS = [
  { id: 'conditioning', name: 'Conditioning Treatment', price: 20 },
  { id: 'teeth', name: 'Teeth Brushing', price: 20 },
  { id: 'nail-grind', name: 'Nail Grinding', price: 15 },
  { id: 'blueberry', name: 'Blueberry Facial', price: 20 }
]

function getWeightCategory(weight: number): 'small' | 'medium' | 'large' | 'giant' {
  if (weight <= 25) return 'small'
  if (weight <= 50) return 'medium'
  if (weight <= 80) return 'large'
  return 'giant'
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate demo clients with pets
function generateDemoClients(): { clients: Client[] } {
  const clients: Client[] = []
  const usedPetNames = new Set<string>()

  CLIENT_NAMES.forEach((name, index) => {
    const clientId = demoId(`client-${index}`)
    const numPets = getRandomNumber(1, 2)
    const clientPets: Pet[] = []

    for (let i = 0; i < numPets; i++) {
      let petName = getRandomItem(PET_NAMES)
      while (usedPetNames.has(`${clientId}-${petName}`)) {
        petName = getRandomItem(PET_NAMES)
      }
      usedPetNames.add(`${clientId}-${petName}`)

      const breed = getRandomItem(DOG_BREEDS)
      const weightVariation = getRandomNumber(-5, 5)
      const weight = Math.max(3, breed.weight + weightVariation)
      
      const pet: Pet = {
        id: demoId(`pet-${index}-${i}`),
        name: petName,
        breed: breed.name,
        weight,
        weightCategory: getWeightCategory(weight),
        ownerId: clientId,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        temperament: [getRandomItem(['Friendly', 'Calm', 'Energetic', 'Nervous', 'Playful'])],
        specialInstructions: Math.random() > 0.7 ? 'Handle with extra care' : undefined
      }
      clientPets.push(pet)
    }

    const client: Client = {
      id: clientId,
      name: `${name.first} ${name.last}`,
      firstName: name.first,
      lastName: name.last,
      email: `${name.first.toLowerCase()}.${name.last.toLowerCase()}@demo.email`,
      phone: `(555) ${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`,
      pets: clientPets,
      createdAt: format(subDays(new Date(), getRandomNumber(30, 365)), 'yyyy-MM-dd'),
      address: {
        street: `${getRandomNumber(100, 9999)} ${getRandomItem(['Oak', 'Maple', 'Pine', 'Cedar', 'Elm'])} ${getRandomItem(['St', 'Ave', 'Blvd', 'Dr'])}`,
        city: 'Pet City',
        state: 'CA',
        zip: `90${getRandomNumber(100, 299)}`
      },
      referralSource: getRandomItem(['Google', 'Yelp', 'Friend referral', 'Walk-in', 'Facebook'])
    }

    clients.push(client)
  })

  return { clients }
}

// Generate appointments for a date range
function generateDemoAppointments(
  clients: Client[], 
  staff: Staff[],
  startDate: Date,
  endDate: Date,
  today: Date
): Appointment[] {
  const appointments: Appointment[] = []
  const groomers = staff.filter(s => s.isGroomer)
  const bather = staff.find(s => !s.isGroomer)
  
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    
    // Skip Sundays
    if (dayOfWeek === 0) {
      currentDate.setDate(currentDate.getDate() + 1)
      continue
    }

    const dateStr = format(currentDate, 'yyyy-MM-dd')
    const isPast = currentDate < today
    const isToday = format(currentDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
    
    // Generate 3-6 appointments per day for groomers
    const numGroomingAppts = getRandomNumber(3, 6)
    const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']
    const usedSlots = new Set<string>()
    
    for (let i = 0; i < numGroomingAppts; i++) {
      const client = getRandomItem(clients)
      const pet = getRandomItem(client.pets)
      const groomer = getRandomItem(groomers)
      
      let slot = getRandomItem(timeSlots)
      let attempts = 0
      while (usedSlots.has(`${groomer.id}-${slot}`) && attempts < 10) {
        slot = getRandomItem(timeSlots)
        attempts++
      }
      if (attempts >= 10) continue
      usedSlots.add(`${groomer.id}-${slot}`)
      
      const mainService = getRandomItem(MAIN_SERVICES)
      const servicePrice = mainService.pricing[pet.weightCategory]
      const services: AppointmentService[] = [
        {
          serviceId: mainService.id,
          serviceName: mainService.name,
          price: servicePrice,
          type: 'main'
        }
      ]
      
      // 40% chance of addon
      if (Math.random() > 0.6) {
        const addon = getRandomItem(ADDONS)
        services.push({
          serviceId: addon.id,
          serviceName: addon.name,
          price: addon.price,
          type: 'addon'
        })
      }
      
      const totalPrice = services.reduce((sum, s) => sum + s.price, 0)
      const [hours, mins] = slot.split(':').map(Number)
      
      // Calculate duration based on service type and pet size
      const baseDuration = mainService.id === 'deluxe-groom' ? 90 : mainService.id === 'trim-up' ? 60 : 45
      const sizeMod = pet.weightCategory === 'giant' ? 30 : pet.weightCategory === 'large' ? 15 : 0
      const durationMins = baseDuration + sizeMod + (services.length > 1 ? 15 : 0) // +15 for addons
      const endMinutes = mins + durationMins
      const endHour = hours + Math.floor(endMinutes / 60)
      const endMin = endMinutes % 60
      const endTime = format(setMinutes(setHours(new Date(), endHour), endMin), 'HH:mm')
      
      // Determine status based on date
      let status: Appointment['status'] = 'scheduled'
      let tipAmount: number | undefined
      let tipPaymentMethod: 'cash' | 'card' | undefined
      
      if (isPast) {
        // 90% completed, 5% cancelled, 5% no-show
        const rand = Math.random()
        if (rand < 0.90) {
          status = 'paid'
          tipAmount = getRandomNumber(5, 25)
          tipPaymentMethod = Math.random() > 0.5 ? 'cash' : 'card'
        } else if (rand < 0.95) {
          status = 'cancelled'
        } else {
          status = 'scheduled' // no-show
        }
      } else if (isToday) {
        // Mix of statuses for today
        const rand = Math.random()
        if (rand < 0.3) {
          status = 'paid'
          tipAmount = getRandomNumber(5, 25)
          tipPaymentMethod = Math.random() > 0.5 ? 'cash' : 'card'
        } else if (rand < 0.5) {
          status = 'completed'
        } else if (rand < 0.7) {
          status = 'in-progress'
        } else if (rand < 0.85) {
          status = 'checked-in'
        } else {
          status = 'scheduled'
        }
      }
      
      const appointment: Appointment = {
        id: demoId(`appt-${i}-${dateStr}`),
        clientId: client.id,
        clientName: client.name,
        petId: pet.id,
        petName: pet.name,
        petWeight: pet.weight,
        petWeightCategory: pet.weightCategory,
        groomerId: groomer.id,
        groomerName: groomer.name,
        groomerRequested: Math.random() > 0.7,
        date: dateStr,
        startTime: slot,
        endTime,
        services,
        totalPrice,
        status,
        tipAmount,
        tipPaymentMethod,
        createdAt: format(subDays(currentDate, getRandomNumber(1, 14)), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
      }
      
      appointments.push(appointment)
    }
    
    // Generate 2-4 bath-only appointments per day for bather
    if (bather) {
      const numBathAppts = getRandomNumber(2, 4)
      const bathSlots = ['08:30', '10:30', '12:30', '13:30']
      
      for (let i = 0; i < numBathAppts; i++) {
        const client = getRandomItem(clients)
        const pet = getRandomItem(client.pets)
        
        let slot = getRandomItem(bathSlots)
        let attempts = 0
        while (usedSlots.has(`${bather.id}-${slot}`) && attempts < 10) {
          slot = getRandomItem(bathSlots)
          attempts++
        }
        if (attempts >= 10) continue
        usedSlots.add(`${bather.id}-${slot}`)
        
        const bathService = MAIN_SERVICES[0] // Fresh Bath
        const servicePrice = bathService.pricing[pet.weightCategory]
        const services: AppointmentService[] = [
          {
            serviceId: bathService.id,
            serviceName: bathService.name,
            price: servicePrice,
            type: 'main'
          }
        ]
        
        const totalPrice = services.reduce((sum, s) => sum + s.price, 0)
        const [hours, mins] = slot.split(':').map(Number)
        
        // Calculate bath duration based on pet size (30-60 mins)
        const bathDuration = pet.weightCategory === 'giant' ? 60 : pet.weightCategory === 'large' ? 50 : pet.weightCategory === 'medium' ? 40 : 30
        const endMinutes = mins + bathDuration
        const endHour = hours + Math.floor(endMinutes / 60)
        const endMin = endMinutes % 60
        const endTime = format(setMinutes(setHours(new Date(), endHour), endMin), 'HH:mm')
        
        let status: Appointment['status'] = 'scheduled'
        let tipAmount: number | undefined
        let tipPaymentMethod: 'cash' | 'card' | undefined
        
        if (isPast) {
          const rand = Math.random()
          if (rand < 0.90) {
            status = 'paid'
            tipAmount = getRandomNumber(3, 15)
            tipPaymentMethod = Math.random() > 0.5 ? 'cash' : 'card'
          } else if (rand < 0.95) {
            status = 'cancelled'
          } else {
            status = 'scheduled'
          }
        } else if (isToday) {
          const rand = Math.random()
          if (rand < 0.4) {
            status = 'paid'
            tipAmount = getRandomNumber(3, 15)
            tipPaymentMethod = Math.random() > 0.5 ? 'cash' : 'card'
          } else if (rand < 0.6) {
            status = 'completed'
          } else {
            status = 'scheduled'
          }
        }
        
        const appointment: Appointment = {
          id: demoId(`bath-${i}-${dateStr}`),
          clientId: client.id,
          clientName: client.name,
          petId: pet.id,
          petName: pet.name,
          petWeight: pet.weight,
          petWeightCategory: pet.weightCategory,
          groomerId: bather.id,
          groomerName: bather.name,
          groomerRequested: false,
          date: dateStr,
          startTime: slot,
          endTime,
          services,
          totalPrice,
          status,
          tipAmount,
          tipPaymentMethod,
          createdAt: format(subDays(currentDate, getRandomNumber(1, 14)), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        }
        
        appointments.push(appointment)
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return appointments
}

// Generate transactions for paid appointments
function generateDemoTransactions(appointments: Appointment[]): Transaction[] {
  const paidAppointments = appointments.filter(apt => apt.status === 'paid')
  
  return paidAppointments.map(apt => {
    const items: TransactionItem[] = apt.services.map(service => ({
      id: service.serviceId,
      name: service.serviceName,
      type: 'service' as const,
      quantity: 1,
      price: service.price,
      total: service.price
    }))
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const discount = Math.random() > 0.9 ? getRandomNumber(5, 15) : 0
    const total = subtotal - discount
    
    return {
      id: demoId(`txn-${apt.id}`),
      appointmentId: apt.id,
      date: apt.date,
      clientId: apt.clientId,
      clientName: apt.clientName,
      items,
      subtotal,
      discount,
      discountDescription: discount > 0 ? 'Loyalty discount' : undefined,
      additionalFees: 0,
      total,
      tipAmount: apt.tipAmount || 0,
      tipPaymentMethod: apt.tipPaymentMethod,
      paymentMethod: getRandomItem(['Credit Card', 'Cash', 'Debit Card']),
      status: 'completed',
      type: 'appointment'
    } satisfies Transaction
  })
}

// Generate dashboard summary data
function generateDashboardData(appointments: Appointment[], transactions: Transaction[], clients: Client[], today: Date) {
  const todayStr = format(today, 'yyyy-MM-dd')
  const todayAppts = appointments.filter(apt => apt.date === todayStr)
  const todayTxns = transactions.filter(txn => txn.date === todayStr)
  
  const weekStart = subDays(today, today.getDay() - 1)
  const weekAppts = appointments.filter(apt => {
    const aptDate = new Date(apt.date)
    return aptDate >= weekStart && aptDate <= today
  })
  const weekTxns = transactions.filter(txn => {
    const txnDate = new Date(txn.date)
    return txnDate >= weekStart && txnDate <= today
  })
  
  // Calculate month data
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthAppts = appointments.filter(apt => {
    const aptDate = new Date(apt.date)
    return aptDate >= monthStart && aptDate <= today
  })
  
  // Calculate lifetime appointments (all completed)
  const lifetimeCompleted = appointments.filter(a => ['completed', 'paid'].includes(a.status)).length
  
  // Calculate week daily data
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const daily = weekDays.map((day, i) => {
    const date = addDays(weekStart, i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayTxns = transactions.filter(t => t.date === dateStr)
    return {
      day,
      date: format(date, 'MMM d'),
      amount: dayTxns.reduce((sum, t) => sum + t.total, 0)
    }
  })
  
  // Generate groomer data from appointments
  const groomerAppts = appointments.filter(a => a.date === todayStr)
  const groomerDataMap = new Map<string, { id: number; name: string; bookedPercentage: number; appointmentCount: number; lastAppointmentEnd: string; schedule: Array<{ start: number; duration: number; client: string }> }>()
  
  DEMO_STAFF.filter(s => s.isGroomer).forEach((groomer, index) => {
    const groomerTodayAppts = groomerAppts.filter(a => a.groomerId === groomer.id)
    const totalMinutes = 8 * 60 // 8 hours workday
    const bookedMinutes = groomerTodayAppts.reduce((sum, a) => {
      const [startH, startM] = a.startTime.split(':').map(Number)
      const [endH, endM] = a.endTime.split(':').map(Number)
      return sum + (endH * 60 + endM) - (startH * 60 + startM)
    }, 0)
    
    const schedule = groomerTodayAppts.map(a => {
      const [startH, startM] = a.startTime.split(':').map(Number)
      const [endH, endM] = a.endTime.split(':').map(Number)
      const start = startH + startM / 60
      const duration = ((endH * 60 + endM) - (startH * 60 + startM)) / 60
      return { start, duration, client: a.petName }
    }).sort((a, b) => a.start - b.start)
    
    const lastAppt = schedule[schedule.length - 1]
    const lastEndHour = lastAppt ? lastAppt.start + lastAppt.duration : 17
    const lastEndH = Math.floor(lastEndHour)
    const lastEndM = Math.round((lastEndHour - lastEndH) * 60)
    const period = lastEndH >= 12 ? 'PM' : 'AM'
    const displayHour = lastEndH > 12 ? lastEndH - 12 : lastEndH
    
    groomerDataMap.set(groomer.id, {
      id: index + 1,
      name: groomer.name,
      bookedPercentage: Math.round((bookedMinutes / totalMinutes) * 100),
      appointmentCount: groomerTodayAppts.length,
      lastAppointmentEnd: `${displayHour}:${lastEndM.toString().padStart(2, '0')} ${period}`,
      schedule
    })
  })
  
  const groomerData = Array.from(groomerDataMap.values())
  
  // Generate recent activity from appointments and transactions
  const recentActivity: Array<{ id: string; type: string; category: string; description: string; client: string; time: string }> = []
  
  // Add recent bookings
  const recentBookings = appointments
    .filter(a => a.status === 'scheduled')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
  
  recentBookings.forEach((apt, i) => {
    const timeAgo = i === 0 ? '5 minutes ago' : i === 1 ? '1 hour ago' : '3 hours ago'
    recentActivity.push({
      id: `activity-booking-${apt.id}`,
      type: 'booking',
      category: 'today',
      description: `New appointment booked for ${apt.petName}`,
      client: apt.clientName,
      time: timeAgo
    })
  })
  
  // Add canceled appointments
  const canceledAppts = appointments
    .filter(a => a.status === 'cancelled')
    .slice(0, 2)
  
  canceledAppts.forEach((apt, i) => {
    recentActivity.push({
      id: `activity-cancel-${apt.id}`,
      type: 'cancellation',
      category: i === 0 ? 'today' : 'yesterday',
      description: `Appointment canceled for ${apt.petName}`,
      client: apt.clientName,
      time: i === 0 ? '2 hours ago' : 'Yesterday 4:30 PM'
    })
  })
  
  // Add a pricing update
  recentActivity.push({
    id: 'activity-pricing-1',
    type: 'pricing',
    category: 'yesterday',
    description: 'Service price updated: Full Groom',
    client: 'System',
    time: 'Yesterday 10:00 AM'
  })
  
  // Generate expenses data
  const expensesData = [
    { category: 'Payroll', amount: getRandomNumber(3500, 4500), color: 'oklch(0.75 0.15 195)' },
    { category: 'Supplies', amount: getRandomNumber(1200, 2000), color: 'oklch(0.75 0.20 285)' },
    { category: 'Rent', amount: 2500, color: 'oklch(0.70 0.18 340)' },
    { category: 'Utilities', amount: getRandomNumber(500, 750), color: 'oklch(0.80 0.15 85)' },
    { category: 'Marketing', amount: getRandomNumber(400, 900), color: 'oklch(0.65 0.22 25)' }
  ]
  
  // Calculate client metrics
  const uniqueClients = new Set(appointments.map(a => a.clientId))
  const newClientsThisMonth = clients.filter(c => {
    if (!c.createdAt) return false
    const createdDate = new Date(c.createdAt)
    return createdDate >= monthStart && createdDate <= today
  }).length
  
  // Calculate repeat rate (clients with more than one appointment)
  const clientAppointmentCounts = new Map<string, number>()
  appointments.forEach(a => {
    clientAppointmentCounts.set(a.clientId, (clientAppointmentCounts.get(a.clientId) || 0) + 1)
  })
  const repeatClients = Array.from(clientAppointmentCounts.values()).filter(count => count > 1).length
  const repeatRate = uniqueClients.size > 0 ? Math.round((repeatClients / uniqueClients.size) * 100) : 0
  
  return {
    appointmentsSummary: {
      today: {
        scheduled: todayAppts.filter(a => a.status === 'scheduled').length,
        completed: todayAppts.filter(a => ['completed', 'paid'].includes(a.status)).length,
        canceled: todayAppts.filter(a => a.status === 'cancelled').length,
        noShows: 0,
        late: 0
      }
    },
    capacitySummary: {
      bookedPercentage: Math.round((todayAppts.length / 12) * 100),
      target: 80
    },
    revenueSummary: {
      today: {
        total: todayTxns.reduce((sum, t) => sum + t.total, 0),
        profit: Math.round(todayTxns.reduce((sum, t) => sum + t.total, 0) * 0.4),
        tips: todayTxns.reduce((sum, t) => sum + t.tipAmount, 0),
        commission: Math.round(todayTxns.reduce((sum, t) => sum + t.total, 0) * 0.45)
      },
      thisWeek: {
        total: weekTxns.reduce((sum, t) => sum + t.total, 0),
        percentChange: 12,
        daily
      }
    },
    issuesSummary: {
      lateArrivals: getRandomNumber(0, 2),
      noShows: getRandomNumber(0, 1),
      canceled: todayAppts.filter(a => a.status === 'cancelled').length
    },
    // Fixed: DogsGroomedCard expects {day, week, month, lifetime}
    dogsGroomedSummary: {
      day: todayAppts.filter(a => ['completed', 'paid'].includes(a.status)).length,
      week: weekAppts.filter(a => ['completed', 'paid'].includes(a.status)).length,
      month: monthAppts.filter(a => ['completed', 'paid'].includes(a.status)).length,
      lifetime: lifetimeCompleted + getRandomNumber(200, 500) // Add some historical data
    },
    bookedPercentageSummary: {
      day: Math.round((todayAppts.length / 12) * 100),
      week: Math.round((weekAppts.length / 60) * 100),
      month: getRandomNumber(65, 85)
    },
    // Fixed: ClientsCard expects {total, newThisMonth, repeatRate, avgDaysBetween}
    clientsSummary: {
      total: clients.length,
      newThisMonth: newClientsThisMonth || getRandomNumber(5, 12),
      repeatRate: repeatRate || getRandomNumber(65, 85),
      avgDaysBetween: getRandomNumber(25, 35)
    },
    // New: groomer data for workload and avg cards
    groomerData,
    // New: recent activity
    recentActivity,
    // New: expenses data
    expensesData
  }
}

// Check if demo mode is enabled
export function isDemoModeEnabled(): boolean {
  try {
    return localStorage.getItem(DEMO_MODE_KEY) === 'true'
  } catch {
    return false
  }
}

// Get stored demo data IDs
function getDemoDataIds(): { 
  staffIds: string[]
  clientIds: string[]
  appointmentIds: string[]
  transactionIds: string[]
} {
  try {
    const stored = localStorage.getItem(DEMO_DATA_IDS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore
  }
  return { staffIds: [], clientIds: [], appointmentIds: [], transactionIds: [] }
}

// Store demo data IDs for cleanup
function storeDemoDataIds(ids: { 
  staffIds: string[]
  clientIds: string[]
  appointmentIds: string[]
  transactionIds: string[]
}) {
  try {
    localStorage.setItem(DEMO_DATA_IDS_KEY, JSON.stringify(ids))
  } catch {
    // Ignore
  }
}

// Enable demo mode and populate data
export function enableDemoMode(): void {
  const today = new Date()
  const startDate = subDays(today, 7)
  const endDate = addDays(today, 7)
  
  // Generate demo data
  const { clients } = generateDemoClients()
  const appointments = generateDemoAppointments(clients, DEMO_STAFF, startDate, endDate, today)
  const transactions = generateDemoTransactions(appointments)
  const dashboardData = generateDashboardData(appointments, transactions, clients, today)
  
  // Store demo data IDs for cleanup
  const demoIds = {
    staffIds: DEMO_STAFF.map(s => s.id),
    clientIds: clients.map(c => c.id),
    appointmentIds: appointments.map(a => a.id),
    transactionIds: transactions.map(t => t.id)
  }
  storeDemoDataIds(demoIds)
  
  // Helper to merge with existing data
  const mergeWithExisting = <T extends { id: string }>(key: string, newItems: T[]): void => {
    try {
      const existingRaw = localStorage.getItem(`kv:${key}`)
      const existing: T[] = existingRaw ? JSON.parse(existingRaw) : []
      const merged = [...existing, ...newItems]
      localStorage.setItem(`kv:${key}`, JSON.stringify(merged))
    } catch {
      localStorage.setItem(`kv:${key}`, JSON.stringify(newItems))
    }
  }
  
  // Store staff data
  mergeWithExisting('staff', DEMO_STAFF)
  
  // Store staff profiles
  try {
    const existingProfilesRaw = localStorage.getItem('kv:staff-profile-details')
    const existingProfiles = existingProfilesRaw ? JSON.parse(existingProfilesRaw) : {}
    const mergedProfiles = { ...existingProfiles, ...DEMO_STAFF_PROFILES }
    localStorage.setItem('kv:staff-profile-details', JSON.stringify(mergedProfiles))
  } catch {
    localStorage.setItem('kv:staff-profile-details', JSON.stringify(DEMO_STAFF_PROFILES))
  }
  
  // Store staff compensation
  try {
    const existingCompRaw = localStorage.getItem('kv:staff-compensation')
    const existingComp = existingCompRaw ? JSON.parse(existingCompRaw) : {}
    const mergedComp = { ...existingComp, ...DEMO_STAFF_COMPENSATION }
    localStorage.setItem('kv:staff-compensation', JSON.stringify(mergedComp))
  } catch {
    localStorage.setItem('kv:staff-compensation', JSON.stringify(DEMO_STAFF_COMPENSATION))
  }
  
  // Store staff schedules
  try {
    const existingSchedulesRaw = localStorage.getItem('kv:staff-schedules')
    const existingSchedules = existingSchedulesRaw ? JSON.parse(existingSchedulesRaw) : []
    const merged = [...existingSchedules, ...DEMO_STAFF_SCHEDULES]
    localStorage.setItem('kv:staff-schedules', JSON.stringify(merged))
  } catch {
    localStorage.setItem('kv:staff-schedules', JSON.stringify(DEMO_STAFF_SCHEDULES))
  }
  
  // Store clients data
  mergeWithExisting('clients', clients)
  
  // Store appointments
  mergeWithExisting('appointments', appointments)
  
  // Store transactions
  mergeWithExisting('transactions', transactions)
  
  // Store dashboard data
  localStorage.setItem('kv:dashboard-appointments-summary', JSON.stringify(dashboardData.appointmentsSummary))
  localStorage.setItem('kv:dashboard-capacity', JSON.stringify(dashboardData.capacitySummary))
  localStorage.setItem('kv:dashboard-revenue-data', JSON.stringify(dashboardData.revenueSummary))
  localStorage.setItem('kv:dashboard-issues', JSON.stringify(dashboardData.issuesSummary))
  localStorage.setItem('kv:dashboard-dogs-groomed', JSON.stringify(dashboardData.dogsGroomedSummary))
  localStorage.setItem('kv:dashboard-booked-percentage', JSON.stringify(dashboardData.bookedPercentageSummary))
  localStorage.setItem('kv:dashboard-clients-summary', JSON.stringify(dashboardData.clientsSummary))
  localStorage.setItem('kv:dashboard-groomer-data', JSON.stringify(dashboardData.groomerData))
  localStorage.setItem('kv:dashboard-recent-activity', JSON.stringify(dashboardData.recentActivity))
  localStorage.setItem('kv:dashboard-expenses', JSON.stringify(dashboardData.expensesData))
  
  // Set demo mode flag
  localStorage.setItem(DEMO_MODE_KEY, 'true')
}

// Disable demo mode and remove all demo data
export function disableDemoMode(): void {
  const demoIds = getDemoDataIds()
  
  // Helper to remove demo items from existing data
  const removeFromExisting = <T extends { id: string }>(key: string, idsToRemove: string[]): void => {
    try {
      const existingRaw = localStorage.getItem(`kv:${key}`)
      if (!existingRaw) return
      const existing: T[] = JSON.parse(existingRaw)
      const filtered = existing.filter(item => !idsToRemove.includes(item.id))
      localStorage.setItem(`kv:${key}`, JSON.stringify(filtered))
    } catch {
      // Ignore errors during cleanup
    }
  }
  
  // Remove staff data
  removeFromExisting('staff', demoIds.staffIds)
  
  // Remove staff profiles
  try {
    const existingProfilesRaw = localStorage.getItem('kv:staff-profile-details')
    if (existingProfilesRaw) {
      const existingProfiles = JSON.parse(existingProfilesRaw)
      demoIds.staffIds.forEach(id => delete existingProfiles[id])
      localStorage.setItem('kv:staff-profile-details', JSON.stringify(existingProfiles))
    }
  } catch {
    // Ignore
  }
  
  // Remove staff compensation
  try {
    const existingCompRaw = localStorage.getItem('kv:staff-compensation')
    if (existingCompRaw) {
      const existingComp = JSON.parse(existingCompRaw)
      demoIds.staffIds.forEach(id => delete existingComp[id])
      localStorage.setItem('kv:staff-compensation', JSON.stringify(existingComp))
    }
  } catch {
    // Ignore
  }
  
  // Remove staff schedules
  try {
    const existingSchedulesRaw = localStorage.getItem('kv:staff-schedules')
    if (existingSchedulesRaw) {
      const existingSchedules = JSON.parse(existingSchedulesRaw)
      const filtered = existingSchedules.filter((s: { staffId: string }) => !demoIds.staffIds.includes(s.staffId))
      localStorage.setItem('kv:staff-schedules', JSON.stringify(filtered))
    }
  } catch {
    // Ignore
  }
  
  // Remove clients
  removeFromExisting('clients', demoIds.clientIds)
  
  // Remove appointments
  removeFromExisting('appointments', demoIds.appointmentIds)
  
  // Remove transactions
  removeFromExisting('transactions', demoIds.transactionIds)
  
  // Clear dashboard data (reset to defaults)
  localStorage.removeItem('kv:dashboard-appointments-summary')
  localStorage.removeItem('kv:dashboard-capacity')
  localStorage.removeItem('kv:dashboard-revenue-data')
  localStorage.removeItem('kv:dashboard-issues')
  localStorage.removeItem('kv:dashboard-dogs-groomed')
  localStorage.removeItem('kv:dashboard-booked-percentage')
  localStorage.removeItem('kv:dashboard-clients-summary')
  localStorage.removeItem('kv:dashboard-groomer-data')
  localStorage.removeItem('kv:dashboard-recent-activity')
  localStorage.removeItem('kv:dashboard-expenses')
  
  // Clear demo mode flag and IDs
  localStorage.removeItem(DEMO_MODE_KEY)
  localStorage.removeItem(DEMO_DATA_IDS_KEY)
}

// Toggle demo mode
export function toggleDemoMode(enabled: boolean): void {
  if (enabled) {
    enableDemoMode()
  } else {
    disableDemoMode()
  }
}
