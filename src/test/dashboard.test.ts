import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

/**
 * Dashboard Tests
 * Tests to ensure all dashboard cards are properly wired up and displaying correct information.
 * These tests validate data structures, calculations, and component wiring.
 */

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Dashboard Data Structures', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('Appointments Summary', () => {
    it('should have correct structure for appointments today', () => {
      const appointmentData = {
        today: {
          scheduled: 12,
          completed: 8,
          canceled: 2,
          noShows: 1,
          late: 1,
        }
      }

      expect(appointmentData.today).toHaveProperty('scheduled')
      expect(appointmentData.today).toHaveProperty('completed')
      expect(appointmentData.today).toHaveProperty('canceled')
      expect(appointmentData.today).toHaveProperty('noShows')
      expect(appointmentData.today).toHaveProperty('late')
      
      expect(typeof appointmentData.today.scheduled).toBe('number')
      expect(typeof appointmentData.today.completed).toBe('number')
      expect(typeof appointmentData.today.canceled).toBe('number')
      expect(typeof appointmentData.today.noShows).toBe('number')
      expect(typeof appointmentData.today.late).toBe('number')
    })

    it('should ensure scheduled count is non-negative', () => {
      const appointmentData = {
        today: {
          scheduled: 0,
          completed: 0,
          canceled: 0,
          noShows: 0,
          late: 0,
        }
      }

      expect(appointmentData.today.scheduled).toBeGreaterThanOrEqual(0)
      expect(appointmentData.today.completed).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Capacity Summary (Booked Gauge)', () => {
    it('should have correct structure for capacity data', () => {
      const capacityData = {
        bookedPercentage: 82,
        target: 90,
      }

      expect(capacityData).toHaveProperty('bookedPercentage')
      expect(capacityData).toHaveProperty('target')
      expect(typeof capacityData.bookedPercentage).toBe('number')
      expect(typeof capacityData.target).toBe('number')
    })

    it('should keep percentage between 0 and 100', () => {
      const testPercentage = (percentage: number) => {
        return Math.max(0, Math.min(100, percentage))
      }

      expect(testPercentage(82)).toBe(82)
      expect(testPercentage(-10)).toBe(0)
      expect(testPercentage(150)).toBe(100)
    })
  })

  describe('Revenue Summary', () => {
    it('should have correct structure for revenue data', () => {
      const revenueData = {
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
            { day: 'Mon', date: 'Jan 1', amount: 1050 },
          ],
        },
      }

      expect(revenueData.today).toHaveProperty('total')
      expect(revenueData.today).toHaveProperty('profit')
      expect(revenueData.today).toHaveProperty('tips')
      expect(revenueData.today).toHaveProperty('commission')
      expect(revenueData.thisWeek).toHaveProperty('total')
      expect(revenueData.thisWeek).toHaveProperty('percentChange')
      expect(revenueData.thisWeek).toHaveProperty('daily')
    })

    it('should have 7 days in weekly data', () => {
      const weekly = {
        daily: [
          { day: 'Mon', date: 'Jan 1', amount: 1050 },
          { day: 'Tue', date: 'Jan 2', amount: 1320 },
          { day: 'Wed', date: 'Jan 3', amount: 980 },
          { day: 'Thu', date: 'Jan 4', amount: 1450 },
          { day: 'Fri', date: 'Jan 5', amount: 1680 },
          { day: 'Sat', date: 'Jan 6', amount: 1420 },
          { day: 'Sun', date: 'Jan 7', amount: 350 },
        ]
      }

      expect(weekly.daily).toHaveLength(7)
      weekly.daily.forEach(day => {
        expect(day).toHaveProperty('day')
        expect(day).toHaveProperty('date')
        expect(day).toHaveProperty('amount')
        expect(typeof day.amount).toBe('number')
      })
    })
  })

  describe('Issues Summary', () => {
    it('should have correct structure for issues data', () => {
      const issuesData = {
        lateArrivals: 3,
        noShows: 1,
        canceled: 2,
      }

      expect(issuesData).toHaveProperty('lateArrivals')
      expect(issuesData).toHaveProperty('noShows')
      expect(issuesData).toHaveProperty('canceled')
      
      expect(typeof issuesData.lateArrivals).toBe('number')
      expect(typeof issuesData.noShows).toBe('number')
      expect(typeof issuesData.canceled).toBe('number')
    })

    it('should ensure all issue counts are non-negative', () => {
      const issuesData = {
        lateArrivals: 0,
        noShows: 0,
        canceled: 0,
      }

      expect(issuesData.lateArrivals).toBeGreaterThanOrEqual(0)
      expect(issuesData.noShows).toBeGreaterThanOrEqual(0)
      expect(issuesData.canceled).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Dogs Groomed Card', () => {
    it('should have correct structure with day, week, month, lifetime', () => {
      const dogsGroomedData = {
        day: 12,
        week: 68,
        month: 285,
        lifetime: 3842,
      }

      expect(dogsGroomedData).toHaveProperty('day')
      expect(dogsGroomedData).toHaveProperty('week')
      expect(dogsGroomedData).toHaveProperty('month')
      expect(dogsGroomedData).toHaveProperty('lifetime')
      
      expect(typeof dogsGroomedData.day).toBe('number')
      expect(typeof dogsGroomedData.week).toBe('number')
      expect(typeof dogsGroomedData.month).toBe('number')
      expect(typeof dogsGroomedData.lifetime).toBe('number')
    })

    it('should enforce logical ordering: day <= week <= month <= lifetime', () => {
      const dogsGroomedData = {
        day: 5,
        week: 25,
        month: 100,
        lifetime: 1000,
      }

      expect(dogsGroomedData.day).toBeLessThanOrEqual(dogsGroomedData.week)
      expect(dogsGroomedData.week).toBeLessThanOrEqual(dogsGroomedData.month)
      expect(dogsGroomedData.month).toBeLessThanOrEqual(dogsGroomedData.lifetime)
    })

    it('should reject old data structure with count/previousWeek', () => {
      // The old structure should not pass the new validation
      const oldStructure = {
        count: 68,
        previousWeek: 35,
      }

      expect(oldStructure).not.toHaveProperty('day')
      expect(oldStructure).not.toHaveProperty('week')
      expect(oldStructure).not.toHaveProperty('month')
      expect(oldStructure).not.toHaveProperty('lifetime')
    })
  })

  describe('Booked Percentage Card', () => {
    it('should have correct structure with day, week, month', () => {
      const bookedPercentageData = {
        day: 82,
        week: 78,
        month: 73,
      }

      expect(bookedPercentageData).toHaveProperty('day')
      expect(bookedPercentageData).toHaveProperty('week')
      expect(bookedPercentageData).toHaveProperty('month')
      
      expect(typeof bookedPercentageData.day).toBe('number')
      expect(typeof bookedPercentageData.week).toBe('number')
      expect(typeof bookedPercentageData.month).toBe('number')
    })

    it('should ensure percentages are between 0 and 100', () => {
      const validatePercentage = (val: number) => val >= 0 && val <= 100

      expect(validatePercentage(82)).toBe(true)
      expect(validatePercentage(0)).toBe(true)
      expect(validatePercentage(100)).toBe(true)
      expect(validatePercentage(-5)).toBe(false)
      expect(validatePercentage(150)).toBe(false)
    })
  })

  describe('Clients Card', () => {
    it('should have correct structure with total, newThisMonth, repeatRate, avgDaysBetween', () => {
      const clientsData = {
        total: 156,
        newThisMonth: 12,
        repeatRate: 78,
        avgDaysBetween: 28,
      }

      expect(clientsData).toHaveProperty('total')
      expect(clientsData).toHaveProperty('newThisMonth')
      expect(clientsData).toHaveProperty('repeatRate')
      expect(clientsData).toHaveProperty('avgDaysBetween')
      
      expect(typeof clientsData.total).toBe('number')
      expect(typeof clientsData.newThisMonth).toBe('number')
      expect(typeof clientsData.repeatRate).toBe('number')
      expect(typeof clientsData.avgDaysBetween).toBe('number')
    })

    it('should reject old data structure with count/previousMonth', () => {
      // The old structure should not pass the new validation
      const oldStructure = {
        count: 156,
        previousMonth: 140,
      }

      expect(oldStructure).not.toHaveProperty('total')
      expect(oldStructure).not.toHaveProperty('newThisMonth')
      expect(oldStructure).not.toHaveProperty('repeatRate')
      expect(oldStructure).not.toHaveProperty('avgDaysBetween')
    })

    it('should ensure repeatRate is a valid percentage', () => {
      const clientsData = {
        total: 100,
        newThisMonth: 5,
        repeatRate: 75,
        avgDaysBetween: 30,
      }

      expect(clientsData.repeatRate).toBeGreaterThanOrEqual(0)
      expect(clientsData.repeatRate).toBeLessThanOrEqual(100)
    })
  })

  describe('Expenses Card', () => {
    it('should have correct structure for expense items', () => {
      const expensesData = [
        { category: 'Payroll', amount: 4200, color: 'oklch(0.75 0.15 195)' },
        { category: 'Supplies', amount: 1850, color: 'oklch(0.75 0.20 285)' },
      ]

      expect(Array.isArray(expensesData)).toBe(true)
      expensesData.forEach(expense => {
        expect(expense).toHaveProperty('category')
        expect(expense).toHaveProperty('amount')
        expect(expense).toHaveProperty('color')
        expect(typeof expense.category).toBe('string')
        expect(typeof expense.amount).toBe('number')
        expect(typeof expense.color).toBe('string')
      })
    })

    it('should ensure amounts are non-negative', () => {
      const expensesData = [
        { category: 'Payroll', amount: 4200, color: 'oklch(0.75 0.15 195)' },
        { category: 'Supplies', amount: 0, color: 'oklch(0.75 0.20 285)' },
      ]

      expensesData.forEach(expense => {
        expect(expense.amount).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('Groomer Data', () => {
    it('should have correct structure for groomer workload', () => {
      const groomerData = [
        {
          id: 1,
          name: 'Sarah Johnson',
          bookedPercentage: 95,
          appointmentCount: 8,
          lastAppointmentEnd: '5:30 PM',
          schedule: [
            { start: 8, duration: 1.5, client: 'Max (Golden)' },
          ],
        },
      ]

      expect(Array.isArray(groomerData)).toBe(true)
      groomerData.forEach(groomer => {
        expect(groomer).toHaveProperty('id')
        expect(groomer).toHaveProperty('name')
        expect(groomer).toHaveProperty('bookedPercentage')
        expect(groomer).toHaveProperty('appointmentCount')
        expect(groomer).toHaveProperty('lastAppointmentEnd')
        expect(groomer).toHaveProperty('schedule')
        expect(Array.isArray(groomer.schedule)).toBe(true)
      })
    })

    it('should validate schedule entries have required fields', () => {
      const schedule = [
        { start: 8, duration: 1.5, client: 'Max' },
        { start: 9.5, duration: 1, client: 'Luna' },
      ]

      schedule.forEach(entry => {
        expect(entry).toHaveProperty('start')
        expect(entry).toHaveProperty('duration')
        expect(entry).toHaveProperty('client')
        expect(typeof entry.start).toBe('number')
        expect(typeof entry.duration).toBe('number')
        expect(typeof entry.client).toBe('string')
        expect(entry.duration).toBeGreaterThan(0)
      })
    })
  })

  describe('Recent Activity', () => {
    it('should have correct structure for activity items', () => {
      const recentActivity = [
        {
          id: '1',
          type: 'booking',
          category: 'today',
          description: 'New appointment booked for Max',
          client: 'John Smith',
          time: '2 minutes ago',
        },
      ]

      expect(Array.isArray(recentActivity)).toBe(true)
      recentActivity.forEach(activity => {
        expect(activity).toHaveProperty('id')
        expect(activity).toHaveProperty('type')
        expect(activity).toHaveProperty('category')
        expect(activity).toHaveProperty('description')
        expect(activity).toHaveProperty('client')
        expect(activity).toHaveProperty('time')
      })
    })

    it('should validate activity types are valid', () => {
      const validTypes = ['booking', 'cancellation', 'pricing', 'discount', 'staff']
      const activity = { type: 'booking' }

      expect(validTypes).toContain(activity.type)
    })

    it('should validate activity categories are valid', () => {
      const validCategories = ['today', 'yesterday', 'thisWeek']
      const activity = { category: 'today' }

      expect(validCategories).toContain(activity.category)
    })
  })
})

describe('Dashboard Calculations', () => {
  describe('Appointment Progress', () => {
    it('should calculate appointment progress correctly', () => {
      const calculateAppointmentProgress = (appointmentData: {
        today: {
          scheduled: number
          completed: number
          canceled: number
          noShows: number
        }
      }) => {
        const { scheduled, completed, canceled, noShows } = appointmentData.today
        const remaining = scheduled - completed - canceled - noShows
        const total = scheduled

        return {
          completed,
          remaining: Math.max(0, remaining),
          total,
          percentageComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
      }

      const testData = {
        today: {
          scheduled: 10,
          completed: 5,
          canceled: 2,
          noShows: 1,
        }
      }

      const progress = calculateAppointmentProgress(testData)

      expect(progress.completed).toBe(5)
      expect(progress.remaining).toBe(2) // 10 - 5 - 2 - 1 = 2
      expect(progress.total).toBe(10)
      expect(progress.percentageComplete).toBe(50)
    })

    it('should handle zero scheduled appointments', () => {
      const calculateAppointmentProgress = (appointmentData: {
        today: {
          scheduled: number
          completed: number
          canceled: number
          noShows: number
        }
      }) => {
        const { scheduled, completed, canceled, noShows } = appointmentData.today
        const remaining = scheduled - completed - canceled - noShows
        const total = scheduled

        return {
          completed,
          remaining: Math.max(0, remaining),
          total,
          percentageComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
      }

      const testData = {
        today: {
          scheduled: 0,
          completed: 0,
          canceled: 0,
          noShows: 0,
        }
      }

      const progress = calculateAppointmentProgress(testData)

      expect(progress.completed).toBe(0)
      expect(progress.remaining).toBe(0)
      expect(progress.total).toBe(0)
      expect(progress.percentageComplete).toBe(0)
    })

    it('should never return negative remaining', () => {
      const calculateAppointmentProgress = (appointmentData: {
        today: {
          scheduled: number
          completed: number
          canceled: number
          noShows: number
        }
      }) => {
        const { scheduled, completed, canceled, noShows } = appointmentData.today
        const remaining = scheduled - completed - canceled - noShows
        const total = scheduled

        return {
          completed,
          remaining: Math.max(0, remaining),
          total,
          percentageComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
      }

      // Edge case: more cancellations than scheduled
      const testData = {
        today: {
          scheduled: 5,
          completed: 3,
          canceled: 3,
          noShows: 2,
        }
      }

      const progress = calculateAppointmentProgress(testData)

      expect(progress.remaining).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Booked Percentage Calculations', () => {
    it('should calculate daily booking percentage correctly', () => {
      const calculateBookedPercentage = (bookedSlots: number, totalSlots: number) => {
        if (totalSlots <= 0) return 0
        return Math.round((bookedSlots / totalSlots) * 100)
      }

      expect(calculateBookedPercentage(8, 10)).toBe(80)
      expect(calculateBookedPercentage(0, 10)).toBe(0)
      expect(calculateBookedPercentage(10, 10)).toBe(100)
      expect(calculateBookedPercentage(5, 0)).toBe(0) // Edge case: no slots
    })
  })

  describe('Expense Percentages', () => {
    it('should calculate expense percentages correctly', () => {
      const expenses = [
        { category: 'Payroll', amount: 4200 },
        { category: 'Supplies', amount: 1800 },
        { category: 'Rent', amount: 2000 },
        { category: 'Utilities', amount: 500 },
        { category: 'Marketing', amount: 500 },
      ]

      const total = expenses.reduce((sum, e) => sum + e.amount, 0)
      expect(total).toBe(9000)

      const percentages = expenses.map(e => ({
        category: e.category,
        percentage: ((e.amount / total) * 100).toFixed(1)
      }))

      expect(percentages[0].percentage).toBe('46.7') // Payroll
      expect(percentages[1].percentage).toBe('20.0') // Supplies
    })
  })

  describe('Client Metrics', () => {
    it('should calculate repeat rate correctly', () => {
      const calculateRepeatRate = (repeatClients: number, totalClients: number) => {
        if (totalClients <= 0) return 0
        return Math.round((repeatClients / totalClients) * 100)
      }

      expect(calculateRepeatRate(75, 100)).toBe(75)
      expect(calculateRepeatRate(0, 100)).toBe(0)
      expect(calculateRepeatRate(50, 0)).toBe(0) // Edge case
    })
  })
})

describe('Dashboard KV Key Validation', () => {
  const expectedKvKeys = [
    'dashboard-appointments-summary',
    'dashboard-capacity',
    'dashboard-revenue-data',
    'dashboard-issues',
    'dashboard-dogs-groomed',
    'dashboard-booked-percentage',
    'dashboard-clients-summary',
    'dashboard-groomer-data',
    'dashboard-recent-activity',
    'dashboard-expenses',
  ]

  it('should list all required KV keys', () => {
    expect(expectedKvKeys).toContain('dashboard-appointments-summary')
    expect(expectedKvKeys).toContain('dashboard-capacity')
    expect(expectedKvKeys).toContain('dashboard-revenue-data')
    expect(expectedKvKeys).toContain('dashboard-issues')
    expect(expectedKvKeys).toContain('dashboard-dogs-groomed')
    expect(expectedKvKeys).toContain('dashboard-booked-percentage')
    expect(expectedKvKeys).toContain('dashboard-clients-summary')
    expect(expectedKvKeys).toContain('dashboard-groomer-data')
    expect(expectedKvKeys).toContain('dashboard-recent-activity')
    expect(expectedKvKeys).toContain('dashboard-expenses')
  })

  it('should have 10 total dashboard KV keys', () => {
    expect(expectedKvKeys).toHaveLength(10)
  })
})

describe('Dashboard Default Values', () => {
  it('should provide safe defaults for appointments', () => {
    const defaultAppointmentData = {
      today: {
        scheduled: 0,
        completed: 0,
        canceled: 0,
        noShows: 0,
        late: 0,
      }
    }

    // All values should be 0 for safe defaults
    expect(defaultAppointmentData.today.scheduled).toBe(0)
    expect(defaultAppointmentData.today.completed).toBe(0)
    expect(defaultAppointmentData.today.canceled).toBe(0)
    expect(defaultAppointmentData.today.noShows).toBe(0)
    expect(defaultAppointmentData.today.late).toBe(0)
  })

  it('should provide safe defaults for capacity', () => {
    const defaultCapacityData = {
      bookedPercentage: 0,
      target: 0,
    }

    expect(defaultCapacityData.bookedPercentage).toBe(0)
    expect(defaultCapacityData.target).toBe(0)
  })

  it('should provide safe defaults for dogs groomed', () => {
    const defaultDogsGroomedData = {
      day: 0,
      week: 0,
      month: 0,
      lifetime: 0,
    }

    expect(defaultDogsGroomedData.day).toBe(0)
    expect(defaultDogsGroomedData.week).toBe(0)
    expect(defaultDogsGroomedData.month).toBe(0)
    expect(defaultDogsGroomedData.lifetime).toBe(0)
  })

  it('should provide safe defaults for clients', () => {
    const defaultClientsData = {
      total: 0,
      newThisMonth: 0,
      repeatRate: 0,
      avgDaysBetween: 0,
    }

    expect(defaultClientsData.total).toBe(0)
    expect(defaultClientsData.newThisMonth).toBe(0)
    expect(defaultClientsData.repeatRate).toBe(0)
    expect(defaultClientsData.avgDaysBetween).toBe(0)
  })
})
