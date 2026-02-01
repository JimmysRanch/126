import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { TopNav } from '@/components/TopNav'
import { Dashboard } from '@/pages/Dashboard'
import { ClientsList } from '@/pages/ClientsList'
import { ClientProfile } from '@/pages/ClientProfile'
import { AddClient } from '@/pages/AddClient'
import { EditClient } from '@/pages/EditClient'
import { AddPet } from '@/pages/AddPet'
import { EditPet } from '@/pages/EditPet'
import { PaymentHistory } from '@/pages/PaymentHistory'
import { ContactInfo } from '@/pages/ContactInfo'
import { Finances } from '@/pages/Finances'
import { ExpensesDetail } from '@/pages/ExpensesDetail'
import { AllExpenses } from '@/pages/AllExpenses'
import { AddExpense } from '@/pages/AddExpense'
import { RecordPayment } from '@/pages/RecordPayment'
import { FileTaxes } from '@/pages/FileTaxes'
import { RunPayroll } from '@/pages/RunPayroll'
import { Staff } from '@/pages/Staff'
import { StaffProfile } from '@/pages/StaffProfile'
import { StaffPayrollBreakdown } from '@/pages/StaffPayrollBreakdown'
import { EditStaff } from '@/pages/EditStaff'
import { Settings } from '@/pages/Settings'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { ReportsLanding } from '@/pages/reports/ReportsLanding'
import { ReportPage } from '@/pages/reports/ReportPage'
import { Appointments } from '@/pages/Appointments'
import { NewAppointment } from '@/pages/NewAppointment'
import { EditAppointment } from '@/pages/EditAppointment'
import { POS } from '@/pages/POS'
import { Inventory } from '@/pages/Inventory'
import { FinancesStaffPayrollBreakdown } from '@/pages/FinancesStaffPayrollBreakdown'
import { StaffOnboarding } from '@/pages/dev/StaffOnboarding'
import { StaffProfileSetup } from '@/pages/dev/StaffProfileSetup'
import { InviteStaff } from '@/pages/InviteStaff'
import { useEffect, useMemo } from 'react'
import { RecentActivityPage } from '@/pages/RecentActivityPage'
import { useAppearance } from '@/hooks/useAppearance'

function App() {
  const { selectedTheme, selectedUi } = useAppearance()
  const appearanceClasses = useMemo(
    () =>
      [
        selectedTheme !== 'classic' ? `theme-${selectedTheme}` : null,
        selectedUi !== 'classic' ? `ui-${selectedUi}` : null
      ].filter(Boolean) as string[],
    [selectedTheme, selectedUi]
  )

  useEffect(() => {
    const sparkApp = document.getElementById('spark-app')
    if (!sparkApp) {
      return
    }

    const classesToRemove = Array.from(sparkApp.classList).filter(
      (className) => className.startsWith('theme-') || className.startsWith('ui-')
    )
    classesToRemove.forEach((className) => sparkApp.classList.remove(className))
    appearanceClasses.forEach((className) => sparkApp.classList.add(className))
  }, [appearanceClasses])

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <TopNav />
        <div className="flex-1 min-h-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointments/new" element={<NewAppointment />} />
            <Route path="/appointments/:appointmentId/edit" element={<EditAppointment />} />
            <Route path="/messages" element={<PlaceholderPage title="Messages" />} />
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/clients/new" element={<AddClient />} />
            <Route path="/clients/:clientId" element={<ClientProfile />} />
            <Route path="/clients/:clientId/edit" element={<EditClient />} />
            <Route path="/clients/:clientId/add-pet" element={<AddPet />} />
            <Route path="/clients/:clientId/pets/:petId/edit" element={<EditPet />} />
            <Route path="/clients/:clientId/payment-history" element={<PaymentHistory />} />
            <Route path="/clients/:clientId/contact" element={<ContactInfo />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/staff/invite" element={<InviteStaff />} />
            <Route path="/staff/:staffId" element={<StaffProfile />} />
            <Route path="/staff/:staffId/edit" element={<EditStaff />} />
            <Route path="/staff/:staffId/payroll-breakdown" element={<StaffPayrollBreakdown />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/finances" element={<Finances />} />
            <Route path="/finances/expenses" element={<ExpensesDetail />} />
            <Route path="/finances/all-expenses" element={<AllExpenses />} />
            <Route path="/finances/add-expense" element={<AddExpense />} />
            <Route path="/finances/record-payment" element={<RecordPayment />} />
            <Route path="/finances/file-taxes" element={<FileTaxes />} />
            <Route path="/finances/run-payroll" element={<RunPayroll />} />
            <Route path="/finances/staff/:staffId/payroll-breakdown" element={<FinancesStaffPayrollBreakdown />} />
            <Route path="/reports" element={<ReportsLanding />} />
            <Route path="/reports/owner-overview" element={<ReportPage reportId="owner-overview" />} />
            <Route path="/reports/true-profit" element={<ReportPage reportId="true-profit" />} />
            <Route path="/reports/sales-summary" element={<ReportPage reportId="sales-summary" />} />
            <Route path="/reports/finance-recon" element={<ReportPage reportId="finance-recon" />} />
            <Route path="/reports/appointments-capacity" element={<ReportPage reportId="appointments-capacity" />} />
            <Route path="/reports/no-shows" element={<ReportPage reportId="no-shows" />} />
            <Route path="/reports/retention" element={<ReportPage reportId="retention" />} />
            <Route path="/reports/cohorts-ltv" element={<ReportPage reportId="cohorts-ltv" />} />
            <Route path="/reports/staff-performance" element={<ReportPage reportId="staff-performance" />} />
            <Route path="/reports/payroll" element={<ReportPage reportId="payroll" />} />
            <Route path="/reports/service-mix" element={<ReportPage reportId="service-mix" />} />
            <Route path="/reports/inventory" element={<ReportPage reportId="inventory" />} />
            <Route path="/reports/marketing-roi" element={<ReportPage reportId="marketing-roi" />} />
            <Route path="/reports/tips" element={<ReportPage reportId="tips" />} />
            <Route path="/reports/taxes" element={<ReportPage reportId="taxes" />} />
            <Route path="/recent-activity" element={<RecentActivityPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dev/staff-onboarding" element={<StaffOnboarding />} />
            <Route path="/dev/staff-profile-setup" element={<StaffProfileSetup />} />
          </Routes>
        </div>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
