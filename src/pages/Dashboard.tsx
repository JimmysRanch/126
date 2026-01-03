import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { KpiCard } from './dashboard/components/KpiCard'
import { BookedGauge } from './dashboard/components/BookedGauge'
import { BookingHeatmap14 } from './dashboard/components/BookingHeatmap14'
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
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        <header className="flex items-center justify-between">
          <h1 className="text-[32px] font-bold tracking-tight leading-none">
            Dashboard
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card rounded-lg px-4 py-2 border border-border">
              <div className="text-xs text-muted-foreground">Total Clients</div>
              <div className="text-xl font-bold">
                <AnimatedNumber value={clientMetrics.totalClients} delay={0.1} />
              </div>
            </div>
            <div className="bg-card rounded-lg px-4 py-2 border border-border">
              <div className="text-xs text-muted-foreground">New This Month</div>
              <div className="text-xl font-bold text-green-500">
                +<AnimatedNumber value={clientMetrics.newThisMonth} delay={0.15} />
              </div>
            </div>
            <div className="bg-card rounded-lg px-4 py-2 border border-border">
              <div className="text-xs text-muted-foreground">Repeat Rate</div>
              <div className="text-xl font-bold">
                <AnimatedNumber value={clientMetrics.repeatVisitRate} delay={0.2} suffix="%" />
              </div>
            </div>
            <div className="bg-card rounded-lg px-4 py-2 border border-border">
              <div className="text-xs text-muted-foreground">Avg Days Between</div>
              <div className="text-xl font-bold">
                <AnimatedNumber value={clientMetrics.avgDaysBetweenVisits} delay={0.25} />
              </div>
            </div>
          </div>
        </header>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            
            <KpiCard title="Appointments Today" delay={0} className="xl:col-span-1">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">Scheduled</span>
                  </div>
                  <div className="font-semibold text-right">
                    <AnimatedNumber value={appointmentData.today.scheduled} delay={0.1} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle size={12} className="text-green-500" weight="fill" />
                    <span className="text-muted-foreground">Completed</span>
                  </div>
                  <div className="font-semibold text-right">
                    <AnimatedNumber value={appointmentData.today.completed} delay={0.15} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <XCircle size={12} className="text-red-500" weight="fill" />
                    <span className="text-muted-foreground">Canceled</span>
                  </div>
                  <div className="font-semibold text-right">
                    <AnimatedNumber value={appointmentData.today.canceled} delay={0.2} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Warning size={12} className="text-orange-500" weight="fill" />
                    <span className="text-muted-foreground">No-Shows</span>
                  </div>
                  <div className="font-semibold text-right">
                    <AnimatedNumber value={appointmentData.today.noShows} delay={0.25} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-yellow-500" weight="fill" />
                    <span className="text-muted-foreground">Late</span>
                  </div>
                  <div className="font-semibold text-right">
                    <AnimatedNumber value={appointmentData.today.late} delay={0.3} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Day Progress</span>
                    <span>
                      <AnimatedNumber value={progress.completed} delay={0.35} /> / <AnimatedNumber value={progress.total} delay={0.35} />
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
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

            <KpiCard title="Booked" delay={0.1} className="xl:col-span-1 flex items-center justify-center">
              <BookedGauge 
                percentage={capacityData.bookedPercentage} 
                target={capacityData.target}
                delay={0.2}
              />
            </KpiCard>

            <KpiCard title="Expected Revenue" delay={0.2} className="xl:col-span-1">
              <div className="space-y-3">
                <div>
                  <div className="text-3xl font-bold">
                    <AnimatedNumber value={revenueData.today.total} delay={0.3} prefix="$" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Total Revenue Today</div>
                </div>
                
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Profit After Commissions</span>
                    <span className="font-semibold text-green-500">
                      <AnimatedNumber value={revenueData.today.profit} delay={0.35} prefix="$" />
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tips (excluded)</span>
                    <span className="font-medium">
                      <AnimatedNumber value={revenueData.today.tips} delay={0.4} prefix="$" />
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Commission estimate</span>
                    <span className="font-medium">
                      <AnimatedNumber value={revenueData.today.commission} delay={0.45} prefix="$" />
                    </span>
                  </div>
                </div>
              </div>
            </KpiCard>

            <KpiCard title="Issues" delay={0.3} className="xl:col-span-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock size={20} className="text-yellow-500" weight="duotone" />
                    <span className="text-sm">Late arrivals</span>
                  </div>
                  <div className="text-xl font-bold">
                    <AnimatedNumber value={issuesData.lateArrivals} delay={0.35} />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Warning size={20} className="text-orange-500" weight="duotone" />
                    <span className="text-sm">No-shows</span>
                  </div>
                  <div className="text-xl font-bold">
                    <AnimatedNumber value={issuesData.noShows} delay={0.4} />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle size={20} className="text-red-500" weight="duotone" />
                    <span className="text-sm">Canceled</span>
                  </div>
                  <div className="text-xl font-bold">
                    <AnimatedNumber value={issuesData.canceled} delay={0.45} />
                  </div>
                </div>
              </div>
            </KpiCard>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="xl:col-span-2 bg-card rounded-xl p-6 border border-border"
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Booking Overview</h2>
                <p className="text-sm text-muted-foreground">Next 14 Days</p>
              </div>
              
              <BookingHeatmap14 />
              
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-border text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Today:</span>
                  <span className="font-bold text-primary">
                    <AnimatedNumber value={bookingSummary.today} delay={0.7} suffix="%" />
                  </span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Week:</span>
                  <span className="font-bold text-primary">
                    <AnimatedNumber value={bookingSummary.week} delay={0.75} suffix="%" />
                  </span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Month:</span>
                  <span className="font-bold text-primary">
                    <AnimatedNumber value={bookingSummary.month} delay={0.8} suffix="%" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Monthly Booking Rate</h2>
                <p className="text-sm text-muted-foreground">Last 12 Months</p>
              </div>
              
              <div className="space-y-2">
                {bookingRateData.map((month, index) => {
                  return (
                    <div key={month.period} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{month.period}</span>
                        <div className="flex gap-3 items-center">
                          <span className="text-[10px] text-muted-foreground/60">
                            Prev: {month.previousYearPercentage}%
                          </span>
                          <span className="font-semibold">{month.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-6 bg-secondary/30 rounded overflow-hidden relative flex">
                        <motion.div
                          className="h-full bg-muted/60 rounded-l flex items-center justify-end pr-1.5"
                          initial={{ width: 0 }}
                          animate={{ width: `${month.previousYearPercentage}%` }}
                          transition={{ duration: 0.6, delay: 0.7 + index * 0.04, ease: 'easeOut' }}
                        >
                          <span className="text-[9px] font-bold text-muted-foreground">
                            {month.previousYearPercentage}%
                          </span>
                        </motion.div>
                        <motion.div
                          className="h-full bg-primary flex items-center justify-end pr-1.5 -ml-px"
                          initial={{ width: 0 }}
                          animate={{ width: `${month.percentage}%` }}
                          transition={{ duration: 0.6, delay: 0.7 + index * 0.04, ease: 'easeOut' }}
                        >
                          <span className="text-[9px] font-bold text-primary-foreground">
                            {month.percentage}%
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Revenue Snapshot</h2>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
              
              <RevenueMiniChart />
            </div>
          </motion.div>
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Groomer Utilization</h2>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
              
              <GroomerUtilization />
            </div>
          </motion.div>
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Recent Activity</h2>
                <p className="text-sm text-muted-foreground">Latest Updates</p>
              </div>
              
              <RecentActivity />
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
