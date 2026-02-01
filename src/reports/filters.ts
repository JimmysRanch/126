import { addDays, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays, subMonths } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { getBusinessTimezone } from '@/lib/date-utils'
import { DateRangePreset, FilterState, ReportId, TimeBasis } from './types'

const todayInTz = () => {
  const timezone = getBusinessTimezone()
  return toZonedTime(new Date(), timezone)
}

export const resolveDateRange = (preset: DateRangePreset) => {
  const today = todayInTz()
  let start = today
  let end = today

  switch (preset) {
    case 'today':
      start = today
      end = today
      break
    case 'yesterday':
      start = subDays(today, 1)
      end = subDays(today, 1)
      break
    case 'last7':
      start = subDays(today, 6)
      end = today
      break
    case 'thisWeek':
      start = startOfWeek(today, { weekStartsOn: 1 })
      end = endOfWeek(today, { weekStartsOn: 1 })
      break
    case 'last30':
      start = subDays(today, 29)
      end = today
      break
    case 'last90':
      start = subDays(today, 89)
      end = today
      break
    case 'thisMonth':
      start = startOfMonth(today)
      end = endOfMonth(today)
      break
    case 'lastMonth':
      start = startOfMonth(subMonths(today, 1))
      end = endOfMonth(subMonths(today, 1))
      break
    case 'quarter':
      start = subMonths(startOfMonth(today), 2)
      end = endOfMonth(today)
      break
    case 'ytd':
      start = new Date(today.getFullYear(), 0, 1)
      end = today
      break
    case 'custom':
    default:
      start = today
      end = today
      break
  }

  return {
    startDate: format(start, 'yyyy-MM-dd'),
    endDate: format(end, 'yyyy-MM-dd')
  }
}

export const defaultFilters: FilterState = {
  datePreset: 'last30',
  ...resolveDateRange('last30'),
  timeBasis: 'checkout',
  locations: [],
  staff: [],
  services: [],
  serviceCategories: [],
  petSizes: [],
  channels: [],
  clientTypes: [],
  appointmentStatuses: ['completed'],
  paymentMethods: [],
  includeDiscounts: true,
  includeRefunds: true,
  includeTips: true,
  includeTaxes: true,
  includeGiftCards: true,
  compareMode: false
}

export const reportDefaults: Record<ReportId, Partial<FilterState>> = {
  'owner-overview': { timeBasis: 'checkout' },
  'true-profit': { timeBasis: 'checkout' },
  'sales-summary': { timeBasis: 'checkout' },
  'finance-recon': { timeBasis: 'transaction' },
  'appointments-capacity': { timeBasis: 'service' },
  'no-shows': { timeBasis: 'service' },
  'retention': { timeBasis: 'service' },
  'cohorts-ltv': { timeBasis: 'service' },
  'staff-performance': { timeBasis: 'checkout' },
  'payroll': { timeBasis: 'checkout', datePreset: 'thisMonth' },
  'service-mix': { timeBasis: 'checkout' },
  'inventory': { timeBasis: 'service' },
  'marketing-roi': { timeBasis: 'service' },
  'tips': { timeBasis: 'checkout' },
  'taxes': { timeBasis: 'checkout' }
}

export const applyReportDefaults = (reportId: ReportId, base: FilterState): FilterState => {
  const defaults = reportDefaults[reportId] || {}
  const datePreset = defaults.datePreset ?? base.datePreset
  const range = datePreset === 'custom' ? { startDate: base.startDate, endDate: base.endDate } : resolveDateRange(datePreset)
  return {
    ...base,
    ...defaults,
    ...range
  }
}

export const parseFiltersFromQuery = (query: URLSearchParams, reportId: ReportId): FilterState => {
  const base = applyReportDefaults(reportId, defaultFilters)
  const datePreset = (query.get('preset') as DateRangePreset) || base.datePreset
  const startDate = query.get('start') || base.startDate
  const endDate = query.get('end') || base.endDate
  const timeBasis = (query.get('basis') as TimeBasis) || base.timeBasis

  const getList = (key: string) => (query.get(key) ? query.get(key)!.split(',').filter(Boolean) : [])
  const getBool = (key: string, fallback: boolean) =>
    query.get(key) === null ? fallback : query.get(key) === 'true'

  return {
    ...base,
    datePreset,
    startDate,
    endDate,
    timeBasis,
    locations: getList('locations'),
    staff: getList('staff'),
    services: getList('services'),
    serviceCategories: getList('serviceCategories'),
    petSizes: getList('petSizes'),
    channels: getList('channels'),
    clientTypes: getList('clientTypes'),
    appointmentStatuses: getList('statuses').length ? getList('statuses') : base.appointmentStatuses,
    paymentMethods: getList('paymentMethods'),
    includeDiscounts: getBool('discounts', base.includeDiscounts),
    includeRefunds: getBool('refunds', base.includeRefunds),
    includeTips: getBool('tips', base.includeTips),
    includeTaxes: getBool('taxes', base.includeTaxes),
    includeGiftCards: getBool('giftCards', base.includeGiftCards),
    compareMode: getBool('compare', base.compareMode),
    groupBy: query.get('groupBy') || base.groupBy,
    visibleColumns: getList('columns').length ? getList('columns') : base.visibleColumns
  }
}

export const serializeFiltersToQuery = (filters: FilterState) => {
  const params = new URLSearchParams()
  params.set('preset', filters.datePreset)
  params.set('start', filters.startDate)
  params.set('end', filters.endDate)
  params.set('basis', filters.timeBasis)

  const setList = (key: string, value: string[]) => {
    if (value.length) {
      params.set(key, value.join(','))
    }
  }

  setList('locations', filters.locations)
  setList('staff', filters.staff)
  setList('services', filters.services)
  setList('serviceCategories', filters.serviceCategories)
  setList('petSizes', filters.petSizes)
  setList('channels', filters.channels)
  setList('clientTypes', filters.clientTypes)
  setList('statuses', filters.appointmentStatuses)
  setList('paymentMethods', filters.paymentMethods)
  setList('columns', filters.visibleColumns || [])
  if (filters.groupBy) {
    params.set('groupBy', filters.groupBy)
  }

  params.set('discounts', String(filters.includeDiscounts))
  params.set('refunds', String(filters.includeRefunds))
  params.set('tips', String(filters.includeTips))
  params.set('taxes', String(filters.includeTaxes))
  params.set('giftCards', String(filters.includeGiftCards))
  params.set('compare', String(filters.compareMode))

  return params
}
