import { ReactNode, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { SavedViewsManager } from './SavedViewsManager'
import { ExportManager } from './ExportManager'
import { ScheduleManager } from './ScheduleManager'
import { DefinitionsModal } from './DefinitionsModal'
import { FilterSidebar } from './FilterSidebar'
import { ReportsNav } from './ReportsNav'
import { FilterState, NormalizedData, ReportId, TableData } from '../types'
import { useIsMobile } from '../hooks/useReportUtils'
import { exportElementToPdf, exportElementToPng, exportTableToCsv } from '../exports'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const getCompletenessBadges = (data: NormalizedData) => {
  const badges: Array<{ label: string; link: string }> = []
  const missingInventoryCost = data.inventoryItems.some((item) => item.unitCostCents === 0)
  const missingLabor = data.staff.some((member) => !member.hourlyRateCents)

  if (missingInventoryCost) {
    badges.push({ label: 'Missing inventory unit costs', link: '/settings' })
  }
  if (missingLabor) {
    badges.push({ label: 'Missing labor model', link: '/settings' })
  }
  return badges
}

export const ReportShell = ({
  reportId,
  title,
  filters,
  onChangeFilters,
  onResetFilters,
  data,
  table,
  children
}: {
  reportId: ReportId
  title: string
  filters: FilterState
  onChangeFilters: (filters: FilterState) => void
  onResetFilters: () => void
  data: NormalizedData
  table: TableData
  children: ReactNode
}) => {
  const isMobile = useIsMobile()
  const [definitionsOpen, setDefinitionsOpen] = useState(false)
  const reportRef = useRef<HTMLDivElement | null>(null)

  const filterOptions = useMemo(() => {
    return {
      staff: data.staff.map((member) => ({ id: member.id, name: member.name })),
      services: data.serviceCatalog.map((service) => ({ id: service.id, name: service.name })),
      categories: Array.from(new Set(data.serviceCatalog.map((service) => service.category))),
      locations: data.locations,
      paymentMethods: Array.from(new Set(data.transactions.map((transaction) => transaction.paymentMethod)))
    }
  }, [data])

  const badges = getCompletenessBadges(data)

  return (
    <div className="flex h-full">
      <aside className="hidden w-72 shrink-0 border-r border-border bg-muted/30 p-4 lg:block">
        <ReportsNav />
        <div className="mt-6">
          <FilterSidebar filters={filters} onChange={onChangeFilters} onReset={onResetFilters} options={filterOptions} />
        </div>
      </aside>

      <div className="flex-1">
        <div className="border-b border-border bg-background px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">{title}</h1>
              <p className="text-xs text-muted-foreground">Reports & Insights</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <Badge key={badge.label} variant="secondary">
                    {badge.label} · <a href={badge.link} className="underline ml-1">Go to Settings</a>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filters.timeBasis} onValueChange={(value) => onChangeFilters({ ...filters, timeBasis: value as FilterState['timeBasis'] })}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Time basis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Service Date</SelectItem>
                  <SelectItem value="checkout">Checkout Date</SelectItem>
                  <SelectItem value="transaction">Transaction Date</SelectItem>
                </SelectContent>
              </Select>
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">Filters</Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[90vw]">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <ReportsNav />
                      <div className="mt-6">
                        <FilterSidebar filters={filters} onChange={onChangeFilters} onReset={onResetFilters} options={filterOptions} />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              <SavedViewsManager reportId={reportId} currentFilters={filters} onApply={onChangeFilters} />
              <ScheduleManager table={table} reportElement={reportRef.current} />
              <ExportManager
                onExportCsv={() => exportTableToCsv(table, `${reportId}-table.csv`)}
                onExportPdf={() => reportRef.current && exportElementToPdf(reportRef.current, `${reportId}.pdf`)}
                onExportPng={() => reportRef.current && exportElementToPng(reportRef.current, `${reportId}.png`)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDefinitionsOpen(true)}>
                Definitions
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4" ref={reportRef}>
          {children}
        </div>
      </div>

      <DefinitionsModal open={definitionsOpen} onOpenChange={setDefinitionsOpen} />
    </div>
  )
}
