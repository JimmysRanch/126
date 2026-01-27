import { Client, Pet, Staff } from "./types"

export type ClientRecord = Client & {
  firstName?: string
  lastName?: string
  lastVisit?: string
  nextVisit?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  referralSource?: string
}

export type StaffProfile = Staff & {
  specialties: string[]
  hourlyRate: string
  totalAppointments: number
  rating: number
  hireDate: string
}

export type PayrollHistoryItem = {
  period: string
  startDate: string
  endDate: string
  regularHours: number
  overtimeHours: number
  hourlyRate: number
  overtimeRate: number
  regularPay: number
  overtimePay: number
  grossPay: number
  deductions: {
    federalTax: number
    stateTax: number
    socialSecurity: number
    medicare: number
    healthInsurance: number
    retirement: number
  }
  netPay: number
  appointmentsCompleted: number
  tips: number
  bonuses: number
  status: "Pending" | "Approved" | "Paid"
}

const buildPet = (ownerId: string, id: string, name: string, breed: string, weight: number): Pet => {
  let weightCategory: Pet["weightCategory"] = "small"
  if (weight > 80) weightCategory = "giant"
  else if (weight > 50) weightCategory = "large"
  else if (weight > 25) weightCategory = "medium"

  return {
    id,
    name,
    breed,
    weight,
    weightCategory,
    ownerId
  }
}

export const SEED_CLIENTS: ClientRecord[] = [
  {
    id: "1",
    firstName: "George",
    lastName: "Moodys",
    name: "George Moodys",
    email: "george.moodys@email.com",
    phone: "(555) 123-4567",
    pets: [
      buildPet("1", "1", "Trying", "Labrador Retriever", 62),
      buildPet("1", "2", "Luna", "Golden Retriever", 55),
      buildPet("1", "3", "Max", "Poodle Mix", 38)
    ],
    lastVisit: "Jan 15, 2025",
    nextVisit: "Feb 12, 2025",
    address: {
      street: "123 Main Street",
      city: "Natalia",
      state: "Texas",
      zip: "78059"
    },
    referralSource: "Word-of-mouth"
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    pets: [
      buildPet("2", "4", "Bella", "French Bulldog", 24)
    ],
    lastVisit: "Jan 20, 2025",
    nextVisit: "Feb 17, 2025",
    referralSource: "Facebook"
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Chen",
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "(555) 345-6789",
    pets: [
      buildPet("3", "5", "Charlie", "Beagle", 30),
      buildPet("3", "6", "Daisy", "Cavalier King Charles", 18)
    ],
    lastVisit: "Jan 18, 2025",
    nextVisit: "Feb 15, 2025",
    referralSource: "Google"
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Rodriguez",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "(555) 456-7890",
    pets: [
      buildPet("4", "7", "Rocky", "German Shepherd", 78)
    ],
    lastVisit: "Jan 22, 2025",
    nextVisit: "Feb 19, 2025",
    referralSource: "Nextdoor"
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Thompson",
    name: "David Thompson",
    email: "d.thompson@email.com",
    phone: "(555) 567-8901",
    pets: [
      buildPet("5", "8", "Coco", "Pomeranian", 10),
      buildPet("5", "9", "Milo", "Shih Tzu", 14)
    ],
    lastVisit: "Jan 12, 2025",
    nextVisit: "Feb 9, 2025",
    referralSource: "Word-of-mouth"
  },
  {
    id: "6",
    firstName: "Jessica",
    lastName: "Martinez",
    name: "Jessica Martinez",
    email: "jess.martinez@email.com",
    phone: "(555) 678-9012",
    pets: [
      buildPet("6", "10", "Buddy", "Labrador Mix", 66)
    ],
    lastVisit: "Jan 25, 2025",
    nextVisit: "Feb 22, 2025",
    referralSource: "Google"
  },
  {
    id: "7",
    firstName: "Robert",
    lastName: "Kim",
    name: "Robert Kim",
    email: "rob.kim@email.com",
    phone: "(555) 789-0123",
    pets: [
      buildPet("7", "11", "Zeus", "Rottweiler", 92),
      buildPet("7", "12", "Apollo", "Doberman", 76)
    ],
    lastVisit: "Jan 8, 2025",
    nextVisit: "Feb 5, 2025",
    referralSource: "Facebook"
  },
  {
    id: "8",
    firstName: "Amanda",
    lastName: "Lee",
    name: "Amanda Lee",
    email: "amanda.lee@email.com",
    phone: "(555) 890-1234",
    pets: [
      buildPet("8", "13", "Princess", "Maltese", 9)
    ],
    lastVisit: "Jan 19, 2025",
    nextVisit: "Feb 16, 2025",
    referralSource: "Other"
  }
]

export const SEED_STAFF_PROFILES: StaffProfile[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Groomer",
    email: "sarah.j@pawhub.com",
    phone: "(555) 123-4567",
    status: "Active",
    isGroomer: true,
    specialties: ["Large Breeds", "Show Cuts", "Hand Stripping"],
    hourlyRate: "$35/hr",
    totalAppointments: 324,
    rating: 4.9,
    hireDate: "Mar 15, 2022"
  },
  {
    id: "2",
    name: "Mike Torres",
    role: "Groomer",
    email: "mike.t@pawhub.com",
    phone: "(555) 234-5678",
    status: "Active",
    isGroomer: true,
    specialties: ["Anxious Dogs", "Creative Styling", "Nail Care"],
    hourlyRate: "$28/hr",
    totalAppointments: 256,
    rating: 4.8,
    hireDate: "Aug 20, 2022"
  },
  {
    id: "3",
    name: "Emma Roberts",
    role: "Spa Specialist",
    email: "emma.r@pawhub.com",
    phone: "(555) 345-6789",
    status: "Active",
    isGroomer: true,
    specialties: ["Spa Treatments", "Small Breeds", "Facials"],
    hourlyRate: "$32/hr",
    totalAppointments: 198,
    rating: 5.0,
    hireDate: "Jan 10, 2023"
  },
  {
    id: "4",
    name: "Carlos Martinez",
    role: "Bather",
    email: "carlos.m@pawhub.com",
    phone: "(555) 456-7890",
    status: "Active",
    isGroomer: false,
    specialties: ["De-shedding", "Quick Service", "Puppy Care"],
    hourlyRate: "$22/hr",
    totalAppointments: 412,
    rating: 4.7,
    hireDate: "May 5, 2023"
  },
  {
    id: "5",
    name: "Lisa Chen",
    role: "Groomer",
    email: "lisa.c@pawhub.com",
    phone: "(555) 567-8901",
    status: "On Leave",
    isGroomer: true,
    specialties: ["Poodle Cuts", "Color & Styling", "Competition Prep"],
    hourlyRate: "$30/hr",
    totalAppointments: 187,
    rating: 4.9,
    hireDate: "Nov 12, 2023"
  }
]

export const SEED_PAYROLL_HISTORY: PayrollHistoryItem[] = [
  {
    period: "Dec 1, 2024 - Dec 14, 2024",
    startDate: "Dec 1, 2024",
    endDate: "Dec 14, 2024",
    regularHours: 78,
    overtimeHours: 4,
    hourlyRate: 28,
    overtimeRate: 42,
    regularPay: 2184,
    overtimePay: 168,
    grossPay: 2352,
    deductions: {
      federalTax: 280,
      stateTax: 96,
      socialSecurity: 146,
      medicare: 35,
      healthInsurance: 120,
      retirement: 80
    },
    netPay: 1595,
    appointmentsCompleted: 42,
    tips: 225,
    bonuses: 0,
    status: "Paid"
  },
  {
    period: "Dec 15, 2024 - Dec 28, 2024",
    startDate: "Dec 15, 2024",
    endDate: "Dec 28, 2024",
    regularHours: 80,
    overtimeHours: 2,
    hourlyRate: 28,
    overtimeRate: 42,
    regularPay: 2240,
    overtimePay: 84,
    grossPay: 2324,
    deductions: {
      federalTax: 276,
      stateTax: 94,
      socialSecurity: 144,
      medicare: 34,
      healthInsurance: 120,
      retirement: 80
    },
    netPay: 1576,
    appointmentsCompleted: 45,
    tips: 240,
    bonuses: 50,
    status: "Approved"
  },
  {
    period: "Dec 29, 2024 - Jan 11, 2025",
    startDate: "Dec 29, 2024",
    endDate: "Jan 11, 2025",
    regularHours: 76,
    overtimeHours: 0,
    hourlyRate: 28,
    overtimeRate: 42,
    regularPay: 2128,
    overtimePay: 0,
    grossPay: 2128,
    deductions: {
      federalTax: 252,
      stateTax: 86,
      socialSecurity: 132,
      medicare: 32,
      healthInsurance: 120,
      retirement: 80
    },
    netPay: 1556,
    appointmentsCompleted: 38,
    tips: 180,
    bonuses: 0,
    status: "Pending"
  }
]

export type StaffAppointmentSummary = {
  id: string
  client: string
  pet: string
  service: string
  date: string
  time: string
  duration?: string
  status?: string
  cost?: string
  tip?: string
  rating?: number
  notes?: string
}

export type StaffProfileDetail = {
  name: string
  role: string
  email: string
  phone: string
  address: string
  emergencyContact: {
    name: string
    relation: string
    phone: string
  }
  hireDate: string
  status: "Active" | "On Leave" | "Inactive"
  hourlyRate: number
  specialties: string[]
  stats: {
    totalAppointments: number
    revenue: string
    avgTip: string
    noShows: number
    lateArrivals: number
  }
  upcomingAppointments: StaffAppointmentSummary[]
  recentAppointments: StaffAppointmentSummary[]
}

export const SEED_STAFF_PROFILE_DETAILS: Record<string, StaffProfileDetail> = {
  "1": {
    name: "Sarah Johnson",
    role: "Groomer",
    email: "sarah.j@pawhub.com",
    phone: "(555) 123-4567",
    address: "1234 Bark Lane, Scruffyville, TX 78701",
    emergencyContact: {
      name: "John Johnson",
      relation: "Spouse",
      phone: "(555) 987-6543"
    },
    hireDate: "Mar 15, 2022",
    status: "Active",
    hourlyRate: 35,
    specialties: ["Large Breeds", "Show Cuts", "Hand Stripping"],
    stats: {
      totalAppointments: 324,
      revenue: "$45,280",
      avgTip: "$28",
      noShows: 3,
      lateArrivals: 2
    },
    upcomingAppointments: [
      {
        id: "1",
        client: "George moodys",
        pet: "Trying",
        service: "Full Groom Package",
        date: "Jan 28, 2025",
        time: "9:00 AM",
        duration: "2h",
        status: "Confirmed"
      },
      {
        id: "2",
        client: "Sarah Johnson",
        pet: "Bella",
        service: "Bath & Brush",
        date: "Jan 28, 2025",
        time: "11:30 AM",
        duration: "1h",
        status: "Confirmed"
      },
      {
        id: "3",
        client: "Michael Chen",
        pet: "Charlie",
        service: "Nail Trim",
        date: "Jan 28, 2025",
        time: "2:00 PM",
        duration: "30m",
        status: "Pending"
      }
    ],
    recentAppointments: [
      {
        id: "1",
        client: "George moodys",
        pet: "Trying",
        service: "Full Groom Package",
        date: "Jan 15, 2025",
        time: "9:00 AM",
        cost: "$85",
        tip: "$45",
        rating: 5,
        notes: "Client very happy with the cut!"
      },
      {
        id: "2",
        client: "Emily Rodriguez",
        pet: "Rocky",
        service: "Bath & Brush",
        date: "Jan 14, 2025",
        time: "1:30 PM",
        cost: "$55",
        tip: "$20",
        rating: 5,
        notes: "Rocky was well-behaved today."
      },
      {
        id: "3",
        client: "David Thompson",
        pet: "Coco",
        service: "Luxury Spa Package",
        date: "Jan 12, 2025",
        time: "10:00 AM",
        cost: "$120",
        tip: "$35",
        rating: 5,
        notes: "Perfect spa day!"
      }
    ]
  },
  "2": {
    name: "Mike Torres",
    role: "Groomer",
    email: "mike.t@pawhub.com",
    phone: "(555) 234-5678",
    address: "5678 Paws Street, Scruffyville, TX 78702",
    emergencyContact: {
      name: "Maria Torres",
      relation: "Sister",
      phone: "(555) 876-5432"
    },
    hireDate: "Aug 20, 2022",
    status: "Active",
    hourlyRate: 28,
    specialties: ["Anxious Dogs", "Creative Styling", "Nail Care"],
    stats: {
      totalAppointments: 256,
      revenue: "$38,620",
      avgTip: "$22",
      noShows: 5,
      lateArrivals: 4
    },
    upcomingAppointments: [],
    recentAppointments: []
  }
}
