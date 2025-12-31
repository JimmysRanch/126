import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SquaresFour, Circle, CreditCard, Users, Receipt, TrendUp, TrendDown } from '@phosphor-icons/react'
import { FinancialChart } from '@/components/FinancialChart'

export function Finances() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[32px] font-bold tracking-tight leading-none">
            Finances
          </h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border h-12">
            <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <SquaresFour size={18} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="expenses" className="gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground">
              <Circle size={18} />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground">
              <CreditCard size={18} />
              Payments
            </TabsTrigger>
            <TabsTrigger value="payroll" className="gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground">
              <Users size={18} />
              Payroll
            </TabsTrigger>
            <TabsTrigger value="taxes" className="gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground">
              <Receipt size={18} />
              Taxes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 border-border">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    BILLS
                  </p>
                  <p className="text-[10px] text-muted-foreground">0 OVERDUE</p>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold">$0</p>
                </div>
                <Button variant="outline" size="sm" className="mt-4 text-xs h-8">
                  REVIEW BILLS
                </Button>
              </Card>

              <Card className="p-6 border-border">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    PAYMENTS
                  </p>
                  <p className="text-[10px] text-muted-foreground">NEXT PAYOUT</p>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold">$2,195</p>
                </div>
                <Button variant="outline" size="sm" className="mt-4 text-xs h-8">
                  VIEW LEDGER
                </Button>
              </Card>

              <Card className="p-6 border-border">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    SALES TAX
                  </p>
                  <p className="text-[10px] text-muted-foreground">DECEMBER 2025 COLLECTED</p>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold">$0</p>
                  <p className="text-xs text-muted-foreground mt-1">Due January 20, 2026</p>
                </div>
                <Button variant="outline" size="sm" className="mt-2 text-xs h-8">
                  OPEN TAXES
                </Button>
              </Card>

              <Card className="p-6 border-border">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    PAYROLL
                  </p>
                  <p className="text-[10px] text-muted-foreground">NEXT RUN</p>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">Not scheduled</p>
                </div>
                <Button variant="outline" size="sm" className="mt-4 text-xs h-8">
                  OPEN PAYROLL
                </Button>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium mb-1">
                      MONEY IN (THIS MONTH)
                    </p>
                    <p className="text-4xl font-bold mt-2">$2,194.89</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendUp size={14} className="text-green-500" weight="bold" />
                      <p className="text-xs text-green-500 font-medium">+100.0% vs previous month</p>
                    </div>
                  </div>
                  <TrendUp size={20} className="text-green-500" weight="bold" />
                </div>
              </Card>

              <Card className="p-6 border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium mb-1">
                      MONEY OUT (THIS MONTH)
                    </p>
                    <p className="text-4xl font-bold mt-2">$400.00</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendUp size={14} className="text-green-500" weight="bold" />
                      <p className="text-xs text-green-500 font-medium">+100.0% vs previous month</p>
                    </div>
                  </div>
                  <TrendUp size={20} className="text-green-500" weight="bold" />
                </div>
              </Card>

              <Card className="p-6 border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium mb-1">
                      WHAT'S LEFT (THIS MONTH)
                    </p>
                    <p className="text-4xl font-bold mt-2">$1,794.89</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendUp size={14} className="text-green-500" weight="bold" />
                      <p className="text-xs text-green-500 font-medium">+100.0% vs previous month</p>
                    </div>
                  </div>
                  <TrendUp size={20} className="text-green-500" weight="bold" />
                </div>
              </Card>
            </div>

            <Card className="p-6 border-border">
              <div className="mb-4">
                <h3 className="text-lg font-bold">Monthly Overview</h3>
                <p className="text-sm text-muted-foreground">Revenue, expenses, and profit trends for the last six months.</p>
              </div>
              <FinancialChart />
            </Card>

            <Card className="p-6 border-border">
              <div className="mb-4">
                <h3 className="text-lg font-bold">FEES</h3>
                <p className="text-sm text-muted-foreground">MTD PROCESSOR FEES</p>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-bold">$0</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 text-xs h-8">
                REVIEW
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card className="p-12 border-border text-center">
              <p className="text-muted-foreground">Expenses tracking will appear here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="p-12 border-border text-center">
              <p className="text-muted-foreground">Payment history will appear here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="payroll">
            <Card className="p-12 border-border text-center">
              <p className="text-muted-foreground">Payroll management will appear here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="taxes">
            <Card className="p-12 border-border text-center">
              <p className="text-muted-foreground">Tax information will appear here.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
