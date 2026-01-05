import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { KpiCard } from './dashboard/components/KpiCard'
import { BookedGauge } from './dashboard/components/BookedGauge'
import { TopBreedsCard } from './dashboard/components/TopBreedsCard'
import { GroomerUtilization } from './dashboard/components/GroomerUtilization'
import { RecentActivity } from './dashboard/components/RecentActivity'
import { GroomersWorkloadCard } from './dashboard/components/GroomersWorkloadCard'
import { GroomerAvgCard } from './dashboard/components/GroomerAvgCard'
import { ExpensesCard } from './dashboard/components/ExpensesCard'
import { 
  appointmentData, 
  capacityData, 
  revenueData, 
  issuesData,
  bookingRateData,
  clientMetrics,
  bookingSummary
} from './dashboard/data/dashboardMockData'
import { calculateAppointmentProgress, formatCurrency } from './dashboard/utils/dashboardCalculations'
import { CheckCircle, XCircle, Clock, Warning } from '@phosphor-icons/react'

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
  const progress = calculateAppointmentProgress()

  return (
    <div className="bg-background text-foreground px-4 sm:px-6 py-4 sm:py-6 h-[calc(100vh-120px)] overflow-hidden">
      <div className="max-w-[1600px] mx-auto h-full grid grid-rows-3 gap-3">
        
        <div className="min-h-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard title="Appointments Today" delay={0} className="xl:col-span-1">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-muted-foreground">Scheduled</span>
                </div>
                <div className="font-semibold text-right">
                  <AnimatedNumber value={appointmentData.today.scheduled} delay={0.1} />
                </div>
                
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={10} className="text-green-500" weight="fill" />
                  <span className="text-muted-foreground">Completed</span>
                </div>
                <div className="font-semibold text-right">
                  <AnimatedNumber value={appointmentData.today.completed} delay={0.15} />
                </div>
                
                <div className="flex items-center gap-1.5">
                  <XCircle size={10} className="text-red-500" weight="fill" />
                  <span className="text-muted-foreground">Canceled</span>
                </div>
                <div className="font-semibold text-right">
                  <AnimatedNumber value={appointmentData.today.canceled} delay={0.2} />
                </div>
                
                <div className="flex items-center gap-1.5">
                  <Warning size={10} className="text-orange-500" weight="fill" />
                  <span className="text-muted-foreground">No-Shows</span>
                </div>
                <div className="font-semibold text-right">
                  <AnimatedNumber value={appointmentData.today.noShows} delay={0.25} />
                </div>
                
                <div className="flex items-center gap-1.5">
                  <Clock size={10} className="text-yellow-500" weight="fill" />
                  <span className="text-muted-foreground">Late</span>
                </div>
                <div className="font-semibold text-right">
                  <AnimatedNumber value={appointmentData.today.late} delay={0.3} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Day Progress</span>
                  <span>
                    <AnimatedNumber value={progress.completed} delay={0.35} /> / <AnimatedNumber value={progress.total} delay={0.35} />
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentageComplete}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </KpiCard>

          <KpiCard title="Booked" delay={0.1} className="xl:col-span-1">
            <BookedGauge 
              percentage={capacityData.bookedPercentage} 
              target={capacityData.target}
              delay={0.2}
            />
          </KpiCard>

          <KpiCard title="Expected Revenue" delay={0.2} className="xl:col-span-1">
            <div className="space-y-2">
              <div>
                <div className="text-xl sm:text-2xl font-bold">
                  <AnimatedNumber value={revenueData.today.total} delay={0.3} prefix="$" />
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Total Revenue Today</div>
              </div>
              
              <div className="pt-2 border-t border-border space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Profit After Commissions</span>
                  <span className="font-semibold text-green-500">
                    <AnimatedNumber value={revenueData.today.profit} delay={0.35} prefix="$" />
                  </span>
                </div>
                
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Tips (excluded)</span>
                  <span className="font-medium">
                    <AnimatedNumber value={revenueData.today.tips} delay={0.4} prefix="$" />
                  </span>
                </div>
                
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Commission estimate</span>
                  <span className="font-medium">
                    <AnimatedNumber value={revenueData.today.commission} delay={0.45} prefix="$" />
                  </span>
                </div>
              </div>
            </div>
          </KpiCard>

          <KpiCard title="Issues" delay={0.3} className="xl:col-span-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-yellow-500 sm:hidden" weight="duotone" />
                  <Clock size={16} className="text-yellow-500 hidden sm:block" weight="duotone" />
                  <span className="text-xs">Late arrivals</span>
                </div>
                <div className="text-base sm:text-lg font-bold">
                  <AnimatedNumber value={issuesData.lateArrivals} delay={0.35} />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <Warning size={14} className="text-orange-500 sm:hidden" weight="duotone" />
                  <Warning size={16} className="text-orange-500 hidden sm:block" weight="duotone" />
                  <span className="text-xs">No-shows</span>
                </div>
                <div className="text-base sm:text-lg font-bold">
                  <AnimatedNumber value={issuesData.noShows} delay={0.4} />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <XCircle size={14} className="text-red-500 sm:hidden" weight="duotone" />
                  <XCircle size={16} className="text-red-500 hidden sm:block" weight="duotone" />
                  <span className="text-xs">Canceled</span>
                </div>
                <div className="text-base sm:text-lg font-bold">
                  <AnimatedNumber value={issuesData.canceled} delay={0.45} />
                </div>
              </div>
            </div>
          </KpiCard>
        </div>

        <div className="min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col overflow-hidden"
          >
            <div className="p-3 sm:p-4 pb-2 flex-shrink-0">
              <h2 className="text-sm sm:text-base font-semibold mb-0.5">Recent Activity</h2>
            </div>
            <div className="overflow-y-auto px-3 sm:px-4 pb-3 sm:pb-4 scrollbar-thin flex-1">
              <RecentActivity />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="lg:col-span-1 bg-card rounded-xl p-3 sm:p-4 border border-border"
          >
            <div className="mb-3">
              <h2 className="text-sm sm:text-base font-semibold mb-0.5">Groomers Workload</h2>
              <p className="text-xs text-muted-foreground">Today's Schedule</p>
            </div>
            <GroomersWorkloadCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="lg:col-span-1 bg-card rounded-xl p-3 sm:p-4 border border-border"
          >
            <div className="mb-3">
              <h2 className="text-sm sm:text-base font-semibold mb-0.5">Groomer Avg</h2>
              <p className="text-xs text-muted-foreground">Daily Metrics</p>
            </div>
            <GroomerAvgCard />
          </motion.div>
        </div>

        <div className="min-h-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-card rounded-xl p-3 sm:p-4 border border-border overflow-hidden"
          >
            <div className="mb-3">
              <h2 className="text-sm sm:text-base font-semibold mb-0.5">Expenses</h2>
            </div>
            <ExpensesCard />
          </motion.div>
        </div>

      </div>
    </div>
  )
}
