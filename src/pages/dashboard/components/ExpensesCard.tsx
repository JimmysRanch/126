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
    <div className="h-full flex flex-col overflow-hidden">
      <div className="space-y-1 overflow-y-auto flex-1 scrollbar-thin pr-1 min-h-0">
        {expensesData.map((expense, index) => {
          const percentage = total > 0 ? ((animatedValues[index] / total) * 100).toFixed(1) : 0
          
          return (
            <motion.div
              key={expense.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between text-xs py-1.5"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: expense.color }}
                />
                <span className="text-muted-foreground truncate">{expense.category}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-semibold">${Math.round(animatedValues[index]).toLocaleString()}</span>
                <span className="text-muted-foreground text-xs w-10 text-right">{percentage}%</span>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      <div className="pt-2 border-t border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Total Expenses</span>
          <span className="text-lg font-bold">
            ${Math.round(animatedValues.reduce((sum, val) => sum + val, 0)).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
