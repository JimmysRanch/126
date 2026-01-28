# UI Surface Map
**Application:** Scruffy Butts - Dog Grooming Management  
**Date:** January 28, 2026  
**Purpose:** Complete inventory of every screen, component, modal, and UI touchpoint

---

## Navigation Structure

### Top-Level Navigation Tabs
| Tab | Route | Purpose |
|-----|-------|---------|
| Dashboard | `/` | Business metrics overview |
| Appointments | `/appointments` | Appointment calendar & scheduling |
| Messages | `/messages` | (Placeholder) Communication center |
| Clients | `/clients` | Client & pet management |
| Staff | `/staff` | Staff management & payroll |
| POS | `/pos` | Point of sale checkout |
| Inventory | `/inventory` | Retail & supply tracking |
| Finances | `/finances` | Financial analytics & reports |
| Reports | `/reports` | (Placeholder) Reporting hub |
| Settings | `/settings` | Business configuration |

---

## Page Inventory

### 1. Dashboard (`/`)
**File:** `/src/pages/Dashboard.tsx`

**Components:**
- **KPI Cards** (4 cards - top row)
  - Revenue Card with mini chart
  - Booked Percentage Card with gauge
  - Clients Card
  - Dogs Groomed Card

- **Analytics Widgets** (middle grid)
  - Groomer Average Card
  - Top Services Card
  - Top Breeds Card
  - Expenses Card
  - Groomer Utilization gauge
  - Groomers Workload bar chart

- **Bottom Row**
  - Booking Heatmap (14-day view)
  - Recent Activity feed (scrollable)

**Key Features:**
- Real-time metric calculations
- Interactive charts (hover states)
- Auto-refresh on data changes
- Strict viewport-locked layout (no page scroll)

---

### 2. Appointments Section

#### 2.1 Appointments Hub (`/appointments`)
**File:** `/src/pages/Appointments.tsx`

**View Modes:**
- **Calendar View** (`/src/components/appointments/CalendarView.tsx`)
  - Month/Week/Day views
  - Color-coded by status
  - Drag-and-drop (future)
  
- **List View** (`/src/components/appointments/ListView.tsx`)
  - Sortable columns
  - Filter by status, groomer, date range
  - Quick status updates
  
- **Groomer View** (`/src/components/appointments/GroomerView.tsx`)
  - Per-groomer schedule
  - Workload balancing view
  - Availability status

**Actions:**
- Create Appointment (opens dialog or navigates to `/appointments/new`)
- View appointment details (opens AppointmentDetailsDialog)
- Edit appointment (navigates to `/appointments/:id/edit`)
- Update status (inline)
- Check in/out appointments

#### 2.2 New Appointment (`/appointments/new`)
**File:** `/src/pages/NewAppointment.tsx`

**Form Sections:**
1. Client & Pet Selection
2. Service Configuration
3. Grooming Preferences
4. Scheduling
5. Drop-off/Pick-up

#### 2.3 Edit Appointment (`/appointments/:appointmentId/edit`)
**File:** `/src/pages/EditAppointment.tsx`

---

### 3. Clients Section

#### 3.1 Clients List (`/clients`)
**File:** `/src/pages/ClientsList.tsx`

#### 3.2 Client Profile (`/clients/:clientId`)
**File:** `/src/pages/ClientProfile.tsx`

**Header Section:**
- Client name & join date
- Action buttons

**Financial Widgets** (5 cards):
1. Total Spent
2. Average Visit Value
3. Visits This Year
4. Last Visit Date
5. No-Show Rate

**Pet Cards with flip animation**

**Tabs:**
- Service History
- Medical Information
- Photo Gallery

#### 3.3 Add Client (`/clients/new`)
**File:** `/src/pages/AddClient.tsx`

#### 3.4 Edit Client (`/clients/:clientId/edit`)
**File:** `/src/pages/EditClient.tsx`

#### 3.5 Add Pet (`/clients/:clientId/add-pet`)
**File:** `/src/pages/AddPet.tsx`

#### 3.6 Edit Pet (`/clients/:clientId/pets/:petId/edit`)
**File:** `/src/pages/EditPet.tsx`

#### 3.7 Payment History (`/clients/:clientId/payment-history`)
**File:** `/src/pages/PaymentHistory.tsx`

#### 3.8 Contact Info (`/clients/:clientId/contact`)
**File:** `/src/pages/ContactInfo.tsx`

---

### 4. Staff Section

#### 4.1 Staff List (`/staff`)
**File:** `/src/pages/Staff.tsx`

**Tabs:**
- Active Staff
- Pending Invitations

#### 4.2 Staff Profile (`/staff/:staffId`)
**File:** `/src/pages/StaffProfile.tsx`

**Sections:**
- Schedule View
- Performance Metrics
- Payroll Summary

#### 4.3 Invite Staff (`/staff/invite`)
**File:** `/src/pages/InviteStaff.tsx`

#### 4.4 Edit Staff (`/staff/:staffId/edit`)
**File:** `/src/pages/EditStaff.tsx`

#### 4.5 Payroll Breakdown (`/staff/:staffId/payroll-breakdown`)
**File:** `/src/pages/StaffPayrollBreakdown.tsx`

---

### 5. Point of Sale (`/pos`)
**File:** `/src/pages/POS.tsx`

**Layout:**
- Left Panel: Available Items
- Right Panel: Cart
- Checkout Section

**Transaction Flow:**
1. Add items to cart
2. Adjust quantities
3. Apply discounts/fees/tips
4. Select payment method
5. Complete transaction

---

### 6. Inventory (`/inventory`)
**File:** `/src/pages/Inventory.tsx`

**Tabs:**
- Inventory Tab (item table)
- Reports Tab (value charts)

**Features:**
- Auto-tracking of value snapshots
- Low stock alerts
- 90-day historical data

---

### 7. Finances Section

#### 7.1 Expenses Detail (`/finances/expenses`)
**File:** `/src/pages/ExpensesDetail.tsx`

#### 7.2 All Expenses (`/finances/all-expenses`)
**File:** `/src/pages/AllExpenses.tsx`

#### 7.3 Add Expense (`/finances/add-expense`)
**File:** `/src/pages/AddExpense.tsx`

#### 7.4 Record Payment (`/finances/record-payment`)
**File:** `/src/pages/RecordPayment.tsx`

#### 7.5 File Taxes (`/finances/file-taxes`)
**File:** `/src/pages/FileTaxes.tsx`

#### 7.6 Run Payroll (`/finances/run-payroll`)
**File:** `/src/pages/RunPayroll.tsx`

---

### 8. Settings (`/settings`)
**File:** `/src/pages/Settings.tsx`

**Sections:**
1. Business Information
2. Services Configuration
3. Payment Methods
4. Positions
5. Weight Ranges
6. Breed List

---

## Shared Components

**Location:** `/src/components/` and `/src/components/ui/`

**Key Reusable Components:**
- Card components (shadcn/ui)
- Form inputs (Input, Select, Checkbox, etc.)
- BreedCombobox (custom autocomplete)
- DatePicker
- Dialog/AlertDialog
- PaymentHistoryDialog
- AppointmentDetailsDialog
- CreateAppointmentDialog
- Table
- Badge
- Avatar
- Toast notifications (sonner)

---

## Modal/Dialog Inventory

| Dialog Name | Trigger | Purpose |
|------------|---------|---------|
| PaymentHistoryDialog | "Payment History" button | Display client transactions |
| AppointmentDetailsDialog | Click appointment | Quick view |
| CreateAppointmentDialog | "Quick Add" button | Fast appointment creation |
| Edit Pet Dialog | Edit icon on pet card | Modify pet details |
| Photo Upload Dialog | Upload button | Add photos |
| Add/Edit Inventory Dialog | Add/Edit buttons | Inventory management |
| Delete Confirmation Dialogs | Delete buttons | Confirm actions |

---

## State Management

### Global State (useKV - persisted)
- `appointments`
- `clients`
- `staff`
- `pending-staff`
- `inventory`
- `inventory-value-history`
- `transactions`
- `payments`
- `expenses`
- `payment-methods`
- `payroll-settings`

### Local State (React useState)
- Form inputs
- Dialog states
- Active tabs
- Filters
- Loading states

---

## Key User Flows

### 1. Book Appointment
1. Navigate to Appointments → New Appointment
2. Select client & pet
3. Choose services (auto-pricing)
4. Pick date/time
5. Assign groomer
6. Submit

### 2. Checkout
1. Navigate to POS
2. Add completed appointment or retail
3. Apply discount/fee/tip
4. Select payment method
5. Complete transaction

### 3. Add Client
1. Navigate to Clients → Add Client
2. Fill client info
3. Add first pet
4. Submit

### 4. Staff Payroll
1. Navigate to Staff → Staff Member → Payroll
2. Select pay period
3. Review earnings breakdown
4. Approve/export

### 5. Inventory Management
1. Navigate to Inventory
2. View stock levels
3. Add/edit items
4. View value reports

---

## Missing/Incomplete Surfaces

1. Multi-Pet Appointment booking (UI exists, logic incomplete)
2. Breed Pricing Editor (strategy selector exists, editor missing)
3. Mixed Pricing Strategy (not implemented)
4. Client Delete function
5. Photo upload persistence (needs base64 conversion)
6. Messages Page (placeholder)
7. Reports Page (placeholder)

---

**Total Pages:** 35+  
**Total Components:** 50+  
**Total Dialogs:** 10+  
**State Stores:** 15+

---

**End of UI Surface Map**
