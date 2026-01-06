import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { TopNav } from '@/components/TopNav'
import { Dashboard } from '@/pages/Dashboard'
import { ClientsList } from '@/pages/ClientsList'
import { ClientProfile } from '@/pages/ClientProfile'
import { AddClient } from '@/pages/AddClient'
import { EditClient } from '@/pages/EditClient'
import { AddPet } from '@/pages/AddPet'
import { PaymentHistory } from '@/pages/PaymentHistory'
import { ContactInfo } from '@/pages/ContactInfo'
import { Finances } from '@/pages/Finances'
import { Staff } from '@/pages/Staff'
import { StaffProfile } from '@/pages/StaffProfile'
import { Settings } from '@/pages/Settings'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { Appointments } from '@/pages/Appointments'
import { POS } from '@/pages/POS'
import { Inventory } from '@/pages/Inventory'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <TopNav />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/messages" element={<PlaceholderPage title="Messages" />} />
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/clients/new" element={<AddClient />} />
          <Route path="/clients/:clientId" element={<ClientProfile />} />
          <Route path="/clients/:clientId/edit" element={<EditClient />} />
          <Route path="/clients/:clientId/add-pet" element={<AddPet />} />
          <Route path="/clients/:clientId/payment-history" element={<PaymentHistory />} />
          <Route path="/clients/:clientId/contact" element={<ContactInfo />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff/:staffId" element={<StaffProfile />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App