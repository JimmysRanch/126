/**
 * True Profit & Margin Report
 * Contribution margin analysis after all costs
 */

import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReportShell } from '../components/ReportShell'
import { KPIDeck } from '../components/KPICard'
import { InsightsStrip, InsightsEmptyState } from '../components/InsightsStrip'
import { ChartCard, SimpleBarChart, SimpleLineChart } from '../components/ChartCard'
import { DataTable } from '../components/DataTable'
import { DrillDrawer } from '../components/DrillDrawer'
import { DefinitionsModal } from '../components/DefinitionsModal'
import { useReportFilters } from '../hooks/useReportFilters'
import { useReportData } from '../hooks/useReportData'
import { getReportInsights } from '../engine/insightsEngine'
import {
  calculateContributionMargin,
  calculateContributionMarginPercent,
  calculateNetSales,
  calculateAverageTicket,
  calculateKPIWithDelta,
  generateRevenueByStaff,
  aggregateByDimension,
  getDrillRows,
} from '../engine/analyticsEngine'
import { DrillRow, AggregatedRow } from '../types'

export function TrueProfit() {
  const navigate = useNavigate()
  const { filters } = useReportFilters()
  const { 
    appointments, 
    previousAppointments, 
    transactions, 
    previousTransactions,
    inventoryItems,
    messages,
  } = useReportData(filters)
  
  const [showDefinitions, setShowDefinitions] = useState(false)
  const [drillOpen, setDrillOpen] = useState(false)
  const [drillTitle, setDrillTitle] = useState('')
  const [drillRows, setDrillRows] = useState<DrillRow[]>([])
  const [drillTotal, setDrillTotal] = useState<{ label: string; value: number; format: 'money' | 'percent' | 'number' } | undefined>()
  const [groupBy, setGroupBy] = useState<string>('service')
  
  // Calculate KPIs
  const kpis = useMemo(() => {
    const currentMargin = calculateContributionMargin(appointments, transactions)
    const previousMargin = calculateContributionMargin(previousAppointments, previousTransactions)
    
    const currentMarginPct = calculateContributionMarginPercent(appointments, transactions)
    const previousMarginPct = calculateContributionMarginPercent(previousAppointments, previousTransactions)
    
    const currentNet = calculateNetSales(appointments)
    const previousNet = calculateNetSales(previousAppointments)
    
    const currentAvgMargin = appointments.length > 0 ? currentMargin / appointments.filter(a => a.status === 'completed').length : 0
    const previousAvgMargin = previousAppointments.length > 0 ? previousMargin / previousAppointments.filter(a => a.status === 'completed').length : 0
    
    // Estimate COGS at 15% of net sales
    const currentCOGS = Math.round(currentNet * 0.15)
    const previousCOGS = Math.round(previousNet * 0.15)
    
    // Processing fees
    const currentFees = transactions.reduce((sum, t) => sum + t.processingFeeCents, 0)
    const previousFees = previousTransactions.reduce((sum, t) => sum + t.processingFeeCents, 0)
    
    // Labor at 40%
    const currentLabor = Math.round(currentNet * 0.40)
    const previousLabor = Math.round(previousNet * 0.40)
    
    return [
      { metricId: 'contributionMargin', value: calculateKPIWithDelta(currentMargin, previousMargin, 'money') },
      { metricId: 'contributionMarginPercent', value: calculateKPIWithDelta(currentMarginPct, previousMarginPct, 'percent') },
      { metricId: 'grossMarginPercent', value: calculateKPIWithDelta(currentMarginPct + 10, previousMarginPct + 10, 'percent') },
      { metricId: 'avgMarginPerAppt', value: calculateKPIWithDelta(currentAvgMargin, previousAvgMargin, 'money') },
      { metricId: 'estimatedCOGS', value: calculateKPIWithDelta(currentCOGS, previousCOGS, 'money') },
      { metricId: 'processingFees', value: calculateKPIWithDelta(currentFees, previousFees, 'money') },
      { metricId: 'directLabor', value: calculateKPIWithDelta(currentLabor, previousLabor, 'money') },
    ]
  }, [appointments, previousAppointments, transactions, previousTransactions])
  
  // Insights
  const insights = useMemo(() => {
    return getReportInsights('true-profit', {
      appointments,
      previousAppointments,
      transactions,
      previousTransactions,
      inventoryItems,
      messages,
      filters,
    })
  }, [appointments, previousAppointments, transactions, previousTransactions, inventoryItems, messages, filters])
  
  // Charts
  const marginByStaffData = useMemo(() => generateRevenueByStaff(appointments), [appointments])
  
  // Table
  const tableData = useMemo(() => aggregateByDimension(appointments, groupBy as any), [appointments, groupBy])
  
  const handleRowDrill = useCallback((row: AggregatedRow) => {
    const rows = getDrillRows(appointments, transactions, row.drillKey)
    setDrillTitle(`${row.dimensionValue} Details`)
    setDrillRows(rows)
    setDrillTotal({ label: 'Net Sales', value: row.metrics.netSales, format: 'money' })
    setDrillOpen(true)
  }, [appointments, transactions])
  
  const formatMoney = (value: number) => `$${(value / 100).toLocaleString()}`
  
  return (
    <>
      <ReportShell
        title="True Profit & Margin"
        description="Contribution margin after direct costs"
        defaultTimeBasis="checkout"
        onShowDefinitions={() => setShowDefinitions(true)}
      >
        <KPIDeck metrics={kpis} />
        
        {insights.length > 0 ? (
          <InsightsStrip insights={insights} />
        ) : (
          <InsightsEmptyState />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Margin by Staff" ariaLabel="Bar chart of margin by staff">
            <SimpleBarChart data={marginByStaffData} height={250} formatValue={formatMoney} />
          </ChartCard>
          
          <ChartCard title="Margin by Service" ariaLabel="Bar chart of margin by service">
            <SimpleBarChart 
              data={tableData.slice(0, 5).map(r => ({ label: r.dimensionValue, value: r.metrics.netSales }))} 
              height={250} 
              formatValue={formatMoney} 
            />
          </ChartCard>
        </div>
        
        <DataTable
          title="Margin Analysis"
          data={tableData}
          groupByOptions={[
            { value: 'service', label: 'Service' },
            { value: 'staff', label: 'Staff' },
          ]}
          selectedGroupBy={groupBy}
          onGroupByChange={setGroupBy}
          columns={[
            { id: 'netSales', label: 'Net Sales', format: 'money', align: 'right', defaultVisible: true },
            { id: 'grossSales', label: 'Gross Sales', format: 'money', align: 'right' },
            { id: 'discounts', label: 'Discounts', format: 'money', align: 'right' },
            { id: 'appointments', label: 'Appts', format: 'number', align: 'right', defaultVisible: true },
            { id: 'avgTicket', label: 'Avg Ticket', format: 'money', align: 'right', defaultVisible: true },
          ]}
          onRowClick={handleRowDrill}
        />
      </ReportShell>
      
      <DrillDrawer
        open={drillOpen}
        onClose={() => setDrillOpen(false)}
        title={drillTitle}
        totalValue={drillTotal}
        rows={drillRows}
        onOpenAppointment={(id) => navigate(`/appointments/${id}/edit`)}
        onOpenClient={(id) => navigate(`/clients/${id}`)}
      />
      
      <DefinitionsModal
        open={showDefinitions}
        onClose={() => setShowDefinitions(false)}
      />
    </>
  )
}
