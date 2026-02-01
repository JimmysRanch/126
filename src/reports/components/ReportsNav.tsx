import { NavLink } from 'react-router-dom'
import { useKV } from '@github/spark/hooks'
import { reportNavItems } from '../report-config'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export const ReportsNav = () => {
  const [showAll, setShowAll] = useKV<boolean>('reports-show-all', false)

  const items = showAll ? reportNavItems : reportNavItems.filter((item) => item.essentials)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <p className="text-sm font-medium">Show all reports</p>
          <p className="text-xs text-muted-foreground">Essentials include Overview, Profit, Retention, Staff.</p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="show-all" className="text-xs text-muted-foreground">All</Label>
          <Switch id="show-all" checked={showAll} onCheckedChange={setShowAll} />
        </div>
      </div>
      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
