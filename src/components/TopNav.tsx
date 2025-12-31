import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

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

export function TopNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path))
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  "px-4 py-4 text-sm font-semibold transition-all duration-200 border-b-2 hover:text-primary",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-primary/50"
                )}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
