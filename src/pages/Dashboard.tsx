import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookedGauge } from './dashboard/components/BookedGauge'
import { RecentActivity } from './dashboard/components/RecentActivity'
import { GroomersWorkloadCard } from './dashboard/components/GroomersWorkloadCard'
import { GroomerAvgCard } from './dashboard/components/GroomerAvgCard'
import { ExpensesCard } from './dashboard/components/ExpensesCard'
import { DogsGroomedCard } from './dashboard/components/DogsGroomedCard'
import { BookedPercentageCard } from './dashboard/components/BookedPercentageCard'
import { ClientsCard } from './dashboard/components/ClientsCard'
import { 
  appointmentData, 
  capacityData, 
  revenueData, 
  issuesData,
  dogsGroomedData,
  bookedPercentageData,
  clientsData
} from './dashboard/data/dashboardMockData'
import { calculateAppointmentProgress } from './dashboard/utils/dashboardCalculations'
import { CheckCircle, XCircle, Clock, Warning } from '@phosphor-icons/react'
import { useKV } from "@github/spark/hooks"

function AnimatedNumber({ value, delay = 0, prefix = '', suffix = '' }: { value: number; delay?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0
      const increment = value / 60
      const interval = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(interval)
        } else {
          setCount(Math.floor(current))
        }
      }, 16)
      return () => clearInterval(interval)
    }, delay * 1000)
    return () => clearTimeout(timer)
  }, [value, delay])

  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  )
}

export function Dashboard() {
  const [appointmentsSummary] = useKV<typeof appointmentData>("dashboard-appointments-summary", appointmentData)
  const [capacitySummary] = useKV<typeof capacityData>("dashboard-capacity", capacityData)
  const [revenueSummary] = useKV<typeof revenueData>("dashboard-revenue-data", revenueData)
  const [issuesSummary] = useKV<typeof issuesData>("dashboard-issues", issuesData)
  const [dogsGroomedSummary] = useKV<typeof dogsGroomedData>("dashboard-dogs-groomed", dogsGroomedData)
  const [bookedSummary] = useKV<typeof bookedPercentageData>("dashboard-booked-percentage", bookedPercentageData)
  const [clientsSummary] = useKV<typeof clientsData>("dashboard-clients-summary", clientsData)
  const appointmentStats = appointmentsSummary || appointmentData
  const capacityStats = capacitySummary || capacityData
  const revenueStats = revenueSummary || revenueData
  const issuesStats = issuesSummary || issuesData
  const dogsGroomedStats = dogsGroomedSummary || dogsGroomedData
  const bookedStats = bookedSummary || bookedPercentageData
  const clientsStats = clientsSummary || clientsData
  const progress = calculateAppointmentProgress(appointmentStats)

  return (
    <div className="h-[calc(100vh-57px)] overflow-hidden bg-background p-3">
      <div className="h-full grid grid-rows-3 gap-3">
        
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-card rounded-xl p-3 border border-border flex flex-col overflow-hidden">
            <h2 className="text-sm font-semibold mb-1.5 flex-shrink-0">Appointments Today</h2>
            <div className="flex-1 min-h-0 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs flex-shrink-0">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="text-muted-foreground truncate">Scheduled</span>
                </div>
                <div className="font-semibold text-right">
                  <AnimatedNumber value={appointmentStats.today.scheduled} delay={0.1} />
                </div>
                
                <div className="flex items-center gap-1">
                  <CheckCircle size={10} className="text-green-500 flex-shrink-0" weight="fill" />
                  <span className="text-muted-foreground truncate">Completed</span>
                </div>
                <div className="font-semibold text-right">
                  <AnimatedNumber value={appointmentStats.today.completed} delay={0.15} />
                </div>
                
                <div className="flex items-center gap-1">
                  <XCircle size={10} className="text-red-500 flex-shrink-0" weight="fill" />
                  <span className="text-muted-foreground truncate">Canceled</span>
                </div>
                <div className="font-semibold text-right">
                  <AnimatedNumber value={appointmentStats.today.canceled} delay={0.2} />
                </div>
                
                <div className="flex items-center gap-1">
                  <Warning size={10} className="text-orange-500 flex-shrink-0" weight="fill" />
                  <span className="text-muted-foreground truncate">No-Shows</span>
                </div>
                <div className="font-semibold text-right">
                  <AnimatedNumber value={appointmentStats.today.noShows} delay={0.25} />
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock size={10} className="text-yellow-500 flex-shrink-0" weight="fill" />
                  <span className="text-muted-foreground truncate">Late</span>
                </div>
                <div className="font-semibold text-right">
                  <AnimatedNumber value={appointmentStats.today.late} delay={0.3} />
                </div>
              </div>

              <div className="space-y-0.5 mt-1.5 flex-shrink-0">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Day Progress</span>
                  <span>
                    <AnimatedNumber value={progress.completed} delay={0.35} /> / <AnimatedNumber value={progress.total} delay={0.35} />
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress.percentageComplete}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-3 border border-border flex flex-col overflow-hidden">
            <h2 className="text-sm font-semibold mb-2 flex-shrink-0">Booked</h2>
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <BookedGauge 
                percentage={capacityStats.bookedPercentage} 
                target={capacityStats.target}
                delay={0.2}
              />
            </div>
          </div>

          <div className="bg-card rounded-xl p-3 border border-border flex flex-col overflow-hidden">
            <h2 className="text-sm font-semibold mb-1.5 flex-shrink-0">Expected Revenue</h2>
            <div className="flex-1 min-h-0 flex flex-col justify-between">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold">
                  <AnimatedNumber value={revenueStats.today.total} delay={0.3} prefix="$" />
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Total Revenue Today</div>
              </div>
              
              <div className="pt-1.5 border-t border-border space-y-0.5 flex-shrink-0">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Profit After Commissions</span>
                  <span className="font-semibold text-green-500">
                    <AnimatedNumber value={revenueStats.today.profit} delay={0.35} prefix="$" />
                  </span>
                </div>
                
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Tips (excluded)</span>
                  <span className="font-medium">
                    <AnimatedNumber value={revenueStats.today.tips} delay={0.4} prefix="$" />
                  </span>
                </div>
                
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Commission estimate</span>
                  <span className="font-medium">
                    <AnimatedNumber value={revenueStats.today.commission} delay={0.45} prefix="$" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-3 border border-border flex flex-col overflow-hidden">
            <h2 className="text-sm font-semibold mb-1.5 flex-shrink-0">Issues</h2>
            <div className="flex-1 min-h-0 flex flex-col justify-between gap-1">
              <div className="flex items-center justify-between p-1.5 bg-destructive/10 rounded-lg flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-yellow-500 flex-shrink-0" weight="duotone" />
                  <span className="text-xs truncate">Late arrivals</span>
                </div>
                <div className="text-lg font-bold">
                  <AnimatedNumber value={issuesStats.lateArrivals} delay={0.35} />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-1.5 bg-destructive/10 rounded-lg flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <Warning size={14} className="text-orange-500 flex-shrink-0" weight="duotone" />
                  <span className="text-xs truncate">No-shows</span>
                </div>
                <div className="text-lg font-bold">
                  <AnimatedNumber value={issuesStats.noShows} delay={0.4} />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-1.5 bg-destructive/10 rounded-lg flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <XCircle size={14} className="text-red-500 flex-shrink-0" weight="duotone" />
                  <span className="text-xs truncate">Canceled</span>
                </div>
                <div className="text-lg font-bold">
                  <AnimatedNumber value={issuesStats.canceled} delay={0.45} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Link
            to="/recent-activity"
            className="col-span-2 bg-card rounded-xl border border-border flex flex-col overflow-hidden transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="p-3 pb-1.5 flex-shrink-0">
              <h2 className="text-sm font-semibold">Recent Activity</h2>
            </div>
            <div className="overflow-y-auto px-3 pb-3 scrollbar-thin flex-1 min-h-0">
              <RecentActivity />
            </div>
          </Link>

          <div className="bg-card rounded-xl p-3 border border-border flex flex-col overflow-hidden">
            <div className="mb-1.5 flex-shrink-0">
              <h2 className="text-sm font-semibold">Groomers Workload</h2>
              <p className="text-[10px] text-muted-foreground">Today's Schedule</p>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <GroomersWorkloadCard />
            </div>
          </div>

          <div className="bg-card rounded-xl p-3 border border-border flex flex-col overflow-hidden">
            <div className="mb-1.5 flex-shrink-0">
              <h2 className="text-sm font-semibold">Groomer Avg</h2>
              <p className="text-[10px] text-muted-foreground">Lifetime Metrics</p>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <GroomerAvgCard />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-card rounded-xl p-3 border border-border flex flex-col overflow-hidden">
            <div className="mb-1.5 flex-shrink-0">
              <h2 className="text-sm font-semibold">Expenses</h2>
              <p className="text-[10px] text-muted-foreground">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <ExpensesCard />
            </div>
          </div>

          <div className="bg-card rounded-xl p-3 border border-border flex flex-col overflow-hidden">
            <div className="mb-1.5 flex-shrink-0">
              <h2 className="text-sm font-semibold">Completed Appointments</h2>
              <p className="text-[10px] text-muted-foreground">Appointment History</p>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <DogsGroomedCard data={dogsGroomedStats} />
            </div>
          </div>

          <div className="bg-card rounded-xl p-3 border border-border flex flex-col overflow-hidden">
            <div className="mb-1.5 flex-shrink-0">
              <h2 className="text-sm font-semibold">Booked %</h2>
              <p className="text-[10px] text-muted-foreground">Store Capacity</p>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <BookedPercentageCard data={bookedStats} />
            </div>
          </div>

          <div className="bg-card rounded-xl p-3 border border-border flex flex-col overflow-hidden">
            <div className="mb-1.5 flex-shrink-0">
              <h2 className="text-sm font-semibold">Clients</h2>
              <p className="text-[10px] text-muted-foreground">Client Metrics</p>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <ClientsCard data={clientsStats} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
