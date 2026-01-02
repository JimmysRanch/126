import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { TopNav } from '@/components/TopNav'
import { Dashboard } from '@/pages/Dashboard'
import { ClientsList } from '@/pages/ClientsList'
import { ClientProfile } from '@/pages/ClientProfile'
import { AddClient } from '@/pages/AddClient'
import { Finances } from '@/pages/Finances'
import { Staff } from '@/pages/Staff'
import { StaffProfile } from '@/pages/StaffProfile'
import { Settings } from '@/pages/Settings'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <TopNav />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/appointments" element={<PlaceholderPage title="Appointments" />} />
          <Route path="/messages" element={<PlaceholderPage title="Messages" />} />
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/clients/new" element={<AddClient />} />
          <Route path="/clients/:clientId" element={<ClientProfile />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff/:staffId" element={<StaffProfile />} />
          <Route path="/pos" element={<PlaceholderPage title="POS" />} />
          <Route path="/inventory" element={<PlaceholderPage title="Inventory" />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App