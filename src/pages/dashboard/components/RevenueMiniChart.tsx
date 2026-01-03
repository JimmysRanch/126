import { motion } from 'framer-motion'
import { revenueData } from '../data/dashboardMockData'
import { TrendUp, TrendDown } from '@phosphor-icons/react'

export function RevenueMiniChart() {
  const { thisWeek } = revenueData
  const maxAmount = Math.max(...thisWeek.daily.map(d => d.amount))
  const isPositive = thisWeek.percentChange >= 0

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-2xl font-bold">${(thisWeek.total / 1000).toFixed(1)}k</div>
          <div className="text-xs text-muted-foreground mt-0.5">This Week's Revenue</div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {isPositive ? <TrendUp size={14} weight="bold" /> : <TrendDown size={14} weight="bold" />}
          <span className="text-xs font-bold">{Math.abs(thisWeek.percentChange)}%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1.5">
        {thisWeek.daily.map((day, index) => {
          const heightPercent = (day.amount / maxAmount) * 100
          
          return (
            <div key={day.day} className="flex flex-col items-center gap-1">
              <div className="text-[10px] text-muted-foreground font-medium">{day.day}</div>
              <div className="text-[9px] text-muted-foreground/60">{day.date}</div>
              <div className="w-full h-16 bg-secondary/30 rounded overflow-hidden relative flex flex-col justify-end">
                <motion.div
                  className="w-full bg-gradient-to-t from-primary to-primary/80 rounded flex items-end justify-center pb-0.5"
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
                >
                  <span className="text-[8px] font-bold text-primary-foreground">
                    ${(day.amount / 1000).toFixed(1)}k
                  </span>
                </motion.div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="text-[10px] text-muted-foreground text-center">
        vs Last Week
      </div>
    </div>
  )
}
