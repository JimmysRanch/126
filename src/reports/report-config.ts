import { ReportId } from './types'

export const reportNavItems: Array<{ id: ReportId; label: string; path: string; essentials?: boolean }> = [
  { id: 'owner-overview', label: 'Owner Overview', path: '/reports/owner-overview', essentials: true },
  { id: 'true-profit', label: 'True Profit & Margin', path: '/reports/true-profit', essentials: true },
  { id: 'sales-summary', label: 'Sales Summary', path: '/reports/sales-summary' },
  { id: 'finance-recon', label: 'Finance & Reconciliation', path: '/reports/finance-recon' },
  { id: 'appointments-capacity', label: 'Appointments & Capacity', path: '/reports/appointments-capacity' },
  { id: 'no-shows', label: 'No-Shows & Cancellations', path: '/reports/no-shows' },
  { id: 'retention', label: 'Retention & Rebooking', path: '/reports/retention', essentials: true },
  { id: 'cohorts-ltv', label: 'Client Cohorts & LTV', path: '/reports/cohorts-ltv' },
  { id: 'staff-performance', label: 'Staff Performance', path: '/reports/staff-performance', essentials: true },
  { id: 'payroll', label: 'Payroll / Compensation', path: '/reports/payroll' },
  { id: 'service-mix', label: 'Service Mix & Pricing', path: '/reports/service-mix' },
  { id: 'inventory', label: 'Inventory Usage & Reorder', path: '/reports/inventory' },
  { id: 'marketing-roi', label: 'Marketing & Messaging ROI', path: '/reports/marketing-roi' },
  { id: 'tips', label: 'Tips & Gratuities', path: '/reports/tips' },
  { id: 'taxes', label: 'Taxes Summary', path: '/reports/taxes' }
]

export const reportTitles: Record<ReportId, string> = {
  'owner-overview': 'Owner Overview',
  'true-profit': 'True Profit & Margin',
  'sales-summary': 'Sales Summary',
  'finance-recon': 'Finance & Reconciliation',
  'appointments-capacity': 'Appointments & Capacity',
  'no-shows': 'No-Shows & Cancellations',
  'retention': 'Retention & Rebooking',
  'cohorts-ltv': 'Client Cohorts & LTV',
  'staff-performance': 'Staff Performance',
  'payroll': 'Payroll / Compensation',
  'service-mix': 'Service Mix & Pricing',
  'inventory': 'Inventory Usage & Reorder',
  'marketing-roi': 'Marketing & Messaging ROI',
  'tips': 'Tips & Gratuities',
  'taxes': 'Taxes Summary'
}
