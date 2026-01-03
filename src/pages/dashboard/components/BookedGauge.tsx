import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface BookedGaugeProps {
  percentage: number
  target: number
  delay?: number
}

export function BookedGauge({ percentage, target, delay = 0 }: BookedGaugeProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0
      const increment = percentage / 60
      const interval = setInterval(() => {
        current += increment
        if (current >= percentage) {
          setDisplayPercentage(percentage)
          clearInterval(interval)
        } else {
          setDisplayPercentage(Math.floor(current))
        }
      }, 16)
      return () => clearInterval(interval)
    }, delay * 1000)
    return () => clearTimeout(timer)
  }, [percentage, delay])

  const circumference = 2 * Math.PI * 70
  const offset = circumference - (displayPercentage / 100) * circumference

  const gradientId = `gauge-gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="relative flex items-center justify-center">
      <svg width="160" height="160" className="transform -rotate-90 sm:w-[180px] sm:h-[180px]" viewBox="0 0 180 180">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.75 0.15 195)" />
            <stop offset="25%" stopColor="oklch(0.75 0.15 150)" />
            <stop offset="50%" stopColor="oklch(0.75 0.15 120)" />
            <stop offset="75%" stopColor="oklch(0.75 0.15 60)" />
            <stop offset="100%" stopColor="oklch(0.75 0.15 340)" />
          </linearGradient>
        </defs>
        
        <circle
          cx="90"
          cy="90"
          r="70"
          stroke="oklch(0.30 0.05 250)"
          strokeWidth="14"
          fill="none"
        />
        
        <motion.circle
          cx="90"
          cy="90"
          r="70"
          stroke={`url(#${gradientId})`}
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay, ease: 'easeOut' }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="text-3xl sm:text-4xl font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
        >
          {displayPercentage}%
        </motion.div>
        <div className="text-xs text-muted-foreground mt-0.5">Today</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">Target {target}%</div>
      </div>
    </div>
  )
}
