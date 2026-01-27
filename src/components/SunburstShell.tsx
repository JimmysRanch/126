import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, MagnifyingGlass, Sparkle, List, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useState, type ReactNode } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Toaster } from '@/components/ui/sonner'

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

type SunburstShellProps = {
  children: ReactNode
}

export function SunburstShell({ children }: SunburstShellProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const handleNavigation = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sunburst-shell">
        <aside className="sunburst-sidebar hidden md:flex">
          <div className="sunburst-brand">
            <div className="sunburst-logo">
              <Sparkle size={20} weight="fill" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Scruffy Butts</p>
              <p className="text-lg font-semibold">Sunburst Ops</p>
            </div>
          </div>
          <nav className="sunburst-nav">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={cn('sunburst-nav-button', isActive && 'sunburst-nav-button-active')}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>
          <div className="sunburst-side-card">
            <p className="text-sm font-semibold">Today’s Focus</p>
            <p className="text-xs text-muted-foreground mt-1">
              8 grooms scheduled • 3 payments pending • 2 staff on training
            </p>
            <button
              className="sunburst-pill mt-4"
              onClick={() => handleNavigation('/appointments')}
            >
              View Schedule
            </button>
          </div>
        </aside>

        <div className="sunburst-main">
          <header className="sunburst-header">
            <div className="sunburst-header-left">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button className="sunburst-icon-button md:hidden" aria-label="Open navigation">
                    <List size={20} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="sunburst-sheet">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="sunburst-logo">
                        <Sparkle size={18} weight="fill" />
                      </div>
                      <span className="font-semibold">Sunburst Ops</span>
                    </div>
                    <button className="sunburst-icon-button" onClick={() => setOpen(false)}>
                      <X size={18} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {navItems.map((item) => {
                      const isActive =
                        location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.startsWith(item.path))

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.path)}
                          className={cn('sunburst-nav-button', isActive && 'sunburst-nav-button-active')}
                        >
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </SheetContent>
              </Sheet>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Control Center</p>
                <h1 className="text-xl font-semibold">Welcome back, Jamie</h1>
              </div>
            </div>
            <div className="sunburst-header-actions">
              <div className="sunburst-search">
                <MagnifyingGlass size={18} />
                <input placeholder="Search clients, pets, or invoices" />
              </div>
              <button className="sunburst-icon-button" aria-label="Notifications">
                <Bell size={18} />
              </button>
            </div>
          </header>
          <main className="sunburst-content">{children}</main>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
