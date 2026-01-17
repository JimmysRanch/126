# Timezone Implementation Guide

## Overview
All date and time operations in the Scruffy Butts application now respect the business timezone configured in **Settings → Business → Business Timezone**. This ensures consistency across appointments, schedules, payroll, and all time-based operations.

## Core Timezone Utilities (`/src/lib/date-utils.ts`)

### Available Functions

1. **`getBusinessTimezone()`**
   - Returns the configured business timezone (e.g., "America/New_York")
   - Falls back to browser timezone if not configured
   - Used throughout the app for all timezone-aware operations

2. **`getTodayInBusinessTimezone()`**
   - Returns today's date in business timezone as YYYY-MM-DD string
   - Prevents off-by-one date bugs from UTC conversion
   - Use this instead of `new Date()` for date comparisons

3. **`getNowInBusinessTimezone()`**
   - Returns current date and time in business timezone as ISO string
   - Use for timestamping new records

4. **`toBusinessTimezone(dateString)`**
   - Converts any ISO date string to business timezone
   - Use for displaying dates from storage

5. **`fromBusinessTimezone(date)`**
   - Converts a local date/time to business timezone for storage
   - Use when saving user-selected dates/times

6. **`formatInBusinessTimezone(dateString, formatString)`**
   - Formats a date string in business timezone
   - Use for display formatting

## Files Updated for Timezone Awareness

### Appointment Views
- ✅ `/src/components/appointments/ListView.tsx`
- ✅ `/src/components/appointments/GroomerView.tsx`
- ✅ `/src/components/appointments/CalendarView.tsx`

**Changes:**
- Initialize `currentDate` state with `toZonedTime(new Date(), timezone)` instead of `new Date()`
- "Today" button now uses timezone-aware date: `toZonedTime(new Date(), timezone)`
- Month view "today" highlighting uses timezone-aware comparison

### Forms & Creation
- ✅ `/src/pages/NewAppointment.tsx` - Already imports `getTodayInBusinessTimezone`
- ✅ `/src/pages/POS.tsx` - Already uses `getTodayInBusinessTimezone` for filtering today's appointments

### Payroll & Schedules
- ✅ `/src/lib/payroll-utils.ts` - Already imports and uses `getBusinessTimezone` for pay period calculations
- ✅ `/src/pages/RunPayroll.tsx` - Uses payroll-utils which are timezone-aware
- ✅ `/src/pages/Settings.tsx` - Manages timezone configuration in Business tab

## How It Works

### Timezone Selection Flow
1. User navigates to **Settings → Business**
2. Selects timezone from dropdown (ET, CT, MT, PT, etc.)
3. Clicks "Save Business Information"
4. Timezone saved to `kv:business-settings` in localStorage
5. All date/time operations throughout app now use this timezone

### Date Comparison Example
```typescript
// ❌ WRONG - Uses browser timezone
const today = new Date()
const appointments = allAppointments.filter(apt => apt.date === today)

// ✅ CORRECT - Uses business timezone
import { getTodayInBusinessTimezone } from '@/lib/date-utils'
const today = getTodayInBusinessTimezone() // "2025-01-17"
const appointments = allAppointments.filter(apt => apt.date === today)
```

### Display Example
```typescript
// ❌ WRONG - Formats in browser timezone
import { format } from 'date-fns'
const displayDate = format(new Date(appointment.date), 'MMM d, yyyy')

// ✅ CORRECT - Formats in business timezone
import { formatInBusinessTimezone } from '@/lib/date-utils'
const displayDate = formatInBusinessTimezone(appointment.date, 'MMM d, yyyy')
```

### Creating New Appointments
```typescript
import { getTodayInBusinessTimezone, getNowInBusinessTimezone } from '@/lib/date-utils'

// Set default appointment date to today in business timezone
const [appointmentDate, setAppointmentDate] = useState(getTodayInBusinessTimezone())

// Timestamp when appointment was created
const createdAt = getNowInBusinessTimezone()
```

## Critical Components Using Timezone

1. **Appointments System**
   - Viewing today's appointments
   - Creating new appointments
   - Calendar day/week/month views
   - Groomer schedule views

2. **Point of Sale**
   - Filtering "Today's Open Appointments"
   - Transaction timestamps

3. **Payroll**
   - Pay period calculations (bi-weekly, weekly)
   - Pay date determination (Friday paydays)
   - Work week boundaries (Monday-Sunday)

4. **Dashboard Metrics**
   - Daily/weekly/monthly statistics
   - Activity tracking

5. **Staff Schedules**
   - Availability tracking
   - Hours worked calculations

## Testing Timezone Behavior

### Test Scenario 1: PST Business with EST User
- Business timezone: America/Los_Angeles (PST)
- User browser: America/New_York (EST)
- Expected: All dates/times shown in PST
- When it's 11 PM EST on Jan 16, business sees Jan 16 at 8 PM PST

### Test Scenario 2: Appointment Filtering
- Business in CT, user creates appointment for "today"
- Appointment saved with date in CT timezone
- User in different timezone views appointments
- Expected: "Today" filter shows correct appointments for business timezone

### Test Scenario 3: Payroll Friday
- Business in MT, payroll set for "Friday"
- User in ET views payroll page
- Expected: Pay date shown matches Friday in MT, not Friday in ET

## Future Considerations

### Not Yet Implemented (but supported by utilities)
- Time display with timezone indicator (e.g., "3:00 PM EST")
- Timezone conversion warnings when user timezone differs from business
- Historical timezone change handling (if business moves/changes timezone)

## Maintenance Notes

### When Adding New Date/Time Features
1. Always import from `@/lib/date-utils`
2. Never use `new Date()` directly for business logic
3. Use `getTodayInBusinessTimezone()` for "today" comparisons
4. Use `toZonedTime(new Date(), timezone)` for current moment in business timezone
5. Store dates as YYYY-MM-DD strings, times as HH:MM strings
6. Store complete timestamps as ISO strings from `getNowInBusinessTimezone()`

### Common Pitfalls
- ❌ Using `new Date()` directly
- ❌ Using `format(new Date(), ...)` without timezone
- ❌ Comparing dates without timezone awareness
- ❌ Using browser's local time for business operations

### Debugging Timezone Issues
1. Check Settings → Business → Business Timezone is set correctly
2. Verify localStorage has `kv:business-settings` with timezone property
3. Console log `getBusinessTimezone()` to confirm expected timezone
4. Compare dates using `format(date, 'yyyy-MM-dd HH:mm:ss zzz')` to see timezone

## Summary

The Scruffy Butts application now has comprehensive timezone support ensuring:
- ✅ All appointments respect business timezone
- ✅ Payroll calculations use business timezone
- ✅ "Today" always means business today, not user's today
- ✅ Schedules align with business hours, not user's local time
- ✅ Consistent date/time handling across all features
- ✅ User can operate app from any timezone without confusion

**Critical Setting:** Always configure Business Timezone in Settings → Business before using the application for accurate date/time operations.
