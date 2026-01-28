# Touchpoint Matrix
**Application:** Scruffy Butts - Dog Grooming Management  
**Date:** January 28, 2026  
**Purpose:** Complete CRUD operation mapping with validations and side effects

---

## Matrix Format

For each entity, we document:
- **Operation** (Create/Read/Update/Delete)
- **UI Location** (page/component)
- **Trigger** (user action)
- **Validations** (business rules)
- **Side Effects** (what else happens)
- **Storage** (KV key used)

---

## 1. CLIENT Entity

### CREATE

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/AddClient.tsx` |
| **Route** | `/clients/new` |
| **Trigger** | User clicks "Add Client" button → fills form → clicks "Save" |
| **Form Fields** | firstName, lastName, email, phone, address (street, city, state, zip), referralSource, pets[] |
| **Validations** | - All client fields required (lines 195-230)<br>- Email format validation<br>- At least 1 pet required<br>- Pet name, breed, weight required (lines 232-255)<br>- Breed must be from approved list |
| **Business Rules** | - Generate unique ID: `Date.now().toString()`<br>- Auto-set joinedDate to current date<br>- Weight auto-calculates weightCategory |
| **Side Effects** | 1. Create Client entity<br>2. Auto-create associated Pet entities with `ownerId` reference (lines 266-276)<br>3. Toast success notification (line 296)<br>4. Navigate to client profile page |
| **Storage** | `useKV<Client[]>("clients", [])` |
| **Code Pattern** | `setClients((current) => [...(current || []), newClient])` |

### READ (List)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/ClientsList.tsx` |
| **Route** | `/clients` |
| **Trigger** | Navigate to Clients tab |
| **Data Source** | `const [clients] = useKV<Client[]>("clients", [])` |
| **Features** | - Search by name, pet, breed, email<br>- Grid display of client cards<br>- Click card → navigate to profile |
| **Calculations** | - Total spent (sum of transactions)<br>- Visit count (completed appointments)<br>- Last visit date |

### READ (Detail)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/ClientProfile.tsx` |
| **Route** | `/clients/:clientId` |
| **Trigger** | Click client card or navigate via URL |
| **Data Loading** | - Load client by ID<br>- Load associated pets<br>- Load appointments (past & future)<br>- Load transactions |
| **Displays** | - Client info header<br>- Financial widgets (5 metrics)<br>- Pet cards (grid with flip animation)<br>- Tabs: Service History, Medical Info, Photos |

### UPDATE

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/EditClient.tsx` |
| **Route** | `/clients/:clientId/edit` |
| **Trigger** | Click "Edit" button on client profile |
| **Pre-fill** | Load existing client data on mount (lines 32-61) |
| **Validations** | Same as CREATE |
| **Code Pattern** | `setClients((current) => current.map(c => c.id === clientId ? updatedClient : c))` |
| **Side Effects** | 1. Update client entity<br>2. Toast success notification<br>3. Navigate back to profile |
| **Storage** | Same `clients` KV store |

### DELETE

| Field | Details |
|-------|---------|
| **UI Location** | **Not implemented** |
| **Status** | Missing feature |
| **Notes** | No UI for deleting clients exists |

---

## 2. PET Entity

### CREATE (Standalone)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/AddPet.tsx` |
| **Route** | `/clients/:clientId/add-pet` |
| **Trigger** | Click "Add Pet" button on client profile |
| **Form Fields** | name, breed, birthday, gender, weight, color, temperament, specialNotes |
| **Validations** | - Name, breed, weight required<br>- Weight > 0<br>- Breed from approved list |
| **Business Rules** | - Generate unique ID<br>- Auto-assign `ownerId` from route param<br>- Auto-calculate `weightCategory` from weight |
| **Side Effects** | 1. Add pet to parent client's `pets[]` array<br>2. Update client entity<br>3. Toast notification<br>4. Navigate to client profile |
| **Storage** | Updates `clients` KV store (pets nested in client) |

### CREATE (With Client)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/AddClient.tsx` (inline) |
| **Trigger** | Part of Add Client flow |
| **Details** | Same validations, created with client in single operation (lines 266-276) |

### READ

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/ClientProfile.tsx` |
| **Trigger** | View client profile |
| **Display** | - Pet cards in grid (2-3 per row)<br>- Flip animation to show grooming preferences<br>- Medical info in tabs<br>- Service history per pet |

### UPDATE

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/EditPet.tsx` |
| **Route** | `/clients/:clientId/pets/:petId/edit` |
| **Trigger** | Click edit icon on pet card |
| **Validations** | Same as CREATE (lines 85-96) |
| **Code Pattern** | Navigate to parent client → find pet in `pets[]` → update |
| **Side Effects** | 1. Update pet in client's `pets[]` array<br>2. Toast notification |
| **Storage** | Updates `clients` KV store |
| **Status** | **Incomplete** - Updates not persisting to KV (TODO in code) |

### DELETE/DEACTIVATE

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/EditPet.tsx` |
| **Function** | `handleDeactivate()` (lines 122-127) |
| **Trigger** | Click "Deactivate Pet" button |
| **Business Rules** | - Set `isActive = false` (soft delete)<br>- Pet no longer appears in appointment booking |
| **Side Effects** | 1. Update pet status<br>2. Toast notification<br>3. Navigate back to client profile |

---

## 3. APPOINTMENT Entity

### CREATE (Dialog)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/components/appointments/CreateAppointmentDialog.tsx` |
| **Trigger** | Click "Quick Add" or similar button |
| **Form Fields** | clientId, petId, date, startTime, endTime, services[], addOns[], notes |
| **Validations** | - Client, pet, date, time required (lines 144-157)<br>- Start time within business hours (lines 149-152)<br>- Services array not empty |
| **Business Rules** | 1. **Auto-Groomer Assignment** (lines 133-141):<br>&nbsp;&nbsp;&nbsp;- Count appointments per groomer<br>&nbsp;&nbsp;&nbsp;- Assign to groomer with lowest count<br>2. **Auto-Price Calculation** (lines 75-97):<br>&nbsp;&nbsp;&nbsp;- Main service priced by pet weight category<br>&nbsp;&nbsp;&nbsp;- Add-ons: size-based OR flat price<br>&nbsp;&nbsp;&nbsp;- Sum all prices |
| **Side Effects** | 1. Create appointment with status "scheduled"<br>2. Toast success notification<br>3. Close dialog<br>4. Refresh appointments list |
| **Storage** | `useKV<Appointment[]>("appointments", [])` |
| **Code Pattern** | `setAppointments((current) => [...(current || []), newAppointment])` |

### CREATE (Full Page)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/NewAppointment.tsx` |
| **Route** | `/appointments/new` |
| **Trigger** | Click "New Appointment" from Appointments page |
| **Additional Fields** | groomingPreferences, dropOffTime, pickUpTime, photoWant, requestedGroomer |
| **Validations** | Same as dialog + business hours validation |
| **Side Effects** | Same as dialog |
| **Issue** | - Multi-pet selection UI exists but form submission only handles single pet<br>- Photo upload not persisted (File object, needs base64 conversion) |

### READ (Calendar)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/components/appointments/CalendarView.tsx` |
| **Trigger** | View Appointments page → Calendar tab |
| **Data Source** | `const [appointments] = useKV<Appointment[]>("appointments", [])` |
| **Features** | - Month/Week/Day views<br>- Color-coded by status<br>- Click appointment → open details dialog |

### READ (List)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/components/appointments/ListView.tsx` |
| **Trigger** | View Appointments page → List tab |
| **Features** | - Sortable columns<br>- Filter by status, groomer, date<br>- Inline status updates |

### READ (Groomer View)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/components/appointments/GroomerView.tsx` |
| **Trigger** | View Appointments page → Groomer tab |
| **Features** | - Per-groomer schedule<br>- Workload distribution<br>- Availability status |

### READ (Details)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/components/appointments/AppointmentDetailsDialog.tsx` |
| **Trigger** | Click appointment in calendar or list |
| **Displays** | - Full appointment info<br>- Client & pet details<br>- Services & pricing<br>- Status & notes |

### UPDATE

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/EditAppointment.tsx` |
| **Route** | `/appointments/:appointmentId/edit` |
| **Trigger** | Click "Edit" on appointment details |
| **Validations** | Same as CREATE |
| **Business Rules** | - Recalculate price if services change (lines 86-150)<br>- Cannot edit past appointments (future enhancement) |
| **Code Pattern** | `setAppointments((current) => current.map(apt => apt.id === id ? updated : apt))` |
| **Side Effects** | 1. Update appointment<br>2. Toast notification<br>3. Navigate back to appointments |

### UPDATE (Status Only)

| Field | Details |
|-------|---------|
| **UI Location** | Inline in ListView, AppointmentDetailsDialog |
| **Trigger** | Click status dropdown or button |
| **Status Flow** | scheduled → checked-in → in-progress → completed → paid |
| **Business Rules** | - Only completed appointments can be checked out in POS<br>- Status "cancelled" ends workflow |
| **Side Effects** | 1. Update appointment status<br>2. Refresh UI |

### DELETE/CANCEL

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/EditAppointment.tsx` |
| **Trigger** | Click "Cancel Appointment" button |
| **Business Rules** | - Set status to "cancelled"<br>- Appointment remains in system (soft delete) |
| **Code Pattern** | `apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt` |
| **Side Effects** | 1. Update status<br>2. Free up groomer slot<br>3. Toast notification |

---

## 4. STAFF Entity

### CREATE (Invite)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/InviteStaff.tsx` |
| **Route** | `/staff/invite` |
| **Trigger** | Click "Invite Staff" button |
| **Form Fields** | email, role, specialties, compensation (type, rate, etc.) |
| **Validations** | - Email format (line 25)<br>- Role required<br>- Compensation type required |
| **Business Rules** | 1. Create PendingStaff record with status "pending"<br>2. Simulate email send (1s timeout)<br>3. Staff receives "setup instructions" |
| **Side Effects** | 1. Add to `pending-staff` KV store (lines 24-50)<br>2. Toast notification (line 43)<br>3. Navigate to Staff list |
| **Storage** | `useKV<PendingStaff[]>("pending-staff", [])` |
| **Integration** | **Email:** Simulated only (setTimeout) - NO real email API |

### CREATE (Accept Invite)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/dev/StaffOnboarding.tsx` (dev page) |
| **Trigger** | Staff clicks link in email (simulated) |
| **Flow** | 1. Staff fills profile info<br>2. PendingStaff → Staff entity<br>3. Remove from pending-staff<br>4. Add to staff |
| **Status** | **Placeholder** - Onboarding flow incomplete |

### READ (List)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/Staff.tsx` |
| **Route** | `/staff` |
| **Trigger** | Navigate to Staff tab |
| **Tabs** | 1. Active Staff (from `staff` KV)<br>2. Pending Invitations (from `pending-staff` KV) |
| **Displays** | - Staff cards with photo, name, role<br>- Quick stats (appointments, rating) |

### READ (Profile)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/StaffProfile.tsx` |
| **Route** | `/staff/:staffId` |
| **Trigger** | Click staff card |
| **Displays** | - Staff info header<br>- Schedule view<br>- Performance metrics<br>- Payroll summary |

### UPDATE

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/EditStaff.tsx` |
| **Route** | `/staff/:staffId/edit` |
| **Trigger** | Click "Edit" on staff profile |
| **Validations** | Same as CREATE |
| **Code Pattern** | `setStaff((current) => current.map(s => s.id === id ? updated : s))` |
| **Side Effects** | 1. Update staff entity<br>2. Toast notification |

### DELETE (Cancel Invite)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/Staff.tsx` |
| **Function** | `confirmCancelInvite()` (lines 69-88) |
| **Trigger** | Click "Cancel" on pending invitation |
| **Code Pattern** | `(current || []).filter((staff) => staff.id !== staffToCancel)` |
| **Side Effects** | 1. Remove from pending-staff<br>2. Toast notification |
| **Storage** | Updates `pending-staff` KV store |

---

## 5. TRANSACTION Entity

### CREATE (POS Checkout)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/POS.tsx` |
| **Route** | `/pos` |
| **Trigger** | User adds items to cart → applies discount/fees/tip → clicks "Complete Transaction" |
| **Form Fields** | items[], subtotal, discount, additionalFees, tipAmount, paymentMethod |
| **Validations** | - Cart not empty (line 110)<br>- Payment method selected (line 115)<br>- Tip amount >= 0 (line 119)<br>- Discount <= subtotal |
| **Business Rules** | 1. **Calculate totals:**<br>&nbsp;&nbsp;&nbsp;subtotal = sum(items)<br>&nbsp;&nbsp;&nbsp;total = subtotal - discount + fees<br>2. **Transaction type:**<br>&nbsp;&nbsp;&nbsp;- Appointment only: "service"<br>&nbsp;&nbsp;&nbsp;- Retail only: "retail"<br>&nbsp;&nbsp;&nbsp;- Mixed: "mixed" |
| **Side Effects** | 1. Create transaction record (lines 125-143)<br>2. **Update appointment** with tip info (lines 147-159):<br>&nbsp;&nbsp;&nbsp;`tipAmount`, `tipPaymentMethod`, status: "paid"<br>3. **Inventory decrement** (lines 161-166) - **TODO not implemented**<br>4. Toast success notification<br>5. Reset cart (lines 170-183)<br>6. Navigate to receipt or transactions |
| **Storage** | `useKV<Transaction[]>("transactions", [])` |
| **Code Pattern** | `setTransactions((current) => [...(current || []), newTransaction])` |

### CREATE (Manual Payment)

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/RecordPayment.tsx` |
| **Route** | `/finances/record-payment` |
| **Trigger** | Click "Record Payment" button |
| **Form Fields** | client, service, amount, tip, paymentMethod, date |
| **Validations** | - Amount > 0 (line 38)<br>- Client required<br>- Payment method required |
| **Side Effects** | 1. Create PaymentDetail record (lines 35-57)<br>2. Toast notification |
| **Storage** | `useKV<PaymentDetail[]>("payments", [])` |
| **Note** | Creates PaymentDetail, NOT Transaction (separate entity) |

### READ

| Field | Details |
|-------|---------|
| **UI Location** | - `/src/pages/PaymentHistory.tsx` (client-specific)<br>- Finances section (all transactions) |
| **Trigger** | Click "Payment History" on client profile OR view Finances |
| **Displays** | - Transaction list<br>- Filter by date, client, type<br>- Breakdown by pet & service<br>- Payment method & tip |

### UPDATE

| Field | Details |
|-------|---------|
| **UI Location** | **Not implemented** |
| **Status** | No UI for editing completed transactions |
| **Notes** | Transactions are immutable after creation (audit trail) |

### DELETE/REFUND

| Field | Details |
|-------|---------|
| **UI Location** | **Not implemented** |
| **Status** | Refund logic exists in data model (`status: "refunded"`) but no UI |

---

## 6. INVENTORY Entity

### CREATE

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/Inventory.tsx` |
| **Trigger** | Click "Add Item" button → fill form → save |
| **Form Fields** | name, category, sku, quantity, price, cost, reorderLevel, supplier, staffCompensation |
| **Validations** | - Name, SKU, quantity, cost required (line 141)<br>- Quantity >= 0<br>- Price >= 0<br>- Cost >= 0 |
| **Business Rules** | 1. Generate unique ID<br>2. Category: "retail" or "supply"<br>3. Staff compensation optional (percentage or fixed) |
| **Side Effects** | 1. Add to inventory array (lines 140-175)<br>2. **Auto-create InventoryValueSnapshot** (lines 44-80):<br>&nbsp;&nbsp;&nbsp;- Calculate totalValue, retailValue, supplyValue, profit<br>&nbsp;&nbsp;&nbsp;- Only save if value changed >$0.01 OR >24hrs since last<br>&nbsp;&nbsp;&nbsp;- Keep 90-day history<br>3. Toast notification |
| **Storage** | `useKV<InventoryItem[]>("inventory", [])` |
| **Code Pattern** | `setInventory((current) => [...(current || []), itemData])` |

### READ

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/Inventory.tsx` |
| **Trigger** | Navigate to Inventory tab |
| **Features** | - Search by name/SKU<br>- Filter by category (All/Retail/Supplies)<br>- Sort by any column<br>- Low stock indicators (red/yellow/green) |
| **Displays** | - Item table with all fields<br>- Value summary cards (top)<br>- Reports tab (charts) |

### UPDATE

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/Inventory.tsx` |
| **Trigger** | Click "Edit" icon on item row → modal opens → update fields → save |
| **Validations** | Same as CREATE |
| **Code Pattern** | `(current || []).map(item => item.id === editingItem.id ? itemData : item)` (lines 164-167) |
| **Side Effects** | 1. Update item<br>2. **Auto-create InventoryValueSnapshot** (if value changed)<br>3. Toast notification |

### DELETE

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/Inventory.tsx` |
| **Function** | `handleDelete()` (lines 177-182) |
| **Trigger** | Click "Delete" icon → confirm dialog → delete |
| **Code Pattern** | `(current || []).filter(item => item.id !== id)` |
| **Side Effects** | 1. Remove item<br>2. **Auto-create InventoryValueSnapshot**<br>3. Toast notification |

---

## 7. EXPENSE Entity

### CREATE

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/AddExpense.tsx` |
| **Route** | `/finances/add-expense` |
| **Trigger** | Click "Add Expense" button |
| **Form Fields** | category, vendor, amount, date, status, description |
| **Validations** | - Amount > 0<br>- Category required<br>- Vendor required |
| **Side Effects** | 1. Create expense record<br>2. Toast notification<br>3. Navigate to expenses list |
| **Storage** | `useKV<ExpenseRecord[]>("expenses", [])` |

### READ

| Field | Details |
|-------|---------|
| **UI Location** | - `/src/pages/ExpensesDetail.tsx` (summary)<br>- `/src/pages/AllExpenses.tsx` (full list) |
| **Trigger** | Navigate to Finances → Expenses |
| **Displays** | - Summary cards (total, average, largest)<br>- Pie chart by category<br>- Recent expenses list<br>- Filter by status |

### UPDATE

| Field | Details |
|-------|---------|
| **UI Location** | **Not explicitly implemented** |
| **Status** | Likely inline editing or edit form needed |

### DELETE

| Field | Details |
|-------|---------|
| **UI Location** | **Not implemented** |

---

## 8. SETTINGS Configuration

### Business Settings

| Field | Details |
|-------|---------|
| **UI Location** | `/src/pages/Settings.tsx` |
| **Route** | `/settings` |
| **Sections** | Business Info, Services, Payment Methods, Positions, Weight Ranges, Breed List |
| **Storage** | Multiple KV keys:<br>- `business-settings`<br>- `services`<br>- `add-ons`<br>- `payment-methods`<br>- `positions`<br>- `weight-ranges`<br>- `breed-list` |
| **Validations** | - Business name required<br>- Timezone required<br>- Hours of operation valid times |
| **Side Effects** | - Updated settings affect pricing, scheduling, payment options<br>- Toast notifications per section |

---

## Side Effects Summary

### Cascading Operations

| Primary Action | Side Effect 1 | Side Effect 2 | Side Effect 3 |
|----------------|---------------|---------------|---------------|
| **Create Client** | Create associated Pets | Navigate to profile | Toast notification |
| **Create Appointment** | Auto-assign groomer | Calculate price | Update groomer workload |
| **POS Checkout** | Create Transaction | Update Appointment (tip, status) | **[TODO]** Decrement Inventory |
| **Add/Edit/Delete Inventory** | Auto-create ValueSnapshot | Update value charts | Low stock check |
| **Invite Staff** | Create PendingStaff | **[Simulated]** Send email | Toast notification |
| **Cancel Appointment** | Update status | Free groomer slot | **[TODO]** Notify client |

### Auto-Calculations

| Entity | Calculation | Trigger | Location |
|--------|-------------|---------|----------|
| Pet | `weightCategory` | Weight input | `getWeightCategory()` in types.ts |
| Appointment | `totalPrice` | Services selected | CreateAppointmentDialog, lines 75-97 |
| Transaction | `total` | Cart changes | POS.tsx, real-time |
| Inventory | Value metrics | Item added/edited/deleted | Inventory.tsx, lines 44-80 |
| Payroll | Gross pay | End of period | payroll-utils.ts calculations |

---

## Validation Summary

### Form-Level Validations

| Entity | Required Fields | Format Validations | Business Logic |
|--------|----------------|-------------------|----------------|
| Client | firstName, lastName, email, phone, address | Email regex | At least 1 pet |
| Pet | name, breed, weight | Weight > 0 | Breed from approved list |
| Appointment | client, pet, date, time, services | Time format (HH:MM) | Within business hours |
| Staff | name, email, role, compensation | Email regex | Compensation type valid |
| Transaction | items, paymentMethod | Amount >= 0 | Cart not empty |
| Inventory | name, sku, quantity, cost | Numeric >= 0 | SKU unique (implied) |
| Expense | category, vendor, amount | Amount > 0 | - |

### Cross-Entity Validations

| Validation | Rule | Where Checked |
|------------|------|---------------|
| Foreign Keys | Client, Pet, Staff must exist | Appointment creation |
| Groomer Availability | Cannot double-book | **[TODO]** Not implemented |
| Business Hours | Appointments within hours | isTimeWithinBusinessHours() |
| Inventory Stock | Quantity >= 0 | **[TODO]** POS checkout |
| Payment Method | Must be enabled | POS checkout |

---

## Missing Validations/Side Effects

### Incomplete Features

1. **Photo Uploads:**
   - Current: File objects stored in state
   - Missing: Convert to base64 data URLs for persistence

2. **Inventory Decrement:**
   - Current: Comment placeholder in POS.tsx (lines 161-166)
   - Missing: Subtract sold quantities from inventory

3. **Multi-Pet Appointments:**
   - Current: UI allows multi-select
   - Missing: Form submission handles only single pet

4. **Groomer Double-Booking:**
   - Current: Auto-assigns to lowest count
   - Missing: Check time slot availability

5. **Client Notifications:**
   - Current: Email invite simulated
   - Missing: Appointment confirmations, reminders

6. **Breed Pricing:**
   - Current: Strategy selector exists
   - Missing: UI to configure breed-specific pricing

7. **Mixed Pricing:**
   - Current: Strategy option exists
   - Missing: Implementation logic

---

## Error Handling Patterns

### Current Pattern
```typescript
try {
  // Validation
  if (!field) {
    toast.error("Field required")
    return
  }
  
  // Business logic
  if (!businessRule) {
    toast.error("Business rule violated")
    return
  }
  
  // Perform operation
  setData((current) => [...current, newItem])
  
  // Success feedback
  toast.success("Operation successful")
  
  // Navigate away
  navigate('/destination')
  
} catch (error) {
  toast.error("Operation failed")
}
```

### Missing Error Handling
- Network errors (N/A - no backend)
- Concurrent modifications (useKV race conditions)
- Storage quota exceeded (localStorage limits)
- Invalid state transitions (appointment status flow)

---

## Persistence Patterns

### useKV Pattern (All Entities)

**Create:**
```typescript
setData((current) => [...(current || []), newItem])
```

**Update:**
```typescript
setData((current) => 
  (current || []).map(item => 
    item.id === targetId ? updatedItem : item
  )
)
```

**Delete:**
```typescript
setData((current) => 
  (current || []).filter(item => item.id !== targetId)
)
```

**Issue:** Direct value usage instead of functional updates in some locations (AUDIT_REPORT.md Issue #2)

---

**Total Operations Documented:** 50+ CRUD operations  
**Total Validations:** 30+ validation rules  
**Total Side Effects:** 20+ cascading operations

---

**End of Touchpoint Matrix**
