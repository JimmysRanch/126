/**
 * Marketing & Messaging ROI Report - Production Ready
 * Campaign performance and messaging effectiveness tracking
 */

import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Warning, ArrowsClockwise, Info, EnvelopeSimple } from '@phosphor-icons/react'
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
  calculateMessagesSent,
  calculateConfirmations,
  calculateAttributedShowUps,
  calculateCostPerShowUp,
  calculateAttributedRevenue,
  calculateMessagingROI,
  calculateKPIWithDelta,
  generateROIByChannelChart,
  generateConfirmationLiftChart,
  aggregateCampaignMetrics,
  getDrillRows,
  measurePerformance,
} from '../engine/analyticsEngine'
import { DrillRow, Insight, AggregatedRow, SavedView } from '../types'

export function MarketingROI() {
  const navigate = useNavigate()
  const { filters, setFilters } = useReportFilters()
  const {
    appointments,
    previousAppointments,
    transactions,
    messages,
    previousMessages,
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
  const [compareMode, setCompareMode] = useState(false)

  // Attribution window config (configurable)
  const attributionConfig = {
    lastTouchDays: 7,
    confirmationHours: 48,
  }

  // Calculate KPIs
  const kpis = useMemo(() => {
    if (messages.length === 0) return []

    return measurePerformance('calculateMarketingKPIs', () => {
      const currentSent = calculateMessagesSent(messages)
      const previousSent = calculateMessagesSent(previousMessages)

      const currentConfirmations = calculateConfirmations(messages, appointments)
      const previousConfirmations = calculateConfirmations(previousMessages, previousAppointments)

      const currentShowUps = calculateAttributedShowUps(messages, appointments, attributionConfig)
      const previousShowUps = calculateAttributedShowUps(previousMessages, previousAppointments, attributionConfig)

      const currentCostPerShowUp = calculateCostPerShowUp(messages, appointments, attributionConfig)
      const previousCostPerShowUp = calculateCostPerShowUp(previousMessages, previousAppointments, attributionConfig)

      const currentRevenue = calculateAttributedRevenue(messages, appointments, attributionConfig)
      const previousRevenue = calculateAttributedRevenue(previousMessages, previousAppointments, attributionConfig)

      const currentROI = calculateMessagingROI(messages, appointments, attributionConfig)
      const previousROI = calculateMessagingROI(previousMessages, previousAppointments, attributionConfig)

      return [
        { metricId: 'messagesSent', value: calculateKPIWithDelta(currentSent, previousSent, 'number') },
        { metricId: 'confirmations', value: calculateKPIWithDelta(currentConfirmations, previousConfirmations, 'number') },
        { metricId: 'attributedShowUps', value: calculateKPIWithDelta(currentShowUps, previousShowUps, 'number') },
        { metricId: 'costPerShowUp', value: calculateKPIWithDelta(currentCostPerShowUp, previousCostPerShowUp, 'money') },
        { metricId: 'attributedRevenue', value: calculateKPIWithDelta(currentRevenue, previousRevenue, 'money') },
        { metricId: 'messagingROI', value: calculateKPIWithDelta(currentROI, previousROI, 'percent') },
      ]
    })
  }, [messages, previousMessages, appointments, previousAppointments, attributionConfig])

  // Generate insights
  const insights = useMemo(() => {
    if (messages.length === 0) return []
    return measurePerformance('generateMarketingInsights', () =>
      generateInsights({
        appointments,
        previousAppointments,
        transactions,
        previousTransactions: [],
        inventoryItems: [],
        messages,
        filters,
      }).filter(i => ['marketing', 'campaign', 'roi', 'message', 'confirmation'].some(k => i.category.includes(k)))
    )
  }, [appointments, previousAppointments, transactions, messages, filters])

  // Chart data
  const roiByChannelData = useMemo(() => {
    if (messages.length === 0) return []
    return measurePerformance('generateROIByChannel', () =>
      generateROIByChannelChart(messages, appointments, attributionConfig)
    )
  }, [messages, appointments, attributionConfig])

  const confirmationLiftData = useMemo(() => {
    if (messages.length === 0) return []
    return measurePerformance('generateConfirmationLift', () =>
      generateConfirmationLiftChart(messages, appointments)
    )
  }, [messages, appointments])

  // Table data
  const tableData = useMemo(() => {
    if (messages.length === 0) return []
    return measurePerformance('aggregateCampaignTable', () =>
      aggregateCampaignMetrics(messages, appointments, attributionConfig)
    )
  }, [messages, appointments, attributionConfig])

  // Drill handlers
  const handleKPIDrill = useCallback((metricId: string, value: number) => {
    let rows: DrillRow[] = []
    let title = ''

    switch (metricId) {
      case 'messagesSent':
        rows = messages.map(m => ({ id: m.id, type: 'message' as const, data: m, timestamp: m.sentAt }))
        title = 'Messages Sent'
        break
      case 'confirmations':
        rows = messages.filter(m => m.confirmed).map(m => ({ id: m.id, type: 'message' as const, data: m, timestamp: m.sentAt }))
        title = 'Confirmed Messages'
        break
      case 'attributedShowUps':
        rows = appointments.filter(a => a.status === 'completed' && a.messageAttributed).map(a => ({ id: a.id, type: 'appointment' as const, data: a, timestamp: a.serviceDate }))
        title = 'Attributed Show-ups'
        break
      default:
        rows = messages.map(m => ({ id: m.id, type: 'message' as const, data: m, timestamp: m.sentAt }))
        title = 'Messages'
    }

    setDrillTitle(title)
    setDrillSubtitle(`${rows.length} items`)
    setDrillRows(rows)
    setDrillTotal({ label: title, value, format: metricId.includes('Revenue') || metricId.includes('cost') ? 'money' : metricId.includes('ROI') ? 'percent' : 'number' })
    setDrillOpen(true)
  }, [messages, appointments])

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
    const campaignMessages = messages.filter(m => m.campaignName === row.dimensionValue)
    const rows = campaignMessages.map(m => ({ id: m.id, type: 'message' as const, data: m, timestamp: m.sentAt }))
    setDrillTitle(row.dimensionValue)
    setDrillSubtitle(`${rows.length} messages`)
    setDrillRows(rows)
    setDrillTotal({ label: 'ROI', value: row.metrics.roi || 0, format: 'percent' })
    setDrillOpen(true)
  }, [messages])

  const handleChartDrill = useCallback((dataPoint: { label: string; value: number }) => {
    const channelMessages = messages.filter(m => m.channel === dataPoint.label)
    const rows = channelMessages.map(m => ({ id: m.id, type: 'message' as const, data: m, timestamp: m.sentAt }))
    setDrillTitle(`${dataPoint.label} Channel`)
    setDrillSubtitle(`${rows.length} messages`)
    setDrillRows(rows)
    setDrillTotal({ label: 'ROI', value: dataPoint.value, format: 'percent' })
    setDrillOpen(true)
  }, [messages])

  // Save/Export handlers
  const handleSaveView = useCallback((name: string) => {
    saveView({ name, reportType: 'marketing-roi', filters, compareEnabled: compareMode })
  }, [saveView, filters, compareMode])

  const handleApplyView = useCallback((view: SavedView) => {
    setFilters(view.filters)
    if (view.compareEnabled !== undefined) setCompareMode(view.compareEnabled)
    setShowSavedViews(false)
  }, [setFilters])

  const handleExportCSV = useCallback(() => {
    const headers = ['Campaign', 'Sent', 'Delivered', 'Opened', 'Confirmations', 'Show-ups', 'Revenue', 'Cost', 'ROI', 'Opt-out %']
    const rows = tableData.map(row => [
      row.dimensionValue,
      row.metrics.sent || 0,
      row.metrics.delivered || 0,
      row.metrics.opened || 0,
      row.metrics.confirmations || 0,
      row.metrics.showUps || 0,
      ((row.metrics.revenue || 0) / 100).toFixed(2),
      ((row.metrics.cost || 0) / 100).toFixed(2),
      (row.metrics.roi || 0).toFixed(1),
      (row.metrics.optOutPercent || 0).toFixed(2),
    ])
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `marketing-roi-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [tableData])

  const handleExportDrillCSV = useCallback(() => {
    if (drillRows.length === 0) return
    const headers = drillRows[0]?.type === 'message' 
      ? ['Sent At', 'Channel', 'Recipient', 'Campaign', 'Confirmed', 'Status']
      : ['Date', 'Client', 'Service', 'Revenue', 'Attributed']
    const rows = drillRows.map(r => {
      const d = r.data as any
      if (r.type === 'message') {
        return [d.sentAt || '', d.channel || '', d.recipientName || '', d.campaignName || '', d.confirmed ? 'Yes' : 'No', d.status || '']
      }
      return [d.serviceDate || '', d.clientName || '', d.services?.[0]?.name || '', ((d.netCents || 0) / 100).toFixed(2), d.messageAttributed ? 'Yes' : 'No']
    })
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `marketing-drill-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [drillRows])

  const formatPercent = (v: number) => `${v.toFixed(1)}%`
  const formatMoney = (v: number) => `$${(v / 100).toLocaleString()}`

  // Loading
  if (isLoading) {
    return (
      <ReportShell title="Marketing & Messaging ROI" description="Campaign performance" defaultTimeBasis="service">
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
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
      <ReportShell title="Marketing & Messaging ROI" description="Campaign performance" defaultTimeBasis="service">
        <Alert variant="destructive">
          <Warning className="h-4 w-4" />
          <AlertDescription>Failed to load marketing data.</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          <ArrowsClockwise className="mr-2 h-4 w-4" /> Retry
        </Button>
      </ReportShell>
    )
  }

  // Empty
  if (messages.length === 0) {
    return (
      <ReportShell title="Marketing & Messaging ROI" description="Campaign performance" defaultTimeBasis="service" onShowDefinitions={() => setShowDefinitions(true)}>
        <Card className="p-8 text-center">
          <EnvelopeSimple size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No Messaging Data</h2>
          <p className="text-muted-foreground mb-4">No messages or campaigns found for the selected period.</p>
          <Button variant="outline" onClick={() => setFilters({ ...filters, dateRange: 'last90' })}>Try Last 90 Days</Button>
        </Card>
        <DefinitionsModal open={showDefinitions} onClose={() => setShowDefinitions(false)} />
      </ReportShell>
    )
  }

  return (
    <>
      <ReportShell
        title="Marketing & Messaging ROI"
        description="Campaign performance and messaging effectiveness"
        defaultTimeBasis="service"
        onSaveView={() => setShowSaveView(true)}
        onSchedule={() => setShowSchedule(true)}
        onExport={handleExportCSV}
        onShowDefinitions={() => setShowDefinitions(true)}
      >
        {/* Attribution info */}
        <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <span className="font-medium">Attribution: </span>
            Last-touch within {attributionConfig.lastTouchDays} days OR confirmation within {attributionConfig.confirmationHours} hours
          </AlertDescription>
        </Alert>

        {/* KPI Deck */}
        <KPIDeck metrics={kpis.map(kpi => ({ ...kpi, onClick: () => handleKPIDrill(kpi.metricId, kpi.value.current) }))} />

        {/* Insights */}
        {insights.length > 0 ? (
          <InsightsStrip insights={insights} onInsightClick={handleInsightClick} />
        ) : (
          <InsightsEmptyState />
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="ROI by Channel/Segment" description="Return on investment by messaging channel" ariaLabel="Bar chart of ROI by channel">
            <SimpleBarChart 
              data={roiByChannelData} 
              height={280} 
              formatValue={formatPercent}
              onClick={handleChartDrill}
              colorScheme="green"
            />
          </ChartCard>

          <ChartCard 
            title="Confirmation Lift vs Control" 
            description="Show-up rate improvement from confirmations"
            ariaLabel="Bar chart comparing confirmed vs unconfirmed show-up rates"
          >
            {confirmationLiftData.length > 0 ? (
              <SimpleBarChart 
                data={confirmationLiftData} 
                height={280} 
                formatValue={formatPercent}
                colorScheme="blue"
              />
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                <div className="text-center">
                  <Info size={32} className="mx-auto mb-2" />
                  <p>No control group data available</p>
                  <p className="text-sm">Set up A/B testing to see lift metrics</p>
                </div>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Data Table */}
        <DataTable
          title="Campaign Metrics"
          data={tableData}
          columns={[
            { id: 'sent', label: 'Sent', format: 'number', align: 'right', defaultVisible: true, sortable: true },
            { id: 'delivered', label: 'Delivered', format: 'number', align: 'right', sortable: true },
            { id: 'opened', label: 'Opened', format: 'number', align: 'right', sortable: true },
            { id: 'confirmations', label: 'Confirmed', format: 'number', align: 'right', defaultVisible: true, sortable: true },
            { id: 'showUps', label: 'Show-ups', format: 'number', align: 'right', defaultVisible: true, sortable: true },
            { id: 'revenue', label: 'Revenue', format: 'money', align: 'right', defaultVisible: true, sortable: true },
            { id: 'cost', label: 'Cost', format: 'money', align: 'right', sortable: true },
            { id: 'roi', label: 'ROI %', format: 'percent', align: 'right', defaultVisible: true, sortable: true },
            { id: 'optOutPercent', label: 'Opt-out %', format: 'percent', align: 'right', sortable: true },
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
      <SaveViewDialog open={showSaveView} onClose={() => setShowSaveView(false)} reportType="marketing-roi" filters={filters} compareEnabled={compareMode} onSave={handleSaveView} />
      <SavedViewsList open={showSavedViews} onClose={() => setShowSavedViews(false)} onApply={handleApplyView} />
      <ScheduleDialog open={showSchedule} onClose={() => setShowSchedule(false)} savedViews={savedViews as SavedView[]} onSchedule={(c) => createSchedule(c)} onRunNow={(id) => { const v = getView(id); if (v) { markRun(id); handleExportCSV() } }} />
    </>
  )
}
