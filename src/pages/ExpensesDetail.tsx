import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Faders, FunnelSimple, CaretRight, CaretDown, Warning, Plus, TrendUp, TrendDown } from '@phosphor-icons/react'
import { useIsMobile } from '@/hooks/use-mobile'

export function ExpensesDetail() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('last-6-months')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const isMobile = useIsMobile()

  const expenseData = {
    mtd: 400,
    ytd: 4850,
    pending: 1380,
    avgMonthly: 485,
    last6Months: 485
  }

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

  const breakdownData = [
    { category: 'Supplies', amount: 2340, percentage: 48, color: 'oklch(0.65 0.30 260)' },
    { category: 'Rent', amount: 1200, percentage: 25, color: 'oklch(0.70 0.28 330)' },
    { category: 'Utilities', amount: 725, percentage: 15, color: 'oklch(0.75 0.26 150)' },
    { category: 'Software', amount: 375, percentage: 8, color: 'oklch(0.72 0.25 50)' },
    { category: 'Other', amount: 210, percentage: 4, color: 'oklch(0.68 0.24 25)' },
  ]

  const recentExpenses = [
    { category: 'Supplies', vendor: 'Pet Supply Co', date: '1/10/2024', status: 'Paid', amount: 250.00 },
    { category: 'Utilities', vendor: 'City Electric', date: '1/10/2024', status: 'Paid', amount: 85.00 },
    { category: 'Software', vendor: 'Business Tools Inc', date: '12/08/2024', status: 'Pending', amount: 65.00 },
    { category: 'Supplies', vendor: 'Grooming Warehouse', date: '12/09/2024', status: 'Pending', amount: 190.00 },
    { category: 'Rent', vendor: 'Property Management LLC', date: '12/08/2024', status: 'Pending', amount: 1200.00 },
  ]

  const upcomingBills = [
    { vendor: 'City Electric', dueIn: '3 days', warning: true, amount: 312, status: '$312' },
    { vendor: 'Grooming Warehouse', dueIn: '5 days', warning: false, amount: 190, status: '$190' },
    { vendor: 'Rent', dueIn: '9 days', warning: false, amount: 1200, status: '$1,200' },
  ]

  const circumference = 2 * Math.PI * 75
  let currentOffset = 0

  return (
    <div className="h-full min-h-0 overflow-hidden bg-background flex flex-col">
      <div className="flex-1 min-h-0 flex flex-col gap-3 p-3">
        <div className="grid grid-cols-4 gap-3 flex-shrink-0">
          <Card className="p-3 border-border/60 bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-all">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 opacity-90">MTD Expenses</p>
            <p className="text-2xl font-bold tabular-nums">${expenseData.mtd}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendDown size={12} className="text-green-500" weight="bold" />
              <span className="text-[10px] text-green-500 font-semibold">12% vs last month</span>
            </div>
          </Card>

          <Card className="p-3 border-border/60 bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-all">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 opacity-90">YTD Expenses</p>
            <p className="text-2xl font-bold tabular-nums">${expenseData.ytd.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendUp size={12} className="text-red-500" weight="bold" />
              <span className="text-[10px] text-red-500 font-semibold">8% vs last year</span>
            </div>
          </Card>

          <Card className="p-3 border-yellow-500/40 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 hover:border-yellow-500/60 transition-all">
            <p className="text-[10px] uppercase tracking-widest text-yellow-600 font-bold mb-1.5">Pending</p>
            <p className="text-2xl font-bold text-yellow-500 tabular-nums">${expenseData.pending.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-1">
              <Warning size={12} className="text-yellow-500" weight="fill" />
              <span className="text-[10px] text-yellow-600 font-semibold">3 bills due soon</span>
            </div>
          </Card>

          <Card className="p-3 border-border/60 bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-all">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 opacity-90">Avg Monthly</p>
            <p className="text-2xl font-bold tabular-nums">${expenseData.avgMonthly}</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] text-muted-foreground font-semibold">6-month average</span>
            </div>
          </Card>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-3 grid-rows-2 gap-3">
          <Card className="col-span-2 row-span-1 border-border/60 flex flex-col min-h-0 bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="px-3 pb-2 pt-1.5 border-b border-border/50 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">Expenses Trend</h3>
                <p className="text-xs text-muted-foreground">Monthly comparison</p>
              </div>
            </div>
            <div className="px-4 pb-4 flex-1 min-h-0">
              <div className="relative h-full">
                <div className="absolute inset-0 flex items-end justify-between gap-2 pb-8">
                  {monthlyExpenses.map((data, i) => {
                    const height = (data.amount / maxExpense) * 100
                    const isHighest = data.amount === maxExpense
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full group" style={{ height: `${height}%`, minHeight: '30px' }}>
                          <div 
                            className="absolute bottom-0 w-full rounded-t-lg transition-all duration-300 group-hover:scale-105 cursor-pointer relative overflow-visible"
                            style={{ 
                              height: '100%',
                              background: isHighest 
                                ? 'linear-gradient(to top, oklch(0.70 0.25 200), oklch(0.75 0.28 210))'
                                : 'linear-gradient(to top, oklch(0.68 0.22 200 / 0.8), oklch(0.72 0.24 205))',
                              boxShadow: isHighest 
                                ? '0 4px 24px oklch(0.70 0.25 200 / 0.5), 0 0 32px oklch(0.75 0.28 210 / 0.3)' 
                                : '0 2px 16px oklch(0.70 0.22 200 / 0.3)'
                            }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap shadow-lg">
                              ${data.amount}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">{data.month}</span>
                      </div>
                    )
                  })}
                </div>
                
                <div className="absolute inset-x-0 flex items-center pointer-events-none" style={{ bottom: `${(avgMonthly / maxExpense) * 100 * 0.75 + 32}px` }}>
                  <div className="w-full border-t-2 border-dashed border-primary/50" />
                  <div className="absolute right-0 flex items-center gap-1.5 bg-primary/10 backdrop-blur-sm px-2 py-0.5 rounded-full border border-primary/30">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-bold text-primary whitespace-nowrap">Avg: ${avgMonthly}</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-start gap-4 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-2.5 rounded-sm shadow-sm" style={{ background: 'linear-gradient(to right, oklch(0.75 0.15 195), oklch(0.80 0.18 200))' }} />
                    <span className="text-xs font-semibold text-foreground">Monthly Spend</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="text-xs font-semibold text-muted-foreground">Average Line</span>
                  </div>
                </div>

                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-muted-foreground font-semibold tabular-nums">
                  <span>$1,200</span>
                  <span>$900</span>
                  <span>$600</span>
                  <span>$300</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="col-span-1 row-span-1 border-border/60 flex flex-col min-h-0 bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="px-3 pb-2 pt-1.5 border-b border-border/50 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">Upcoming Bills</h3>
                <p className="text-xs text-muted-foreground">Next 30 days</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-xs h-7 px-2 hover:bg-primary/10 hover:text-primary transition-all">
                View All
                <CaretRight size={12} weight="bold" />
              </Button>
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="px-3 py-2 grid grid-cols-[1fr,auto,auto] gap-3 text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80 border-b border-border/30 flex-shrink-0">
                <span>Vendor</span>
                <span className="text-right">Due</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
                <div className="divide-y divide-border/30">
                  {upcomingBills.map((bill, i) => (
                    <div key={i} className="px-3 py-2.5 hover:bg-primary/5 transition-all cursor-pointer group">
                      <div className="grid grid-cols-[1fr,auto,auto] gap-3 items-center">
                        <span className="font-bold text-sm truncate group-hover:text-primary transition-colors">{bill.vendor}</span>
                        <span className="text-xs text-right flex items-center gap-1 justify-end">
                          {bill.warning && <Warning size={14} className="text-yellow-500" weight="fill" />}
                          <span className={bill.warning ? 'text-yellow-500 font-bold' : 'text-muted-foreground font-semibold'}>{bill.dueIn}</span>
                        </span>
                        <span className="text-sm font-bold text-right tabular-nums">{bill.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="col-span-1 row-span-1 border-border/60 flex flex-col min-h-0 bg-card/80 backdrop-blur-sm overflow-hidden p-0">
            <div className="px-3 pb-2 pt-1.5 border-b border-border/50 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">Expense Breakdown</h3>
                <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-xs h-7 px-2 hover:bg-primary/10 hover:text-primary transition-all">
                View All
                <CaretRight size={12} weight="bold" />
              </Button>
            </div>
            <div className="px-4 pb-4 flex-1 min-h-0 flex gap-4 items-center">
              <div className="flex-1 flex items-center justify-center">
                <div className="relative" style={{ width: 'min(280px, 100%)', aspectRatio: '1/1' }}>
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                    {(() => {
                      let offset = 0
                      return breakdownData.map((item, i) => {
                        const dashArray = (item.percentage / 100) * circumference
                        const currentOff = offset
                        offset += dashArray
                        
                        return (
                          <g key={i}>
                            <circle
                              cx="100"
                              cy="100"
                              r="75"
                              fill="none"
                              stroke={item.color}
                              strokeWidth="50"
                              strokeDasharray={`${dashArray} ${circumference}`}
                              strokeDashoffset={-currentOff}
                              className="transition-all duration-500 hover:stroke-[54] cursor-pointer"
                              style={{ 
                                filter: `drop-shadow(0 6px 20px ${item.color}dd) drop-shadow(0 0 32px ${item.color}88)`,
                                strokeLinecap: 'round'
                              }}
                            />
                          </g>
                        )
                      })
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold tabular-nums bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                      ${(breakdownData.reduce((sum, item) => sum + item.amount, 0) / 1000).toFixed(1).replace(/\.0$/, '')}k
                    </span>
                    <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Total</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 flex flex-col gap-1.5 min-w-[140px]">
                {breakdownData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 hover:bg-muted/40 p-1.5 rounded-md transition-all cursor-pointer group">
                    <div className="flex items-center gap-2 min-w-0">
                      <div 
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-lg group-hover:scale-125 transition-transform" 
                        style={{ 
                          backgroundColor: item.color,
                          boxShadow: `0 0 16px ${item.color}dd, 0 0 28px ${item.color}88`
                        }} 
                      />
                      <span className="text-xs font-semibold truncate">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold tabular-nums">${(item.amount / 1000).toFixed(1).replace(/\.0$/, '')}k</span>
                      <span className="text-xs text-muted-foreground w-8 text-right font-semibold">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="col-span-2 row-span-1 border-border/60 flex flex-col min-h-0 bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="px-3 pb-2 pt-1.5 border-b border-border/50 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">Recent Expenses</h3>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="gap-1 text-xs h-7 px-2"
                  onClick={() => navigate('/finances/add-expense')}
                >
                  <Plus size={14} weight="bold" />
                  Add Expense
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 text-xs h-7 px-2 hover:bg-primary/10 hover:text-primary transition-all"
                  onClick={() => navigate('/finances/all-expenses')}
                >
                  View All
                  <CaretRight size={12} weight="bold" />
                </Button>
              </div>
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="px-3 py-2 grid grid-cols-[auto,1fr,auto,auto,auto] gap-3 border-b border-border/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80 flex-shrink-0">
                <span>Category</span>
                <span>Vendor</span>
                <span className="text-right">Date</span>
                <span className="text-center">Status</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
                <div className="divide-y divide-border/30">
                  {recentExpenses.map((expense, i) => (
                    <div key={i} className="px-3 py-2.5 hover:bg-primary/5 transition-all cursor-pointer group">
                      <div className="grid grid-cols-[auto,1fr,auto,auto,auto] gap-3 items-center">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground whitespace-nowrap font-bold group-hover:bg-primary/15 group-hover:text-primary transition-all">
                          {expense.category}
                        </span>
                        <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">{expense.vendor}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap font-semibold tabular-nums">{expense.date}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap font-bold shadow-lg ${
                          expense.status === 'Paid' 
                            ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-emerald-500/90' 
                            : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-orange-500/90'
                        }`}>
                          {expense.status}
                        </span>
                        <span className="text-sm font-bold text-right tabular-nums">${expense.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
