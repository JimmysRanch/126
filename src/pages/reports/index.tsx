/**
 * Reports Module - Main Entry Point
 * Streamlined dashboard layout with grouped reports for better UX
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
  Percent,
  CaretRight,
  Dog,
  Wallet,
  Star,
} from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Import comprehensive dashboard pages (new grouped views)
import { PetAnalyticsDashboard } from './pages/PetAnalyticsDashboard'
import { ClientInsightsDashboard } from './pages/ClientInsightsDashboard'
import { StaffHubDashboard } from './pages/StaffHubDashboard'
import { FinancialHubDashboard } from './pages/FinancialHubDashboard'

// Import core standalone report pages
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
import { TaxesSummary } from './pages/TaxesSummary'

// Import individual report pages (still accessible via routes)
import { TipFeeCost } from './pages/TipFeeCost'
import { MonthlyRevenue } from './pages/MonthlyRevenue'
import { AddOnPerformance } from './pages/AddOnPerformance'
import { RetailProductPerformance } from './pages/RetailProductPerformance'
import { PaymentTypeRevenue } from './pages/PaymentTypeRevenue'
import { RevenueByWeightClass } from './pages/RevenueByWeightClass'
import { RevenuePerGroomingHour } from './pages/RevenuePerGroomingHour'
import { ProfitMarginByWeightClass } from './pages/ProfitMarginByWeightClass'
import { RevenueByBreed } from './pages/RevenueByBreed'
import { BreedWeightClassOverview } from './pages/BreedWeightClassOverview'
import { ServiceMix } from './pages/ServiceMix'
import { RevenueTrend } from './pages/RevenueTrend'
import { ClientRetention } from './pages/ClientRetention'
import { DiscountImpact } from './pages/DiscountImpact'
import { GroomersDiscounts } from './pages/GroomersDiscounts'
import { GroomersAdditionalFees } from './pages/GroomersAdditionalFees'
import { NewVsReturningCustomers } from './pages/NewVsReturningCustomers'
import { AppointmentsByWeightClass } from './pages/AppointmentsByWeightClass'
import { AppointmentsByBreed } from './pages/AppointmentsByBreed'
import { ServicesByWeightClass } from './pages/ServicesByWeightClass'
import { ServicesByBreed } from './pages/ServicesByBreed'
import { AppointmentFrequencyRetention } from './pages/AppointmentFrequencyRetention'
import { BreedLoyaltyLifetimeValue } from './pages/BreedLoyaltyLifetimeValue'
import { ReferralSources } from './pages/ReferralSources'
import { TopClients } from './pages/TopClients'
import { PetBreedCount } from './pages/PetBreedCount'
import { PetList } from './pages/PetList'
import { GroomerProductivity } from './pages/GroomerProductivity'
import { AppointmentDurationAnalysis } from './pages/AppointmentDurationAnalysis'

// Dashboard definitions - primary entry points
interface DashboardDefinition {
  id: string
  name: string
  description: string
  path: string
  icon: typeof ChartLine
  badge?: string
  includedReports: string[]
}

const DASHBOARDS: DashboardDefinition[] = [
  { 
    id: 'owner-overview', 
    name: 'Owner Overview', 
    description: 'High-level business health metrics and KPIs',
    path: '/reports/owner-overview', 
    icon: ChartLine,
    includedReports: []
  },
  { 
    id: 'financial-hub', 
    name: 'Financial Hub', 
    description: 'Revenue trends, payment analytics, profit margins & discounts',
    path: '/reports/financial-hub', 
    icon: Wallet,
    badge: '4 reports',
    includedReports: ['monthly-revenue', 'payment-type-revenue', 'profit-margin-by-weight-class', 'discount-impact', 'tip-fee-cost', 'revenue-trend']
  },
  { 
    id: 'client-insights', 
    name: 'Client Insights', 
    description: 'Retention, loyalty, top clients & referral analytics',
    path: '/reports/client-insights', 
    icon: Users,
    badge: '7 reports',
    includedReports: ['client-retention', 'new-vs-returning', 'top-clients', 'referral-sources', 'client-cohorts-ltv', 'appointment-frequency-retention', 'breed-loyalty']
  },
  { 
    id: 'pet-analytics', 
    name: 'Pet Analytics', 
    description: 'Breed & weight class insights for revenue and appointments',
    path: '/reports/pet-analytics', 
    icon: Dog,
    badge: '6 reports',
    includedReports: ['revenue-by-breed', 'revenue-by-weight-class', 'appointments-by-breed', 'appointments-by-weight-class', 'services-by-breed', 'services-by-weight-class']
  },
  { 
    id: 'staff-hub', 
    name: 'Staff Hub', 
    description: 'Team performance, productivity, discounts & fees',
    path: '/reports/staff-hub', 
    icon: UserCircle,
    badge: '4 reports',
    includedReports: ['staff-performance', 'groomer-productivity', 'groomers-discounts', 'groomers-additional-fees']
  },
]

// Additional standalone reports
const ADDITIONAL_REPORTS = [
  { id: 'sales-summary', name: 'Sales Summary', path: '/reports/sales-summary', icon: ChartPie, description: 'Comprehensive revenue breakdown' },
  { id: 'true-profit', name: 'True Profit & Margin', path: '/reports/true-profit', icon: CurrencyDollar, description: 'Detailed profitability analysis' },
  { id: 'finance-reconciliation', name: 'Finance & Reconciliation', path: '/reports/finance-reconciliation', icon: Receipt, description: 'Financial reconciliation tools' },
  { id: 'taxes-summary', name: 'Taxes Summary', path: '/reports/taxes-summary', icon: Percent, description: 'Tax collection and summary' },
  { id: 'appointments-capacity', name: 'Appointments & Capacity', path: '/reports/appointments-capacity', icon: CalendarBlank, description: 'Booking and capacity analysis' },
  { id: 'no-shows-cancellations', name: 'No-Shows & Cancellations', path: '/reports/no-shows-cancellations', icon: XCircle, description: 'Track missed appointments' },
  { id: 'service-mix-pricing', name: 'Service Mix & Pricing', path: '/reports/service-mix-pricing', icon: Tag, description: 'Service performance analysis' },
  { id: 'add-on-performance', name: 'Add-On Performance', path: '/reports/add-on-performance', icon: Tag, description: 'Add-on service tracking' },
  { id: 'retail-product-performance', name: 'Retail Products', path: '/reports/retail-product-performance', icon: Package, description: 'Product sales analysis' },
  { id: 'payroll-compensation', name: 'Payroll / Compensation', path: '/reports/payroll-compensation', icon: Briefcase, description: 'Staff compensation details' },
  { id: 'retention-rebooking', name: 'Retention & Rebooking', path: '/reports/retention-rebooking', icon: ArrowsClockwise, description: 'Customer rebooking analysis' },
]

// Dashboard card component
function DashboardCard({ dashboard, navigate }: { 
  dashboard: DashboardDefinition
  navigate: (path: string) => void 
}) {
  const Icon = dashboard.icon
  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group"
      onClick={() => navigate(dashboard.path)}
    >
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon size={24} weight="duotone" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{dashboard.name}</h3>
            {dashboard.badge && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {dashboard.badge}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{dashboard.description}</p>
        </div>
        <CaretRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors mt-1" />
      </div>
    </Card>
  )
}

// Quick link button for additional reports
function QuickReportLink({ report, navigate }: { 
  report: typeof ADDITIONAL_REPORTS[0]
  navigate: (path: string) => void 
}) {
  const Icon = report.icon
  return (
    <Button
      variant="ghost"
      className="w-full justify-start h-auto py-2 px-3 hover:bg-muted group"
      onClick={() => navigate(report.path)}
    >
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <Icon size={16} weight="duotone" />
        </div>
        <div className="text-left">
          <span className="text-sm font-medium text-foreground block">{report.name}</span>
          <span className="text-xs text-muted-foreground">{report.description}</span>
        </div>
      </div>
    </Button>
  )
}

// Reports Landing Page - Streamlined dashboard-first layout
function ReportsLanding() {
  const navigate = useNavigate()
  
  return (
    <div className="h-full bg-background text-foreground p-4 md:p-6 overflow-auto">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive business analytics organized by topic. Click a dashboard to explore.
          </p>
        </div>
        
        {/* Main Dashboards Grid */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Dashboards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DASHBOARDS.map(dashboard => (
              <DashboardCard 
                key={dashboard.id} 
                dashboard={dashboard} 
                navigate={navigate} 
              />
            ))}
          </div>
        </div>
        
        {/* Additional Reports */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Additional Reports
          </h2>
          <Card className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              {ADDITIONAL_REPORTS.map(report => (
                <QuickReportLink 
                  key={report.id} 
                  report={report} 
                  navigate={navigate} 
                />
              ))}
            </div>
          </Card>
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
      
      {/* New Grouped Dashboards */}
      <Route path="financial-hub" element={<FinancialHubDashboard />} />
      <Route path="client-insights" element={<ClientInsightsDashboard />} />
      <Route path="pet-analytics" element={<PetAnalyticsDashboard />} />
      <Route path="staff-hub" element={<StaffHubDashboard />} />
      
      {/* Core Standalone Reports */}
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
      <Route path="taxes-summary" element={<TaxesSummary />} />
      
      {/* Financial Reports */}
      <Route path="tip-fee-cost" element={<TipFeeCost />} />
      <Route path="monthly-revenue" element={<MonthlyRevenue />} />
      <Route path="payment-type-revenue" element={<PaymentTypeRevenue />} />
      <Route path="revenue-by-weight-class" element={<RevenueByWeightClass />} />
      <Route path="revenue-per-grooming-hour" element={<RevenuePerGroomingHour />} />
      <Route path="profit-margin-by-weight-class" element={<ProfitMarginByWeightClass />} />
      <Route path="revenue-by-breed" element={<RevenueByBreed />} />
      <Route path="revenue-trend" element={<RevenueTrend />} />
      <Route path="discount-impact" element={<DiscountImpact />} />
      
      {/* Operations Reports */}
      <Route path="add-on-performance" element={<AddOnPerformance />} />
      <Route path="retail-product-performance" element={<RetailProductPerformance />} />
      <Route path="breed-weight-class-overview" element={<BreedWeightClassOverview />} />
      <Route path="service-mix" element={<ServiceMix />} />
      <Route path="appointment-duration-analysis" element={<AppointmentDurationAnalysis />} />
      
      {/* Client Reports */}
      <Route path="client-retention" element={<ClientRetention />} />
      <Route path="new-vs-returning-customers" element={<NewVsReturningCustomers />} />
      <Route path="appointments-by-weight-class" element={<AppointmentsByWeightClass />} />
      <Route path="appointments-by-breed" element={<AppointmentsByBreed />} />
      <Route path="services-by-weight-class" element={<ServicesByWeightClass />} />
      <Route path="services-by-breed" element={<ServicesByBreed />} />
      <Route path="appointment-frequency-retention" element={<AppointmentFrequencyRetention />} />
      <Route path="breed-loyalty-lifetime-value" element={<BreedLoyaltyLifetimeValue />} />
      <Route path="referral-sources" element={<ReferralSources />} />
      <Route path="top-clients" element={<TopClients />} />
      <Route path="pet-breed-count" element={<PetBreedCount />} />
      <Route path="pet-list" element={<PetList />} />
      
      {/* Staff Reports */}
      <Route path="groomers-discounts" element={<GroomersDiscounts />} />
      <Route path="groomers-additional-fees" element={<GroomersAdditionalFees />} />
      <Route path="groomer-productivity" element={<GroomerProductivity />} />
    </Routes>
  )
}

export { DASHBOARDS, ADDITIONAL_REPORTS }
