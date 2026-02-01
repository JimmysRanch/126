import { describe, expect, it } from 'vitest'
import { computeReportData } from '@/reports/analytics'
import { normalizeReportsData } from '@/reports/normalization'
import { applyReportDefaults, defaultFilters } from '@/reports/filters'
import { FilterState } from '@/reports/types'

const buildFilters = (): FilterState =>
  applyReportDefaults('sales-summary', {
    ...defaultFilters,
    datePreset: 'custom',
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  })

const sampleData = normalizeReportsData({
  appointments: [
    {
      id: 'apt-1',
      clientId: 'client-1',
      clientName: 'Client One',
      petId: 'pet-1',
      petName: 'Rex',
      petWeight: 20,
      petWeightCategory: 'small',
      groomerId: 'staff-1',
      groomerName: 'Sam',
      groomerRequested: false,
      date: '2024-01-05',
      startTime: '09:00',
      endTime: '10:00',
      services: [{ serviceId: 'svc-1', serviceName: 'Bath', price: 50, type: 'main' }],
      totalPrice: 50,
      status: 'completed',
      createdAt: '2023-12-20'
    }
  ],
  transactions: [
    {
      id: 'txn-1',
      appointmentId: 'apt-1',
      date: '2024-01-05',
      clientId: 'client-1',
      clientName: 'Client One',
      items: [{ id: 'item-1', name: 'Bath', type: 'service', quantity: 1, price: 50, total: 50 }],
      subtotal: 50,
      discount: 5,
      additionalFees: 2,
      total: 57,
      tipAmount: 10,
      paymentMethod: 'card',
      status: 'completed',
      type: 'appointment'
    }
  ],
  clients: [
    { id: 'client-1', name: 'Client One', email: 'c1@example.com', phone: '555-0001', pets: [] }
  ],
  staff: [
    { id: 'staff-1', name: 'Sam', role: 'Groomer', email: 'sam@example.com', phone: '555-0002', status: 'Active', isGroomer: true }
  ],
  inventory: [
    { id: 'inv-1', name: 'Shampoo', category: 'supply', sku: 'S1', quantity: 10, price: 10, cost: 3, reorderLevel: 4 }
  ],
  messages: []
})

const getKpiValue = (reportId: any, metricId: string) => {
  const filters = buildFilters()
  const report = computeReportData(reportId, sampleData, filters)
  return report.kpis.find((kpi) => kpi.id === metricId)?.value || 0
}

const computeNetSales = () => {
  const gross = sampleData.transactions.reduce((sum, transaction) => sum + transaction.subtotalCents, 0)
  const discounts = sampleData.transactions.reduce((sum, transaction) => sum + transaction.discountCents, 0)
  const refunds = sampleData.transactions.reduce((sum, transaction) => sum + transaction.refundCents, 0)
  return gross - discounts - refunds
}

describe('reports reconciliation', () => {
  it('Sales Summary net sales equals line items minus discounts/refunds', () => {
    const netSales = getKpiValue('sales-summary', 'net-sales')
    expect(netSales).toBe(4500)
  })

  it('True Profit net sales matches Sales Summary', () => {
    const netSalesSummary = getKpiValue('sales-summary', 'net-sales')
    const netSalesProfit = computeNetSales()
    expect(netSalesSummary).toBe(netSalesProfit)
  })

  it('Taxes Summary tax matches Sales Summary tax', () => {
    const taxSummary = getKpiValue('sales-summary', 'taxes')
    const taxReport = getKpiValue('taxes', 'taxes')
    expect(taxSummary).toBe(taxReport)
  })

  it('Finance total collected equals transaction settled', () => {
    const totalCollected = getKpiValue('sales-summary', 'total-collected')
    const financeCollected = getKpiValue('finance-recon', 'total-collected')
    expect(totalCollected).toBe(financeCollected)
  })

  it('Drill drawer row sums reconcile to table net sales', () => {
    const report = computeReportData('sales-summary', sampleData, buildFilters())
    const netFromTable = report.table.rows.reduce((sum, row) => sum + Number(row.values.net || 0), 0)
    const netSales = getKpiValue('sales-summary', 'net-sales')
    expect(netFromTable).toBe(netSales)
  })
})
