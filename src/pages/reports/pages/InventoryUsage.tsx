/**
 * Inventory Usage & Reorder Report - Production Ready
 * Inventory tracking, usage analysis, and reorder projections
 */

import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Warning, ArrowsClockwise, Info, Package } from '@phosphor-icons/react'
import { ReportShell } from '../components/ReportShell'
import { KPIDeck } from '../components/KPICard'
import { InsightsStrip, InsightsEmptyState } from '../components/InsightsStrip'
import { ChartCard, SimpleLineChart, SimpleBarChart } from '../components/ChartCard'
import { DataTable } from '../components/DataTable'
import { DrillDrawer } from '../components/DrillDrawer'
import { DefinitionsModal } from '../components/DefinitionsModal'
import { SaveViewDialog, ScheduleDialog, SavedViewsList } from '../components/SavedViewsManager'
import { useReportFilters } from '../hooks/useReportFilters'
import { useReportData, useSavedViews, useReportSchedules } from '../hooks/useReportData'
import { generateInsights } from '../engine/insightsEngine'
import {
  calculateItemsBelowReorder,
  calculateDaysOfSupply,
  calculateCostUsed,
  calculateCostPerAppt,
  calculateKPIWithDelta,
  generateUsageTrendByCategory,
  generateCostPerApptTrend,
  aggregateInventoryMetrics,
  projectInventoryNeeds,
  getDrillRows,
  measurePerformance,
} from '../engine/analyticsEngine'
import { DrillRow, Insight, AggregatedRow, SavedView, CompletenessIssue } from '../types'

function checkInventoryCompleteness(inventoryItems: any[]): CompletenessIssue[] {
  const issues: CompletenessIssue[] = []
  
  const withoutCost = inventoryItems.filter(i => !i.unitCostCents).length
  if (withoutCost > 0) {
    issues.push({
      type: 'missing-unit-cost',
      description: `${withoutCost} items missing unit costs. Cost calculations may be incomplete.`,
      settingsLink: '/settings',
      affectedMetrics: ['costUsed', 'costPerAppt'],
    })
  }
  
  const withoutReorder = inventoryItems.filter(i => !i.reorderPoint).length
  if (withoutReorder > 0) {
    issues.push({
      type: 'missing-reorder-point',
      description: `${withoutReorder} items without reorder points set.`,
      settingsLink: '/settings',
      affectedMetrics: ['itemsBelowReorder', 'daysOfSupply'],
    })
  }
  
  return issues
}

export function InventoryUsage() {
  const navigate = useNavigate()
  const { filters, setFilters } = useReportFilters()
  const {
    appointments,
    previousAppointments,
    inventoryItems,
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

  // Check data completeness
  const completenessIssues = useMemo(() =>
    checkInventoryCompleteness(inventoryItems),
    [inventoryItems]
  )

  // Calculate KPIs
  const kpis = useMemo(() => {
    if (inventoryItems.length === 0) return []

    return measurePerformance('calculateInventoryKPIs', () => {
      const currentBelowReorder = calculateItemsBelowReorder(inventoryItems)
      const previousBelowReorder = calculateItemsBelowReorder(inventoryItems) // Would need historical data

      const currentDaysSupply = calculateDaysOfSupply(inventoryItems, appointments)
      const previousDaysSupply = calculateDaysOfSupply(inventoryItems, previousAppointments)

      const currentCostUsed = calculateCostUsed(inventoryItems, appointments, filters)
      const previousCostUsed = calculateCostUsed(inventoryItems, previousAppointments, filters)

      const currentCostPerAppt = calculateCostPerAppt(inventoryItems, appointments, filters)
      const previousCostPerAppt = calculateCostPerAppt(inventoryItems, previousAppointments, filters)

      return [
        { metricId: 'itemsBelowReorder', value: calculateKPIWithDelta(currentBelowReorder, previousBelowReorder, 'number') },
        { metricId: 'daysOfSupply', value: calculateKPIWithDelta(currentDaysSupply, previousDaysSupply, 'number') },
        { metricId: 'costUsed', value: calculateKPIWithDelta(currentCostUsed, previousCostUsed, 'money') },
        { metricId: 'costPerAppt', value: calculateKPIWithDelta(currentCostPerAppt, previousCostPerAppt, 'money') },
      ]
    })
  }, [inventoryItems, appointments, previousAppointments, filters])

  // Generate insights
  const insights = useMemo(() => {
    if (inventoryItems.length === 0) return []
    return measurePerformance('generateInventoryInsights', () =>
      generateInsights({
        appointments,
        previousAppointments,
        transactions: [],
        previousTransactions: [],
        inventoryItems,
        messages: [],
        filters,
      }).filter(i => ['inventory', 'reorder', 'supply', 'stock'].some(k => i.category.includes(k)))
    )
  }, [appointments, previousAppointments, inventoryItems, filters])

  // Chart data
  const usageTrendData = useMemo(() => {
    if (inventoryItems.length === 0) return []
    return measurePerformance('generateUsageTrend', () =>
      generateUsageTrendByCategory(inventoryItems, appointments, filters)
    )
  }, [inventoryItems, appointments, filters])

  const costPerApptTrendData = useMemo(() => {
    if (inventoryItems.length === 0) return []
    return measurePerformance('generateCostPerApptTrend', () =>
      generateCostPerApptTrend(inventoryItems, appointments, filters)
    )
  }, [inventoryItems, appointments, filters])

  // Table data
  const tableData = useMemo(() => {
    if (inventoryItems.length === 0) return []
    return measurePerformance('aggregateInventoryTable', () =>
      aggregateInventoryMetrics(inventoryItems, appointments, filters)
    )
  }, [inventoryItems, appointments, filters])

  // Projection data
  const projectionData = useMemo(() => {
    if (inventoryItems.length === 0) return []
    return measurePerformance('projectInventory', () =>
      projectInventoryNeeds(inventoryItems, appointments, filters)
    )
  }, [inventoryItems, appointments, filters])

  // Items needing reorder
  const itemsNeedingReorder = useMemo(() => {
    return tableData.filter(row => 
      (row.metrics.currentStock || 0) <= (row.metrics.reorderPoint || 0)
    )
  }, [tableData])

  // Drill handlers
  const handleKPIDrill = useCallback((metricId: string, value: number) => {
    let rows: DrillRow[] = []
    let title = ''

    switch (metricId) {
      case 'itemsBelowReorder':
        rows = inventoryItems
          .filter(i => i.currentStock <= i.reorderPoint)
          .map(i => ({ id: i.id, type: 'inventory' as const, data: i, timestamp: new Date().toISOString() }))
        title = 'Items Below Reorder Point'
        break
      default:
        rows = inventoryItems.map(i => ({ id: i.id, type: 'inventory' as const, data: i, timestamp: new Date().toISOString() }))
        title = 'Inventory Items'
    }

    setDrillTitle(title)
    setDrillSubtitle(`${rows.length} items`)
    setDrillRows(rows)
    setDrillTotal({ label: title, value, format: metricId.includes('cost') ? 'money' : 'number' })
    setDrillOpen(true)
  }, [inventoryItems])

  const handleInsightClick = useCallback((insight: Insight) => {
    if (insight.drillKey) {
      const itemId = insight.drillKey.replace('inventory:', '')
      const item = inventoryItems.find(i => i.id === itemId)
      if (item) {
        setDrillTitle(item.name)
        setDrillSubtitle(insight.description)
        setDrillRows([{ id: item.id, type: 'inventory', data: item, timestamp: new Date().toISOString() }])
        setDrillTotal(undefined)
        setDrillOpen(true)
      }
    }
  }, [inventoryItems])

  const handleRowDrill = useCallback((row: AggregatedRow) => {
    const item = inventoryItems.find(i => i.name === row.dimensionValue)
    if (item) {
      // Get appointments that used this item
      const relatedAppts = appointments.filter(a => 
        a.services?.some((s: any) => s.inventoryItems?.includes(item.id))
      )
      const rows = relatedAppts.map(a => ({ id: a.id, type: 'appointment' as const, data: a, timestamp: a.serviceDate }))
      
      setDrillTitle(row.dimensionValue)
      setDrillSubtitle(`${rows.length} appointments using this item`)
      setDrillRows(rows.length > 0 ? rows : [{ id: item.id, type: 'inventory' as const, data: item, timestamp: new Date().toISOString() }])
      setDrillTotal({ label: 'Cost Used', value: row.metrics.costUsed || 0, format: 'money' })
      setDrillOpen(true)
    }
  }, [inventoryItems, appointments])

  // Save/Export handlers
  const handleSaveView = useCallback((name: string) => {
    saveView({ name, reportType: 'inventory-usage', filters, compareEnabled: compareMode })
  }, [saveView, filters, compareMode])

  const handleApplyView = useCallback((view: SavedView) => {
    setFilters(view.filters)
    if (view.compareEnabled !== undefined) setCompareMode(view.compareEnabled)
    setShowSavedViews(false)
  }, [setFilters])

  const handleExportCSV = useCallback(() => {
    const headers = ['Item', 'Begin Qty', 'Received', 'Used', 'End Qty', 'Unit Cost', 'Cost Used', 'Reorder Point', 'Days Remaining', 'Linked Services']
    const rows = tableData.map(row => [
      row.dimensionValue,
      row.metrics.beginQty || 0,
      row.metrics.received || 0,
      row.metrics.used || 0,
      row.metrics.endQty || row.metrics.currentStock || 0,
      ((row.metrics.unitCost || 0) / 100).toFixed(2),
      ((row.metrics.costUsed || 0) / 100).toFixed(2),
      row.metrics.reorderPoint || 0,
      row.metrics.daysRemaining || 'N/A',
      row.metrics.linkedServices || '',
    ])
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `inventory-usage-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [tableData])

  const handleExportDrillCSV = useCallback(() => {
    if (drillRows.length === 0) return
    const headers = drillRows[0]?.type === 'inventory' 
      ? ['Item', 'Current Stock', 'Unit Cost', 'Reorder Point']
      : ['Date', 'Client', 'Service', 'Items Used']
    const rows = drillRows.map(r => {
      const d = r.data as any
      if (r.type === 'inventory') {
        return [d.name || '', d.currentStock || 0, ((d.unitCostCents || 0) / 100).toFixed(2), d.reorderPoint || 0]
      }
      return [d.serviceDate || '', d.clientName || '', d.services?.[0]?.name || '', d.services?.[0]?.inventoryItems?.length || 0]
    })
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `inventory-drill-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [drillRows])

  const formatMoney = (v: number) => `$${(v / 100).toLocaleString()}`

  // Loading
  if (isLoading) {
    return (
      <ReportShell title="Inventory Usage & Reorder" description="Inventory tracking" defaultTimeBasis="service">
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
      <ReportShell title="Inventory Usage & Reorder" description="Inventory tracking" defaultTimeBasis="service">
        <Alert variant="destructive">
          <Warning className="h-4 w-4" />
          <AlertDescription>Failed to load inventory data.</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          <ArrowsClockwise className="mr-2 h-4 w-4" /> Retry
        </Button>
      </ReportShell>
    )
  }

  // Empty
  if (inventoryItems.length === 0) {
    return (
      <ReportShell title="Inventory Usage & Reorder" description="Inventory tracking" defaultTimeBasis="service" onShowDefinitions={() => setShowDefinitions(true)}>
        <Card className="p-8 text-center">
          <Package size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No Inventory Items</h2>
          <p className="text-muted-foreground mb-4">No inventory items have been set up yet.</p>
          <Button onClick={() => navigate('/settings')}>Set Up Inventory</Button>
        </Card>
        <DefinitionsModal open={showDefinitions} onClose={() => setShowDefinitions(false)} />
      </ReportShell>
    )
  }

  return (
    <>
      <ReportShell
        title="Inventory Usage & Reorder"
        description="Inventory tracking, usage analysis, and reorder projections"
        defaultTimeBasis="service"
        onSaveView={() => setShowSaveView(true)}
        onSchedule={() => setShowSchedule(true)}
        onExport={handleExportCSV}
        onShowDefinitions={() => setShowDefinitions(true)}
      >
        {/* Completeness warnings */}
        {completenessIssues.length > 0 && (
          <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
            <Warning className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <span className="font-medium">Data Completeness: </span>
              {completenessIssues.map((issue, i) => (
                <span key={i}>
                  {issue.description}
                  {i < completenessIssues.length - 1 && ' | '}
                </span>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* KPI Deck */}
        <KPIDeck metrics={kpis.map(kpi => ({ ...kpi, onClick: () => handleKPIDrill(kpi.metricId, kpi.value.current) }))} />

        {/* Reorder Alert */}
        {itemsNeedingReorder.length > 0 && (
          <Alert className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
            <Warning className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <span className="font-medium">{itemsNeedingReorder.length} items need reordering: </span>
              {itemsNeedingReorder.slice(0, 3).map((item, i) => (
                <Badge key={i} variant="outline" className="ml-1 mr-1">{item.dimensionValue}</Badge>
              ))}
              {itemsNeedingReorder.length > 3 && <span>and {itemsNeedingReorder.length - 3} more...</span>}
            </AlertDescription>
          </Alert>
        )}

        {/* Insights */}
        {insights.length > 0 ? (
          <InsightsStrip insights={insights} onInsightClick={handleInsightClick} />
        ) : (
          <InsightsEmptyState />
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Usage Trend by Category" description="Inventory usage over time" ariaLabel="Line chart of inventory usage by category">
            <SimpleLineChart 
              data={usageTrendData} 
              height={280} 
              formatValue={(v) => `${v} units`}
            />
          </ChartCard>

          <ChartCard title="Cost per Appointment Trend" description="Average supply cost per completed appointment" ariaLabel="Line chart of cost per appointment">
            <SimpleLineChart 
              data={costPerApptTrendData} 
              height={280} 
              formatValue={formatMoney}
            />
          </ChartCard>
        </div>

        {/* Data Table */}
        <DataTable
          title="Inventory Items"
          data={tableData}
          columns={[
            { id: 'beginQty', label: 'Begin', format: 'number', align: 'right', sortable: true },
            { id: 'received', label: 'Received', format: 'number', align: 'right', sortable: true },
            { id: 'used', label: 'Used', format: 'number', align: 'right', defaultVisible: true, sortable: true },
            { id: 'currentStock', label: 'End Qty', format: 'number', align: 'right', defaultVisible: true, sortable: true },
            { id: 'unitCost', label: 'Unit Cost', format: 'money', align: 'right', defaultVisible: true, sortable: true },
            { id: 'costUsed', label: 'Cost Used', format: 'money', align: 'right', defaultVisible: true, sortable: true },
            { id: 'reorderPoint', label: 'Reorder Pt', format: 'number', align: 'right', sortable: true },
            { id: 'daysRemaining', label: 'Days Left', format: 'number', align: 'right', defaultVisible: true, sortable: true },
            { id: 'linkedServices', label: 'Services', format: 'text', align: 'left', sortable: true },
          ]}
          onRowClick={handleRowDrill}
          onExport={handleExportCSV}
          maxPreviewRows={10}
          showViewAll
        />

        {/* Projection Section */}
        {projectionData.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Projected Needs (Next 30 Days)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Based on upcoming scheduled appointments and historical usage patterns
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {projectionData.slice(0, 4).map((item, i) => (
                <div key={i} className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-lg font-bold">{item.projectedNeed} units</div>
                  <div className="text-xs text-muted-foreground">
                    Current: {item.currentStock} | Gap: {Math.max(0, item.projectedNeed - item.currentStock)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
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
      <SaveViewDialog open={showSaveView} onClose={() => setShowSaveView(false)} reportType="inventory-usage" filters={filters} compareEnabled={compareMode} onSave={handleSaveView} />
      <SavedViewsList open={showSavedViews} onClose={() => setShowSavedViews(false)} onApply={handleApplyView} />
      <ScheduleDialog open={showSchedule} onClose={() => setShowSchedule(false)} savedViews={savedViews as SavedView[]} onSchedule={(c) => createSchedule(c)} onRunNow={(id) => { const v = getView(id); if (v) { markRun(id); handleExportCSV() } }} />
    </>
  )
}
