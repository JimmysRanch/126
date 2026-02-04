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
    label: 'Total Sales',
    definition: 'Everything you charged before any discounts or refunds. This is your starting point for all money coming in.',
    formula: 'Sum of (service prices + product prices) for all completed appointments',
    exclusions: ['Cancelled appointments', 'No-shows', 'Gift card sales'],
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment', 'transaction'],
  },
  netSales: {
    id: 'netSales',
    label: 'Actual Sales',
    definition: 'What you actually earned after discounts and refunds. This is your real revenue (not including tax or tips).',
    formula: 'Gross Sales - Discounts - Refunds',
    exclusions: ['Tax', 'Tips', 'Gift card redemptions'],
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment', 'transaction'],
  },
  totalCollected: {
    id: 'totalCollected',
    label: 'Money Collected',
    definition: 'Total cash and card payments you received, including tax and tips.',
    formula: 'Net Sales + Tax + Tips',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  avgTicket: {
    id: 'avgTicket',
    label: 'Avg. per Visit',
    definition: 'How much you make on average from each appointment. Higher is better!',
    formula: 'Net Sales / Number of Completed Appointments',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  discounts: {
    id: 'discounts',
    label: 'Discounts Given',
    definition: 'Total value of all discounts you gave to clients.',
    formula: 'Sum of all discount amounts',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment', 'transaction'],
  },
  refunds: {
    id: 'refunds',
    label: 'Refunds',
    definition: 'Money you gave back to customers.',
    formula: 'Sum of all refund amounts',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  
  // Profit Metrics
  contributionMargin: {
    id: 'contributionMargin',
    label: 'Your Take-Home',
    definition: 'What you keep after paying for supplies, card fees, and staff. This is your real profit from each service.',
    formula: 'Net Sales - COGS - Processing Fees - Direct Labor',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment', 'transaction'],
  },
  contributionMarginPercent: {
    id: 'contributionMarginPercent',
    label: 'Profit Margin',
    definition: 'What percentage of each dollar you keep as profit. For example, 40% means you keep 40 cents from every dollar.',
    formula: '(Contribution Margin $ / Net Sales) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment', 'transaction'],
  },
  grossMarginPercent: {
    id: 'grossMarginPercent',
    label: 'Gross Profit %',
    definition: 'Percentage left after paying for supplies only (before staff costs).',
    formula: '((Net Sales - COGS) / Net Sales) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  avgMarginPerAppt: {
    id: 'avgMarginPerAppt',
    label: 'Profit per Visit',
    definition: 'Average profit you make from each appointment after all costs.',
    formula: 'Contribution Margin $ / Number of Completed Appointments',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  estimatedCOGS: {
    id: 'estimatedCOGS',
    label: 'Supply Costs',
    definition: 'Estimated cost of shampoos, conditioners, and other supplies used.',
    formula: 'Sum of (estimated supply cost per service × appointments)',
    exclusions: ['Services without cost estimates'],
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment', 'inventory'],
  },
  processingFees: {
    id: 'processingFees',
    label: 'Card Fees',
    definition: 'Fees charged by credit card companies when clients pay with cards.',
    formula: 'Sum of all transaction processing fees',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  directLabor: {
    id: 'directLabor',
    label: 'Staff Pay',
    definition: 'What you paid your groomers (hourly wages plus any commissions).',
    formula: 'Sum of (hourly rate × hours) + commissions for completed appointments',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  
  // Appointment Metrics
  appointmentsCompleted: {
    id: 'appointmentsCompleted',
    label: 'Completed Visits',
    definition: 'Number of grooming appointments that were finished successfully.',
    formula: 'Count of appointments with status = completed',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['appointment'],
  },
  appointmentsBooked: {
    id: 'appointmentsBooked',
    label: 'Booked Visits',
    definition: 'Total appointments scheduled during this time.',
    formula: 'Count of all appointments created',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['appointment'],
  },
  appointmentsCancelled: {
    id: 'appointmentsCancelled',
    label: 'Cancellations',
    definition: 'Appointments that were cancelled.',
    formula: 'Count of appointments with status = cancelled',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['appointment'],
  },
  noShowRate: {
    id: 'noShowRate',
    label: 'No-Show Rate',
    definition: 'Percentage of clients who missed their appointment without notice. Lower is better!',
    formula: '(No-shows / (Completed + No-shows + Late Cancellations)) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  lateCancelRate: {
    id: 'lateCancelRate',
    label: 'Last-Minute Cancels',
    definition: 'Appointments cancelled with less than 24 hours notice. These are hard to fill.',
    formula: '(Late Cancellations / Total Bookings) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  lostRevenue: {
    id: 'lostRevenue',
    label: 'Money Lost',
    definition: 'Estimated revenue lost from no-shows and last-minute cancellations.',
    formula: 'Sum of (average ticket × no-shows) + (average ticket × late cancellations)',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  recoveryRate: {
    id: 'recoveryRate',
    label: 'Rescheduled',
    definition: 'How many missed appointments got rescheduled within a week. Higher is better!',
    formula: '(Rebooked within 7 days / (No-shows + Cancellations)) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  avgLeadTime: {
    id: 'avgLeadTime',
    label: 'Booking Ahead',
    definition: 'How far in advance clients typically book. Longer lead times help you plan better.',
    formula: 'Sum of (appointment date - booking date) / count',
    timeBasisSensitivity: true,
    format: 'days',
    drillRowTypes: ['appointment'],
  },
  utilizationPercent: {
    id: 'utilizationPercent',
    label: 'Schedule Filled',
    definition: 'How much of your available time is booked. 80-90% is typically ideal.',
    formula: '(Booked Hours / Available Hours) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  
  // Retention Metrics
  rebook24h: {
    id: 'rebook24h',
    label: 'Same-Day Rebook',
    definition: 'Clients who scheduled their next visit before leaving. Great for your business!',
    formula: '(Rebooked within 24h / Completed appointments) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment', 'client'],
  },
  rebook7d: {
    id: 'rebook7d',
    label: 'Rebook in 7 Days',
    definition: 'Clients who scheduled their next appointment within a week.',
    formula: '(Rebooked within 7d / Completed appointments) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment', 'client'],
  },
  rebook30d: {
    id: 'rebook30d',
    label: 'Rebook in 30 Days',
    definition: 'Clients who scheduled their next appointment within a month. A good overall measure of loyalty.',
    formula: '(Rebooked within 30d / Completed appointments) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment', 'client'],
  },
  avgDaysToNextVisit: {
    id: 'avgDaysToNextVisit',
    label: 'Days Between Visits',
    definition: 'How long clients typically wait before their next appointment.',
    formula: 'Sum of (days between consecutive visits) / count',
    timeBasisSensitivity: false,
    format: 'days',
    drillRowTypes: ['client'],
  },
  return90d: {
    id: 'return90d',
    label: 'Came Back (90 Days)',
    definition: 'Clients who returned within 3 months. A healthy rate is 60% or higher.',
    formula: '(Clients with visit in last 90 days / Total active clients) × 100',
    timeBasisSensitivity: false,
    format: 'percent',
    drillRowTypes: ['client'],
  },
  
  // Client Metrics
  avgLTV12m: {
    id: 'avgLTV12m',
    label: 'Client Value (Year)',
    definition: 'How much the average client spends with you over a year. This helps you understand what a new client is worth.',
    formula: 'Total revenue from clients in 12 months / Number of clients',
    timeBasisSensitivity: false,
    format: 'money',
    drillRowTypes: ['client'],
  },
  medianVisits12m: {
    id: 'medianVisits12m',
    label: 'Visits per Year',
    definition: 'How many times the typical client visits in a year.',
    formula: 'Median of (visits per client in 12 months)',
    timeBasisSensitivity: false,
    format: 'number',
    drillRowTypes: ['client'],
  },
  newClients: {
    id: 'newClients',
    label: 'New Clients',
    definition: 'First-time clients who came in during this period.',
    formula: 'Count of clients with first visit in period',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['client'],
  },
  retention90d: {
    id: 'retention90d',
    label: 'Kept After 3 Mo.',
    definition: 'New clients who came back at least once within 3 months.',
    formula: '(Clients with 2+ visits within 90 days of first / New clients) × 100',
    timeBasisSensitivity: false,
    format: 'percent',
    drillRowTypes: ['client'],
  },
  retention180d: {
    id: 'retention180d',
    label: 'Kept After 6 Mo.',
    definition: 'New clients who came back at least once within 6 months.',
    formula: '(Clients with 2+ visits within 180 days of first / New clients) × 100',
    timeBasisSensitivity: false,
    format: 'percent',
    drillRowTypes: ['client'],
  },
  retention360d: {
    id: 'retention360d',
    label: 'Kept After 1 Year',
    definition: 'New clients who came back at least once within a year.',
    formula: '(Clients with 2+ visits within 360 days of first / New clients) × 100',
    timeBasisSensitivity: false,
    format: 'percent',
    drillRowTypes: ['client'],
  },
  
  // Staff Metrics
  revenuePerHour: {
    id: 'revenuePerHour',
    label: 'Earned per Hour',
    definition: 'How much revenue each groomer brings in per hour worked.',
    formula: 'Net Sales / Hours Worked',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  marginPerHour: {
    id: 'marginPerHour',
    label: 'Profit per Hour',
    definition: 'How much profit each groomer generates per hour after all costs.',
    formula: 'Contribution Margin $ / Hours Worked',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  upsellRate: {
    id: 'upsellRate',
    label: 'Add-On Sales',
    definition: 'How often groomers sell extra services (like teeth brushing or nail painting).',
    formula: '(Appointments with add-ons / Total appointments) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  onTimeStartPercent: {
    id: 'onTimeStartPercent',
    label: 'Started On Time',
    definition: 'Appointments that started within 5 minutes of the scheduled time.',
    formula: '(On-time starts / Total appointments) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  tipsPerHour: {
    id: 'tipsPerHour',
    label: 'Tips per Hour',
    definition: 'Average tips received per hour worked. A sign of client satisfaction!',
    formula: 'Total Tips / Hours Worked',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  
  // Payroll Metrics
  totalPayout: {
    id: 'totalPayout',
    label: 'Total Paid to Staff',
    definition: 'Everything you paid to your team including wages, commissions, and tips.',
    formula: 'Commission + Hourly + Tips + Adjustments',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  commissionTotal: {
    id: 'commissionTotal',
    label: 'Commission Paid',
    definition: 'Total commissions earned by all staff.',
    formula: 'Sum of (service price × commission rate) for all completed services',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  hourlyTotal: {
    id: 'hourlyTotal',
    label: 'Hourly Wages',
    definition: 'Total hourly pay for all staff.',
    formula: 'Sum of (hourly rate × hours worked) for all staff',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment'],
  },
  
  // Tips Metrics
  totalTips: {
    id: 'totalTips',
    label: 'Tips Collected',
    definition: 'All tips your groomers received.',
    formula: 'Sum of all tip amounts',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['appointment', 'transaction'],
  },
  avgTipPercent: {
    id: 'avgTipPercent',
    label: 'Avg Tip %',
    definition: 'Average tip as a percentage of the service cost. Industry average is around 15-20%.',
    formula: '(Total Tips / Net Sales) × 100',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['appointment'],
  },
  tipFeeCost: {
    id: 'tipFeeCost',
    label: 'Tip Card Fees',
    definition: 'Credit card fees on tips paid by card.',
    formula: 'Sum of (card tip amount × processing rate)',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  
  // Tax Metrics
  taxableSales: {
    id: 'taxableSales',
    label: 'Taxable Sales',
    definition: 'Sales that required collecting tax.',
    formula: 'Sum of taxable service and product amounts',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  nonTaxableSales: {
    id: 'nonTaxableSales',
    label: 'Tax-Free Sales',
    definition: 'Sales that were exempt from tax.',
    formula: 'Sum of non-taxable service and product amounts',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  taxesCollected: {
    id: 'taxesCollected',
    label: 'Tax Collected',
    definition: 'Total sales tax you collected (to be paid to the government).',
    formula: 'Sum of all tax amounts',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  
  // Inventory Metrics
  itemsBelowReorder: {
    id: 'itemsBelowReorder',
    label: 'Need to Reorder',
    definition: 'Number of supplies running low that you should reorder soon.',
    formula: 'Count of items where quantity < reorder level',
    timeBasisSensitivity: false,
    format: 'number',
    drillRowTypes: ['inventory'],
  },
  daysOfSupply: {
    id: 'daysOfSupply',
    label: 'Days Until Empty',
    definition: 'How many days your current supplies will last at your current pace.',
    formula: 'Current quantity / average daily usage',
    timeBasisSensitivity: false,
    format: 'days',
    drillRowTypes: ['inventory'],
  },
  costUsed: {
    id: 'costUsed',
    label: 'Supplies Used',
    definition: 'Total cost of supplies you used during this time.',
    formula: 'Sum of (units used × unit cost)',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['inventory'],
  },
  costPerAppt: {
    id: 'costPerAppt',
    label: 'Supplies per Visit',
    definition: 'Average cost of supplies used per appointment.',
    formula: 'Cost Used / Completed Appointments',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['inventory', 'appointment'],
  },
  
  // Marketing Metrics
  messagesSent: {
    id: 'messagesSent',
    label: 'Messages Sent',
    definition: 'Total texts, emails, or notifications sent to clients.',
    formula: 'Count of all sent messages',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['message'],
  },
  confirmations: {
    id: 'confirmations',
    label: 'Confirmed',
    definition: 'How many clients confirmed their appointment.',
    formula: 'Count of messages where confirmed = true',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['message'],
  },
  showUpsAttributed: {
    id: 'showUpsAttributed',
    label: 'Clients Brought In',
    definition: 'Appointments that came from your marketing messages.',
    formula: 'Count of completed appointments with attributed message within 7 days',
    timeBasisSensitivity: true,
    format: 'number',
    drillRowTypes: ['message', 'appointment'],
  },
  costPerShowUp: {
    id: 'costPerShowUp',
    label: 'Cost to Get Client',
    definition: 'How much you spent in marketing for each client that came in.',
    formula: 'Message cost / Show-ups attributed',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['message'],
  },
  marketingROI: {
    id: 'marketingROI',
    label: 'Marketing Return',
    definition: 'For every dollar spent on marketing, how much profit did you make? 100% = broke even, 200% = doubled your money.',
    formula: '(Attributed Revenue - Marketing Cost) / Marketing Cost',
    timeBasisSensitivity: true,
    format: 'percent',
    drillRowTypes: ['message', 'appointment'],
  },
  
  // Finance Metrics  
  pendingUnpaid: {
    id: 'pendingUnpaid',
    label: 'Waiting for Payment',
    definition: 'Money you\'re still waiting to receive from clients.',
    formula: 'Sum of invoices with status = pending',
    timeBasisSensitivity: true,
    format: 'money',
    drillRowTypes: ['transaction'],
  },
  netDeposits: {
    id: 'netDeposits',
    label: 'Bank Deposit (Est)',
    definition: 'Estimated amount that will show up in your bank account after fees.',
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
