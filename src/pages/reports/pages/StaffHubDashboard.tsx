/**
 * Staff Hub Dashboard
 * Combines staff performance, productivity, discounts, and fees into a unified view
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
  UserCircle,
  ChartBar,
  Percent,
  CurrencyDollar,
  Warning
} from '@phosphor-icons/react'
import { ReportShell } from '../components/ReportShell'
import { KPIDeck } from '../components/KPICard'
import { InsightsStrip, InsightsEmptyState } from '../components/InsightsStrip'
import { ChartCard, SimpleBarChart } from '../components/ChartCard'
import { DataTable } from '../components/DataTable'
import { DrillDrawer } from '../components/DrillDrawer'
import { DefinitionsModal } from '../components/DefinitionsModal'
import { useReportFilters } from '../hooks/useReportFilters'
import { useReportData } from '../hooks/useReportData'
import { generateInsights } from '../engine/insightsEngine'
import {
  calculateRevenuePerHour,
  calculateMarginPerHour,
  calculateStaffRebookRate,
  calculateUpsellRate,
  calculateStaffAvgTicket,
  calculateOnTimeStartPercent,
  calculateTipsPerHour,
  calculateKPIWithDelta,
  generateRevenueMarginByStaffChart,
  generateRebookRateByStaffChart,
  aggregateStaffPerformance,
  getDrillRows,
  measurePerformance,
} from '../engine/analyticsEngine'
import { DrillRow, Insight, AggregatedRow } from '../types'

export function StaffHubDashboard() {
  const navigate = useNavigate()
  const { filters, setFilters } = useReportFilters()
  const {
    appointments,
    previousAppointments,
    transactions,
    previousTransactions,
    staff,
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

  // ============ Staff Performance Data ============
  const staffPerformanceData = useMemo(() => {
    return measurePerformance('aggregateStaffPerformance', () => {
      const byStaff: Record<string, {
        name: string
        appointments: number
        hours: number
        revenue: number
        tips: number
        discounts: number
        additionalFees: number
        rebooks: number
        clients: Set<string>
      }> = {}

      appointments.filter(a => a.status === 'completed').forEach(appt => {
        const staffName = appt.groomerName || 'Unassigned'
        
        if (!byStaff[staffName]) {
          byStaff[staffName] = {
            name: staffName,
            appointments: 0,
            hours: 0,
            revenue: 0,
            tips: 0,
            discounts: 0,
            additionalFees: 0,
            rebooks: 0,
            clients: new Set(),
          }
        }
        
        byStaff[staffName].appointments += 1
        byStaff[staffName].hours += (appt.actualDurationMinutes || appt.scheduledDurationMinutes || 60) / 60
        byStaff[staffName].revenue += appt.netCents
        byStaff[staffName].tips += appt.tipCents || 0
        byStaff[staffName].discounts += appt.discountCents || 0
        byStaff[staffName].additionalFees += appt.additionalFeesCents || 0
        if (appt.rebookedWithin7d) byStaff[staffName].rebooks += 1
        byStaff[staffName].clients.add(appt.clientId)
      })

      return Object.values(byStaff).map(s => ({
        ...s,
        hours: Math.round(s.hours * 10) / 10,
        avgTicket: s.appointments > 0 ? Math.round(s.revenue / s.appointments) : 0,
        rebookRate: s.appointments > 0 ? (s.rebooks / s.appointments) * 100 : 0,
        uniqueClients: s.clients.size,
        revenuePerHour: s.hours > 0 ? Math.round(s.revenue / s.hours) : 0,
        tipsPerHour: s.hours > 0 ? Math.round(s.tips / s.hours) : 0,
        avgDiscount: s.appointments > 0 ? Math.round(s.discounts / s.appointments) : 0,
        avgFee: s.appointments > 0 ? Math.round(s.additionalFees / s.appointments) : 0,
      }))
    })
  }, [appointments])

  // ============ KPIs ============
  const kpis = useMemo(() => {
    if (appointments.length === 0) return []

    return measurePerformance('calculateStaffHubKPIs', () => {
      const currentRevPerHour = calculateRevenuePerHour(appointments, staff)
      const previousRevPerHour = calculateRevenuePerHour(previousAppointments, staff)

      const currentRebook = calculateStaffRebookRate(appointments)
      const previousRebook = calculateStaffRebookRate(previousAppointments)

      const currentAvgTicket = calculateStaffAvgTicket(appointments)
      const previousAvgTicket = calculateStaffAvgTicket(previousAppointments)

      const currentTipsPerHour = calculateTipsPerHour(appointments, staff)
      const previousTipsPerHour = calculateTipsPerHour(previousAppointments, staff)

      const totalDiscounts = staffPerformanceData.reduce((sum, s) => sum + s.discounts, 0)
      const totalFees = staffPerformanceData.reduce((sum, s) => sum + s.additionalFees, 0)

      return [
        { metricId: 'revenuePerHour', value: calculateKPIWithDelta(currentRevPerHour, previousRevPerHour, 'money') },
        { metricId: 'staffAvgTicket', value: calculateKPIWithDelta(currentAvgTicket, previousAvgTicket, 'money') },
        { metricId: 'staffRebookRate', value: calculateKPIWithDelta(currentRebook, previousRebook, 'percent') },
        { metricId: 'tipsPerHour', value: calculateKPIWithDelta(currentTipsPerHour, previousTipsPerHour, 'money') },
        { metricId: 'totalDiscounts', value: calculateKPIWithDelta(totalDiscounts, 0, 'money') },
        { metricId: 'totalFees', value: calculateKPIWithDelta(totalFees, 0, 'money') },
      ]
    })
  }, [appointments, previousAppointments, staff, staffPerformanceData])

  // ============ Insights ============
  const insights = useMemo(() => {
    if (appointments.length === 0) return []
    return measurePerformance('generateStaffInsights', () =>
      generateInsights({
        appointments,
        previousAppointments,
        transactions,
        previousTransactions,
        inventoryItems: [],
        messages: [],
        filters,
      }).filter(i => ['staff', 'performance', 'productivity', 'standout'].some(k => i.category.includes(k)))
    )
  }, [appointments, previousAppointments, transactions, previousTransactions, filters])

  // ============ Charts ============
  const revenueByStaffData = useMemo(() => {
    return staffPerformanceData
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map(s => ({
        label: s.name.length > 12 ? s.name.substring(0, 10) + '...' : s.name,
        value: s.revenue,
      }))
  }, [staffPerformanceData])

  const rebookByStaffData = useMemo(() => {
    return staffPerformanceData
      .sort((a, b) => b.rebookRate - a.rebookRate)
      .map(s => ({
        label: s.name.length > 12 ? s.name.substring(0, 10) + '...' : s.name,
        value: s.rebookRate,
      }))
  }, [staffPerformanceData])

  const avgTicketByStaffData = useMemo(() => {
    return staffPerformanceData
      .sort((a, b) => b.avgTicket - a.avgTicket)
      .map(s => ({
        label: s.name.length > 12 ? s.name.substring(0, 10) + '...' : s.name,
        value: s.avgTicket,
      }))
  }, [staffPerformanceData])

  const discountsByStaffData = useMemo(() => {
    return staffPerformanceData
      .filter(s => s.discounts > 0)
      .sort((a, b) => b.discounts - a.discounts)
      .map(s => ({
        label: s.name.length > 12 ? s.name.substring(0, 10) + '...' : s.name,
        value: s.discounts,
      }))
  }, [staffPerformanceData])

  const feesByStaffData = useMemo(() => {
    return staffPerformanceData
      .filter(s => s.additionalFees > 0)
      .sort((a, b) => b.additionalFees - a.additionalFees)
      .map(s => ({
        label: s.name.length > 12 ? s.name.substring(0, 10) + '...' : s.name,
        value: s.additionalFees,
      }))
  }, [staffPerformanceData])

  // ============ Tables ============
  const performanceTableData = useMemo(() => {
    return staffPerformanceData
      .sort((a, b) => b.revenue - a.revenue)
      .map(s => ({
        dimensionValue: s.name,
        drillKey: `staff:${s.name}`,
        metrics: {
          appointments: s.appointments,
          hours: s.hours,
          revenue: s.revenue,
          tips: s.tips,
          avgTicket: s.avgTicket,
          rebookRate: s.rebookRate,
          uniqueClients: s.uniqueClients,
          revenuePerHour: s.revenuePerHour,
        },
      }))
  }, [staffPerformanceData])

  const discountsTableData = useMemo(() => {
    return staffPerformanceData
      .filter(s => s.discounts > 0)
      .sort((a, b) => b.discounts - a.discounts)
      .map(s => ({
        dimensionValue: s.name,
        drillKey: `staff:${s.name}`,
        metrics: {
          discounts: s.discounts,
          appointments: s.appointments,
          avgDiscount: s.avgDiscount,
          discountRate: s.revenue > 0 ? (s.discounts / (s.revenue + s.discounts)) * 100 : 0,
          revenue: s.revenue,
        },
      }))
  }, [staffPerformanceData])

  const feesTableData = useMemo(() => {
    return staffPerformanceData
      .filter(s => s.additionalFees > 0)
      .sort((a, b) => b.additionalFees - a.additionalFees)
      .map(s => ({
        dimensionValue: s.name,
        drillKey: `staff:${s.name}`,
        metrics: {
          fees: s.additionalFees,
          appointments: s.appointments,
          avgFee: s.avgFee,
          feeRate: s.appointments > 0 ? (s.additionalFees / s.appointments) : 0,
        },
      }))
  }, [staffPerformanceData])

  // ============ Drill Handlers ============
  const handleRowDrill = useCallback((row: AggregatedRow) => {
    const rows = getDrillRows(appointments, transactions, row.drillKey)
    setDrillTitle(row.dimensionValue)
    setDrillSubtitle(`${rows.length} appointments`)
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

  const handleChartDrill = useCallback((dataPoint: { label: string; value: number }) => {
    const rows = getDrillRows(appointments, transactions, `staff:${dataPoint.label}`)
    setDrillTitle(dataPoint.label)
    setDrillSubtitle('Staff breakdown')
    setDrillRows(rows)
    setDrillTotal({ label: 'Value', value: dataPoint.value, format: 'money' })
    setDrillOpen(true)
  }, [appointments, transactions])

  const handleExportDrillCSV = useCallback(() => {
    if (drillRows.length === 0) return
    const headers = ['Date', 'Client', 'Service', 'Duration', 'Revenue', 'Tip', 'Rating']
    const rows = drillRows.map(r => {
      const d = r.data as any
      return [d.serviceDate || '', d.clientName || '', d.services?.[0]?.name || '', d.actualDurationMinutes || '', ((d.netCents || 0) / 100).toFixed(2), ((d.tipCents || 0) / 100).toFixed(2), d.rating || '']
    })
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `staff-drill-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [drillRows])

  // ============ Handlers ============
  const formatMoney = (v: number) => `$${(v / 100).toLocaleString()}`
  const formatPercent = (v: number) => `${v.toFixed(1)}%`

  // ============ Loading State ============
  if (isLoading) {
    return (
      <ReportShell title="Staff Hub" description="Team performance, productivity, and compensation analytics" defaultTimeBasis="checkout">
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
      <ReportShell title="Staff Hub" description="Team performance, productivity, and compensation analytics" defaultTimeBasis="checkout">
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
      <ReportShell title="Staff Hub" description="Team performance, productivity, and compensation analytics" defaultTimeBasis="checkout">
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
        title="Staff Hub"
        description="Team performance, productivity, and compensation analytics"
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
              <ChartBar size={16} weight="duotone" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <UserCircle size={16} weight="duotone" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="discounts" className="flex items-center gap-2">
              <Percent size={16} weight="duotone" />
              <span className="hidden sm:inline">Discounts</span>
            </TabsTrigger>
            <TabsTrigger value="fees" className="flex items-center gap-2">
              <CurrencyDollar size={16} weight="duotone" />
              <span className="hidden sm:inline">Fees</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Revenue by Team Member" description="Total revenue generated" ariaLabel="Bar chart of revenue by staff">
                <SimpleBarChart data={revenueByStaffData} height={280} formatValue={formatMoney} onClick={handleChartDrill} />
              </ChartCard>

              <ChartCard title="Rebook Rate by Staff" description="Client retention per groomer" ariaLabel="Bar chart of rebook rate by staff">
                <SimpleBarChart data={rebookByStaffData} height={280} formatValue={formatPercent} colorScheme="green" />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Average Ticket by Staff" description="Avg revenue per appointment" ariaLabel="Bar chart of avg ticket by staff">
                <SimpleBarChart data={avgTicketByStaffData} height={280} formatValue={formatMoney} colorScheme="blue" />
              </ChartCard>

              <Card className="p-4">
                <h3 className="font-semibold mb-4">Team Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Total Team Members</span>
                    <span className="font-semibold">{staffPerformanceData.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Total Appointments</span>
                    <span className="font-semibold">{staffPerformanceData.reduce((sum, s) => sum + s.appointments, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Total Hours Worked</span>
                    <span className="font-semibold">{staffPerformanceData.reduce((sum, s) => sum + s.hours, 0).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Total Revenue</span>
                    <span className="font-semibold">{formatMoney(staffPerformanceData.reduce((sum, s) => sum + s.revenue, 0))}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Total Tips</span>
                    <span className="font-semibold">{formatMoney(staffPerformanceData.reduce((sum, s) => sum + s.tips, 0))}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Revenue by Staff" description="Total revenue comparison" ariaLabel="Bar chart of revenue">
                <SimpleBarChart data={revenueByStaffData} height={280} formatValue={formatMoney} onClick={handleChartDrill} />
              </ChartCard>

              <ChartCard title="Rebook Rate" description="Client retention performance" ariaLabel="Bar chart of rebook rate">
                <SimpleBarChart data={rebookByStaffData} height={280} formatValue={formatPercent} colorScheme="green" />
              </ChartCard>
            </div>

            <DataTable
              title="Staff Performance Details"
              data={performanceTableData}
              columns={[
                { id: 'appointments', label: 'Appts', format: 'number', align: 'right', defaultVisible: true, sortable: true },
                { id: 'hours', label: 'Hours', format: 'number', align: 'right', defaultVisible: true, sortable: true },
                { id: 'revenue', label: 'Revenue', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'tips', label: 'Tips', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'avgTicket', label: 'Avg Ticket', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'rebookRate', label: 'Rebook %', format: 'percent', align: 'right', defaultVisible: true, sortable: true },
                { id: 'uniqueClients', label: 'Clients', format: 'number', align: 'right', sortable: true },
                { id: 'revenuePerHour', label: '$/Hour', format: 'money', align: 'right', sortable: true },
              ]}
              onRowClick={handleRowDrill}
              maxPreviewRows={15}
              showViewAll
            />
          </TabsContent>

          {/* Discounts Tab */}
          <TabsContent value="discounts" className="space-y-4">
            {discountsByStaffData.length === 0 ? (
              <Card className="p-8 text-center">
                <Info size={48} className="mx-auto text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold mb-2">No Discounts Recorded</h2>
                <p className="text-muted-foreground">No discounts were applied during the selected period.</p>
              </Card>
            ) : (
              <>
                <ChartCard title="Discounts by Staff" description="Total discounts given" ariaLabel="Bar chart of discounts">
                  <SimpleBarChart data={discountsByStaffData} height={280} formatValue={formatMoney} colorScheme="blue" />
                </ChartCard>

                <DataTable
                  title="Discount Details by Staff"
                  data={discountsTableData}
                  columns={[
                    { id: 'discounts', label: 'Total Discounts', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                    { id: 'appointments', label: 'Appointments', format: 'number', align: 'right', defaultVisible: true, sortable: true },
                    { id: 'avgDiscount', label: 'Avg Discount', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                    { id: 'discountRate', label: 'Discount Rate', format: 'percent', align: 'right', sortable: true },
                    { id: 'revenue', label: 'Revenue', format: 'money', align: 'right', sortable: true },
                  ]}
                  maxPreviewRows={10}
                  showViewAll
                />
              </>
            )}
          </TabsContent>

          {/* Fees Tab */}
          <TabsContent value="fees" className="space-y-4">
            {feesByStaffData.length === 0 ? (
              <Card className="p-8 text-center">
                <Info size={48} className="mx-auto text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold mb-2">No Additional Fees Recorded</h2>
                <p className="text-muted-foreground">No additional fees were charged during the selected period.</p>
              </Card>
            ) : (
              <>
                <ChartCard title="Additional Fees by Staff" description="Total fees collected" ariaLabel="Bar chart of fees">
                  <SimpleBarChart data={feesByStaffData} height={280} formatValue={formatMoney} colorScheme="green" />
                </ChartCard>

                <DataTable
                  title="Fee Details by Staff"
                  data={feesTableData}
                  columns={[
                    { id: 'fees', label: 'Total Fees', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                    { id: 'appointments', label: 'Appointments', format: 'number', align: 'right', defaultVisible: true, sortable: true },
                    { id: 'avgFee', label: 'Avg Fee', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                    { id: 'feeRate', label: 'Fee Rate', format: 'percent', align: 'right', sortable: true },
                  ]}
                  maxPreviewRows={10}
                  showViewAll
                />
              </>
            )}
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
