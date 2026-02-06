/**
 * Date utilities for timezone-aware operations
 * Fixes critical issue #3 and #8 from AUDIT_REPORT.md
 */

import { format, parseISO } from 'date-fns'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'

/**
 * Get the business timezone from settings
 * Falls back to browser timezone if not set
 */
export function getBusinessTimezone(): string {
  try {
    const settingsSources = ['kv:business-info', 'kv:business-settings']
    for (const key of settingsSources) {
      const settings = localStorage.getItem(key)
      if (!settings) {
        continue
      }
      const parsed = JSON.parse(settings)
      if (parsed?.timezone) {
        return parsed.timezone
      }
    }
  } catch (error) {
    console.warn('Failed to get business timezone from settings:', error)
  }
  // Fallback to browser timezone
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Get current date in business timezone as YYYY-MM-DD format
 * This prevents off-by-one date bugs when using UTC conversion
 */
export function getTodayInBusinessTimezone(): string {
  const timezone = getBusinessTimezone()
  const now = new Date()
  const zonedDate = toZonedTime(now, timezone)
  return format(zonedDate, 'yyyy-MM-dd')
}

/**
 * Get current date and time in business timezone as ISO string
 */
export function getNowInBusinessTimezone(): string {
  const timezone = getBusinessTimezone()
  const now = new Date()
  const zonedDate = toZonedTime(now, timezone)
  return zonedDate.toISOString()
}

/**
 * Convert a date string to business timezone for display
 */
export function toBusinessTimezone(dateString: string): Date {
  const timezone = getBusinessTimezone()
  const date = parseISO(dateString)
  return toZonedTime(date, timezone)
}

/**
 * Convert a local date/time to business timezone for storage
 */
export function fromBusinessTimezone(date: Date): string {
  const timezone = getBusinessTimezone()
  const zonedDate = fromZonedTime(date, timezone)
  return zonedDate.toISOString()
}

/**
 * Format a date string in business timezone
 */
export function formatInBusinessTimezone(dateString: string, formatString: string): string {
  const timezone = getBusinessTimezone()
  const date = parseISO(dateString)
  const zonedDate = toZonedTime(date, timezone)
  return format(zonedDate, formatString)
}

/**
 * Format a date string from yyyy-mm-dd to mm-dd-yyyy display format
 * This is the standard display format for the application
 */
export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return ''
  const timezone = getBusinessTimezone()
  const date = parseISO(dateString)
  const zonedDate = toZonedTime(date, timezone)
  return format(zonedDate, 'MM-dd-yyyy')
}

/**
 * Convert a JavaScript Date object to YYYY-MM-DD string in business timezone
 * Use this instead of date.toISOString().split('T')[0] to avoid timezone bugs
 */
export function dateToBusinessDateString(date: Date): string {
  const timezone = getBusinessTimezone()
  const zonedDate = toZonedTime(date, timezone)
  return format(zonedDate, 'yyyy-MM-dd')
}

/**
 * Get the current Date object adjusted to represent the start of today in business timezone
 * This is useful when you need a Date object for "today" that respects business timezone
 */
export function getTodayDateInBusinessTimezone(): Date {
  const timezone = getBusinessTimezone()
  const now = new Date()
  return toZonedTime(now, timezone)
}

/**
 * Check if two dates are the same day in business timezone
 * Use this instead of comparing with new Date() which may have timezone issues
 */
export function isSameDayInBusinessTimezone(date1: Date, date2: Date): boolean {
  const timezone = getBusinessTimezone()
  const zonedDate1 = toZonedTime(date1, timezone)
  const zonedDate2 = toZonedTime(date2, timezone)
  return format(zonedDate1, 'yyyy-MM-dd') === format(zonedDate2, 'yyyy-MM-dd')
}
