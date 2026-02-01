import { useKV } from '@github/spark/hooks'
import { reportNavItems } from '@/reports/report-config'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useNavigate } from 'react-router-dom'

export const ReportsLanding = () => {
  const [showAll, setShowAll] = useKV<boolean>('reports-show-all', false)
  const navigate = useNavigate()

  const items = showAll ? reportNavItems : reportNavItems.filter((item) => item.essentials)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reports & Insights</h1>
          <p className="text-sm text-muted-foreground">Jump into a report to explore metrics, trends, and drilldowns.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Essentials</span>
          <Switch checked={showAll} onCheckedChange={setShowAll} />
          <span className="text-xs text-muted-foreground">Show All</span>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="p-4 flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-1">View KPIs, insights, and drilldowns.</p>
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate(item.path)}>
              Open report
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
