/**
 * Top Clients Report
 * Lifetime spend and visit history
 */

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Info, ArrowsClockwise } from '@phosphor-icons/react'
import { ReportShell } from '../components/ReportShell'
import { KPIDeck } from '../components/KPICard'
import { DataTable } from '../components/DataTable'
import { DefinitionsModal } from '../components/DefinitionsModal'
import { useReportFilters } from '../hooks/useReportFilters'
import { useReportData } from '../hooks/useReportData'

export function TopClients() {
  const { filters, setFilters } = useReportFilters()
  const { appointments, clients, isLoading, error } = useReportData(filters)
  const [showDefinitions, setShowDefinitions] = useState(false)

  // Calculate client metrics
  const clientData = useMemo(() => {
    const byClient: Record<string, { spend: number; visits: number; tips: number; firstVisit: string; lastVisit: string }> = {}

    appointments.forEach(appt => {
      if (appt.status !== 'completed') return
      const clientId = appt.clientId
      if (!clientId) return
      
      if (!byClient[clientId]) {
        byClient[clientId] = { spend: 0, visits: 0, tips: 0, firstVisit: appt.serviceDate, lastVisit: appt.serviceDate }
      }
      byClient[clientId].spend += appt.netCents || 0
      byClient[clientId].visits += 1
      byClient[clientId].tips += appt.tipCents || 0
      
      if (appt.serviceDate < byClient[clientId].firstVisit) {
        byClient[clientId].firstVisit = appt.serviceDate
      }
      if (appt.serviceDate > byClient[clientId].lastVisit) {
        byClient[clientId].lastVisit = appt.serviceDate
      }
    })

    return Object.entries(byClient).map(([clientId, data]) => {
      const client = clients.find(c => c.id === clientId)
      return {
        clientId,
        clientName: client?.name || 'Unknown',
        lifetimeSpend: data.spend,
        visits: data.visits,
        tips: data.tips,
        avgTicket: data.visits > 0 ? Math.round(data.spend / data.visits) : 0,
        firstVisit: data.firstVisit,
        lastVisit: data.lastVisit,
      }
    })
  }, [appointments, clients])

  // KPIs
  const kpis = useMemo(() => {
    const totalSpend = clientData.reduce((sum, c) => sum + c.lifetimeSpend, 0)
    const topClient = clientData.sort((a, b) => b.lifetimeSpend - a.lifetimeSpend)[0]
    const avgSpend = clientData.length > 0 ? Math.round(totalSpend / clientData.length) : 0

    return [
      { metricId: 'totalClients', value: { current: clientData.length, delta: 0, deltaPercent: 0, format: 'number' as const } },
      { metricId: 'totalSpend', value: { current: totalSpend, delta: 0, deltaPercent: 0, format: 'money' as const } },
      { metricId: 'avgSpend', value: { current: avgSpend, delta: 0, deltaPercent: 0, format: 'money' as const } },
      { metricId: 'topClientSpend', value: { current: topClient?.lifetimeSpend || 0, delta: 0, deltaPercent: 0, format: 'money' as const } },
    ]
  }, [clientData])

  // Table data - top clients
  const tableData = useMemo(() => {
    return clientData
      .sort((a, b) => b.lifetimeSpend - a.lifetimeSpend)
      .map(c => ({
        dimensionValue: c.clientName,
        drillKey: `client:${c.clientId}`,
        metrics: {
          lifetimeSpend: c.lifetimeSpend,
          visits: c.visits,
          avgTicket: c.avgTicket,
          tips: c.tips,
          lastVisit: c.lastVisit,
        },
      }))
  }, [clientData])

  if (isLoading) {
    return (
      <ReportShell title="Top Clients" description="Lifetime spend" defaultTimeBasis="service">
        <Skeleton className="h-[400px]" />
      </ReportShell>
    )
  }

  if (error) {
    return (
      <ReportShell title="Top Clients" description="Lifetime spend" defaultTimeBasis="service">
        <Alert variant="destructive"><AlertDescription>Failed to load data.</AlertDescription></Alert>
        <Button onClick={() => window.location.reload()} className="mt-4"><ArrowsClockwise className="mr-2 h-4 w-4" /> Retry</Button>
      </ReportShell>
    )
  }

  if (appointments.length === 0) {
    return (
      <ReportShell title="Top Clients" description="Lifetime spend" defaultTimeBasis="service">
        <Card className="p-8 text-center">
          <Info size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No Data</h2>
          <Button variant="outline" onClick={() => setFilters({ ...filters, dateRange: 'last90' })}>Try Last 90 Days</Button>
        </Card>
      </ReportShell>
    )
  }

  return (
    <>
      <ReportShell title="Top Clients" description="Lifetime spend and visit history" defaultTimeBasis="service" onShowDefinitions={() => setShowDefinitions(true)}>
        <KPIDeck metrics={kpis} />
        <DataTable
          title="Client Rankings"
          data={tableData}
          columns={[
            { id: 'lifetimeSpend', label: 'Lifetime Spend', format: 'money', align: 'right', defaultVisible: true, sortable: true },
            { id: 'visits', label: 'Total Visits', format: 'number', align: 'right', defaultVisible: true, sortable: true },
            { id: 'avgTicket', label: 'Avg Ticket', format: 'money', align: 'right', defaultVisible: true, sortable: true },
            { id: 'tips', label: 'Total Tips', format: 'money', align: 'right', sortable: true },
            { id: 'lastVisit', label: 'Last Visit', format: 'text', align: 'left', sortable: true },
          ]}
          maxPreviewRows={20}
          showViewAll
        />
      </ReportShell>
      <DefinitionsModal open={showDefinitions} onClose={() => setShowDefinitions(false)} />
    </>
  )
}
