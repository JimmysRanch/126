import { useState } from 'react'
import { useReportFilters } from '@/reports/hooks/useReportFilters'
import { useReportData } from '@/reports/hooks/useReportData'
import { ReportShell } from '@/reports/components/ReportShell'
import { KPICard } from '@/reports/components/KPICard'
import { InsightsStrip } from '@/reports/components/InsightsStrip'
import { ChartCard } from '@/reports/components/ChartCard'
import { DataTable } from '@/reports/components/DataTable'
import { DrillDrawer } from '@/reports/components/DrillDrawer'
import { DrillRequest, ReportId } from '@/reports/types'
import { reportTitles } from '@/reports/report-config'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export const ReportPage = ({ reportId }: { reportId: ReportId }) => {
  const { filters, setFilters, resetFilters } = useReportFilters(reportId)
  const { data, normalized } = useReportData(reportId, filters)
  const [drillOpen, setDrillOpen] = useState(false)
  const [drillRequest, setDrillRequest] = useState<DrillRequest | undefined>(undefined)

  const title = reportTitles[reportId]

  const handleDrill = (request: DrillRequest) => {
    setDrillRequest(request)
    setDrillOpen(true)
  }

  const table = data.table

  const visibleColumns = filters.visibleColumns || table.columns.map((column) => column.id)

  return (
    <ReportShell
      reportId={reportId}
      title={title}
      filters={filters}
      onChangeFilters={setFilters}
      onResetFilters={resetFilters}
      data={normalized}
      table={table}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Label htmlFor="compare-mode" className="text-xs text-muted-foreground">Compare to prior period</Label>
          <Switch
            id="compare-mode"
            checked={filters.compareMode}
            onCheckedChange={(checked) => setFilters({ ...filters, compareMode: checked })}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          {data.kpis.map((kpi) => (
            <KPICard
              key={kpi.id}
              kpi={kpi}
              onClick={() =>
                handleDrill({
                  title: kpi.label,
                  rowTypes: kpi.drillRowTypes || ['appointments', 'transactions'],
                  filters: { metricId: kpi.id }
                })
              }
            />
          ))}
        </div>

        <InsightsStrip
          insights={data.insights}
          onInsightClick={(insight) => {
            if (insight.drill) {
              handleDrill(insight.drill)
            }
          }}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {data.charts.map((chart) => (
            <ChartCard
              key={chart.id}
              chart={chart}
              onExport={() => handleDrill({ title: chart.title, rowTypes: ['appointments', 'transactions'], filters: { chartId: chart.id } })}
              onDrill={() => handleDrill({ title: chart.title, rowTypes: ['appointments', 'transactions'], filters: { chartId: chart.id } })}
            />
          ))}
        </div>

        <DataTable
          table={table}
          groupBy={filters.groupBy}
          visibleColumns={visibleColumns}
          onGroupByChange={(value) => setFilters({ ...filters, groupBy: value })}
          onColumnsChange={(value) => setFilters({ ...filters, visibleColumns: value })}
          onRowClick={(row) => {
            if (row.drill) {
              handleDrill(row.drill)
            }
          }}
        />
      </div>

      <DrillDrawer request={drillRequest} data={normalized} open={drillOpen} onOpenChange={setDrillOpen} />
    </ReportShell>
  )
}
