/**
 * Pet List Report
 * Detailed roster of pets
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

function getWeightClass(weightLbs: number | undefined): string {
  if (!weightLbs) return 'Unknown'
  if (weightLbs <= 20) return 'Small'
  if (weightLbs <= 50) return 'Medium'
  if (weightLbs <= 80) return 'Large'
  return 'XLarge'
}

export function PetList() {
  const { filters, setFilters } = useReportFilters()
  const { appointments, clients, isLoading, error } = useReportData(filters)
  const [showDefinitions, setShowDefinitions] = useState(false)

  // Build pet roster
  const petData = useMemo(() => {
    const pets: Record<string, { 
      name: string
      breed: string
      weight: number | undefined
      weightClass: string
      clientId: string
      clientName: string
      visits: number
      lastVisit: string
      totalSpend: number
    }> = {}

    appointments.forEach(appt => {
      const petId = appt.petId || `${appt.clientId}-${appt.petName || 'pet'}`
      const client = clients.find(c => c.id === appt.clientId)
      
      if (!pets[petId]) {
        pets[petId] = {
          name: appt.petName || 'Unknown',
          breed: appt.petBreed || 'Unknown',
          weight: appt.petWeight,
          weightClass: getWeightClass(appt.petWeight),
          clientId: appt.clientId || '',
          clientName: client?.name || 'Unknown',
          visits: 0,
          lastVisit: appt.serviceDate,
          totalSpend: 0,
        }
      }
      
      pets[petId].visits += 1
      pets[petId].totalSpend += appt.netCents || 0
      if (appt.serviceDate > pets[petId].lastVisit) {
        pets[petId].lastVisit = appt.serviceDate
      }
    })

    return Object.entries(pets).map(([petId, data]) => ({
      petId,
      ...data,
      avgTicket: data.visits > 0 ? Math.round(data.totalSpend / data.visits) : 0,
    }))
  }, [appointments, clients])

  // KPIs
  const kpis = useMemo(() => {
    const totalPets = petData.length
    const totalVisits = petData.reduce((sum, p) => sum + p.visits, 0)
    const totalSpend = petData.reduce((sum, p) => sum + p.totalSpend, 0)
    const uniqueBreeds = new Set(petData.map(p => p.breed)).size

    return [
      { metricId: 'totalPets', value: { current: totalPets, delta: 0, deltaPercent: 0, format: 'number' as const } },
      { metricId: 'totalVisits', value: { current: totalVisits, delta: 0, deltaPercent: 0, format: 'number' as const } },
      { metricId: 'totalSpend', value: { current: totalSpend, delta: 0, deltaPercent: 0, format: 'money' as const } },
      { metricId: 'uniqueBreeds', value: { current: uniqueBreeds, delta: 0, deltaPercent: 0, format: 'number' as const } },
    ]
  }, [petData])

  // Table data
  const tableData = useMemo(() => {
    return petData
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .map(p => ({
        dimensionValue: p.name,
        drillKey: `pet:${p.petId}`,
        metrics: {
          breed: p.breed,
          weightClass: p.weightClass,
          clientName: p.clientName,
          visits: p.visits,
          totalSpend: p.totalSpend,
          avgTicket: p.avgTicket,
          lastVisit: p.lastVisit,
        },
      }))
  }, [petData])

  if (isLoading) {
    return (
      <ReportShell title="Pet List" description="Pet roster" defaultTimeBasis="service">
        <Skeleton className="h-[400px]" />
      </ReportShell>
    )
  }

  if (error) {
    return (
      <ReportShell title="Pet List" description="Pet roster" defaultTimeBasis="service">
        <Alert variant="destructive"><AlertDescription>Failed to load data.</AlertDescription></Alert>
        <Button onClick={() => window.location.reload()} className="mt-4"><ArrowsClockwise className="mr-2 h-4 w-4" /> Retry</Button>
      </ReportShell>
    )
  }

  if (appointments.length === 0) {
    return (
      <ReportShell title="Pet List" description="Pet roster" defaultTimeBasis="service">
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
      <ReportShell title="Pet List" description="Detailed pet roster" defaultTimeBasis="service" onShowDefinitions={() => setShowDefinitions(true)}>
        <KPIDeck metrics={kpis} />
        <DataTable
          title="Pet Roster"
          data={tableData}
          columns={[
            { id: 'breed', label: 'Breed', format: 'text', align: 'left', defaultVisible: true, sortable: true },
            { id: 'weightClass', label: 'Size', format: 'text', align: 'left', defaultVisible: true, sortable: true },
            { id: 'clientName', label: 'Owner', format: 'text', align: 'left', defaultVisible: true, sortable: true },
            { id: 'visits', label: 'Visits', format: 'number', align: 'right', defaultVisible: true, sortable: true },
            { id: 'totalSpend', label: 'Total Spend', format: 'money', align: 'right', sortable: true },
            { id: 'lastVisit', label: 'Last Visit', format: 'text', align: 'left', sortable: true },
          ]}
          maxPreviewRows={25}
          showViewAll
        />
      </ReportShell>
      <DefinitionsModal open={showDefinitions} onClose={() => setShowDefinitions(false)} />
    </>
  )
}
