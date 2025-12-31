import { Card } from "@/components/ui/card"
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts"
import { motion } from "framer-motion"

interface Stat {
  label: string
  value: string | number
}

interface StatWidgetProps {
  stats: Stat[]
  chartData?: Array<{ value: number }>
  chartType?: 'area' | 'bar' | 'line'
  accentColor?: string
  onClick?: () => void
}

export function StatWidget({ 
  stats, 
  chartData, 
  chartType = 'area',
  accentColor = 'oklch(0.75 0.15 195)',
  onClick 
}: StatWidgetProps) {
  const renderChart = () => {
    if (!chartData || chartData.length === 0) return null

    const commonProps = {
      data: chartData,
      margin: { top: 0, right: 0, left: 0, bottom: 0 }
    }

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={40}>
            <BarChart {...commonProps}>
              <Bar 
                dataKey="value" 
                fill={accentColor}
                radius={[4, 4, 0, 0]}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={40}>
            <LineChart {...commonProps}>
              <Line 
                type="monotone"
                dataKey="value" 
                stroke={accentColor}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )
      default:
        return (
          <ResponsiveContainer width="100%" height={40}>
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id={`gradient-${stats[0].label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone"
                dataKey="value" 
                stroke={accentColor}
                strokeWidth={2}
                fill={`url(#gradient-${stats[0].label})`}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card 
        className="p-4 border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 cursor-pointer active:scale-[0.98] overflow-hidden"
        onClick={onClick}
      >
        {chartData && chartData.length > 0 && (
          <div className="mb-3 -mx-4 -mt-4 opacity-60">
            {renderChart()}
          </div>
        )}
        
        <div className="space-y-2">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
              <motion.p 
                className="text-2xl font-bold"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.2 + index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
              >
                {stat.value}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
