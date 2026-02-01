export type TimeBasis = 'service' | 'checkout' | 'transaction'

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'thisWeek'
  | 'last30'
  | 'last90'
  | 'thisMonth'
  | 'lastMonth'
  | 'quarter'
  | 'ytd'
  | 'custom'

export type ReportId =
  | 'owner-overview'
  | 'true-profit'
  | 'sales-summary'
  | 'finance-recon'
  | 'appointments-capacity'
  | 'no-shows'
  | 'retention'
  | 'cohorts-ltv'
  | 'staff-performance'
  | 'payroll'
  | 'service-mix'
  | 'inventory'
  | 'marketing-roi'
  | 'tips'
  | 'taxes'

export type FilterState = {
  datePreset: DateRangePreset
  startDate: string
  endDate: string
  timeBasis: TimeBasis
  locations: string[]
  staff: string[]
  services: string[]
  serviceCategories: string[]
  petSizes: string[]
  channels: string[]
  clientTypes: string[]
  appointmentStatuses: string[]
  paymentMethods: string[]
  includeDiscounts: boolean
  includeRefunds: boolean
  includeTips: boolean
  includeTaxes: boolean
  includeGiftCards: boolean
  compareMode: boolean
  groupBy?: string
  visibleColumns?: string[]
}

export type KPIValue = {
  id: string
  label: string
  value: number
  formattedValue: string
  delta?: number
  deltaFormatted?: string
  tooltip?: string
  trend?: 'up' | 'down' | 'flat'
  format: MetricFormat
  drillRowTypes?: DrillRowType[]
}

export type MetricFormat = 'money' | 'percent' | 'int' | 'minutes'

export type ChartSeries = {
  key: string
  label: string
  color?: string
  data: Array<Record<string, string | number | null>>
}

export type ChartData = {
  id: string
  title: string
  type: 'line' | 'bar' | 'stacked' | 'donut' | 'scatter' | 'heatmap'
  series: ChartSeries[]
  xKey: string
  yKey?: string
  compareSeries?: ChartSeries[]
  ariaLabel: string
}

export type TableColumn = {
  id: string
  label: string
  format?: MetricFormat
  align?: 'left' | 'right' | 'center'
  isDelta?: boolean
}

export type TableRow = {
  id: string
  label: string
  values: Record<string, number | string | null>
  drill?: DrillRequest
}

export type TableData = {
  columns: TableColumn[]
  rows: TableRow[]
  groupByOptions: string[]
}

export type DrillRowType = 'appointments' | 'transactions' | 'clients' | 'inventory' | 'messages'

export type DrillRequest = {
  title: string
  rowTypes: DrillRowType[]
  filters: Record<string, string | string[] | number | boolean | undefined>
  value?: number
  metricId?: string
}

export type DrillRow = {
  id: string
  type: DrillRowType
  label: string
  date?: string
  amount?: number
  meta?: Record<string, string | number | null>
  appointmentId?: string
  clientId?: string
}

export type InsightsItem = {
  id: string
  title: string
  description: string
  metricId?: string
  delta?: number
  action?: string
  drill?: DrillRequest
}

export type ReportData = {
  kpis: KPIValue[]
  charts: ChartData[]
  table: TableData
  insights: InsightsItem[]
}

export type NormalizedAppointment = {
  id: string
  clientId: string
  clientName: string
  petId: string
  petName: string
  petSize: string
  staffId: string
  staffName: string
  date: string
  startTime: string
  endTime: string
  status: string
  channel: string
  clientType: string
  services: Array<{
    id: string
    name: string
    category: string
    type: 'main' | 'addon'
    priceCents: number
    durationMinutes: number
  }>
  totalCents: number
  tipCents: number
  createdAt: string
  location?: string
}

export type NormalizedTransaction = {
  id: string
  appointmentId?: string
  clientId: string
  clientName: string
  date: string
  status: string
  paymentMethod: string
  subtotalCents: number
  discountCents: number
  refundCents: number
  taxCents: number
  tipCents: number
  totalCents: number
  items: Array<{
    id: string
    name: string
    type: 'service' | 'product'
    quantity: number
    totalCents: number
    category?: string
  }>
  location?: string
}

export type NormalizedClient = {
  id: string
  name: string
  createdAt?: string
  city?: string
  zip?: string
  type: string
  referralSource?: string
}

export type NormalizedStaff = {
  id: string
  name: string
  role?: string
  hourlyRateCents?: number
  status?: string
}

export type NormalizedInventoryItem = {
  id: string
  name: string
  category: string
  unitCostCents: number
  quantity: number
  reorderLevel: number
  linkedServices?: string[]
}

export type NormalizedMessage = {
  id: string
  channel: string
  sentAt: string
  costCents: number
  delivered: boolean
  confirmed: boolean
  clientId?: string
  appointmentId?: string
}

export type NormalizedData = {
  appointments: NormalizedAppointment[]
  transactions: NormalizedTransaction[]
  clients: NormalizedClient[]
  staff: NormalizedStaff[]
  inventoryItems: NormalizedInventoryItem[]
  messages: NormalizedMessage[]
  locations: string[]
  serviceCatalog: Array<{ id: string; name: string; category: string }>
}

export type SavedView = {
  id: string
  name: string
  reportId: ReportId
  filters: FilterState
}

export type ReportSchedule = {
  id: string
  name: string
  savedViewId: string
  frequency: 'weekly' | 'monthly'
  dayOfWeek?: string
  dayOfMonth?: number
  time: string
  recipients: string
}
