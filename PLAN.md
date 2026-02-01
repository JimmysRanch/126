# Reports & Insights Module Plan

## Repo audit notes
- Routing lives in `src/App.tsx`; `/reports` currently renders `PlaceholderPage` and there is already a top-level nav item in `src/components/TopNav.tsx`.
- UI primitives are in `src/components/ui/*` (cards, tables, dialogs, drawer, sheet, tooltip, tabs, etc.). Charts already use Recharts via `src/components/ui/chart.tsx`.
- Data is stored via `useKV` (localStorage) in `src/lib/spark-hooks.ts` and is already used for appointments, transactions, clients, staff, inventory, settings.
- Data models are defined in `src/lib/types.ts` (appointments, transactions, staff, inventory, etc.).

## File/folder layout to add
- `src/pages/reports/*` for routing and report pages.
- `src/reports/*` for analytics + shared report logic.
  - `analytics.ts` (core computations + memoized caches)
  - `filters.ts` (filter defaults, URL parsing/serialization)
  - `normalization.ts` (adapter from useKV data into normalized records)
  - `metrics.ts` (metric dictionary + formatting helpers)
  - `insights.ts` (rules-based insights engine)
  - `exports.ts` (CSV/PDF/PNG export helpers)
  - `types.ts` (shared types)
  - `hooks/` (filter + data hooks)
  - `components/` (ReportShell, KPICard, InsightsStrip, ChartCard, DataTable, DrillDrawer, SavedViewsManager, ExportManager, ScheduleManager, DefinitionsModal, etc.)

## Key components
- **ReportShell**: layout wrapper (left sidebar with report navigation + filters, header actions, content slots).
- **FiltersSidebar**: global filters with persistence + clear/reset.
- **KPICard**: shows metric values and tooltips from metric dictionary; click triggers drill drawer.
- **InsightsStrip**: 1–3 insights with actions to drill.
- **ChartCard**: chart container + export buttons.
- **DataTable**: group-by, column picker, sorting, Top 5 preview + View All.
- **DrillDrawer**: right-side drawer (mobile full-screen) with row tabs + actions.
- **SavedViewsManager**: save/list/apply view configs.
- **ExportManager**: CSV/PDF/PNG exports.
- **ScheduleManager**: schedule UI + local preview job execution.
- **DefinitionsModal**: metric dictionary modal (tooltips + list).

## Data normalization & adapters
- Build `normalizeReportsData()` that ingests `useKV` records for appointments/transactions/clients/staff/inventory/messages.
- Convert money values to integer cents.
- Derive:
  - `serviceCategory` from service/add-on metadata.
  - `clientType` (new/returning) based on first appointment date.
  - `petSize` from appointment weight category.
  - `channel` defaulted from appointment notes or fallback values.
  - `paymentMethod` from transactions.
- Provide `getDateForBasis()` helper to apply time basis (service/checkout/transaction).

## Analytics engine function map
- `buildAggregations(data)` -> pre-aggregates by day + day×(staff/service/category).
- `applyFilters(data, filters)` -> filtered arrays based on global filters.
- `computeKpis(reportId, data, filters, compare)` -> KPI deck + deltas.
- `computeCharts(reportId, data, filters, compare)` -> chart series.
- `computeTable(reportId, data, filters, groupBy, compare)` -> rows + columns.
- `computeDrillRows(context)` -> exact rows for drawer (appointments/transactions/clients/inventory/messages).
- Memoization keyed by stable filter hash.

## Report-by-report widget map
- Each report definition includes:
  - `defaultTimeBasis`
  - `kpiMetricIds`
  - `chartDefinitions`
  - `tableDefinition`
  - `insightRules`

## Drill-anywhere implementation
- Global `DrillContext` stores target (metric/chart/table), dimension filters, and row types.
- `KPICard`, `ChartCard`, and `DataTable` call `onDrill()` with a filter payload.
- `DrillDrawer` fetches drill rows from analytics (appointments/transactions/clients/inventory/messages) and offers actions: open appointment/client, copy, export CSV.

## Execution steps
1. Replace `/reports` route with full nested reports routing and add report pages.
2. Implement shared report shell/components.
3. Implement normalization + analytics + insights + caches.
4. Build each report in the required order using the shared components.
5. Add saved views, export manager, scheduling UI.
6. Add reconciliation tests + performance logs + accessibility refinements.
7. Final polish (empty states, badges, mobile layout).
