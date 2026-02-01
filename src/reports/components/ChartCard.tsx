import { ChartData } from '../types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis
} from 'recharts'
import { exportElementToPng } from '../exports'
import { useRef } from 'react'

const renderChart = (chart: ChartData, onDrill?: (payload?: unknown) => void) => {
  const data = chart.series[0]?.data || []

  switch (chart.type) {
    case 'line':
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={chart.xKey} />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          {chart.series.map((serie) => (
            <Line key={serie.key} dataKey={serie.key} stroke="var(--color-primary, #2563eb)" strokeWidth={2} onClick={onDrill} />
          ))}
          {chart.compareSeries?.map((serie) => (
            <Line
              key={serie.key}
              dataKey={serie.key}
              data={serie.data}
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          ))}
        </LineChart>
      )
    case 'bar':
    case 'stacked':
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={chart.xKey} />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          {chart.series.map((serie) => (
            <Bar
              key={serie.key}
              dataKey={serie.key}
              fill="var(--color-primary, #3b82f6)"
              stackId={chart.type === 'stacked' ? 'a' : undefined}
              onClick={onDrill}
            />
          ))}
        </BarChart>
      )
    case 'donut':
      return (
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={data}
            dataKey={chart.series[0]?.key || 'value'}
            nameKey={chart.xKey}
            innerRadius={50}
            outerRadius={80}
            onClick={onDrill}
          />
        </PieChart>
      )
    case 'scatter':
      return (
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={chart.xKey} type="number" />
          <YAxis dataKey={chart.series[0]?.key || 'value'} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Scatter data={data} fill="#3b82f6" onClick={onDrill} />
        </ScatterChart>
      )
    case 'heatmap':
      return (
        <div className="grid grid-cols-5 gap-2 text-xs">
          {data.length ? (
            data.map((cell, index) => (
              <div key={index} className="rounded bg-muted p-2">
                <div className="text-muted-foreground">{cell.day || cell.cohort}</div>
                <div className="font-semibold">{cell.value}</div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No data available.</p>
          )}
        </div>
      )
    default:
      return null
  }
}

export const ChartCard = ({ chart, onExport, onDrill }: { chart: ChartData; onExport?: () => void; onDrill?: () => void }) => {
  const cardRef = useRef<HTMLDivElement | null>(null)
  return (
    <Card className="p-4" ref={cardRef}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{chart.title}</p>
          <p className="text-xs text-muted-foreground" aria-label={chart.ariaLabel}>{chart.ariaLabel}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (onExport) {
              onExport()
              return
            }
            if (cardRef.current) {
              exportElementToPng(cardRef.current, `${chart.id}.png`)
            }
          }}
        >
          Copy chart
        </Button>
      </div>
      <div className="mt-3 h-64">
        {chart.type === 'heatmap' ? (
          renderChart(chart, onDrill)
        ) : (
          <ChartContainer config={{}}>
            {renderChart(chart, onDrill)}
          </ChartContainer>
        )}
      </div>
    </Card>
  )
}
