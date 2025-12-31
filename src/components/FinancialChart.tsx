import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { month: 'JUL 2025', revenue: 0, expenses: 0, profit: 0 },
  { month: 'AUG 2025', revenue: 0, expenses: 0, profit: 0 },
  { month: 'SEP 2025', revenue: 0, expenses: 0, profit: 0 },
  { month: 'OCT 2025', revenue: 0, expenses: 0, profit: 0 },
  { month: 'NOV 2025', revenue: 2200, expenses: 400, profit: 1800 },
  { month: 'DEC 2025', revenue: 2700, expenses: 700, profit: 2000 },
]

export function FinancialChart() {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="month"
            stroke="rgba(255, 255, 255, 0.5)"
            tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.5)"
            tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="oklch(0.65 0.22 220)"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="REVENUE"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="oklch(0.60 0.20 25)"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="EXPENSES"
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="oklch(0.70 0.20 140)"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="PROFIT"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
