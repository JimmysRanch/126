import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { KpiCard } from './dashboard/components/KpiCard'
import { BookedGauge } from './dashboard/components/BookedGauge'
import { RevenueMiniChart } from './dashboard/components/RevenueMiniChart'
import { GroomerUtilization } from './dashboard/components/GroomerUtilization'
import { RecentActivity } from './dashboard/components/RecentActivity'
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
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        <header className="flex items-center justify-end gap-2">
          <div className="bg-card rounded-lg px-3 py-1.5 border border-border">
            <div className="text-[10px] text-muted-foreground">Total Clients</div>
            <div className="text-base font-bold">
              <AnimatedNumber value={clientMetrics.totalClients} delay={0.1} />
            </div>
          </div>
          <div className="bg-card rounded-lg px-3 py-1.5 border border-border">
            <div className="text-[10px] text-muted-foreground">New This Month</div>
            <div className="text-base font-bold text-green-500">
              +<AnimatedNumber value={clientMetrics.newThisMonth} delay={0.15} />
            </div>
          </div>
          <div className="bg-card rounded-lg px-3 py-1.5 border border-border">
            <div className="text-[10px] text-muted-foreground">Repeat Rate</div>
            <div className="text-base font-bold">
              <AnimatedNumber value={clientMetrics.repeatVisitRate} delay={0.2} suffix="%" />
            </div>
          </div>
          <div className="bg-card rounded-lg px-3 py-1.5 border border-border">
            <div className="text-[10px] text-muted-foreground">Avg Days Between</div>
            <div className="text-base font-bold">
              <AnimatedNumber value={clientMetrics.avgDaysBetweenVisits} delay={0.25} />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-lg px-3 py-1.5 border border-border h-[52px] flex flex-col justify-center"
          >
            <div className="text-[10px] text-muted-foreground mb-1">Booked %</div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Today:</span>
                <span className="font-bold text-primary">
                  <AnimatedNumber value={bookingSummary.today} delay={0.7} suffix="%" />
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Week:</span>
                <span className="font-bold text-primary">
                  <AnimatedNumber value={bookingSummary.week} delay={0.75} suffix="%" />
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Month:</span>
                <span className="font-bold text-primary">
                  <AnimatedNumber value={bookingSummary.month} delay={0.8} suffix="%" />
                </span>
              </div>
            </div>
          </motion.div>
        </header>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            
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
                  <div className="text-2xl font-bold">
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
                    <Clock size={16} className="text-yellow-500" weight="duotone" />
                    <span className="text-xs">Late arrivals</span>
                  </div>
                  <div className="text-lg font-bold">
                    <AnimatedNumber value={issuesData.lateArrivals} delay={0.35} />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <Warning size={16} className="text-orange-500" weight="duotone" />
                    <span className="text-xs">No-shows</span>
                  </div>
                  <div className="text-lg font-bold">
                    <AnimatedNumber value={issuesData.noShows} delay={0.4} />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <XCircle size={16} className="text-red-500" weight="duotone" />
                    <span className="text-xs">Canceled</span>
                  </div>
                  <div className="text-lg font-bold">
                    <AnimatedNumber value={issuesData.canceled} delay={0.45} />
                  </div>
                </div>
              </div>
            </KpiCard>

            <KpiCard title="Revenue Snapshot" delay={0.5} className="lg:col-span-2">
              <RevenueMiniChart />
            </KpiCard>
          </div>
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="bg-card rounded-xl p-4 border border-border"
          >
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold mb-0.5">Recent Activity</h2>
                <p className="text-xs text-muted-foreground">Latest Updates</p>
              </div>
              
              <RecentActivity />
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
