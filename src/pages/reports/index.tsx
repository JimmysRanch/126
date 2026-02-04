/**
 * Reports Module - Main Entry Point
 * Landing page with report navigation and essentials toggle
 */

import { useState } from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Filter reports based on essentials toggle and selected category
  const displayedReports = REPORTS.filter(r => {
    const matchesEssentials = !preferences.showEssentialsOnly || r.isEssential
    const matchesCategory = !selectedCategory || r.category === selectedCategory
    return matchesEssentials && matchesCategory
  })
  
  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <div className="flex-1 flex flex-col px-4 py-3 max-w-[1800px] mx-auto w-full">
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-4 mb-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <ChartLine size={20} weight="duotone" className="text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Reports & Insights</h1>
              <p className="text-xs text-muted-foreground">Business analytics at a glance</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              id="essentials-toggle"
              checked={preferences.showEssentialsOnly}
              onCheckedChange={toggleEssentialsOnly}
            />
            <Label htmlFor="essentials-toggle" className="text-xs font-medium">
              Essentials
            </Label>
          </div>
        </div>
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 mb-3 flex-shrink-0 overflow-x-auto pb-1">
          <Button
            variant={selectedCategory === null ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-3 text-xs rounded-full flex-shrink-0"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {CATEGORIES.map((cat) => {
            const colors = CATEGORY_COLORS[cat.id]
            const count = REPORTS.filter(r => r.category === cat.id && (!preferences.showEssentialsOnly || r.isEssential)).length
            if (count === 0) return null
            
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-7 px-3 text-xs rounded-full flex-shrink-0 gap-1.5",
                  selectedCategory === cat.id && colors.iconBg
                )}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
                <span className="text-[10px] opacity-60">({count})</span>
              </Button>
            )
          })}
        </div>
        
        {/* Report Grid - fills remaining space */}
        <div className="flex-1 min-h-0">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-2 h-full auto-rows-fr content-start">
            {displayedReports.map((report) => {
              const Icon = report.icon
              const colors = CATEGORY_COLORS[report.category] || CATEGORY_COLORS.overview
              const isFavorite = preferences.favoriteReports.includes(report.id)
              
              return (
                <Card
                  key={report.id}
                  className={cn(
                    'group cursor-pointer transition-all duration-200 ease-out',
                    'hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02]',
                    'focus-visible:shadow-md focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                    'border-border/40 bg-card/50',
                    colors.border,
                    'overflow-hidden relative'
                  )}
                  onClick={() => navigate(report.path)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(report.path) }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open ${report.name} report`}
                >
                  {/* Gradient overlay on hover */}
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none',
                    colors.gradient
                  )} />
                  
                  {/* Accent line at top */}
                  <div className={cn(
                    'absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity',
                    colors.accentLine
                  )} />
                  
                  <div className="p-2.5 relative flex flex-col h-full">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className={cn(
                        'p-1.5 rounded-lg transition-transform duration-200',
                        'group-hover:scale-110',
                        colors.iconBg
                      )}>
                        <Icon size={14} weight="duotone" />
                      </div>
                      <div className="flex items-center gap-0.5">
                        {report.isEssential && (
                          <div className="w-2 h-2 rounded-full bg-primary" title="Essential report" />
                        )}
                        <button
                          className="p-0.5 rounded hover:bg-background/60 transition-colors"
                          aria-label={isFavorite ? `Remove ${report.name} from favorites` : `Add ${report.name} to favorites`}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(report.id)
                          }}
                        >
                          <Star
                            size={12}
                            weight={isFavorite ? 'fill' : 'regular'}
                            className={cn(
                              'transition-all duration-200',
                              isFavorite ? 'text-yellow-500' : 'text-muted-foreground/50'
                            )}
                          />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-xs font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {report.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-auto pt-1 line-clamp-2 leading-tight">
                      {report.description}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
        
        {/* Compact Stats Footer */}
        <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground flex-shrink-0 border-t border-border/30 mt-2">
          <span className="flex items-center gap-1">
            <ChartLine size={12} className="text-primary" />
            <strong className="text-foreground">{REPORTS.length}</strong> reports
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} weight="fill" className="text-yellow-500" />
            <strong className="text-foreground">{REPORTS.filter(r => r.isEssential).length}</strong> essential
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} className="text-amber-400" />
            <strong className="text-foreground">{CATEGORIES.length}</strong> categories
          </span>
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
