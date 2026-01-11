import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SquaresFour, Circle, CreditCard, Users, Receipt, TrendUp, TrendDown } from '@phosphor-icons/react'
import { FinancialChart } from '@/components/FinancialChart'
import { useIsMobile } from '@/hooks/use-mobile'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export function Finances() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('dashboard')
  const isMobile = useIsMobile()

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
                    <p className="text-lg md:text-xl font-bold mt-0.5">$2,195</p>
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
                    <p className="text-3xl md:text-4xl font-bold mt-2 truncate">$2,194.89</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendUp size={14} className="text-green-500 flex-shrink-0" weight="bold" />
                      <p className="text-xs text-green-500 font-medium truncate">+100.0% vs previous month</p>
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
                    <p className="text-3xl md:text-4xl font-bold mt-2 truncate">$400.00</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendUp size={14} className="text-green-500 flex-shrink-0" weight="bold" />
                      <p className="text-xs text-green-500 font-medium truncate">+100.0% vs previous month</p>
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
                    <p className="text-3xl md:text-4xl font-bold mt-2 truncate">$1,794.89</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendUp size={14} className="text-green-500 flex-shrink-0" weight="bold" />
                      <p className="text-xs text-green-500 font-medium truncate">+100.0% vs previous month</p>
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
              <FinancialChart />
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">Expense Overview</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <SquaresFour size={16} />
                  Last 6 Months
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Circle size={16} />
                  All Categories
                </Button>
                <Button className="gap-2 bg-primary text-primary-foreground" onClick={() => navigate('/finances/add-expense')}>
                  Add Expense
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">MTD EXPENSES</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$400</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">YTD EXPENSES</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$4,850</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">PENDING</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$1,380</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">AVG MONTHLY</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$485</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">LAST 6 MONTHS</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$485</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 max-h-[calc(100vh-280px)]">
              <Card className="lg:col-span-2 border-border flex flex-col">
                <div className="p-2.5 border-b border-border flex-shrink-0">
                  <h3 className="text-sm font-bold">Expense Trend</h3>
                  <p className="text-xs text-muted-foreground">Last 6 Months</p>
                </div>
                <div className="p-2.5 flex-1 min-h-0">
                  <div className="relative h-full min-h-[160px]">
                    <div className="absolute inset-0 flex items-end justify-between gap-2 pb-8">
                      {(() => {
                        const monthlyExpenses = [
                          { month: 'Aug', amount: 650 },
                          { month: 'Sep', amount: 720 },
                          { month: 'Oct', amount: 850 },
                          { month: 'Nov', amount: 920 },
                          { month: 'Dec', amount: 1100 },
                          { month: 'Jan', amount: 1200 },
                        ]
                        const maxExpense = Math.max(...monthlyExpenses.map(m => m.amount))
                        const avgMonthly = 485
                        
                        return monthlyExpenses.map((data, i) => {
                          const height = (data.amount / maxExpense) * 100
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                              <div className="relative w-full" style={{ height: `${height}%`, minHeight: '20px' }}>
                                <div 
                                  className="absolute bottom-0 w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                                  style={{ 
                                    height: '100%',
                                    backgroundColor: 'oklch(0.75 0.15 195)'
                                  }}
                                />
                              </div>
                              <span className="text-xs font-medium text-muted-foreground">{data.month}</span>
                            </div>
                          )
                        })
                      })()}
                    </div>
                    
                    <div className="absolute inset-x-0 flex items-center pointer-events-none" style={{ bottom: '45%' }}>
                      <div className="w-full border-t-2 border-dashed border-primary opacity-60" />
                      <div className="absolute right-0 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs font-medium text-primary whitespace-nowrap">Avg</span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-start gap-4 pt-2 border-t border-border mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-3 rounded" style={{ backgroundColor: 'oklch(0.75 0.15 195)' }} />
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

              <Card className="border-border flex flex-col">
                <div className="p-2.5 border-b border-border flex items-center justify-between flex-shrink-0">
                  <div>
                    <h3 className="text-sm font-bold">Upcoming Bills</h3>
                    <p className="text-xs text-muted-foreground">Next 30 Days</p>
                  </div>
                </div>
                <div className="p-2.5 flex-1 min-h-0 overflow-auto">
                  <div className="space-y-1">
                    <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground px-2 pb-2">
                      <span>Vendor</span>
                      <span className="text-center">Due In</span>
                      <span className="text-right">Amount</span>
                      <span className="text-right">Status</span>
                    </div>
                    {[
                      { vendor: 'City Electric', dueIn: '3 days', warning: true, amount: 312, status: 312 },
                      { vendor: 'Grooming Warehouse', dueIn: '5 days', warning: false, amount: 190, status: 190 },
                      { vendor: 'Rent', dueIn: '9 days', warning: false, amount: 1200, status: 1200 },
                    ].map((bill, i) => (
                      <div key={i} className="grid grid-cols-4 gap-2 p-2 hover:bg-muted/50 transition-colors cursor-pointer rounded">
                        <span className="text-sm font-medium truncate">{bill.vendor}</span>
                        <span className="text-sm text-center flex items-center justify-center gap-1">
                          {bill.dueIn}
                          {bill.warning && <Circle size={8} className="text-yellow-500" weight="fill" />}
                        </span>
                        <span className="text-sm font-bold text-right">${bill.amount}</span>
                        <span className="text-sm font-bold text-right">${bill.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="border-border/60 flex flex-col bg-card/80 backdrop-blur-sm overflow-hidden">
                <div className="p-2.5 border-b border-border/50 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h3 className="text-sm font-bold">Expense Breakdown</h3>
                    <p className="text-xs text-muted-foreground">Last 6 Months</p>
                  </div>
                </div>
                <div className="p-3 flex flex-col lg:flex-row items-center gap-4 flex-1 min-h-0">
                  <div className="relative flex-shrink-0" style={{ width: '160px', height: '160px' }}>
                    <svg className="w-full h-full -rotate-90 drop-shadow-lg" viewBox="0 0 200 200">
                      {(() => {
                        const breakdownData = [
                          { category: 'Supplies', amount: 2340, percentage: 48, color: 'oklch(0.75 0.15 195)' },
                          { category: 'Rent', amount: 1200, percentage: 25, color: 'oklch(0.68 0.20 150)' },
                          { category: 'Utilities', amount: 725, percentage: 15, color: 'oklch(0.70 0.18 85)' },
                          { category: 'Software', amount: 375, percentage: 8, color: 'oklch(0.65 0.18 270)' },
                          { category: 'Other', amount: 210, percentage: 4, color: 'oklch(0.72 0.16 40)' },
                        ]
                        const circumference = 2 * Math.PI * 75
                        let currentOffset = 0
                        return breakdownData.map((item, i) => {
                          const offset = currentOffset
                          const dashArray = (item.percentage / 100) * circumference
                          currentOffset += dashArray
                          return (
                            <circle
                              key={i}
                              cx="100"
                              cy="100"
                              r="75"
                              fill="none"
                              stroke={item.color}
                              strokeWidth="50"
                              strokeDasharray={`${dashArray} ${circumference}`}
                              strokeDashoffset={-offset}
                              className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                              style={{ filter: `drop-shadow(0 0 8px ${item.color}60)` }}
                            />
                          )
                        })
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold tabular-nums">$4.9k</span>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full space-y-2">
                    {[
                      { category: 'Supplies', amount: 2340, percentage: 48, color: 'oklch(0.75 0.15 195)' },
                      { category: 'Rent', amount: 1200, percentage: 25, color: 'oklch(0.68 0.20 150)' },
                      { category: 'Utilities', amount: 725, percentage: 15, color: 'oklch(0.70 0.18 85)' },
                      { category: 'Software', amount: 375, percentage: 8, color: 'oklch(0.65 0.18 270)' },
                      { category: 'Other', amount: 210, percentage: 4, color: 'oklch(0.72 0.16 40)' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between hover:bg-muted/40 p-1.5 rounded-md transition-all cursor-pointer group">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm group-hover:scale-125 transition-transform" 
                            style={{ backgroundColor: item.color }} 
                          />
                          <span className="text-xs font-semibold truncate">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-sm font-bold tabular-nums">${(item.amount / 1000).toFixed(1).replace(/\.0$/, '')}k</span>
                          <span className="text-xs text-muted-foreground w-8 text-right font-semibold">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-2 border-border flex flex-col">
                <div className="p-2.5 border-b border-border flex items-center justify-between flex-shrink-0">
                  <h3 className="text-sm font-bold">Recent Expenses</h3>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All
                  </Button>
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
                    {[
                      { category: 'Supplies', vendor: 'Pet Supply Co', date: '1/10/2024', status: 'Paid', amount: 250.00 },
                      { category: 'Utilities', vendor: 'City Electric', date: '1/10/2024', status: 'Paid', amount: 85.00 },
                      { category: 'Software', vendor: 'Business Tools Inc', date: '12/08/2024', status: 'Pending', amount: 65.00 },
                      { category: 'Supplies', vendor: 'Grooming Warehouse', date: '12/09/2024', status: 'Pending', amount: 190.00 },
                      { category: 'Rent', vendor: 'Property Management LLC', date: '12/08/2024', status: 'Pending', amount: 1200.00 },
                    ].map((expense, i) => (
                      <div key={i} className="grid grid-cols-5 gap-2 p-2 hover:bg-muted/50 transition-colors cursor-pointer rounded">
                        <span className="text-sm truncate">{expense.category}</span>
                        <span className="text-sm truncate">{expense.vendor}</span>
                        <span className="text-sm">{expense.date}</span>
                        <span className={`text-xs px-2 py-1 rounded-full w-fit font-medium ${
                          expense.status === 'Paid' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {expense.status}
                        </span>
                        <span className="text-sm font-bold text-right">${expense.amount.toFixed(2)}</span>
                      </div>
                    ))}
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
                    <p className="text-lg md:text-xl font-bold mt-0.5">$2,194.89</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">YTD REVENUE</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$2,194.89</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">NEXT PAYOUT</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$2,195.00</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">AVG TRANSACTION</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$68.59</p>
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
                {[
                  { date: '12/15/2024', client: 'Sarah Johnson', service: 'Full Groom - Max & Bella', amount: 140.00, tip: 20.00, method: 'Card' },
                  { date: '12/14/2024', client: 'Mike Thompson', service: 'Bath & Trim - Charlie', amount: 75.00, tip: 10.00, method: 'Card' },
                  { date: '12/14/2024', client: 'Emily Davis', service: 'Nail Trim - Luna', amount: 25.00, tip: 5.00, method: 'Cash' },
                  { date: '12/13/2024', client: 'James Wilson', service: 'Full Groom - Rocky', amount: 85.00, tip: 15.00, method: 'Card' },
                  { date: '12/12/2024', client: 'Lisa Martinez', service: 'Deshed Treatment - Bear', amount: 95.00, tip: 15.00, method: 'Card' },
                  { date: '12/12/2024', client: 'Robert Brown', service: 'Bath Only - Buddy', amount: 45.00, tip: 8.00, method: 'Card' },
                ].map((payment, i) => (
                  <div key={i} className="p-3 md:p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start md:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                          <p className="font-medium text-sm md:text-base truncate">{payment.client}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground w-fit">
                            {payment.method}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-1">{payment.service}</p>
                        <p className="text-xs text-muted-foreground">{payment.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base md:text-lg font-bold">${(payment.amount + payment.tip).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">+${payment.tip.toFixed(2)} tip</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">NEXT RUN</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">Not Scheduled</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">MTD PAYROLL</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$0.00</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">YTD PAYROLL</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$0.00</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">ACTIVE STAFF</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">3</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="border-border">
              <div className="p-3 md:p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm md:text-base font-bold">Staff Members</h3>
                <Button className="gap-2" onClick={() => navigate('/finances/run-payroll')}>
                  <Users size={18} />
                  Run Payroll
                </Button>
              </div>
              <div className="divide-y divide-border">
                {[
                  { name: 'Jessica Anderson', role: 'Lead Groomer', status: 'Active', hours: 40, rate: 25.00, ytd: 0 },
                  { name: 'Michael Chen', role: 'Groomer', status: 'Active', hours: 35, rate: 20.00, ytd: 0 },
                  { name: 'Amanda Rodriguez', role: 'Bather', status: 'Active', hours: 30, rate: 15.00, ytd: 0 },
                ].map((staff, i) => (
                  <div key={i} className="p-3 md:p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start md:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                          <p className="font-medium text-sm md:text-base truncate">{staff.name}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500 w-fit">
                            {staff.status}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">{staff.role}</p>
                        <p className="text-xs text-muted-foreground">Rate: ${staff.rate.toFixed(2)}/hr</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs md:text-sm text-muted-foreground">YTD Earnings</p>
                        <p className="text-base md:text-lg font-bold">${staff.ytd.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border">
              <div className="p-3 md:p-4 border-b border-border">
                <h3 className="text-sm md:text-base font-bold">Payroll History</h3>
              </div>
              <div className="p-8 md:p-12 text-center text-muted-foreground">
                <p className="text-sm md:text-base">No payroll runs yet</p>
                <p className="text-xs md:text-sm mt-2">Click "Run Payroll" to get started</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="taxes" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">MTD COLLECTED</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$0.00</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">YTD COLLECTED</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$0.00</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">NEXT DUE DATE</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">Jan 20, 2026</p>
                  </div>
                </div>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">AMOUNT DUE</p>
                    <p className="text-lg md:text-xl font-bold mt-0.5">$0.00</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="border-border">
              <div className="p-3 md:p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm md:text-base font-bold">Tax Periods</h3>
                <Button className="gap-2" onClick={() => navigate('/finances/file-taxes')}>
                  <Receipt size={18} />
                  File Taxes
                </Button>
              </div>
              <div className="divide-y divide-border">
                {[
                  { period: 'December 2024', collected: 0.00, due: 'Jan 20, 2025', status: 'Pending' },
                  { period: 'November 2024', collected: 0.00, due: 'Dec 20, 2024', status: 'Not Filed' },
                  { period: 'October 2024', collected: 0.00, due: 'Nov 20, 2024', status: 'Not Filed' },
                ].map((tax, i) => (
                  <div key={i} className="p-3 md:p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start md:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                          <p className="font-medium text-sm md:text-base truncate">{tax.period}</p>
                          <span className={`text-xs px-2 py-1 rounded-full w-fit ${
                            tax.status === 'Pending' 
                              ? 'bg-yellow-500/20 text-yellow-500' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {tax.status}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">Due: {tax.due}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs md:text-sm text-muted-foreground">Tax Collected</p>
                        <p className="text-base md:text-lg font-bold">${tax.collected.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border bg-muted/30">
              <div className="p-4 md:p-6">
                <h3 className="text-sm md:text-base font-bold mb-2">Tax Settings</h3>
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm md:text-base">Sales Tax Rate</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Texas state and local tax rate</p>
                    </div>
                    <p className="text-base md:text-lg font-bold">8.25%</p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-3 border-t border-border">
                    <div className="flex-1">
                      <p className="font-medium text-sm md:text-base">Tax ID</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Federal Employer Identification Number</p>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">Not configured</p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-3 border-t border-border">
                    <div className="flex-1">
                      <p className="font-medium text-sm md:text-base">Auto-calculate on invoices</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Automatically add tax to client invoices</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full md:w-auto">Configure</Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
