/**
 * Report Data Hook
 * Fetches and normalizes data for reports with caching and memoization
 */

import { useMemo, useEffect, useState } from 'react'
import { useKV } from '@/lib/spark-hooks'
import {
  NormalizedDataStore,
  ReportFilters,
  NormalizedAppointment,
  NormalizedTransaction,
} from '../types'
import {
  createNormalizedDataStore,
  generateFilterHash,
} from '../engine/dataNormalization'
import {
  filterAppointments,
  filterTransactions,
  getDateRange,
  getPreviousPeriod,
  measurePerformance,
} from '../engine/analyticsEngine'
import { Appointment, Client, Staff, InventoryItem, Transaction } from '@/lib/types'

// Default data for when storage is empty
const defaultAppointments: Appointment[] = []
const defaultTransactions: Transaction[] = []
const defaultStaff: Staff[] = []
const defaultClients: Client[] = []
const defaultInventory: InventoryItem[] = []

/**
 * Hook for accessing normalized report data
 * Handles data fetching, normalization, and caching
 */
export function useReportData(filters: ReportFilters) {
  // Fetch raw data from KV storage
  const [rawAppointments] = useKV<Appointment[]>('appointments', defaultAppointments)
  const [rawTransactions] = useKV<Transaction[]>('transactions', defaultTransactions)
  const [rawStaff] = useKV<Staff[]>('staff', defaultStaff)
  const [rawClients] = useKV<Client[]>('clients', defaultClients)
  const [rawInventory] = useKV<InventoryItem[]>('inventory', defaultInventory)
  
  // Normalize data (memoized)
  const dataStore = useMemo<NormalizedDataStore>(() => {
    return measurePerformance('normalizeData', () => 
      createNormalizedDataStore(
        rawAppointments,
        rawTransactions,
        rawStaff,
        rawClients,
        rawInventory
      )
    )
  }, [rawAppointments, rawTransactions, rawStaff, rawClients, rawInventory])
  
  // Filter data based on current filters
  const filteredAppointments = useMemo(() => {
    return measurePerformance('filterAppointments', () =>
      filterAppointments(dataStore.appointments, filters)
    )
  }, [dataStore.appointments, filters])
  
  const filteredTransactions = useMemo(() => {
    return measurePerformance('filterTransactions', () =>
      filterTransactions(dataStore.transactions, filters)
    )
  }, [dataStore.transactions, filters])
  
  // Get previous period data for comparison
  const previousPeriodData = useMemo(() => {
    const { start, end } = getDateRange(filters)
    const { start: prevStart, end: prevEnd } = getPreviousPeriod(start, end)
    
    const previousFilters: ReportFilters = {
      ...filters,
      dateRange: 'custom',
      customDateStart: prevStart.toISOString().split('T')[0],
      customDateEnd: prevEnd.toISOString().split('T')[0],
    }
    
    return {
      appointments: filterAppointments(dataStore.appointments, previousFilters),
      transactions: filterTransactions(dataStore.transactions, previousFilters),
    }
  }, [dataStore.appointments, dataStore.transactions, filters])
  
  // Generate filter hash for cache keys
  const filterHash = useMemo(() => generateFilterHash(filters), [filters])
  
  return {
    // Normalized data store
    dataStore,
    
    // Filtered current period data
    appointments: filteredAppointments,
    transactions: filteredTransactions,
    
    // Previous period data for comparison
    previousAppointments: previousPeriodData.appointments,
    previousTransactions: previousPeriodData.transactions,
    
    // Additional data
    staff: dataStore.staff,
    clients: dataStore.clients,
    inventoryItems: dataStore.inventoryItems,
    messages: dataStore.messages,
    services: dataStore.services,
    
    // Cache key
    filterHash,
    
    // Loading state (for future async data fetching)
    isLoading: false,
    error: null,
  }
}

/**
 * Hook for saved views
 */
export function useSavedViews() {
  const [savedViews, setSavedViews] = useKV<Record<string, {
    id: string
    name: string
    reportType: string
    filters: ReportFilters
    groupBy?: string
    visibleColumns?: string[]
    compareEnabled: boolean
    createdAt: string
    updatedAt: string
  }>>('report-saved-views', {})
  
  const saveView = (view: {
    name: string
    reportType: string
    filters: ReportFilters
    groupBy?: string
    visibleColumns?: string[]
    compareEnabled: boolean
  }) => {
    const id = `view-${Date.now()}`
    const now = new Date().toISOString()
    setSavedViews(prev => ({
      ...prev,
      [id]: {
        ...view,
        id,
        createdAt: now,
        updatedAt: now,
      },
    }))
    return id
  }
  
  const deleteView = (id: string) => {
    setSavedViews(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
  }
  
  const updateView = (id: string, updates: Partial<typeof savedViews[string]>) => {
    setSavedViews(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }))
  }
  
  return {
    savedViews: Object.values(savedViews),
    saveView,
    deleteView,
    updateView,
    getView: (id: string) => savedViews[id],
  }
}

/**
 * Hook for report schedules
 */
export function useReportSchedules() {
  const [schedules, setSchedules] = useKV<Record<string, {
    id: string
    savedViewId: string
    frequency: 'daily' | 'weekly' | 'monthly'
    dayOfWeek?: number
    dayOfMonth?: number
    time: string
    recipients: string[]
    enabled: boolean
    createdAt: string
    updatedAt: string
    lastRunAt?: string
  }>>('report-schedules', {})
  
  const createSchedule = (schedule: Omit<typeof schedules[string], 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `schedule-${Date.now()}`
    const now = new Date().toISOString()
    setSchedules(prev => ({
      ...prev,
      [id]: {
        ...schedule,
        id,
        createdAt: now,
        updatedAt: now,
      },
    }))
    return id
  }
  
  const deleteSchedule = (id: string) => {
    setSchedules(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
  }
  
  const updateSchedule = (id: string, updates: Partial<typeof schedules[string]>) => {
    setSchedules(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }))
  }
  
  const markRun = (id: string) => {
    updateSchedule(id, { lastRunAt: new Date().toISOString() })
  }
  
  return {
    schedules: Object.values(schedules),
    createSchedule,
    deleteSchedule,
    updateSchedule,
    markRun,
    getSchedule: (id: string) => schedules[id],
  }
}

/**
 * Hook for user preferences (essentials toggle, etc.)
 */
export function useReportPreferences() {
  const [preferences, setPreferences] = useKV<{
    showEssentialsOnly: boolean
    defaultTimeBasis: string
    favoriteReports: string[]
  }>('report-preferences', {
    showEssentialsOnly: false,
    defaultTimeBasis: 'checkout',
    favoriteReports: [],
  })
  
  const toggleEssentialsOnly = () => {
    setPreferences(prev => ({
      ...prev,
      showEssentialsOnly: !prev.showEssentialsOnly,
    }))
  }
  
  const toggleFavorite = (reportId: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteReports: prev.favoriteReports.includes(reportId)
        ? prev.favoriteReports.filter(id => id !== reportId)
        : [...prev.favoriteReports, reportId],
    }))
  }
  
  return {
    preferences,
    toggleEssentialsOnly,
    toggleFavorite,
    setPreferences,
  }
}
