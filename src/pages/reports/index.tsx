/**
 * Reports Module - Main Entry Point
 * Clean two-column layout with categories as section headers
 */

import { useNavigate, Routes, Route } from 'react-router-dom'
import { 
  ChartLine,
  ChartPie,
  CurrencyDollar,
  Receipt,
  CalendarBlank,
  XCircle,
  ArrowsClockwise,
  Users,
  UserCircle,
  Briefcase,
  Tag,
  Package,
  Megaphone,
  Gift,
  Percent,
  CaretRight,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

// Import report pages
import { OwnerOverview } from './pages/OwnerOverview'
import { TrueProfitMargin } from './pages/TrueProfitMargin'
import { SalesSummary } from './pages/SalesSummary'
import { FinanceReconciliation } from './pages/FinanceReconciliation'
import { AppointmentsCapacity } from './pages/AppointmentsCapacity'
import { NoShowsCancellations } from './pages/NoShowsCancellations'
import { RetentionRebooking } from './pages/RetentionRebooking'
import { ClientCohortsLTV } from './pages/ClientCohortsLTV'
import { StaffPerformance } from './pages/StaffPerformance'
import { PayrollCompensation } from './pages/PayrollCompensation'
import { ServiceMixPricing } from './pages/ServiceMixPricing'
import { InventoryUsage } from './pages/InventoryUsage'
import { MarketingROI } from './pages/MarketingROI'
import { TipsGratuities } from './pages/TipsGratuities'
import { TaxesSummary } from './pages/TaxesSummary'

// Report definitions
interface ReportDefinition {
  id: string
  name: string
  path: string
  icon: typeof ChartLine
  category: 'overview' | 'financial' | 'operations' | 'clients' | 'staff' | 'marketing'
}

const REPORTS: ReportDefinition[] = [
  { id: 'owner-overview', name: 'Owner Overview', path: '/reports/owner-overview', icon: ChartLine, category: 'overview' },
  { id: 'true-profit', name: 'True Profit & Margin', path: '/reports/true-profit', icon: CurrencyDollar, category: 'financial' },
  { id: 'sales-summary', name: 'Sales Summary', path: '/reports/sales-summary', icon: ChartPie, category: 'financial' },
  { id: 'finance-reconciliation', name: 'Finance & Reconciliation', path: '/reports/finance-reconciliation', icon: Receipt, category: 'financial' },
  { id: 'tips-gratuities', name: 'Tips & Gratuities', path: '/reports/tips-gratuities', icon: Gift, category: 'financial' },
  { id: 'taxes-summary', name: 'Taxes Summary', path: '/reports/taxes-summary', icon: Percent, category: 'financial' },
  { id: 'appointments-capacity', name: 'Appointments & Capacity', path: '/reports/appointments-capacity', icon: CalendarBlank, category: 'operations' },
  { id: 'no-shows-cancellations', name: 'No-Shows & Cancellations', path: '/reports/no-shows-cancellations', icon: XCircle, category: 'operations' },
  { id: 'service-mix-pricing', name: 'Service Mix & Pricing', path: '/reports/service-mix-pricing', icon: Tag, category: 'operations' },
  { id: 'inventory-usage', name: 'Inventory Usage & Reorder', path: '/reports/inventory-usage', icon: Package, category: 'operations' },
  { id: 'retention-rebooking', name: 'Retention & Rebooking', path: '/reports/retention-rebooking', icon: ArrowsClockwise, category: 'clients' },
  { id: 'client-cohorts-ltv', name: 'Client Cohorts & LTV', path: '/reports/client-cohorts-ltv', icon: Users, category: 'clients' },
  { id: 'staff-performance', name: 'Staff Performance', path: '/reports/staff-performance', icon: UserCircle, category: 'staff' },
  { id: 'payroll-compensation', name: 'Payroll / Compensation', path: '/reports/payroll-compensation', icon: Briefcase, category: 'staff' },
  { id: 'marketing-messaging', name: 'Marketing & Messaging ROI', path: '/reports/marketing-messaging', icon: Megaphone, category: 'marketing' },
]

const CATEGORIES = [
  { id: 'overview', name: 'Overview' },
  { id: 'financial', name: 'Financial' },
  { id: 'operations', name: 'Operations' },
  { id: 'clients', name: 'Clients' },
  { id: 'staff', name: 'Staff' },
  { id: 'marketing', name: 'Marketing' },
]

// Report link component
function ReportLink({ report, navigate }: { report: ReportDefinition; navigate: (path: string) => void }) {
  const Icon = report.icon
  return (
    <button
      onClick={() => navigate(report.path)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(report.path) }}
      aria-label={`Open ${report.name} report`}
      className={cn(
        'w-full flex items-center gap-2 py-1.5 px-2 rounded text-left text-sm',
        'hover:bg-muted/50 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
      )}
    >
      <Icon size={16} className="shrink-0 text-muted-foreground" />
      <span className="text-foreground truncate">{report.name}</span>
      <CaretRight size={12} className="shrink-0 text-muted-foreground ml-auto" />
    </button>
  )
}

// Category section component
function CategorySection({ category, reports, navigate }: { 
  category: { id: string; name: string }
  reports: ReportDefinition[]
  navigate: (path: string) => void 
}) {
  if (reports.length === 0) return null
  
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 px-2">
        {category.name}
      </h3>
      <div>
        {reports.map(report => (
          <ReportLink key={report.id} report={report} navigate={navigate} />
        ))}
      </div>
    </div>
  )
}

// Reports Landing Page - Two-column layout with categories
function ReportsLanding() {
  const navigate = useNavigate()
  
  // Group reports by category
  const groupedReports = CATEGORIES.map(cat => ({
    category: cat,
    reports: REPORTS.filter(r => r.category === cat.id),
  }))
  
  // Split categories into two columns for balanced layout
  const leftColumn = groupedReports.slice(0, 3)  // Overview, Financial, Operations
  const rightColumn = groupedReports.slice(3)    // Clients, Staff, Marketing
  
  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Simple Header */}
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-foreground">Reports</h1>
        </div>
        
        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {/* Left Column */}
          <div>
            {leftColumn.map(({ category, reports }) => (
              <CategorySection 
                key={category.id} 
                category={category} 
                reports={reports} 
                navigate={navigate} 
              />
            ))}
          </div>
          
          {/* Right Column */}
          <div>
            {rightColumn.map(({ category, reports }) => (
              <CategorySection 
                key={category.id} 
                category={category} 
                reports={reports} 
                navigate={navigate} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Reports Component with Routing
export function Reports() {
  return (
    <Routes>
      <Route index element={<ReportsLanding />} />
      <Route path="owner-overview" element={<OwnerOverview />} />
      <Route path="true-profit" element={<TrueProfitMargin />} />
      <Route path="sales-summary" element={<SalesSummary />} />
      <Route path="finance-reconciliation" element={<FinanceReconciliation />} />
      <Route path="appointments-capacity" element={<AppointmentsCapacity />} />
      <Route path="no-shows-cancellations" element={<NoShowsCancellations />} />
      <Route path="retention-rebooking" element={<RetentionRebooking />} />
      <Route path="client-cohorts-ltv" element={<ClientCohortsLTV />} />
      <Route path="staff-performance" element={<StaffPerformance />} />
      <Route path="payroll-compensation" element={<PayrollCompensation />} />
      <Route path="service-mix-pricing" element={<ServiceMixPricing />} />
      <Route path="inventory-usage" element={<InventoryUsage />} />
      <Route path="marketing-messaging" element={<MarketingROI />} />
      <Route path="tips-gratuities" element={<TipsGratuities />} />
      <Route path="taxes-summary" element={<TaxesSummary />} />
    </Routes>
  )
}

export { REPORTS, CATEGORIES }
