/**
 * Chart Card Component
 * Wrapper for charts with title, export actions, and accessibility
 */

import { ComponentProps, useRef, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from 'recharts'
import { DotsThreeVertical, DownloadSimple, Copy, Image } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { ChartDataPoint } from '../types'

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  onExportPNG?: () => void
  onExportData?: () => void
  className?: string
  ariaLabel?: string
}

export function ChartCard({ 
  title, 
  description, 
  children, 
  onExportPNG, 
  onExportData,
  className,
  ariaLabel,
}: ChartCardProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  
  const handleCopyImage = async () => {
    if (!chartRef.current) return
    
    try {
      // Use html2canvas or similar if available, for now just trigger download
      onExportPNG?.()
    } catch (error) {
      console.error('Failed to copy chart as image:', error)
    }
  }
  
  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <DotsThreeVertical size={16} />
                <span className="sr-only">Chart options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onExportPNG && (
                <DropdownMenuItem onClick={onExportPNG}>
                  <Image size={16} className="mr-2" />
                  Export as PNG
                </DropdownMenuItem>
              )}
              {onExportData && (
                <DropdownMenuItem onClick={onExportData}>
                  <DownloadSimple size={16} className="mr-2" />
                  Export Data
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleCopyImage}>
                <Copy size={16} className="mr-2" />
                Copy Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={chartRef}
          role="img"
          aria-label={ariaLabel || title}
        >
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== Chart Components ====================

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

interface SimpleBarChartProps {
  data: ChartDataPoint[]
  height?: number
  formatValue?: (value: number) => string
  color?: string
  onClick?: (item: ChartDataPoint) => void
}

export function SimpleBarChart({ 
  data, 
  height = 200, 
  formatValue = (v) => v.toLocaleString(),
  color = CHART_COLORS[0],
  onClick,
}: SimpleBarChartProps) {
  const config: ChartConfig = {
    value: {
      label: 'Value',
      color,
    },
  }
  
  return (
    <ChartContainer config={config} className={`h-[${height}px]`}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="label" 
          tickLine={false}
          axisLine={false}
          fontSize={10}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          fontSize={10}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={formatValue}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar 
          dataKey="value" 
          fill={color}
          radius={[4, 4, 0, 0]}
          cursor={onClick ? 'pointer' : undefined}
          onClick={(data) => onClick?.(data as unknown as ChartDataPoint)}
        />
      </BarChart>
    </ChartContainer>
  )
}

interface SimpleLineChartProps {
  data: ChartDataPoint[]
  height?: number
  formatValue?: (value: number) => string
  color?: string
  showArea?: boolean
  previousData?: ChartDataPoint[]
  onClick?: (item: ChartDataPoint) => void
}

export function SimpleLineChart({ 
  data, 
  height = 200, 
  formatValue = (v) => v.toLocaleString(),
  color = CHART_COLORS[0],
  showArea = false,
  previousData,
  onClick,
}: SimpleLineChartProps) {
  const config: ChartConfig = {
    value: {
      label: 'Current',
      color,
    },
    previousValue: {
      label: 'Previous',
      color: 'hsl(var(--muted-foreground))',
    },
  }
  
  // Merge current and previous data
  const mergedData = data.map((item, i) => ({
    ...item,
    previousValue: previousData?.[i]?.value,
  }))
  
  const ChartComponent = showArea ? AreaChart : LineChart
  
  return (
    <ChartContainer config={config} className={`h-[${height}px]`}>
      <ChartComponent data={mergedData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="label" 
          tickLine={false}
          axisLine={false}
          fontSize={10}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          fontSize={10}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={formatValue}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {previousData && (
          showArea ? (
            <Area 
              type="monotone"
              dataKey="previousValue" 
              stroke="hsl(var(--muted-foreground))"
              fill="hsl(var(--muted-foreground))"
              fillOpacity={0.1}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ) : (
            <Line 
              type="monotone"
              dataKey="previousValue" 
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              strokeDasharray="4 4"
              dot={false}
            />
          )
        )}
        {showArea ? (
          <Area 
            type="monotone"
            dataKey="value" 
            stroke={color}
            fill={color}
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, cursor: onClick ? 'pointer' : undefined }}
          />
        ) : (
          <Line 
            type="monotone"
            dataKey="value" 
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, cursor: onClick ? 'pointer' : undefined }}
          />
        )}
      </ChartComponent>
    </ChartContainer>
  )
}

interface SimplePieChartProps {
  data: ChartDataPoint[]
  height?: number
  formatValue?: (value: number) => string
  onClick?: (item: ChartDataPoint) => void
}

export function SimplePieChart({ 
  data, 
  height = 200,
  formatValue = (v) => v.toLocaleString(),
  onClick,
}: SimplePieChartProps) {
  const config: ChartConfig = data.reduce((acc, item, i) => {
    acc[item.label] = {
      label: item.label,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }
    return acc
  }, {} as ChartConfig)
  
  return (
    <ChartContainer config={config} className={`h-[${height}px]`}>
      <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={height / 3}
          innerRadius={height / 5}
          paddingAngle={2}
          cursor={onClick ? 'pointer' : undefined}
          onClick={(data) => onClick?.(data as unknown as ChartDataPoint)}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend 
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          formatter={(value) => <span className="text-xs">{value}</span>}
        />
      </PieChart>
    </ChartContainer>
  )
}

// Heatmap component (simplified)
interface HeatmapProps {
  data: { weekday: string; hour: number; value: number }[]
  height?: number
  formatValue?: (value: number) => string
  onClick?: (item: { weekday: string; hour: number; value: number }) => void
}

export function SimpleHeatmap({ 
  data, 
  height = 200,
  formatValue = (v) => v.toLocaleString(),
  onClick,
}: HeatmapProps) {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const hours = Array.from({ length: 11 }, (_, i) => i + 8) // 8 AM to 6 PM
  
  const maxValue = Math.max(...data.map(d => d.value), 1)
  
  const getColor = (value: number) => {
    const intensity = value / maxValue
    const hue = 200 // Blue
    const saturation = 70
    const lightness = 95 - (intensity * 50)
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }
  
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[400px]" style={{ height }}>
        <div className="grid gap-0.5" style={{ gridTemplateColumns: `40px repeat(${hours.length}, 1fr)` }}>
          {/* Header row */}
          <div className="text-xs text-muted-foreground"></div>
          {hours.map(hour => (
            <div key={hour} className="text-[10px] text-muted-foreground text-center">
              {hour}:00
            </div>
          ))}
          
          {/* Data rows */}
          {weekdays.map(weekday => (
            <>
              <div key={`${weekday}-label`} className="text-[10px] text-muted-foreground flex items-center">
                {weekday}
              </div>
              {hours.map(hour => {
                const cell = data.find(d => d.weekday === weekday && d.hour === hour)
                const value = cell?.value || 0
                return (
                  <div
                    key={`${weekday}-${hour}`}
                    className={cn(
                      'aspect-square rounded-sm transition-colors',
                      onClick && 'cursor-pointer hover:ring-1 hover:ring-primary'
                    )}
                    style={{ backgroundColor: getColor(value) }}
                    onClick={() => cell && onClick?.(cell)}
                    title={`${weekday} ${hour}:00 - ${formatValue(value)}`}
                  />
                )
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
