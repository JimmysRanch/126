import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { expensesData } from '../data/dashboardMockData'

function formatCurrency(n: number) {
  return `$${Math.round(n).toLocaleString()}`
}

export function ExpensesCard() {
  const sortedExpenses = useMemo(
    () => [...expensesData].sort((a, b) => b.amount - a.amount),
    []
  )

  const [animatedValues, setAnimatedValues] = useState<number[]>(() =>
    sortedExpenses.map(() => 0)
  )

  const totalTarget = useMemo(
    () => sortedExpenses.reduce((sum, e) => sum + e.amount, 0),
    [sortedExpenses]
  )

  const totalAnimated = useMemo(
    () => animatedValues.reduce((sum, v) => sum + v, 0),
    [animatedValues]
  )

  useEffect(() => {
    const timeouts: number[] = []
    const intervals: number[] = []

    sortedExpenses.forEach((expense, index) => {
      const t = window.setTimeout(() => {
        let current = 0
        const target = expense.amount

        const increment = Math.max(target / 60, 1)

        const i = window.setInterval(() => {
          current += increment
          if (current >= target) current = target

          setAnimatedValues((prev) => {
            const next = [...prev]
            next[index] = current
            return next
          })

          if (current >= target) window.clearInterval(i)
        }, 16)

        intervals.push(i)
      }, index * 120)

      timeouts.push(t)
    })

    return () => {
      timeouts.forEach((t) => window.clearTimeout(t))
      intervals.forEach((i) => window.clearInterval(i))
    }
  }, [sortedExpenses])

  const size = 140
  const stroke = 18
  const radius = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius

  const segments = useMemo(() => {
    const total = Math.max(totalTarget, 1)
    let cumulative = 0
    return sortedExpenses.map((e, idx) => {
      const value = Math.max(animatedValues[idx] ?? 0, 0)
      const pct = value / total
      const segLen = pct * circumference

      const startLen = cumulative
      cumulative += segLen

      return {
        ...e,
        idx,
        pct,
        segLen,
        startLen,
        dasharray: `${Math.max(segLen, 0)} ${Math.max(circumference - segLen, 0)}`,
        dashoffset: -startLen,
      }
    })
  }, [animatedValues, circumference, sortedExpenses, totalTarget])

  return (
    <div className="h-full w-full flex flex-col gap-2">
      <div className="flex items-center justify-center flex-shrink-0">
        <div className="relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={stroke}
            />

            <g>
              {segments.map((s) => (
                <motion.circle
                  key={s.category}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeLinecap="butt"
                  strokeDasharray={s.dasharray}
                  strokeDashoffset={circumference}
                  transform={`rotate(-90 ${cx} ${cy})`}
                  initial={false}
                  animate={{
                    strokeDashoffset: s.dashoffset,
                    opacity: s.segLen > 0 ? 1 : 0,
                  }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              ))}
            </g>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-background/40 backdrop-blur px-3 py-2 ring-1 ring-white/10">
              <div className="text-sm font-extrabold tracking-tight">
                {formatCurrency(totalAnimated)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin space-y-1.5">
        {sortedExpenses.map((expense, index) => {
          const pct = totalTarget > 0 ? (animatedValues[index] / totalTarget) * 100 : 0
          return (
            <motion.div
              key={expense.category}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: expense.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold leading-tight truncate">
                    {expense.category}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-bold leading-tight">
                  {formatCurrency(animatedValues[index])}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  {pct.toFixed(1)}%
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
