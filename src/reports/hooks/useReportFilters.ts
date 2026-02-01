import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useKV } from '@github/spark/hooks'
import { applyReportDefaults, parseFiltersFromQuery, serializeFiltersToQuery } from '../filters'
import { FilterState, ReportId } from '../types'

const STORAGE_KEY = 'reports-filters'

export const useReportFilters = (reportId: ReportId) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [storedFilters, setStoredFilters] = useKV<FilterState>(STORAGE_KEY, applyReportDefaults(reportId, parseFiltersFromQuery(new URLSearchParams(), reportId)))

  const initialFilters = useMemo(() => {
    if (Array.from(searchParams.keys()).length > 0) {
      return parseFiltersFromQuery(searchParams, reportId)
    }
    return applyReportDefaults(reportId, storedFilters)
  }, [reportId, searchParams, storedFilters])

  useEffect(() => {
    setStoredFilters(initialFilters)
  }, [initialFilters, setStoredFilters])

  const setFilters = useCallback(
    (next: FilterState) => {
      setStoredFilters(next)
      const params = serializeFiltersToQuery(next)
      setSearchParams(params, { replace: true })
    },
    [setStoredFilters, setSearchParams]
  )

  const resetFilters = useCallback(() => {
    const next = applyReportDefaults(reportId, storedFilters)
    setFilters(next)
  }, [reportId, storedFilters, setFilters])

  return {
    filters: storedFilters,
    setFilters,
    resetFilters
  }
}
