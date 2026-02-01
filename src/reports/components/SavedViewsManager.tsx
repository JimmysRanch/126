import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { SavedView } from '../types'
import { v4 as uuidv4 } from 'uuid'

export const SavedViewsManager = ({
  reportId,
  currentFilters,
  onApply
}: {
  reportId: string
  currentFilters: SavedView['filters']
  onApply: (filters: SavedView['filters']) => void
}) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [savedViews, setSavedViews] = useKV<SavedView[]>('reports-saved-views', [])

  const handleSave = () => {
    if (!name.trim()) return
    const next: SavedView = {
      id: uuidv4(),
      name,
      reportId: reportId as SavedView['reportId'],
      filters: currentFilters
    }
    setSavedViews([next, ...savedViews])
    setName('')
  }

  const reportViews = savedViews.filter((view) => view.reportId === reportId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Save View
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Saved Views</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="View name" value={name} onChange={(event) => setName(event.target.value)} />
            <Button onClick={handleSave}>Save</Button>
          </div>
          <div className="space-y-2">
            {reportViews.length === 0 && <p className="text-sm text-muted-foreground">No saved views yet.</p>}
            {reportViews.map((view) => (
              <div key={view.id} className="flex items-center justify-between rounded-md border border-border p-2">
                <div>
                  <p className="text-sm font-medium">{view.name}</p>
                  <p className="text-xs text-muted-foreground">{view.filters.datePreset} · {view.filters.timeBasis}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => onApply(view.filters)}>
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
