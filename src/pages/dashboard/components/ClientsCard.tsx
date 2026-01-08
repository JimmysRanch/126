import { useEffect, useState } from 'react'

function AnimatedNumber({ value, delay = 0, suffix = '' }: { value: number; delay?: number; suffix?: string }) {
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

  return <span>{count.toLocaleString()}{suffix}</span>
}

interface ClientsCardProps {
  data: {
    total: number
    newThisMonth: number
    repeatRate: number
    avgDaysBetween: number
  }
}

export function ClientsCard({ data }: ClientsCardProps) {
  return (
    <div className="h-full flex items-center">
      <div className="grid grid-cols-2 gap-1.5 w-full">
        <div className="space-y-0">
          <div className="text-[10px] text-muted-foreground">Total Clients</div>
          <div className="text-xl font-bold">
            <AnimatedNumber value={data.total} delay={0.1} />
          </div>
        </div>
        
        <div className="space-y-0">
          <div className="text-[10px] text-muted-foreground">New This Month</div>
          <div className="text-xl font-bold">
            <AnimatedNumber value={data.newThisMonth} delay={0.15} />
          </div>
        </div>
        
        <div className="space-y-0">
          <div className="text-[10px] text-muted-foreground">Repeat Rate</div>
          <div className="text-xl font-bold">
            <AnimatedNumber value={data.repeatRate} delay={0.2} suffix="%" />
          </div>
        </div>
        
        <div className="space-y-0">
          <div className="text-[10px] text-muted-foreground">Avg Rebooking</div>
          <div className="text-xl font-bold">
            <AnimatedNumber value={data.avgDaysBetween} delay={0.25} />
          </div>
        </div>
      </div>
    </div>
  )
}
