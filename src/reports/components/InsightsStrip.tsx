import { InsightsItem } from '../types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const InsightsStrip = ({ insights, onInsightClick }: { insights: InsightsItem[]; onInsightClick?: (insight: InsightsItem) => void }) => {
  if (!insights.length) {
    return (
      <Card className="border-dashed border-border/70 p-4 text-sm text-muted-foreground">
        No insights surfaced for the selected filters.
      </Card>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {insights.map((insight) => (
        <Card key={insight.id} className="p-4">
          <p className="text-sm font-semibold">{insight.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
          {insight.action && (
            <p className="text-xs text-muted-foreground mt-2">Suggested: {insight.action}</p>
          )}
          {insight.drill && (
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => onInsightClick?.(insight)}>
              View details
            </Button>
          )}
        </Card>
      ))}
    </div>
  )
}
