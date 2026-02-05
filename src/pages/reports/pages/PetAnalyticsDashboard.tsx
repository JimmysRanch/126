/**
 * Pet Analytics Dashboard
 * Combines breed and weight class reports into a single comprehensive view
 */

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, ArrowsClockwise, Dog, Ruler, CurrencyDollar, CalendarBlank } from '@phosphor-icons/react'
import { ReportShell } from '../components/ReportShell'
import { KPIDeck } from '../components/KPICard'
import { ChartCard, SimpleBarChart, SimplePieChart } from '../components/ChartCard'
import { DataTable } from '../components/DataTable'
import { DefinitionsModal } from '../components/DefinitionsModal'
import { useReportFilters } from '../hooks/useReportFilters'
import { useReportData } from '../hooks/useReportData'
import { 
  calculateNetSales, 
  calculateTotalTips,
  calculateAppointmentsCompleted,
  calculateAverageTicket,
  calculateKPIWithDelta, 
  measurePerformance 
} from '../engine/analyticsEngine'

function getWeightClass(weightLbs: number | undefined): string {
  if (!weightLbs) return 'Unknown'
  if (weightLbs <= 20) return 'Small (0-20 lbs)'
  if (weightLbs <= 50) return 'Medium (21-50 lbs)'
  if (weightLbs <= 80) return 'Large (51-80 lbs)'
  return 'XLarge (81+ lbs)'
}

function getWeightClassShort(weightLbs: number | undefined): string {
  if (!weightLbs) return 'Unknown'
  if (weightLbs <= 20) return 'Small'
  if (weightLbs <= 50) return 'Medium'
  if (weightLbs <= 80) return 'Large'
  return 'XLarge'
}

export function PetAnalyticsDashboard() {
  const { filters, setFilters } = useReportFilters()
  const { 
    appointments, 
    previousAppointments,
    isLoading, 
    error 
  } = useReportData(filters)
  const [showDefinitions, setShowDefinitions] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // ============ Overview KPIs ============
  const overviewKpis = useMemo(() => {
    if (appointments.length === 0) return []

    return measurePerformance('calculatePetAnalyticsKPIs', () => {
      const currentRevenue = calculateNetSales(appointments)
      const previousRevenue = calculateNetSales(previousAppointments)
      
      const currentTips = calculateTotalTips(appointments)
      const previousTips = calculateTotalTips(previousAppointments)
      
      const currentAppts = calculateAppointmentsCompleted(appointments)
      const previousAppts = calculateAppointmentsCompleted(previousAppointments)
      
      const currentAvgTicket = calculateAverageTicket(appointments)
      const previousAvgTicket = calculateAverageTicket(previousAppointments)

      // Count unique breeds and weight classes
      const uniqueBreeds = new Set(appointments.filter(a => a.status === 'completed').map(a => a.petBreed || 'Unknown')).size
      const uniqueWeightClasses = new Set(appointments.filter(a => a.status === 'completed').map(a => getWeightClassShort(a.petWeight))).size

      return [
        { metricId: 'totalRevenue', value: calculateKPIWithDelta(currentRevenue, previousRevenue, 'money') },
        { metricId: 'totalAppointments', value: calculateKPIWithDelta(currentAppts, previousAppts, 'number') },
        { metricId: 'avgTicket', value: calculateKPIWithDelta(currentAvgTicket, previousAvgTicket, 'money') },
        { metricId: 'totalTips', value: calculateKPIWithDelta(currentTips, previousTips, 'money') },
        { metricId: 'uniqueBreeds', value: calculateKPIWithDelta(uniqueBreeds, 0, 'number') },
        { metricId: 'weightClasses', value: calculateKPIWithDelta(uniqueWeightClasses, 0, 'number') },
      ]
    })
  }, [appointments, previousAppointments])

  // ============ Weight Class Data ============
  const weightClassData = useMemo(() => {
    return measurePerformance('aggregateByWeightClass', () => {
      const byClass: Record<string, { revenue: number; tips: number; count: number; duration: number }> = {}

      appointments.filter(a => a.status === 'completed').forEach(appt => {
        const weightClass = getWeightClass(appt.petWeight)
        
        if (!byClass[weightClass]) {
          byClass[weightClass] = { revenue: 0, tips: 0, count: 0, duration: 0 }
        }
        byClass[weightClass].revenue += appt.netCents
        byClass[weightClass].tips += appt.tipCents
        byClass[weightClass].count += 1
        byClass[weightClass].duration += appt.actualDurationMinutes || appt.scheduledDurationMinutes || 60
      })

      const total = Object.values(byClass).reduce((sum, c) => sum + c.revenue, 0)
      const totalCount = Object.values(byClass).reduce((sum, c) => sum + c.count, 0)

      return Object.entries(byClass).map(([weightClass, data]) => ({
        weightClass,
        revenue: data.revenue,
        tips: data.tips,
        count: data.count,
        avgDuration: data.count > 0 ? Math.round(data.duration / data.count) : 0,
        revenueShare: total > 0 ? (data.revenue / total) * 100 : 0,
        volumeShare: totalCount > 0 ? (data.count / totalCount) * 100 : 0,
        avgTicket: data.count > 0 ? Math.round(data.revenue / data.count) : 0,
      }))
    })
  }, [appointments])

  // ============ Breed Data ============
  const breedData = useMemo(() => {
    return measurePerformance('aggregateByBreed', () => {
      const byBreed: Record<string, { revenue: number; count: number; duration: number; tips: number; pets: Set<string> }> = {}

      appointments.filter(a => a.status === 'completed').forEach(appt => {
        const breed = appt.petBreed || 'Unknown'
        
        if (!byBreed[breed]) {
          byBreed[breed] = { revenue: 0, count: 0, duration: 0, tips: 0, pets: new Set() }
        }
        byBreed[breed].revenue += appt.netCents || 0
        byBreed[breed].count += 1
        byBreed[breed].duration += appt.actualDurationMinutes || appt.scheduledDurationMinutes || 60
        byBreed[breed].tips += appt.tipCents || 0
        byBreed[breed].pets.add(appt.petId)
      })

      const total = Object.values(byBreed).reduce((sum, b) => sum + b.revenue, 0)
      const totalCount = Object.values(byBreed).reduce((sum, b) => sum + b.count, 0)

      return Object.entries(byBreed).map(([breed, data]) => ({
        breed,
        revenue: data.revenue,
        count: data.count,
        avgDuration: data.count > 0 ? Math.round(data.duration / data.count) : 0,
        tips: data.tips,
        revenueShare: total > 0 ? (data.revenue / total) * 100 : 0,
        volumeShare: totalCount > 0 ? (data.count / totalCount) * 100 : 0,
        avgTicket: data.count > 0 ? Math.round(data.revenue / data.count) : 0,
        uniquePets: data.pets.size,
        avgVisitsPerPet: data.pets.size > 0 ? Math.round((data.count / data.pets.size) * 10) / 10 : 0,
      }))
    })
  }, [appointments])

  // ============ Services Data ============
  const servicesByWeightData = useMemo(() => {
    const byCombo: Record<string, { count: number; revenue: number }> = {}

    appointments.forEach(appt => {
      if (appt.status !== 'completed') return
      const weightClass = getWeightClassShort(appt.petWeight)
      
      appt.services?.forEach((svc: any) => {
        const key = `${weightClass} - ${svc.name || 'Unknown'}`
        if (!byCombo[key]) {
          byCombo[key] = { count: 0, revenue: 0 }
        }
        byCombo[key].count += 1
        byCombo[key].revenue += svc.priceCents || 0
      })
    })

    return Object.entries(byCombo)
      .map(([combo, data]) => ({
        combo,
        count: data.count,
        revenue: data.revenue,
        avgPrice: data.count > 0 ? Math.round(data.revenue / data.count) : 0,
      }))
      .sort((a, b) => b.count - a.count)
  }, [appointments])

  // ============ Charts ============
  const weightClassPieData = useMemo(() => {
    return weightClassData.map(wc => ({
      label: wc.weightClass,
      value: wc.revenue,
    }))
  }, [weightClassData])

  const weightClassBarData = useMemo(() => {
    return weightClassData.map(wc => ({
      label: wc.weightClass.split(' ')[0],
      value: wc.avgTicket,
    }))
  }, [weightClassData])

  const topBreedsRevenueData = useMemo(() => {
    return breedData
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map(b => ({
        label: b.breed.length > 12 ? b.breed.substring(0, 10) + '...' : b.breed,
        value: b.revenue,
      }))
  }, [breedData])

  const topBreedsVolumeData = useMemo(() => {
    return breedData
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(b => ({
        label: b.breed.length > 12 ? b.breed.substring(0, 10) + '...' : b.breed,
        value: b.count,
      }))
  }, [breedData])

  // ============ Table Data ============
  const weightClassTableData = useMemo(() => {
    return weightClassData
      .sort((a, b) => b.revenue - a.revenue)
      .map(wc => ({
        dimensionValue: wc.weightClass,
        drillKey: `weightClass:${wc.weightClass}`,
        metrics: {
          revenue: wc.revenue,
          tips: wc.tips,
          appointments: wc.count,
          avgDuration: wc.avgDuration,
          revenueShare: wc.revenueShare,
          volumeShare: wc.volumeShare,
          avgTicket: wc.avgTicket,
        },
      }))
  }, [weightClassData])

  const breedTableData = useMemo(() => {
    return breedData
      .sort((a, b) => b.revenue - a.revenue)
      .map(b => ({
        dimensionValue: b.breed,
        drillKey: `breed:${b.breed}`,
        metrics: {
          revenue: b.revenue,
          appointments: b.count,
          avgDuration: b.avgDuration,
          tips: b.tips,
          revenueShare: b.revenueShare,
          avgTicket: b.avgTicket,
          uniquePets: b.uniquePets,
          avgVisitsPerPet: b.avgVisitsPerPet,
        },
      }))
  }, [breedData])

  const servicesTableData = useMemo(() => {
    return servicesByWeightData.slice(0, 30).map(s => ({
      dimensionValue: s.combo,
      drillKey: `combo:${s.combo}`,
      metrics: {
        count: s.count,
        revenue: s.revenue,
        avgPrice: s.avgPrice,
      },
    }))
  }, [servicesByWeightData])

  // ============ Handlers ============
  const formatMoney = (v: number) => `$${(v / 100).toLocaleString()}`

  // ============ Loading State ============
  if (isLoading) {
    return (
      <ReportShell title="Pet Analytics" description="Comprehensive breed and weight class insights" defaultTimeBasis="service">
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
      <ReportShell title="Pet Analytics" description="Comprehensive breed and weight class insights" defaultTimeBasis="service">
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
      <ReportShell title="Pet Analytics" description="Comprehensive breed and weight class insights" defaultTimeBasis="service">
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
        title="Pet Analytics"
        description="Comprehensive breed and weight class insights"
        defaultTimeBasis="service"
        onShowDefinitions={() => setShowDefinitions(true)}
      >
        {/* KPI Deck */}
        <KPIDeck metrics={overviewKpis} />

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Dog size={16} weight="duotone" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center gap-2">
              <Ruler size={16} weight="duotone" />
              <span className="hidden sm:inline">By Size</span>
            </TabsTrigger>
            <TabsTrigger value="breed" className="flex items-center gap-2">
              <CurrencyDollar size={16} weight="duotone" />
              <span className="hidden sm:inline">By Breed</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <CalendarBlank size={16} weight="duotone" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Revenue by Weight Class" description="Distribution of revenue across dog sizes" ariaLabel="Pie chart of revenue by weight class">
                <SimplePieChart data={weightClassPieData} height={280} formatValue={formatMoney} />
              </ChartCard>

              <ChartCard title="Top 10 Breeds by Revenue" description="Highest earning breeds" ariaLabel="Bar chart of revenue by breed">
                <SimpleBarChart data={topBreedsRevenueData} height={280} formatValue={formatMoney} />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Average Ticket by Size" description="Avg spend per appointment by weight class" ariaLabel="Bar chart of avg ticket by weight class">
                <SimpleBarChart data={weightClassBarData} height={280} formatValue={formatMoney} colorScheme="green" />
              </ChartCard>

              <ChartCard title="Top 10 Breeds by Volume" description="Most frequently groomed breeds" ariaLabel="Bar chart of appointments by breed">
                <SimpleBarChart data={topBreedsVolumeData} height={280} formatValue={(v) => v.toString()} colorScheme="blue" />
              </ChartCard>
            </div>
          </TabsContent>

          {/* Weight Class Tab */}
          <TabsContent value="weight" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Revenue Distribution" description="Revenue share by weight class" ariaLabel="Pie chart of revenue by weight class">
                <SimplePieChart data={weightClassPieData} height={280} formatValue={formatMoney} />
              </ChartCard>

              <ChartCard title="Average Ticket by Size" description="Average revenue per appointment" ariaLabel="Bar chart of average ticket by weight class">
                <SimpleBarChart data={weightClassBarData} height={280} formatValue={formatMoney} colorScheme="green" />
              </ChartCard>
            </div>

            <DataTable
              title="Weight Class Details"
              data={weightClassTableData}
              columns={[
                { id: 'revenue', label: 'Revenue', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'tips', label: 'Tips', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'appointments', label: 'Appointments', format: 'number', align: 'right', defaultVisible: true, sortable: true },
                { id: 'avgDuration', label: 'Avg Duration', format: 'minutes', align: 'right', defaultVisible: true, sortable: true },
                { id: 'revenueShare', label: 'Revenue %', format: 'percent', align: 'right', sortable: true },
                { id: 'volumeShare', label: 'Volume %', format: 'percent', align: 'right', sortable: true },
                { id: 'avgTicket', label: 'Avg Ticket', format: 'money', align: 'right', defaultVisible: true, sortable: true },
              ]}
              maxPreviewRows={10}
              showViewAll
            />
          </TabsContent>

          {/* Breed Tab */}
          <TabsContent value="breed" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Top 10 by Revenue" description="Highest earning breeds" ariaLabel="Bar chart of revenue by breed">
                <SimpleBarChart data={topBreedsRevenueData} height={280} formatValue={formatMoney} />
              </ChartCard>

              <ChartCard title="Top 10 by Volume" description="Most frequently groomed breeds" ariaLabel="Bar chart of appointments by breed">
                <SimpleBarChart data={topBreedsVolumeData} height={280} formatValue={(v) => v.toString()} colorScheme="blue" />
              </ChartCard>
            </div>

            <DataTable
              title="Breed Details"
              data={breedTableData}
              columns={[
                { id: 'revenue', label: 'Revenue', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'appointments', label: 'Appointments', format: 'number', align: 'right', defaultVisible: true, sortable: true },
                { id: 'avgDuration', label: 'Avg Duration', format: 'minutes', align: 'right', defaultVisible: true, sortable: true },
                { id: 'tips', label: 'Tips', format: 'money', align: 'right', sortable: true },
                { id: 'revenueShare', label: 'Revenue %', format: 'percent', align: 'right', sortable: true },
                { id: 'avgTicket', label: 'Avg Ticket', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'uniquePets', label: 'Unique Pets', format: 'number', align: 'right', sortable: true },
                { id: 'avgVisitsPerPet', label: 'Visits/Pet', format: 'number', align: 'right', sortable: true },
              ]}
              maxPreviewRows={15}
              showViewAll
            />
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <Card className="p-4 bg-muted/30">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Service Breakdown by Pet Size</p>
                  <p className="text-sm text-muted-foreground">This view shows which services are most popular for each weight class, helping optimize service offerings and pricing.</p>
                </div>
              </div>
            </Card>

            <DataTable
              title="Services by Weight Class"
              data={servicesTableData}
              columns={[
                { id: 'count', label: 'Times Sold', format: 'number', align: 'right', defaultVisible: true, sortable: true },
                { id: 'revenue', label: 'Revenue', format: 'money', align: 'right', defaultVisible: true, sortable: true },
                { id: 'avgPrice', label: 'Avg Price', format: 'money', align: 'right', defaultVisible: true, sortable: true },
              ]}
              maxPreviewRows={20}
              showViewAll
            />
          </TabsContent>
        </Tabs>
      </ReportShell>

      <DefinitionsModal open={showDefinitions} onClose={() => setShowDefinitions(false)} />
    </>
  )
}
