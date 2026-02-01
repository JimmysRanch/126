import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { metricRegistry } from '../metrics'

export const DefinitionsModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Metric Definitions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {metricRegistry.map((metric) => (
            <div key={metric.id} className="rounded-md border border-border p-3">
              <p className="text-sm font-semibold">{metric.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{metric.definition}</p>
              <p className="text-xs mt-1">Formula: {metric.formula}</p>
              {metric.exclusions && <p className="text-xs mt-1">Exclusions: {metric.exclusions}</p>}
              {metric.timeBasisSensitivity && <p className="text-xs mt-1">Time basis: {metric.timeBasisSensitivity}</p>}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
