import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export const ExportManager = ({
  onExportCsv,
  onExportPdf,
  onExportPng
}: {
  onExportCsv: () => void
  onExportPdf: () => void
  onExportPng: () => void
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Export
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Button className="w-full" onClick={onExportCsv}>Export table CSV</Button>
          <Button className="w-full" onClick={onExportPdf}>Export PDF</Button>
          <Button className="w-full" onClick={onExportPng}>Copy chart as PNG</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
