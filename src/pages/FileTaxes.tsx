import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Receipt, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function FileTaxes() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    period: '',
    taxCollected: '',
    taxRate: '8.25',
    filingDate: new Date().toISOString().split('T')[0],
    confirmationNumber: '',
    notes: ''
  })

  const periods = [
    'December 2024',
    'November 2024',
    'October 2024',
    'September 2024',
    'August 2024',
    'July 2024'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.period || !formData.taxCollected) {
      toast.error('Please fill in all required fields')
      return
    }

    toast.success('Tax filing recorded successfully')
    navigate('/finances')
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-3 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 md:mb-6">
          <Button 
            variant="ghost" 
            className="gap-2 -ml-2 mb-3 md:mb-4"
            onClick={() => navigate('/finances')}
          >
            <ArrowLeft size={18} />
            Back to Finances
          </Button>
          <div className="flex items-center gap-3">
            <Receipt size={28} className="text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">File Taxes</h1>
              <p className="text-sm text-muted-foreground">Record sales tax filing for a period</p>
            </div>
          </div>
        </div>

        <Card className="border-border bg-blue-500/10 mb-4">
          <div className="p-4 flex gap-3">
            <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-500 mb-1">Tax Filing Information</p>
              <p className="text-muted-foreground">
                This form records your sales tax filing for internal tracking. Make sure to file with your state's tax authority separately.
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-border">
          <form onSubmit={handleSubmit}>
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Tax Period *</Label>
                  <Select
                    value={formData.period}
                    onValueChange={(value) => setFormData({ ...formData, period: value })}
                  >
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((period) => (
                        <SelectItem key={period} value={period.toLowerCase().replace(' ', '-')}>
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filingDate">Filing Date *</Label>
                  <Input
                    id="filingDate"
                    type="date"
                    value={formData.filingDate}
                    onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxCollected">Tax Collected *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="taxCollected"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-7"
                      value={formData.taxCollected}
                      onChange={(e) => setFormData({ ...formData, taxCollected: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    placeholder="8.25"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmationNumber">Confirmation Number</Label>
                <Input
                  id="confirmationNumber"
                  placeholder="Enter filing confirmation number"
                  value={formData.confirmationNumber}
                  onChange={(e) => setFormData({ ...formData, confirmationNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional details about this filing..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              {formData.taxCollected && formData.taxRate && (
                <Card className="bg-muted/50 border-border p-4">
                  <h3 className="font-bold text-sm mb-3">Filing Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gross Sales (estimated):</span>
                      <span className="font-medium">
                        ${(parseFloat(formData.taxCollected || '0') / (parseFloat(formData.taxRate || '0') / 100)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax Rate:</span>
                      <span className="font-medium">{formData.taxRate}%</span>
                    </div>
                    <div className="pt-2 border-t border-border flex justify-between">
                      <span className="font-bold">Tax Collected:</span>
                      <span className="font-bold text-lg">${parseFloat(formData.taxCollected || '0').toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="p-4 md:p-6 border-t border-border flex flex-col-reverse md:flex-row gap-3 justify-end">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/finances')}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                <Receipt size={18} />
                Record Filing
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
