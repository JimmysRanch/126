import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SquaresFour, Circle, CreditCard, Users, Receipt, TrendUp, TrendDown } from '@phosphor-icons/react'
import { FinancialChart } from '@/components/FinancialChart'
import { useIsMobile } from '@/hooks/use-mobile'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export function Finances() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const isMobile = useIsMobile()

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

            <Card className="p-4 md:p-6 border-border">
              <div className="mb-4">
                <h3 className="text-base md:text-lg font-bold">FEES</h3>
                <p className="text-xs md:text-sm text-muted-foreground">MTD PROCESSOR FEES</p>
              </div>
              <div className="mt-3">
                <p className="text-2xl md:text-3xl font-bold">$0</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 text-xs h-8 w-full md:w-auto">
                REVIEW
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="p-2 md:p-2.5 border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">MTD EXPENSES</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">$400.00</p>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">YTD EXPENSES</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">$400.00</p>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">PENDING</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">$0.00</p>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">AVG MONTHLY</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">$400.00</p>
              </Card>
            </div>

            <Card className="border-border">
              <div className="p-3 md:p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm md:text-base font-bold">Recent Expenses</h3>
                <Button className="gap-2">
                  <Circle size={18} />
                  Add Expense
                </Button>
              </div>
              <div className="divide-y divide-border">
                {[
                  { date: '12/15/2024', category: 'Supplies', vendor: 'Pet Supply Co', amount: 250.00, status: 'Paid' },
                  { date: '12/10/2024', category: 'Utilities', vendor: 'City Electric', amount: 85.00, status: 'Paid' },
                  { date: '12/08/2024', category: 'Software', vendor: 'Business Tools Inc', amount: 65.00, status: 'Paid' },
                  { date: '12/05/2024', category: 'Supplies', vendor: 'Grooming Warehouse', amount: 180.00, status: 'Pending' },
                  { date: '12/01/2024', category: 'Rent', vendor: 'Property Management LLC', amount: 1200.00, status: 'Pending' },
                ].map((expense, i) => (
                  <div key={i} className="p-3 md:p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start md:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                          <p className="font-medium text-sm md:text-base truncate">{expense.vendor}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground w-fit">
                            {expense.category}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">{expense.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          expense.status === 'Paid' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {expense.status}
                        </span>
                        <p className="text-base md:text-lg font-bold">${expense.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="p-2 md:p-2.5 border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">MTD REVENUE</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">$2,194.89</p>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">YTD REVENUE</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">$2,194.89</p>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">NEXT PAYOUT</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">$2,195.00</p>
              </Card>
              <Card className="p-2 md:p-2.5 border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">AVG TRANSACTION</p>
                <p className="text-lg md:text-xl font-bold mt-0.5">$68.59</p>
              </Card>
            </div>

            <Card className="border-border">
              <div className="p-3 md:p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm md:text-base font-bold">Recent Payments</h3>
                <Button className="gap-2">
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Card className="p-3 md:p-4 border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Next Run</p>
                <p className="text-base md:text-lg font-bold mt-2">Not Scheduled</p>
              </Card>
              <Card className="p-3 md:p-4 border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">MTD Payroll</p>
                <p className="text-xl md:text-2xl font-bold mt-2">$0.00</p>
              </Card>
              <Card className="p-3 md:p-4 border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">YTD Payroll</p>
                <p className="text-xl md:text-2xl font-bold mt-2">$0.00</p>
              </Card>
              <Card className="p-3 md:p-4 border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Active Staff</p>
                <p className="text-xl md:text-2xl font-bold mt-2">3</p>
              </Card>
            </div>

            <Card className="border-border">
              <div className="p-3 md:p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm md:text-base font-bold">Staff Members</h3>
                <Button className="gap-2">
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Card className="p-3 md:p-4 border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">MTD Collected</p>
                <p className="text-xl md:text-2xl font-bold mt-2">$0.00</p>
              </Card>
              <Card className="p-3 md:p-4 border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">YTD Collected</p>
                <p className="text-xl md:text-2xl font-bold mt-2">$0.00</p>
              </Card>
              <Card className="p-3 md:p-4 border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Next Due Date</p>
                <p className="text-base md:text-lg font-bold mt-2">Jan 20, 2026</p>
              </Card>
              <Card className="p-3 md:p-4 border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Amount Due</p>
                <p className="text-xl md:text-2xl font-bold mt-2">$0.00</p>
              </Card>
            </div>

            <Card className="border-border">
              <div className="p-3 md:p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm md:text-base font-bold">Tax Periods</h3>
                <Button className="gap-2">
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
