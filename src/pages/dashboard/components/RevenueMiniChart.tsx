import { motion } from 'framer-motion'
import { revenueData } from '../data/dashboardMockData'
import { TrendUp, TrendDown } from '@phosphor-icons/react'

export function RevenueMiniChart() {
  const { thisWeek } = revenueData
  const maxAmount = Math.max(...thisWeek.daily.map(d => d.amount))
  const isPositive = thisWeek.percentChange >= 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-3xl font-bold">${(thisWeek.total / 1000).toFixed(1)}k</div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendUp size={16} weight="bold" /> : <TrendDown size={16} weight="bold" />}
          {Math.abs(thisWeek.percentChange)}%
        </div>
      </div>
      
      <div className="flex items-end gap-2 h-24">
        {thisWeek.daily.map((day, index) => {
          const height = (day.amount / maxAmount) * 100
          
          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className="w-full bg-primary rounded-t-sm relative overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-primary" />
              </motion.div>
              <div className="text-[10px] text-muted-foreground font-medium">{day.day}</div>
            </div>
          )
        })}
      </div>
      
      <div className="text-xs text-muted-foreground">vs Last Week</div>
    </div>
  )
}
