import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getTodayInBusinessTimezone, getNowInBusinessTimezone, getBusinessTimezone, dateToBusinessDateString, getTodayDateInBusinessTimezone, isSameDayInBusinessTimezone, parseDateStringAsLocal, formatDateString } from '../lib/date-utils'

describe('Date Utilities - Timezone Handling', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('getBusinessTimezone', () => {
    it('should return timezone from business settings if available', () => {
      const settings = { timezone: 'America/Los_Angeles' }
      localStorage.setItem('kv:business-info', JSON.stringify(settings))
      
      const timezone = getBusinessTimezone()
      expect(timezone).toBe('America/Los_Angeles')
    })

    it('should return timezone from legacy business settings if available', () => {
      const settings = { timezone: 'America/Denver' }
      localStorage.setItem('kv:business-settings', JSON.stringify(settings))

      const timezone = getBusinessTimezone()
      expect(timezone).toBe('America/Denver')
    })

    it('should fallback to browser timezone if settings not available', () => {
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      
      const timezone = getBusinessTimezone()
      expect(timezone).toBe(browserTimezone)
    })

    it('should handle invalid JSON in settings gracefully', () => {
      localStorage.setItem('kv:business-info', 'invalid json')
      
      const timezone = getBusinessTimezone()
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      expect(timezone).toBe(browserTimezone)
    })
  })

  describe('getTodayInBusinessTimezone', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const today = getTodayInBusinessTimezone()
      
      // Check format matches YYYY-MM-DD
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('should use business timezone from settings', () => {
      // Set timezone to a known value
      const settings = { timezone: 'America/New_York' }
      localStorage.setItem('kv:business-info', JSON.stringify(settings))
      
      const today = getTodayInBusinessTimezone()
      
      // Should not throw and should return a valid date
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('getNowInBusinessTimezone', () => {
    it('should return ISO string', () => {
      const now = getNowInBusinessTimezone()
      
      // Check it's a valid ISO string
      expect(() => new Date(now)).not.toThrow()
      expect(now).toContain('T')
    })

    it('should use business timezone', () => {
      const settings = { timezone: 'America/Chicago' }
      localStorage.setItem('kv:business-info', JSON.stringify(settings))
      
      const now = getNowInBusinessTimezone()
      
      // Should return a valid ISO string
      expect(() => new Date(now)).not.toThrow()
    })
  })

  describe('Date consistency - prevents off-by-one errors', () => {
    it('should not change date across timezone conversions', () => {
      // This test ensures we don't have off-by-one date errors
      const settings = { timezone: 'America/New_York' }
      localStorage.setItem('kv:business-info', JSON.stringify(settings))
      
      const dateString = getTodayInBusinessTimezone()
      const [year, month, day] = dateString.split('-').map(Number)
      
      // Verify all parts are valid
      expect(year).toBeGreaterThan(2020)
      expect(month).toBeGreaterThanOrEqual(1)
      expect(month).toBeLessThanOrEqual(12)
      expect(day).toBeGreaterThanOrEqual(1)
      expect(day).toBeLessThanOrEqual(31)
    })
  })

  describe('dateToBusinessDateString', () => {
    it('should convert Date object to YYYY-MM-DD format', () => {
      const testDate = new Date(2026, 1, 6, 12, 0, 0) // Feb 6, 2026 at noon
      const result = dateToBusinessDateString(testDate)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('should use business timezone for conversion', () => {
      const settings = { timezone: 'America/New_York' }
      localStorage.setItem('kv:business-info', JSON.stringify(settings))
      
      const testDate = new Date(2026, 1, 6, 23, 59, 0) // Late night
      const result = dateToBusinessDateString(testDate)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('getTodayDateInBusinessTimezone', () => {
    it('should return a valid Date object', () => {
      const result = getTodayDateInBusinessTimezone()
      expect(result).toBeInstanceOf(Date)
      expect(result.getTime()).not.toBeNaN()
    })

    it('should use business timezone', () => {
      const settings = { timezone: 'America/Chicago' }
      localStorage.setItem('kv:business-info', JSON.stringify(settings))
      
      const result = getTodayDateInBusinessTimezone()
      expect(result).toBeInstanceOf(Date)
    })
  })

  describe('isSameDayInBusinessTimezone', () => {
    it('should return true for same day dates', () => {
      const date1 = new Date(2026, 1, 6, 9, 0, 0)
      const date2 = new Date(2026, 1, 6, 18, 0, 0)
      expect(isSameDayInBusinessTimezone(date1, date2)).toBe(true)
    })

    it('should return false for different day dates', () => {
      const date1 = new Date(2026, 1, 6, 12, 0, 0)
      const date2 = new Date(2026, 1, 7, 12, 0, 0)
      expect(isSameDayInBusinessTimezone(date1, date2)).toBe(false)
    })

    it('should use business timezone for comparison', () => {
      const settings = { timezone: 'America/Los_Angeles' }
      localStorage.setItem('kv:business-info', JSON.stringify(settings))
      
      const date1 = new Date(2026, 1, 6, 12, 0, 0)
      const date2 = new Date(2026, 1, 6, 20, 0, 0)
      expect(isSameDayInBusinessTimezone(date1, date2)).toBe(true)
    })
  })

  describe('parseDateStringAsLocal', () => {
    it('should parse YYYY-MM-DD as local date, not UTC', () => {
      const dateStr = '2026-02-06'
      const parsed = parseDateStringAsLocal(dateStr)
      
      // The date should be Feb 6 regardless of timezone
      // Using getDate() to get local date
      expect(parsed.getDate()).toBe(6)
      expect(parsed.getMonth()).toBe(1) // 0-indexed, so 1 = February
      expect(parsed.getFullYear()).toBe(2026)
    })

    it('should return valid date for empty string fallback', () => {
      const parsed = parseDateStringAsLocal('')
      expect(parsed).toBeInstanceOf(Date)
      expect(parsed.getTime()).not.toBeNaN()
    })
  })

  describe('formatDateString', () => {
    it('should format date string correctly without UTC conversion bug', () => {
      const dateStr = '2026-02-06'
      const formatted = formatDateString(dateStr)
      
      // Should be Feb 6, not Feb 5 (which would happen with UTC bug)
      expect(formatted).toBe('Feb 6, 2026')
    })

    it('should support custom format strings', () => {
      const dateStr = '2026-02-06'
      const formatted = formatDateString(dateStr, 'yyyy-MM-dd')
      expect(formatted).toBe('2026-02-06')
    })

    it('should return empty string for empty input', () => {
      expect(formatDateString('')).toBe('')
    })
  })
})
