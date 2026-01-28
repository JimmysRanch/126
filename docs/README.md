# Master Audit Framework Documentation
**Application:** Scruffy Butts - Dog Grooming Management System  
**Date:** January 28, 2026  
**Purpose:** Comprehensive audit and migration planning for Supabase migration

---

## Overview

This documentation package provides a complete audit of the application's current architecture, data model, business rules, and a detailed migration plan to Supabase. The audit follows the 10-step Master Audit Framework methodology.

---

## Documentation Files

### 1. [UI Surface Map](./01-UI-SURFACE-MAP.md)
**Purpose:** Complete inventory of every screen, component, modal, and UI touchpoint

**Contents:**
- Navigation structure (10 top-level tabs)
- Page inventory (35+ pages with routes)
- Shared components (50+ reusable components)
- Modal/dialog inventory (10+ dialog types)
- State management summary
- User flow diagrams
- Responsive design notes
- Animation inventory

**Key Findings:**
- 35+ distinct pages
- 50+ reusable components
- 10+ modal/dialog types
- 15+ KV-persisted state stores
- Multi-view systems (Calendar/List/Groomer views)

---

### 2. [Entity Dictionary](./02-ENTITY-DICTIONARY.md)
**Purpose:** Canonical data model for all entities with fields, types, and relationships

**Contents:**
- Core entities (13 total)
- Field specifications with types and validation rules
- Relationship mappings
- Business logic embedded in entities
- Data type reference
- Enums and constants
- Missing/incomplete entities

**Core Entities:**
1. Client - Customer information
2. Pet - Animal records with weight-based categorization
3. Appointment - Scheduling with status lifecycle
4. Staff - Employee management with compensation
5. PendingStaff - Invitation workflow
6. Service - Main grooming services
7. AddOn - Additional services
8. Transaction - POS sales records
9. InventoryItem - Retail and supply tracking
10. InventoryValueSnapshot - Historical value tracking
11. ExpenseRecord - Business expenses
12. PaymentDetail - Manual payment records
13. PayrollPeriod - Staff earnings calculation

**Key Findings:**
- 13 core entities
- 150+ fields across all entities
- 20+ foreign key relationships
- Auto-calculated fields (weight category, pricing)
- Complex compensation structures (7 types)

---

### 3. [Touchpoint Matrix](./03-TOUCHPOINT-MATRIX.md)
**Purpose:** Complete CRUD operation mapping with validations and side effects

**Contents:**
- CRUD operations for each entity
- UI locations and triggers
- Form validations
- Business rule enforcement
- Side effects and cascading operations
- Auto-calculations
- Error handling patterns
- Persistence patterns

**Key Findings:**
- 50+ CRUD operations documented
- 30+ validation rules
- 20+ cascading side effects
- Auto-calculations: weight category, pricing, inventory values
- Critical missing features:
  - Photo upload persistence
  - Inventory decrement on sale
  - Multi-pet appointment handling
  - Groomer double-booking prevention

---

### 4. [Rules Specification](./04-RULES-SPEC.md)
**Purpose:** Complete specification of business rules, calculations, and constraints

**Contents:**
- Pricing rules (weight-based, add-ons, totals)
- Discount and fee rules
- Tax rules (not implemented)
- Commission and payroll rules (7 types)
- Overtime calculation (1.5× after 40 hours)
- Pay period types (4 types)
- Business hours and scheduling
- Timezone handling
- Groomer assignment algorithm
- Inventory rules and valuation
- Appointment workflow and status lifecycle
- Data validation rules
- Missing implementations

**Key Calculations:**
1. **Service Pricing**: Weight-based tiers (small/medium/large/giant)
2. **Appointment Total**: Main service + add-ons by weight
3. **Transaction Total**: Subtotal - discount + fees
4. **Overtime Pay**: Hours × rate × 1.5 (after 40 hours)
5. **Commission**: Revenue × commission rate
6. **Inventory Value**: Cost × quantity + potential profit
7. **Groomer Assignment**: Lowest appointment count

**Key Findings:**
- 50+ business rules documented
- 15+ calculation formulas
- 8+ critical missing implementations
- Timezone implementation incomplete
- Tax system not implemented
- Locking rules not implemented

---

### 5. [Migration Wiring Table](./05-MIGRATION-WIRING-TABLE.md)
**Purpose:** Step-by-step migration plan from KV storage to Supabase with exact mappings

**Contents:**
- Current vs target architecture
- Migration phases (4 phases, 6-8 weeks)
- Supabase schema design for all entities
- Database table creation scripts
- Row Level Security (RLS) policies
- Triggers and stored procedures
- React Query integration examples
- Real-time subscription setup
- Data migration scripts
- Authentication and authorization
- Migration checklist
- Rollback plan
- Performance and security considerations

**Migration Phases:**
1. **Foundation** (1-2 weeks) - Setup Supabase, create schema, implement RLS
2. **Core Entities** (2-3 weeks) - Clients, Pets, Appointments, Staff
3. **Transactions** (1-2 weeks) - POS, Inventory, Finances
4. **Settings & Cleanup** (1 week) - Configuration, remove useKV

**Key Findings:**
- 20+ Supabase tables required
- 13 entity migrations
- 5+ stored procedures/functions
- Real-time subscriptions for calendar
- React Query replaces useKV
- Incremental migration with rollback capability

---

## Quick Reference

### Application Stack
- **Frontend:** React 19 + TypeScript + Vite
- **UI:** shadcn/ui + Tailwind CSS
- **State:** React useState + useKV (localStorage)
- **Routing:** React Router v7
- **Icons:** Phosphor Icons + Lucide React

### Current Storage
- **Mechanism:** localStorage with `kv:` prefix
- **Format:** JSON serialization
- **Limitations:** No backend, no auth, no multi-user

### Target Stack (Post-Migration)
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **State:** React Query + useState
- **Real-time:** Supabase subscriptions
- **Auth:** Supabase Auth with RLS

---

## Critical Issues Identified

From AUDIT_REPORT.md and audit findings:

### High Priority (Fix Before Migration)
1. **Inventory Data Loss** - Default inventory never persisted
2. **Unsafe State Updates** - Direct references instead of functional updates
3. **Timezone Not Implemented** - Appointments use browser time
4. **Breed Combobox Value Display** - Selected value not showing
5. **Appointment Date Off-by-One** - Timezone conversion issues

### Medium Priority
6. **Photo Uploads Not Persisted** - File objects need base64 conversion
7. **Inventory Decrement Missing** - POS doesn't reduce stock
8. **Multi-Pet Appointments Incomplete** - UI exists, logic missing
9. **Staff Workload Balancing** - Uses mock data
10. **Payment Method Settings** - Not connected to POS

### Low Priority
11. **Missing Form Validations** - Incomplete error messages
12. **No Loading States** - KV operations are async
13. **Mobile Responsiveness** - Desktop-focused design
14. **Status Colors** - Too dull/washed out

---

## Usage Guide

### For Developers
1. Read **UI Surface Map** to understand application structure
2. Read **Entity Dictionary** to understand data model
3. Read **Touchpoint Matrix** to understand data flow
4. Read **Rules Specification** to understand business logic
5. Read **Migration Wiring Table** to plan migration

### For Project Managers
1. Review **Migration Wiring Table** for timeline estimates
2. Review **Critical Issues** for pre-migration fixes
3. Use migration checklist for project tracking

### For Database Architects
1. Review **Entity Dictionary** for relationships
2. Review **Migration Wiring Table** for schema design
3. Review **Rules Specification** for constraint requirements

---

## Next Steps

### Before Migration
1. Fix critical issues (items 1-5)
2. Implement missing validations
3. Complete photo upload persistence
4. Test timezone handling
5. Set up Supabase project

### During Migration
1. Follow phase-by-phase approach
2. Test each entity migration independently
3. Keep rollback capability
4. Monitor performance
5. Validate data integrity

### After Migration
1. Enable multi-user authentication
2. Implement advanced features (breed pricing, locking)
3. Optimize queries and indexes
4. Set up monitoring and alerts
5. Train users on new features

---

## Maintenance

These documents should be updated when:
- New features are added
- Entities are modified
- Business rules change
- UI components are added/removed
- Migration progress is made

---

## Document Statistics

| Document | Pages | Sections | Entities/Items |
|----------|-------|----------|----------------|
| UI Surface Map | ~8,000 words | 10 | 35+ pages |
| Entity Dictionary | ~18,500 words | 13 | 13 entities |
| Touchpoint Matrix | ~24,500 words | 50+ | 50+ operations |
| Rules Spec | ~21,300 words | 12 | 50+ rules |
| Migration Wiring | ~30,200 words | 20+ | 20+ tables |
| **Total** | **~102,500 words** | **100+** | **150+ items** |

---

## Contributors

- **Framework:** Master Audit Framework (10-step methodology)
- **Application:** Scruffy Butts Grooming Management
- **Documentation Date:** January 28, 2026
- **Version:** 1.0

---

## License

This documentation is proprietary and confidential. It describes the internal architecture of the Scruffy Butts application and is intended for development team use only.

---

**For questions or clarifications, please refer to the specific documentation file or contact the development team.**
