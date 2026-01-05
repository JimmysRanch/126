import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { expensesData } from '../data/dashboardMockData'

export function ExpensesCard() {
  const [animatedValues, setAnimatedValues] = useState(expensesData.map(() => 0))
  
  const total = expensesData.reduce((sum, expense) => sum + expense.amount, 0)
  
  useEffect(() => {
    const timers = expensesData.map((_, index) => 
      setTimeout(() => {
        let current = 0
        const target = expensesData[index].amount
        const increment = target / 60
        const interval = setInterval(() => {
          current += increment
          if (current >= target) {
            setAnimatedValues(prev => {
              const newValues = [...prev]
              newValues[index] = target
              return newValues
            })
            clearInterval(interval)
          } else {
            setAnimatedValues(prev => {
              const newValues = [...prev]
              newValues[index] = current
              return newValues
            })
          }
        }, 16)
        return () => clearInterval(interval)
      }, index * 100)
    )
    return () => timers.forEach(timer => clearTimeout(timer))
  }, [])

  let cumulativePercentage = 0

  return (
    <div className="space-y-2 h-full flex flex-col">
      <div className="relative w-full aspect-square max-w-[80px] mx-auto flex-shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          {expensesData.map((expense, index) => {
            const percentage = (animatedValues[index] / total) * 100
            const startPercentage = cumulativePercentage
            cumulativePercentage += percentage
            
            const startAngle = (startPercentage / 100) * 360
            const endAngle = (cumulativePercentage / 100) * 360
            const largeArcFlag = percentage > 50 ? 1 : 0
            
            const startX = 100 + 90 * Math.cos((startAngle * Math.PI) / 180)
            const startY = 100 + 90 * Math.sin((startAngle * Math.PI) / 180)
            const endX = 100 + 90 * Math.cos((endAngle * Math.PI) / 180)
            const endY = 100 + 90 * Math.sin((endAngle * Math.PI) / 180)
            
            return (
              <motion.path
                key={expense.category}
                d={`M 100 100 L ${startX} ${startY} A 90 90 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                fill={expense.color}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            )
          })}
          <circle cx="100" cy="100" r="50" fill="var(--card)" />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-sm font-bold">
            ${Math.round(animatedValues.reduce((sum, val) => sum + val, 0)).toLocaleString()}
          </div>
          <div className="text-[9px] text-muted-foreground">Total</div>
        </div>
      </div>

      <div className="space-y-1 overflow-y-auto flex-1 scrollbar-thin pr-1">
        {expensesData.map((expense, index) => {
          const percentage = total > 0 ? ((animatedValues[index] / total) * 100).toFixed(1) : 0
          
          return (
            <motion.div
              key={expense.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between text-[10px]"
            >
              <div className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: expense.color }}
                />
                <span className="text-muted-foreground truncate">{expense.category}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="font-semibold">${Math.round(animatedValues[index]).toLocaleString()}</span>
                <span className="text-muted-foreground text-[9px] w-8 text-right">{percentage}%</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
