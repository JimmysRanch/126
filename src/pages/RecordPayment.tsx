import { useState } from 'react'
import { getTodayInBusinessTimezone } from "@/lib/date-utils"
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, CreditCard } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function RecordPayment() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    client: '',
    amount: '',
    tip: '',
    method: '',
    date: getTodayInBusinessTimezone(),
    service: '',
    notes: ''
  })

  const paymentMethods = [
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'other', label: 'Other' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.client || !formData.amount || !formData.method) {
      toast.error('Please fill in all required fields')
      return
    }

    toast.success('Payment recorded successfully')
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
            <CreditCard size={28} className="text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Record Payment</h1>
              <p className="text-sm text-muted-foreground">Record a payment received from a client</p>
            </div>
          </div>
        </div>

        <Card className="border-border">
          <form onSubmit={handleSubmit}>
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name *</Label>
                  <Input
                    id="client"
                    placeholder="e.g., Sarah Johnson"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Payment Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Service Amount *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-7"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tip">Tip Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="tip"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-7"
                      value={formData.tip}
                      onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Payment Method *</Label>
                <Select
                  value={formData.method}
                  onValueChange={(value) => setFormData({ ...formData, method: value })}
                >
                  <SelectTrigger id="method" className="border-dashed border-primary/40 bg-muted/10">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Service Description</Label>
                <Input
                  id="service"
                  placeholder="e.g., Full Groom - Max & Bella"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional details about this payment..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              {formData.amount && (
                <Card className="bg-muted/50 border-border p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service Amount:</span>
                      <span className="font-medium">${parseFloat(formData.amount || '0').toFixed(2)}</span>
                    </div>
                    {formData.tip && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tip:</span>
                        <span className="font-medium">+${parseFloat(formData.tip || '0').toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-border flex justify-between">
                      <span className="font-bold">Total Payment:</span>
                      <span className="font-bold text-lg">
                        ${(parseFloat(formData.amount || '0') + parseFloat(formData.tip || '0')).toFixed(2)}
                      </span>
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
                <CreditCard size={18} />
                Record Payment
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
