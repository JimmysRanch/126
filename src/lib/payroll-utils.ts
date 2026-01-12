import { format, addDays, addWeeks, startOfDay, differenceInDays, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { getBusinessTimezone } from './date-utils'

export type PayPeriodType = 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly'

export type CompensationType = 
  | 'hourly'
  | 'salary'
  | 'commission'
  | 'hourly-plus-commission'
  | 'salary-plus-commission'
  | 'override'
  | 'guaranteed-vs-commission'

export interface PayPeriodSettings {
  type: PayPeriodType
  anchorStartDate: string
  anchorEndDate: string
  anchorPayDate: string
}

export interface PayPeriod {
  startDate: string
  endDate: string
  payDate: string
}

export interface StaffCompensation {
  type: CompensationType
  hourlyRate?: number
  salaryAmount?: number
  commissionRate?: number
  overrideStaffId?: string
  overridePercentage?: number
  guaranteedAmount?: number
  useHigherAmount?: boolean
}

const DEFAULT_BIWEEKLY_SETTINGS: PayPeriodSettings = {
  type: 'bi-weekly',
  anchorStartDate: '2024-12-30',
  anchorEndDate: '2025-01-12',
  anchorPayDate: '2025-01-17'
}

export function getPayPeriodSettings(): PayPeriodSettings {
  try {
    const settings = localStorage.getItem('kv:payroll-settings')
    if (settings) {
      const parsed = JSON.parse(settings)
      if (parsed?.payPeriod) {
        return parsed.payPeriod
      }
    }
  } catch (error) {
    console.warn('Failed to get payroll settings:', error)
  }
  return DEFAULT_BIWEEKLY_SETTINGS
}

export function calculateNextPayPeriod(fromDate: string = new Date().toISOString().split('T')[0]): PayPeriod {
  const settings = getPayPeriodSettings()
  const timezone = getBusinessTimezone()
  
  const from = startOfDay(parseISO(fromDate))
  const anchorStart = startOfDay(parseISO(settings.anchorStartDate))
  
  switch (settings.type) {
    case 'weekly': {
      const daysSinceAnchor = differenceInDays(from, anchorStart)
      const weeksPassed = Math.floor(daysSinceAnchor / 7)
      const nextPeriodStart = addWeeks(anchorStart, weeksPassed + 1)
      const nextPeriodEnd = addDays(nextPeriodStart, 6)
      
      const anchorPayDiff = differenceInDays(parseISO(settings.anchorPayDate), parseISO(settings.anchorEndDate))
      const nextPayDate = addDays(nextPeriodEnd, anchorPayDiff)
      
      return {
        startDate: format(nextPeriodStart, 'yyyy-MM-dd'),
        endDate: format(nextPeriodEnd, 'yyyy-MM-dd'),
        payDate: format(nextPayDate, 'yyyy-MM-dd')
      }
    }
    
    case 'bi-weekly': {
      const daysSinceAnchor = differenceInDays(from, anchorStart)
      const biweeksPassed = Math.floor(daysSinceAnchor / 14)
      const nextPeriodStart = addWeeks(anchorStart, (biweeksPassed + 1) * 2)
      const nextPeriodEnd = addDays(nextPeriodStart, 13)
      
      const anchorPayDiff = differenceInDays(parseISO(settings.anchorPayDate), parseISO(settings.anchorEndDate))
      const nextPayDate = addDays(nextPeriodEnd, anchorPayDiff)
      
      return {
        startDate: format(nextPeriodStart, 'yyyy-MM-dd'),
        endDate: format(nextPeriodEnd, 'yyyy-MM-dd'),
        payDate: format(nextPayDate, 'yyyy-MM-dd')
      }
    }
    
    case 'semi-monthly': {
      const currentDate = parseISO(fromDate)
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const day = currentDate.getDate()
      
      let startDate: Date
      let endDate: Date
      
      if (day < 15) {
        startDate = new Date(year, month, 1)
        endDate = new Date(year, month, 15)
      } else {
        startDate = new Date(year, month, 16)
        const nextMonth = month === 11 ? 0 : month + 1
        const nextYear = month === 11 ? year + 1 : year
        endDate = new Date(nextYear, nextMonth, 0)
      }
      
      const anchorPayDiff = differenceInDays(parseISO(settings.anchorPayDate), parseISO(settings.anchorEndDate))
      const payDate = addDays(endDate, anchorPayDiff)
      
      return {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        payDate: format(payDate, 'yyyy-MM-dd')
      }
    }
    
    case 'monthly': {
      const currentDate = parseISO(fromDate)
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      
      const nextMonth = month === 11 ? 0 : month + 1
      const nextYear = month === 11 ? year + 1 : year
      
      const startDate = new Date(nextYear, nextMonth, 1)
      const endDate = new Date(nextYear, nextMonth + 1, 0)
      
      const anchorPayDiff = differenceInDays(parseISO(settings.anchorPayDate), parseISO(settings.anchorEndDate))
      const payDate = addDays(endDate, anchorPayDiff)
      
      return {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        payDate: format(payDate, 'yyyy-MM-dd')
      }
    }
    
    default:
      return {
        startDate: fromDate,
        endDate: fromDate,
        payDate: fromDate
      }
  }
}

export function getCurrentPayPeriod(forDate: string = new Date().toISOString().split('T')[0]): PayPeriod {
  const settings = getPayPeriodSettings()
  
  const current = startOfDay(parseISO(forDate))
  const anchorStart = startOfDay(parseISO(settings.anchorStartDate))
  
  switch (settings.type) {
    case 'weekly': {
      const daysSinceAnchor = differenceInDays(current, anchorStart)
      const weeksPassed = Math.floor(daysSinceAnchor / 7)
      const periodStart = addWeeks(anchorStart, weeksPassed)
      const periodEnd = addDays(periodStart, 6)
      
      const anchorPayDiff = differenceInDays(parseISO(settings.anchorPayDate), parseISO(settings.anchorEndDate))
      const payDate = addDays(periodEnd, anchorPayDiff)
      
      return {
        startDate: format(periodStart, 'yyyy-MM-dd'),
        endDate: format(periodEnd, 'yyyy-MM-dd'),
        payDate: format(payDate, 'yyyy-MM-dd')
      }
    }
    
    case 'bi-weekly': {
      const daysSinceAnchor = differenceInDays(current, anchorStart)
      const biweeksPassed = Math.floor(daysSinceAnchor / 14)
      const periodStart = addWeeks(anchorStart, biweeksPassed * 2)
      const periodEnd = addDays(periodStart, 13)
      
      const anchorPayDiff = differenceInDays(parseISO(settings.anchorPayDate), parseISO(settings.anchorEndDate))
      const payDate = addDays(periodEnd, anchorPayDiff)
      
      return {
        startDate: format(periodStart, 'yyyy-MM-dd'),
        endDate: format(periodEnd, 'yyyy-MM-dd'),
        payDate: format(payDate, 'yyyy-MM-dd')
      }
    }
    
    case 'semi-monthly': {
      const currentDate = parseISO(forDate)
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const day = currentDate.getDate()
      
      let startDate: Date
      let endDate: Date
      
      if (day <= 15) {
        startDate = new Date(year, month, 1)
        endDate = new Date(year, month, 15)
      } else {
        startDate = new Date(year, month, 16)
        const nextMonth = month === 11 ? 0 : month + 1
        const nextYear = month === 11 ? year + 1 : year
        endDate = new Date(nextYear, nextMonth, 0)
      }
      
      const anchorPayDiff = differenceInDays(parseISO(settings.anchorPayDate), parseISO(settings.anchorEndDate))
      const payDate = addDays(endDate, anchorPayDiff)
      
      return {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        payDate: format(payDate, 'yyyy-MM-dd')
      }
    }
    
    case 'monthly': {
      const currentDate = parseISO(forDate)
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      
      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0)
      
      const anchorPayDiff = differenceInDays(parseISO(settings.anchorPayDate), parseISO(settings.anchorEndDate))
      const payDate = addDays(endDate, anchorPayDiff)
      
      return {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        payDate: format(payDate, 'yyyy-MM-dd')
      }
    }
    
    default:
      return {
        startDate: forDate,
        endDate: forDate,
        payDate: forDate
      }
  }
}

export function formatPayPeriodType(type: PayPeriodType): string {
  switch (type) {
    case 'weekly': return 'Weekly'
    case 'bi-weekly': return 'Bi-Weekly'
    case 'semi-monthly': return 'Semi-Monthly'
    case 'monthly': return 'Monthly'
  }
}

export function calculateStaffPay(
  compensation: StaffCompensation,
  hours: number,
  commissionableAmount: number,
  overrideCommissionAmount?: number
): number {
  switch (compensation.type) {
    case 'hourly':
      return hours * (compensation.hourlyRate || 0)
    
    case 'salary':
      return compensation.salaryAmount || 0
    
    case 'commission':
      return commissionableAmount * ((compensation.commissionRate || 0) / 100)
    
    case 'hourly-plus-commission':
      const hourlyPay = hours * (compensation.hourlyRate || 0)
      const commissionPay = commissionableAmount * ((compensation.commissionRate || 0) / 100)
      return hourlyPay + commissionPay
    
    case 'salary-plus-commission':
      const salary = compensation.salaryAmount || 0
      const commission = commissionableAmount * ((compensation.commissionRate || 0) / 100)
      return salary + commission
    
    case 'override':
      return (overrideCommissionAmount || 0) * ((compensation.overridePercentage || 0) / 100)
    
    case 'guaranteed-vs-commission':
      const guaranteed = compensation.guaranteedAmount || 0
      const commissionEarned = commissionableAmount * ((compensation.commissionRate || 0) / 100)
      
      if (compensation.useHigherAmount) {
        return Math.max(guaranteed, commissionEarned)
      } else {
        return guaranteed + commissionEarned
      }
    
    default:
      return 0
  }
}
