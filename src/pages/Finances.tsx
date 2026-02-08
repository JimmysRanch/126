import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { SquaresFour, Circle, CreditCard, Users, Receipt, TrendUp, PawPrint, CaretRight, Wallet } from '@phosphor-icons/react'
import { FinancialChart } from '@/components/FinancialChart'
import { useIsMobile } from '@/hooks/use-mobile'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { PayrollOverview } from '@/components/PayrollOverview'
import { useKV } from "@github/spark/hooks"
import { ExpenseRecord, PaymentDetail } from "@/lib/finance-types"
import { formatDateForDisplay } from "@/lib/date-utils"
import FinancesStripe from "@/pages/finances/FinancesStripe"

export function Finances() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('dashboard')
  const isMobile = useIsMobile()
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetail | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [payments] = useKV<PaymentDetail[]>("payments", [])
  const [expenses] = useKV<ExpenseRecord[]>("expenses", [])

  const parseDate = (date: string) => new Date(date + "T00:00:00")
  const monthKey = (date: Date) => date.toLocaleString("en-US", { month: "short" }).toUpperCase()
  const totals = payments.reduce(
    (acc, payment) => {
      const date = parseDate(payment.date)
      if (date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
        acc.monthPayments += payment.amount + payment.tip
      }
      acc.totalPayments += payment.amount + payment.tip
      return acc
    },
    { monthPayments: 0, totalPayments: 0 }
  )
  const expenseTotals = expenses.reduce(
    (acc, expense) => {
      const date = parseDate(expense.date)
      if (date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
        acc.monthExpenses += expense.amount
      }
      acc.totalExpenses += expense.amount
      if (expense.status === "Pending") {
        acc.pending += expense.amount
      }
      return acc
    },
    { monthExpenses: 0, totalExpenses: 0, pending: 0 }
  )

  const monthlyData = (() => {
    const map = new Map<string, { revenue: number; expenses: number }>()
    payments.forEach((payment) => {
      const date = parseDate(payment.date)
      const key = monthKey(date)
      const entry = map.get(key) || { revenue: 0, expenses: 0 }
      entry.revenue += payment.amount + payment.tip
      map.set(key, entry)
    })
    expenses.forEach((expense) => {
      const date = parseDate(expense.date)
      const key = monthKey(date)
      const entry = map.get(key) || { revenue: 0, expenses: 0 }
      entry.expenses += expense.amount
      map.set(key, entry)
    })
    return Array.from(map.entries()).map(([month, values]) => ({
      month: `${month} ${new Date().getFullYear()}`,
      shortMonth: month,
      revenue: values.revenue,
      expenses: values.expenses,
      profit: values.revenue - values.expenses
    }))
  })()
  const monthlyExpenses = monthlyData.map((entry) => ({ month: entry.shortMonth, amount: entry.expenses }))
  const averageMonthlyExpense = monthlyExpenses.length > 0
    ? Math.round(monthlyExpenses.reduce((sum, entry) => sum + entry.amount, 0) / monthlyExpenses.length)
    : 0
  const expenseBreakdown = (() => {
    const totals = new Map<string, number>()
    expenses.forEach((expense) => totals.set(expense.category, (totals.get(expense.category) || 0) + expense.amount))
    const total = Array.from(totals.values()).reduce((sum, value) => sum + value, 0) || 1
    const palette = [
      'oklch(0.70 0.25 200)',
      'oklch(0.75 0.25 330)',
      'oklch(0.72 0.24 85)',
      'oklch(0.68 0.22 280)',
      'oklch(0.76 0.23 25)'
    ]
    return Array.from(totals.entries()).map(([category, amount], index) => ({
      category,
      amount,
      percentage: Math.round((amount / total) * 100),
      color: palette[index % palette.length]
    }))
  })()
  const recentExpenses = [...expenses].slice(-5).reverse()
  const pendingBills = expenses.filter((expense) => expense.status === "Pending")

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background text-foreground p-3 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          <ScrollArea className="w-full">
            <TabsList className="bg-card border border-border h-10 md:h-12 w-full inline-flex">
              <TabsTrigger value="dashboard" className="gap-1 md:gap-2 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <SquaresFour size={isMobile ? 16 : 18} />
                {!isMobile && 'Dashboard'}
              </TabsTrigger>
              <TabsTrigger value="expenses" className="gap-1 md:gap-2 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Circle size={isMobile ? 16 : 18} />
                {!isMobile && 'Expenses'}
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-1 md:gap-2 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <CreditCard size={isMobile ? 16 : 18} />
                {!isMobile && 'Payments'}
              </TabsTrigger>
              <TabsTrigger value="payroll" className="gap-1 md:gap-2 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users size={isMobile ? 16 : 18} />
                {!isMobile && 'Payroll'}
              </TabsTrigger>
              <TabsTrigger value="taxes" className="gap-1 md:gap-2 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Receipt size={isMobile ? 16 : 18} />
                {!isMobile && 'Taxes'}
              </TabsTrigger>
              <TabsTrigger value="stripe" className="gap-1 md:gap-2 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Wallet size={isMobile ? 16 : 18} />
                {!isMobile && 'Stripe'}
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="dashboard" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">BILLS</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$0</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-[10px] h-6 px-2 shrink-0">REVIEW</Button>
                </div>
              </Card>

              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">PAYMENTS</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">${totals.totalPayments.toLocaleString()}</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-[10px] h-6 px-2 shrink-0">LEDGER</Button>
                </div>
              </Card>

              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">SALES TAX</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$0</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-[10px] h-6 px-2 shrink-0">TAXES</Button>
                </div>
              </Card>

              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">PAYROLL</p>
                    <p className="text-sm md:text-base font-bold mt-0.5">Not scheduled</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-[10px] h-6 px-2 shrink-0">OPEN</Button>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <Card className="p-4 md:p-6 border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground font-medium mb-1">
                      MONEY IN (THIS MONTH)
                    </p>
                    <p className="text-3xl md:text-4xl font-bold mt-2 truncate">
                      ${totals.monthPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendUp size={14} className="text-muted-foreground flex-shrink-0" weight="bold" />
                      <p className="text-xs text-muted-foreground font-medium truncate">No prior data</p>
                    </div>
                  </div>
                  <TrendUp size={isMobile ? 18 : 20} className="text-green-500 flex-shrink-0 ml-2" weight="bold" />
                </div>
              </Card>

              <Card className="p-4 md:p-6 border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground font-medium mb-1">
                      MONEY OUT (THIS MONTH)
                    </p>
                    <p className="text-3xl md:text-4xl font-bold mt-2 truncate">
                      ${expenseTotals.monthExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendUp size={14} className="text-muted-foreground flex-shrink-0" weight="bold" />
                      <p className="text-xs text-muted-foreground font-medium truncate">No prior data</p>
                    </div>
                  </div>
                  <TrendUp size={isMobile ? 18 : 20} className="text-green-500 flex-shrink-0 ml-2" weight="bold" />
                </div>
              </Card>

              <Card className="p-4 md:p-6 border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground font-medium mb-1">
                      WHAT'S LEFT (THIS MONTH)
                    </p>
                    <p className="text-3xl md:text-4xl font-bold mt-2 truncate">
                      ${(totals.monthPayments - expenseTotals.monthExpenses).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendUp size={14} className="text-muted-foreground flex-shrink-0" weight="bold" />
                      <p className="text-xs text-muted-foreground font-medium truncate">No prior data</p>
                    </div>
                  </div>
                  <TrendUp size={isMobile ? 18 : 20} className="text-green-500 flex-shrink-0 ml-2" weight="bold" />
                </div>
              </Card>
            </div>

            <Card className="p-4 md:p-6 border-border">
              <div className="mb-4">
                <h3 className="text-base md:text-lg font-bold">Monthly Overview</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Revenue, expenses, and profit trends for the last six months.</p>
              </div>
              <FinancialChart data={monthlyData} />
              {isMobile && (
                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.65 0.22 220)' }}></div>
                    <span className="text-xs font-medium">REVENUE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.60 0.20 25)' }}></div>
                    <span className="text-xs font-medium">EXPENSES</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.70 0.20 140)' }}></div>
                    <span className="text-xs font-medium">PROFIT</span>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">MTD EXPENSES</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">${expenseTotals.monthExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">YTD EXPENSES</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">${expenseTotals.totalExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">PENDING</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">${expenseTotals.pending.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">AVG MONTHLY</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">${averageMonthlyExpense.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-2 max-h-[calc(100vh-280px)]">
              <Card className="lg:col-span-4 border-border flex flex-col">
                <div className="p-2.5 border-b border-border flex-shrink-0">
                  <h3 className="text-sm font-bold">Expense Trend</h3>
                  <p className="text-xs text-muted-foreground">Last 6 Months</p>
                </div>
                <div className="p-2.5 flex-1 min-h-0">
                  <div className="relative h-full min-h-[160px]">
                    <div className="absolute inset-0 flex items-end justify-between gap-2 pb-8 pr-16">
                      {monthlyExpenses.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                          No expense history yet
                        </div>
                      ) : (
                        <>
                          {/* Placeholder bars for months before real data to avoid single wide bar */}
                          {monthlyExpenses.length < 6 && Array.from({ length: Math.min(3, 6 - monthlyExpenses.length) }).map((_, i) => (
                            <div key={`placeholder-${i}`} className="flex-1 flex flex-col items-center gap-2 opacity-30">
                              <div className="relative w-full" style={{ height: '25%', minHeight: '20px' }}>
                                <div 
                                  className="absolute bottom-0 w-full rounded-t-lg"
                                  style={{ 
                                    height: '100%',
                                    backgroundColor: 'oklch(0.70 0.20 195 / 0.3)',
                                    border: '1px dashed oklch(0.70 0.20 195 / 0.5)'
                                  }}
                                />
                              </div>
                              <span className="text-xs font-medium text-muted-foreground/50">--</span>
                            </div>
                          ))}
                          {monthlyExpenses.map((data, i) => {
                            const maxExpense = Math.max(...monthlyExpenses.map(m => m.amount))
                            const height = maxExpense > 0 ? (data.amount / maxExpense) * 100 : 0
                            return (
                              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="relative w-full" style={{ height: `${height}%`, minHeight: '20px' }}>
                                  <div 
                                    className="absolute bottom-0 w-full rounded-t-lg transition-all hover:brightness-110 cursor-pointer"
                                    style={{ 
                                      height: '100%',
                                      backgroundColor: 'oklch(0.70 0.20 195)',
                                      boxShadow: '0 0 15px oklch(0.70 0.20 195 / 0.3)',
                                      maxWidth: monthlyExpenses.length === 1 ? '80px' : undefined,
                                      marginLeft: monthlyExpenses.length === 1 ? 'auto' : undefined,
                                      marginRight: monthlyExpenses.length === 1 ? 'auto' : undefined
                                    }}
                                  />
                                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-bold text-foreground whitespace-nowrap">${data.amount}</span>
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">{data.month}</span>
                              </div>
                            )
                          })}
                        </>
                      )}
                    </div>
                    
                    <div className="absolute inset-x-0 flex items-center pointer-events-none" style={{ bottom: '45%', right: '0' }}>
                      <div className="w-full border-t-2 border-dashed border-primary opacity-60" />
                      <div className="absolute -right-2 translate-x-full flex items-center gap-2 bg-background pl-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs font-medium text-primary whitespace-nowrap">Avg</span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-start gap-4 pt-2 border-t border-border mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-3 rounded" style={{ backgroundColor: 'oklch(0.70 0.20 195)' }} />
                        <span className="text-xs font-medium">Expenses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs font-medium">Average</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-3 border-border flex flex-col">
                <div className="p-2.5 border-b border-border flex items-center justify-between flex-shrink-0">
                  <div>
                    <h3 className="text-sm font-bold">Upcoming Bills</h3>
                    <p className="text-xs text-muted-foreground">Next 30 Days</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-xs h-7 px-2 hover:bg-primary/10 hover:text-primary transition-all"
                    onClick={() => navigate('/finances/upcoming-bills')}
                  >
                    View All
                    <CaretRight size={12} weight="bold" />
                  </Button>
                </div>
                <div className="p-2.5 flex-1 min-h-0 overflow-auto">
                  <div className="space-y-1">
                    <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground px-2 pb-2">
                      <span>Vendor</span>
                      <span className="text-center">Due In</span>
                      <span className="text-right">Amount</span>
                      <span className="text-right">Status</span>
                    </div>
                    {pendingBills.length === 0 ? (
                      <div className="text-sm text-muted-foreground px-2 py-3">No upcoming bills yet.</div>
                    ) : (
                      pendingBills.map((bill) => {
                        const dueDate = new Date(bill.date + "T00:00:00")
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        const diffTime = dueDate.getTime() - today.getTime()
                        const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                        const isOverdue = daysUntilDue < 0
                        const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0
                        const dueInText = isOverdue 
                          ? `${Math.abs(daysUntilDue)} days ago` 
                          : daysUntilDue === 0 
                            ? 'Today' 
                            : daysUntilDue === 1 
                              ? '1 day' 
                              : `${daysUntilDue} days`
                        return (
                          <div key={bill.id} className="grid grid-cols-4 gap-2 p-2 hover:bg-muted/50 transition-colors cursor-pointer rounded">
                            <span className="text-sm font-medium truncate">{bill.vendor}</span>
                            <span className="text-sm text-center flex items-center justify-center gap-1">
                              {dueInText}
                              {(isOverdue || isDueSoon) && <Circle size={8} className={isOverdue ? "text-red-500" : "text-yellow-500"} weight="fill" />}
                            </span>
                            <span className="text-sm font-bold text-right">${bill.amount.toFixed(2)}</span>
                            <span className={`text-xs px-2 py-1 rounded-full w-fit font-medium ml-auto ${
                              bill.status === 'Paid' 
                                ? 'bg-green-500/30 text-green-400' 
                                : 'bg-yellow-500/30 text-yellow-300'
                            }`}>
                              {bill.status}
                            </span>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-3 border-border/60 flex flex-col bg-card/80 backdrop-blur-sm overflow-hidden">
                <div className="p-2.5 border-b border-border/50 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h3 className="text-sm font-bold">Expense Breakdown</h3>
                    <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="p-3 flex flex-col lg:flex-row items-center gap-3 flex-1 min-h-0">
                  <div className="relative flex-shrink-0" style={{ width: '200px', height: '200px' }}>
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                      {(() => {
                        const radius = 65
                        const circumference = 2 * Math.PI * radius
                        let currentOffset = 0
                        return expenseBreakdown.map((item, i) => {
                          const offset = currentOffset
                          const dashArray = (item.percentage / 100) * circumference
                          currentOffset += dashArray
                          return (
                            <circle
                              key={i}
                              cx="100"
                              cy="100"
                              r={radius}
                              fill="none"
                              stroke={item.color}
                              strokeWidth="35"
                              strokeDasharray={`${dashArray} ${circumference}`}
                              strokeDashoffset={-offset}
                              className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                            />
                          )
                        })
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold tabular-nums">
                        ${(expenseBreakdown.reduce((sum, item) => sum + item.amount, 0) / 1000).toFixed(1).replace(/\.0$/, '')}k
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full space-y-0.5">
                    {expenseBreakdown.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No expenses yet.</div>
                    ) : (
                      expenseBreakdown.map((item, i) => (
                        <div key={i} className="flex items-center hover:bg-muted/40 p-1 rounded-md transition-all cursor-pointer group">
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <div 
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" 
                              style={{ 
                                backgroundColor: item.color,
                                boxShadow: `0 0 8px ${item.color}`
                              }} 
                            />
                            <span className="text-xs font-semibold">{item.category}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                            <span className="text-sm font-bold tabular-nums">${(item.amount / 1000).toFixed(1).replace(/\.0$/, '')}k</span>
                            <span className="text-xs text-muted-foreground w-7 text-right font-semibold">{item.percentage}%</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-4 border-border flex flex-col">
                <div className="p-2.5 border-b border-border flex items-center justify-between flex-shrink-0">
                  <h3 className="text-sm font-bold">Recent Expenses</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      className="gap-1 text-xs h-7 px-2"
                      onClick={() => navigate('/finances/add-expense')}
                    >
                      Add Expense
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => navigate('/finances/all-expenses')}
                    >
                      View All
                    </Button>
                  </div>
                </div>
                <div className="p-2.5 flex-1 min-h-0 overflow-auto">
                  <div className="space-y-1">
                    <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground px-2 pb-2">
                      <span>Category</span>
                      <span>Vendor</span>
                      <span>Date</span>
                      <span>Status</span>
                      <span className="text-right">Amount</span>
                    </div>
                    {recentExpenses.length === 0 ? (
                      <div className="text-sm text-muted-foreground px-2 py-3">No expenses recorded yet.</div>
                    ) : (
                      recentExpenses.map((expense) => (
                        <div key={expense.id} className="grid grid-cols-5 gap-2 p-2 hover:bg-muted/50 transition-colors cursor-pointer rounded">
                        <span className="text-sm truncate">{expense.category}</span>
                        <span className="text-sm truncate">{expense.vendor}</span>
                        <span className="text-sm">{formatDateForDisplay(expense.date)}</span>
                        <span className={`text-xs px-2 py-1 rounded-full w-fit font-medium ${
                          expense.status === 'Paid' 
                            ? 'bg-green-500/30 text-green-400' 
                            : 'bg-yellow-500/30 text-yellow-300'
                        }`}>
                          {expense.status}
                        </span>
                        <span className="text-sm font-semibold text-right">${expense.amount.toFixed(2)}</span>
                      </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">MTD REVENUE</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">${totals.monthPayments.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">YTD REVENUE</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">${totals.totalPayments.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">NEXT PAYOUT</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$0.00</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">AVG TRANSACTION</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">
                      ${payments.length > 0 ? (totals.totalPayments / payments.length).toFixed(2) : "0.00"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="border-border">
              <div className="p-3 md:p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm md:text-base font-bold">Recent Payments</h3>
                <Button className="gap-2" onClick={() => navigate('/finances/record-payment')}>
                  <CreditCard size={18} />
                  Record Payment
                </Button>
              </div>
              <div className="divide-y divide-border">
                {payments.length === 0 && (
                  <div className="p-4 text-sm text-muted-foreground">No payments recorded yet.</div>
                )}
                {payments.map((payment) => {
                  const serviceParts = payment.service.split(' - ')
                  const serviceType = serviceParts[0]
                  const dogNames = serviceParts[1] || ''
                  const individualDogs = dogNames.split(' & ').map(name => name.trim())
                  
                  return (
                    <div
                      key={payment.id}
                      className="p-3 md:p-4 hover:bg-muted/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedPayment(payment)
                        setPaymentDialogOpen(true)
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          setSelectedPayment(payment)
                          setPaymentDialogOpen(true)
                        }
                      }}
                    >
                      <div className="flex items-start md:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                            <p className="font-medium text-sm md:text-base truncate">{payment.client}</p>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground w-fit">
                              {payment.method}
                            </span>
                          </div>
                          <div className="text-xs md:text-sm text-muted-foreground mt-1 flex items-center gap-1 flex-wrap">
                            <span>{serviceType} -</span>
                            {individualDogs.map((dog, dogIndex) => (
                              <span key={dogIndex} className="inline-flex items-center gap-1">
                                <PawPrint size={14} weight="fill" className="text-primary flex-shrink-0" />
                                <span>{dog}</span>
                                {dogIndex < individualDogs.length - 1 && <span className="ml-1">&</span>}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">{payment.date}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-base md:text-lg font-bold">${(payment.amount + payment.tip).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">+${payment.tip.toFixed(2)} tip</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-3">
            <PayrollOverview />
          </TabsContent>

          <TabsContent value="taxes" className="space-y-3">
            <Card className="p-6 border-border">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">Tax Management</h3>
                <p className="text-muted-foreground mb-4">Tax filing features coming soon</p>
                <Button onClick={() => navigate('/finances/file-taxes')}>
                  <Receipt size={18} className="mr-2" />
                  File Taxes
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="stripe" className="space-y-3">
            <FinancesStripe />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={paymentDialogOpen}
        onOpenChange={(open) => {
          setPaymentDialogOpen(open)
          if (!open) {
            setSelectedPayment(null)
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{selectedPayment.client}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPayment.service}</p>
                </div>
                <Badge variant="secondary" className="text-xs uppercase tracking-wider">
                  {selectedPayment.method}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedPayment.date}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
                  <p className="font-semibold">${(selectedPayment.amount + selectedPayment.tip).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Service Amount</p>
                  <p className="font-medium">${selectedPayment.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Tip</p>
                  <p className="font-medium">${selectedPayment.tip.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
