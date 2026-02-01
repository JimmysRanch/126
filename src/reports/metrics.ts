import { MetricFormat, TimeBasis, DrillRowType } from './types'

export type MetricDefinition = {
  id: string
  label: string
  definition: string
  formula: string
  exclusions?: string
  timeBasisSensitivity?: string
  format: MetricFormat
  drillRowTypes?: DrillRowType[]
}

export const metricRegistry: MetricDefinition[] = [
  {
    id: 'gross-sales',
    label: 'Gross Sales',
    definition: 'Total service and product sales before discounts, refunds, taxes, and tips.',
    formula: 'Sum of transaction item totals before discounts.',
    exclusions: 'Excludes taxes and tips.',
    timeBasisSensitivity: 'Checkout / Transaction date',
    format: 'money',
    drillRowTypes: ['transactions', 'appointments']
  },
  {
    id: 'net-sales',
    label: 'Net Sales',
    definition: 'Sales after discounts and refunds, excluding taxes and tips.',
    formula: 'Gross Sales - Discounts - Refunds.',
    exclusions: 'Excludes taxes and tips by default.',
    timeBasisSensitivity: 'Checkout / Transaction date',
    format: 'money',
    drillRowTypes: ['transactions', 'appointments']
  },
  {
    id: 'discounts',
    label: 'Discounts',
    definition: 'Total discounts applied to invoices.',
    formula: 'Sum of discount amounts on transactions.',
    exclusions: 'Excludes refunds.',
    timeBasisSensitivity: 'Checkout / Transaction date',
    format: 'money',
    drillRowTypes: ['transactions']
  },
  {
    id: 'refunds',
    label: 'Refunds',
    definition: 'Total value of refunded transactions.',
    formula: 'Sum of refunded transaction totals.',
    exclusions: 'Only refunded status.',
    timeBasisSensitivity: 'Transaction date',
    format: 'money',
    drillRowTypes: ['transactions']
  },
  {
    id: 'taxes',
    label: 'Taxes Collected',
    definition: 'Total taxes collected on transactions.',
    formula: 'Sum of tax amounts on transactions.',
    format: 'money',
    timeBasisSensitivity: 'Transaction date',
    drillRowTypes: ['transactions']
  },
  {
    id: 'tips',
    label: 'Tips Collected',
    definition: 'Tips collected from clients.',
    formula: 'Sum of tip amounts on appointments or transactions.',
    format: 'money',
    timeBasisSensitivity: 'Checkout / Transaction date',
    drillRowTypes: ['appointments', 'transactions']
  },
  {
    id: 'total-collected',
    label: 'Total Collected',
    definition: 'Total amount collected from clients, including taxes and tips.',
    formula: 'Net Sales + Taxes + Tips.',
    format: 'money',
    timeBasisSensitivity: 'Transaction date',
    drillRowTypes: ['transactions']
  },
  {
    id: 'contribution-margin',
    label: 'Contribution Margin $',
    definition: 'Revenue after direct costs such as COGS, labor, and processing fees.',
    formula: 'Net Sales - COGS - Labor - Fees.',
    format: 'money',
    timeBasisSensitivity: 'Checkout date',
    drillRowTypes: ['appointments', 'transactions']
  },
  {
    id: 'contribution-margin-percent',
    label: 'Contribution Margin %',
    definition: 'Contribution margin as a percentage of net sales.',
    formula: 'Contribution Margin / Net Sales.',
    format: 'percent',
    timeBasisSensitivity: 'Checkout date',
    drillRowTypes: ['appointments', 'transactions']
  },
  {
    id: 'gross-margin-percent',
    label: 'Gross Margin %',
    definition: 'Gross margin as a percentage of net sales.',
    formula: '(Net Sales - COGS) / Net Sales.',
    format: 'percent',
    timeBasisSensitivity: 'Checkout date',
    drillRowTypes: ['transactions']
  },
  {
    id: 'avg-ticket',
    label: 'Avg Ticket',
    definition: 'Average sales per completed appointment.',
    formula: 'Net Sales / Completed Appointments.',
    format: 'money',
    timeBasisSensitivity: 'Checkout date',
    drillRowTypes: ['appointments', 'transactions']
  },
  {
    id: 'appointments-completed',
    label: 'Appointments Completed',
    definition: 'Number of completed appointments.',
    formula: 'Count of appointments with completed status.',
    format: 'int',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['appointments']
  },
  {
    id: 'no-show-rate',
    label: 'No-show Rate',
    definition: 'Percentage of appointments marked as no-show.',
    formula: 'No-shows / Booked appointments.',
    format: 'percent',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['appointments']
  },
  {
    id: 'rebook-30d',
    label: '30-Day Rebook Rate',
    definition: 'Share of clients who rebooked within 30 days.',
    formula: 'Rebooked within 30d / Total clients with completed appt.',
    format: 'percent',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['clients', 'appointments']
  },
  {
    id: 'utilization',
    label: 'Utilization %',
    definition: 'Percent of available capacity that is booked or completed.',
    formula: 'Booked minutes / Available minutes.',
    format: 'percent',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['appointments']
  },
  {
    id: 'processing-fees',
    label: 'Processing Fees',
    definition: 'Estimated payment processing fees.',
    formula: 'Card volume x fee rate + fixed fee.',
    format: 'money',
    timeBasisSensitivity: 'Transaction date',
    drillRowTypes: ['transactions']
  },
  {
    id: 'direct-labor',
    label: 'Direct Labor',
    definition: 'Estimated groomer labor cost for completed appointments.',
    formula: 'Duration hours x hourly rate.',
    format: 'money',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['appointments']
  },
  {
    id: 'estimated-cogs',
    label: 'Estimated COGS',
    definition: 'Estimated cost of goods sold tied to services/products.',
    formula: 'Service revenue x COGS rate + inventory usage cost.',
    format: 'money',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['transactions', 'inventory']
  },
  {
    id: 'revenue-per-hour',
    label: 'Revenue / Hour',
    definition: 'Revenue earned per service hour.',
    formula: 'Net Sales / Total service hours.',
    format: 'money',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['appointments']
  },
  {
    id: 'margin-per-hour',
    label: 'Margin / Hour',
    definition: 'Contribution margin per service hour.',
    formula: 'Contribution Margin / Service hours.',
    format: 'money',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['appointments']
  },
  {
    id: 'rebook-7d',
    label: 'Rebook ≤7d',
    definition: 'Rebooking rate within 7 days.',
    formula: 'Clients rebooked within 7d / completed clients.',
    format: 'percent',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['clients']
  },
  {
    id: 'rebook-24h',
    label: 'Rebook 0–24h',
    definition: 'Rebooking rate within 24 hours.',
    formula: 'Clients rebooked within 24h / completed clients.',
    format: 'percent',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['clients']
  },
  {
    id: 'rebook-30d-window',
    label: 'Rebook ≤30d',
    definition: 'Rebooking rate within 30 days.',
    formula: 'Clients rebooked within 30d / completed clients.',
    format: 'percent',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['clients']
  },
  {
    id: 'avg-days-to-return',
    label: 'Avg Days to Next Visit',
    definition: 'Average days between completed appointment and next appointment.',
    formula: 'Avg(diff(next appointment date, current appointment date)).',
    format: 'int',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['clients']
  },
  {
    id: 'return-90d',
    label: '90-day Return Rate',
    definition: 'Percent of clients returning within 90 days.',
    formula: 'Clients returning within 90d / completed clients.',
    format: 'percent',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['clients']
  },
  {
    id: 'booked',
    label: 'Booked Appointments',
    definition: 'Appointments booked in the date range.',
    formula: 'Count of appointments excluding cancelled.',
    format: 'int',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['appointments']
  },
  {
    id: 'cancelled',
    label: 'Cancelled Appointments',
    definition: 'Appointments marked as cancelled.',
    formula: 'Count of cancelled appointments.',
    format: 'int',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['appointments']
  },
  {
    id: 'avg-lead-time',
    label: 'Avg Lead Time',
    definition: 'Average days between booking and appointment date.',
    formula: 'Avg(appointment date - created date).',
    format: 'int',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['appointments']
  },
  {
    id: 'no-show-lost-revenue',
    label: 'Lost Revenue',
    definition: 'Estimated revenue lost from no-shows and late cancellations.',
    formula: 'Sum of appointment totals for no-show/late cancel.',
    format: 'money',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['appointments']
  },
  {
    id: 'recovery-rate',
    label: 'Recovery Rate',
    definition: 'Percent of no-shows that rebook within 7 days.',
    formula: 'Recovered no-shows / total no-shows.',
    format: 'percent',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['appointments', 'clients']
  },
  {
    id: 'avg-ltv-12m',
    label: 'Avg LTV (12m)',
    definition: 'Average revenue per client in the last 12 months.',
    formula: 'Total revenue / clients in 12m.',
    format: 'money',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['clients', 'transactions']
  },
  {
    id: 'median-visits-12m',
    label: 'Median Visits (12m)',
    definition: 'Median visit count per client over last 12 months.',
    formula: 'Median of visits per client.',
    format: 'int',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['clients']
  },
  {
    id: 'new-clients',
    label: 'New Clients',
    definition: 'Clients whose first visit occurs in the date range.',
    formula: 'Count of clients with first visit within range.',
    format: 'int',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['clients']
  },
  {
    id: 'retention-90',
    label: 'Retention @90d',
    definition: 'Cohort retention after 90 days.',
    formula: 'Clients returning within 90d / cohort size.',
    format: 'percent',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['clients']
  },
  {
    id: 'retention-180',
    label: 'Retention @180d',
    definition: 'Cohort retention after 180 days.',
    formula: 'Clients returning within 180d / cohort size.',
    format: 'percent',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['clients']
  },
  {
    id: 'retention-360',
    label: 'Retention @360d',
    definition: 'Cohort retention after 360 days.',
    formula: 'Clients returning within 360d / cohort size.',
    format: 'percent',
    timeBasisSensitivity: 'Service date',
    drillRowTypes: ['clients']
  },
  {
    id: 'tips-total',
    label: 'Total Tips',
    definition: 'Total tips collected.',
    formula: 'Sum of tips from appointments or transactions.',
    format: 'money',
    timeBasisSensitivity: 'Checkout date',
    drillRowTypes: ['appointments', 'transactions']
  },
  {
    id: 'tip-percent',
    label: 'Avg Tip %',
    definition: 'Average tip as a percent of net sales.',
    formula: 'Tips / Net Sales.',
    format: 'percent',
    timeBasisSensitivity: 'Checkout date',
    drillRowTypes: ['transactions']
  },
  {
    id: 'tip-fee-cost',
    label: 'Tip Fee Cost',
    definition: 'Estimated processing fees on tips.',
    formula: 'Tips x processing fee rate.',
    format: 'money',
    timeBasisSensitivity: 'Transaction date',
    drillRowTypes: ['transactions']
  },
  {
    id: 'net-to-staff',
    label: 'Net to Staff',
    definition: 'Tips paid to staff after fees or policy adjustments.',
    formula: 'Tips - Tip Fees.',
    format: 'money',
    timeBasisSensitivity: 'Transaction date',
    drillRowTypes: ['transactions']
  },
  {
    id: 'taxable-sales',
    label: 'Taxable Sales',
    definition: 'Sales subject to tax.',
    formula: 'Sum of taxable line items.',
    format: 'money',
    timeBasisSensitivity: 'Transaction date',
    drillRowTypes: ['transactions']
  },
  {
    id: 'nontaxable-sales',
    label: 'Non-taxable Sales',
    definition: 'Sales exempt from tax.',
    formula: 'Total sales - taxable sales.',
    format: 'money',
    timeBasisSensitivity: 'Transaction date',
    drillRowTypes: ['transactions']
  }
]

export const metricLookup = new Map(metricRegistry.map((metric) => [metric.id, metric]))

export const formatMetric = (value: number, format: MetricFormat) => {
  if (format === 'money') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value / 100)
  }

  if (format === 'percent') {
    return `${(value * 100).toFixed(1)}%`
  }

  if (format === 'minutes') {
    return `${Math.round(value)} min`
  }

  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

export const formatDelta = (value: number, format: MetricFormat) => {
  if (format === 'percent') {
    return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(1)}%`
  }

  if (format === 'money') {
    return `${value >= 0 ? '+' : ''}${formatMetric(Math.abs(value), format)}`
  }

  return `${value >= 0 ? '+' : ''}${formatMetric(Math.abs(value), format)}`
}

export const getMetricTooltip = (metricId: string, timeBasis: TimeBasis) => {
  const metric = metricLookup.get(metricId)
  if (!metric) {
    return ''
  }

  return `${metric.definition}\nFormula: ${metric.formula}\n${metric.exclusions ? `Exclusions: ${metric.exclusions}\n` : ''}Time basis: ${timeBasis}`
}
