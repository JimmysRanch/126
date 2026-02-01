import { useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Appointment, Client, InventoryItem, Staff, Transaction } from '@/lib/types'
import { normalizeReportsData } from '../normalization'
import { computeReportData } from '../analytics'
import { FilterState, ReportId } from '../types'
import { useDebouncedValue } from './useReportUtils'

export const useReportData = (reportId: ReportId, filters: FilterState) => {
  const [appointments] = useKV<Appointment[]>('appointments', [])
  const [transactions] = useKV<Transaction[]>('transactions', [])
  const [clients] = useKV<Client[]>('clients', [])
  const [staff] = useKV<Staff[]>('staff', [])
  const [inventory] = useKV<InventoryItem[]>('inventory', [])
  const [messages] = useKV<any[]>('messages', [])

  const normalized = useMemo(
    () =>
      normalizeReportsData({
        appointments: appointments || [],
        transactions: transactions || [],
        clients: clients || [],
        staff: staff || [],
        inventory: inventory || [],
        messages: messages || []
      }),
    [appointments, transactions, clients, staff, inventory, messages]
  )

  const debouncedFilters = useDebouncedValue(filters, 250)

  const reportData = useMemo(() => computeReportData(reportId, normalized, debouncedFilters), [reportId, normalized, debouncedFilters])

  return {
    data: reportData,
    normalized
  }
}
