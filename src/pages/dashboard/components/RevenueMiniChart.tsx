import { motion, useAnimation } from 'framer-motion'
import { revenueData } from '../data/dashboardMockData'
import { TrendUp, TrendDown, Sparkle } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

export function RevenueMiniChart() {
  const { thisWeek } = revenueData
  const maxAmount = Math.max(...thisWeek.daily.map(d => d.amount))
  const isPositive = thisWeek.percentChange >= 0
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      background: [
        'linear-gradient(135deg, oklch(0.22 0.04 250) 0%, oklch(0.25 0.05 260) 100%)',
        'linear-gradient(135deg, oklch(0.25 0.05 260) 0%, oklch(0.22 0.04 250) 100%)',
        'linear-gradient(135deg, oklch(0.22 0.04 250) 0%, oklch(0.25 0.05 260) 100%)',
      ],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    })
  }, [controls])

  return (
    <div className="relative h-full">
      <motion.div
        animate={controls}
        className="absolute inset-0 rounded-lg opacity-30"
      />
      
      <div className="relative space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <motion.div 
              className="text-2xl font-bold flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                ${(thisWeek.total / 1000).toFixed(1)}k
              </span>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1.2, 1.2, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: 'easeInOut'
                }}
              >
                <Sparkle size={16} className="text-primary" weight="fill" />
              </motion.div>
            </motion.div>
            <motion.div 
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              This Week's Revenue
            </motion.div>
          </div>
          <motion.div 
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg backdrop-blur-sm ${isPositive ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30' : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.8, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ y: isPositive ? [-1, 0, -1] : [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {isPositive ? <TrendUp size={14} weight="bold" /> : <TrendDown size={14} weight="bold" />}
            </motion.div>
            <span className="text-xs font-bold">{Math.abs(thisWeek.percentChange)}%</span>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-7 gap-1.5">
          {thisWeek.daily.map((day, index) => {
            const heightPercent = (day.amount / maxAmount) * 100
            const isHovered = hoveredDay === index
            
            return (
              <motion.div 
                key={day.day} 
                className="flex flex-col items-center gap-1 cursor-pointer"
                onHoverStart={() => setHoveredDay(index)}
                onHoverEnd={() => setHoveredDay(null)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
              >
                <motion.div 
                  className="text-[10px] font-medium"
                  animate={{
                    color: isHovered ? 'oklch(0.75 0.15 195)' : 'oklch(0.65 0.02 250)'
                  }}
                >
                  {day.day}
                </motion.div>
                <motion.div 
                  className="text-[9px]"
                  animate={{
                    color: isHovered ? 'oklch(0.65 0.02 250)' : 'oklch(0.65 0.02 250 / 0.6)'
                  }}
                >
                  {day.date}
                </motion.div>
                <div className="w-full h-16 bg-secondary/50 rounded-lg overflow-hidden relative flex flex-col justify-end backdrop-blur-sm">
                  <motion.div
                    className="w-full rounded-lg relative overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.08, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-primary/70"
                      animate={{
                        opacity: isHovered ? 1 : 0.95,
                        scale: isHovered ? 1.02 : 1
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20"
                      animate={{
                        opacity: isHovered ? 1 : 0.5,
                        y: isHovered ? 0 : 10
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div 
                      className="absolute inset-0 flex items-end justify-center pb-1"
                      animate={{
                        scale: isHovered ? 1.1 : 1
                      }}
                    >
                      <span className="text-[8px] font-bold text-primary-foreground drop-shadow-sm">
                        ${(day.amount / 1000).toFixed(1)}k
                      </span>
                    </motion.div>
                  </motion.div>
                  
                  {isHovered && (
                    <motion.div
                      className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card px-2 py-1 rounded shadow-lg border border-border z-10 whitespace-nowrap"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                    >
                      <div className="text-[10px] font-bold">${day.amount.toLocaleString()}</div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
        
        <motion.div 
          className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground pt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <span>vs Last Week</span>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1 rounded-full bg-muted-foreground"
          />
        </motion.div>
      </div>
    </div>
  )
}
