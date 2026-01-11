import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Users, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface StaffMember {
  id: string
  name: string
  role: string
  rate: number
  hours: number
  selected: boolean
}

export function RunPayroll() {
  const navigate = useNavigate()
  const [payrollDate, setPayrollDate] = useState(new Date().toISOString().split('T')[0])
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: '1', name: 'Jessica Anderson', role: 'Lead Groomer', rate: 25.00, hours: 40, selected: true },
    { id: '2', name: 'Michael Chen', role: 'Groomer', rate: 20.00, hours: 35, selected: true },
    { id: '3', name: 'Amanda Rodriguez', role: 'Bather', rate: 15.00, hours: 30, selected: true }
  ])

  const toggleStaff = (id: string) => {
    setStaffMembers(staffMembers.map(staff => 
      staff.id === id ? { ...staff, selected: !staff.selected } : staff
    ))
  }

  const updateHours = (id: string, hours: number) => {
    setStaffMembers(staffMembers.map(staff => 
      staff.id === id ? { ...staff, hours } : staff
    ))
  }

  const calculateGrossPay = (staff: StaffMember) => {
    return staff.rate * staff.hours
  }

  const selectedStaff = staffMembers.filter(s => s.selected)
  const totalPayroll = selectedStaff.reduce((sum, staff) => sum + calculateGrossPay(staff), 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedStaff.length === 0) {
      toast.error('Please select at least one staff member')
      return
    }

    toast.success('Payroll processed successfully')
    navigate('/finances')
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-3 md:p-6">
      <div className="max-w-4xl mx-auto">
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
            <Users size={28} className="text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Run Payroll</h1>
              <p className="text-sm text-muted-foreground">Process payroll for staff members</p>
            </div>
          </div>
        </div>

        <Card className="border-border bg-blue-500/10 mb-4">
          <div className="p-4 flex gap-3">
            <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-500 mb-1">Payroll Information</p>
              <p className="text-muted-foreground">
                Review hours and pay for each staff member. This will record the payroll in the system for tracking purposes.
              </p>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit}>
          <Card className="border-border mb-4">
            <div className="p-4 md:p-6">
              <div className="max-w-xs space-y-2">
                <Label htmlFor="payrollDate">Payroll Date *</Label>
                <Input
                  id="payrollDate"
                  type="date"
                  value={payrollDate}
                  onChange={(e) => setPayrollDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="border-border mb-4">
            <div className="p-4 md:p-6 border-b border-border">
              <h3 className="font-bold">Staff Members</h3>
              <p className="text-sm text-muted-foreground">Select staff and verify hours worked</p>
            </div>
            <div className="divide-y divide-border">
              {staffMembers.map((staff) => (
                <div key={staff.id} className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      id={`staff-${staff.id}`}
                      checked={staff.selected}
                      onCheckedChange={() => toggleStaff(staff.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <label htmlFor={`staff-${staff.id}`} className="font-medium text-base cursor-pointer">
                            {staff.name}
                          </label>
                          <p className="text-sm text-muted-foreground">{staff.role} • ${staff.rate.toFixed(2)}/hr</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="space-y-1">
                            <Label htmlFor={`hours-${staff.id}`} className="text-xs text-muted-foreground">Hours Worked</Label>
                            <Input
                              id={`hours-${staff.id}`}
                              type="number"
                              step="0.5"
                              min="0"
                              value={staff.hours}
                              onChange={(e) => updateHours(staff.id, parseFloat(e.target.value) || 0)}
                              disabled={!staff.selected}
                              className="w-24"
                            />
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">Gross Pay</p>
                            <p className="text-lg font-bold">${calculateGrossPay(staff).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-border bg-muted/50 mb-4">
            <div className="p-4 md:p-6">
              <h3 className="font-bold mb-4">Payroll Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Staff Members Selected:</span>
                  <span className="font-medium">{selectedStaff.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Hours:</span>
                  <span className="font-medium">{selectedStaff.reduce((sum, s) => sum + s.hours, 0).toFixed(1)}</span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between">
                  <span className="font-bold text-lg">Total Gross Payroll:</span>
                  <span className="font-bold text-2xl">${totalPayroll.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-col-reverse md:flex-row gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/finances')}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2" disabled={selectedStaff.length === 0}>
              <Users size={18} />
              Process Payroll
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
