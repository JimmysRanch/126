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

// Category color mapping for visual appeal
const CATEGORY_COLORS: Record<string, { gradient: string; iconBg: string; border: string; accentLine: string }> = {
  overview: { 
    gradient: 'from-violet-500/20 to-purple-500/10',
    iconBg: 'bg-violet-500/20 text-violet-400',
    border: 'hover:border-violet-500/50',
    accentLine: 'from-violet-500 to-purple-500'
  },
  financial: { 
    gradient: 'from-emerald-500/20 to-teal-500/10',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    border: 'hover:border-emerald-500/50',
    accentLine: 'from-emerald-500 to-teal-500'
  },
  operations: { 
    gradient: 'from-blue-500/20 to-cyan-500/10',
    iconBg: 'bg-blue-500/20 text-blue-400',
    border: 'hover:border-blue-500/50',
    accentLine: 'from-blue-500 to-cyan-500'
  },
  clients: { 
    gradient: 'from-amber-500/20 to-orange-500/10',
    iconBg: 'bg-amber-500/20 text-amber-400',
    border: 'hover:border-amber-500/50',
    accentLine: 'from-amber-500 to-orange-500'
  },
  staff: { 
    gradient: 'from-pink-500/20 to-rose-500/10',
    iconBg: 'bg-pink-500/20 text-pink-400',
    border: 'hover:border-pink-500/50',
    accentLine: 'from-pink-500 to-rose-500'
  },
  marketing: { 
    gradient: 'from-indigo-500/20 to-purple-500/10',
    iconBg: 'bg-indigo-500/20 text-indigo-400',
    border: 'hover:border-indigo-500/50',
    accentLine: 'from-indigo-500 to-purple-500'
  },
}

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
        {/* Header with gradient accent */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent rounded-2xl -z-10" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <ChartLine size={24} weight="duotone" className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Reports & Insights
                </h1>
              </div>
              <p className="text-muted-foreground ml-[52px]">
                Analyze your business performance with comprehensive reports
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                <Switch
                  id="essentials-toggle"
                  checked={preferences.showEssentialsOnly}
                  onCheckedChange={toggleEssentialsOnly}
                />
                <Label htmlFor="essentials-toggle" className="text-sm font-medium">
                  Essentials Only
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Report Grid */}
        <div className="space-y-10">
          {groupedReports.map((group, groupIndex) => {
            const colors = CATEGORY_COLORS[group.id] || CATEGORY_COLORS.overview
            
            return (
              <div key={group.id} className="relative">
                {/* Category header with accent line */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('h-8 w-1 rounded-full bg-gradient-to-b', colors.accentLine)} />
                  <h2 className="text-lg font-semibold tracking-tight">{group.name}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.reports.map((report, index) => {
                    const Icon = report.icon
                    const isFavorite = preferences.favoriteReports.includes(report.id)
                    
                    return (
                      <Card
                        key={report.id}
                        className={cn(
                          'group cursor-pointer transition-all duration-300 ease-out',
                          'hover:shadow-lg hover:-translate-y-0.5',
                          'focus-visible:shadow-lg focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                          'border-border/50',
                          colors.border,
                          'overflow-hidden'
                        )}
                        style={{ 
                          animationDelay: `${index * 50}ms`,
                        }}
                        onClick={() => navigate(report.path)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(report.path) }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Open ${report.name} report`}
                      >
                        {/* Subtle gradient overlay on hover/focus */}
                        <div className={cn(
                          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 pointer-events-none',
                          colors.gradient
                        )} />
                        
                        <CardHeader className="pb-3 relative">
                          <div className="flex items-start justify-between">
                            <div className={cn(
                              'p-2.5 rounded-xl transition-all duration-300',
                              'group-hover:scale-110 group-hover:shadow-md',
                              'group-focus-visible:scale-110 group-focus-visible:shadow-md',
                              colors.iconBg
                            )}>
                              <Icon size={20} weight="duotone" />
                            </div>
                            <div className="flex items-center gap-1">
                              {report.isEssential && (
                                <Badge 
                                  variant="secondary" 
                                  className="text-[10px] bg-primary/10 text-primary border-0 font-medium"
                                >
                                  Essential
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full hover:bg-background/80"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(report.id)
                                }}
                              >
                                <Star
                                  size={14}
                                  weight={isFavorite ? 'fill' : 'regular'}
                                  className={cn(
                                    'transition-all duration-200',
                                    isFavorite ? 'text-yellow-500 scale-110' : 'text-muted-foreground'
                                  )}
                                />
                              </Button>
                            </div>
                          </div>
                          <CardTitle className="text-sm font-semibold mt-3 group-hover:text-primary transition-colors">
                            {report.name}
                          </CardTitle>
                          <CardDescription className="text-xs leading-relaxed">
                            {report.description}
                          </CardDescription>
                          
                          {/* Hover indicator */}
                          <div className={cn(
                            'absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r pointer-events-none',
                            'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300',
                            colors.accentLine
                          )} />
                        </CardHeader>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Quick stats footer */}
        <div className="mt-12 pt-6 border-t border-border/50">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ChartLine size={16} className="text-primary" />
              <span><strong className="text-foreground">{REPORTS.length}</strong> reports available</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} weight="fill" className="text-yellow-500" />
              <span><strong className="text-foreground">{REPORTS.filter(r => r.isEssential).length}</strong> essential reports</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-amber-400" />
              <span><strong className="text-foreground">{CATEGORIES.length}</strong> categories</span>
            </div>
          </div>
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
