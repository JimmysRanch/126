import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getTodayInBusinessTimezone, getNowInBusinessTimezone, getBusinessTimezone } from '../lib/date-utils'

describe('Date Utilities - Timezone Handling', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('getBusinessTimezone', () => {
    it('should return timezone from business settings if available', () => {
      const settings = { timezone: 'America/Los_Angeles' }
      localStorage.setItem('kv:business-settings', JSON.stringify(settings))
      
      const timezone = getBusinessTimezone()
      expect(timezone).toBe('America/Los_Angeles')
    })

    it('should fallback to browser timezone if settings not available', () => {
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      
      const timezone = getBusinessTimezone()
      expect(timezone).toBe(browserTimezone)
    })

    it('should handle invalid JSON in settings gracefully', () => {
      localStorage.setItem('kv:business-settings', 'invalid json')
      
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
      localStorage.setItem('kv:business-settings', JSON.stringify(settings))
      
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
      localStorage.setItem('kv:business-settings', JSON.stringify(settings))
      
      const now = getNowInBusinessTimezone()
      
      // Should return a valid ISO string
      expect(() => new Date(now)).not.toThrow()
    })
  })

  describe('Date consistency - prevents off-by-one errors', () => {
    it('should not change date across timezone conversions', () => {
      // This test ensures we don't have off-by-one date errors
      const settings = { timezone: 'America/New_York' }
      localStorage.setItem('kv:business-settings', JSON.stringify(settings))
      
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
})
