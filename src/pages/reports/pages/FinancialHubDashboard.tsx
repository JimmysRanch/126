/**
 * Financial Hub Dashboard
 * Combines revenue, profit margin, payment types, and discount impact reports
 */

import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Info, 
  ArrowsClockwise, 
  ChartLine,
  CurrencyDollar,
  CreditCard,
  Percent,
  Warning
} from '@phosphor-icons/react'
import { ReportShell } from '../components/ReportShell'
import { KPIDeck } from '../components/KPICard'
import { InsightsStrip, InsightsEmptyState } from '../components/InsightsStrip'
import { ChartCard, SimpleBarChart, SimpleLineChart, SimplePieChart } from '../components/ChartCard'
import { DataTable } from '../components/DataTable'
import { DrillDrawer } from '../components/DrillDrawer'
import { DefinitionsModal } from '../components/DefinitionsModal'
import { useReportFilters } from '../hooks/useReportFilters'
import { useReportData } from '../hooks/useReportData'
import { generateInsights } from '../engine/insightsEngine'
import {
  calculateGrossSales,
  calculateNetSales,
  calculateContributionMargin,
  calculateContributionMarginPercent,
  calculateTotalDiscounts,
  calculateTotalTips,
  calculateKPIWithDelta,
  generateSalesByDayChart,
  getDrillRows,
  measurePerformance,
} from '../engine/analyticsEngine'
import { DrillRow, Insight, AggregatedRow } from '../types'

function getWeightClass(weightLbs: number | undefined): string {
  if (!weightLbs) return 'Unknown'
  if (weightLbs <= 20) return 'Small'
  if (weightLbs <= 50) return 'Medium'
  if (weightLbs <= 80) return 'Large'
  return 'XLarge'
}

export function FinancialHubDashboard() {
  const navigate = useNavigate()
  const { filters, setFilters } = useReportFilters()
  const {
    appointments,
    previousAppointments,
    transactions,
    previousTransactions,
    inventoryItems,
    isLoading,
    error,
  } = useReportData(filters)

  // UI State
  const [showDefinitions, setShowDefinitions] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [drillOpen, setDrillOpen] = useState(false)
  const [drillTitle, setDrillTitle] = useState('')
  const [drillSubtitle, setDrillSubtitle] = useState<string | undefined>()
  const [drillRows, setDrillRows] = useState<DrillRow[]>([])
  const [drillTotal, setDrillTotal] = useState<{ label: string; value: number; format: 'money' | 'percent' | 'number' } | undefined>()

  // ============ Revenue Trend Data ============
  const revenueTrendData = useMemo(() => {
    if (appointments.length === 0) return []
    return measurePerformance('generateRevenueTrend', () => 
      generateSalesByDayChart(appointments, filters)
    )
  }, [appointments, filters])

  // ============ Monthly Revenue Data ============
  const monthlyRevenueData = useMemo(() => {
    return measurePerformance('aggregateMonthlyRevenue', () => {
      const byMonth: Record<string, { revenue: number; appointments: number; tips: number }> = {}

      appointments.filter(a => a.status === 'completed').forEach(appt => {
        const month = appt.serviceDate.substring(0, 7) // YYYY-MM
        if (!byMonth[month]) {
          byMonth[month] = { revenue: 0, appointments: 0, tips: 0 }
        }
        byMonth[month].revenue += appt.netCents
        byMonth[month].appointments += 1
        byMonth[month].tips += appt.tipCents || 0
      })

      return Object.entries(byMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
          month,
          monthLabel: new Date(month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' }),
          ...data,
          avgTicket: data.appointments > 0 ? Math.round(data.revenue / data.appointments) : 0,
        }))
    })
  }, [appointments])

  // ============ Payment Type Data ============
  const paymentTypeData = useMemo(() => {
    return measurePerformance('aggregateByPaymentType', () => {
      const byType: Record<string, { count: number; revenue: number }> = {}

      appointments.filter(a => a.status === 'completed').forEach(appt => {
        const paymentType = appt.paymentMethod || 'Unknown'
        if (!byType[paymentType]) {
          byType[paymentType] = { count: 0, revenue: 0 }
        }
        byType[paymentType].count += 1
        byType[paymentType].revenue += appt.netCents
      })

      const total = Object.values(byType).reduce((sum, t) => sum + t.revenue, 0)
      return Object.entries(byType).map(([type, data]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count: data.count,
        revenue: data.revenue,
        share: total > 0 ? (data.revenue / total) * 100 : 0,
      }))
    })
  }, [appointments])

  // ============ Profit by Weight Class ============
  const profitByWeightData = useMemo(() => {
    return measurePerformance('aggregateProfitByWeight', () => {
      const byClass: Record<string, { revenue: number; count: number; cogs: number }> = {}

      appointments.filter(a => a.status === 'completed').forEach(appt => {
        const weightClass = getWeightClass(appt.petWeight)
        if (!byClass[weightClass]) {
          byClass[weightClass] = { revenue: 0, count: 0, cogs: 0 }
        }
        byClass[weightClass].revenue += appt.netCents
        byClass[weightClass].count += 1
        // Estimate COGS per appointment
        byClass[weightClass].cogs += Math.round(appt.netCents * 0.15) // 15% estimate
      })

      return Object.entries(byClass).map(([weightClass, data]) => ({
        weightClass,
        revenue: data.revenue,
        appointments: data.count,
        cogs: data.cogs,
        margin: data.revenue - data.cogs,
        marginPercent: data.revenue > 0 ? ((data.revenue - data.cogs) / data.revenue) * 100 : 0,
        avgTicket: data.count > 0 ? Math.round(data.revenue / data.count) : 0,
      }))
    })
  }, [appointments])

  // ============ Discount Impact Data ============
  const discountData = useMemo(() => {
    return measurePerformance('calculateDiscountImpact', () => {
      const withDiscount = appointments.filter(a => a.status === 'completed' && (a.discountCents || 0) > 0)
      const withoutDiscount = appointments.filter(a => a.status === 'completed' && !(a.discountCents || 0))

      const totalDiscounts = withDiscount.reduce((sum, a) => sum + (a.discountCents || 0), 0)
      const avgDiscountAmount = withDiscount.length > 0 ? Math.round(totalDiscounts / withDiscount.length) : 0

      const avgTicketWithDiscount = withDiscount.length > 0 
        ? Math.round(withDiscount.reduce((sum, a) => sum + a.netCents, 0) / withDiscount.length) 
        : 0
      const avgTicketWithoutDiscount = withoutDiscount.length > 0 
        ? Math.round(withoutDiscount.reduce((sum, a) => sum + a.netCents, 0) / withoutDiscount.length) 
        : 0

      return {
        totalDiscounts,
        discountedTransactions: withDiscount.length,
        nonDiscountedTransactions: withoutDiscount.length,
        avgDiscountAmount,
        avgTicketWithDiscount,
        avgTicketWithoutDiscount,
        discountRate: appointments.length > 0 ? (withDiscount.length / appointments.filter(a => a.status === 'completed').length) * 100 : 0,
      }
    })
  }, [appointments])

  // ============ Tip Fee Cost Data ============
  const tipFeeData = useMemo(() => {
    return measurePerformance('calculateTipFeeCost', () => {
      const totalTips = appointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + (a.tipCents || 0), 0)
      const totalRevenue = appointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.netCents, 0)
      const processingFeeRate = 0.029 // 2.9% typical
      const estimatedTipFees = Math.round(totalTips * processingFeeRate)
      const estimatedTotalFees = Math.round(totalRevenue * processingFeeRate)

      return {
        totalTips,
        estimatedTipFees,
        estimatedTotalFees,
        totalRevenue,
        tipFeePercent: totalTips > 0 ? (estimatedTipFees / totalTips) * 100 : 0,
      }
    })
  }, [appointments])

  // ============ KPIs ============
  const kpis = useMemo(() => {
    if (appointments.length === 0) return []

    return measurePerformance('calculateFinancialHubKPIs', () => {
      const currentGross = calculateGrossSales(appointments)
      const previousGross = calculateGrossSales(previousAppointments)

      const currentNet = calculateNetSales(appointments, filters.includeDiscounts, filters.includeRefunds)
      const previousNet = calculateNetSales(previousAppointments, filters.includeDiscounts, filters.includeRefunds)

      const currentMargin = calculateContributionMargin(appointments, transactions)
      const previousMargin = calculateContributionMargin(previousAppointments, previousTransactions)

      const currentMarginPct = calculateContributionMarginPercent(appointments, transactions)
      const previousMarginPct = calculateContributionMarginPercent(previousAppointments, previousTransactions)

      const currentDiscounts = calculateTotalDiscounts(appointments)
      const previousDiscounts = calculateTotalDiscounts(previousAppointments)

      const currentTips = calculateTotalTips(appointments)
      const previousTips = calculateTotalTips(previousAppointments)

      return [
        { metricId: 'grossSales', value: calculateKPIWithDelta(currentGross, previousGross, 'money') },
        { metricId: 'netSales', value: calculateKPIWithDelta(currentNet, previousNet, 'money') },
        { metricId: 'contributionMargin', value: calculateKPIWithDelta(currentMargin, previousMargin, 'money') },
        { metricId: 'contributionMarginPercent', value: calculateKPIWithDelta(currentMarginPct, previousMarginPct, 'percent') },
        { metricId: 'totalDiscounts', value: calculateKPIWithDelta(currentDiscounts, previousDiscounts, 'money') },
        { metricId: 'totalTips', value: calculateKPIWithDelta(currentTips, previousTips, 'money') },
      ]
    })
  }, [appointments, previousAppointments, transactions, previousTransactions, filters])

  // ============ Insights ============
  const insights = useMemo(() => {
    if (appointments.length === 0) return []
    return measurePerformance('generateFinancialInsights', () =>
      generateInsights({
        appointments,
        previousAppointments,
        transactions,
        previousTransactions,
        inventoryItems,
        messages: [],
        filters,
      }).filter(i => ['margin', 'cost', 'profit', 'sales', 'revenue', 'discount'].some(k => i.category.includes(k)))
    )
  }, [appointments, previousAppointments, transactions, previousTransactions, inventoryItems, filters])

  // ============ Charts ============
  const paymentTypePieData = useMemo(() => {
    return paymentTypeData.map(p => ({
      label: p.type,
      value: p.revenue,
    }))
  }, [paymentTypeData])

  const monthlyRevenueChartData = useMemo(() => {
    return monthlyRevenueData.map(m => ({
      label: m.monthLabel,
      value: m.revenue,
    }))
  }, [monthlyRevenueData])

  const profitByWeightBarData = useMemo(() => {
    return profitByWeightData.map(p => ({
      label: p.weightClass,
      value: p.marginPercent,
    }))
  }, [profitByWeightData])

  const discountCompareData = useMemo(() => {
    return [
      { label: 'With Discount', value: discountData.avgTicketWithDiscount },
      { label: 'Without Discount', value: discountData.avgTicketWithoutDiscount },
    ]
  }, [discountData])

  // ============ Tables ============
  const monthlyTableData = useMemo(() => {
    return monthlyRevenueData.map(m => ({
      dimensionValue: m.monthLabel,
      drillKey: `month:${m.month}`,
      metrics: {
        revenue: m.revenue,
        appointments: m.appointments,
        tips: m.tips,
        avgTicket: m.avgTicket,
      },
    }))
  }, [monthlyRevenueData])

  const paymentTypeTableData = useMemo(() => {
    return paymentTypeData.map(p => ({
      dimensionValue: p.type,
      drillKey: `payment:${p.type}`,
      metrics: {
        count: p.count,
        revenue: p.revenue,
        share: p.share,
        avgTicket: p.count > 0 ? Math.round(p.revenue / p.count) : 0,
      },
    }))
  }, [paymentTypeData])

  const profitTableData = useMemo(() => {
    return profitByWeightData.map(p => ({
      dimensionValue: p.weightClass,
      drillKey: `weight:${p.weightClass}`,
      metrics: {
        revenue: p.revenue,
        appointments: p.appointments,
        cogs: p.cogs,
        margin: p.margin,
        marginPercent: p.marginPercent,
        avgTicket: p.avgTicket,
      },
    }))
  }, [profitByWeightData])

  // ============ Handlers ============
  const formatMoney = (v: number) => `$${(v / 100).toLocaleString()}`
  const formatPercent = (v: number) => `${v.toFixed(1)}%`

  const handleRowDrill = useCallback((row: AggregatedRow) => {
    const rows = getDrillRows(appointments, transactions, row.drillKey)
    setDrillTitle(row.dimensionValue)
    setDrillSubtitle(`${rows.length} items`)
    setDrillRows(rows)
    setDrillTotal({ label: 'Revenue', value: row.metrics.revenue || 0, format: 'money' })
    setDrillOpen(true)
  }, [appointments, transactions])

  const handleInsightClick = useCallback((insight: Insight) => {
    if (insight.drillKey) {
      const rows = getDrillRows(appointments, transactions, insight.drillKey)
      setDrillTitle(insight.title)
      setDrillSubtitle(insight.description)
      setDrillRows(rows)
      setDrillTotal(undefined)
      setDrillOpen(true)
    }
  }, [appointments, transactions])

  const handleExportDrillCSV = useCallback(() => {
    if (drillRows.length === 0) return
    const headers = ['Date', 'Client', 'Service', 'Revenue', 'Discount', 'Tip']
    const rows = drillRows.map(r => {
      const d = r.data as any
      return [d.serviceDate || '', d.clientName || '', d.services?.[0]?.name || '', ((d.netCents || 0) / 100).toFixed(2), ((d.discountCents || 0) / 100).toFixed(2), ((d.tipCents || 0) / 100).toFixed(2)]
    })
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `financial-drill-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [drillRows])

  // ============ Loading State ============
  if (isLoading) {
    return (
      <ReportShell title="Financial Hub" description="Revenue, profit margins, and financial analytics" defaultTimeBasis="checkout">
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-3"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-8 w-24" /></Card>
            ))}
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[400px]" />
        </div>
      </ReportShell>
    )
  }

  // ============ Error State ============
  if (error) {
    return (
      <ReportShell title="Financial Hub" description="Revenue, profit margins, and financial analytics" defaultTimeBasis="checkout">
        <Alert variant="destructive">
          <Warning className="h-4 w-4" />
          <AlertDescription>Failed to load data.</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          <ArrowsClockwise className="mr-2 h-4 w-4" /> Retry
        </Button>
      </ReportShell>
    )
  }

  // ============ Empty State ============
  if (appointments.length === 0) {
    return (
      <ReportShell title="Financial Hub" description="Revenue, profit margins, and financial analytics" defaultTimeBasis="checkout">
        <Card className="p-8 text-center">
          <Info size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No Data Available</h2>
          <p className="text-muted-foreground mb-4">No completed appointments found for the selected period.</p>
          <Button variant="outline" onClick={() => setFilters({ ...filters, dateRange: 'last90' })}>Try Last 90 Days</Button>
        </Card>
      </ReportShell>
    )
  }

  return (
    <>
      <ReportShell
        title="Financial Hub"
        description="Revenue, profit margins, and financial analytics"
        defaultTimeBasis="checkout"
        onShowDefinitions={() => setShowDefinitions(true)}
      >
        {/* KPI Deck */}
        <KPIDeck metrics={kpis} />

        {/* Insights */}
        {insights.length > 0 ? (
          <InsightsStrip insights={insights} onInsightClick={handleInsightClick} />
        ) : (
          <InsightsEmptyState />
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <ChartLine size={16} weight="duotone" />
              <span className="hidden sm:inline">Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard size={16} weight="duotone" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="profit" className="flex items-center gap-2">
              <CurrencyDollar size={16} weight="duotone" />
              <span className="hidden sm:inline">Profit</span>
            </TabsTrigger>
            <TabsTrigger value="discounts" className="flex items-center gap-2">
              <Percent size={16} weight="duotone" />
              <span className="hidden sm:inline">Discounts</span>
            </TabsTrigger>
          </TabsList>

          {/* Revenue Tab */}
          <TabsContent value="overview" className="space-y-4">
            <ChartCard title="Revenue Trend" description="Daily revenue over time" ariaLabel="Line chart of revenue trend">
              <SimpleLineChart data={revenueTrendData} height={300} formatValue={formatMoney} showArea />
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Monthly Revenue" description="Revenue by month" ariaLabel="Bar chart of monthly revenue">
                <SimpleBarChart data={monthlyRevenueChartData} height={280} formatValue={formatMoney} />
              </ChartCard>

              <Card className="p-4">
                <h3 className="font-semibold mb-4">Revenue Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Total Revenue</span>
                    <span className="font-semibold">{formatMoney(monthlyRevenueData.reduce((sum, m) => sum + m.revenue, 0))}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Total Tips</span>
                    <span className="font-semibold">{formatMoney(monthlyRevenueData.reduce((sum, m) => sum + m.tips, 0))}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Total Appointments</span>
                    <span className="font-semibold">{monthlyRevenueData.reduce((sum, m) => sum + m.appointments, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Est. Processing Fees</span>
                    <span className="font-semibold text-destructive">-{formatMoney(tipFeeData.estimatedTotalFees)}</span>
                  </div>
                </div>
              </Card>
            </div>

            <DataTable
              title="Monthly Revenue Breakdown"
              data={monthlyTableData}
              columns={[
                { id: 'revenue', label: 'Revenue', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'appointments', label: 'Appointments', format: 'number', align: 'right', defaultVisible: true, sortable: true },
                { id: 'tips', label: 'Tips', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'avgTicket', label: 'Avg Ticket', format: 'money', align: 'right', defaultVisible: true, sortable: true },
              ]}
              maxPreviewRows={12}
              showViewAll
            />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Revenue by Payment Type" description="Distribution across payment methods" ariaLabel="Pie chart of payment types">
                <SimplePieChart data={paymentTypePieData} height={280} formatValue={formatMoney} />
              </ChartCard>

              <Card className="p-4">
                <h3 className="font-semibold mb-4">Payment Processing Costs</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Total Tips</span>
                    <span className="font-semibold">{formatMoney(tipFeeData.totalTips)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Est. Tip Processing Fees</span>
                    <span className="font-semibold text-destructive">-{formatMoney(tipFeeData.estimatedTipFees)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Total Revenue</span>
                    <span className="font-semibold">{formatMoney(tipFeeData.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Est. Total Processing Fees</span>
                    <span className="font-semibold text-destructive">-{formatMoney(tipFeeData.estimatedTotalFees)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">* Based on estimated 2.9% processing rate</p>
              </Card>
            </div>

            <DataTable
              title="Payment Type Details"
              data={paymentTypeTableData}
              columns={[
                { id: 'count', label: 'Transactions', format: 'number', align: 'right', defaultVisible: true, sortable: true },
                { id: 'revenue', label: 'Revenue', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'share', label: 'Share %', format: 'percent', align: 'right', defaultVisible: true, sortable: true },
                { id: 'avgTicket', label: 'Avg Ticket', format: 'money', align: 'right', defaultVisible: true, sortable: true },
              ]}
              maxPreviewRows={10}
              showViewAll
            />
          </TabsContent>

          {/* Profit Tab */}
          <TabsContent value="profit" className="space-y-4">
            <ChartCard title="Profit Margin by Weight Class" description="Margin percentage by pet size" ariaLabel="Bar chart of profit margin by weight">
              <SimpleBarChart data={profitByWeightBarData} height={280} formatValue={formatPercent} colorScheme="green" />
            </ChartCard>

            <DataTable
              title="Profitability by Weight Class"
              data={profitTableData}
              columns={[
                { id: 'revenue', label: 'Revenue', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'appointments', label: 'Appointments', format: 'number', align: 'right', defaultVisible: true, sortable: true },
                { id: 'cogs', label: 'Est. COGS', format: 'money', align: 'right', sortable: true },
                { id: 'margin', label: 'Margin $', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'marginPercent', label: 'Margin %', format: 'percent', align: 'right', defaultVisible: true, sortable: true },
                { id: 'avgTicket', label: 'Avg Ticket', format: 'money', align: 'right', sortable: true },
              ]}
              maxPreviewRows={10}
              showViewAll
            />
          </TabsContent>

          {/* Discounts Tab */}
          <TabsContent value="discounts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Discounts Given</h3>
                <p className="text-2xl font-bold text-destructive">{formatMoney(discountData.totalDiscounts)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {discountData.discountedTransactions} transactions
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Discount Rate</h3>
                <p className="text-2xl font-bold">{discountData.discountRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  of all completed transactions
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Avg Discount Amount</h3>
                <p className="text-2xl font-bold">{formatMoney(discountData.avgDiscountAmount)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  per discounted transaction
                </p>
              </Card>
            </div>

            <ChartCard title="Average Ticket Comparison" description="With vs without discounts" ariaLabel="Bar chart comparing tickets">
              <SimpleBarChart data={discountCompareData} height={280} formatValue={formatMoney} colorScheme="blue" />
            </ChartCard>

            <Card className="p-4 bg-muted/30">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Discount Impact Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    Transactions with discounts have an average ticket of {formatMoney(discountData.avgTicketWithDiscount)}, 
                    while transactions without discounts average {formatMoney(discountData.avgTicketWithoutDiscount)}. 
                    This represents a {Math.abs(((discountData.avgTicketWithDiscount - discountData.avgTicketWithoutDiscount) / discountData.avgTicketWithoutDiscount) * 100).toFixed(1)}% 
                    {discountData.avgTicketWithDiscount < discountData.avgTicketWithoutDiscount ? ' lower' : ' higher'} ticket when discounts are applied.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </ReportShell>

      {/* Drill Drawer */}
      <DrillDrawer
        open={drillOpen}
        onClose={() => { setDrillOpen(false); setDrillRows([]); setDrillTotal(undefined) }}
        title={drillTitle}
        subtitle={drillSubtitle}
        totalValue={drillTotal}
        rows={drillRows}
        onExportCSV={handleExportDrillCSV}
        onOpenAppointment={(id) => navigate(`/appointments/${id}/edit`)}
        onOpenClient={(id) => navigate(`/clients/${id}`)}
      />

      <DefinitionsModal open={showDefinitions} onClose={() => setShowDefinitions(false)} />
    </>
  )
}
