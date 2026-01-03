import { motion } from 'framer-motion'
import { revenueData } from '../data/dashboardMockData'
import { TrendUp, TrendDown } from '@phosphor-icons/react'

export function RevenueMiniChart() {
  const { thisWeek } = revenueData
  const maxAmount = Math.max(...thisWeek.daily.map(d => d.amount))
  const isPositive = thisWeek.percentChange >= 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-bold">${(thisWeek.total / 1000).toFixed(1)}k</div>
          <div className="text-sm text-muted-foreground mt-1">This Week's Revenue</div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {isPositive ? <TrendUp size={16} weight="bold" /> : <TrendDown size={16} weight="bold" />}
          <span className="text-sm font-bold">{Math.abs(thisWeek.percentChange)}%</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {thisWeek.daily.map((day, index) => {
          const widthPercent = (day.amount / maxAmount) * 100
          
          return (
            <div key={day.day} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">{day.day}</span>
                <span className="font-semibold">${day.amount.toLocaleString()}</span>
              </div>
              <div className="h-6 bg-secondary/30 rounded overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded flex items-center justify-end pr-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
                >
                  <span className="text-[9px] font-bold text-primary-foreground">
                    ${day.amount}
                  </span>
                </motion.div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
        vs Last Week
      </div>
    </div>
  )
}
