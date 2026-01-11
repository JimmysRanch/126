import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Receipt } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function AddExpense() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    vendor: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    status: 'pending'
  })

  const categories = [
    'Supplies',
    'Utilities',
    'Rent',
    'Software',
    'Marketing',
    'Insurance',
    'Maintenance',
    'Other'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.vendor || !formData.amount || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    toast.success('Expense added successfully')
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
              <h1 className="text-2xl md:text-3xl font-bold">Add Expense</h1>
              <p className="text-sm text-muted-foreground">Record a new business expense</p>
            </div>
          </div>
        </div>

        <Card className="border-border">
          <form onSubmit={handleSubmit}>
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor / Payee *</Label>
                  <Input
                    id="vendor"
                    placeholder="e.g., Pet Supply Co"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Payment Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description / Notes</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details about this expense..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
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
                Add Expense
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
