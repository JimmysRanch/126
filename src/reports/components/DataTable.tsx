import { useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableData, TableRow as ReportRow } from '../types'
import { formatMetric } from '../metrics'

export const DataTable = ({
  table,
  groupBy,
  onGroupByChange,
  visibleColumns,
  onColumnsChange,
  onRowClick
}: {
  table: TableData
  groupBy?: string
  onGroupByChange?: (value: string) => void
  visibleColumns?: string[]
  onColumnsChange?: (value: string[]) => void
  onRowClick?: (row: ReportRow, columnId?: string) => void
}) => {
  const [showAll, setShowAll] = useState(false)
  const columns = useMemo(() => {
    if (!visibleColumns || visibleColumns.length === 0) {
      return table.columns
    }
    return table.columns.filter((column) => visibleColumns.includes(column.id))
  }, [table.columns, visibleColumns])

  const rows = showAll ? table.rows : table.rows.slice(0, 5)

  const toggleColumn = (columnId: string) => {
    if (!onColumnsChange) return
    const next = new Set(visibleColumns || table.columns.map((column) => column.id))
    if (next.has(columnId)) {
      next.delete(columnId)
    } else {
      next.add(columnId)
    }
    onColumnsChange(Array.from(next))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {table.groupByOptions.length > 0 && (
          <Select value={groupBy || table.groupByOptions[0]} onValueChange={onGroupByChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              {table.groupByOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {table.columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={(visibleColumns || table.columns.map((col) => col.id)).includes(column.id)}
                onCheckedChange={() => toggleColumn(column.id)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="sm" onClick={() => setShowAll((prev) => !prev)}>
          {showAll ? 'Show Top 5' : 'View All'}
        </Button>
      </div>
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group</TableHead>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.align === 'right' ? 'text-right' : undefined}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => onRowClick?.(row)}>
                <TableCell className="font-medium">{row.label}</TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={column.align === 'right' ? 'text-right' : undefined}
                    onClick={(event) => {
                      event.stopPropagation()
                      onRowClick?.(row, column.id)
                    }}
                  >
                    {typeof row.values[column.id] === 'number'
                      ? formatMetric(row.values[column.id] as number, column.format || 'int')
                      : row.values[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
