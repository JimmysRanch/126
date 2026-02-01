import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DrillRequest, DrillRowType, NormalizedData } from '../types'
import { exportRowsToCsv } from '../exports'
import { useIsMobile } from '../hooks/useReportUtils'
import { formatInBusinessTimezone } from '@/lib/date-utils'
import { formatMetric } from '../metrics'

const buildRows = (request: DrillRequest, data: NormalizedData) => {
  const filters = request.filters
  const rowsByType: Record<DrillRowType, Array<Record<string, string | number | null>>> = {
    appointments: data.appointments
      .filter((appointment) => {
        if (filters.staff && appointment.staffId !== filters.staff) return false
        if (filters.service && !appointment.services.some((service) => service.name === filters.service || service.id === filters.service)) return false
        if (filters.status && appointment.status !== filters.status) return false
        if (filters.channel && appointment.channel !== filters.channel) return false
        return true
      })
      .map((appointment) => ({
        id: appointment.id,
        type: 'Appointment',
        client: appointment.clientName,
        staff: appointment.staffName,
        date: formatInBusinessTimezone(appointment.date, 'MMM d'),
        amount: formatMetric(appointment.totalCents, 'money')
      })),
    transactions: data.transactions
      .filter((transaction) => {
        if (filters.paymentMethod && transaction.paymentMethod !== filters.paymentMethod) return false
        if (filters.transactionId && transaction.id !== filters.transactionId) return false
        return true
      })
      .map((transaction) => ({
        id: transaction.id,
        type: 'Transaction',
        client: transaction.clientName,
        date: formatInBusinessTimezone(transaction.date, 'MMM d'),
        amount: formatMetric(transaction.totalCents, 'money'),
        status: transaction.status
      })),
    clients: data.clients.map((client) => ({
      id: client.id,
      name: client.name,
      type: client.type,
      city: client.city || '—'
    })),
    inventory: data.inventoryItems.map((item) => ({
      id: item.id,
      item: item.name,
      onHand: item.quantity,
      unitCost: formatMetric(item.unitCostCents, 'money')
    })),
    messages: data.messages.map((message) => ({
      id: message.id,
      channel: message.channel,
      sentAt: formatInBusinessTimezone(message.sentAt, 'MMM d'),
      cost: formatMetric(message.costCents, 'money')
    }))
  }

  return rowsByType
}

export const DrillDrawer = ({
  request,
  data,
  open,
  onOpenChange
}: {
  request?: DrillRequest
  data: NormalizedData
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<DrillRowType>('appointments')

  const rowsByType = useMemo(() => (request ? buildRows(request, data) : null), [request, data])
  const availableTabs = request?.rowTypes || []

  useEffect(() => {
    if (request?.rowTypes?.length) {
      setActiveTab(request.rowTypes[0])
    }
  }, [request])

  const content = (
    <div className="flex h-full flex-col">
      <div className="px-4">
        <p className="text-xs text-muted-foreground">Showing {request?.title}</p>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DrillRowType)} className="mt-3">
          <TabsList>
            {availableTabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          {availableTabs.map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-2">
                  {rowsByType?.[tab]?.map((row) => (
                    <div key={row.id} className="rounded-md border border-border p-3 text-xs">
                      {Object.entries(row).map(([key, value]) => (
                        <div key={key} className="flex justify-between gap-4">
                          <span className="text-muted-foreground">{key}</span>
                          <span>{value}</span>
                        </div>
                      ))}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {row.id && tab === 'appointments' && (
                          <Button size="sm" variant="outline" onClick={() => navigate(`/appointments/${row.id}/edit`)}>
                            Open appointment
                          </Button>
                        )}
                        {row.id && tab === 'clients' && (
                          <Button size="sm" variant="outline" onClick={() => navigate(`/clients/${row.id}`)}>
                            Open client
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(row))}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-border p-4">
        <Button
          size="sm"
          onClick={() => {
            const rows = rowsByType?.[activeTab] || []
            exportRowsToCsv(rows, `drill-${activeTab}.csv`)
          }}
        >
          Export rows CSV
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </div>
    </div>
  )

  if (!request) return null

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-screen">
          <SheetHeader>
            <SheetTitle>{request.title}</SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full">
        <DrawerHeader>
          <DrawerTitle>{request.title}</DrawerTitle>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  )
}
