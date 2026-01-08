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

  return <span>{count.toLocaleString()}</span>
}

interface DogsGroomedCardProps {
  data: {
    day: number
    week: number
    month: number
    lifetime: number
  }
}

export function DogsGroomedCard({ data }: DogsGroomedCardProps) {
  return (
    <div className="h-full flex items-center">
      <div className="grid grid-cols-2 gap-1.5 w-full">
        <div className="space-y-0">
          <div className="text-[10px] text-muted-foreground">Day</div>
          <div className="text-xl font-bold">
            <AnimatedNumber value={data.day} delay={0.1} />
          </div>
        </div>
        
        <div className="space-y-0">
          <div className="text-[10px] text-muted-foreground">Week</div>
          <div className="text-xl font-bold">
            <AnimatedNumber value={data.week} delay={0.15} />
          </div>
        </div>
        
        <div className="space-y-0">
          <div className="text-[10px] text-muted-foreground">Month</div>
          <div className="text-xl font-bold">
            <AnimatedNumber value={data.month} delay={0.2} />
          </div>
        </div>
        
        <div className="space-y-0">
          <div className="text-[10px] text-muted-foreground">Lifetime</div>
          <div className="text-xl font-bold text-primary">
            <AnimatedNumber value={data.lifetime} delay={0.25} />
          </div>
        </div>
      </div>
    </div>
  )
}
