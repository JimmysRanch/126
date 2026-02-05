/**
 * Reports Module - Main Entry Point
 * Card-based layout organized by category
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
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
  { id: 'overview', name: 'Overview', description: 'High-level business insights' },
  { id: 'operations', name: 'Operations', description: 'Appointments, services, and inventory' },
  { id: 'financial', name: 'Financial', description: 'Revenue, profit, and expenses' },
  { id: 'clients', name: 'Clients', description: 'Customer retention and value' },
  { id: 'staff', name: 'Staff', description: 'Team performance and payroll' },
  { id: 'marketing', name: 'Marketing', description: 'Campaign effectiveness and ROI' },
]

// Report button component
function ReportButton({ report, navigate }: { report: ReportDefinition; navigate: (path: string) => void }) {
  const Icon = report.icon
  return (
    <Button
      variant="ghost"
      className="w-full justify-between h-auto py-2 px-3 hover:bg-primary/10 group"
      onClick={() => navigate(report.path)}
    >
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded bg-primary/10 text-primary">
          <Icon size={18} weight="duotone" />
        </div>
        <span className="text-sm font-medium text-foreground">{report.name}</span>
      </div>
      <CaretRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
    </Button>
  )
}

// Category card component
function CategoryCard({ category, reports, navigate }: { 
  category: { id: string; name: string; description: string }
  reports: ReportDefinition[]
  navigate: (path: string) => void 
}) {
  if (reports.length === 0) return null
  
  return (
    <Card className="border-border h-fit">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">{category.name}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{category.description}</p>
      </div>
      <div className="p-2 space-y-1">
        {reports.map(report => (
          <ReportButton key={report.id} report={report} navigate={navigate} />
        ))}
      </div>
    </Card>
  )
}

// Reports Landing Page - Card-based layout
function ReportsLanding() {
  const navigate = useNavigate()
  
  // Group reports by category
  const groupedReports = CATEGORIES.map(cat => ({
    category: cat,
    reports: REPORTS.filter(r => r.category === cat.id),
  }))
  
  // Organize cards into columns to eliminate dead space
  const column1 = groupedReports.filter(g => ['overview', 'operations', 'marketing'].includes(g.category.id))
  const column2 = groupedReports.filter(g => ['financial'].includes(g.category.id))
  const column3 = groupedReports.filter(g => ['clients', 'staff'].includes(g.category.id))
  
  return (
    <div className="h-full bg-background text-foreground p-2 md:p-3 overflow-hidden">
      <div className="max-w-[1400px] mx-auto h-full flex flex-col">
        <div className="mb-3 flex-shrink-0">
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">View business insights and analytics</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 items-start flex-1 min-h-0">
          <div className="space-y-3">
            {column1.map(({ category, reports }) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                reports={reports} 
                navigate={navigate} 
              />
            ))}
          </div>
          <div className="space-y-3">
            {column2.map(({ category, reports }) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                reports={reports} 
                navigate={navigate} 
              />
            ))}
          </div>
          <div className="space-y-3">
            {column3.map(({ category, reports }) => (
              <CategoryCard 
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
