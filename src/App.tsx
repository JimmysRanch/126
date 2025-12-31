import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { TopNav } from '@/components/TopNav'
import { Dashboard } from '@/pages/Dashboard'
import { ClientsList } from '@/pages/ClientsList'
import { ClientProfile } from '@/pages/ClientProfile'
import { AddClient } from '@/pages/AddClient'
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
          <Route path="/staff" element={<PlaceholderPage title="Staff" />} />
          <Route path="/pos" element={<PlaceholderPage title="POS" />} />
          <Route path="/inventory" element={<PlaceholderPage title="Inventory" />} />
          <Route path="/finances" element={<PlaceholderPage title="Finances" />} />
          <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App