/**
 * Reports Module - Main Entry Point
 * Clean, simple landing page for easy report navigation
 */

import { useState } from 'react'
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
  description: string
  path: string
  icon: typeof ChartLine
  isEssential: boolean
  category: 'overview' | 'financial' | 'operations' | 'clients' | 'staff' | 'marketing'
}

const REPORTS: ReportDefinition[] = [
  {
    id: 'owner-overview',
    name: 'Owner Overview',
    description: 'High-level business health dashboard',
    path: '/reports/owner-overview',
    icon: ChartLine,
    isEssential: true,
    category: 'overview',
  },
  {
    id: 'true-profit',
    name: 'True Profit & Margin',
    description: 'Contribution margin after all costs',
    path: '/reports/true-profit',
    icon: CurrencyDollar,
    isEssential: true,
    category: 'financial',
  },
  {
    id: 'sales-summary',
    name: 'Sales Summary',
    description: 'Revenue breakdown and trends',
    path: '/reports/sales-summary',
    icon: ChartPie,
    isEssential: false,
    category: 'financial',
  },
  {
    id: 'finance-reconciliation',
    name: 'Finance & Reconciliation',
    description: 'Payment tracking and bank reconciliation',
    path: '/reports/finance-reconciliation',
    icon: Receipt,
    isEssential: false,
    category: 'financial',
  },
  {
    id: 'appointments-capacity',
    name: 'Appointments & Capacity',
    description: 'Booking patterns and utilization',
    path: '/reports/appointments-capacity',
    icon: CalendarBlank,
    isEssential: false,
    category: 'operations',
  },
  {
    id: 'no-shows-cancellations',
    name: 'No-Shows & Cancellations',
    description: 'Lost revenue and recovery analysis',
    path: '/reports/no-shows-cancellations',
    icon: XCircle,
    isEssential: false,
    category: 'operations',
  },
  {
    id: 'retention-rebooking',
    name: 'Retention & Rebooking',
    description: 'Client return rates and rebooking patterns',
    path: '/reports/retention-rebooking',
    icon: ArrowsClockwise,
    isEssential: true,
    category: 'clients',
  },
  {
    id: 'client-cohorts-ltv',
    name: 'Client Cohorts & LTV',
    description: 'Lifetime value and cohort analysis',
    path: '/reports/client-cohorts-ltv',
    icon: Users,
    isEssential: false,
    category: 'clients',
  },
  {
    id: 'staff-performance',
    name: 'Staff Performance',
    description: 'Groomer productivity and efficiency',
    path: '/reports/staff-performance',
    icon: UserCircle,
    isEssential: true,
    category: 'staff',
  },
  {
    id: 'payroll-compensation',
    name: 'Payroll / Compensation',
    description: 'Staff earnings and payroll breakdown',
    path: '/reports/payroll-compensation',
    icon: Briefcase,
    isEssential: false,
    category: 'staff',
  },
  {
    id: 'service-mix-pricing',
    name: 'Service Mix & Pricing',
    description: 'Service performance and pricing analysis',
    path: '/reports/service-mix-pricing',
    icon: Tag,
    isEssential: false,
    category: 'operations',
  },
  {
    id: 'inventory-usage',
    name: 'Inventory Usage & Reorder',
    description: 'Supply tracking and forecasting',
    path: '/reports/inventory-usage',
    icon: Package,
    isEssential: false,
    category: 'operations',
  },
  {
    id: 'marketing-messaging',
    name: 'Marketing & Messaging ROI',
    description: 'Campaign performance and attribution',
    path: '/reports/marketing-messaging',
    icon: Megaphone,
    isEssential: false,
    category: 'marketing',
  },
  {
    id: 'tips-gratuities',
    name: 'Tips & Gratuities',
    description: 'Tip tracking and distribution',
    path: '/reports/tips-gratuities',
    icon: Gift,
    isEssential: false,
    category: 'financial',
  },
  {
    id: 'taxes-summary',
    name: 'Taxes Summary',
    description: 'Tax collection and jurisdictions',
    path: '/reports/taxes-summary',
    icon: Percent,
    isEssential: false,
    category: 'financial',
  },
]

const CATEGORIES = [
  { id: 'overview', name: 'Overview' },
  { id: 'financial', name: 'Financial' },
  { id: 'operations', name: 'Operations' },
  { id: 'clients', name: 'Clients' },
  { id: 'staff', name: 'Staff' },
  { id: 'marketing', name: 'Marketing' },
]

// Reports Landing Page - Clean, Simple Design
function ReportsLanding() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Filter reports based on selected category
  const displayedReports = selectedCategory
    ? REPORTS.filter(r => r.category === selectedCategory)
    : REPORTS
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Simple Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View business performance and analytics
          </p>
        </div>
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-full transition-colors',
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-full transition-colors',
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
        
        {/* Clean Report List */}
        <div className="space-y-1">
          {displayedReports.map((report) => {
            const Icon = report.icon
            
            return (
              <button
                key={report.id}
                onClick={() => navigate(report.path)}
                className={cn(
                  'w-full flex items-center gap-4 p-3 rounded-lg text-left',
                  'hover:bg-muted/50 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                )}
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Icon size={20} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">
                      {report.name}
                    </span>
                    {report.isEssential && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-primary/10 text-primary">
                        Essential
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {report.description}
                  </p>
                </div>
                <CaretRight size={16} className="shrink-0 text-muted-foreground" />
              </button>
            )
          })}
        </div>
        
        {/* Empty state when filtering */}
        {displayedReports.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No reports in this category
          </div>
        )}
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
