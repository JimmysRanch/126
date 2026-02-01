import { FilterState } from '../types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useState } from 'react'
import { resolveDateRange } from '../filters'

const DATE_PRESETS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7', label: 'Last 7 days' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'last30', label: 'Last 30 days' },
  { value: 'last90', label: 'Last 90 days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'ytd', label: 'Year to date' },
  { value: 'custom', label: 'Custom' }
]

const TIME_BASIS = [
  { value: 'service', label: 'Service Date' },
  { value: 'checkout', label: 'Checkout Date' },
  { value: 'transaction', label: 'Transaction Date' }
]

type FilterSidebarProps = {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onReset: () => void
  options: {
    staff: Array<{ id: string; name: string }>
    services: Array<{ id: string; name: string }>
    categories: string[]
    locations: string[]
    paymentMethods: string[]
  }
}

export const FilterSidebar = ({ filters, onChange, onReset, options }: FilterSidebarProps) => {
  const [showMore, setShowMore] = useState(false)

  const update = (updates: Partial<FilterState>) => {
    onChange({ ...filters, ...updates })
  }

  const toggleList = (key: keyof FilterState, value: string) => {
    const list = new Set(filters[key] as string[])
    if (list.has(value)) {
      list.delete(value)
    } else {
      list.add(value)
    }
    update({ [key]: Array.from(list) } as Partial<FilterState>)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Clear all
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Date Range</Label>
        <Select
          value={filters.datePreset}
          onValueChange={(value) => {
            const preset = value as FilterState['datePreset']
            const range = resolveDateRange(preset)
            update({ datePreset: preset, ...range })
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {DATE_PRESETS.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filters.datePreset === 'custom' && (
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" value={filters.startDate} onChange={(event) => update({ startDate: event.target.value })} />
            <Input type="date" value={filters.endDate} onChange={(event) => update({ endDate: event.target.value })} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Time Basis</Label>
        <Select value={filters.timeBasis} onValueChange={(value) => update({ timeBasis: value as FilterState['timeBasis'] })}>
          <SelectTrigger>
            <SelectValue placeholder="Time basis" />
          </SelectTrigger>
          <SelectContent>
            {TIME_BASIS.map((basis) => (
              <SelectItem key={basis.value} value={basis.value}>
                {basis.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {options.locations.length > 0 && (
        <div className="space-y-2">
          <Label>Location</Label>
          <div className="space-y-1">
            {options.locations.map((location) => (
              <label key={location} className="flex items-center gap-2 text-sm">
                <Checkbox checked={filters.locations.includes(location)} onCheckedChange={() => toggleList('locations', location)} />
                {location}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Staff</Label>
        <div className="space-y-1">
          {options.staff.map((member) => (
            <label key={member.id} className="flex items-center gap-2 text-sm">
              <Checkbox checked={filters.staff.includes(member.id)} onCheckedChange={() => toggleList('staff', member.id)} />
              {member.name}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Services</Label>
        <div className="space-y-1">
          {options.services.map((service) => (
            <label key={service.id} className="flex items-center gap-2 text-sm">
              <Checkbox checked={filters.services.includes(service.id)} onCheckedChange={() => toggleList('services', service.id)} />
              {service.name}
            </label>
          ))}
        </div>
      </div>

      <Collapsible open={showMore} onOpenChange={setShowMore}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            More Filters
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3">
          <div className="space-y-2">
            <Label>Service Categories</Label>
            <div className="space-y-1">
              {options.categories.map((category) => (
                <label key={category} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={filters.serviceCategories.includes(category)}
                    onCheckedChange={() => toggleList('serviceCategories', category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pet Size</Label>
            <div className="space-y-1">
              {['small', 'medium', 'large', 'giant'].map((size) => (
                <label key={size} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={filters.petSizes.includes(size)} onCheckedChange={() => toggleList('petSizes', size)} />
                  {size.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Channel</Label>
            <div className="space-y-1">
              {['walk-in', 'phone', 'online'].map((channel) => (
                <label key={channel} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={filters.channels.includes(channel)} onCheckedChange={() => toggleList('channels', channel)} />
                  {channel}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Client Type</Label>
            <div className="space-y-1">
              {['new', 'returning'].map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={filters.clientTypes.includes(type)} onCheckedChange={() => toggleList('clientTypes', type)} />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Appointment Status</Label>
            <div className="space-y-1">
              {['completed', 'cancelled', 'no-show'].map((status) => (
                <label key={status} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={filters.appointmentStatuses.includes(status)} onCheckedChange={() => toggleList('appointmentStatuses', status)} />
                  {status}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="space-y-1">
              {options.paymentMethods.map((method) => (
                <label key={method} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={filters.paymentMethods.includes(method)} onCheckedChange={() => toggleList('paymentMethods', method)} />
                  {method}
                </label>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Include / Exclude</Label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={filters.includeDiscounts} onCheckedChange={() => update({ includeDiscounts: !filters.includeDiscounts })} />
              Discounts
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={filters.includeRefunds} onCheckedChange={() => update({ includeRefunds: !filters.includeRefunds })} />
              Refunds
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={filters.includeTips} onCheckedChange={() => update({ includeTips: !filters.includeTips })} />
              Tips
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={filters.includeTaxes} onCheckedChange={() => update({ includeTaxes: !filters.includeTaxes })} />
              Taxes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={filters.includeGiftCards} onCheckedChange={() => update({ includeGiftCards: !filters.includeGiftCards })} />
              Gift Card Redemptions
            </label>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
