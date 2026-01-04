import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useIsMobile } from '@/hooks/use-mobile'

const data = [
  { month: 'JUL 2025', shortMonth: 'JUL', revenue: 0, expenses: 0, profit: 0 },
  { month: 'AUG 2025', shortMonth: 'AUG', revenue: 0, expenses: 0, profit: 0 },
  { month: 'SEP 2025', shortMonth: 'SEP', revenue: 0, expenses: 0, profit: 0 },
  { month: 'OCT 2025', shortMonth: 'OCT', revenue: 0, expenses: 0, profit: 0 },
  { month: 'NOV 2025', shortMonth: 'NOV', revenue: 2200, expenses: 400, profit: 1800 },
  { month: 'DEC 2025', shortMonth: 'DEC', revenue: 2700, expenses: 700, profit: 2000 },
]

export function FinancialChart() {
  const isMobile = useIsMobile()

  return (
    <div className="w-full h-[280px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={isMobile 
            ? { top: 10, right: 10, left: -20, bottom: 10 }
            : { top: 20, right: 30, left: 20, bottom: 20 }
          }
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey={isMobile ? "shortMonth" : "month"}
            stroke="rgba(255, 255, 255, 0.5)"
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: isMobile ? 10 : 12 }}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 50 : 30}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.5)"
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: isMobile ? 10 : 12 }}
            width={isMobile ? 40 : 60}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'oklch(0.22 0.04 250)',
              border: '1px solid oklch(0.35 0.05 250)',
              borderRadius: '0.5rem',
              color: 'oklch(0.98 0 0)',
            }}
            formatter={(value: number) => `$${value.toFixed(2)}`}
          />
          {!isMobile && (
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
          )}
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="oklch(0.65 0.22 220)"
            strokeWidth={isMobile ? 2 : 3}
            dot={{ r: isMobile ? 3 : 4 }}
            name="REVENUE"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="oklch(0.60 0.20 25)"
            strokeWidth={isMobile ? 2 : 3}
            dot={{ r: isMobile ? 3 : 4 }}
            name="EXPENSES"
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="oklch(0.70 0.20 140)"
            strokeWidth={isMobile ? 2 : 3}
            dot={{ r: isMobile ? 3 : 4 }}
            name="PROFIT"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
