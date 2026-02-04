/**
 * Report Shell Component
 * Main layout component with filter sidebar and header actions
 */

import { useState, useCallback, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  FunnelSimple,
  FloppyDisk,
  Clock,
  DownloadSimple,
  ShareNetwork,
  Question,
  X,
  CaretDown,
  CalendarBlank,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { ReportFilters, TimeBasis, DateRangePreset } from '../types'
import { useReportFilters } from '../hooks/useReportFilters'

interface ReportShellProps {
  title: string
  description?: string
  defaultTimeBasis?: TimeBasis
  children: ReactNode
  onSaveView?: () => void
  onSchedule?: () => void
  onExport?: () => void
  onShare?: () => void
  onShowDefinitions?: () => void
}

const DATE_RANGE_OPTIONS: { value: DateRangePreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7', label: 'Last 7 Days' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'last30', label: 'Last 30 Days' },
  { value: 'last90', label: 'Last 3 Months' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'ytd', label: 'This Year So Far' },
  { value: 'custom', label: 'Pick Dates...' },
]

const TIME_BASIS_OPTIONS: { value: TimeBasis; label: string; description: string }[] = [
  { value: 'service', label: 'When groomed', description: 'The day the pet was groomed' },
  { value: 'checkout', label: 'When paid', description: 'The day the client paid' },
  { value: 'transaction', label: 'When settled', description: 'The day money hit your bank' },
]

export function ReportShell({
  title,
  description,
  defaultTimeBasis = 'checkout',
  children,
  onSaveView,
  onSchedule,
  onExport,
  onShare,
  onShowDefinitions,
}: ReportShellProps) {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const { filters, setFilter, setFilters, resetFilters, setTimeBasis, setDateRange } = useReportFilters()
  const [filtersOpen, setFiltersOpen] = useState(false)
  
  // Count active filters
  const activeFilterCount = [
    filters.staffIds.length > 0,
    filters.serviceIds.length > 0,
    filters.petSizes.length > 0,
    filters.channels.length > 0,
    filters.clientTypes.length > 0,
    filters.appointmentStatuses.length > 1, // Default is ['completed']
    filters.paymentMethods.length > 0,
    !filters.includeDiscounts,
    !filters.includeRefunds,
    !filters.includeTips,
    !filters.includeTaxes,
    !filters.includeGiftCardRedemptions,
  ].filter(Boolean).length
  
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Date Range */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Time Period
        </Label>
        <Select 
          value={filters.dateRange} 
          onValueChange={(v) => setDateRange(v as DateRangePreset)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGE_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Time Basis */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Count By Date Of
        </Label>
        <Select 
          value={filters.timeBasis} 
          onValueChange={(v) => setTimeBasis(v as TimeBasis)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_BASIS_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                <div>
                  <div>{opt.label}</div>
                  <div className="text-[10px] text-muted-foreground">{opt.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Separator />
      
      {/* Appointment Status */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Show Appointments That Were
        </Label>
        <div className="space-y-1.5">
          {[
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
            { value: 'no-show', label: 'No-shows' },
            { value: 'scheduled', label: 'Upcoming' },
          ].map(status => (
            <div key={status.value} className="flex items-center gap-2">
              <Checkbox 
                id={`status-${status.value}`}
                checked={filters.appointmentStatuses.includes(status.value as any)}
                onCheckedChange={(checked) => {
                  const newStatuses = checked
                    ? [...filters.appointmentStatuses, status.value as any]
                    : filters.appointmentStatuses.filter(s => s !== status.value)
                  setFilter('appointmentStatuses', newStatuses)
                }}
              />
              <Label htmlFor={`status-${status.value}`} className="text-sm">
                {status.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pet Size */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Pet Size
        </Label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { value: 'small', label: 'Small (under 15 lbs)' },
            { value: 'medium', label: 'Medium (15-40 lbs)' },
            { value: 'large', label: 'Large (40-80 lbs)' },
            { value: 'giant', label: 'Giant (80+ lbs)' },
          ].map(size => (
            <div key={size.value} className="flex items-center gap-2">
              <Checkbox 
                id={`size-${size.value}`}
                checked={filters.petSizes.includes(size.value as any)}
                onCheckedChange={(checked) => {
                  const newSizes = checked
                    ? [...filters.petSizes, size.value as any]
                    : filters.petSizes.filter(s => s !== size.value)
                  setFilter('petSizes', newSizes)
                }}
              />
              <Label htmlFor={`size-${size.value}`} className="text-sm">
                {size.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Channel */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          How They Booked
        </Label>
        <div className="space-y-1.5">
          {[
            { value: 'walk-in', label: 'Walk-in' },
            { value: 'phone', label: 'Phone call' },
            { value: 'online', label: 'Online booking' },
          ].map(channel => (
            <div key={channel.value} className="flex items-center gap-2">
              <Checkbox 
                id={`channel-${channel.value}`}
                checked={filters.channels.includes(channel.value as any)}
                onCheckedChange={(checked) => {
                  const newChannels = checked
                    ? [...filters.channels, channel.value as any]
                    : filters.channels.filter(c => c !== channel.value)
                  setFilter('channels', newChannels)
                }}
              />
              <Label htmlFor={`channel-${channel.value}`} className="text-sm">
                {channel.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Client Type */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Client Type
        </Label>
        <div className="space-y-1.5">
          {[
            { value: 'new', label: 'First-time clients' },
            { value: 'returning', label: 'Returning clients' },
          ].map(type => (
            <div key={type.value} className="flex items-center gap-2">
              <Checkbox 
                id={`type-${type.value}`}
                checked={filters.clientTypes.includes(type.value as any)}
                onCheckedChange={(checked) => {
                  const newTypes = checked
                    ? [...filters.clientTypes, type.value as any]
                    : filters.clientTypes.filter(t => t !== type.value)
                  setFilter('clientTypes', newTypes)
                }}
              />
              <Label htmlFor={`type-${type.value}`} className="text-sm">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Payment Method */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          How They Paid
        </Label>
        <div className="space-y-1.5">
          {[
            { value: 'card', label: 'Credit/Debit card' },
            { value: 'cash', label: 'Cash' },
            { value: 'other', label: 'Other (check, gift card, etc.)' },
          ].map(method => (
            <div key={method.value} className="flex items-center gap-2">
              <Checkbox 
                id={`method-${method.value}`}
                checked={filters.paymentMethods.includes(method.value as any)}
                onCheckedChange={(checked) => {
                  const newMethods = checked
                    ? [...filters.paymentMethods, method.value as any]
                    : filters.paymentMethods.filter(m => m !== method.value)
                  setFilter('paymentMethods', newMethods)
                }}
              />
              <Label htmlFor={`method-${method.value}`} className="text-sm">
                {method.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      {/* Include/Exclude Toggles */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Include in Totals
        </Label>
        <div className="space-y-1.5">
          {[
            { key: 'includeDiscounts', label: 'Discounts' },
            { key: 'includeRefunds', label: 'Refunds' },
            { key: 'includeTips', label: 'Tips' },
            { key: 'includeTaxes', label: 'Taxes' },
            { key: 'includeGiftCardRedemptions', label: 'Gift card payments' },
          ].map(toggle => (
            <div key={toggle.key} className="flex items-center gap-2">
              <Checkbox 
                id={toggle.key}
                checked={filters[toggle.key as keyof ReportFilters] as boolean}
                onCheckedChange={(checked) => 
                  setFilter(toggle.key as keyof ReportFilters, checked as any)
                }
              />
              <Label htmlFor={toggle.key} className="text-sm">
                {toggle.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Clear All */}
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={resetFilters}
      >
        <X size={14} className="mr-1" />
        Reset All Filters
      </Button>
    </div>
  )
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {/* Date Range Badge */}
              <Badge variant="outline" className="text-xs">
                <CalendarBlank size={12} className="mr-1" />
                {DATE_RANGE_OPTIONS.find(o => o.value === filters.dateRange)?.label}
              </Badge>
              
              {/* Time Basis Badge */}
              <Badge variant="outline" className="text-xs">
                <Clock size={12} className="mr-1" />
                {TIME_BASIS_OPTIONS.find(o => o.value === filters.timeBasis)?.label}
              </Badge>
              
              {/* Filters Button (Mobile) */}
              {isMobile ? (
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="relative">
                      <FunnelSimple size={14} className="mr-1" />
                      Filter
                      {activeFilterCount > 0 && (
                        <Badge className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh]">
                    <SheetHeader>
                      <SheetTitle>Filter Your Report</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="h-full pr-4 mt-4">
                      <FilterContent />
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="relative">
                      <FunnelSimple size={14} className="mr-1" />
                      Filter
                      {activeFilterCount > 0 && (
                        <Badge className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                          {activeFilterCount}
                        </Badge>
                      )}
                      <CaretDown size={12} className="ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 p-4">
                    <FilterContent />
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {/* Actions */}
              {onSaveView && (
                <Button variant="outline" size="sm" onClick={onSaveView}>
                  <FloppyDisk size={14} className="mr-1" />
                  Save View
                </Button>
              )}
              
              {onSchedule && (
                <Button variant="outline" size="sm" onClick={onSchedule}>
                  <Clock size={14} className="mr-1" />
                  Schedule
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <DownloadSimple size={14} className="mr-1" />
                    Export
                    <CaretDown size={12} className="ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onExport}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onExport}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onShare}>
                    <ShareNetwork size={14} className="mr-2" />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {onShowDefinitions && (
                <Button variant="ghost" size="sm" onClick={onShowDefinitions}>
                  <Question size={14} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full p-4">
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  )
}
