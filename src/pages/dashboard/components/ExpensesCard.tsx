import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { expensesData } from '../data/dashboardMockData'

type Props = {
  title?: string
  periodLabel?: string
}

function formatCurrency(n: number) {
  return `$${Math.round(n).toLocaleString()}`
}

export function ExpensesCard({ title = 'Expenses', periodLabel = 'January 2026' }: Props) {
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

  const size = 240
  const stroke = 28
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

      const startAngle = (startLen / circumference) * 360 - 90
      const sweep = (segLen / circumference) * 360
      const midAngle = startAngle + sweep / 2
      const rad = (midAngle * Math.PI) / 180
      const labelR = radius + 18
      const lx = cx + labelR * Math.cos(rad)
      const ly = cy + labelR * Math.sin(rad)

      return {
        ...e,
        idx,
        pct,
        segLen,
        startLen,
        dasharray: `${Math.max(segLen, 0)} ${Math.max(circumference - segLen, 0)}`,
        dashoffset: -startLen,
        label: `${(pct * 100).toFixed(1)}%`,
        lx,
        ly,
      }
    })
  }, [animatedValues, circumference, cx, cy, radius, sortedExpenses, totalTarget])

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-2xl font-bold tracking-tight">{title}</div>
          <div className="text-sm text-muted-foreground">{periodLabel}</div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 items-center">
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
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

              <g>
                {segments.map((s) =>
                  s.pct > 0.04 ? (
                    <text
                      key={`${s.category}-label`}
                      x={s.lx}
                      y={s.ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="18"
                      fontWeight="700"
                      fill="rgba(255,255,255,0.92)"
                    >
                      {s.label}
                    </text>
                  ) : null
                )}
              </g>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-background/40 backdrop-blur px-6 py-4 ring-1 ring-white/10">
                <div className="text-4xl font-extrabold tracking-tight">
                  {formatCurrency(totalAnimated)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="divide-y divide-white/10">
            {sortedExpenses.map((expense, index) => {
              const pct = totalTarget > 0 ? (animatedValues[index] / totalTarget) * 100 : 0
              return (
                <motion.div
                  key={expense.category}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="py-5 flex items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <span
                      className="mt-2 h-4 w-4 rounded-full shrink-0"
                      style={{ backgroundColor: expense.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-2xl font-semibold leading-tight truncate">
                        {expense.category}
                      </div>
                      <div className="text-lg text-muted-foreground leading-tight">
                        {pct.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-3xl font-bold leading-tight">
                      {formatCurrency(animatedValues[index])}
                    </div>
                    <div className="text-lg text-muted-foreground leading-tight">
                      {pct.toFixed(1)}%
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-xl text-muted-foreground">Total Expenses</div>
            <div className="text-4xl font-extrabold tracking-tight">
              {formatCurrency(totalAnimated)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
