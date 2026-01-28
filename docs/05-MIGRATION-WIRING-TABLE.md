# Migration Wiring Table
**Application:** Scruffy Butts - Dog Grooming Management  
**Date:** January 28, 2026  
**Purpose:** Step-by-step migration plan from KV storage to Supabase with exact mappings

---

## Executive Summary

**Current Architecture:**
- Frontend: React + TypeScript + Vite
- State Management: React useState + useKV custom hook
- Storage: Browser localStorage with `kv:` prefix
- Data Persistence: JSON serialization to localStorage
- Backend: None (single-user, client-side only)

**Target Architecture:**
- Frontend: React + TypeScript + Vite (unchanged)
- State Management: React Query + useState
- Storage: Supabase PostgreSQL
- Data Persistence: REST API + real-time subscriptions
- Backend: Supabase (Postgres + Auth + RLS)

**Migration Strategy:** Incremental, entity-by-entity replacement

---

## Migration Phases

### Phase 1: Foundation (1-2 weeks)
- Set up Supabase project
- Create database schema
- Implement Row Level Security (RLS)
- Set up authentication

### Phase 2: Core Entities (2-3 weeks)
- Migrate Clients & Pets
- Migrate Appointments
- Migrate Staff

### Phase 3: Transactions (1-2 weeks)
- Migrate POS Transactions
- Migrate Inventory
- Migrate Financial records

### Phase 4: Settings & Cleanup (1 week)
- Migrate Settings/Config
- Remove useKV dependencies
- Data migration scripts

---

## Supabase Schema Design

### Table Naming Conventions
- Singular lowercase (e.g., `client`, `pet`, `appointment`)
- Foreign keys: `entity_id` (e.g., `client_id`, `pet_id`)
- Timestamps: `created_at`, `updated_at`
- Soft deletes: `deleted_at` (nullable)

---

## Entity Migration Table

### 1. CLIENT

| Current (useKV) | Supabase Table | Notes |
|-----------------|----------------|-------|
| **KV Key:** `"clients"` | **Table:** `client` | - |
| **Type:** `Client[]` | **Rows:** One per client | - |

**Supabase Schema:**
```sql
CREATE TABLE client (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  street VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip VARCHAR(20),
  referral_source VARCHAR(100),
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_client_email ON client(email);
CREATE INDEX idx_client_deleted ON client(deleted_at) WHERE deleted_at IS NULL;
```

**Migration Steps:**
1. Create table
2. Update AddClient.tsx to use Supabase client
3. Update EditClient.tsx to use Supabase update
4. Update ClientsList.tsx to query Supabase
5. Update ClientProfile.tsx to join with pets/appointments

**API Endpoints (Supabase):**
- `POST /rest/v1/client` - Create
- `GET /rest/v1/client?select=*` - List
- `GET /rest/v1/client?id=eq.{id}&select=*` - Get by ID
- `PATCH /rest/v1/client?id=eq.{id}` - Update
- `DELETE /rest/v1/client?id=eq.{id}` - Soft delete

**Code Changes:**
```typescript
// Before
const [clients, setClients] = useKV<Client[]>("clients", [])
setClients(current => [...current, newClient])

// After
import { supabase } from '@/lib/supabase'
const { data, error } = await supabase
  .from('client')
  .insert({ first_name, last_name, email, ... })
  .select()
```

---

### 2. PET

| Current (useKV) | Supabase Table | Notes |
|-----------------|----------------|-------|
| **KV Key:** Nested in `"clients"` | **Table:** `pet` | Separate table |
| **Type:** `Pet[]` in `client.pets` | **Rows:** One per pet | Foreign key to client |

**Supabase Schema:**
```sql
CREATE TYPE weight_category AS ENUM ('small', 'medium', 'large', 'giant');

CREATE TABLE pet (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES client(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  weight DECIMAL(5,2) NOT NULL CHECK (weight > 0),
  weight_category weight_category NOT NULL,
  birthday DATE,
  gender VARCHAR(20),
  color VARCHAR(50),
  temperament TEXT,
  special_notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_pet_owner ON pet(owner_id);
CREATE INDEX idx_pet_active ON pet(is_active) WHERE is_active = TRUE;

-- Trigger to auto-calculate weight_category
CREATE OR REPLACE FUNCTION calculate_weight_category()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.weight <= 25 THEN
    NEW.weight_category := 'small';
  ELSIF NEW.weight <= 50 THEN
    NEW.weight_category := 'medium';
  ELSIF NEW.weight <= 80 THEN
    NEW.weight_category := 'large';
  ELSE
    NEW.weight_category := 'giant';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_weight_category
  BEFORE INSERT OR UPDATE OF weight ON pet
  FOR EACH ROW
  EXECUTE FUNCTION calculate_weight_category();
```

**Migration Steps:**
1. Create table with trigger
2. Update AddClient.tsx to create pets separately
3. Update AddPet.tsx to use Supabase
4. Update EditPet.tsx to use Supabase
5. Update ClientProfile to join pets

**API Endpoints:**
- `POST /rest/v1/pet` - Create
- `GET /rest/v1/pet?owner_id=eq.{id}` - List by client
- `PATCH /rest/v1/pet?id=eq.{id}` - Update
- `PATCH /rest/v1/pet?id=eq.{id}` (set `is_active=false`) - Deactivate

**Join Pattern:**
```typescript
// Get client with pets
const { data } = await supabase
  .from('client')
  .select(`
    *,
    pets:pet(*)
  `)
  .eq('id', clientId)
  .single()
```

---

### 3. APPOINTMENT

| Current (useKV) | Supabase Table | Notes |
|-----------------|----------------|-------|
| **KV Key:** `"appointments"` | **Table:** `appointment` | - |
| **Type:** `Appointment[]` | **Rows:** One per appointment | Foreign keys to client, pet, staff |

**Supabase Schema:**
```sql
CREATE TYPE appointment_status AS ENUM (
  'scheduled', 'checked-in', 'in-progress', 'completed', 'notified', 'paid', 'cancelled'
);

CREATE TABLE appointment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES client(id),
  pet_id UUID NOT NULL REFERENCES pet(id),
  groomer_id UUID NOT NULL REFERENCES staff(id),
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  tip_amount DECIMAL(10,2) CHECK (tip_amount >= 0),
  tip_payment_method VARCHAR(20),
  notes TEXT,
  drop_off_time TIME,
  pick_up_time TIME,
  requested_groomer_id UUID REFERENCES staff(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_appointment_date ON appointment(appointment_date);
CREATE INDEX idx_appointment_client ON appointment(client_id);
CREATE INDEX idx_appointment_groomer ON appointment(groomer_id);
CREATE INDEX idx_appointment_status ON appointment(status);

-- Services many-to-many
CREATE TABLE appointment_service (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointment(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES service(id),
  price_paid DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add-ons many-to-many
CREATE TABLE appointment_addon (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointment(id) ON DELETE CASCADE,
  addon_id UUID NOT NULL REFERENCES addon(id),
  price_paid DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Grooming preferences (JSONB)
ALTER TABLE appointment ADD COLUMN grooming_preferences JSONB;
```

**Migration Steps:**
1. Create tables
2. Update CreateAppointmentDialog to use Supabase
3. Update NewAppointment to use Supabase
4. Update EditAppointment to use Supabase
5. Update CalendarView/ListView/GroomerView to query Supabase
6. Implement real-time subscriptions for calendar updates

**API Endpoints:**
- `POST /rest/v1/appointment` - Create
- `POST /rest/v1/appointment_service` - Add services
- `POST /rest/v1/appointment_addon` - Add add-ons
- `GET /rest/v1/appointment?select=*` - List
- `PATCH /rest/v1/appointment?id=eq.{id}` - Update
- `DELETE /rest/v1/appointment?id=eq.{id}` - Cancel

**Join Pattern:**
```typescript
const { data } = await supabase
  .from('appointment')
  .select(`
    *,
    client(*),
    pet(*),
    groomer:staff(*),
    services:appointment_service(*, service(*)),
    addons:appointment_addon(*, addon(*))
  `)
  .gte('appointment_date', startDate)
  .lte('appointment_date', endDate)
```

**Business Logic Migration:**
- Auto-groomer assignment: Implement as Postgres function (RPC)
- Price calculation: Front-end or RPC
- Business hours validation: Postgres check constraint + app validation

---

### 4. STAFF

| Current (useKV) | Supabase Table | Notes |
|-----------------|----------------|-------|
| **KV Key:** `"staff"` | **Table:** `staff` | - |
| **Type:** `Staff[]` | **Rows:** One per staff | - |

**Supabase Schema:**
```sql
CREATE TYPE staff_status AS ENUM ('active', 'pending', 'inactive');
CREATE TYPE compensation_type AS ENUM (
  'hourly', 'salary', 'commission', 'hourly-plus-commission',
  'salary-plus-commission', 'override', 'guaranteed-vs-commission'
);

CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  status staff_status NOT NULL DEFAULT 'pending',
  is_groomer BOOLEAN NOT NULL DEFAULT FALSE,
  specialties TEXT[],
  total_appointments INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  profile_photo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Compensation (JSONB for flexibility)
CREATE TABLE staff_compensation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  type compensation_type NOT NULL,
  hourly_rate DECIMAL(10,2),
  salary_amount DECIMAL(10,2),
  commission_rate DECIMAL(5,2),
  guaranteed_amount DECIMAL(10,2),
  use_higher_amount BOOLEAN DEFAULT FALSE,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_staff_email ON staff(email);
CREATE INDEX idx_staff_status ON staff(status);
```

**Migration Steps:**
1. Create tables
2. Update InviteStaff to create staff record
3. Update Staff.tsx to query Supabase
4. Update StaffProfile to query Supabase
5. Update EditStaff to use Supabase

**API Endpoints:**
- `POST /rest/v1/staff` - Create
- `GET /rest/v1/staff?status=eq.active` - List active
- `PATCH /rest/v1/staff?id=eq.{id}` - Update

**Pending Staff:**
- Can use same `staff` table with status='pending'
- Or separate `pending_staff_invite` table

---

### 5. TRANSACTION

| Current (useKV) | Supabase Table | Notes |
|-----------------|----------------|-------|
| **KV Key:** `"transactions"` | **Table:** `transaction` | - |
| **Type:** `Transaction[]` | **Rows:** One per transaction | Foreign keys to appointment, client |

**Supabase Schema:**
```sql
CREATE TYPE transaction_status AS ENUM ('completed', 'pending', 'refunded');
CREATE TYPE transaction_type AS ENUM ('service', 'retail', 'mixed');

CREATE TABLE transaction (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointment(id),
  client_id UUID REFERENCES client(id),
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  discount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  additional_fees_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  additional_fees_description TEXT,
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  tip_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tip_amount >= 0),
  payment_method VARCHAR(50) NOT NULL,
  status transaction_status NOT NULL DEFAULT 'completed',
  type transaction_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE transaction_item (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES transaction(id) ON DELETE CASCADE,
  item_id UUID,  -- References inventory or service
  item_name VARCHAR(255) NOT NULL,
  item_type VARCHAR(20) NOT NULL,  -- 'service' or 'retail'
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transaction_date ON transaction(transaction_date);
CREATE INDEX idx_transaction_client ON transaction(client_id);
CREATE INDEX idx_transaction_appointment ON transaction(appointment_id);
```

**Migration Steps:**
1. Create tables
2. Update POS.tsx to create transaction via Supabase
3. Update PaymentHistory to query Supabase
4. Implement inventory decrement trigger

**Inventory Decrement Trigger:**
```sql
CREATE OR REPLACE FUNCTION decrement_inventory()
RETURNS TRIGGER AS $$
BEGIN
  -- For each retail item in transaction
  UPDATE inventory_item
  SET quantity = quantity - NEW.quantity
  WHERE id = NEW.item_id
    AND NEW.item_type = 'retail';
  
  -- Check for negative stock
  IF (SELECT quantity FROM inventory_item WHERE id = NEW.item_id) < 0 THEN
    RAISE EXCEPTION 'Insufficient stock for item %', NEW.item_name;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_inventory_on_sale
  AFTER INSERT ON transaction_item
  FOR EACH ROW
  EXECUTE FUNCTION decrement_inventory();
```

---

### 6. INVENTORY

| Current (useKV) | Supabase Table | Notes |
|-----------------|----------------|-------|
| **KV Key:** `"inventory"` | **Table:** `inventory_item` | - |
| **Type:** `InventoryItem[]` | **Rows:** One per item | - |

**Supabase Schema:**
```sql
CREATE TYPE item_category AS ENUM ('retail', 'supply');
CREATE TYPE compensation_type_enum AS ENUM ('percentage', 'fixed');

CREATE TABLE inventory_item (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category item_category NOT NULL,
  sku VARCHAR(100) NOT NULL UNIQUE,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  cost DECIMAL(10,2) NOT NULL CHECK (cost >= 0),
  reorder_level INTEGER,
  supplier VARCHAR(255),
  staff_compensation_type compensation_type_enum,
  staff_compensation_value DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_inventory_sku ON inventory_item(sku);
CREATE INDEX idx_inventory_category ON inventory_item(category);
CREATE INDEX idx_inventory_low_stock ON inventory_item(quantity, reorder_level) 
  WHERE quantity <= reorder_level;

-- Value snapshots
CREATE TABLE inventory_value_snapshot (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  snapshot_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_value DECIMAL(12,2) NOT NULL,
  retail_value DECIMAL(12,2) NOT NULL,
  supply_value DECIMAL(12,2) NOT NULL,
  retail_potential_profit DECIMAL(12,2) NOT NULL,
  item_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_snapshot_date ON inventory_value_snapshot(snapshot_date);

-- Auto-create snapshots on inventory change
CREATE OR REPLACE FUNCTION create_inventory_snapshot()
RETURNS TRIGGER AS $$
DECLARE
  v_total DECIMAL(12,2);
  v_retail DECIMAL(12,2);
  v_supply DECIMAL(12,2);
  v_profit DECIMAL(12,2);
  v_count INTEGER;
  v_last_snapshot TIMESTAMPTZ;
  v_last_value DECIMAL(12,2);
BEGIN
  -- Calculate values
  SELECT 
    SUM(cost * quantity),
    SUM(CASE WHEN category = 'retail' THEN price * quantity ELSE 0 END),
    SUM(CASE WHEN category = 'supply' THEN cost * quantity ELSE 0 END),
    SUM(CASE WHEN category = 'retail' THEN (price - cost) * quantity ELSE 0 END),
    COUNT(*)
  INTO v_total, v_retail, v_supply, v_profit, v_count
  FROM inventory_item
  WHERE deleted_at IS NULL;
  
  -- Get last snapshot
  SELECT snapshot_date, total_value
  INTO v_last_snapshot, v_last_value
  FROM inventory_value_snapshot
  ORDER BY snapshot_date DESC
  LIMIT 1;
  
  -- Only create if value changed >$0.01 OR >24 hours passed
  IF v_last_snapshot IS NULL 
     OR ABS(v_total - v_last_value) > 0.01
     OR (NOW() - v_last_snapshot) > INTERVAL '24 hours'
  THEN
    INSERT INTO inventory_value_snapshot (
      total_value, retail_value, supply_value, retail_potential_profit, item_count
    ) VALUES (
      v_total, v_retail, v_supply, v_profit, v_count
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inventory_snapshot_trigger
  AFTER INSERT OR UPDATE OR DELETE ON inventory_item
  FOR EACH STATEMENT
  EXECUTE FUNCTION create_inventory_snapshot();
```

**Migration Steps:**
1. Create tables with triggers
2. Update Inventory.tsx to use Supabase
3. Reports tab queries `inventory_value_snapshot` table
4. Remove manual snapshot creation logic (handled by trigger)

---

### 7. SERVICE & ADDON

| Current (useKV) | Supabase Table | Notes |
|-----------------|----------------|-------|
| **KV Key:** Settings tables | **Table:** `service`, `addon` | Static configuration |

**Supabase Schema:**
```sql
CREATE TABLE service (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_small DECIMAL(10,2) NOT NULL,
  price_medium DECIMAL(10,2) NOT NULL,
  price_large DECIMAL(10,2) NOT NULL,
  price_giant DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE addon (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  has_size_pricing BOOLEAN NOT NULL DEFAULT FALSE,
  price DECIMAL(10,2),  -- Flat price if has_size_pricing = false
  price_small DECIMAL(10,2),
  price_medium DECIMAL(10,2),
  price_large DECIMAL(10,2),
  price_giant DECIMAL(10,2),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Migration Steps:**
1. Create tables
2. Seed with default services/add-ons
3. Update Settings.tsx to manage via Supabase
4. Update appointment forms to query from Supabase

---

### 8. EXPENSE & PAYMENT

| Current (useKV) | Supabase Table | Notes |
|-----------------|----------------|-------|
| **KV Key:** `"expenses"`, `"payments"` | **Table:** `expense`, `payment_detail` | - |

**Supabase Schema:**
```sql
CREATE TYPE expense_status AS ENUM ('pending', 'paid');

CREATE TABLE expense (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100) NOT NULL,
  vendor VARCHAR(255) NOT NULL,
  expense_date DATE NOT NULL,
  status expense_status NOT NULL DEFAULT 'pending',
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payment_detail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_date DATE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  service_description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  tip DECIMAL(10,2),
  payment_method VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expense_date ON expense(expense_date);
CREATE INDEX idx_payment_date ON payment_detail(payment_date);
```

**Migration Steps:**
1. Create tables
2. Update AddExpense.tsx to use Supabase
3. Update RecordPayment.tsx to use Supabase
4. Update Finances pages to query Supabase

---

### 9. SETTINGS/CONFIGURATION

| Current (useKV) | Supabase Table | Notes |
|-----------------|----------------|-------|
| **KV Keys:** Multiple | **Table:** `business_settings`, `business_hours`, `payment_method`, etc. | - |

**Supabase Schema:**
```sql
CREATE TABLE business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name VARCHAR(255) NOT NULL,
  timezone VARCHAR(100) NOT NULL DEFAULT 'America/Los_Angeles',
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(day_of_week)
);

CREATE TABLE payment_method (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE position (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  is_groomer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE breed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Migration Steps:**
1. Create tables
2. Seed with default values
3. Update Settings.tsx to use Supabase
4. Load settings on app init

---

## Authentication & Authorization

### Supabase Auth Setup

**Phase 1: Single Business Owner**
```sql
-- Enable RLS on all tables
ALTER TABLE client ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet ENABLE ROW LEVEL SECURITY;
-- ... etc for all tables

-- Policy: Owner can do everything
CREATE POLICY "Owner full access" ON client
  FOR ALL USING (auth.uid() = '{OWNER_USER_ID}');

-- Repeat for all tables
```

**Phase 2: Multi-User (Future)**
```sql
-- Add organization/business ID to all tables
ALTER TABLE client ADD COLUMN business_id UUID REFERENCES business(id);

-- Policy: User can only access their business data
CREATE POLICY "Business members access" ON client
  FOR ALL USING (
    business_id IN (
      SELECT business_id FROM staff WHERE user_id = auth.uid()
    )
  );
```

---

## Data Migration Scripts

### Migration Script Template

```typescript
// migrate-clients.ts
import { supabase } from './supabase'

async function migrateClients() {
  // 1. Read from localStorage
  const clientsJson = localStorage.getItem('kv:clients')
  if (!clientsJson) return
  
  const clients = JSON.parse(clientsJson)
  
  // 2. For each client
  for (const client of clients) {
    // 3. Extract pets
    const pets = client.pets
    delete client.pets  // Remove from client object
    
    // 4. Insert client
    const { data: newClient, error: clientError } = await supabase
      .from('client')
      .insert({
        first_name: client.firstName,
        last_name: client.lastName,
        email: client.email,
        phone: client.phone,
        street: client.address.street,
        city: client.address.city,
        state: client.address.state,
        zip: client.address.zip,
        referral_source: client.referralSource,
        joined_date: client.joinedDate,
        notes: client.notes
      })
      .select()
      .single()
    
    if (clientError) {
      console.error('Error migrating client:', client.id, clientError)
      continue
    }
    
    // 5. Insert pets
    for (const pet of pets) {
      const { error: petError } = await supabase
        .from('pet')
        .insert({
          owner_id: newClient.id,
          name: pet.name,
          breed: pet.breed,
          weight: pet.weight,
          birthday: pet.birthday,
          gender: pet.gender,
          color: pet.color,
          temperament: pet.temperament,
          special_notes: pet.specialNotes,
          is_active: pet.isActive ?? true
        })
      
      if (petError) {
        console.error('Error migrating pet:', pet.id, petError)
      }
    }
    
    // 6. Store mapping (old ID -> new ID) for appointments migration
    idMap.set(client.id, newClient.id)
  }
  
  console.log('Migration complete:', clients.length, 'clients')
}
```

---

## React Query Integration

### Replace useKV with React Query

**Before:**
```typescript
const [clients, setClients] = useKV<Client[]>("clients", [])
```

**After:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Query
const { data: clients, isLoading } = useQuery({
  queryKey: ['clients'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('client')
      .select('*')
    if (error) throw error
    return data
  }
})

// Mutation
const queryClient = useQueryClient()
const createClient = useMutation({
  mutationFn: async (newClient: Client) => {
    const { data, error } = await supabase
      .from('client')
      .insert(newClient)
      .select()
      .single()
    if (error) throw error
    return data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['clients'] })
  }
})
```

---

## Real-Time Subscriptions

### Appointment Calendar Real-Time Updates

```typescript
useEffect(() => {
  const channel = supabase
    .channel('appointment-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'appointment'
      },
      (payload) => {
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['appointments'] })
      }
    )
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

---

## Supabase Functions (RPC)

### Auto-Groomer Assignment

**Postgres Function:**
```sql
CREATE OR REPLACE FUNCTION assign_groomer(
  p_appointment_date DATE,
  p_start_time TIME
)
RETURNS UUID AS $$
DECLARE
  v_groomer_id UUID;
BEGIN
  -- Find groomer with fewest appointments on that day
  SELECT s.id INTO v_groomer_id
  FROM staff s
  WHERE s.is_groomer = TRUE
    AND s.status = 'active'
  ORDER BY (
    SELECT COUNT(*)
    FROM appointment a
    WHERE a.groomer_id = s.id
      AND a.appointment_date = p_appointment_date
  ) ASC
  LIMIT 1;
  
  RETURN v_groomer_id;
END;
$$ LANGUAGE plpgsql;
```

**Frontend Usage:**
```typescript
const { data: groomerId } = await supabase
  .rpc('assign_groomer', {
    p_appointment_date: date,
    p_start_time: time
  })
```

---

## Migration Checklist

### Pre-Migration
- [ ] Set up Supabase project
- [ ] Create all database tables
- [ ] Set up RLS policies
- [ ] Create indexes
- [ ] Create triggers
- [ ] Seed configuration data

### Phase 1: Clients & Pets
- [ ] Create migration script
- [ ] Test migration with sample data
- [ ] Update AddClient.tsx
- [ ] Update EditClient.tsx
- [ ] Update ClientsList.tsx
- [ ] Update ClientProfile.tsx
- [ ] Update AddPet.tsx
- [ ] Update EditPet.tsx
- [ ] Test full CRUD cycle
- [ ] Deploy to production

### Phase 2: Appointments
- [ ] Create migration script (use ID mapping from Phase 1)
- [ ] Update CreateAppointmentDialog.tsx
- [ ] Update NewAppointment.tsx
- [ ] Update EditAppointment.tsx
- [ ] Update CalendarView.tsx
- [ ] Update ListView.tsx
- [ ] Update GroomerView.tsx
- [ ] Test appointment creation/editing
- [ ] Test real-time updates
- [ ] Deploy to production

### Phase 3: Staff
- [ ] Create migration script
- [ ] Update InviteStaff.tsx
- [ ] Update Staff.tsx
- [ ] Update StaffProfile.tsx
- [ ] Update EditStaff.tsx
- [ ] Test staff management
- [ ] Deploy to production

### Phase 4: Transactions & Inventory
- [ ] Create migration scripts
- [ ] Update POS.tsx
- [ ] Update Inventory.tsx
- [ ] Test checkout flow
- [ ] Test inventory decrement
- [ ] Verify value snapshots
- [ ] Deploy to production

### Phase 5: Finances
- [ ] Create migration scripts
- [ ] Update AddExpense.tsx
- [ ] Update RecordPayment.tsx
- [ ] Update Finances pages
- [ ] Test reporting
- [ ] Deploy to production

### Phase 6: Settings & Cleanup
- [ ] Migrate settings
- [ ] Update Settings.tsx
- [ ] Remove useKV hook
- [ ] Remove localStorage dependencies
- [ ] Clean up old code
- [ ] Final testing
- [ ] Deploy to production

---

## Rollback Plan

### Gradual Migration
- Keep useKV and Supabase running in parallel
- Feature flag to switch between storage backends
- Test each entity migration independently
- Can roll back individual entities if issues occur

### Emergency Rollback
```typescript
// Feature flag
const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === 'true'

// Conditional hook
const clients = USE_SUPABASE 
  ? useClientsFromSupabase() 
  : useKV<Client[]>("clients", [])
```

---

## Performance Considerations

### Indexing Strategy
- Primary keys: All entities
- Foreign keys: All relationships
- Date ranges: Appointments, transactions
- Search fields: Client email, phone, SKU
- Status fields: Appointment status, staff status

### Query Optimization
- Use Supabase's built-in caching
- Implement pagination for large lists
- Use `select()` to fetch only needed columns
- Use joins to reduce round trips
- Implement optimistic updates for better UX

### Caching Strategy
- React Query cache: 5 minutes default
- Real-time updates invalidate cache
- Manual refetch on user action
- Background refetch on window focus

---

## Security Considerations

### Row Level Security (RLS)
- Enable on all tables
- Restrict access by business/organization
- Separate policies for read/write
- Audit all sensitive operations

### Data Validation
- Database constraints (CHECK, NOT NULL, UNIQUE)
- Application-level validation (Zod schemas)
- Sanitize user inputs
- Prevent SQL injection (Supabase handles this)

### Authentication
- Supabase Auth for user management
- JWT tokens for API access
- Secure password requirements
- Optional 2FA

---

**Total Migration Effort:** 6-8 weeks  
**Total Tables:** 20+ tables  
**Total Migrations:** 13 entity migrations  
**Total Functions:** 5+ stored procedures

---

**End of Migration Wiring Table**
