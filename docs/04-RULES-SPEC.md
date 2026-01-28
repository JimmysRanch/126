# Rules Specification
**Application:** Scruffy Butts - Dog Grooming Management  
**Date:** January 28, 2026  
**Purpose:** Complete specification of business rules, calculations, and constraints

---

## 1. PRICING RULES

### 1.1 Weight-Based Service Pricing

**Source:** `/src/lib/types.ts` lines 163-172

**Weight Categories:**
| Category | Weight Range | Used For |
|----------|-------------|----------|
| Small | 0-25 lbs | Pricing tier 1 |
| Medium | 26-50 lbs | Pricing tier 2 |
| Large | 51-80 lbs | Pricing tier 3 |
| Giant | 81+ lbs | Pricing tier 4 |

**Calculation Logic:**
```typescript
function getWeightCategory(weight: number): WeightCategory {
  if (weight <= 25) return "small"
  if (weight <= 50) return "medium"
  if (weight <= 80) return "large"
  return "giant"
}
```

**Price Lookup:**
```typescript
function getPriceForWeight(pricing: PricingTier, category: WeightCategory) {
  return pricing[category]  // Returns number
}
```

**Example Service Pricing:**
```typescript
{
  name: "Full Groom",
  pricing: {
    small: 45.00,
    medium: 65.00,
    large: 85.00,
    giant: 110.00
  }
}
```

**Rule:** Pet weight determines which price tier applies. Weight is entered once during pet creation and auto-categorized.

---

### 1.2 Add-On Pricing

**Source:** `/src/lib/types.ts` lines 43-49

**Two Pricing Models:**

1. **Flat Price** (size-independent):
   ```typescript
   {
     name: "Teeth Brushing",
     price: 15.00,
     hasSizePricing: false
   }
   ```

2. **Size-Based Price** (weight-dependent):
   ```typescript
   {
     name: "Flea Treatment",
     hasSizePricing: true,
     pricing: {
       small: 20.00,
       medium: 30.00,
       large: 40.00,
       giant: 50.00
     }
   }
   ```

**Rule:** Add-ons with `hasSizePricing: true` use pet weight category; otherwise use flat `price`.

---

### 1.3 Total Appointment Price

**Source:** `/src/components/appointments/CreateAppointmentDialog.tsx` lines 75-97

**Calculation:**
```typescript
const mainServicePrice = getPriceForWeight(
  mainService.pricing, 
  pet.weightCategory
)

const addOnsTotal = addOns.reduce((sum, addOn) => {
  if (addOn.hasSizePricing) {
    return sum + getPriceForWeight(addOn.pricing, pet.weightCategory)
  }
  return sum + addOn.price
}, 0)

const totalPrice = mainServicePrice + addOnsTotal
```

**Rule:** Total = Main Service (by weight) + Sum of Add-Ons (by weight or flat)

**Example:**
- Pet: 30 lbs → Medium category
- Full Groom: $65 (medium)
- Teeth Brushing: $15 (flat)
- Flea Treatment: $30 (medium)
- **Total: $110**

---

### 1.4 Pricing Strategy (Future)

**Source:** `/src/pages/Settings.tsx` (implied)

**Strategies:**
1. **Weight-Based** (current implementation)
2. **Breed-Based** (UI exists, logic missing)
3. **Mixed** (UI exists, logic missing)

**Status:** Only weight-based pricing is fully implemented.

---

## 2. DISCOUNT & FEE RULES

### 2.1 Transaction Discounts

**Source:** `/src/pages/POS.tsx` lines 109-171

**Types:**
- **Dollar Amount:** Fixed reduction (e.g., $10 off)
- **Percentage:** Percentage of subtotal (e.g., 10% off)

**Rules:**
1. Discount applied to subtotal only (before fees/tips)
2. Discount cannot exceed subtotal
3. Discount >= 0
4. Applied once per transaction

**Calculation:**
```typescript
const total = subtotal - discount + additionalFees.amount
```

**Example:**
- Subtotal: $100
- Discount: $10
- Additional Fees: $5
- **Total: $95**

---

### 2.2 Additional Fees

**Source:** `/src/pages/POS.tsx`

**Fields:**
- `amount`: Number (>= 0)
- `description`: String (optional, for receipt)

**Rules:**
1. Added to subtotal after discount
2. No limit on fee amount
3. Single fee per transaction (current implementation)
4. Description recommended for transparency

**Common Fees:**
- Rush service fee
- Holiday surcharge
- Special handling fee

---

### 2.3 Tips

**Source:** `/src/pages/POS.tsx` lines 138-139, 147-159

**Rules:**
1. Tip >= 0
2. Applied after all other calculations
3. Does NOT affect subtotal or total in transaction
4. Tracked separately with payment method (cash/card)
5. **Updated on appointment entity** after checkout

**Calculation:**
```typescript
// Transaction total does NOT include tip
const transactionTotal = subtotal - discount + fees

// Tip tracked separately
const tipAmount = tipInput  // User entered
const tipPaymentMethod = "cash" | "card"
```

**Appointment Update:**
```typescript
appointment.tipAmount = tipAmount
appointment.tipPaymentMethod = tipPaymentMethod
appointment.status = "paid"
```

**Rule:** Tips are NOT part of transaction total but ARE part of staff payroll calculations.

---

## 3. TAX RULES

**Status:** Tax handling is **NOT implemented**

**Observations:**
- No tax rate configuration in Settings
- No tax calculation in POS
- No tax line item in transactions
- FileTaxes page exists but is placeholder

**Future Requirements:**
- Sales tax rate by jurisdiction
- Tax applied to services and/or retail
- Tax-exempt items/clients
- Tax reporting by period

---

## 4. COMMISSION & PAYROLL RULES

### 4.1 Compensation Types

**Source:** `/src/lib/payroll-utils.ts` lines 29-38

| Type | Calculation | Components |
|------|-------------|------------|
| **hourly** | `rate × hours` + OT | Base + overtime (1.5× after 40hrs) |
| **salary** | Fixed amount per period | Flat salary amount |
| **commission** | `commissionableAmount × rate%` | Commission only |
| **hourly-plus-commission** | Hourly + commission | Base + OT + commission |
| **salary-plus-commission** | Salary + commission | Salary + commission |
| **override** | Custom calculation | Override amount × percentage |
| **guaranteed-vs-commission** | `MAX(guaranteed, commission)` OR `SUM` | Higher of two OR sum |

---

### 4.2 Overtime Calculation

**Source:** `/src/lib/payroll-utils.ts` lines 265-282

**Rule:** Time-and-a-half after 40 hours per week

**Calculation:**
```typescript
function calculateOvertimePay(hourlyRate: number, hours: number) {
  const regularHours = Math.min(hours, 40)
  const overtimeHours = Math.max(0, hours - 40)
  
  const regularPay = regularHours * hourlyRate
  const overtimePay = overtimeHours * hourlyRate * 1.5
  
  return {
    regularHours,
    overtimeHours,
    regularPay,
    overtimePay,
    totalPay: regularPay + overtimePay
  }
}
```

**Example:**
- Hourly Rate: $20/hr
- Hours Worked: 45
- Regular Pay: 40 × $20 = $800
- OT Pay: 5 × $20 × 1.5 = $150
- **Total: $950**

---

### 4.3 Commission Base

**Source:** `/src/lib/payroll-utils.ts` (implied from compensation types)

**Commissionable Amount:**
- Service revenue from appointments worked by staff
- Retail sales (if staff compensation configured on item)
- **Excludes:** Tips, fees, discounts (commission on subtotal only)

**Calculation:**
```typescript
const commissionableAmount = appointments
  .filter(apt => apt.groomerId === staffId)
  .reduce((sum, apt) => sum + apt.totalPrice, 0)

const commissionEarned = commissionableAmount * (commissionRate / 100)
```

**Example:**
- Staff works 5 appointments: $100, $150, $200, $125, $175
- Total commissionable: $750
- Commission rate: 30%
- **Commission: $225**

---

### 4.4 Guaranteed vs Commission

**Source:** `/src/lib/payroll-utils.ts` lines 29-38

**Two Modes:**

1. **Higher Amount** (`useHigherAmount: true`):
   ```typescript
   const pay = Math.max(guaranteedAmount, commissionEarned)
   ```

2. **Sum Both** (`useHigherAmount: false`):
   ```typescript
   const pay = guaranteedAmount + commissionEarned
   ```

**Example 1 (Higher):**
- Guaranteed: $1000
- Commission: $800
- **Pay: $1000** (guaranteed wins)

**Example 2 (Sum):**
- Guaranteed: $1000
- Commission: $800
- **Pay: $1800** (sum both)

---

### 4.5 Pay Period Types

**Source:** `/src/lib/payroll-utils.ts` lines 5, 256-263

| Type | Frequency | Anchor Date | Calculation |
|------|-----------|-------------|-------------|
| **weekly** | Every 7 days | Any day of week | Start date + (n × 7 days) |
| **bi-weekly** | Every 14 days | Any day of week | Start date + (n × 14 days) |
| **semi-monthly** | Twice per month | 1st and 15th | Fixed dates each month |
| **monthly** | Once per month | 1st of month | First day of each month |

**Functions:**
- `getCurrentPayPeriod(settings)` → Returns current period dates
- `calculateNextPayPeriod(settings)` → Returns next period dates

**Example (Bi-Weekly):**
- Anchor: January 1, 2026
- Period 1: Jan 1-14
- Period 2: Jan 15-28
- Period 3: Jan 29 - Feb 11

---

### 4.6 Tips in Payroll

**Source:** `/src/pages/StaffPayrollBreakdown.tsx` (implied)

**Rules:**
1. Tips tracked separately by payment method (cash vs card)
2. Tips included in gross pay calculation
3. Tips displayed as separate line item in breakdown
4. Tips NOT subject to commission calculation

**Breakdown Display:**
```
Base Pay:        $800.00
Overtime Pay:    $150.00
Commission:      $225.00
Tips (Cash):      $50.00
Tips (Card):     $100.00
------------------------
Gross Pay:     $1,325.00
```

---

### 4.7 Retail Item Commission

**Source:** `/src/lib/types.ts` lines 107-120

**Configuration:**
- `staffCompensationType`: "percentage" | "fixed"
- `staffCompensationValue`: number

**Rules:**
1. Configured per inventory item
2. Applied when item sold via POS
3. Added to staff member who processed transaction
4. **Status:** Implementation incomplete (inventory decrement TODO)

**Example:**
- Item: Dog shampoo
- Price: $25
- Staff compensation: 10% (percentage)
- **Staff earns: $2.50** per sale

---

## 5. BUSINESS HOURS & SCHEDULING RULES

### 5.1 Business Hours

**Source:** `/src/lib/business-hours.ts`, `/src/pages/Settings.tsx`

**Configuration:**
```typescript
{
  monday: { open: "09:00", close: "17:00", isClosed: false },
  tuesday: { open: "09:00", close: "17:00", isClosed: false },
  // ... other days
  sunday: { isClosed: true }
}
```

**Rules:**
1. Configured per day of week
2. Days can be marked as closed
3. Time format: HH:MM (24-hour)
4. Used for appointment validation

**Validation:**
```typescript
function isTimeWithinBusinessHours(
  date: string, 
  time: string, 
  hours: BusinessHours
): boolean {
  const dayOfWeek = getDayOfWeek(date)
  const dayHours = hours[dayOfWeek]
  
  if (dayHours.isClosed) return false
  
  return time >= dayHours.open && time <= dayHours.close
}
```

**Rule:** Appointments can only be scheduled during business hours.

---

### 5.2 Time Zones

**Source:** `/src/lib/date-utils.ts`, `/src/pages/Settings.tsx`

**Configuration:**
- Business timezone set in Settings (e.g., "America/Los_Angeles")
- Used for all date/time operations

**Functions:**
- `getTodayInBusinessTimezone(timezone)` → Returns current date in business timezone
- `getNowInBusinessTimezone(timezone)` → Returns current datetime in business timezone

**Rule:** All appointments, schedules, and reports use business timezone (not user's local timezone).

**Critical Issue:** Per AUDIT_REPORT.md #3, timezone implementation is incomplete. Current behavior:
- Settings has timezone field
- Date utilities exist
- **But appointments use browser local time** (Date.now(), toISOString())

---

### 5.3 Appointment Duration

**Status:** NOT enforced

**Observations:**
- Start time and end time configured
- No automatic duration calculation
- No validation that end > start
- No duration-based scheduling conflicts

**Future Requirements:**
- Default duration per service type
- Auto-calculate end time from start + duration
- Prevent overlapping appointments per groomer

---

### 5.4 Groomer Assignment

**Source:** `/src/components/appointments/CreateAppointmentDialog.tsx` lines 133-141

**Auto-Assignment Algorithm:**
```typescript
function autoAssignGroomer(groomers: Staff[], appointments: Appointment[]) {
  // Count current appointments per groomer
  const groomerCounts = groomers.map(groomer => ({
    groomer,
    count: appointments.filter(apt => apt.groomerId === groomer.id).length
  }))
  
  // Sort by count ascending
  groomerCounts.sort((a, b) => a.count - b.count)
  
  // Return groomer with lowest count
  return groomerCounts[0].groomer
}
```

**Rule:** Groomer with fewest total appointments gets assigned (workload balancing).

**Issues:**
- Does NOT check time slot availability (can double-book)
- Does NOT consider groomer specialties
- Does NOT respect requested groomer (field exists but not used in auto-assign)

---

## 6. INVENTORY RULES

### 6.1 Stock Levels

**Source:** `/src/pages/Inventory.tsx`

**Rules:**
1. Quantity must be >= 0
2. Cannot sell more than available stock (**TODO** - not enforced)
3. Reorder level triggers low stock alert

**Low Stock Alert:**
```typescript
if (item.quantity <= item.reorderLevel) {
  // Display yellow/red indicator
}
```

---

### 6.2 Inventory Valuation

**Source:** `/src/pages/Inventory.tsx` lines 44-80

**Calculations:**

**Cost Basis (All Items):**
```typescript
const costBasis = item.cost * item.quantity
```

**Retail Value (Retail Items Only):**
```typescript
const retailValue = item.category === "retail" 
  ? item.price * item.quantity 
  : 0
```

**Potential Profit (Retail Items Only):**
```typescript
const potentialProfit = item.category === "retail"
  ? (item.price - item.cost) * item.quantity
  : 0
```

**Total Inventory Value:**
```typescript
const totalValue = inventory.reduce((sum, item) => 
  sum + (item.cost * item.quantity), 0
)
```

---

### 6.3 Value Snapshot Rules

**Source:** `/src/pages/Inventory.tsx` lines 44-80

**Snapshot Triggers:**
1. Inventory item added
2. Inventory item edited (quantity, price, cost changed)
3. Inventory item deleted

**Snapshot Logic:**
```typescript
function shouldCreateSnapshot(
  newValue: number, 
  lastSnapshot: InventoryValueSnapshot | null
): boolean {
  // No previous snapshot
  if (!lastSnapshot) return true
  
  // Value changed by more than $0.01
  const valueDiff = Math.abs(newValue - lastSnapshot.totalValue)
  if (valueDiff > 0.01) return true
  
  // More than 24 hours since last snapshot
  const hoursSince = (Date.now() - lastSnapshot.timestamp) / (1000 * 60 * 60)
  if (hoursSince >= 24) return true
  
  return false
}
```

**Retention:**
- Keep last 90 days of snapshots
- Delete older snapshots automatically

**Rule:** Only create snapshots when value meaningfully changes OR for daily checkpoints.

---

### 6.4 Inventory Decrement

**Source:** `/src/pages/POS.tsx` lines 161-166 (TODO comment)

**Status:** NOT IMPLEMENTED

**Expected Behavior:**
```typescript
// When transaction completed
transaction.items
  .filter(item => item.type === "retail")
  .forEach(item => {
    // Find inventory item
    const inventoryItem = inventory.find(i => i.id === item.id)
    
    // Decrement quantity
    inventoryItem.quantity -= item.quantity
    
    // Validate stock
    if (inventoryItem.quantity < 0) {
      throw new Error("Insufficient stock")
    }
  })
```

**Rule:** Retail sales should decrement inventory automatically.

---

## 7. APPOINTMENT WORKFLOW RULES

### 7.1 Status Lifecycle

**Source:** `/src/lib/types.ts` lines 58-90

**Status Flow:**
```
scheduled → checked-in → in-progress → completed → paid
           ↓
       cancelled (terminal)
```

**Rules:**
1. **scheduled**: Default status on creation
2. **checked-in**: Client arrives, appointment starts soon
3. **in-progress**: Grooming actively happening
4. **completed**: Service finished, ready for checkout
5. **paid**: Transaction completed in POS
6. **cancelled**: Appointment cancelled (cannot proceed)

**Constraints:**
- Only "completed" appointments appear in POS checkout
- "paid" appointments have tipAmount and tipPaymentMethod
- "cancelled" appointments cannot be edited (except to delete)

---

### 7.2 Appointment Creation Rules

**Source:** `/src/components/appointments/CreateAppointmentDialog.tsx`

**Required Fields:**
- Client ID
- Pet ID
- Date
- Start time
- At least one service

**Validation Rules:**
1. Date cannot be in past (for creation)
2. Time must be within business hours
3. Client and pet must exist
4. Services array not empty

**Optional Fields:**
- End time
- Groomer (auto-assigned if not specified)
- Add-ons
- Notes
- Grooming preferences
- Drop-off/pick-up times
- Reference photo

---

### 7.3 Appointment Modification Rules

**Source:** `/src/pages/EditAppointment.tsx`

**Rules:**
1. Can edit any appointment with status != "cancelled"
2. Cannot edit past appointments (**TODO** - not enforced)
3. Changing services recalculates price
4. Cannot change tip amount/method (set via POS)

**Cancellation:**
- Set status to "cancelled"
- Soft delete (remains in system)
- Frees groomer time slot

---

## 8. LOCKING RULES

**Status:** NOT IMPLEMENTED

**Observations:**
- No locking mechanism for:
  - Past appointments (can be edited)
  - Completed pay periods (can be recalculated)
  - Closed transactions (can be modified)
  - Historical data (can be deleted)

**Future Requirements:**
- Lock appointments after checkout
- Lock pay periods after payroll run
- Lock transactions after reconciliation
- Prevent deletion of historical records

---

## 9. REFUND RULES

**Status:** NOT IMPLEMENTED

**Observations:**
- Transaction status includes "refunded"
- No UI for processing refunds
- No inventory reversal logic
- No payment method reversal

**Future Requirements:**
- Partial vs full refunds
- Inventory restoration on refund
- Refund reason tracking
- Financial reporting of refunds

---

## 10. DATA VALIDATION RULES

### 10.1 Required Fields

**By Entity:**
| Entity | Always Required | Conditionally Required |
|--------|----------------|----------------------|
| Client | firstName, lastName, email, phone, address, pets[] | - |
| Pet | name, breed, weight, ownerId | - |
| Appointment | clientId, petId, date, startTime, services[] | groomerId (can be auto-assigned) |
| Staff | name, email, role, compensation | - |
| Transaction | items[], paymentMethod, date | appointmentId (if service transaction) |
| Inventory | name, sku, category, quantity, cost | price (if retail) |
| Expense | category, vendor, amount, date | - |

---

### 10.2 Format Validations

| Field Type | Format | Validation |
|------------|--------|------------|
| Email | Standard email | Regex pattern |
| Phone | Various formats | Non-empty (no specific format enforced) |
| Date | ISO 8601 | Valid date string |
| Time | HH:MM | 24-hour format |
| Currency | Number | >= 0 (decimals allowed) |
| Weight | Number | > 0 |
| Quantity | Number | >= 0 (integer) |

---

### 10.3 Business Logic Validations

| Rule | Validation | Error Message |
|------|------------|---------------|
| Appointment time | Within business hours | "Selected time is outside business hours" |
| Breed selection | From approved list | "Please select a valid breed" |
| Discount | <= subtotal | "Discount cannot exceed subtotal" |
| Inventory quantity | >= 0 | "Quantity cannot be negative" |
| Payment amount | > 0 | "Payment amount must be positive" |
| Pet weight | > 0 | "Weight must be positive" |

---

## 11. CALCULATION SUMMARY

### 11.1 Pricing Calculations

```typescript
// Service price
price = service.pricing[pet.weightCategory]

// Add-on price
price = addon.hasSizePricing 
  ? addon.pricing[pet.weightCategory] 
  : addon.price

// Appointment total
total = mainServicePrice + sum(addOnPrices)

// Transaction total
total = subtotal - discount + additionalFees
// (Tips tracked separately)
```

---

### 11.2 Payroll Calculations

```typescript
// Hourly
pay = (regularHours * rate) + (OThours * rate * 1.5)

// Commission
pay = commissionableAmount * (rate / 100)

// Hourly + Commission
pay = hourlyPay + commission

// Guaranteed vs Commission (higher)
pay = Math.max(guaranteed, commission)

// Guaranteed vs Commission (sum)
pay = guaranteed + commission

// Gross pay
grossPay = basePay + OT + commission + tips
```

---

### 11.3 Inventory Calculations

```typescript
// Cost basis
value = cost * quantity

// Retail value
value = price * quantity  // retail items only

// Potential profit
profit = (price - cost) * quantity  // retail items only

// Total inventory value
total = sum(item.cost * item.quantity)
```

---

## 12. MISSING RULES IMPLEMENTATION

### High Priority

1. **Timezone Enforcement**
   - Use business timezone for all date operations
   - Convert user input to business timezone
   - Display times in business timezone

2. **Inventory Decrement**
   - Subtract sold quantities from stock
   - Prevent negative stock
   - Alert on low stock during checkout

3. **Groomer Time Slot Validation**
   - Check for double-booking
   - Respect appointment duration
   - Validate against business hours

### Medium Priority

4. **Tax Calculations**
   - Configure tax rate
   - Apply to services/retail
   - Track tax collected

5. **Locking Past Data**
   - Lock completed pay periods
   - Lock historical transactions
   - Prevent editing past appointments

6. **Refund Processing**
   - Reverse transactions
   - Restore inventory
   - Track refund reasons

### Low Priority

7. **Breed-Based Pricing**
   - Configure pricing by breed
   - Override weight-based pricing

8. **Mixed Pricing Strategy**
   - Combine weight and breed factors
   - Custom pricing formulas

---

**Total Rules Documented:** 50+ business rules  
**Total Calculations:** 15+ calculation formulas  
**Missing Implementations:** 8+ critical features

---

**End of Rules Specification**
