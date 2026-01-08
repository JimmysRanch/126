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
    <div className="h-full flex items-center">
      <div className="space-y-1.5 w-full">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Day</span>
            <span className="text-base font-bold">
              <AnimatedNumber value={data.day} delay={0.1} />
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${data.day}%` }}
            />
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Week</span>
            <span className="text-base font-bold">
              <AnimatedNumber value={data.week} delay={0.2} />
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${data.week}%` }}
            />
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Month</span>
            <span className="text-base font-bold">
              <AnimatedNumber value={data.month} delay={0.3} />
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${data.month}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
