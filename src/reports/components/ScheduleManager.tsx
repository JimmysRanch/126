import { useMemo, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ReportSchedule, SavedView } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { createCsvBlob, createPdfBlob } from '../exports'
import { TableData } from '../types'

export const ScheduleManager = ({
  table,
  reportElement
}: {
  table: TableData
  reportElement: HTMLElement | null
}) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [savedViews] = useKV<SavedView[]>('reports-saved-views', [])
  const [schedules, setSchedules] = useKV<ReportSchedule[]>('reports-schedules', [])
  const [selectedView, setSelectedView] = useState<string | undefined>(savedViews[0]?.id)
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly')
  const [dayOfWeek, setDayOfWeek] = useState('Monday')
  const [dayOfMonth, setDayOfMonth] = useState(1)
  const [time, setTime] = useState('09:00')
  const [recipients, setRecipients] = useState('')
  const [previewLinks, setPreviewLinks] = useState<{ csv?: string; pdf?: string }>({})

  const viewOptions = useMemo(() => savedViews.map((view) => ({ id: view.id, name: view.name })), [savedViews])

  const handleSave = () => {
    if (!selectedView) return
    const next: ReportSchedule = {
      id: uuidv4(),
      name: name || 'Scheduled report',
      savedViewId: selectedView,
      frequency,
      dayOfWeek: frequency === 'weekly' ? dayOfWeek : undefined,
      dayOfMonth: frequency === 'monthly' ? dayOfMonth : undefined,
      time,
      recipients
    }
    setSchedules([next, ...schedules])
    setName('')
  }

  const handleRunPreview = async () => {
    const csvBlob = createCsvBlob(
      table.rows.map((row) => ({
        group: row.label,
        ...row.values
      }))
    )
    const pdfBlob = reportElement ? await createPdfBlob(reportElement) : null
    setPreviewLinks({
      csv: csvBlob ? URL.createObjectURL(csvBlob) : undefined,
      pdf: pdfBlob ? URL.createObjectURL(pdfBlob) : undefined
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Schedule
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Schedule name" value={name} onChange={(event) => setName(event.target.value)} />
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger>
              <SelectValue placeholder="Select saved view" />
            </SelectTrigger>
            <SelectContent>
              {viewOptions.map((view) => (
                <SelectItem key={view.id} value={view.id}>
                  {view.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={frequency} onValueChange={(value) => setFrequency(value as 'weekly' | 'monthly')}>
            <SelectTrigger>
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          {frequency === 'weekly' ? (
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger>
                <SelectValue placeholder="Day of week" />
              </SelectTrigger>
              <SelectContent>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input type="number" min={1} max={28} value={dayOfMonth} onChange={(event) => setDayOfMonth(Number(event.target.value))} />
          )}
          <Input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
          <Input placeholder="Recipients (comma separated)" value={recipients} onChange={(event) => setRecipients(event.target.value)} />
          <Button onClick={handleSave}>Save schedule</Button>
          <Button variant="outline" onClick={handleRunPreview}>Run now (preview)</Button>
          {previewLinks.csv && (
            <div className="text-xs text-muted-foreground">
              Preview ready: <a className="underline" href={previewLinks.csv} download="report.csv">Download CSV</a>{' '}
              {previewLinks.pdf && (
                <>
                  | <a className="underline" href={previewLinks.pdf} download="report.pdf">Download PDF</a>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
