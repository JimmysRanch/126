import { KPIValue } from '../types'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export const KPICard = ({ kpi, onClick }: { kpi: KPIValue; onClick?: () => void }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              'cursor-pointer border border-border/60 p-4 transition hover:border-primary/40 hover:shadow-sm',
              onClick ? '' : 'cursor-default'
            )}
            onClick={onClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-semibold">{kpi.formattedValue}</p>
              </div>
              {kpi.deltaFormatted && (
                <div className={cn('text-xs font-medium', kpi.trend === 'down' ? 'text-red-500' : 'text-emerald-500')}>
                  {kpi.trend === 'down' ? '↓' : '↑'} {kpi.deltaFormatted}
                </div>
              )}
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs whitespace-pre-line text-xs">
          {kpi.tooltip || 'No definition provided.'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
