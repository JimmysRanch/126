/**
 * Metric Registry
 * Central authoritative source for all metric definitions
 * Used for tooltips and the Definitions modal
 */

import { MetricDefinition } from '../types'

export const metricRegistry: Record<string, MetricDefinition> = {
  // Revenue Metrics
  grossSales: {
    id: 'grossSales',
    label: 'Gross Sales',
    definition: 'Total revenue from all services and products before any deductions',
    formula: 'Sum of (service prices + product prices) for all completed appointments',
    exclusions: ['Cancelled appointments', 'No-shows', 'Gift card sales'],
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment', 'transaction'],
  },
  netSales: {
    id: 'netSales',
    label: 'Net Sales',
    definition: 'Revenue after discounts and refunds, excluding tax and tips',
    formula: 'Gross Sales - Discounts - Refunds',
    exclusions: ['Tax', 'Tips', 'Gift card redemptions'],
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment', 'transaction'],
  },
  totalCollected: {
    id: 'totalCollected',
    label: 'Total Collected',
    definition: 'Total amount received including tax and tips',
    formula: 'Net Sales + Tax + Tips',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  avgTicket: {
    id: 'avgTicket',
    label: 'Average Ticket',
    definition: 'Average revenue per completed appointment',
    formula: 'Net Sales / Number of Completed Appointments',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  discounts: {
    id: 'discounts',
    label: 'Discounts',
    definition: 'Total value of discounts applied',
    formula: 'Sum of all discount amounts',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment', 'transaction'],
  },
  refunds: {
    id: 'refunds',
    label: 'Refunds',
    definition: 'Total amount refunded to customers',
    formula: 'Sum of all refund amounts',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  
  // Profit Metrics
  contributionMargin: {
    id: 'contributionMargin',
    label: 'Contribution Margin $',
    definition: 'Net Sales minus direct costs (COGS, processing fees, direct labor)',
    formula: 'Net Sales - COGS - Processing Fees - Direct Labor',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment', 'transaction'],
  },
  contributionMarginPercent: {
    id: 'contributionMarginPercent',
    label: 'Contribution Margin %',
    definition: 'Contribution margin as a percentage of Net Sales',
    formula: '(Contribution Margin $ / Net Sales) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment', 'transaction'],
  },
  grossMarginPercent: {
    id: 'grossMarginPercent',
    label: 'Gross Margin %',
    definition: 'Gross profit margin before operating expenses',
    formula: '((Net Sales - COGS) / Net Sales) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  avgMarginPerAppt: {
    id: 'avgMarginPerAppt',
    label: 'Avg Margin/Appointment',
    definition: 'Average contribution margin per completed appointment',
    formula: 'Contribution Margin $ / Number of Completed Appointments',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  estimatedCOGS: {
    id: 'estimatedCOGS',
    label: 'Estimated COGS',
    definition: 'Estimated cost of goods sold including supplies used',
    formula: 'Sum of (estimated supply cost per service × appointments)',
    exclusions: ['Services without cost estimates'],
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment', 'inventory'],
  },
  processingFees: {
    id: 'processingFees',
    label: 'Processing Fees',
    definition: 'Credit card and payment processing fees',
    formula: 'Sum of all transaction processing fees',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  directLabor: {
    id: 'directLabor',
    label: 'Direct Labor',
    definition: 'Labor costs directly attributable to services rendered',
    formula: 'Sum of (hourly rate × hours) + commissions for completed appointments',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  
  // Appointment Metrics
  appointmentsCompleted: {
    id: 'appointmentsCompleted',
    label: 'Appointments Completed',
    definition: 'Number of appointments that were successfully completed',
    formula: 'Count of appointments with status = completed',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['appointment'],
  },
  appointmentsBooked: {
    id: 'appointmentsBooked',
    label: 'Appointments Booked',
    definition: 'Total number of appointments booked in the period',
    formula: 'Count of all appointments created',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['appointment'],
  },
  appointmentsCancelled: {
    id: 'appointmentsCancelled',
    label: 'Appointments Cancelled',
    definition: 'Number of appointments that were cancelled',
    formula: 'Count of appointments with status = cancelled',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['appointment'],
  },
  noShowRate: {
    id: 'noShowRate',
    label: 'No-Show Rate',
    definition: 'Percentage of scheduled appointments that were no-shows',
    formula: '(No-shows / (Completed + No-shows + Late Cancellations)) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  lateCancelRate: {
    id: 'lateCancelRate',
    label: 'Late Cancel Rate',
    definition: 'Percentage of appointments cancelled within 24 hours',
    formula: '(Late Cancellations / Total Bookings) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  lostRevenue: {
    id: 'lostRevenue',
    label: 'Lost Revenue',
    definition: 'Estimated revenue lost due to no-shows and late cancellations',
    formula: 'Sum of (average ticket × no-shows) + (average ticket × late cancellations)',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  recoveryRate: {
    id: 'recoveryRate',
    label: 'Recovery Rate',
    definition: 'Percentage of no-shows/cancellations that rebooked within 7 days',
    formula: '(Rebooked within 7 days / (No-shows + Cancellations)) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  avgLeadTime: {
    id: 'avgLeadTime',
    label: 'Avg Lead Time',
    definition: 'Average days between booking and appointment date',
    formula: 'Sum of (appointment date - booking date) / count',
    timeBasisSensitivity: true,
    format: 'days',
    drillRowTypes: ['appointment'],
  },
  utilizationPercent: {
    id: 'utilizationPercent',
    label: 'Utilization %',
    definition: 'Percentage of available capacity that was booked',
    formula: '(Booked Hours / Available Hours) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  
  // Retention Metrics
  rebook24h: {
    id: 'rebook24h',
    label: 'Rebook 0-24h',
    definition: 'Percentage of clients who rebooked within 24 hours of checkout',
    formula: '(Rebooked within 24h / Completed appointments) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment', 'client'],
  },
  rebook7d: {
    id: 'rebook7d',
    label: 'Rebook ≤7 Days',
    definition: 'Percentage of clients who rebooked within 7 days of checkout',
    formula: '(Rebooked within 7d / Completed appointments) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment', 'client'],
  },
  rebook30d: {
    id: 'rebook30d',
    label: 'Rebook ≤30 Days',
    definition: 'Percentage of clients who rebooked within 30 days of checkout',
    formula: '(Rebooked within 30d / Completed appointments) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment', 'client'],
  },
  avgDaysToNextVisit: {
    id: 'avgDaysToNextVisit',
    label: 'Avg Days to Next Visit',
    definition: 'Average number of days between visits for returning clients',
    formula: 'Sum of (days between consecutive visits) / count',
    timeBasisSensitivity: false,
    format: 'days',
    drillRowTypes: ['client'],
  },
  return90d: {
    id: 'return90d',
    label: '90-Day Return Rate',
    definition: 'Percentage of clients who returned within 90 days',
    formula: '(Clients with visit in last 90 days / Total active clients) × 100',
    timeBasisSensitivity: false,
    format: 'percent',
    drillRowTypes: ['client'],
  },
  
  // Client Metrics
  avgLTV12m: {
    id: 'avgLTV12m',
    label: 'Avg LTV (12 Months)',
    definition: 'Average lifetime value per client over 12 months',
    formula: 'Total revenue from clients in 12 months / Number of clients',
    timeBasisSensitivity: false,
    format: 'money',
    drillRowTypes: ['client'],
  },
  medianVisits12m: {
    id: 'medianVisits12m',
    label: 'Median Visits (12 Months)',
    definition: 'Median number of visits per client over 12 months',
    formula: 'Median of (visits per client in 12 months)',
    timeBasisSensitivity: false,
    format: 'number',
    drillRowTypes: ['client'],
  },
  newClients: {
    id: 'newClients',
    label: 'New Clients',
    definition: 'Number of first-time clients in the period',
    formula: 'Count of clients with first visit in period',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['client'],
  },
  retention90d: {
    id: 'retention90d',
    label: 'Retention at 90 Days',
    definition: 'Percentage of clients retained at 90 days after first visit',
    formula: '(Clients with 2+ visits within 90 days of first / New clients) × 100',
    timeBasisSensitivity: false,
    format: 'percent',
    drillRowTypes: ['client'],
  },
  retention180d: {
    id: 'retention180d',
    label: 'Retention at 180 Days',
    definition: 'Percentage of clients retained at 180 days after first visit',
    formula: '(Clients with 2+ visits within 180 days of first / New clients) × 100',
    timeBasisSensitivity: false,
    format: 'percent',
    drillRowTypes: ['client'],
  },
  retention360d: {
    id: 'retention360d',
    label: 'Retention at 360 Days',
    definition: 'Percentage of clients retained at 360 days after first visit',
    formula: '(Clients with 2+ visits within 360 days of first / New clients) × 100',
    timeBasisSensitivity: false,
    format: 'percent',
    drillRowTypes: ['client'],
  },
  
  // Staff Metrics
  revenuePerHour: {
    id: 'revenuePerHour',
    label: 'Revenue/Hour',
    definition: 'Net sales generated per hour worked',
    formula: 'Net Sales / Hours Worked',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  marginPerHour: {
    id: 'marginPerHour',
    label: 'Margin/Hour',
    definition: 'Contribution margin generated per hour worked',
    formula: 'Contribution Margin $ / Hours Worked',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  upsellRate: {
    id: 'upsellRate',
    label: 'Upsell Rate',
    definition: 'Percentage of appointments with add-on services',
    formula: '(Appointments with add-ons / Total appointments) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  onTimeStartPercent: {
    id: 'onTimeStartPercent',
    label: 'On-Time Start %',
    definition: 'Percentage of appointments started within 5 minutes of scheduled time',
    formula: '(On-time starts / Total appointments) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  tipsPerHour: {
    id: 'tipsPerHour',
    label: 'Tips/Hour',
    definition: 'Tips received per hour worked',
    formula: 'Total Tips / Hours Worked',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  
  // Payroll Metrics
  totalPayout: {
    id: 'totalPayout',
    label: 'Total Payout',
    definition: 'Total compensation paid to all staff',
    formula: 'Commission + Hourly + Tips + Adjustments',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  commissionTotal: {
    id: 'commissionTotal',
    label: 'Commission Total',
    definition: 'Total commission earnings for all staff',
    formula: 'Sum of (service price × commission rate) for all completed services',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  hourlyTotal: {
    id: 'hourlyTotal',
    label: 'Hourly Total',
    definition: 'Total hourly wages paid',
    formula: 'Sum of (hourly rate × hours worked) for all staff',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  
  // Tips Metrics
  totalTips: {
    id: 'totalTips',
    label: 'Total Tips',
    definition: 'Total tips collected',
    formula: 'Sum of all tip amounts',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment', 'transaction'],
  },
  avgTipPercent: {
    id: 'avgTipPercent',
    label: 'Avg Tip %',
    definition: 'Average tip as percentage of service total',
    formula: '(Total Tips / Net Sales) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  tipFeeCost: {
    id: 'tipFeeCost',
    label: 'Tip Fee Cost',
    definition: 'Processing fees charged on card tips',
    formula: 'Sum of (card tip amount × processing rate)',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  
  // Tax Metrics
  taxableSales: {
    id: 'taxableSales',
    label: 'Taxable Sales',
    definition: 'Total sales subject to tax',
    formula: 'Sum of taxable service and product amounts',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  nonTaxableSales: {
    id: 'nonTaxableSales',
    label: 'Non-Taxable Sales',
    definition: 'Total sales exempt from tax',
    formula: 'Sum of non-taxable service and product amounts',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  taxesCollected: {
    id: 'taxesCollected',
    label: 'Taxes Collected',
    definition: 'Total tax amount collected',
    formula: 'Sum of all tax amounts',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  
  // Inventory Metrics
  itemsBelowReorder: {
    id: 'itemsBelowReorder',
    label: 'Items Below Reorder',
    definition: 'Number of inventory items below reorder level',
    formula: 'Count of items where quantity < reorder level',
    timeBasisSensitivity: false,
    format: 'number',
    drillRowTypes: ['inventory'],
  },
  daysOfSupply: {
    id: 'daysOfSupply',
    label: 'Days of Supply',
    definition: 'Estimated days until inventory runs out at current usage rate',
    formula: 'Current quantity / average daily usage',
    timeBasisSensitivity: false,
    format: 'days',
    drillRowTypes: ['inventory'],
  },
  costUsed: {
    id: 'costUsed',
    label: 'Cost Used',
    definition: 'Total cost of inventory used in the period',
    formula: 'Sum of (units used × unit cost)',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['inventory'],
  },
  costPerAppt: {
    id: 'costPerAppt',
    label: 'Cost per Appointment',
    definition: 'Average inventory cost per appointment',
    formula: 'Cost Used / Completed Appointments',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['inventory', 'appointment'],
  },
  
  // Marketing Metrics
  messagesSent: {
    id: 'messagesSent',
    label: 'Messages Sent',
    definition: 'Total number of messages sent',
    formula: 'Count of all sent messages',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['message'],
  },
  confirmations: {
    id: 'confirmations',
    label: 'Confirmations',
    definition: 'Number of appointment confirmations received',
    formula: 'Count of messages where confirmed = true',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['message'],
  },
  showUpsAttributed: {
    id: 'showUpsAttributed',
    label: 'Show-ups Attributed',
    definition: 'Appointments completed attributed to marketing messages',
    formula: 'Count of completed appointments with attributed message within 7 days',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['message', 'appointment'],
  },
  costPerShowUp: {
    id: 'costPerShowUp',
    label: 'Cost per Show-up',
    definition: 'Marketing cost per attributed appointment',
    formula: 'Message cost / Show-ups attributed',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['message'],
  },
  marketingROI: {
    id: 'marketingROI',
    label: 'Marketing ROI',
    definition: 'Return on investment for marketing spend',
    formula: '(Attributed Revenue - Marketing Cost) / Marketing Cost',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['message', 'appointment'],
  },
  
  // Finance Metrics  
  pendingUnpaid: {
    id: 'pendingUnpaid',
    label: 'Pending/Unpaid',
    definition: 'Total amount of pending or unpaid invoices',
    formula: 'Sum of invoices with status = pending',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  netDeposits: {
    id: 'netDeposits',
    label: 'Net Deposits (Est)',
    definition: 'Estimated amount deposited to bank after fees',
    formula: 'Total Collected - Processing Fees - Refunds',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
}

/**
 * Get metric definition by ID
 */
export function getMetricDefinition(metricId: string): MetricDefinition | undefined {
  return metricRegistry[metricId]
}

/**
 * Get all metric definitions for a specific drill row type
 */
export function getMetricsByDrillType(drillType: 'appointment' | 'transaction' | 'client' | 'inventory' | 'message'): MetricDefinition[] {
  return Object.values(metricRegistry).filter(m => m.drillRowTypes.includes(drillType))
}

/**
 * Get all metrics sensitive to time basis changes
 */
export function getTimeSensitiveMetrics(): MetricDefinition[] {
  return Object.values(metricRegistry).filter(m => m.timeBasisSensitivity)
}

/**
 * Format metric value for display
 */
export function formatMetricValue(value: number, format: MetricDefinition['format']): string {
  switch (format) {
    case 'money':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value / 100) // Convert from cents
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'number':
      return new Intl.NumberFormat('en-US').format(value)
    case 'minutes':
      return `${value.toFixed(0)} min`
    case 'days':
      return `${value.toFixed(1)} days`
    default:
      return String(value)
  }
}

/**
 * Format delta value with sign
 */
export function formatDelta(delta: number, format: MetricDefinition['format']): string {
  const sign = delta >= 0 ? '+' : ''
  switch (format) {
    case 'money':
      return `${sign}${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(delta / 100)}`
    case 'percent':
      return `${sign}${delta.toFixed(1)}%`
    case 'number':
      return `${sign}${new Intl.NumberFormat('en-US').format(delta)}`
    case 'minutes':
      return `${sign}${delta.toFixed(0)} min`
    case 'days':
      return `${sign}${delta.toFixed(1)} days`
    default:
      return `${sign}${delta}`
  }
}
