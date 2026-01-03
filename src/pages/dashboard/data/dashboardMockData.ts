export const appointmentData = {
  today: {
    scheduled: 18,
    completed: 12,
    canceled: 2,
    noShows: 1,
    late: 3,
  },
}

export const capacityData = {
  bookedPercentage: 82,
  target: 90,
}

export const revenueData = {
  today: {
    total: 1450,
    profit: 1160,
    tips: 145,
    commission: 290,
  },
  thisWeek: {
    total: 8250,
    percentChange: 12.5,
    daily: [
      { day: 'Mon', amount: 1050 },
      { day: 'Tue', amount: 1320 },
      { day: 'Wed', amount: 980 },
      { day: 'Thu', amount: 1450 },
      { day: 'Fri', amount: 1680 },
      { day: 'Sat', amount: 1420 },
      { day: 'Sun', amount: 350 },
    ],
  },
}

export const issuesData = {
  lateArrivals: 3,
  noShows: 1,
  canceled: 2,
}

export const bookingHeatmapData = Array.from({ length: 14 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() + i)
  
  const bookedPercentage = Math.floor(Math.random() * 40) + 60
  const totalSlots = 20
  const bookedSlots = Math.floor((bookedPercentage / 100) * totalSlots)
  
  return {
    date: date.toISOString().split('T')[0],
    dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
    dayOfMonth: date.getDate(),
    bookedPercentage,
    bookedSlots,
    totalSlots,
    openSlots: totalSlots - bookedSlots,
  }
})

export const bookingRateData = [
  { period: 'Week 1', percentage: 72 },
  { period: 'Week 2', percentage: 85 },
  { period: 'Week 3', percentage: 78 },
  { period: 'Week 4', percentage: 91 },
  { period: 'Week 5', percentage: 68 },
  { period: 'Week 6', percentage: 82 },
  { period: 'Week 7', percentage: 88 },
  { period: 'Week 8', percentage: 76 },
]

export const groomerData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    bookedPercentage: 95,
    appointmentCount: 8,
    lastAppointmentEnd: '5:30 PM',
    schedule: [
      { start: 8, duration: 1.5, client: 'Max (Golden)' },
      { start: 9.5, duration: 1, client: 'Luna (Poodle)' },
      { start: 11, duration: 2, client: 'Charlie (Husky)' },
      { start: 13, duration: 1, client: 'Bella (Shih Tzu)' },
      { start: 14.5, duration: 1.5, client: 'Rocky (Lab)' },
      { start: 16, duration: 1.5, client: 'Daisy (Terrier)' },
    ],
  },
  {
    id: 2,
    name: 'Mike Chen',
    bookedPercentage: 78,
    appointmentCount: 6,
    lastAppointmentEnd: '4:00 PM',
    schedule: [
      { start: 8.5, duration: 1, client: 'Buddy (Beagle)' },
      { start: 10, duration: 1.5, client: 'Coco (Yorkie)' },
      { start: 12, duration: 1, client: 'Zeus (Bulldog)' },
      { start: 14, duration: 2, client: 'Princess (Afghan)' },
      { start: 16, duration: 1, client: 'Duke (Boxer)' },
    ],
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    bookedPercentage: 88,
    appointmentCount: 7,
    lastAppointmentEnd: '5:00 PM',
    schedule: [
      { start: 8, duration: 1, client: 'Milo (Corgi)' },
      { start: 9.5, duration: 1.5, client: 'Sadie (Shepherd)' },
      { start: 11.5, duration: 1, client: 'Oscar (Dachshund)' },
      { start: 13, duration: 1.5, client: 'Lola (Maltese)' },
      { start: 15, duration: 1, client: 'Tucker (Spaniel)' },
      { start: 16.5, duration: 1.5, client: 'Bailey (Retriever)' },
    ],
  },
]

export const clientMetrics = {
  totalClients: 156,
  newThisMonth: 12,
  repeatVisitRate: 78,
  avgDaysBetweenVisits: 28,
}

export const recentActivity = [
  {
    id: 1,
    type: 'booking',
    description: 'New appointment booked for Max',
    client: 'John Smith',
    time: '2 minutes ago',
    category: 'today',
  },
  {
    id: 2,
    type: 'cancellation',
    description: 'Appointment canceled for Luna',
    client: 'Sarah Williams',
    time: '15 minutes ago',
    category: 'today',
  },
  {
    id: 3,
    type: 'booking',
    description: 'New appointment booked for Charlie',
    client: 'Mike Johnson',
    time: '1 hour ago',
    category: 'today',
  },
  {
    id: 4,
    type: 'pricing',
    description: 'Service price updated: Full Groom',
    client: 'System',
    time: '3 hours ago',
    category: 'today',
  },
  {
    id: 5,
    type: 'booking',
    description: 'New appointment booked for Bella',
    client: 'Emma Davis',
    time: 'Yesterday 5:30 PM',
    category: 'yesterday',
  },
  {
    id: 6,
    type: 'discount',
    description: '10% discount applied to repeat customer',
    client: 'David Brown',
    time: 'Yesterday 2:15 PM',
    category: 'yesterday',
  },
  {
    id: 7,
    type: 'staff',
    description: 'Staff role changed: Emily promoted to Lead Groomer',
    client: 'Admin',
    time: 'Yesterday 10:00 AM',
    category: 'yesterday',
  },
  {
    id: 8,
    type: 'booking',
    description: 'New appointment booked for Rocky',
    client: 'Lisa Anderson',
    time: '3 days ago',
    category: 'thisWeek',
  },
]

export const bookingSummary = {
  today: 82,
  week: 78,
  month: 73,
}
