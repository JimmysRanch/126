/**
 * Reports Module Types
 * Central type definitions for the Reports & Insights module
 */

// Time Basis - determines which date field to use for filtering and grouping
export type TimeBasis = 'service' | 'checkout' | 'transaction'

// Date Range Presets
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

// Appointment Status
export type AppointmentStatus = 'completed' | 'cancelled' | 'no-show' | 'scheduled'

// Payment Method
export type PaymentMethod = 'card' | 'cash' | 'other'

// Pet Size
export type PetSize = 'small' | 'medium' | 'large' | 'giant'

// Channel
export type Channel = 'walk-in' | 'phone' | 'online'

// Client Type
export type ClientType = 'new' | 'returning'

// Global Filter State
export interface ReportFilters {
  dateRange: DateRangePreset
  customDateStart?: string
  customDateEnd?: string
  timeBasis: TimeBasis
  staffIds: string[]
  serviceIds: string[]
  serviceCategories: string[]
  petSizes: PetSize[]
  channels: Channel[]
  clientTypes: ClientType[]
  appointmentStatuses: AppointmentStatus[]
  paymentMethods: PaymentMethod[]
  includeDiscounts: boolean
  includeRefunds: boolean
  includeTips: boolean
  includeTaxes: boolean
  includeGiftCardRedemptions: boolean
  locationId?: string
}

// Report Types Enum
export type ReportType =
  | 'owner-overview'
  | 'true-profit'
  | 'sales-summary'
  | 'finance-reconciliation'
  | 'appointments-capacity'
  | 'no-shows-cancellations'
  | 'retention-rebooking'
  | 'client-cohorts-ltv'
  | 'staff-performance'
  | 'payroll-compensation'
  | 'service-mix-pricing'
  | 'inventory-usage'
  | 'marketing-messaging'
  | 'tips-gratuities'
  | 'taxes-summary'

// Saved View
export interface SavedView {
  id: string
  name: string
  reportType: ReportType
  filters: ReportFilters
  groupBy?: string
  visibleColumns?: string[]
  compareEnabled: boolean
  createdAt: string
  updatedAt: string
}

// Schedule Configuration
export interface ScheduleConfig {
  id: string
  savedViewId: string
  frequency: 'daily' | 'weekly' | 'monthly'
  dayOfWeek?: number // 0-6 for weekly
  dayOfMonth?: number // 1-31 for monthly
  time: string // HH:mm format
  recipients: string[]
  enabled: boolean
  createdAt: string
  updatedAt: string
  lastRunAt?: string
}

// KPI Value with comparison
export interface KPIValue {
  current: number
  previous?: number
  delta?: number
  deltaPercent?: number
  format: 'money' | 'percent' | 'number' | 'minutes' | 'days'
}

// Chart Series Data Point
export interface ChartDataPoint {
  label: string
  value: number
  previousValue?: number
  metadata?: Record<string, unknown>
}

// Aggregated Table Row
export interface AggregatedRow {
  id: string
  dimension: string
  dimensionValue: string
  metrics: Record<string, number>
  drillKey: string
}

// Drill Row (underlying data)
export interface DrillRow {
  id: string
  type: 'appointment' | 'transaction' | 'client' | 'inventory' | 'message'
  data: Record<string, unknown>
  timestamp: string
}

// Insight
export interface Insight {
  id: string
  type: 'no-show-spike' | 'margin-drop' | 'rebook-weakness' | 'staff-standout' | 'inventory-risk' | 'campaign-roi-extreme'
  title: string
  description: string
  metric: string
  delta: number
  impactedSegment?: string
  suggestedAction: string
  severity: 'info' | 'warning' | 'critical' | 'positive'
  drillKey?: string
}

// Metric Definition (for dictionary/registry)
export interface MetricDefinition {
  id: string
  label: string
  definition: string
  formula: string
  exclusions?: string[]
  timeBasisSensitivity: boolean
  format: 'money' | 'percent' | 'number' | 'minutes' | 'days'
  drillRowTypes: ('appointment' | 'transaction' | 'client' | 'inventory' | 'message')[]
}

// Data Completeness Badge
export interface CompletenessIssue {
  type: 'missing-supply-cost' | 'missing-fee-policy' | 'missing-labor-model' | 'missing-inventory-cost'
  description: string
  settingsLink: string
  affectedMetrics: string[]
}

// Normalized Data Models
export interface NormalizedAppointment {
  id: string
  clientId: string
  clientName: string
  petId: string
  petName: string
  petWeightCategory: PetSize
  groomerId: string
  groomerName: string
  serviceDate: string // YYYY-MM-DD
  checkoutDate?: string // YYYY-MM-DD
  transactionDate?: string // YYYY-MM-DD
  startTime: string
  endTime: string
  scheduledDurationMinutes: number
  actualDurationMinutes?: number
  services: NormalizedService[]
  subtotalCents: number
  discountCents: number
  taxCents: number
  tipCents: number
  totalCents: number
  netCents: number // subtotal - discount - refund
  status: AppointmentStatus
  channel: Channel
  clientType: ClientType
  paymentMethod?: PaymentMethod
  rebookedWithin24h: boolean
  rebookedWithin7d: boolean
  rebookedWithin30d: boolean
  daysToNextVisit?: number
  noShowFlag: boolean
  lateCancelFlag: boolean
  reminderSent: boolean
  reminderConfirmed: boolean
  createdAt: string
}

export interface NormalizedService {
  id: string
  name: string
  category: string
  priceCents: number
  costCents?: number // COGS
  durationMinutes: number
}

export interface NormalizedTransaction {
  id: string
  appointmentId?: string
  date: string
  clientId: string
  clientName: string
  subtotalCents: number
  discountCents: number
  taxCents: number
  tipCents: number
  totalCents: number
  refundCents: number
  processingFeeCents: number
  netToBank: number // total - fees - refunds
  paymentMethod: PaymentMethod
  status: 'pending' | 'completed' | 'refunded'
  batchId?: string
  settlementDate?: string
  refundReason?: string
}

export interface NormalizedStaff {
  id: string
  name: string
  role: string
  isGroomer: boolean
  hourlyRateCents?: number
  commissionPercent?: number
  hireDate?: string
  status: 'active' | 'inactive' | 'on-leave'
}

export interface NormalizedClient {
  id: string
  name: string
  email?: string
  phone?: string
  createdAt: string
  firstVisitDate?: string
  lastVisitDate?: string
  totalVisits: number
  totalSpentCents: number
  referralSource?: string
  city?: string
  zip?: string
}

export interface NormalizedInventoryItem {
  id: string
  name: string
  category: 'retail' | 'supply'
  sku: string
  quantityOnHand: number
  unitCostCents: number
  reorderLevel: number
  linkedServiceIds: string[]
  usagePerAppointment?: number
}

export interface NormalizedMessage {
  id: string
  clientId: string
  type: 'reminder' | 'confirmation' | 'marketing' | 'follow-up'
  channel: 'sms' | 'email' | 'push'
  campaignId?: string
  sentAt: string
  deliveredAt?: string
  openedAt?: string
  clickedAt?: string
  confirmed: boolean
  showedUp: boolean
  revenueCents?: number
  costCents?: number
}

// Normalized Data Store
export interface NormalizedDataStore {
  appointments: NormalizedAppointment[]
  transactions: NormalizedTransaction[]
  staff: NormalizedStaff[]
  clients: NormalizedClient[]
  inventoryItems: NormalizedInventoryItem[]
  messages: NormalizedMessage[]
  services: NormalizedService[]
}

// Cache Entry
export interface CacheEntry<T> {
  data: T
  timestamp: number
  filterHash: string
}

// Export Types
export type ExportFormat = 'csv' | 'pdf' | 'png'

export interface ExportOptions {
  format: ExportFormat
  filename?: string
  includeFilters?: boolean
  includeSummary?: boolean
}
