/**
 * Reports Module - Main Entry Point
 * Landing page with report navigation and essentials toggle
 */

import { useState } from 'react'
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  Star,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useReportPreferences } from './hooks/useReportData'

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

// Reports Landing Page
function ReportsLanding() {
  const navigate = useNavigate()
  const { preferences, toggleEssentialsOnly, toggleFavorite } = useReportPreferences()
  
  // Filter reports based on essentials toggle
  const displayedReports = preferences.showEssentialsOnly
    ? REPORTS.filter(r => r.isEssential)
    : REPORTS
  
  // Group by category
  const groupedReports = CATEGORIES.map(cat => ({
    ...cat,
    reports: displayedReports.filter(r => r.category === cat.id),
  })).filter(g => g.reports.length > 0)
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Reports & Insights</h1>
            <p className="text-muted-foreground">
              Analyze your business performance with comprehensive reports
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="essentials-toggle"
                checked={preferences.showEssentialsOnly}
                onCheckedChange={toggleEssentialsOnly}
              />
              <Label htmlFor="essentials-toggle" className="text-sm">
                Essentials Only
              </Label>
            </div>
          </div>
        </div>
        
        {/* Report Grid */}
        <div className="space-y-8">
          {groupedReports.map(group => (
            <div key={group.id}>
              <h2 className="text-lg font-semibold mb-3">{group.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.reports.map(report => {
                  const Icon = report.icon
                  const isFavorite = preferences.favoriteReports.includes(report.id)
                  
                  return (
                    <Card
                      key={report.id}
                      className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                      onClick={() => navigate(report.path)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Icon size={20} weight="duotone" />
                          </div>
                          <div className="flex items-center gap-1">
                            {report.isEssential && (
                              <Badge variant="secondary" className="text-[10px]">
                                Essential
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(report.id)
                              }}
                            >
                              <Star
                                size={14}
                                weight={isFavorite ? 'fill' : 'regular'}
                                className={cn(isFavorite && 'text-yellow-500')}
                              />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-sm mt-3">{report.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {report.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main Reports Component with Routing
export function Reports() {
  const location = useLocation()
  const isLanding = location.pathname === '/reports' || location.pathname === '/reports/'
  
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
