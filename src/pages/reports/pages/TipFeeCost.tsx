/**
 * Tip Fee Cost Report
 * Track tip processing fees and net amounts to staff
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

export function TipFeeCost() {
  const { filters, setFilters } = useReportFilters()
  const { appointments, transactions, staff, isLoading, error } = useReportData(filters)
  const [showDefinitions, setShowDefinitions] = useState(false)

  // Calculate KPIs
  const kpis = useMemo(() => {
    if (appointments.length === 0) return []

    const totalTips = appointments.reduce((sum, a) => sum + (a.tipCents || 0), 0)
    const tipFeeRate = 0.029 // 2.9% typical processing fee
    const tipFees = Math.round(totalTips * tipFeeRate)
    const netToStaff = totalTips - tipFees

    return [
      { metricId: 'totalTips', value: { current: totalTips, delta: 0, deltaPercent: 0, format: 'money' as const } },
      { metricId: 'tipFees', value: { current: tipFees, delta: 0, deltaPercent: 0, format: 'money' as const } },
      { metricId: 'netToStaff', value: { current: netToStaff, delta: 0, deltaPercent: 0, format: 'money' as const } },
      { metricId: 'feeRate', value: { current: tipFeeRate * 100, delta: 0, deltaPercent: 0, format: 'percent' as const } },
    ]
  }, [appointments])

  // Table data by staff
  const tableData = useMemo(() => {
    const staffTips: Record<string, { tips: number; appointments: number }> = {}

    appointments.forEach(appt => {
      const staffId = appt.groomerId || 'unassigned'
      const staffName = staff.find(s => s.id === staffId)?.name || 'Unassigned'
      if (!staffTips[staffName]) {
        staffTips[staffName] = { tips: 0, appointments: 0 }
      }
      staffTips[staffName].tips += appt.tipCents || 0
      staffTips[staffName].appointments += 1
    })

    return Object.entries(staffTips).map(([name, data]) => {
      const tipFee = Math.round(data.tips * 0.029)
      return {
        dimensionValue: name,
        drillKey: `staff:${name}`,
        metrics: {
          tips: data.tips,
          tipFee,
          netToStaff: data.tips - tipFee,
          appointments: data.appointments,
          avgTip: data.appointments > 0 ? Math.round(data.tips / data.appointments) : 0,
        },
      }
    })
  }, [appointments, staff])

  if (isLoading) {
    return (
      <ReportShell title="Tip Fee Cost" description="Tip processing fees and net amounts" defaultTimeBasis="checkout">
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-3"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-8 w-24" /></Card>
            ))}
          </div>
          <Skeleton className="h-[300px]" />
        </div>
      </ReportShell>
    )
  }

  if (error) {
    return (
      <ReportShell title="Tip Fee Cost" description="Tip processing fees and net amounts" defaultTimeBasis="checkout">
        <Alert variant="destructive">
          <AlertDescription>Failed to load data.</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          <ArrowsClockwise className="mr-2 h-4 w-4" /> Retry
        </Button>
      </ReportShell>
    )
  }

  if (appointments.length === 0) {
    return (
      <ReportShell title="Tip Fee Cost" description="Tip processing fees and net amounts" defaultTimeBasis="checkout">
        <Card className="p-8 text-center">
          <Info size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No Data</h2>
          <p className="text-muted-foreground mb-4">No appointments with tips found.</p>
          <Button variant="outline" onClick={() => setFilters({ ...filters, dateRange: 'last90' })}>Try Last 90 Days</Button>
        </Card>
      </ReportShell>
    )
  }

  return (
    <>
      <ReportShell
        title="Tip Fee Cost"
        description="Track tip processing fees and net amounts to staff"
        defaultTimeBasis="checkout"
        onShowDefinitions={() => setShowDefinitions(true)}
      >
        <KPIDeck metrics={kpis} />

        <DataTable
          title="Tip Fees by Staff"
          data={tableData}
          columns={[
            { id: 'tips', label: 'Total Tips', format: 'money', align: 'right', defaultVisible: true, sortable: true },
            { id: 'tipFee', label: 'Tip Fees', format: 'money', align: 'right', defaultVisible: true, sortable: true },
            { id: 'netToStaff', label: 'Net to Staff', format: 'money', align: 'right', defaultVisible: true, sortable: true },
            { id: 'appointments', label: 'Appointments', format: 'number', align: 'right', defaultVisible: true, sortable: true },
            { id: 'avgTip', label: 'Avg Tip', format: 'money', align: 'right', sortable: true },
          ]}
          maxPreviewRows={10}
          showViewAll
        />
      </ReportShell>

      <DefinitionsModal open={showDefinitions} onClose={() => setShowDefinitions(false)} />
    </>
  )
}
