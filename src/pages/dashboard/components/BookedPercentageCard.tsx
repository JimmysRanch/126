import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
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

  return <span>{count}%</span>
}

interface BookedPercentageCardProps {
  data: {
    day: number
    week: number
    month: number
  }
}

export function BookedPercentageCard({ data }: BookedPercentageCardProps) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-muted-foreground">Day</span>
          <span className="text-base sm:text-lg font-bold">
            <AnimatedNumber value={data.day} delay={0.1} />
          </span>
        </div>
        <div className="h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${data.day}%` }}
            transition={{ duration: 1, delay: 0.15, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-muted-foreground">Week</span>
          <span className="text-base sm:text-lg font-bold">
            <AnimatedNumber value={data.week} delay={0.2} />
          </span>
        </div>
        <div className="h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${data.week}%` }}
            transition={{ duration: 1, delay: 0.25, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-muted-foreground">Month</span>
          <span className="text-base sm:text-lg font-bold">
            <AnimatedNumber value={data.month} delay={0.3} />
          </span>
        </div>
        <div className="h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${data.month}%` }}
            transition={{ duration: 1, delay: 0.35, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}
