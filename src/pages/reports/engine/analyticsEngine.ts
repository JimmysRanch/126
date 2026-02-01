/**
 * Analytics Engine
 * Core calculation functions for reports
 * All functions are pure and stateless for easy testing and caching
 */

import {
  NormalizedAppointment,
  NormalizedTransaction,
  NormalizedClient,
  NormalizedStaff,
  NormalizedInventoryItem,
  NormalizedDataStore,
  ReportFilters,
  TimeBasis,
  KPIValue,
  ChartDataPoint,
  AggregatedRow,
  DrillRow,
} from '../types'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, startOfYear, parseISO, differenceInDays } from 'date-fns'
import { getBusinessTimezone } from '@/lib/date-utils'

// ==================== Date Range Utilities ====================

export function getDateRange(filters: ReportFilters): { start: Date; end: Date } {
  const today = new Date()
  
  switch (filters.dateRange) {
    case 'today':
      return { start: today, end: today }
    case 'yesterday':
      return { start: subDays(today, 1), end: subDays(today, 1) }
    case 'last7':
      return { start: subDays(today, 6), end: today }
    case 'thisWeek':
      return { start: startOfWeek(today), end: endOfWeek(today) }
    case 'last30':
      return { start: subDays(today, 29), end: today }
    case 'last90':
      return { start: subDays(today, 89), end: today }
    case 'thisMonth':
      return { start: startOfMonth(today), end: endOfMonth(today) }
    case 'lastMonth': {
      const lastMonth = subDays(startOfMonth(today), 1)
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) }
    }
    case 'quarter':
      return { start: startOfQuarter(today), end: today }
    case 'ytd':
      return { start: startOfYear(today), end: today }
    case 'custom':
      return {
        start: filters.customDateStart ? parseISO(filters.customDateStart) : subDays(today, 29),
        end: filters.customDateEnd ? parseISO(filters.customDateEnd) : today,
      }
    default:
      return { start: subDays(today, 29), end: today }
  }
}

export function getPreviousPeriod(start: Date, end: Date): { start: Date; end: Date } {
  const daysDiff = differenceInDays(end, start) + 1
  return {
    start: subDays(start, daysDiff),
    end: subDays(end, daysDiff),
  }
}

function getDateByBasis(appt: NormalizedAppointment, basis: TimeBasis): string | undefined {
  switch (basis) {
    case 'service':
      return appt.serviceDate
    case 'checkout':
      return appt.checkoutDate || appt.serviceDate
    case 'transaction':
      return appt.transactionDate || appt.checkoutDate || appt.serviceDate
    default:
      return appt.serviceDate
  }
}

function isDateInRange(dateStr: string | undefined, start: Date, end: Date): boolean {
  if (!dateStr) return false
  const date = parseISO(dateStr)
  return date >= start && date <= end
}

// ==================== Filter Functions ====================

export function filterAppointments(
  appointments: NormalizedAppointment[],
  filters: ReportFilters
): NormalizedAppointment[] {
  const { start, end } = getDateRange(filters)
  
  return appointments.filter(appt => {
    // Date filter by time basis
    const apptDate = getDateByBasis(appt, filters.timeBasis)
    if (!isDateInRange(apptDate, start, end)) return false
    
    // Status filter
    if (filters.appointmentStatuses.length > 0) {
      if (!filters.appointmentStatuses.includes(appt.status)) return false
    }
    
    // Staff filter
    if (filters.staffIds.length > 0) {
      if (!filters.staffIds.includes(appt.groomerId)) return false
    }
    
    // Service filter
    if (filters.serviceIds.length > 0) {
      const apptServiceIds = appt.services.map(s => s.id)
      if (!filters.serviceIds.some(id => apptServiceIds.includes(id))) return false
    }
    
    // Pet size filter
    if (filters.petSizes.length > 0) {
      if (!filters.petSizes.includes(appt.petWeightCategory)) return false
    }
    
    // Channel filter
    if (filters.channels.length > 0) {
      if (!filters.channels.includes(appt.channel)) return false
    }
    
    // Client type filter
    if (filters.clientTypes.length > 0) {
      if (!filters.clientTypes.includes(appt.clientType)) return false
    }
    
    // Payment method filter
    if (filters.paymentMethods.length > 0 && appt.paymentMethod) {
      if (!filters.paymentMethods.includes(appt.paymentMethod)) return false
    }
    
    return true
  })
}

export function filterTransactions(
  transactions: NormalizedTransaction[],
  filters: ReportFilters
): NormalizedTransaction[] {
  const { start, end } = getDateRange(filters)
  
  return transactions.filter(t => {
    // Date filter
    if (!isDateInRange(t.date, start, end)) return false
    
    // Payment method filter
    if (filters.paymentMethods.length > 0) {
      if (!filters.paymentMethods.includes(t.paymentMethod)) return false
    }
    
    return true
  })
}

// ==================== KPI Calculations ====================

export function calculateGrossSales(appointments: NormalizedAppointment[]): number {
  return appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.subtotalCents, 0)
}

export function calculateNetSales(
  appointments: NormalizedAppointment[],
  includeDiscounts: boolean = true,
  includeRefunds: boolean = true
): number {
  return appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => {
      let net = a.subtotalCents
      if (includeDiscounts) net -= a.discountCents
      return sum + net
    }, 0)
}

export function calculateTotalTips(appointments: NormalizedAppointment[]): number {
  return appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.tipCents, 0)
}

export function calculateTotalTax(appointments: NormalizedAppointment[]): number {
  return appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.taxCents, 0)
}

export function calculateTotalCollected(appointments: NormalizedAppointment[]): number {
  return appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.totalCents, 0)
}

export function calculateTotalDiscounts(appointments: NormalizedAppointment[]): number {
  return appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.discountCents, 0)
}

export function calculateAppointmentsCompleted(appointments: NormalizedAppointment[]): number {
  return appointments.filter(a => a.status === 'completed').length
}

export function calculateAverageTicket(appointments: NormalizedAppointment[]): number {
  const completed = appointments.filter(a => a.status === 'completed')
  if (completed.length === 0) return 0
  const totalNet = calculateNetSales(completed)
  return Math.round(totalNet / completed.length)
}

export function calculateNoShowRate(appointments: NormalizedAppointment[]): number {
  const total = appointments.filter(a => 
    a.status === 'completed' || a.status === 'no-show' || a.lateCancelFlag
  ).length
  if (total === 0) return 0
  const noShows = appointments.filter(a => a.noShowFlag).length
  return (noShows / total) * 100
}

export function calculateLateCancelRate(appointments: NormalizedAppointment[]): number {
  const total = appointments.length
  if (total === 0) return 0
  const lateCancels = appointments.filter(a => a.lateCancelFlag).length
  return (lateCancels / total) * 100
}

export function calculateRebook24h(appointments: NormalizedAppointment[]): number {
  const completed = appointments.filter(a => a.status === 'completed')
  if (completed.length === 0) return 0
  const rebooked = completed.filter(a => a.rebookedWithin24h).length
  return (rebooked / completed.length) * 100
}

export function calculateRebook7d(appointments: NormalizedAppointment[]): number {
  const completed = appointments.filter(a => a.status === 'completed')
  if (completed.length === 0) return 0
  const rebooked = completed.filter(a => a.rebookedWithin7d).length
  return (rebooked / completed.length) * 100
}

export function calculateRebook30d(appointments: NormalizedAppointment[]): number {
  const completed = appointments.filter(a => a.status === 'completed')
  if (completed.length === 0) return 0
  const rebooked = completed.filter(a => a.rebookedWithin30d).length
  return (rebooked / completed.length) * 100
}

export function calculateUtilization(
  appointments: NormalizedAppointment[],
  staff: NormalizedStaff[],
  workHoursPerDay: number = 8
): number {
  const { start, end } = { start: new Date(), end: new Date() } // Would use actual range
  const workDays = Math.max(1, differenceInDays(end, start) + 1)
  const groomers = staff.filter(s => s.isGroomer && s.status === 'active')
  const totalAvailableMinutes = groomers.length * workDays * workHoursPerDay * 60
  
  if (totalAvailableMinutes === 0) return 0
  
  const bookedMinutes = appointments
    .filter(a => a.status === 'completed' || a.status === 'scheduled')
    .reduce((sum, a) => sum + a.scheduledDurationMinutes, 0)
  
  return (bookedMinutes / totalAvailableMinutes) * 100
}

// Margin calculations
export function calculateContributionMargin(
  appointments: NormalizedAppointment[],
  transactions: NormalizedTransaction[]
): number {
  const netSales = calculateNetSales(appointments)
  const processingFees = transactions.reduce((sum, t) => sum + t.processingFeeCents, 0)
  const laborCost = appointments.reduce((sum, a) => {
    // Estimate labor at 40% of service price
    return sum + Math.round(a.subtotalCents * 0.4)
  }, 0)
  
  return netSales - processingFees - laborCost
}

export function calculateContributionMarginPercent(
  appointments: NormalizedAppointment[],
  transactions: NormalizedTransaction[]
): number {
  const netSales = calculateNetSales(appointments)
  if (netSales === 0) return 0
  const margin = calculateContributionMargin(appointments, transactions)
  return (margin / netSales) * 100
}

// ==================== Chart Data Generation ====================

export function generateSalesByDayChart(
  appointments: NormalizedAppointment[],
  filters: ReportFilters
): ChartDataPoint[] {
  const { start, end } = getDateRange(filters)
  const dayMap = new Map<string, number>()
  
  // Initialize all days in range
  let current = new Date(start)
  while (current <= end) {
    const key = format(current, 'yyyy-MM-dd')
    dayMap.set(key, 0)
    current = new Date(current.getTime() + 86400000)
  }
  
  // Sum sales by day
  appointments
    .filter(a => a.status === 'completed')
    .forEach(a => {
      const date = getDateByBasis(a, filters.timeBasis) || a.serviceDate
      const key = date.substring(0, 10)
      dayMap.set(key, (dayMap.get(key) || 0) + a.netCents)
    })
  
  return Array.from(dayMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({
      label: format(parseISO(date), 'MMM d'),
      value,
    }))
}

export function generateSalesByServiceCategory(
  appointments: NormalizedAppointment[]
): ChartDataPoint[] {
  const categoryMap = new Map<string, number>()
  
  appointments
    .filter(a => a.status === 'completed')
    .forEach(a => {
      a.services.forEach(s => {
        categoryMap.set(s.category, (categoryMap.get(s.category) || 0) + s.priceCents)
      })
    })
  
  return Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, value]) => ({
      label: category,
      value,
    }))
}

export function generateRevenueByStaff(
  appointments: NormalizedAppointment[]
): ChartDataPoint[] {
  const staffMap = new Map<string, number>()
  
  appointments
    .filter(a => a.status === 'completed')
    .forEach(a => {
      staffMap.set(a.groomerName, (staffMap.get(a.groomerName) || 0) + a.netCents)
    })
  
  return Array.from(staffMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      label: name,
      value,
    }))
}

export function generateWeekdayHourHeatmap(
  appointments: NormalizedAppointment[]
): { weekday: string; hour: number; value: number }[] {
  const heatmapData: { weekday: string; hour: number; value: number }[] = []
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const dataMap = new Map<string, number>()
  
  appointments
    .filter(a => a.status === 'completed')
    .forEach(a => {
      const date = parseISO(a.serviceDate)
      const weekday = weekdays[date.getDay()]
      const hour = parseInt(a.startTime.split(':')[0])
      const key = `${weekday}-${hour}`
      dataMap.set(key, (dataMap.get(key) || 0) + a.netCents)
    })
  
  weekdays.forEach(weekday => {
    for (let hour = 8; hour <= 18; hour++) {
      const key = `${weekday}-${hour}`
      heatmapData.push({
        weekday,
        hour,
        value: dataMap.get(key) || 0,
      })
    }
  })
  
  return heatmapData
}

// ==================== Table Aggregation ====================

export function aggregateByDimension(
  appointments: NormalizedAppointment[],
  dimension: 'service' | 'staff' | 'day' | 'week' | 'month' | 'channel' | 'clientType' | 'paymentMethod'
): AggregatedRow[] {
  const groups = new Map<string, NormalizedAppointment[]>()
  
  appointments.forEach(a => {
    let key: string
    switch (dimension) {
      case 'service':
        a.services.forEach(s => {
          const existing = groups.get(s.name) || []
          existing.push(a)
          groups.set(s.name, existing)
        })
        return
      case 'staff':
        key = a.groomerName
        break
      case 'day':
        key = a.serviceDate
        break
      case 'week':
        key = format(startOfWeek(parseISO(a.serviceDate)), 'yyyy-MM-dd')
        break
      case 'month':
        key = format(parseISO(a.serviceDate), 'yyyy-MM')
        break
      case 'channel':
        key = a.channel
        break
      case 'clientType':
        key = a.clientType
        break
      case 'paymentMethod':
        key = a.paymentMethod || 'Unknown'
        break
      default:
        key = 'All'
    }
    const existing = groups.get(key) || []
    existing.push(a)
    groups.set(key, existing)
  })
  
  return Array.from(groups.entries()).map(([dimensionValue, appts]) => {
    const completed = appts.filter(a => a.status === 'completed')
    return {
      id: dimensionValue,
      dimension,
      dimensionValue,
      metrics: {
        grossSales: calculateGrossSales(completed),
        netSales: calculateNetSales(completed),
        discounts: calculateTotalDiscounts(completed),
        tips: calculateTotalTips(completed),
        tax: calculateTotalTax(completed),
        appointments: completed.length,
        avgTicket: calculateAverageTicket(completed),
        noShowRate: calculateNoShowRate(appts),
      },
      drillKey: `${dimension}:${dimensionValue}`,
    }
  }).sort((a, b) => b.metrics.netSales - a.metrics.netSales)
}

// ==================== Drill Row Generation ====================

export function getDrillRows(
  appointments: NormalizedAppointment[],
  transactions: NormalizedTransaction[],
  drillKey: string
): DrillRow[] {
  const [dimension, value] = drillKey.split(':')
  
  let filteredAppts: NormalizedAppointment[] = []
  
  switch (dimension) {
    case 'service':
      filteredAppts = appointments.filter(a => 
        a.services.some(s => s.name === value)
      )
      break
    case 'staff':
      filteredAppts = appointments.filter(a => a.groomerName === value)
      break
    case 'day':
      filteredAppts = appointments.filter(a => a.serviceDate === value)
      break
    case 'channel':
      filteredAppts = appointments.filter(a => a.channel === value)
      break
    case 'clientType':
      filteredAppts = appointments.filter(a => a.clientType === value)
      break
    default:
      filteredAppts = appointments
  }
  
  return filteredAppts.map(a => ({
    id: a.id,
    type: 'appointment' as const,
    data: a,
    timestamp: a.serviceDate,
  }))
}

// ==================== KPI with Delta ====================

export function calculateKPIWithDelta(
  currentValue: number,
  previousValue: number,
  format: 'money' | 'percent' | 'number' | 'minutes' | 'days'
): KPIValue {
  const delta = currentValue - previousValue
  const deltaPercent = previousValue !== 0 ? (delta / previousValue) * 100 : 0
  
  return {
    current: currentValue,
    previous: previousValue,
    delta,
    deltaPercent,
    format,
  }
}

// ==================== Cache Utilities ====================

const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 60000 // 1 minute

export function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key)
  if (!entry) return undefined
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return undefined
  }
  return entry.data as T
}

export function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export function clearCache(): void {
  cache.clear()
}

// Performance logging (dev mode only)
export function measurePerformance<T>(name: string, fn: () => T): T {
  if (process.env.NODE_ENV !== 'development') {
    return fn()
  }
  const start = performance.now()
  const result = fn()
  const duration = performance.now() - start
  console.log(`[Reports Perf] ${name}: ${duration.toFixed(2)}ms`)
  return result
}
