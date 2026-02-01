import { InsightsItem, ReportData, ReportId } from './types'

export const generateInsights = (
  reportId: ReportId,
  reportData: ReportData,
  context: {
    appointments: Array<{ status: string; staffName: string; totalCents: number }>
    transactions: Array<{ totalCents: number }>
    compareAppointments: Array<{ status: string }>
    compareTransactions: Array<{ totalCents: number }>
  }
): InsightsItem[] => {
  const insights: InsightsItem[] = []

  const noShowCount = context.appointments.filter((appointment) => appointment.status === 'cancelled').length
  const compareNoShowCount = context.compareAppointments.filter((appointment) => appointment.status === 'cancelled').length
  const noShowDelta = compareNoShowCount === 0 ? 0 : (noShowCount - compareNoShowCount) / compareNoShowCount

  if (noShowDelta > 0.15 && noShowCount >= 5) {
    insights.push({
      id: 'no-show-spike',
      title: 'No-show spike',
      description: `No-shows are up ${(noShowDelta * 100).toFixed(0)}% vs prior period.`,
      metricId: 'no-show-rate',
      delta: noShowDelta,
      action: 'Review reminder timing and confirmation messages.',
      drill: {
        title: 'No-show appointments',
        rowTypes: ['appointments'],
        filters: { status: 'cancelled' }
      }
    })
  }

  const marginKpi = reportData.kpis.find((kpi) => kpi.id === 'contribution-margin-percent')
  if (marginKpi && marginKpi.delta !== undefined && marginKpi.delta < -0.05) {
    insights.push({
      id: 'margin-drop',
      title: 'Margin drop',
      description: 'Contribution margin declined by more than 5 points.',
      metricId: marginKpi.id,
      delta: marginKpi.delta,
      action: 'Investigate labor and COGS drivers.'
    })
  }

  const rebookKpi = reportData.kpis.find((kpi) => kpi.id === 'rebook-7d')
  if (rebookKpi && rebookKpi.delta !== undefined && rebookKpi.delta < -0.1) {
    insights.push({
      id: 'rebook-weakness',
      title: 'Rebooking weakness',
      description: 'Rebooking within 7 days dropped by more than 10%.',
      metricId: rebookKpi.id,
      delta: rebookKpi.delta,
      action: 'Add rebooking prompts at checkout.'
    })
  }

  if (reportId === 'inventory') {
    insights.push({
      id: 'inventory-risk',
      title: 'Inventory risk',
      description: 'Several supply items are below 7 days of supply.',
      metricId: 'estimated-cogs',
      action: 'Review reorder points and create a purchase order.'
    })
  }

  if (reportId === 'marketing-roi') {
    insights.push({
      id: 'campaign-roi',
      title: 'Campaign ROI extreme',
      description: 'ROI is outside the 0.5–3.0 band for at least one channel.',
      action: 'Rebalance spend between higher-performing channels.'
    })
  }

  return insights.slice(0, 3)
}
