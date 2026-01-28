# Entity Dictionary
**Application:** Scruffy Butts - Dog Grooming Management  
**Date:** January 28, 2026  
**Purpose:** Canonical data model for all entities with fields, types, and relationships

---

## Core Entities

### 1. Client
**Source:** `/src/lib/types.ts` lines 10-27

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | Yes | Unique identifier | Generated: `Date.now().toString()` |
| `firstName` | string | Yes | Client first name | Non-empty |
| `lastName` | string | Yes | Client last name | Non-empty |
| `email` | string | Yes | Email address | Valid email format |
| `phone` | string | Yes | Phone number | Non-empty |
| `address` | object | Yes | Full address | See Address type |
| `pets` | Pet[] | Yes | Array of pets owned | At least 1 pet required |
| `referralSource` | string | No | How they found business | Optional |
| `joinedDate` | string | Yes | Client since date | ISO 8601 date |
| `notes` | string | No | Special notes | Optional |

**Address Sub-Type:**
```typescript
{
  street: string
  city: string
  state: string
  zip: string
}
```

**Relationships:**
- One-to-Many with Pet (`client.id` → `pet.ownerId`)
- One-to-Many with Appointment (`client.id` → `appointment.clientId`)
- One-to-Many with Transaction (`client.id` → `transaction.clientId`)

---

### 2. Pet
**Source:** `/src/lib/types.ts` lines 1-8

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | Yes | Unique identifier | Generated: `Date.now().toString() + index` |
| `name` | string | Yes | Pet name | Non-empty |
| `breed` | string | Yes | Dog breed | Must be from approved breed list |
| `weight` | number | Yes | Weight in pounds | > 0 |
| `weightCategory` | WeightCategory | Yes | Size category | Auto-calculated from weight |
| `ownerId` | string | Yes | Foreign key to Client | Must reference valid client |
| `birthday` | string | No | Date of birth | ISO 8601 date |
| `gender` | string | No | Male/Female/Other | Optional |
| `color` | string | No | Fur color | Optional |
| `temperament` | string | No | Behavioral notes | Optional |
| `specialNotes` | string | No | Grooming notes | Optional |
| `isActive` | boolean | Yes | Active status | Defaults to true |

**WeightCategory Enum:**
```typescript
"small" | "medium" | "large" | "giant"
```

**Weight Calculation Logic** (`/src/lib/types.ts` lines 163-168):
- `weight <= 25` → `"small"`
- `weight <= 50` → `"medium"`
- `weight <= 80` → `"large"`
- `weight > 80` → `"giant"`

**Relationships:**
- Many-to-One with Client (`pet.ownerId` → `client.id`)
- One-to-Many with Appointment (`pet.id` → `appointment.petId`)

---

### 3. Appointment
**Source:** `/src/lib/types.ts` lines 58-90

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | Yes | Unique identifier | Generated: `Date.now().toString()` |
| `clientId` | string | Yes | Foreign key to Client | Must reference valid client |
| `petId` | string | Yes | Foreign key to Pet | Must reference valid pet |
| `groomerId` | string | Yes | Foreign key to Staff | Must reference valid groomer |
| `date` | string | Yes | Appointment date | ISO 8601 date |
| `startTime` | string | Yes | Start time | HH:MM format |
| `endTime` | string | Yes | End time | HH:MM format |
| `status` | AppointmentStatus | Yes | Current status | See status enum |
| `services` | Service[] | Yes | Selected services | At least 1 required |
| `addOns` | AddOn[] | No | Additional services | Optional array |
| `totalPrice` | number | Yes | Total cost | Auto-calculated |
| `tipAmount` | number | No | Tip amount | >= 0, added post-checkout |
| `tipPaymentMethod` | string | No | Cash or Card | Optional, added post-checkout |
| `groomingPreferences` | object | No | Style preferences | See GroomingPreferences type |
| `notes` | string | No | Special instructions | Optional |
| `dropOffTime` | string | No | Drop-off time | HH:MM format |
| `pickUpTime` | string | No | Pick-up time | HH:MM format |
| `requestedGroomer` | string | No | Preferred groomer | Optional |
| `photoWant` | File | No | Reference photo | **Not persisted** (needs base64) |

**AppointmentStatus Enum:**
```typescript
"scheduled" | "checked-in" | "in-progress" | "completed" | 
"notified" | "paid" | "cancelled"
```

**GroomingPreferences Type:**
```typescript
{
  style?: string
  specialInstructions?: string
  confirmationNotes?: string
}
```

**Business Rules:**
- Start time must be within business hours
- End time must be after start time
- Date cannot be in past (for creation)
- Price calculation: Main service (weight-based) + add-ons
- Auto-groomer assignment: Choose groomer with lowest appointment count

**Relationships:**
- Many-to-One with Client (`appointment.clientId` → `client.id`)
- Many-to-One with Pet (`appointment.petId` → `pet.id`)
- Many-to-One with Staff (`appointment.groomerId` → `staff.id`)
- One-to-One with Transaction (optional, after checkout)

---

### 4. Staff
**Source:** `/src/lib/types.ts` lines 92-105

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | Yes | Unique identifier | Generated |
| `name` | string | Yes | Full name | Non-empty |
| `role` | string | Yes | Job position | From position list |
| `email` | string | Yes | Email address | Valid email format |
| `phone` | string | Yes | Phone number | Non-empty |
| `status` | StaffStatus | Yes | Employment status | See status enum |
| `isGroomer` | boolean | Yes | Can perform grooming | Defaults based on role |
| `specialties` | string[] | No | Grooming specialties | Optional array |
| `hourlyRate` | number | No | Hourly pay rate | >= 0 |
| `totalAppointments` | number | Yes | Completed count | Defaults to 0 |
| `rating` | number | No | Average rating | 0-5 scale |
| `hireDate` | string | Yes | Start date | ISO 8601 date |
| `compensation` | StaffCompensation | Yes | Pay structure | See compensation type |
| `profilePhoto` | string | No | Photo URL | Optional |

**StaffStatus Enum:**
```typescript
"active" | "pending" | "inactive"
```

**StaffCompensation Type** (`/src/lib/payroll-utils.ts` lines 29-38):
```typescript
{
  type: "hourly" | "salary" | "commission" | "hourly-plus-commission" | 
        "salary-plus-commission" | "override" | "guaranteed-vs-commission"
  hourlyRate?: number
  salaryAmount?: number
  commissionRate?: number
  guaranteedAmount?: number
  useHigherAmount?: boolean  // For guaranteed-vs-commission
}
```

**Relationships:**
- One-to-Many with Appointment (`staff.id` → `appointment.groomerId`)
- One-to-Many with PayrollPeriod
- Many-to-One with PendingStaff (during invite process)

---

### 5. PendingStaff
**Source:** `/src/pages/Staff.tsx` lines 29-34

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `email` | string | Yes | Email address |
| `role` | string | Yes | Job position |
| `inviteDate` | string | Yes | When invited |
| `status` | string | Yes | "pending" |

**Purpose:** Temporary record before staff accepts invitation

**Lifecycle:**
1. Created via InviteStaff page
2. Email sent (simulated)
3. Staff accepts → Moves to Staff entity
4. OR cancelled → Deleted from pending-staff

---

### 6. Service (MainService)
**Source:** `/src/lib/types.ts` lines 36-41

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `name` | string | Yes | Service name |
| `description` | string | No | Service description |
| `pricing` | PricingTier | Yes | Weight-based pricing |

**PricingTier Type:**
```typescript
{
  small: number   // <= 25 lbs
  medium: number  // 26-50 lbs
  large: number   // 51-80 lbs
  giant: number   // > 80 lbs
}
```

**Example Services:**
- Full Groom (bath, haircut, nails, ears)
- Bath Only
- Nail Trim
- De-shedding Treatment

**Price Lookup Logic** (`/src/lib/types.ts` lines 170-172):
```typescript
getPriceForWeight(pricing, pet.weightCategory)
```

---

### 7. AddOn
**Source:** `/src/lib/types.ts` lines 43-49

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `name` | string | Yes | Add-on name |
| `price` | number | Conditional | Flat price OR tiered |
| `pricing` | PricingTier | Conditional | Size-based pricing |
| `hasSizePricing` | boolean | Yes | Use tiered vs flat |

**Example Add-Ons:**
- Teeth Brushing (flat $15)
- Flea Treatment (size-based)
- Ear Cleaning (flat $10)
- Sanitary Trim (flat $12)

**Price Calculation:**
```typescript
if (hasSizePricing) {
  price = getPriceForWeight(pricing, pet.weightCategory)
} else {
  price = price
}
```

---

### 8. Transaction
**Source:** `/src/lib/types.ts` lines 134-152

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | Yes | Unique identifier | Generated |
| `appointmentId` | string | No | Related appointment | Optional (retail-only transactions) |
| `date` | string | Yes | Transaction date | ISO 8601 |
| `clientId` | string | No | Customer ID | Optional (walk-in retail) |
| `items` | TransactionItem[] | Yes | Line items | At least 1 |
| `subtotal` | number | Yes | Pre-discount total | Auto-calculated |
| `discount` | number | No | Discount amount | >= 0 |
| `additionalFees` | object | No | Extra charges | { amount, description } |
| `total` | number | Yes | Final amount | subtotal - discount + fees |
| `tipAmount` | number | No | Tip | >= 0 |
| `paymentMethod` | string | Yes | Payment type | From enabled methods |
| `status` | string | Yes | Transaction status | "completed", "pending", "refunded" |
| `type` | string | Yes | Transaction type | "service", "retail", "mixed" |

**TransactionItem Type:**
```typescript
{
  id: string
  name: string
  type: "service" | "retail"
  quantity: number
  price: number
  total: number
}
```

**Business Rules:**
- Total = subtotal - discount + additionalFees.amount + tipAmount
- When appointment checkout: Creates transaction + updates appointment with tip
- Inventory decrement (TODO - not implemented)

**Relationships:**
- Many-to-One with Appointment (optional)
- Many-to-One with Client (optional)

---

### 9. InventoryItem
**Source:** `/src/lib/types.ts` lines 107-120

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | Yes | Unique identifier | Generated |
| `name` | string | Yes | Item name | Non-empty |
| `category` | ItemCategory | Yes | Item type | "retail" or "supply" |
| `sku` | string | Yes | Stock keeping unit | Unique identifier |
| `quantity` | number | Yes | Current stock | >= 0 |
| `price` | number | Yes | Selling price | >= 0 (retail), 0 for supplies |
| `cost` | number | Yes | Purchase cost | >= 0 |
| `reorderLevel` | number | No | Low stock threshold | Optional |
| `supplier` | string | No | Vendor name | Optional |
| `staffCompensationType` | string | No | Commission type | "percentage" or "fixed" |
| `staffCompensationValue` | number | No | Commission amount | >= 0 |

**ItemCategory Enum:**
```typescript
"retail" | "supply"
```

**Calculations:**
- **Cost Basis:** `cost × quantity`
- **Retail Value:** `price × quantity` (retail items only)
- **Potential Profit:** `(price - cost) × quantity` (retail items only)

**Business Rules:**
- Retail items: Sold to customers, tracked for profit
- Supply items: Internal use, tracked for cost only
- Low stock alert: `quantity <= reorderLevel`
- Staff compensation: Optional commission on retail sales

**Relationships:**
- Many-to-Many with Transaction (via TransactionItem)

---

### 10. InventoryValueSnapshot
**Source:** `/src/lib/types.ts` lines 122-132

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `timestamp` | string | Yes | Snapshot date/time |
| `totalValue` | number | Yes | Total inventory value |
| `retailValue` | number | Yes | Retail items value |
| `supplyValue` | number | Yes | Supply items value |
| `retailPotentialProfit` | number | Yes | Unrealized profit |
| `itemCount` | number | Yes | Total item count |

**Purpose:** Track inventory value over time for reporting

**Snapshot Logic** (`/src/pages/Inventory.tsx` lines 44-80):
1. Calculate values when inventory changes
2. Check if value changed > $0.01 OR last snapshot > 24 hours
3. If yes, create new snapshot
4. Store in `inventory-value-history`
5. Keep last 90 days only

**Usage:**
- Reports tab: Line charts of value trends
- Dashboard: Current inventory asset value

---

### 11. ExpenseRecord
**Source:** `/src/lib/finance-types.ts` lines 1-9

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `category` | string | Yes | Expense type |
| `vendor` | string | Yes | Vendor name |
| `date` | string | Yes | Expense date |
| `status` | string | Yes | "pending" or "paid" |
| `amount` | number | Yes | Cost amount |
| `description` | string | No | Notes |

**Categories:**
- Supplies
- Utilities
- Rent
- Payroll
- Marketing
- Equipment
- Other

**Business Rules:**
- Amount must be > 0
- Status workflow: pending → paid
- Used for expense analytics and tax reporting

---

### 12. PaymentDetail
**Source:** `/src/lib/finance-types.ts` lines 11-20

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `date` | string | Yes | Payment date |
| `client` | string | Yes | Client name |
| `service` | string | Yes | Service description |
| `amount` | number | Yes | Payment amount |
| `tip` | number | No | Tip amount |
| `method` | string | Yes | Payment method |

**Purpose:** Manual payment recording (outside POS flow)

**Difference from Transaction:**
- PaymentDetail: Manual entry, simplified
- Transaction: POS-generated, full details

---

### 13. PayrollPeriod
**Source:** `/src/lib/payroll-utils.ts` (implied from calculations)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `staffId` | string | Yes | Staff member |
| `startDate` | string | Yes | Period start |
| `endDate` | string | Yes | Period end |
| `regularHours` | number | Yes | Non-OT hours |
| `overtimeHours` | number | Yes | OT hours |
| `basePayroll` | number | Yes | Base earnings |
| `overtimePay` | number | Yes | OT earnings |
| `commissionEarned` | number | Yes | Commission amount |
| `tipsEarned` | number | Yes | Total tips |
| `grossPay` | number | Yes | Total earnings |
| `appointments` | Appointment[] | Yes | Appointments worked |

**Pay Period Types** (`/src/lib/payroll-utils.ts` lines 5):
- `weekly` - Every 7 days
- `bi-weekly` - Every 14 days
- `semi-monthly` - 1st and 15th
- `monthly` - 1st of month

**Calculations:**
- Regular pay: `hourlyRate × min(regularHours, 40)` OR `salaryAmount`
- OT pay: `hourlyRate × 1.5 × max(0, hours - 40)`
- Commission: `commissionableAmount × (commissionRate / 100)`
- Gross: `basePay + OT + commission + tips`

---

## Entity Relationships Diagram

```
Client
  ├─ has many Pets
  ├─ has many Appointments
  └─ has many Transactions

Pet
  ├─ belongs to Client
  └─ has many Appointments

Appointment
  ├─ belongs to Client
  ├─ belongs to Pet
  ├─ belongs to Staff (groomer)
  ├─ has many Services
  ├─ has many AddOns
  └─ has one Transaction (optional, after checkout)

Staff
  ├─ has many Appointments (as groomer)
  ├─ has many PayrollPeriods
  └─ has one PendingStaff record (during invite)

Transaction
  ├─ belongs to Client (optional)
  ├─ belongs to Appointment (optional)
  └─ has many TransactionItems

InventoryItem
  └─ appears in many TransactionItems

Service & AddOn
  └─ appear in many Appointments

ExpenseRecord
  └─ standalone (no relations)

PaymentDetail
  └─ standalone (no relations)
```

---

## Data Types Reference

### Common Types

**ISO 8601 Date:**
```
"2026-01-28"
"2026-01-28T18:30:00.000Z"
```

**Time Format:**
```
"09:00"
"14:30"
```

**Phone Number:**
```
"(555) 123-4567"
"555-123-4567"
```

**Email:**
```
"client@example.com"
```

**Currency:**
```typescript
number  // Stored as decimal (e.g., 125.50)
```

---

## Enums & Constants

### Weight Categories
```typescript
type WeightCategory = "small" | "medium" | "large" | "giant"
```

### Appointment Status
```typescript
type AppointmentStatus = 
  | "scheduled" 
  | "checked-in" 
  | "in-progress" 
  | "completed" 
  | "notified" 
  | "paid" 
  | "cancelled"
```

### Staff Status
```typescript
type StaffStatus = "active" | "pending" | "inactive"
```

### Compensation Types
```typescript
type CompensationType = 
  | "hourly"
  | "salary"
  | "commission"
  | "hourly-plus-commission"
  | "salary-plus-commission"
  | "override"
  | "guaranteed-vs-commission"
```

### Payment Methods (Configurable)
```typescript
type PaymentMethod = "cash" | "credit" | "debit" | "check"
```

### Transaction Status
```typescript
type TransactionStatus = "completed" | "pending" | "refunded"
```

### Item Category
```typescript
type ItemCategory = "retail" | "supply"
```

---

## Validation Rules Summary

1. **Required Fields:** All entities have required `id` field (auto-generated)
2. **Foreign Keys:** All relationships validated (must reference existing entity)
3. **Positive Numbers:** Prices, amounts, weights must be >= 0
4. **Date Validation:** Dates must be valid ISO 8601 format
5. **Email Validation:** Must match email regex pattern
6. **Enum Validation:** Status fields must match defined enums
7. **Business Logic:** 
   - Appointment times within business hours
   - Pet weight determines pricing category
   - Transaction totals calculated correctly
   - Inventory quantities cannot go negative

---

## Missing/Incomplete Entities

1. **User/Authentication** - Not implemented (single-user assumption)
2. **Message** - Placeholder only
3. **Notification** - Email invites simulated
4. **Report** - No entity, generated on-demand
5. **Settings** - Stored as separate KV keys, not unified entity
6. **Schedule** - Staff availability not formalized
7. **Photo** - File objects not persisted (needs entity for base64 data)

---

**Total Entities:** 13 core entities  
**Total Relationships:** 20+ foreign key relationships  
**Total Fields:** 150+ fields across all entities

---

**End of Entity Dictionary**
