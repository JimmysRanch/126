import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { List, CaretDown } from '@phosphor-icons/react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/' },
  { id: 'appointments', label: 'Appointments', path: '/appointments' },
  { id: 'messages', label: 'Messages', path: '/messages' },
  { id: 'clients', label: 'Clients', path: '/clients' },
  { id: 'staff', label: 'Staff', path: '/staff' },
  { id: 'pos', label: 'POS', path: '/pos' },
  { id: 'inventory', label: 'Inventory', path: '/inventory' },
  { id: 'finances', label: 'Finances', path: '/finances' },
  { id: 'reports', label: 'Reports', path: '/reports' },
  { id: 'settings', label: 'Settings', path: '/settings' },
]

const devPages = [
  { id: 'staff-onboarding', label: 'Staff Onboarding', path: '/dev/staff-onboarding' },
  { id: 'staff-profile-setup', label: 'Staff Profile', path: '/dev/staff-profile-setup' },
]

export function TopNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const handleNavigation = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  const isDevPageActive = devPages.some(page => location.pathname.startsWith(page.path))

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        
        <div className="md:hidden flex items-center justify-between h-14">
          <div className="text-lg font-bold text-primary">Scruffy Butts</div>
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <List size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || 
                    (item.path !== '/' && location.pathname.startsWith(item.path))
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-lg text-left",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </button>
                  )
                })}
                
                <div className="border-t border-border my-2" />
                <div className="text-xs font-semibold text-muted-foreground px-4 py-2">Dev Pages</div>
                {devPages.map((item) => {
                  const isActive = location.pathname === item.path
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-lg text-left",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path))
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "px-4 py-4 text-sm font-semibold transition-all duration-200 border-b-2 hover:text-primary whitespace-nowrap",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-primary/50"
                )}
              >
                {item.label}
              </button>
            )
          })}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "px-4 py-4 text-sm font-semibold transition-all duration-200 border-b-2 hover:text-primary whitespace-nowrap flex items-center gap-1",
                  isDevPageActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-primary/50"
                )}
              >
                Dev Pages
                <CaretDown size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {devPages.map((page) => (
                <DropdownMenuItem
                  key={page.id}
                  onClick={() => navigate(page.path)}
                  className={cn(
                    "cursor-pointer",
                    location.pathname === page.path && "bg-accent"
                  )}
                >
                  {page.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
