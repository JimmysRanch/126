/**
 * Tips & Gratuities Report - Production Ready
 * Tip collection and distribution tracking
 */

import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Warning, ArrowsClockwise, Info } from '@phosphor-icons/react'
import { ReportShell } from '../components/ReportShell'
import { KPIDeck } from '../components/KPICard'
import { InsightsStrip, InsightsEmptyState } from '../components/InsightsStrip'
import { ChartCard, SimpleBarChart, SimpleLineChart } from '../components/ChartCard'
import { DataTable } from '../components/DataTable'
import { DrillDrawer } from '../components/DrillDrawer'
import { DefinitionsModal } from '../components/DefinitionsModal'
import { SaveViewDialog, ScheduleDialog, SavedViewsList } from '../components/SavedViewsManager'
import { useReportFilters } from '../hooks/useReportFilters'
import { useReportData, useSavedViews, useReportSchedules } from '../hooks/useReportData'
import { generateInsights } from '../engine/insightsEngine'
import {
  calculateTotalTips,
  calculateAvgTipPercent,
  calculateTipFeeCost,
  calculateNetToStaff,
  calculateKPIWithDelta,
  generateTipPercentByServiceChart,
  generateTipPercentByStaffChart,
  generateTipTrendChart,
  aggregateTipsBreakdown,
  getDrillRows,
  measurePerformance,
} from '../engine/analyticsEngine'
import { DrillRow, Insight, AggregatedRow, SavedView } from '../types'

export function TipsGratuities() {
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
  const { savedViews, saveView, getView } = useSavedViews()
  const { createSchedule, markRun } = useReportSchedules()

  // UI State
  const [showDefinitions, setShowDefinitions] = useState(false)
  const [showSaveView, setShowSaveView] = useState(false)
  const [showSavedViews, setShowSavedViews] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [drillOpen, setDrillOpen] = useState(false)
  const [drillTitle, setDrillTitle] = useState('')
  const [drillSubtitle, setDrillSubtitle] = useState<string | undefined>()
  const [drillRows, setDrillRows] = useState<DrillRow[]>([])
  const [drillTotal, setDrillTotal] = useState<{ label: string; value: number; format: 'money' | 'percent' | 'number' } | undefined>()
  const [groupBy, setGroupBy] = useState<string>('staff')
  const [compareMode, setCompareMode] = useState(false)

  // Calculate KPIs
  const kpis = useMemo(() => {
    if (appointments.length === 0) return []

    return measurePerformance('calculateTipsKPIs', () => {
      const currentTotalTips = calculateTotalTips(appointments)
      const previousTotalTips = calculateTotalTips(previousAppointments)

      const currentAvgTipPercent = calculateAvgTipPercent(appointments)
      const previousAvgTipPercent = calculateAvgTipPercent(previousAppointments)

      const currentTipFeeCost = calculateTipFeeCost(transactions)
      const previousTipFeeCost = calculateTipFeeCost(previousTransactions)

      const currentNetToStaff = calculateNetToStaff(appointments, transactions, staff)
      const previousNetToStaff = calculateNetToStaff(previousAppointments, previousTransactions, staff)

      return [
        { metricId: 'totalTips', value: calculateKPIWithDelta(currentTotalTips, previousTotalTips, 'money') },
        { metricId: 'avgTipPercent', value: calculateKPIWithDelta(currentAvgTipPercent, previousAvgTipPercent, 'percent') },
        { metricId: 'tipFeeCost', value: calculateKPIWithDelta(currentTipFeeCost, previousTipFeeCost, 'money') },
        { metricId: 'netToStaff', value: calculateKPIWithDelta(currentNetToStaff, previousNetToStaff, 'money') },
      ]
    })
  }, [appointments, previousAppointments, transactions, previousTransactions, staff])

  // Generate insights
  const insights = useMemo(() => {
    if (appointments.length === 0) return []
    return measurePerformance('generateTipsInsights', () =>
      generateInsights({
        appointments,
        previousAppointments,
        transactions,
        previousTransactions,
        inventoryItems: [],
        messages: [],
        filters,
      }).filter(i => ['tip', 'gratuity'].some(k => i.category.includes(k)))
    )
  }, [appointments, previousAppointments, transactions, previousTransactions, filters])

  // Chart data
  const tipByServiceData = useMemo(() => {
    if (appointments.length === 0) return []
    return measurePerformance('generateTipByService', () =>
      generateTipPercentByServiceChart(appointments)
    )
  }, [appointments])

  const tipByStaffData = useMemo(() => {
    if (appointments.length === 0) return []
    return measurePerformance('generateTipByStaff', () =>
      generateTipPercentByStaffChart(appointments, staff)
    )
  }, [appointments, staff])

  const tipTrendData = useMemo(() => {
    if (appointments.length === 0) return []
    return measurePerformance('generateTipTrend', () =>
      generateTipTrendChart(appointments, filters)
    )
  }, [appointments, filters])

  // Table data
  const tableData = useMemo(() => {
    if (appointments.length === 0) return []
    return measurePerformance('aggregateTipsTable', () =>
      aggregateTipsBreakdown(appointments, transactions, staff, groupBy as any)
    )
  }, [appointments, transactions, staff, groupBy])

  // Drill handlers
  const handleKPIDrill = useCallback((metricId: string, value: number) => {
    const rows: DrillRow[] = appointments
      .filter(a => a.status === 'completed' && (a.tipCents || 0) > 0)
      .map(a => ({ id: a.id, type: 'appointment' as const, data: a, timestamp: a.serviceDate }))

    const labels: Record<string, string> = {
      totalTips: 'Total Tips',
      avgTipPercent: 'Average Tip %',
      tipFeeCost: 'Tip Processing Fees',
      netToStaff: 'Net to Staff',
    }

    setDrillTitle(`${labels[metricId] || metricId} Details`)
    setDrillSubtitle(`${rows.length} appointments with tips`)
    setDrillRows(rows)
    setDrillTotal({ label: labels[metricId] || 'Value', value, format: metricId.includes('Percent') ? 'percent' : 'money' })
    setDrillOpen(true)
  }, [appointments])

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

  const handleRowDrill = useCallback((row: AggregatedRow) => {
    const rows = getDrillRows(appointments, transactions, row.drillKey)
    setDrillTitle(row.dimensionValue)
    setDrillSubtitle(`${rows.length} appointments`)
    setDrillRows(rows)
    setDrillTotal({ label: 'Tips', value: row.metrics.tips || 0, format: 'money' })
    setDrillOpen(true)
  }, [appointments, transactions])

  const handleChartDrill = useCallback((dataPoint: { label: string; value: number }) => {
    const dimension = groupBy === 'staff' ? 'staff' : 'service'
    const rows = getDrillRows(appointments, transactions, `${dimension}:${dataPoint.label}`)
    setDrillTitle(dataPoint.label)
    setDrillSubtitle('Tip breakdown')
    setDrillRows(rows)
    setDrillTotal({ label: 'Avg Tip %', value: dataPoint.value, format: 'percent' })
    setDrillOpen(true)
  }, [appointments, transactions, groupBy])

  // Save/Export handlers
  const handleSaveView = useCallback((name: string) => {
    saveView({ name, reportType: 'tips-gratuities', filters, groupBy, compareEnabled: compareMode })
  }, [saveView, filters, groupBy, compareMode])

  const handleApplyView = useCallback((view: SavedView) => {
    setFilters(view.filters)
    if (view.groupBy) setGroupBy(view.groupBy)
    if (view.compareEnabled !== undefined) setCompareMode(view.compareEnabled)
    setShowSavedViews(false)
  }, [setFilters])

  const handleExportCSV = useCallback(() => {
    const headers = ['Dimension', 'Total Tips', 'Appts with Tips', 'Avg Tip', 'Avg Tip %', 'Tip Fee', 'Net to Staff']
    const rows = tableData.map(row => [
      row.dimensionValue,
      ((row.metrics.tips || 0) / 100).toFixed(2),
      row.metrics.tippedAppointments || 0,
      ((row.metrics.avgTip || 0) / 100).toFixed(2),
      (row.metrics.avgTipPercent || 0).toFixed(1),
      ((row.metrics.tipFee || 0) / 100).toFixed(2),
      ((row.metrics.netToStaff || 0) / 100).toFixed(2),
    ])
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tips-gratuities-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [tableData])

  const handleExportDrillCSV = useCallback(() => {
    if (drillRows.length === 0) return
    const headers = ['Date', 'Client', 'Groomer', 'Service', 'Revenue', 'Tip', 'Tip %']
    const rows = drillRows.map(r => {
      const d = r.data as any
      const revenue = d.netCents || 0
      const tip = d.tipCents || 0
      const tipPct = revenue > 0 ? (tip / revenue * 100) : 0
      return [d.serviceDate || '', d.clientName || '', d.groomerName || '', d.services?.[0]?.name || '', (revenue / 100).toFixed(2), (tip / 100).toFixed(2), tipPct.toFixed(1)]
    })
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tips-drill-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [drillRows])

  const formatMoney = (v: number) => `$${(v / 100).toLocaleString()}`
  const formatPercent = (v: number) => `${v.toFixed(1)}%`

  // Loading
  if (isLoading) {
    return (
      <ReportShell title="Tips & Gratuities" description="Tip tracking" defaultTimeBasis="checkout">
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-3"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-8 w-24" /></Card>
            ))}
          </div>
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
          <Skeleton className="h-[400px]" />
        </div>
      </ReportShell>
    )
  }

  // Error
  if (error) {
    return (
      <ReportShell title="Tips & Gratuities" description="Tip tracking" defaultTimeBasis="checkout">
        <Alert variant="destructive">
          <Warning className="h-4 w-4" />
          <AlertDescription>Failed to load tip data.</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          <ArrowsClockwise className="mr-2 h-4 w-4" /> Retry
        </Button>
      </ReportShell>
    )
  }

  // Empty
  if (appointments.length === 0) {
    return (
      <ReportShell title="Tips & Gratuities" description="Tip tracking" defaultTimeBasis="checkout" onShowDefinitions={() => setShowDefinitions(true)}>
        <Card className="p-8 text-center">
          <Info size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No Tip Data</h2>
          <p className="text-muted-foreground mb-4">No completed appointments with tips found for the selected filters.</p>
          <Button variant="outline" onClick={() => setFilters({ ...filters, dateRange: 'last90' })}>Try Last 90 Days</Button>
        </Card>
        <DefinitionsModal open={showDefinitions} onClose={() => setShowDefinitions(false)} />
      </ReportShell>
    )
  }

  return (
    <>
      <ReportShell
        title="Tips & Gratuities"
        description="Tip collection and distribution tracking"
        defaultTimeBasis="checkout"
        onSaveView={() => setShowSaveView(true)}
        onSchedule={() => setShowSchedule(true)}
        onExport={handleExportCSV}
        onShowDefinitions={() => setShowDefinitions(true)}
      >
        {/* KPI Deck */}
        <KPIDeck metrics={kpis.map(kpi => ({ ...kpi, onClick: () => handleKPIDrill(kpi.metricId, kpi.value.current) }))} />

        {/* Insights */}
        {insights.length > 0 ? (
          <InsightsStrip insights={insights} onInsightClick={handleInsightClick} />
        ) : (
          <InsightsEmptyState />
        )}

        {/* Tip Trend Chart */}
        <ChartCard title="Tip Trend" description="Tips collected over time" ariaLabel="Line chart of tips over time">
          <SimpleLineChart 
            data={tipTrendData} 
            height={200} 
            formatValue={formatMoney}
            showArea
          />
        </ChartCard>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Tip % by Service" description="Average tip percentage by service type" ariaLabel="Bar chart of tip percent by service">
            <SimpleBarChart 
              data={tipByServiceData} 
              height={280} 
              formatValue={formatPercent}
              onClick={handleChartDrill}
              colorScheme="green"
            />
          </ChartCard>

          <ChartCard title="Tip % by Staff" description="Average tip percentage by groomer" ariaLabel="Bar chart of tip percent by staff">
            <SimpleBarChart 
              data={tipByStaffData} 
              height={280} 
              formatValue={formatPercent}
              onClick={handleChartDrill}
              colorScheme="blue"
            />
          </ChartCard>
        </div>

        {/* Data Table */}
        <DataTable
          title="Tips Breakdown"
          data={tableData}
          groupByOptions={[
            { value: 'staff', label: 'By Staff' },
            { value: 'service', label: 'By Service' },
            { value: 'day', label: 'By Day' },
            { value: 'week', label: 'By Week' },
            { value: 'paymentMethod', label: 'By Payment Method' },
          ]}
          selectedGroupBy={groupBy}
          onGroupByChange={setGroupBy}
          columns={[
            { id: 'tips', label: 'Total Tips', format: 'money', align: 'right', defaultVisible: true, sortable: true },
            { id: 'tippedAppointments', label: 'Appts w/ Tips', format: 'number', align: 'right', defaultVisible: true, sortable: true },
            { id: 'avgTip', label: 'Avg Tip', format: 'money', align: 'right', defaultVisible: true, sortable: true },
            { id: 'avgTipPercent', label: 'Avg Tip %', format: 'percent', align: 'right', defaultVisible: true, sortable: true },
            { id: 'tipFee', label: 'Tip Fee', format: 'money', align: 'right', sortable: true },
            { id: 'netToStaff', label: 'Net to Staff', format: 'money', align: 'right', defaultVisible: true, sortable: true },
          ]}
          onRowClick={handleRowDrill}
          onExport={handleExportCSV}
          maxPreviewRows={10}
          showViewAll
        />
      </ReportShell>

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
      <SaveViewDialog open={showSaveView} onClose={() => setShowSaveView(false)} reportType="tips-gratuities" filters={filters} groupBy={groupBy} compareEnabled={compareMode} onSave={handleSaveView} />
      <SavedViewsList open={showSavedViews} onClose={() => setShowSavedViews(false)} onApply={handleApplyView} />
      <ScheduleDialog open={showSchedule} onClose={() => setShowSchedule(false)} savedViews={savedViews as SavedView[]} onSchedule={(c) => createSchedule(c)} onRunNow={(id) => { const v = getView(id); if (v) { markRun(id); handleExportCSV() } }} />
    </>
  )
}
