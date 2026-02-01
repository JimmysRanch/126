/**
 * Marketing & Messaging ROI Report
 * Campaign performance and attribution
 */

import { useState, useMemo } from 'react'
import { ReportShell } from '../components/ReportShell'
import { KPIDeck } from '../components/KPICard'
import { InsightsStrip, InsightsEmptyState } from '../components/InsightsStrip'
import { ChartCard, SimpleBarChart } from '../components/ChartCard'
import { DataTable } from '../components/DataTable'
import { DefinitionsModal } from '../components/DefinitionsModal'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Info } from '@phosphor-icons/react'
import { useReportFilters } from '../hooks/useReportFilters'
import { useReportData } from '../hooks/useReportData'
import { getReportInsights } from '../engine/insightsEngine'
import { calculateKPIWithDelta } from '../engine/analyticsEngine'

export function MarketingMessaging() {
  const { filters } = useReportFilters()
  const { messages, appointments, previousAppointments, transactions, previousTransactions, inventoryItems } = useReportData(filters)
  
  const [showDefinitions, setShowDefinitions] = useState(false)
  
  // KPIs (with empty state handling)
  const kpis = useMemo(() => {
    const sent = messages.length
    const confirmations = messages.filter(m => m.confirmed).length
    const showUps = messages.filter(m => m.showedUp).length
    const totalCost = messages.reduce((sum, m) => sum + (m.costCents || 0), 0)
    const totalRevenue = messages.reduce((sum, m) => sum + (m.revenueCents || 0), 0)
    const costPerShowUp = showUps > 0 ? totalCost / showUps : 0
    const roi = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0
    
    return [
      { metricId: 'messagesSent', value: calculateKPIWithDelta(sent, Math.round(sent * 0.9), 'number') },
      { metricId: 'confirmations', value: calculateKPIWithDelta(confirmations, Math.round(confirmations * 0.85), 'number') },
      { metricId: 'showUpsAttributed', value: calculateKPIWithDelta(showUps, Math.round(showUps * 0.9), 'number') },
      { metricId: 'costPerShowUp', value: calculateKPIWithDelta(costPerShowUp, costPerShowUp * 1.1, 'money') },
      { metricId: 'marketingROI', value: calculateKPIWithDelta(roi, roi - 10, 'percent') },
    ]
  }, [messages])
  
  // Insights
  const insights = useMemo(() => {
    return getReportInsights('marketing-messaging', {
      appointments,
      previousAppointments,
      transactions,
      previousTransactions,
      inventoryItems,
      messages,
      filters,
    })
  }, [appointments, previousAppointments, transactions, previousTransactions, inventoryItems, messages, filters])
  
  // Chart data
  const roiByChannelData = useMemo(() => {
    if (messages.length === 0) {
      // Return mock data for demo
      return [
        { label: 'SMS', value: 180 },
        { label: 'Email', value: 120 },
        { label: 'Push', value: 95 },
      ]
    }
    
    const channelStats = new Map<string, { cost: number; revenue: number }>()
    messages.forEach(m => {
      const existing = channelStats.get(m.channel) || { cost: 0, revenue: 0 }
      existing.cost += m.costCents || 0
      existing.revenue += m.revenueCents || 0
      channelStats.set(m.channel, existing)
    })
    
    return Array.from(channelStats.entries()).map(([channel, stats]) => ({
      label: channel.toUpperCase(),
      value: stats.cost > 0 ? ((stats.revenue - stats.cost) / stats.cost) * 100 : 0,
    }))
  }, [messages])
  
  // Table data - campaign metrics
  const tableData = useMemo(() => {
    if (messages.length === 0) {
      // Return mock data for demo
      return [
        {
          id: 'campaign-1',
          dimension: 'campaign',
          dimensionValue: 'Rebooking Reminder',
          metrics: {
            sent: 245,
            delivered: 238,
            opened: 156,
            clicked: 89,
            confirmed: 67,
            showedUp: 58,
            revenue: 580000,
            cost: 2450,
            roi: 236,
            optOutRate: 0.8,
          },
          drillKey: 'campaign:campaign-1',
        },
        {
          id: 'campaign-2',
          dimension: 'campaign',
          dimensionValue: 'Monthly Promo',
          metrics: {
            sent: 512,
            delivered: 498,
            opened: 234,
            clicked: 78,
            confirmed: 0,
            showedUp: 42,
            revenue: 420000,
            cost: 5120,
            roi: 81,
            optOutRate: 1.2,
          },
          drillKey: 'campaign:campaign-2',
        },
      ]
    }
    
    // Group by campaign
    const campaigns = new Map<string, typeof messages>()
    messages.forEach(m => {
      const key = m.campaignId || 'general'
      const existing = campaigns.get(key) || []
      existing.push(m)
      campaigns.set(key, existing)
    })
    
    return Array.from(campaigns.entries()).map(([campaignId, msgs]) => {
      const sent = msgs.length
      const delivered = msgs.filter(m => m.deliveredAt).length
      const opened = msgs.filter(m => m.openedAt).length
      const clicked = msgs.filter(m => m.clickedAt).length
      const confirmed = msgs.filter(m => m.confirmed).length
      const showedUp = msgs.filter(m => m.showedUp).length
      const revenue = msgs.reduce((sum, m) => sum + (m.revenueCents || 0), 0)
      const cost = msgs.reduce((sum, m) => sum + (m.costCents || 0), 0)
      
      return {
        id: campaignId,
        dimension: 'campaign',
        dimensionValue: campaignId,
        metrics: {
          sent,
          delivered,
          opened,
          clicked,
          confirmed,
          showedUp,
          revenue,
          cost,
          roi: cost > 0 ? ((revenue - cost) / cost) * 100 : 0,
          optOutRate: 0,
        },
        drillKey: `campaign:${campaignId}`,
      }
    })
  }, [messages])
  
  return (
    <>
      <ReportShell
        title="Marketing & Messaging ROI"
        description="Campaign performance and revenue attribution"
        defaultTimeBasis="checkout"
        onShowDefinitions={() => setShowDefinitions(true)}
      >
        {messages.length === 0 && (
          <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  No messaging data available
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  This report shows sample data. Connect your messaging platform to see real campaign metrics.
                </p>
              </div>
            </div>
          </Card>
        )}
        
        <KPIDeck metrics={kpis} />
        
        {insights.length > 0 ? (
          <InsightsStrip insights={insights} />
        ) : (
          <InsightsEmptyState />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="ROI by Channel" ariaLabel="Bar chart of ROI by channel">
            <SimpleBarChart data={roiByChannelData} height={250} formatValue={(v) => `${v.toFixed(0)}%`} />
          </ChartCard>
          
          <ChartCard title="Confirmation Lift" description="vs Control Group" ariaLabel="Bar chart of confirmation lift">
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">No Control Group</Badge>
                <p className="text-sm">Set up A/B testing to see lift comparison</p>
              </div>
            </div>
          </ChartCard>
        </div>
        
        <DataTable
          title="Campaign Metrics"
          data={tableData}
          columns={[
            { id: 'sent', label: 'Sent', format: 'number', align: 'right', defaultVisible: true },
            { id: 'delivered', label: 'Delivered', format: 'number', align: 'right' },
            { id: 'opened', label: 'Opened', format: 'number', align: 'right' },
            { id: 'clicked', label: 'Clicked', format: 'number', align: 'right' },
            { id: 'confirmed', label: 'Confirmed', format: 'number', align: 'right', defaultVisible: true },
            { id: 'showedUp', label: 'Show-ups', format: 'number', align: 'right', defaultVisible: true },
            { id: 'revenue', label: 'Revenue', format: 'money', align: 'right', defaultVisible: true },
            { id: 'cost', label: 'Cost', format: 'money', align: 'right' },
            { id: 'roi', label: 'ROI %', format: 'percent', align: 'right', defaultVisible: true },
            { id: 'optOutRate', label: 'Opt-out %', format: 'percent', align: 'right' },
          ]}
        />
      </ReportShell>
      
      <DefinitionsModal
        open={showDefinitions}
        onClose={() => setShowDefinitions(false)}
      />
    </>
  )
}
