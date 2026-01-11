import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Circle, SquaresFour, CaretDown, Warning } from '@phosphor-icons/react'
import { useIsMobile } from '@/hooks/use-mobile'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export function ExpensesDetail() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
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
    { category: 'Supplies', amount: 2340, percentage: 48, color: 'oklch(0.75 0.15 195)' },
    { category: 'Rent', amount: 1200, percentage: 25, color: 'oklch(0.85 0.10 120)' },
    { category: 'Utilities', amount: 725, percentage: 15, color: 'oklch(0.90 0.08 85)' },
    { category: 'Software', amount: 375, percentage: 8, color: 'oklch(0.65 0.18 270)' },
    { category: 'Other', amount: 210, percentage: 4, color: 'oklch(0.80 0.12 40)' },
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

  const circumference = 2 * Math.PI * 80
  let currentOffset = 0

  return (
    <div className="min-h-screen bg-background text-foreground p-3 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Expense Overview</h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px] md:w-[180px] gap-2">
                <SquaresFour size={18} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px] md:w-[170px] gap-2">
                <Circle size={18} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="supplies">Supplies</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2" onClick={() => navigate('/finances/add-expense')}>
              <Circle size={18} />
              Add Expense
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 md:mb-6">
          <Card className="p-3 md:p-4 border-border">
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground font-medium">MTD EXPENSES</p>
            <p className="text-xl md:text-2xl font-bold mt-1">${expenseData.mtd}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Month to Date</p>
          </Card>

          <Card className="p-3 md:p-4 border-border">
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground font-medium">YTD EXPENSES</p>
            <p className="text-xl md:text-2xl font-bold mt-1">${expenseData.ytd.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Year to Date</p>
          </Card>

          <Card className="p-3 md:p-4 border-border">
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground font-medium">PENDING</p>
            <p className="text-xl md:text-2xl font-bold mt-1">${expenseData.pending.toLocaleString()}</p>
          </Card>

          <Card className="p-3 md:p-4 border-border">
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground font-medium">AVG MONTHLY</p>
            <p className="text-xl md:text-2xl font-bold mt-1">${expenseData.avgMonthly}</p>
          </Card>

          <Card className="p-3 md:p-4 border-border">
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground font-medium">LAST 6 MONTHS</p>
            <p className="text-xl md:text-2xl font-bold mt-1">${expenseData.last6Months}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Last 6 Months</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <Card className="lg:col-span-2 border-border">
            <div className="p-3 md:p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base md:text-lg font-bold">Expenses Trend</h3>
                <div className="flex items-center gap-2">
                  <Select value="last-6-months" onValueChange={() => {}}>
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                      <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value="all" onValueChange={() => {}}>
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="supplies">Supplies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Last 6 Months</p>
            </div>
            <div className="p-4 md:p-6">
              <div className="relative h-64 md:h-80">
                <div className="absolute inset-0 flex items-end justify-between gap-2 md:gap-4 pb-8">
                  {monthlyExpenses.map((data, i) => {
                    const height = (data.amount / maxExpense) * 100
                    const isLarger = data.amount > avgMonthly
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full" style={{ height: `${height}%`, minHeight: '40px' }}>
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
                  })}
                </div>
                
                <div className="absolute inset-x-0 flex items-center pointer-events-none" style={{ bottom: `${(avgMonthly / maxExpense) * 100 * 0.8 + 32}px` }}>
                  <div className="w-full border-t-2 border-dashed border-primary opacity-60" />
                  <div className="absolute right-0 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs font-medium text-primary whitespace-nowrap">Avg Monthly</span>
                  </div>
                </div>

                <div className="absolute inset-x-0 flex items-center pointer-events-none" style={{ bottom: `${((avgMonthly * 1.5) / maxExpense) * 100 * 0.8 + 32}px` }}>
                  <div className="w-full border-t-2 border-dashed opacity-30" />
                  <div className="absolute right-0 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-foreground/30" />
                    <span className="text-xs font-medium text-foreground/50 whitespace-nowrap">Monthly larger</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-start gap-4 pt-2 border-t border-border mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-3 rounded" style={{ backgroundColor: 'oklch(0.75 0.15 195)' }} />
                    <span className="text-xs font-medium">Monthly Expenses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs font-medium">Avg Monthly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-foreground/30" />
                    <span className="text-xs font-medium">Monthly larger</span>
                  </div>
                </div>

                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-muted-foreground">
                  <span>$1,200</span>
                  <span>$1,000</span>
                  <span className="opacity-0">$3000</span>
                  <span>$700</span>
                  <span>$400</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-border">
            <div className="p-3 md:p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-base md:text-lg font-bold">Upcoming Bills</h3>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View All
                <CaretDown size={14} />
              </Button>
            </div>
            <div className="divide-y divide-border">
              <div className="p-3 md:p-4 grid grid-cols-[1fr,auto,auto,auto] gap-2 text-xs font-medium text-muted-foreground">
                <span>Vendor</span>
                <span className="text-right">Due In</span>
                <span className="text-right">Amount</span>
                <span className="text-right">Status</span>
              </div>
              {upcomingBills.map((bill, i) => (
                <div key={i} className="p-3 md:p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2 items-center">
                    <span className="font-medium text-sm truncate">{bill.vendor}</span>
                    <span className="text-xs text-right flex items-center gap-1">
                      {bill.dueIn}
                      {bill.warning && <Warning size={14} className="text-yellow-500" weight="fill" />}
                    </span>
                    <span className="text-sm font-bold text-right">${bill.amount}</span>
                    <span className="text-sm font-bold text-right">{bill.status}</span>
                  </div>
                </div>
              ))}
              <div className="p-3 md:p-4 text-center">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                  View All
                  <CaretDown size={14} />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-border flex flex-col">
            <div className="p-3 md:p-4 border-b border-border flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-base md:text-lg font-bold">Expense Breakdown</h3>
                <p className="text-xs text-muted-foreground">Last 6 Months</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View All
                <CaretDown size={14} />
              </Button>
            </div>
            <div className="p-4 md:p-6 flex-1 flex flex-col">
              <div className="relative w-full flex-1 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                  {breakdownData.map((item, i) => {
                    const offset = currentOffset
                    const dashArray = (item.percentage / 100) * circumference
                    currentOffset += dashArray
                    return (
                      <circle
                        key={i}
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="32"
                        strokeDasharray={`${dashArray} ${circumference}`}
                        strokeDashoffset={-offset}
                        className="transition-all hover:opacity-80 cursor-pointer"
                      />
                    )
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold">${breakdownData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-2 flex-shrink-0">
                {breakdownData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium truncate">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-bold">${item.amount.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground w-8 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-border text-center">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                    View All
                    <CaretDown size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2 border-border">
            <div className="p-3 md:p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-base md:text-lg font-bold">Recent Expenses</h3>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View All
                <CaretDown size={14} />
              </Button>
            </div>
            <div>
              <div className="p-3 md:p-4 grid grid-cols-[auto,1fr,auto,auto,auto] gap-3 border-b border-border text-xs font-medium text-muted-foreground">
                <span>Category</span>
                <span>Vendor</span>
                <span className="text-right">Date</span>
                <span className="text-right">Status</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="divide-y divide-border">
                {recentExpenses.map((expense, i) => (
                  <div key={i} className="p-3 md:p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="grid grid-cols-[auto,1fr,auto,auto,auto] gap-3 items-center">
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground whitespace-nowrap">
                        {expense.category}
                      </span>
                      <span className="text-sm font-medium truncate">{expense.vendor}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{expense.date}</span>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        expense.status === 'Paid' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {expense.status}
                      </span>
                      <span className="text-sm font-bold text-right">${expense.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 md:p-4 border-t border-border">
                <Button 
                  className="w-full gap-2" 
                  onClick={() => navigate('/finances/add-expense')}
                >
                  <Circle size={18} />
                  Add Expense
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
