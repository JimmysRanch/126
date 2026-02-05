/**
 * Client Insights Dashboard
 * Combines client retention, loyalty, and referral reports into a unified view
 */

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Info, 
  ArrowsClockwise, 
  Users, 
  ArrowsClockwise as Retention, 
  TrendUp,
  Megaphone,
  Star
} from '@phosphor-icons/react'
import { ReportShell } from '../components/ReportShell'
import { KPIDeck } from '../components/KPICard'
import { ChartCard, SimpleBarChart, SimplePieChart, SimpleLineChart } from '../components/ChartCard'
import { DataTable } from '../components/DataTable'
import { DefinitionsModal } from '../components/DefinitionsModal'
import { useReportFilters } from '../hooks/useReportFilters'
import { useReportData } from '../hooks/useReportData'
import { 
  calculateNetSales,
  calculateAppointmentsCompleted,
  calculateRebook30d,
  calculateKPIWithDelta, 
  measurePerformance,
  getDateRange,
} from '../engine/analyticsEngine'

export function ClientInsightsDashboard() {
  const { filters, setFilters } = useReportFilters()
  const { 
    appointments, 
    previousAppointments,
    clients, 
    isLoading, 
    error 
  } = useReportData(filters)
  const [showDefinitions, setShowDefinitions] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // ============ Calculate Client Stats ============
  const clientStats = useMemo(() => {
    return measurePerformance('calculateClientStats', () => {
      const clientVisits: Record<string, { 
        visits: number[]
        totalSpend: number
        clientName: string
        firstVisit: string
        lastVisit: string
        referralSource?: string
      }> = {}
      
      appointments.filter(a => a.status === 'completed').forEach(appt => {
        if (!clientVisits[appt.clientId]) {
          clientVisits[appt.clientId] = { 
            visits: [], 
            totalSpend: 0, 
            clientName: appt.clientName,
            firstVisit: appt.serviceDate,
            lastVisit: appt.serviceDate,
            referralSource: (appt as any).referralSource,
          }
        }
        clientVisits[appt.clientId].visits.push(new Date(appt.serviceDate).getTime())
        clientVisits[appt.clientId].totalSpend += appt.netCents
        if (appt.serviceDate < clientVisits[appt.clientId].firstVisit) {
          clientVisits[appt.clientId].firstVisit = appt.serviceDate
        }
        if (appt.serviceDate > clientVisits[appt.clientId].lastVisit) {
          clientVisits[appt.clientId].lastVisit = appt.serviceDate
        }
      })

      return clientVisits
    })
  }, [appointments])

  // ============ Retention Metrics ============
  const retentionData = useMemo(() => {
    return measurePerformance('calculateRetention', () => {
      let totalClients = 0
      let returningClients = 0
      let avgVisitsPerClient = 0
      let avgDaysBetweenVisits = 0
      let intervalCount = 0
      let totalLTV = 0

      Object.values(clientStats).forEach(client => {
        totalClients++
        totalLTV += client.totalSpend
        if (client.visits.length > 1) {
          returningClients++
          const sorted = client.visits.sort((a, b) => a - b)
          for (let i = 1; i < sorted.length; i++) {
            const days = (sorted[i] - sorted[i - 1]) / (1000 * 60 * 60 * 24)
            avgDaysBetweenVisits += days
            intervalCount++
          }
        }
        avgVisitsPerClient += client.visits.length
      })

      avgVisitsPerClient = totalClients > 0 ? avgVisitsPerClient / totalClients : 0
      avgDaysBetweenVisits = intervalCount > 0 ? avgDaysBetweenVisits / intervalCount : 0
      const retentionRate = totalClients > 0 ? (returningClients / totalClients) * 100 : 0
      const avgLTV = totalClients > 0 ? Math.round(totalLTV / totalClients) : 0

      return {
        totalClients,
        returningClients,
        newClients: totalClients - returningClients,
        retentionRate,
        avgVisitsPerClient: Math.round(avgVisitsPerClient * 10) / 10,
        avgDaysBetweenVisits: Math.round(avgDaysBetweenVisits),
        avgLTV,
      }
    })
  }, [clientStats])

  // ============ New vs Returning ============
  const newVsReturning = useMemo(() => {
    return measurePerformance('calculateNewVsReturning', () => {
      const { start } = getDateRange(filters)
      let newCount = 0, returningCount = 0
      let newRevenue = 0, returningRevenue = 0

      Object.values(clientStats).forEach(stats => {
        const firstVisitDate = new Date(stats.firstVisit)
        if (firstVisitDate >= start) {
          newCount++
          newRevenue += stats.totalSpend
        } else {
          returningCount++
          returningRevenue += stats.totalSpend
        }
      })

      return {
        newCount,
        returningCount,
        newRevenue,
        returningRevenue,
        newAvgSpend: newCount > 0 ? Math.round(newRevenue / newCount) : 0,
        returningAvgSpend: returningCount > 0 ? Math.round(returningRevenue / returningCount) : 0,
      }
    })
  }, [clientStats, filters])

  // ============ Top Clients ============
  const topClients = useMemo(() => {
    return Object.entries(clientStats)
      .map(([clientId, data]) => ({
        clientId,
        clientName: data.clientName,
        totalSpend: data.totalSpend,
        visits: data.visits.length,
        avgSpend: data.visits.length > 0 ? Math.round(data.totalSpend / data.visits.length) : 0,
        lastVisit: data.lastVisit,
        daysSinceVisit: Math.round((Date.now() - new Date(data.lastVisit).getTime()) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => b.totalSpend - a.totalSpend)
  }, [clientStats])

  // ============ Referral Sources ============
  const referralData = useMemo(() => {
    const bySrc: Record<string, { count: number; revenue: number }> = {}

    Object.values(clientStats).forEach(client => {
      const src = client.referralSource || 'Unknown'
      if (!bySrc[src]) {
        bySrc[src] = { count: 0, revenue: 0 }
      }
      bySrc[src].count += 1
      bySrc[src].revenue += client.totalSpend
    })

    return Object.entries(bySrc)
      .map(([source, data]) => ({
        source,
        clients: data.count,
        revenue: data.revenue,
        avgLTV: data.count > 0 ? Math.round(data.revenue / data.count) : 0,
      }))
      .sort((a, b) => b.clients - a.clients)
  }, [clientStats])

  // ============ Visit Frequency Distribution ============
  const visitFrequencyData = useMemo(() => {
    const buckets: Record<string, number> = {
      '1 visit': 0,
      '2-3 visits': 0,
      '4-6 visits': 0,
      '7-10 visits': 0,
      '11+ visits': 0,
    }

    Object.values(clientStats).forEach(client => {
      const v = client.visits.length
      if (v === 1) buckets['1 visit']++
      else if (v <= 3) buckets['2-3 visits']++
      else if (v <= 6) buckets['4-6 visits']++
      else if (v <= 10) buckets['7-10 visits']++
      else buckets['11+ visits']++
    })

    return Object.entries(buckets).map(([label, count]) => ({
      label,
      value: count,
    }))
  }, [clientStats])

  // ============ KPIs ============
  const kpis = useMemo(() => {
    if (appointments.length === 0) return []

    return measurePerformance('calculateClientKPIs', () => {
      const currentRevenue = calculateNetSales(appointments)
      const previousRevenue = calculateNetSales(previousAppointments)

      const currentRebook = calculateRebook30d(appointments)
      const previousRebook = calculateRebook30d(previousAppointments)

      return [
        { metricId: 'totalClients', value: calculateKPIWithDelta(retentionData.totalClients, 0, 'number') },
        { metricId: 'retentionRate', value: calculateKPIWithDelta(retentionData.retentionRate, 0, 'percent') },
        { metricId: 'rebook30d', value: calculateKPIWithDelta(currentRebook, previousRebook, 'percent') },
        { metricId: 'avgVisitsPerClient', value: calculateKPIWithDelta(retentionData.avgVisitsPerClient, 0, 'number') },
        { metricId: 'avgLTV', value: calculateKPIWithDelta(retentionData.avgLTV, 0, 'money') },
        { metricId: 'newCustomers', value: calculateKPIWithDelta(newVsReturning.newCount, 0, 'number') },
      ]
    })
  }, [appointments, previousAppointments, retentionData, newVsReturning])

  // ============ Charts ============
  const newVsReturningPieData = useMemo(() => [
    { label: 'New Customers', value: newVsReturning.newCount },
    { label: 'Returning Customers', value: newVsReturning.returningCount },
  ], [newVsReturning])

  const revenuePieData = useMemo(() => [
    { label: 'New', value: newVsReturning.newRevenue },
    { label: 'Returning', value: newVsReturning.returningRevenue },
  ], [newVsReturning])

  const topClientsBarData = useMemo(() => {
    return topClients.slice(0, 10).map(c => ({
      label: c.clientName.length > 12 ? c.clientName.substring(0, 10) + '...' : c.clientName,
      value: c.totalSpend,
    }))
  }, [topClients])

  const referralBarData = useMemo(() => {
    return referralData.slice(0, 8).map(r => ({
      label: r.source.length > 12 ? r.source.substring(0, 10) + '...' : r.source,
      value: r.clients,
    }))
  }, [referralData])

  // ============ Tables ============
  const retentionTableData = useMemo(() => {
    return Object.entries(clientStats)
      .map(([clientId, data]) => ({
        dimensionValue: data.clientName,
        drillKey: `client:${clientId}`,
        metrics: {
          visits: data.visits.length,
          totalSpend: data.totalSpend,
          avgSpend: data.visits.length > 0 ? Math.round(data.totalSpend / data.visits.length) : 0,
          isReturning: data.visits.length > 1 ? 'Yes' : 'No',
        },
      }))
      .sort((a, b) => b.metrics.visits - a.metrics.visits)
  }, [clientStats])

  const topClientsTableData = useMemo(() => {
    return topClients.slice(0, 50).map(c => ({
      dimensionValue: c.clientName,
      drillKey: `client:${c.clientId}`,
      metrics: {
        totalSpend: c.totalSpend,
        visits: c.visits,
        avgSpend: c.avgSpend,
        daysSinceVisit: c.daysSinceVisit,
      },
    }))
  }, [topClients])

  const referralTableData = useMemo(() => {
    return referralData.map(r => ({
      dimensionValue: r.source,
      drillKey: `referral:${r.source}`,
      metrics: {
        clients: r.clients,
        revenue: r.revenue,
        avgLTV: r.avgLTV,
      },
    }))
  }, [referralData])

  // ============ Handlers ============
  const formatMoney = (v: number) => `$${(v / 100).toLocaleString()}`

  // ============ Loading State ============
  if (isLoading) {
    return (
      <ReportShell title="Client Insights" description="Customer retention, loyalty, and value analytics" defaultTimeBasis="service">
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
      <ReportShell title="Client Insights" description="Customer retention, loyalty, and value analytics" defaultTimeBasis="service">
        <Alert variant="destructive">
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
      <ReportShell title="Client Insights" description="Customer retention, loyalty, and value analytics" defaultTimeBasis="service">
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
        title="Client Insights"
        description="Customer retention, loyalty, and value analytics"
        defaultTimeBasis="service"
        onShowDefinitions={() => setShowDefinitions(true)}
      >
        {/* KPI Deck */}
        <KPIDeck metrics={kpis} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Users size={16} weight="duotone" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="retention" className="flex items-center gap-2">
              <Retention size={16} weight="duotone" />
              <span className="hidden sm:inline">Retention</span>
            </TabsTrigger>
            <TabsTrigger value="top-clients" className="flex items-center gap-2">
              <Star size={16} weight="duotone" />
              <span className="hidden sm:inline">Top Clients</span>
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Megaphone size={16} weight="duotone" />
              <span className="hidden sm:inline">Referrals</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="New vs Returning Customers" description="Customer distribution" ariaLabel="Pie chart of new vs returning">
                <SimplePieChart data={newVsReturningPieData} height={280} formatValue={(v) => v.toString()} />
              </ChartCard>

              <ChartCard title="Revenue by Customer Type" description="Revenue from new vs returning" ariaLabel="Pie chart of revenue by type">
                <SimplePieChart data={revenuePieData} height={280} formatValue={formatMoney} />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Visit Frequency Distribution" description="How often clients return" ariaLabel="Bar chart of visit frequency">
                <SimpleBarChart data={visitFrequencyData} height={280} formatValue={(v) => v.toString()} colorScheme="blue" />
              </ChartCard>

              <ChartCard title="Top 10 Clients by Spend" description="Highest value customers" ariaLabel="Bar chart of top clients">
                <SimpleBarChart data={topClientsBarData} height={280} formatValue={formatMoney} colorScheme="green" />
              </ChartCard>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">New Customer Revenue</h3>
                <p className="text-2xl font-bold">{formatMoney(newVsReturning.newRevenue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: {formatMoney(newVsReturning.newAvgSpend)} per client
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Returning Customer Revenue</h3>
                <p className="text-2xl font-bold">{formatMoney(newVsReturning.returningRevenue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: {formatMoney(newVsReturning.returningAvgSpend)} per client
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Avg Days Between Visits</h3>
                <p className="text-2xl font-bold">{retentionData.avgDaysBetweenVisits}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  For returning customers
                </p>
              </Card>
            </div>
          </TabsContent>

          {/* Retention Tab */}
          <TabsContent value="retention" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h3 className="text-sm font-medium mb-1">Retention Rate</h3>
                <p className="text-3xl font-bold text-primary">{retentionData.retentionRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {retentionData.returningClients} of {retentionData.totalClients} clients returned
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-1">Avg Visits per Client</h3>
                <p className="text-3xl font-bold">{retentionData.avgVisitsPerClient}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  During selected period
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-1">Avg Lifetime Value</h3>
                <p className="text-3xl font-bold">{formatMoney(retentionData.avgLTV)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Per customer
                </p>
              </Card>
            </div>

            <ChartCard title="Visit Frequency Distribution" description="Customer visit patterns" ariaLabel="Bar chart of visits">
              <SimpleBarChart data={visitFrequencyData} height={280} formatValue={(v) => v.toString()} colorScheme="blue" />
            </ChartCard>

            <DataTable
              title="Client Visit History"
              data={retentionTableData}
              columns={[
                { id: 'visits', label: 'Total Visits', format: 'number', align: 'right', defaultVisible: true, sortable: true },
                { id: 'totalSpend', label: 'Total Spend', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'avgSpend', label: 'Avg Spend', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'isReturning', label: 'Returning', format: 'text', align: 'center', sortable: true },
              ]}
              maxPreviewRows={15}
              showViewAll
            />
          </TabsContent>

          {/* Top Clients Tab */}
          <TabsContent value="top-clients" className="space-y-4">
            <ChartCard title="Top 10 Clients by Total Spend" description="Your highest value customers" ariaLabel="Bar chart of top clients">
              <SimpleBarChart data={topClientsBarData} height={280} formatValue={formatMoney} colorScheme="green" />
            </ChartCard>

            <DataTable
              title="Top Clients"
              data={topClientsTableData}
              columns={[
                { id: 'totalSpend', label: 'Total Spend', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'visits', label: 'Visits', format: 'number', align: 'right', defaultVisible: true, sortable: true },
                { id: 'avgSpend', label: 'Avg per Visit', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'daysSinceVisit', label: 'Days Since Last', format: 'number', align: 'right', defaultVisible: true, sortable: true },
              ]}
              maxPreviewRows={20}
              showViewAll
            />
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-4">
            <Card className="p-4 bg-muted/30">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Referral Source Tracking</p>
                  <p className="text-sm text-muted-foreground">Track where your customers come from to optimize marketing spend and focus on the highest-performing channels.</p>
                </div>
              </div>
            </Card>

            <ChartCard title="Clients by Referral Source" description="Where customers come from" ariaLabel="Bar chart of referral sources">
              <SimpleBarChart data={referralBarData} height={280} formatValue={(v) => v.toString()} colorScheme="blue" />
            </ChartCard>

            <DataTable
              title="Referral Sources"
              data={referralTableData}
              columns={[
                { id: 'clients', label: 'Clients', format: 'number', align: 'right', defaultVisible: true, sortable: true },
                { id: 'revenue', label: 'Total Revenue', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'avgLTV', label: 'Avg LTV', format: 'money', align: 'right', defaultVisible: true, sortable: true },
              ]}
              maxPreviewRows={15}
              showViewAll
            />
          </TabsContent>
        </Tabs>
      </ReportShell>

      <DefinitionsModal open={showDefinitions} onClose={() => setShowDefinitions(false)} />
    </>
  )
}
