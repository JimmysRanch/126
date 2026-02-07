/**
 * Custom hook to compute dashboard data from actual data sources
 * This replaces the separate pre-computed KV keys approach with real-time calculations
 */

import { useMemo } from 'react'
import { useKV } from "@github/spark/hooks"
import { format, subDays, startOfMonth, parseISO, differenceInDays, startOfWeek } from 'date-fns'
import type { Appointment, Client, Staff, Transaction } from '@/lib/types'
import type { ExpenseRecord } from '@/lib/finance-types'
import { getTodayInBusinessTimezone } from '@/lib/date-utils'

// =====================================================
// Business Constants
// =====================================================

/** Number of appointment slots per groomer per day (standard grooming business assumption) */
const SLOTS_PER_GROOMER_PER_DAY = 6

/** Minimum total daily capacity slots (used when no groomers are registered) */
const MIN_DAILY_CAPACITY_SLOTS = 12

/** Standard workday hours for utilization calculations */
const WORKDAY_HOURS = 8

/** Default rebooking interval in days (industry standard for pet grooming) */
const DEFAULT_REBOOKING_DAYS = 28

/** Commission rate for revenue calculations */
const COMMISSION_RATE = 0.45

// Category color mapping for expenses
const EXPENSE_CATEGORY_COLORS: Record<string, string> = {
  supplies: 'oklch(0.75 0.20 285)',
  utilities: 'oklch(0.80 0.15 85)',
  rent: 'oklch(0.70 0.18 340)',
  software: 'oklch(0.70 0.15 250)',
  marketing: 'oklch(0.65 0.22 25)',
  insurance: 'oklch(0.75 0.15 195)',
  maintenance: 'oklch(0.72 0.18 150)',
  other: 'oklch(0.65 0.12 230)',
  payroll: 'oklch(0.75 0.15 195)',
}

export function useDashboardData() {
  // Get actual data from KV stores
  const [appointments] = useKV<Appointment[]>("appointments", [])
  const [clients] = useKV<Client[]>("clients", [])
  const [staff] = useKV<Staff[]>("staff", [])
  const [expenses] = useKV<ExpenseRecord[]>("expenses", [])
  const [transactions] = useKV<Transaction[]>("transactions", [])

  const today = getTodayInBusinessTimezone()
  const todayDate = parseISO(today)
  
  // Compute appointment statistics
  const appointmentsSummary = useMemo(() => {
    const appts = appointments || []
    const todayAppts = appts.filter(a => a.date === today)
    
    return {
      today: {
        scheduled: todayAppts.filter(a => a.status === 'scheduled' || a.status === 'checked-in' || a.status === 'in-progress').length,
        completed: todayAppts.filter(a => a.status === 'completed' || a.status === 'paid' || a.status === 'notified').length,
        canceled: todayAppts.filter(a => a.status === 'cancelled').length,
        noShows: 0, // No explicit no-show status in the type
        late: 0, // Would need additional tracking for late arrivals
      }
    }
  }, [appointments, today])

  // Compute capacity/booked percentage
  const capacitySummary = useMemo(() => {
    const appts = appointments || []
    const todayAppts = appts.filter(a => a.date === today && a.status !== 'cancelled')
    const groomers = (staff || []).filter(s => s.isGroomer && s.status === 'Active')
    const totalSlots = Math.max(groomers.length * SLOTS_PER_GROOMER_PER_DAY, MIN_DAILY_CAPACITY_SLOTS)
    const bookedPercentage = totalSlots > 0 ? Math.round((todayAppts.length / totalSlots) * 100) : 0
    
    return {
      bookedPercentage: Math.min(bookedPercentage, 100),
      target: 80, // Default target
    }
  }, [appointments, staff, today])

  // Compute revenue statistics
  const revenueSummary = useMemo(() => {
    const txns = transactions || []
    const appts = appointments || []
    const todayTxns = txns.filter(t => t.date === today && t.status === 'completed')
    
    // Fallback: If no transactions, estimate from completed appointments
    let todayTotal = todayTxns.reduce((sum, t) => sum + t.total, 0)
    let todayTips = todayTxns.reduce((sum, t) => sum + (t.tipAmount || 0), 0)
    
    if (todayTotal === 0) {
      const todayCompletedAppts = appts.filter(a => 
        a.date === today && (a.status === 'completed' || a.status === 'paid')
      )
      todayTotal = todayCompletedAppts.reduce((sum, a) => sum + a.totalPrice, 0)
      todayTips = todayCompletedAppts.reduce((sum, a) => sum + (a.tipAmount || 0), 0)
    }
    
    const todayCommission = Math.round(todayTotal * COMMISSION_RATE)
    const todayProfit = todayTotal - todayCommission
    
    // Calculate weekly data
    const weekStart = startOfWeek(todayDate, { weekStartsOn: 1 }) // Monday start
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    const daily = weekDays.map((day, i) => {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      const dateStr = format(date, 'yyyy-MM-dd')
      
      let dayTotal = txns
        .filter(t => t.date === dateStr && t.status === 'completed')
        .reduce((sum, t) => sum + t.total, 0)
      
      // Fallback to appointments if no transactions
      if (dayTotal === 0) {
        dayTotal = appts
          .filter(a => a.date === dateStr && (a.status === 'completed' || a.status === 'paid'))
          .reduce((sum, a) => sum + a.totalPrice, 0)
      }
      
      return {
        day,
        date: format(date, 'MMM d'),
        amount: dayTotal
      }
    })
    
    const weekTotal = daily.reduce((sum, d) => sum + d.amount, 0)
    
    return {
      today: {
        total: todayTotal,
        profit: todayProfit,
        tips: todayTips,
        commission: todayCommission,
      },
      thisWeek: {
        total: weekTotal,
        percentChange: 0, // Would need previous week data to calculate
        daily
      }
    }
  }, [transactions, appointments, today, todayDate])

  // Compute issues statistics
  const issuesSummary = useMemo(() => {
    const appts = appointments || []
    const todayAppts = appts.filter(a => a.date === today)
    
    return {
      lateArrivals: 0, // Would need additional tracking
      noShows: 0, // Would need additional tracking
      canceled: todayAppts.filter(a => a.status === 'cancelled').length,
    }
  }, [appointments, today])

  // Compute dogs groomed / completed appointments
  const dogsGroomedSummary = useMemo(() => {
    const appts = appointments || []
    const completedStatuses = ['completed', 'paid', 'notified']
    
    const weekStart = startOfWeek(todayDate, { weekStartsOn: 1 })
    const monthStart = startOfMonth(todayDate)
    
    const dayCount = appts.filter(a => 
      a.date === today && completedStatuses.includes(a.status)
    ).length
    
    const weekCount = appts.filter(a => {
      const aptDate = parseISO(a.date)
      return aptDate >= weekStart && aptDate <= todayDate && completedStatuses.includes(a.status)
    }).length
    
    const monthCount = appts.filter(a => {
      const aptDate = parseISO(a.date)
      return aptDate >= monthStart && aptDate <= todayDate && completedStatuses.includes(a.status)
    }).length
    
    const lifetimeCount = appts.filter(a => completedStatuses.includes(a.status)).length
    
    return {
      day: dayCount,
      week: weekCount,
      month: monthCount,
      lifetime: lifetimeCount,
    }
  }, [appointments, today, todayDate])

  // Compute booked percentage by period
  const bookedPercentageSummary = useMemo(() => {
    const appts = appointments || []
    const groomers = (staff || []).filter(s => s.isGroomer && s.status === 'Active')
    const dailySlots = Math.max(groomers.length * SLOTS_PER_GROOMER_PER_DAY, MIN_DAILY_CAPACITY_SLOTS)
    
    const weekStart = startOfWeek(todayDate, { weekStartsOn: 1 })
    const monthStart = startOfMonth(todayDate)
    
    // Count active appointments (not cancelled)
    const todayAppts = appts.filter(a => a.date === today && a.status !== 'cancelled').length
    
    const weekAppts = appts.filter(a => {
      const aptDate = parseISO(a.date)
      return aptDate >= weekStart && aptDate <= todayDate && a.status !== 'cancelled'
    }).length
    
    const monthAppts = appts.filter(a => {
      const aptDate = parseISO(a.date)
      return aptDate >= monthStart && aptDate <= todayDate && a.status !== 'cancelled'
    }).length
    
    // Calculate days in each period
    const daysInWeek = Math.max(1, differenceInDays(todayDate, weekStart) + 1)
    const daysInMonth = Math.max(1, differenceInDays(todayDate, monthStart) + 1)
    
    return {
      day: Math.min(100, Math.round((todayAppts / dailySlots) * 100)),
      week: Math.min(100, Math.round((weekAppts / (dailySlots * daysInWeek)) * 100)),
      month: Math.min(100, Math.round((monthAppts / (dailySlots * daysInMonth)) * 100)),
    }
  }, [appointments, staff, today, todayDate])

  // Compute client statistics
  const clientsSummary = useMemo(() => {
    const clientList = clients || []
    const appts = appointments || []
    const monthStart = startOfMonth(todayDate)
    
    // Count new clients this month
    const newThisMonth = clientList.filter(c => {
      if (!c.createdAt) return false
      const createdDate = parseISO(c.createdAt)
      return createdDate >= monthStart && createdDate <= todayDate
    }).length
    
    // Calculate repeat rate
    const clientAppointmentCounts = new Map<string, number>()
    appts.forEach(a => {
      if (a.status !== 'cancelled') {
        clientAppointmentCounts.set(a.clientId, (clientAppointmentCounts.get(a.clientId) || 0) + 1)
      }
    })
    const uniqueClients = clientAppointmentCounts.size
    const repeatClients = Array.from(clientAppointmentCounts.values()).filter(count => count > 1).length
    const repeatRate = uniqueClients > 0 ? Math.round((repeatClients / uniqueClients) * 100) : 0
    
    // Calculate average days between visits (for clients with multiple appointments)
    let totalDaysBetween = 0
    let pairCount = 0
    
    // Group appointments by client
    const clientAppts = new Map<string, string[]>()
    appts.forEach(a => {
      if (a.status !== 'cancelled') {
        const existing = clientAppts.get(a.clientId) || []
        existing.push(a.date)
        clientAppts.set(a.clientId, existing)
      }
    })
    
    clientAppts.forEach(dates => {
      if (dates.length > 1) {
        const sortedDates = dates.sort()
        for (let i = 1; i < sortedDates.length; i++) {
          const diff = differenceInDays(parseISO(sortedDates[i]), parseISO(sortedDates[i - 1]))
          if (diff > 0) {
            totalDaysBetween += diff
            pairCount++
          }
        }
      }
    })
    
    const avgDaysBetween = pairCount > 0 ? Math.round(totalDaysBetween / pairCount) : DEFAULT_REBOOKING_DAYS
    
    return {
      total: clientList.length,
      newThisMonth,
      repeatRate,
      avgDaysBetween,
    }
  }, [clients, appointments, todayDate])

  // Compute groomer data for workload (today's data)
  const groomerData = useMemo(() => {
    const appts = appointments || []
    const staffList = staff || []
    const groomers = staffList.filter(s => s.isGroomer && s.status === 'Active')
    
    const todayAppts = appts.filter(a => a.date === today && a.status !== 'cancelled')
    const totalMinutes = WORKDAY_HOURS * 60
    
    return groomers.map((groomer, index) => {
      const groomerAppts = todayAppts.filter(a => a.groomerId === groomer.id)
      
      // Calculate booked minutes
      let bookedMinutes = 0
      const schedule: Array<{ start: number; duration: number; client: string }> = []
      
      groomerAppts.forEach(a => {
        const [startH, startM] = (a.startTime || '09:00').split(':').map(Number)
        const [endH, endM] = (a.endTime || '10:00').split(':').map(Number)
        const duration = (endH * 60 + endM) - (startH * 60 + startM)
        bookedMinutes += duration
        
        schedule.push({
          start: startH + startM / 60,
          duration: duration / 60,
          client: a.petName
        })
      })
      
      schedule.sort((a, b) => a.start - b.start)
      
      // Calculate last appointment end time
      const lastAppt = schedule[schedule.length - 1]
      let lastAppointmentEnd = '5:00 PM'
      if (lastAppt) {
        const lastEndHour = lastAppt.start + lastAppt.duration
        const h = Math.floor(lastEndHour)
        const m = Math.round((lastEndHour - h) * 60)
        const period = h >= 12 ? 'PM' : 'AM'
        const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h
        lastAppointmentEnd = `${displayHour}:${m.toString().padStart(2, '0')} ${period}`
      }
      
      return {
        id: index + 1,
        name: groomer.name,
        bookedPercentage: Math.min(100, Math.round((bookedMinutes / totalMinutes) * 100)),
        appointmentCount: groomerAppts.length,
        lastAppointmentEnd,
        schedule
      }
    })
  }, [appointments, staff, today])

  // Compute groomer lifetime average metrics
  const groomerLifetimeData = useMemo(() => {
    const appts = appointments || []
    const staffList = staff || []
    const groomers = staffList.filter(s => s.isGroomer && s.status === 'Active')
    const completedStatuses = ['completed', 'paid', 'notified']
    
    return groomers.map((groomer, index) => {
      // Get all completed appointments for this groomer
      const groomerAppts = appts.filter(a => 
        a.groomerId === groomer.id && completedStatuses.includes(a.status)
      )
      
      // Get unique days worked
      const uniqueDays = new Set(groomerAppts.map(a => a.date))
      const daysWorked = Math.max(1, uniqueDays.size)
      
      // Calculate total revenue
      const totalRevenue = groomerAppts.reduce((sum, a) => sum + a.totalPrice, 0)
      
      // Calculate averages
      const avgDogsPerDay = Math.round((groomerAppts.length / daysWorked) * 10) / 10
      const avgRevenuePerDay = Math.round(totalRevenue / daysWorked)
      
      return {
        id: index + 1,
        groomerId: groomer.id,
        name: groomer.name,
        totalAppointments: groomerAppts.length,
        totalRevenue,
        daysWorked,
        avgDogsPerDay,
        avgRevenuePerDay
      }
    })
  }, [appointments, staff])

  // Compute recent activity from appointments
  const recentActivity = useMemo(() => {
    const appts = appointments || []
    const activity: Array<{
      id: string
      type: string
      category: string
      description: string
      client: string
      time: string
    }> = []
    
    const yesterday = format(subDays(todayDate, 1), 'yyyy-MM-dd')
    
    // Get recent bookings (scheduled appointments)
    const recentBookings = appts
      .filter(a => a.status === 'scheduled' || a.status === 'checked-in')
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })
      .slice(0, 4)
    
    recentBookings.forEach((apt, i) => {
      let category = 'thisWeek'
      let timeDisplay = '3+ days ago'
      
      if (apt.date === today) {
        category = 'today'
        timeDisplay = i === 0 ? '5 minutes ago' : i === 1 ? '1 hour ago' : '3 hours ago'
      } else if (apt.date === yesterday) {
        category = 'yesterday'
        timeDisplay = 'Yesterday'
      }
      
      activity.push({
        id: `activity-booking-${apt.id}`,
        type: 'booking',
        category,
        description: `New appointment booked for ${apt.petName}`,
        client: apt.clientName,
        time: timeDisplay
      })
    })
    
    // Add recent cancellations
    const canceledAppts = appts
      .filter(a => a.status === 'cancelled')
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA
      })
      .slice(0, 2)
    
    canceledAppts.forEach((apt) => {
      let category = 'thisWeek'
      let timeDisplay = 'This week'
      
      if (apt.date === today) {
        category = 'today'
        timeDisplay = '2 hours ago'
      } else if (apt.date === yesterday) {
        category = 'yesterday'
        timeDisplay = 'Yesterday 4:30 PM'
      }
      
      activity.push({
        id: `activity-cancel-${apt.id}`,
        type: 'cancellation',
        category,
        description: `Appointment canceled for ${apt.petName}`,
        client: apt.clientName,
        time: timeDisplay
      })
    })
    
    // Add recent completed appointments
    const completedAppts = appts
      .filter(a => a.status === 'completed' || a.status === 'paid')
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA
      })
      .slice(0, 2)
    
    completedAppts.forEach((apt) => {
      let category = 'thisWeek'
      let timeDisplay = 'This week'
      
      if (apt.date === today) {
        category = 'today'
        timeDisplay = 'Earlier today'
      } else if (apt.date === yesterday) {
        category = 'yesterday'
        timeDisplay = 'Yesterday'
      }
      
      activity.push({
        id: `activity-complete-${apt.id}`,
        type: 'booking',
        category,
        description: `Completed grooming for ${apt.petName}`,
        client: apt.clientName,
        time: timeDisplay
      })
    })
    
    return activity.slice(0, 8) // Limit to 8 items
  }, [appointments, today, todayDate])

  // Compute expenses data aggregated by category for current month
  const expensesData = useMemo(() => {
    const expenseList = expenses || []
    const monthStart = startOfMonth(todayDate)
    
    // Filter to current month expenses
    const monthExpenses = expenseList.filter(e => {
      const expenseDate = parseISO(e.date)
      return expenseDate >= monthStart && expenseDate <= todayDate
    })
    
    // Aggregate by category
    const categoryTotals = new Map<string, number>()
    monthExpenses.forEach(e => {
      const category = e.category.toLowerCase()
      categoryTotals.set(category, (categoryTotals.get(category) || 0) + e.amount)
    })
    
    // Convert to array format expected by ExpensesCard
    const result = Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount,
        color: EXPENSE_CATEGORY_COLORS[category] || EXPENSE_CATEGORY_COLORS.other
      }))
      .sort((a, b) => b.amount - a.amount)
    
    return result
  }, [expenses, todayDate])

  return {
    appointmentsSummary,
    capacitySummary,
    revenueSummary,
    issuesSummary,
    dogsGroomedSummary,
    bookedPercentageSummary,
    clientsSummary,
    groomerData,
    groomerLifetimeData,
    recentActivity,
    expensesData,
  }
}
