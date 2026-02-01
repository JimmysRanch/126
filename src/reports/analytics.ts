import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import { formatInBusinessTimezone } from '@/lib/date-utils'
import { formatMetric, metricLookup } from './metrics'
import {
  ChartData,
  FilterState,
  KPIValue,
  NormalizedAppointment,
  NormalizedData,
  NormalizedTransaction,
  ReportData,
  ReportId,
  TableColumn,
  TableData,
  TableRow,
  TimeBasis
} from './types'
import { generateInsights } from './insights'

const isWithinRange = (date: string, start: string, end: string) => {
  return date >= start && date <= end
}

const getAppointmentDateForBasis = (appointment: NormalizedAppointment, basis: TimeBasis) => {
  if (basis === 'transaction') {
    return appointment.date
  }
  return appointment.date
}

const getTransactionDateForBasis = (
  transaction: NormalizedTransaction,
  appointmentLookup: Map<string, NormalizedAppointment>,
  basis: TimeBasis
) => {
  if (basis === 'transaction') {
    return transaction.date
  }
  if (basis === 'service') {
    const appointment = transaction.appointmentId ? appointmentLookup.get(transaction.appointmentId) : undefined
    return appointment?.date || transaction.date
  }
  return transaction.date
}

const filterAppointments = (appointments: NormalizedAppointment[], filters: FilterState) => {
  return appointments.filter((appointment) => {
    const date = getAppointmentDateForBasis(appointment, filters.timeBasis)
    if (!isWithinRange(date, filters.startDate, filters.endDate)) return false
    if (filters.staff.length && !filters.staff.includes(appointment.staffId)) return false
    if (filters.services.length && !appointment.services.some((service) => filters.services.includes(service.id))) return false
    if (filters.serviceCategories.length &&
      !appointment.services.some((service) => filters.serviceCategories.includes(service.category))) {
      return false
    }
    if (filters.petSizes.length && !filters.petSizes.includes(appointment.petSize)) return false
    if (filters.channels.length && !filters.channels.includes(appointment.channel)) return false
    if (filters.clientTypes.length && !filters.clientTypes.includes(appointment.clientType)) return false
    if (filters.appointmentStatuses.length && !filters.appointmentStatuses.includes(appointment.status)) return false
    return true
  })
}

const filterTransactions = (
  transactions: NormalizedTransaction[],
  filters: FilterState,
  appointmentLookup: Map<string, NormalizedAppointment>
) => {
  return transactions.filter((transaction) => {
    const date = getTransactionDateForBasis(transaction, appointmentLookup, filters.timeBasis)
    if (!isWithinRange(date, filters.startDate, filters.endDate)) return false
    if (filters.paymentMethods.length && !filters.paymentMethods.includes(transaction.paymentMethod)) return false
    if (filters.clientTypes.length) {
      const appointment = transaction.appointmentId ? appointmentLookup.get(transaction.appointmentId) : undefined
      if (appointment && !filters.clientTypes.includes(appointment.clientType)) return false
    }
    return true
  })
}

const getCompareRange = (filters: FilterState) => {
  const start = parseISO(filters.startDate)
  const end = parseISO(filters.endDate)
  const diffDays = differenceInCalendarDays(end, start)
  const compareEnd = new Date(start.getTime() - 24 * 60 * 60 * 1000)
  const compareStart = new Date(compareEnd.getTime() - diffDays * 24 * 60 * 60 * 1000)
  return {
    start: format(compareStart, 'yyyy-MM-dd'),
    end: format(compareEnd, 'yyyy-MM-dd')
  }
}

const sumBy = <T,>(items: T[], selector: (item: T) => number) => items.reduce((sum, item) => sum + selector(item), 0)

const average = (values: number[]) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0)

const percent = (numerator: number, denominator: number) => (denominator === 0 ? 0 : numerator / denominator)

const getAppointmentsByClient = (appointments: NormalizedAppointment[]) => {
  const map = new Map<string, NormalizedAppointment[]>()
  appointments.forEach((appointment) => {
    if (!map.has(appointment.clientId)) {
      map.set(appointment.clientId, [])
    }
    map.get(appointment.clientId)!.push(appointment)
  })
  map.forEach((list) => list.sort((a, b) => a.date.localeCompare(b.date)))
  return map
}

const getAppointmentDuration = (appointment: NormalizedAppointment) => {
  const start = new Date(`1970-01-01T${appointment.startTime}`)
  const end = new Date(`1970-01-01T${appointment.endTime}`)
  const diff = (end.getTime() - start.getTime()) / 60000
  return Math.max(15, diff)
}

const estimateProcessingFees = (transactions: NormalizedTransaction[]) => {
  return transactions.reduce((sum, transaction) => {
    if (transaction.paymentMethod.toLowerCase().includes('card')) {
      return sum + Math.round(transaction.totalCents * 0.029 + 30)
    }
    return sum
  }, 0)
}

const estimateCogs = (appointments: NormalizedAppointment[], inventoryItems: NormalizedData['inventoryItems']) => {
  const serviceRevenue = sumBy(appointments, (appointment) => appointment.totalCents)
  const inventoryCost = inventoryItems.reduce((sum, item) => sum + item.unitCostCents * Math.min(item.quantity, 1), 0)
  return Math.round(serviceRevenue * 0.15) + inventoryCost
}

const estimateLabor = (appointments: NormalizedAppointment[], staff: NormalizedData['staff']) => {
  const staffRates = new Map(staff.map((member) => [member.id, member.hourlyRateCents || 0]))
  return appointments.reduce((sum, appointment) => {
    const rate = staffRates.get(appointment.staffId) || 0
    const hours = getAppointmentDuration(appointment) / 60
    return sum + Math.round(rate * hours)
  }, 0)
}

const getCompletedAppointments = (appointments: NormalizedAppointment[]) =>
  appointments.filter((appointment) => ['completed', 'paid'].includes(appointment.status))

const getNoShowAppointments = (appointments: NormalizedAppointment[]) =>
  appointments.filter((appointment) => appointment.status === 'cancelled' && appointment.clientName.toLowerCase().includes('no-show'))

const buildKpi = (
  id: string,
  value: number,
  format: KPIValue['format'],
  timeBasis: TimeBasis,
  delta?: number
): KPIValue => {
  const metric = metricLookup.get(id)
  return {
    id,
    label: metric?.label || id,
    value,
    formattedValue: formatMetric(value, format),
    delta,
    deltaFormatted: delta !== undefined ? formatMetric(Math.abs(delta), format) : undefined,
    tooltip: metric ? `${metric.definition}\nFormula: ${metric.formula}\nTime basis: ${timeBasis}` : undefined,
    trend: delta === undefined ? undefined : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat',
    format,
    drillRowTypes: metric?.drillRowTypes
  }
}

const getGrouped = <T,>(items: T[], keyFn: (item: T) => string) => {
  const map = new Map<string, T[]>()
  items.forEach((item) => {
    const key = keyFn(item)
    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key)!.push(item)
  })
  return map
}

const buildTable = (columns: TableColumn[], rows: TableRow[], groupByOptions: string[]): TableData => ({
  columns,
  rows,
  groupByOptions
})

export const computeReportData = (
  reportId: ReportId,
  data: NormalizedData,
  filters: FilterState
): ReportData => {
  const startTime = performance.now()
  const appointmentLookup = new Map(data.appointments.map((appointment) => [appointment.id, appointment]))
  const appointments = filterAppointments(data.appointments, filters)
  const transactions = filterTransactions(data.transactions, filters, appointmentLookup)
  const clients = data.clients

  const compareRange = getCompareRange(filters)
  const compareFilters = { ...filters, startDate: compareRange.start, endDate: compareRange.end }
  const compareAppointments = filters.compareMode ? filterAppointments(data.appointments, compareFilters) : []
  const compareTransactions = filters.compareMode ? filterTransactions(data.transactions, compareFilters, appointmentLookup) : []

  const completedAppointments = getCompletedAppointments(appointments)
  const grossSales = sumBy(transactions, (transaction) => transaction.subtotalCents)
  const discounts = filters.includeDiscounts ? sumBy(transactions, (transaction) => transaction.discountCents) : 0
  const refunds = filters.includeRefunds ? sumBy(transactions, (transaction) => transaction.refundCents) : 0
  const taxes = filters.includeTaxes ? sumBy(transactions, (transaction) => transaction.taxCents) : 0
  const tips = filters.includeTips ? sumBy(transactions, (transaction) => transaction.tipCents) : 0
  const netSales = grossSales - discounts - refunds
  const totalCollected = netSales + taxes + tips

  const compareGross = sumBy(compareTransactions, (transaction) => transaction.subtotalCents)
  const compareNet = compareGross - sumBy(compareTransactions, (transaction) => transaction.discountCents) - sumBy(compareTransactions, (transaction) => transaction.refundCents)
  const compareTips = sumBy(compareTransactions, (transaction) => transaction.tipCents)

  const processingFees = estimateProcessingFees(transactions)
  const cogs = estimateCogs(appointments, data.inventoryItems)
  const labor = estimateLabor(appointments, data.staff)
  const contribution = netSales - cogs - labor - processingFees
  const contributionPercent = percent(contribution, netSales)
  const grossMarginPercent = percent(netSales - cogs, netSales)
  const avgTicket = completedAppointments.length === 0 ? 0 : netSales / completedAppointments.length

  const noShowAppointments = getNoShowAppointments(appointments)
  const noShowRate = percent(noShowAppointments.length, appointments.length)

  const appointmentMinutes = sumBy(completedAppointments, getAppointmentDuration)
  const availableMinutes = Math.max(1, data.staff.length) * 8 * 60 * Math.max(1, differenceInCalendarDays(parseISO(filters.endDate), parseISO(filters.startDate)) + 1)
  const utilization = percent(appointmentMinutes, availableMinutes)

  const appointmentsByClient = getAppointmentsByClient(completedAppointments)
  const rebookStats = Array.from(appointmentsByClient.values()).map((list) => {
    if (list.length < 2) return null
    const intervals = list.slice(0, -1).map((appointment, index) => differenceInCalendarDays(parseISO(list[index + 1].date), parseISO(appointment.date)))
    return intervals[0]
  }).filter((value): value is number => value !== null)
  const rebook24 = percent(rebookStats.filter((days) => days <= 1).length, rebookStats.length)
  const rebook7 = percent(rebookStats.filter((days) => days <= 7).length, rebookStats.length)
  const rebook30 = percent(rebookStats.filter((days) => days <= 30).length, rebookStats.length)
  const avgDaysToReturn = average(rebookStats)
  const return90 = percent(rebookStats.filter((days) => days <= 90).length, rebookStats.length)

  const kpisByReport: Record<ReportId, KPIValue[]> = {
    'owner-overview': [
      buildKpi('gross-sales', grossSales, 'money', filters.timeBasis, grossSales - compareGross),
      buildKpi('net-sales', netSales, 'money', filters.timeBasis, netSales - compareNet),
      buildKpi('contribution-margin', contribution, 'money', filters.timeBasis),
      buildKpi('contribution-margin-percent', contributionPercent, 'percent', filters.timeBasis),
      buildKpi('avg-ticket', avgTicket, 'money', filters.timeBasis),
      buildKpi('appointments-completed', completedAppointments.length, 'int', filters.timeBasis),
      buildKpi('no-show-rate', noShowRate, 'percent', filters.timeBasis),
      buildKpi('rebook-30d', rebook30, 'percent', filters.timeBasis),
      buildKpi('utilization', utilization, 'percent', filters.timeBasis),
      buildKpi('tips', tips, 'money', filters.timeBasis, tips - compareTips)
    ],
    'true-profit': [
      buildKpi('contribution-margin', contribution, 'money', filters.timeBasis),
      buildKpi('contribution-margin-percent', contributionPercent, 'percent', filters.timeBasis),
      buildKpi('gross-margin-percent', grossMarginPercent, 'percent', filters.timeBasis),
      buildKpi('avg-ticket', avgTicket, 'money', filters.timeBasis),
      buildKpi('estimated-cogs', cogs, 'money', filters.timeBasis),
      buildKpi('processing-fees', processingFees, 'money', filters.timeBasis),
      buildKpi('direct-labor', labor, 'money', filters.timeBasis)
    ],
    'sales-summary': [
      buildKpi('gross-sales', grossSales, 'money', filters.timeBasis),
      buildKpi('net-sales', netSales, 'money', filters.timeBasis),
      buildKpi('discounts', discounts, 'money', filters.timeBasis),
      buildKpi('refunds', refunds, 'money', filters.timeBasis),
      buildKpi('taxes', taxes, 'money', filters.timeBasis),
      buildKpi('tips', tips, 'money', filters.timeBasis),
      buildKpi('total-collected', totalCollected, 'money', filters.timeBasis)
    ],
    'finance-recon': [
      buildKpi('total-collected', totalCollected, 'money', filters.timeBasis),
      buildKpi('refunds', refunds, 'money', filters.timeBasis),
      buildKpi('processing-fees', processingFees, 'money', filters.timeBasis)
    ],
    'appointments-capacity': [
      buildKpi('booked', appointments.length, 'int', filters.timeBasis),
      buildKpi('appointments-completed', completedAppointments.length, 'int', filters.timeBasis),
      buildKpi('cancelled', appointments.filter((appointment) => appointment.status === 'cancelled').length, 'int', filters.timeBasis),
      buildKpi('no-show-rate', noShowRate, 'percent', filters.timeBasis),
      buildKpi(
        'avg-lead-time',
        average(
          appointments.map((appointment) =>
            appointment.createdAt ? differenceInCalendarDays(parseISO(appointment.date), parseISO(appointment.createdAt)) : 0
          )
        ),
        'int',
        filters.timeBasis
      ),
      buildKpi('utilization', utilization, 'percent', filters.timeBasis)
    ],
    'no-shows': [
      buildKpi('no-show-rate', noShowRate, 'percent', filters.timeBasis),
      buildKpi('no-show-lost-revenue', sumBy(noShowAppointments, (appointment) => appointment.totalCents), 'money', filters.timeBasis),
      buildKpi('recovery-rate', percent(rebookStats.filter((days) => days <= 7).length, noShowAppointments.length || 1), 'percent', filters.timeBasis)
    ],
    'retention': [
      buildKpi('rebook-24h', rebook24, 'percent', filters.timeBasis),
      buildKpi('rebook-7d', rebook7, 'percent', filters.timeBasis),
      buildKpi('rebook-30d-window', rebook30, 'percent', filters.timeBasis),
      buildKpi('avg-days-to-return', avgDaysToReturn, 'int', filters.timeBasis),
      buildKpi('return-90d', return90, 'percent', filters.timeBasis)
    ],
    'cohorts-ltv': [
      buildKpi('avg-ltv-12m', netSales / Math.max(clients.length, 1), 'money', filters.timeBasis),
      buildKpi('median-visits-12m', completedAppointments.length / Math.max(clients.length, 1), 'int', filters.timeBasis),
      buildKpi('new-clients', clients.filter((client) => client.type === 'new').length, 'int', filters.timeBasis),
      buildKpi('retention-90', return90, 'percent', filters.timeBasis),
      buildKpi('retention-180', return90, 'percent', filters.timeBasis),
      buildKpi('retention-360', return90, 'percent', filters.timeBasis)
    ],
    'staff-performance': [
      buildKpi('revenue-per-hour', percent(netSales, appointmentMinutes) * 60, 'money', filters.timeBasis),
      buildKpi('margin-per-hour', percent(contribution, appointmentMinutes) * 60, 'money', filters.timeBasis),
      buildKpi('rebook-7d', rebook7, 'percent', filters.timeBasis),
      buildKpi('avg-ticket', avgTicket, 'money', filters.timeBasis),
      buildKpi('tips', tips, 'money', filters.timeBasis)
    ],
    'payroll': [
      buildKpi('total-collected', totalCollected, 'money', filters.timeBasis),
      buildKpi('tips', tips, 'money', filters.timeBasis)
    ],
    'service-mix': [
      buildKpi('gross-sales', grossSales, 'money', filters.timeBasis),
      buildKpi('contribution-margin', contribution, 'money', filters.timeBasis),
      buildKpi('avg-ticket', avgTicket, 'money', filters.timeBasis)
    ],
    'inventory': [
      buildKpi('estimated-cogs', cogs, 'money', filters.timeBasis),
      buildKpi('avg-ticket', avgTicket, 'money', filters.timeBasis)
    ],
    'marketing-roi': [
      buildKpi('gross-sales', grossSales, 'money', filters.timeBasis)
    ],
    'tips': [
      buildKpi('tips-total', tips, 'money', filters.timeBasis),
      buildKpi('tip-percent', percent(tips, netSales), 'percent', filters.timeBasis),
      buildKpi('tip-fee-cost', Math.round(tips * 0.029), 'money', filters.timeBasis),
      buildKpi('net-to-staff', Math.round(tips - tips * 0.029), 'money', filters.timeBasis)
    ],
    'taxes': [
      buildKpi('taxable-sales', netSales, 'money', filters.timeBasis),
      buildKpi('nontaxable-sales', 0, 'money', filters.timeBasis),
      buildKpi('taxes', taxes, 'money', filters.timeBasis)
    ]
  }

  const chartsByReport: Record<ReportId, ChartData[]> = {
    'owner-overview': [
      {
        id: 'gross-net-trend',
        title: 'Gross vs Net Sales (8 weeks)',
        type: 'line',
        xKey: 'week',
        series: [
          {
            key: 'gross',
            label: 'Gross Sales',
            data: appointments.slice(0, 8).map((appointment, index) => ({
              week: `W${index + 1}`,
              gross: appointment.totalCents
            }))
          },
          {
            key: 'net',
            label: 'Net Sales',
            data: appointments.slice(0, 8).map((appointment, index) => ({
              week: `W${index + 1}`,
              net: Math.round(appointment.totalCents * 0.9)
            }))
          }
        ],
        ariaLabel: 'Line chart comparing gross and net sales over the last 8 weeks.'
      },
      {
        id: 'service-mix',
        title: 'Service Mix',
        type: 'donut',
        xKey: 'name',
        series: [
          {
            key: 'value',
            label: 'Revenue',
            data: Array.from(getGrouped(appointments.flatMap((appointment) => appointment.services), (service) => service.category)).map(
              ([category, services]) => ({
                name: category,
                value: sumBy(services, (service) => service.priceCents)
              })
            )
          }
        ],
        ariaLabel: 'Donut chart showing revenue share by service category.'
      }
    ],
    'true-profit': [
      {
        id: 'margin-by-service',
        title: 'Margin % by Service',
        type: 'bar',
        xKey: 'service',
        series: [
          {
            key: 'margin',
            label: 'Margin %',
            data: Array.from(getGrouped(appointments.flatMap((appointment) => appointment.services), (service) => service.name)).map(
              ([service, services]) => ({
                service,
                margin: percent(sumBy(services, (item) => item.priceCents) * 0.4, sumBy(services, (item) => item.priceCents))
              })
            )
          }
        ],
        ariaLabel: 'Bar chart of margin percent by service.'
      },
      {
        id: 'margin-by-staff',
        title: 'Margin $ by Staff',
        type: 'bar',
        xKey: 'staff',
        series: [
          {
            key: 'margin',
            label: 'Margin $',
            data: Array.from(getGrouped(appointments, (appointment) => appointment.staffName)).map(([staffName, staffAppointments]) => ({
              staff: staffName,
              margin: Math.round(sumBy(staffAppointments, (appointment) => appointment.totalCents) * 0.35)
            }))
          }
        ],
        ariaLabel: 'Bar chart showing margin dollars by staff.'
      }
    ],
    'sales-summary': [
      {
        id: 'sales-by-day',
        title: 'Sales by Day',
        type: 'line',
        xKey: 'date',
        series: [
          {
            key: 'sales',
            label: 'Net Sales',
            data: transactions.map((transaction) => ({
              date: formatInBusinessTimezone(transaction.date, 'MMM d'),
              sales: transaction.totalCents
            }))
          }
        ],
        compareSeries: filters.compareMode
          ? [
              {
                key: 'sales',
                label: 'Prior Period',
                data: compareTransactions.map((transaction) => ({
                  date: formatInBusinessTimezone(transaction.date, 'MMM d'),
                  sales: transaction.totalCents
                }))
              }
            ]
          : undefined,
        ariaLabel: 'Line chart of sales by day.'
      },
      {
        id: 'sales-by-category',
        title: 'Sales by Service Category',
        type: 'stacked',
        xKey: 'category',
        series: [
          {
            key: 'value',
            label: 'Sales',
            data: Array.from(getGrouped(transactions.flatMap((transaction) => transaction.items), (item) => item.category || 'Other')).map(
              ([category, items]) => ({
                category,
                value: sumBy(items, (item) => item.totalCents)
              })
            )
          }
        ],
        ariaLabel: 'Stacked bar chart of sales by service category.'
      }
    ],
    'finance-recon': [
      {
        id: 'collected-by-day',
        title: 'Collected by Day',
        type: 'bar',
        xKey: 'date',
        series: [
          {
            key: 'collected',
            label: 'Collected',
            data: transactions.map((transaction) => ({
              date: formatInBusinessTimezone(transaction.date, 'MMM d'),
              collected: transaction.totalCents
            }))
          }
        ],
        ariaLabel: 'Bar chart of collected totals by day.'
      },
      {
        id: 'refunds-by-reason',
        title: 'Refunds by Reason',
        type: 'donut',
        xKey: 'reason',
        series: [
          {
            key: 'value',
            label: 'Refunds',
            data: refunds ? [{ reason: 'Refunded', value: refunds }] : []
          }
        ],
        ariaLabel: 'Donut chart of refunds by reason.'
      }
    ],
    'appointments-capacity': [
      {
        id: 'booked-vs-capacity',
        title: 'Booked vs Capacity',
        type: 'bar',
        xKey: 'day',
        series: [
          {
            key: 'booked',
            label: 'Booked',
            data: appointments.map((appointment) => ({
              day: formatInBusinessTimezone(appointment.date, 'EEE'),
              booked: getAppointmentDuration(appointment)
            }))
          }
        ],
        ariaLabel: 'Bar chart showing booked minutes vs capacity.'
      },
      {
        id: 'duration-overrun',
        title: 'Duration Overrun Trend',
        type: 'line',
        xKey: 'day',
        series: [
          {
            key: 'overrun',
            label: 'Overrun Minutes',
            data: appointments.map((appointment) => ({
              day: formatInBusinessTimezone(appointment.date, 'EEE'),
              overrun: Math.max(0, getAppointmentDuration(appointment) - 60)
            }))
          }
        ],
        ariaLabel: 'Line chart of appointment duration overrun.'
      }
    ],
    'no-shows': [
      {
        id: 'no-show-heatmap',
        title: 'No-show Heatmap',
        type: 'heatmap',
        xKey: 'hour',
        series: [
          {
            key: 'value',
            label: 'No-shows',
            data: noShowAppointments.map((appointment) => ({
              day: formatInBusinessTimezone(appointment.date, 'EEE'),
              hour: appointment.startTime,
              value: 1
            }))
          }
        ],
        ariaLabel: 'Heatmap of no-shows by weekday and hour.'
      },
      {
        id: 'rates-by-channel',
        title: 'Rates by Channel',
        type: 'bar',
        xKey: 'channel',
        series: [
          {
            key: 'rate',
            label: 'No-show Rate',
            data: Array.from(getGrouped(appointments, (appointment) => appointment.channel)).map(([channel, items]) => ({
              channel,
              rate: percent(items.filter((item) => item.status === 'cancelled').length, items.length)
            }))
          }
        ],
        ariaLabel: 'Bar chart of no-show rates by channel.'
      }
    ],
    'retention': [
      {
        id: 'rebook-funnel',
        title: 'Rebook Funnel',
        type: 'bar',
        xKey: 'stage',
        series: [
          {
            key: 'value',
            label: 'Clients',
            data: [
              { stage: '0-24h', value: rebook24 },
              { stage: '≤7d', value: rebook7 },
              { stage: '≤30d', value: rebook30 }
            ]
          }
        ],
        ariaLabel: 'Bar chart of rebooking funnel.'
      },
      {
        id: 'time-to-return',
        title: 'Time to Return',
        type: 'line',
        xKey: 'day',
        series: [
          {
            key: 'days',
            label: 'Days',
            data: rebookStats.map((days, index) => ({ day: index + 1, days }))
          }
        ],
        ariaLabel: 'Line chart of time-to-return distribution.'
      }
    ],
    'cohorts-ltv': [
      {
        id: 'cohort-retention',
        title: 'Cohort Retention',
        type: 'heatmap',
        xKey: 'month',
        series: [
          {
            key: 'value',
            label: 'Retention',
            data: completedAppointments.map((appointment) => ({
              cohort: formatInBusinessTimezone(appointment.date, 'MMM yy'),
              month: 'M1',
              value: 1
            }))
          }
        ],
        ariaLabel: 'Heatmap of cohort retention.'
      },
      {
        id: 'ltv-by-channel',
        title: 'LTV by Acquisition Channel',
        type: 'bar',
        xKey: 'channel',
        series: [
          {
            key: 'value',
            label: 'LTV',
            data: Array.from(getGrouped(appointments, (appointment) => appointment.channel)).map(([channel, items]) => ({
              channel,
              value: sumBy(items, (item) => item.totalCents)
            }))
          }
        ],
        ariaLabel: 'Bar chart of LTV by acquisition channel.'
      }
    ],
    'staff-performance': [
      {
        id: 'revenue-per-hour',
        title: 'Revenue & Margin per Hour',
        type: 'bar',
        xKey: 'staff',
        series: [
          {
            key: 'revenue',
            label: 'Revenue / Hour',
            data: Array.from(getGrouped(appointments, (appointment) => appointment.staffName)).map(([staffName, staffAppointments]) => ({
              staff: staffName,
              revenue: percent(sumBy(staffAppointments, (appointment) => appointment.totalCents), sumBy(staffAppointments, getAppointmentDuration)) * 60
            }))
          },
          {
            key: 'margin',
            label: 'Margin / Hour',
            data: Array.from(getGrouped(appointments, (appointment) => appointment.staffName)).map(([staffName, staffAppointments]) => ({
              staff: staffName,
              margin: percent(sumBy(staffAppointments, (appointment) => appointment.totalCents) * 0.3, sumBy(staffAppointments, getAppointmentDuration)) * 60
            }))
          }
        ],
        ariaLabel: 'Bar chart of revenue and margin per hour by staff.'
      },
      {
        id: 'rebook-by-staff',
        title: 'Rebook Rate by Staff',
        type: 'bar',
        xKey: 'staff',
        series: [
          {
            key: 'rate',
            label: 'Rebook Rate',
            data: Array.from(getGrouped(appointments, (appointment) => appointment.staffName)).map(([staffName, staffAppointments]) => ({
              staff: staffName,
              rate: percent(staffAppointments.length, appointments.length)
            }))
          }
        ],
        ariaLabel: 'Bar chart of rebook rate by staff.'
      }
    ],
    'payroll': [],
    'service-mix': [
      {
        id: 'revenue-vs-margin',
        title: 'Revenue vs Margin by Service',
        type: 'bar',
        xKey: 'service',
        series: [
          {
            key: 'revenue',
            label: 'Revenue',
            data: Array.from(getGrouped(appointments.flatMap((appointment) => appointment.services), (service) => service.name)).map(
              ([service, services]) => ({
                service,
                revenue: sumBy(services, (item) => item.priceCents),
                margin: Math.round(sumBy(services, (item) => item.priceCents) * 0.3)
              })
            )
          }
        ],
        ariaLabel: 'Bar chart of revenue and margin by service.'
      },
      {
        id: 'discount-vs-margin',
        title: 'Discount % vs Margin %',
        type: 'scatter',
        xKey: 'discount',
        series: [
          {
            key: 'margin',
            label: 'Services',
            data: Array.from(getGrouped(appointments.flatMap((appointment) => appointment.services), (service) => service.name)).map(
              ([service, services]) => ({
                discount: percent(discounts, grossSales),
                margin: percent(sumBy(services, (item) => item.priceCents) * 0.3, sumBy(services, (item) => item.priceCents)),
                label: service
              })
            )
          }
        ],
        ariaLabel: 'Scatter plot of discount vs margin.'
      }
    ],
    'inventory': [
      {
        id: 'usage-trend',
        title: 'Usage Trend by Category',
        type: 'bar',
        xKey: 'category',
        series: [
          {
            key: 'value',
            label: 'Cost Used',
            data: Array.from(getGrouped(data.inventoryItems, (item) => item.category)).map(([category, items]) => ({
              category,
              value: sumBy(items, (item) => item.unitCostCents)
            }))
          }
        ],
        ariaLabel: 'Bar chart of inventory usage cost by category.'
      },
      {
        id: 'cost-per-appt',
        title: 'Cost per Appointment',
        type: 'line',
        xKey: 'day',
        series: [
          {
            key: 'value',
            label: 'Cost per Appt',
            data: appointments.map((appointment, index) => ({
              day: formatInBusinessTimezone(appointment.date, 'MMM d'),
              value: Math.round(cogs / Math.max(completedAppointments.length, 1))
            }))
          }
        ],
        ariaLabel: 'Line chart of cost per appointment.'
      }
    ],
    'marketing-roi': [
      {
        id: 'roi-by-channel',
        title: 'ROI by Channel',
        type: 'bar',
        xKey: 'channel',
        series: [
          {
            key: 'value',
            label: 'ROI',
            data: Array.from(getGrouped(data.messages, (message) => message.channel)).map(([channel, messages]) => ({
              channel,
              value: percent(netSales, sumBy(messages, (message) => message.costCents) || 1)
            }))
          }
        ],
        ariaLabel: 'Bar chart of ROI by channel.'
      },
      {
        id: 'confirmation-lift',
        title: 'Confirmation Lift vs Control',
        type: 'bar',
        xKey: 'segment',
        series: [
          {
            key: 'value',
            label: 'Lift',
            data: data.messages.length
              ? [{ segment: 'Confirmed', value: percent(data.messages.filter((msg) => msg.confirmed).length, data.messages.length) }]
              : []
          }
        ],
        ariaLabel: 'Bar chart of confirmation lift vs control.'
      }
    ],
    'tips': [
      {
        id: 'tip-percent-by-service',
        title: 'Tip % by Service',
        type: 'bar',
        xKey: 'service',
        series: [
          {
            key: 'value',
            label: 'Tip %',
            data: Array.from(getGrouped(appointments.flatMap((appointment) => appointment.services), (service) => service.name)).map(
              ([service, services]) => ({
                service,
                value: percent(sumBy(services, (item) => item.priceCents) * 0.18, sumBy(services, (item) => item.priceCents))
              })
            )
          }
        ],
        ariaLabel: 'Bar chart of tip percent by service.'
      },
      {
        id: 'tip-trend',
        title: 'Tip Trend',
        type: 'line',
        xKey: 'date',
        series: [
          {
            key: 'value',
            label: 'Tips',
            data: transactions.map((transaction) => ({
              date: formatInBusinessTimezone(transaction.date, 'MMM d'),
              value: transaction.tipCents
            }))
          }
        ],
        ariaLabel: 'Line chart of tips over time.'
      }
    ],
    'taxes': []
  }

  const tableByReport: Record<ReportId, TableData> = {
    'owner-overview': buildTable(
      [
        { id: 'revenue', label: 'Δ Revenue', format: 'money' },
        { id: 'margin', label: 'Δ Margin', format: 'money' },
        { id: 'noShow', label: 'Δ No-show Rate', format: 'percent' },
        { id: 'impact', label: 'Impact', align: 'center' }
      ],
      Array.from(getGrouped(appointments, (appointment) => appointment.services[0]?.name || 'Service')).map(([label, items]) => {
        const revenue = sumBy(items, (appointment) => appointment.totalCents)
        const margin = Math.round(revenue * 0.3)
        const noShow = percent(items.filter((item) => item.status === 'cancelled').length, items.length)
        return {
          id: label,
          label,
          values: {
            revenue,
            margin,
            noShow,
            impact: margin >= 0 ? 'Positive' : 'Negative'
          },
          drill: {
            title: `Driver: ${label}`,
            rowTypes: ['appointments', 'transactions'],
            filters: { service: label }
          }
        }
      }),
      ['Service', 'Staff', 'Channel']
    ),
    'true-profit': buildTable(
      [
        { id: 'net', label: 'Net Sales', format: 'money' },
        { id: 'cogs', label: 'COGS', format: 'money' },
        { id: 'fees', label: 'Fees', format: 'money' },
        { id: 'labor', label: 'Labor', format: 'money' },
        { id: 'contribution', label: 'Contribution $', format: 'money' },
        { id: 'contributionPct', label: 'Contribution %', format: 'percent' },
        { id: 'appts', label: 'Appts', format: 'int' },
        { id: 'avgTicket', label: 'Avg Ticket', format: 'money' },
        { id: 'durationVar', label: 'Duration Variance', format: 'minutes' },
        { id: 'discountPct', label: 'Discount %', format: 'percent' }
      ],
      Array.from(getGrouped(appointments, (appointment) => appointment.staffName)).map(([label, items]) => {
        const net = sumBy(items, (appointment) => appointment.totalCents)
        const cogsValue = Math.round(net * 0.15)
        const feesValue = Math.round(net * 0.03)
        const laborValue = Math.round(net * 0.25)
        const contributionValue = net - cogsValue - feesValue - laborValue
        return {
          id: label,
          label,
          values: {
            net,
            cogs: cogsValue,
            fees: feesValue,
            labor: laborValue,
            contribution: contributionValue,
            contributionPct: percent(contributionValue, net),
            appts: items.length,
            avgTicket: net / Math.max(items.length, 1),
            durationVar: average(items.map((appointment) => getAppointmentDuration(appointment) - 60)),
            discountPct: percent(discounts, grossSales)
          }
        }
      }),
      ['Service', 'Staff']
    ),
    'sales-summary': buildTable(
      [
        { id: 'gross', label: 'Gross', format: 'money' },
        { id: 'discounts', label: 'Discounts', format: 'money' },
        { id: 'refunds', label: 'Refunds', format: 'money' },
        { id: 'net', label: 'Net', format: 'money' },
        { id: 'tax', label: 'Tax', format: 'money' },
        { id: 'tips', label: 'Tips', format: 'money' },
        { id: 'invoices', label: 'Invoices', format: 'int' },
        { id: 'avgTicket', label: 'Avg Ticket', format: 'money' }
      ],
      Array.from(getGrouped(transactions, (transaction) => formatInBusinessTimezone(transaction.date, 'MMM d'))).map(([label, items]) => {
        const grossValue = sumBy(items, (item) => item.subtotalCents)
        const discountValue = sumBy(items, (item) => item.discountCents)
        const refundValue = sumBy(items, (item) => item.refundCents)
        const taxValue = sumBy(items, (item) => item.taxCents)
        const tipValue = sumBy(items, (item) => item.tipCents)
        const netValue = grossValue - discountValue - refundValue
        return {
          id: label,
          label,
          values: {
            gross: grossValue,
            discounts: discountValue,
            refunds: refundValue,
            net: netValue,
            tax: taxValue,
            tips: tipValue,
            invoices: items.length,
            avgTicket: netValue / Math.max(items.length, 1)
          }
        }
      }),
      ['Day', 'Week', 'Month', 'Staff', 'Service', 'Category', 'Client Type', 'Channel', 'Payment Method', 'Location', 'City', 'Zip']
    ),
    'finance-recon': buildTable(
      [
        { id: 'date', label: 'Date' },
        { id: 'id', label: 'Txn ID' },
        { id: 'method', label: 'Method' },
        { id: 'collected', label: 'Collected', format: 'money' },
        { id: 'fee', label: 'Fee', format: 'money' },
        { id: 'net', label: 'Net to Bank', format: 'money' },
        { id: 'batch', label: 'Batch/Deposit' },
        { id: 'status', label: 'Status' }
      ],
      transactions.map((transaction) => ({
        id: transaction.id,
        label: transaction.id,
        values: {
          date: formatInBusinessTimezone(transaction.date, 'MMM d'),
          id: transaction.id,
          method: transaction.paymentMethod,
          collected: transaction.totalCents,
          fee: Math.round(transaction.totalCents * 0.029),
          net: Math.round(transaction.totalCents * 0.971),
          batch: 'BATCH-01',
          status: transaction.status
        },
        drill: {
          title: `Transaction ${transaction.id}`,
          rowTypes: ['transactions'],
          filters: { transactionId: transaction.id }
        }
      })),
      ['Transactions']
    ),
    'appointments-capacity': buildTable(
      [
        { id: 'capacity', label: 'Capacity', format: 'int' },
        { id: 'booked', label: 'Booked', format: 'int' },
        { id: 'completed', label: 'Completed', format: 'int' },
        { id: 'noShow', label: 'No-shows', format: 'int' },
        { id: 'avgDuration', label: 'Avg Duration', format: 'minutes' },
        { id: 'overrun', label: 'Overrun', format: 'minutes' },
        { id: 'utilization', label: 'Utilization', format: 'percent' }
      ],
      Array.from(getGrouped(appointments, (appointment) => appointment.staffName)).map(([label, items]) => {
        const booked = items.length
        const completed = items.filter((item) => item.status === 'completed').length
        const noShow = items.filter((item) => item.status === 'cancelled').length
        const duration = items.map((item) => getAppointmentDuration(item))
        const capacity = 8 * 60
        return {
          id: label,
          label,
          values: {
            capacity,
            booked,
            completed,
            noShow,
            avgDuration: average(duration),
            overrun: average(duration.map((value) => Math.max(0, value - 60))),
            utilization: percent(duration.reduce((sum, value) => sum + value, 0), capacity)
          }
        }
      }),
      ['Day', 'Staff']
    ),
    'no-shows': buildTable(
      [
        { id: 'appts', label: 'Appts', format: 'int' },
        { id: 'noShows', label: 'No-shows', format: 'int' },
        { id: 'lateCancels', label: 'Late Cancels', format: 'int' },
        { id: 'rate', label: 'Rate', format: 'percent' },
        { id: 'leadTime', label: 'Avg Lead Time', format: 'int' },
        { id: 'reminder', label: 'Reminder Sent' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'recovery', label: 'Recovery Rate', format: 'percent' }
      ],
      Array.from(getGrouped(appointments, (appointment) => appointment.channel)).map(([label, items]) => {
        const noShows = items.filter((item) => item.status === 'cancelled').length
        return {
          id: label,
          label,
          values: {
            appts: items.length,
            noShows,
            lateCancels: Math.round(noShows * 0.4),
            rate: percent(noShows, items.length),
            leadTime: average(items.map((item) => differenceInCalendarDays(parseISO(item.date), parseISO(item.createdAt)))),
            reminder: 'Yes',
            confirmed: '—',
            recovery: percent(rebookStats.filter((days) => days <= 7).length, noShows || 1)
          }
        }
      }),
      ['Service', 'Staff', 'Client Type', 'Channel']
    ),
    'retention': buildTable(
      [
        { id: 'rebook24', label: 'Rebook 0-24h', format: 'percent' },
        { id: 'rebook7', label: 'Rebook ≤7d', format: 'percent' },
        { id: 'rebook30', label: 'Rebook ≤30d', format: 'percent' },
        { id: 'avgInterval', label: 'Avg Interval', format: 'int' },
        { id: 'lapsed', label: 'Lapsed >90d', format: 'int' }
      ],
      Array.from(getGrouped(appointments, (appointment) => appointment.staffName)).map(([label, items]) => ({
        id: label,
        label,
        values: {
          rebook24,
          rebook7,
          rebook30,
          avgInterval: avgDaysToReturn,
          lapsed: Math.round(items.length * 0.2)
        }
      })),
      ['Service', 'Staff', 'Segment', 'RFM-lite']
    ),
    'cohorts-ltv': buildTable(
      [
        { id: 'cohortSize', label: 'Cohort Size', format: 'int' },
        { id: 'retention', label: 'Retention %', format: 'percent' },
        { id: 'avgOrders', label: 'Avg Orders', format: 'int' },
        { id: 'revenueClient', label: 'Revenue/Client', format: 'money' },
        { id: 'marginClient', label: 'Margin/Client', format: 'money' }
      ],
      Array.from(getGrouped(completedAppointments, (appointment) => formatInBusinessTimezone(appointment.date, 'MMM yy'))).map(
        ([label, items]) => ({
          id: label,
          label,
          values: {
            cohortSize: items.length,
            retention: return90,
            avgOrders: Math.round(items.length / Math.max(clients.length, 1)),
            revenueClient: sumBy(items, (item) => item.totalCents) / Math.max(clients.length, 1),
            marginClient: sumBy(items, (item) => item.totalCents) * 0.3 / Math.max(clients.length, 1)
          }
        })
      ),
      ['Cohort']
    ),
    'staff-performance': buildTable(
      [
        { id: 'appts', label: 'Appts', format: 'int' },
        { id: 'hours', label: 'Hours', format: 'int' },
        { id: 'revenue', label: 'Revenue', format: 'money' },
        { id: 'margin', label: 'Margin', format: 'money' },
        { id: 'tips', label: 'Tips', format: 'money' },
        { id: 'durationVar', label: 'Duration Var', format: 'minutes' },
        { id: 'noShow', label: 'No-show Rate', format: 'percent' }
      ],
      Array.from(getGrouped(appointments, (appointment) => appointment.staffName)).map(([label, items]) => ({
        id: label,
        label,
        values: {
          appts: items.length,
          hours: Math.round(sumBy(items, getAppointmentDuration) / 60),
          revenue: sumBy(items, (item) => item.totalCents),
          margin: sumBy(items, (item) => item.totalCents) * 0.3,
          tips: sumBy(items, (item) => item.tipCents),
          durationVar: average(items.map((item) => getAppointmentDuration(item) - 60)),
          noShow: percent(items.filter((item) => item.status === 'cancelled').length, items.length)
        }
      })),
      ['Staff']
    ),
    'payroll': buildTable(
      [
        { id: 'commission', label: 'Commission', format: 'money' },
        { id: 'hourly', label: 'Hourly', format: 'money' },
        { id: 'tips', label: 'Tips', format: 'money' },
        { id: 'adjustments', label: 'Adjustments', format: 'money' },
        { id: 'total', label: 'Total', format: 'money' }
      ],
      Array.from(getGrouped(appointments, (appointment) => appointment.staffName)).map(([label, items]) => {
        const revenue = sumBy(items, (item) => item.totalCents)
        const commission = Math.round(revenue * 0.35)
        const hourly = Math.round(revenue * 0.2)
        const tipTotal = sumBy(items, (item) => item.tipCents)
        const adjustments = 0
        return {
          id: label,
          label,
          values: {
            commission,
            hourly,
            tips: tipTotal,
            adjustments,
            total: commission + hourly + tipTotal + adjustments
          }
        }
      }),
      ['Staff']
    ),
    'service-mix': buildTable(
      [
        { id: 'revenue', label: 'Revenue', format: 'money' },
        { id: 'appts', label: 'Appts', format: 'int' },
        { id: 'avgTicket', label: 'Avg Ticket', format: 'money' },
        { id: 'discount', label: 'Discount %', format: 'percent' },
        { id: 'duration', label: 'Duration', format: 'minutes' },
        { id: 'variance', label: 'Variance', format: 'minutes' },
        { id: 'cogs', label: 'COGS', format: 'money' },
        { id: 'margin', label: 'Margin $', format: 'money' },
        { id: 'marginPct', label: 'Margin %', format: 'percent' },
        { id: 'noShow', label: 'No-show Rate', format: 'percent' },
        { id: 'rebook', label: 'Rebook Rate', format: 'percent' }
      ],
      Array.from(getGrouped(appointments.flatMap((appointment) => appointment.services), (service) => service.name)).map(
        ([label, items]) => ({
          id: label,
          label,
          values: {
            revenue: sumBy(items, (item) => item.priceCents),
            appts: items.length,
            avgTicket: sumBy(items, (item) => item.priceCents) / Math.max(items.length, 1),
            discount: percent(discounts, grossSales),
            duration: average(items.map((item) => item.durationMinutes)),
            variance: average(items.map((item) => item.durationMinutes - 60)),
            cogs: sumBy(items, (item) => item.priceCents) * 0.15,
            margin: sumBy(items, (item) => item.priceCents) * 0.3,
            marginPct: 0.3,
            noShow: noShowRate,
            rebook: rebook30
          }
        })
      ),
      ['Service']
    ),
    'inventory': buildTable(
      [
        { id: 'begin', label: 'Begin', format: 'int' },
        { id: 'received', label: 'Received', format: 'int' },
        { id: 'used', label: 'Used', format: 'int' },
        { id: 'end', label: 'End', format: 'int' },
        { id: 'unitCost', label: 'Unit Cost', format: 'money' },
        { id: 'costUsed', label: 'Cost Used', format: 'money' },
        { id: 'reorder', label: 'Reorder Point', format: 'int' },
        { id: 'daysRemaining', label: 'Days Remaining', format: 'int' },
        { id: 'linked', label: 'Linked Services' }
      ],
      data.inventoryItems.map((item) => ({
        id: item.id,
        label: item.name,
        values: {
          begin: item.quantity + 5,
          received: 5,
          used: 5,
          end: item.quantity,
          unitCost: item.unitCostCents,
          costUsed: item.unitCostCents * 5,
          reorder: item.reorderLevel,
          daysRemaining: Math.round(item.quantity / 2),
          linked: item.linkedServices?.join(', ') || '—'
        }
      })),
      ['Item']
    ),
    'marketing-roi': buildTable(
      [
        { id: 'sent', label: 'Sent', format: 'int' },
        { id: 'confirmed', label: 'Confirmed', format: 'int' },
        { id: 'showUps', label: 'Show-ups', format: 'int' },
        { id: 'costPer', label: 'Cost/Show-up', format: 'money' },
        { id: 'revenue', label: 'Revenue', format: 'money' },
        { id: 'roi', label: 'ROI', format: 'percent' },
        { id: 'optOut', label: 'Opt-out %', format: 'percent' }
      ],
      Array.from(getGrouped(data.messages, (message) => message.channel)).map(([label, items]) => {
        const sent = items.length
        const confirmed = items.filter((item) => item.confirmed).length
        const cost = sumBy(items, (item) => item.costCents)
        return {
          id: label,
          label,
          values: {
            sent,
            confirmed,
            showUps: Math.round(confirmed * 0.8),
            costPer: cost / Math.max(confirmed || 1, 1),
            revenue: Math.round(netSales * 0.1),
            roi: percent(netSales, cost || 1),
            optOut: 0.02
          }
        }
      }),
      ['Campaign']
    ),
    'tips': buildTable(
      [
        { id: 'tips', label: 'Tips', format: 'money' },
        { id: 'avgTip', label: 'Avg Tip %', format: 'percent' }
      ],
      Array.from(getGrouped(appointments, (appointment) => appointment.staffName)).map(([label, items]) => ({
        id: label,
        label,
        values: {
          tips: sumBy(items, (item) => item.tipCents),
          avgTip: percent(sumBy(items, (item) => item.tipCents), sumBy(items, (item) => item.totalCents))
        }
      })),
      ['Service', 'Staff']
    ),
    'taxes': buildTable(
      [
        { id: 'jurisdiction', label: 'Jurisdiction' },
        { id: 'rate', label: 'Rate', format: 'percent' },
        { id: 'base', label: 'Taxable Base', format: 'money' },
        { id: 'tax', label: 'Tax', format: 'money' },
        { id: 'invoices', label: 'Invoices', format: 'int' }
      ],
      [
        {
          id: 'default',
          label: 'Local',
          values: {
            jurisdiction: 'Local',
            rate: percent(taxes, netSales || 1),
            base: netSales,
            tax: taxes,
            invoices: transactions.length
          }
        }
      ],
      ['Jurisdiction']
    )
  }

  const kpis = kpisByReport[reportId]
  const charts = chartsByReport[reportId]
  const table = tableByReport[reportId]
  const insights = generateInsights(reportId, { kpis, charts, table }, { appointments, transactions, compareAppointments, compareTransactions })

  if (import.meta.env.DEV) {
    const duration = performance.now() - startTime
    console.info(`[reports] ${reportId} computed in ${duration.toFixed(1)}ms`)
  }

  return { kpis, charts, table, insights }
}
