# BLUEPRINT_UI_UX.md

**Scruffy Butts - Dog Grooming Management System**

This document serves as the canonical reference for the visual design system, tokens, and UI/UX conventions implemented throughout the application.

---

## 1) Repo & UI Source Map

### Application Structure

```
./workspaces/spark-template/
├── index.html                          # Main HTML entry point with Inter font
├── src/
│   ├── App.tsx                         # Root component with React Router setup
│   ├── main.tsx                        # Application mount point (do not modify)
│   ├── main.css                        # Structural CSS (do not modify)
│   ├── index.css                       # Theme definitions and custom utilities
│   ├── ErrorFallback.tsx               # Global error boundary component
│   ├── pages/                          # Route-level page components
│   │   ├── Dashboard.tsx               # Main dashboard with 11-card grid layout
│   │   ├── Appointments.tsx            # Appointments with Groomers/List/Calendar views
│   │   ├── NewAppointment.tsx          # Multi-step appointment creation form
│   │   ├── EditAppointment.tsx         # Appointment editing interface
│   │   ├── ClientsList.tsx             # Client directory listing
│   │   ├── ClientProfile.tsx           # Individual client details and pet management
│   │   ├── AddClient.tsx               # New client creation form
│   │   ├── EditClient.tsx              # Client information editing
│   │   ├── AddPet.tsx                  # New pet addition form with breed combobox
│   │   ├── PaymentHistory.tsx          # Client payment history page
│   │   ├── ContactInfo.tsx             # Client contact details page
│   │   ├── Staff.tsx                   # Staff management with list/payroll tabs
│   │   ├── StaffProfile.tsx            # Individual staff member details
│   │   ├── StaffPayrollBreakdown.tsx   # Detailed payroll breakdown page
│   │   ├── POS.tsx                     # Point of sale system
│   │   ├── Inventory.tsx               # Inventory management
│   │   ├── Finances.tsx                # Financial dashboard with sub-tabs
│   │   ├── Settings.tsx                # Application settings and configuration
│   │   └── PlaceholderPage.tsx         # Generic placeholder for future routes
│   ├── components/                     # Reusable component library
│   │   ├── TopNav.tsx                  # Main navigation bar
│   │   ├── PetCard.tsx                 # Pet display card with edit functionality
│   │   ├── BreedCombobox.tsx           # Searchable breed selection component
│   │   ├── EditPetDialog.tsx           # Pet information editing dialog
│   │   ├── StatWidget.tsx              # Metric display widget
│   │   ├── FinancialChart.tsx          # Financial data visualization
│   │   ├── PayrollOverview.tsx         # Payroll summary component
│   │   ├── StaffPayrollDetail.tsx      # Individual staff payroll details
│   │   ├── StaffScheduleView.tsx       # Staff scheduling interface
│   │   ├── GroomingPreferencesCard.tsx # Pet grooming preferences display
│   │   ├── MedicalInfoCard.tsx         # Pet medical information card
│   │   ├── PhotoGalleryCard.tsx        # Before/after photo gallery
│   │   ├── ServiceHistoryCard.tsx      # Pet service history timeline
│   │   ├── PaymentHistoryDialog.tsx    # Payment history modal (legacy)
│   │   ├── appointments/               # Appointment-specific components
│   │   └── ui/                         # shadcn/ui component library (40+ components)
│   ├── hooks/                          # Custom React hooks
│   │   └── use-mobile.ts               # Mobile breakpoint detection hook
│   ├── lib/                            # Utility functions and helpers
│   │   └── utils.ts                    # Class name merging utility (cn)
│   └── styles/                         # Additional styling
│       └── theme.css                   # Theme-specific overrides
```

### Key Routing Structure

The application uses React Router v7 with the following primary routes:

- `/` - Dashboard (11-card fixed grid)
- `/appointments` - Appointments management (Groomers/List/Calendar views)
- `/appointments/new` - Create new appointment
- `/appointments/:appointmentId/edit` - Edit existing appointment
- `/clients` - Client directory
- `/clients/new` - Add new client
- `/clients/:clientId` - Client profile
- `/clients/:clientId/edit` - Edit client information
- `/clients/:clientId/add-pet` - Add pet to client
- `/clients/:clientId/payment-history` - Client payment history
- `/clients/:clientId/contact` - Client contact information
- `/staff` - Staff management (includes payroll sub-tab)
- `/staff/:staffId` - Staff member profile
- `/staff/:staffId/payroll-breakdown` - Detailed payroll breakdown
- `/pos` - Point of Sale system
- `/inventory` - Inventory management
- `/finances` - Financial dashboard (Dashboard/Expenses/Payments/Payroll/Taxes sub-tabs)
- `/settings` - Application settings (Business/Staff Positions/Payment Methods)

### Component Library

**shadcn/ui v4** components are pre-installed in `src/components/ui/`:
- accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb
- button, calendar, card, carousel, chart, checkbox, collapsible, command
- context-menu, dialog, drawer, dropdown-menu, form, hover-card
- input-otp, input, label, menubar, navigation-menu, pagination
- popover, progress, radio-group, resizable, scroll-area, select
- separator, sheet, sidebar, skeleton, slider, sonner (toast notifications)
- switch, table, tabs, textarea, toggle-group, toggle, tooltip

### Icon Library

**@phosphor-icons/react** is used throughout for consistent iconography.

### Data Persistence

**useKV hook** from `@github/spark/hooks` is used for all data persistence (clients, pets, appointments, staff, inventory, etc.).

---

## 2) Color Tokens (exact values)

The application uses a dark-themed color palette with teal/cyan accents. All colors are defined using the `oklch` color space for perceptual uniformity.

### Core Background & Foreground

```css
--background: oklch(0.18 0.04 250);
/* Deep blue-gray background, almost charcoal */

--foreground: oklch(0.98 0 0);
/* Nearly white text for maximum contrast */
```

### Card Surfaces

```css
--card: oklch(0.22 0.04 250);
/* Slightly lighter than background for elevation */

--card-foreground: oklch(0.98 0 0);
/* Same as foreground for consistency */
```

### Popover & Dialog Surfaces

```css
--popover: oklch(0.22 0.04 250);
/* Matches card surface */

--popover-foreground: oklch(0.98 0 0);
/* Consistent text color */
```

### Primary Action Color (Teal/Cyan)

```css
--primary: oklch(0.75 0.15 195);
/* Bright teal-cyan, used for primary buttons and accents */

--primary-foreground: oklch(0.18 0.04 250);
/* Dark text on teal background for readability */
```

### Secondary Action Color

```css
--secondary: oklch(0.30 0.05 250);
/* Muted blue-gray for secondary actions */

--secondary-foreground: oklch(0.98 0 0);
/* White text for contrast */
```

### Muted / Subdued Elements

```css
--muted: oklch(0.25 0.04 250);
/* Subtle background for disabled or de-emphasized content */

--muted-foreground: oklch(0.65 0.02 250);
/* Dimmed text for labels and secondary information */
```

### Accent Color

```css
--accent: oklch(0.75 0.15 195);
/* Same as primary - used for highlights and hover states */

--accent-foreground: oklch(0.18 0.04 250);
/* Dark text on accent background */
```

### Destructive / Error Color

```css
--destructive: oklch(0.55 0.22 25);
/* Warm red-orange for delete and error actions */

--destructive-foreground: oklch(0.98 0 0);
/* White text on destructive background */
```

### Borders & Inputs

```css
--border: oklch(0.35 0.05 250);
/* Subtle border color, visible but not dominant */

--input: oklch(0.35 0.05 250);
/* Same as border for input fields */
```

### Focus Ring

```css
--ring: oklch(0.75 0.15 195);
/* Teal focus indicator matching primary color */
```

### WCAG Contrast Validation

All foreground/background pairings meet WCAG AA standards:

- **Background (0.18L) + Foreground (0.98L):** ~13:1 ratio ✓ (AAA)
- **Card (0.22L) + Card Foreground (0.98L):** ~11.5:1 ratio ✓ (AAA)
- **Primary (0.75L) + Primary Foreground (0.18L):** ~8:1 ratio ✓ (AAA)
- **Secondary (0.30L) + Secondary Foreground (0.98L):** ~9:1 ratio ✓ (AAA)
- **Muted (0.25L) + Foreground (0.98L):** ~10.5:1 ratio ✓ (AAA)
- **Muted Foreground (0.65L) + Background (0.18L):** ~5.2:1 ratio ✓ (AA)
- **Destructive (0.55L) + Destructive Foreground (0.98L):** ~5.8:1 ratio ✓ (AA)

---

## 3) Typography Tokens (exact values)

### Typeface

**Inter** (Google Fonts) is used exclusively throughout the application for its exceptional legibility and professional appearance.

```html
<!-- From index.html -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
/* Applied globally in index.css */
body {
  font-family: 'Inter', sans-serif;
}
```

### Font Weights

- **400 (Regular):** Body text, descriptions, secondary content
- **500 (Medium):** Labels, input placeholders, subtle emphasis
- **600 (Semibold):** Card titles, section headers, buttons
- **700 (Bold):** Page titles, primary headings, key metrics

### Typographic Hierarchy

The application uses Tailwind's default type scale with careful application of weights:

**Page Titles** (H1 equivalent)
- Class: `text-2xl font-bold` or `text-3xl font-bold`
- Size: 24px–30px
- Weight: 700
- Usage: Main page headers (e.g., "Dashboard", "Staff Management")

**Section Headers** (H2 equivalent)
- Class: `text-xl font-semibold` or `text-lg font-semibold`
- Size: 18px–20px
- Weight: 600
- Usage: Card titles, sub-section headers

**Subsection Headers** (H3 equivalent)
- Class: `text-base font-semibold` or `text-sm font-semibold`
- Size: 14px–16px
- Weight: 600
- Usage: Form section labels, widget titles

**Body Text**
- Class: `text-base` or `text-sm`
- Size: 14px–16px
- Weight: 400
- Usage: Paragraph content, descriptions, general text

**Labels & Captions**
- Class: `text-sm font-medium` or `text-xs font-medium`
- Size: 12px–14px
- Weight: 500
- Usage: Form labels, table headers, metadata

**Small Text**
- Class: `text-xs` or `text-xs text-muted-foreground`
- Size: 12px
- Weight: 400–500
- Usage: Timestamps, helper text, footnotes

**Metric Numbers**
- Class: `text-2xl font-bold` or `text-3xl font-bold`
- Size: 24px–30px
- Weight: 700
- Usage: Statistics, dashboard metrics, totals

**Button Text**
- Class: `text-sm font-medium`
- Size: 14px
- Weight: 500
- Usage: All button labels

### Line Height & Spacing

- **Headings:** Tight leading (`leading-tight` = 1.25)
- **Body text:** Normal leading (`leading-normal` = 1.5)
- **Compact UI elements:** Relaxed leading (`leading-relaxed` = 1.625)
- **Paragraph spacing:** `space-y-2` or `space-y-3` (8px–12px)

---

## 4) Spacing / Radius / Border / Shadow Tokens

### Border Radius

The application uses rounded corners throughout with a base radius of **0.75rem (12px)**.

```css
--radius: 0.75rem;
```

**Radius Scale:**
```css
--radius-sm: calc(var(--radius) * 0.5);   /* 6px */
--radius-md: var(--radius);                /* 12px */
--radius-lg: calc(var(--radius) * 1.5);    /* 18px */
--radius-xl: calc(var(--radius) * 2);      /* 24px */
--radius-2xl: calc(var(--radius) * 3);     /* 36px */
--radius-full: 9999px;                     /* Pill shape */
```

**Application:**
- **Cards:** `rounded-lg` (12px) for primary cards
- **Buttons:** `rounded-md` (12px) via shadcn button component
- **Inputs:** `rounded-md` (12px) for text fields
- **Badges/Pills:** `rounded-full` for tags and status indicators
- **Dialogs:** `rounded-lg` (12px) for modal containers
- **Small elements:** `rounded-sm` (6px) for compact UI pieces

### Spacing Scale

The application follows Tailwind's default spacing scale (0.25rem = 4px increments):

**Extra Tight (Information Dense Areas)**
- `gap-1` (4px): Between inline badges or icons
- `gap-2` (8px): Between form fields in compact layouts
- `space-y-1` (4px): Stacked labels and values

**Standard (Most Common)**
- `gap-3` (12px): **Primary spacing between cards on Dashboard and Finances**
- `gap-4` (16px): Between form sections
- `space-y-3` (12px): Dashboard container spacing
- `space-y-4` (16px): Standard vertical spacing in pages

**Generous (Content Sections)**
- `gap-6` (24px): Between major page sections
- `space-y-6` (24px): Large form section dividers
- `p-6` (24px): Standard card padding

**Layout Gaps:**
- Dashboard grid: `gap-3` (12px) on all devices
- Form grids: `gap-4` (16px) for breathing room
- Mobile: Spacing often reduced by 25-50% via responsive classes

### Padding

**Card Padding:**
- Standard: `p-4` (16px) or `p-6` (24px)
- Compact widgets: `p-3` (12px) or `p-4` (16px)
- Mobile: Often reduced to `p-3` (12px)

**Button Padding:**
- Default: `px-4 py-2` (16px horizontal, 8px vertical)
- Small: `px-3 py-1.5` (12px horizontal, 6px vertical)
- Large: `px-6 py-3` (24px horizontal, 12px vertical)

**Input Padding:**
- Text inputs: `px-3 py-2` (12px horizontal, 8px vertical)
- Via shadcn input component

**Container Padding:**
- Page containers: `p-4` on mobile, `p-6` on desktop
- Modal/Dialog content: `p-6` standard

### Borders

**Border Width:**
- Default: `border` (1px) for most UI elements
- Emphasis: `border-2` (2px) for active states or dividers
- None: `border-0` for seamless edges

**Border Colors:**
- Standard: `border-border` using `--border` token
- Inputs: `border-input` using `--input` token
- Transparent: `border-transparent` for invisible borders with layout preservation

**Border Application:**
- All cards: `border border-border`
- Input fields: `border border-input`
- Table rows: `border-b border-border`
- Dividers: `border-t border-border` or Separator component

### Shadows

The application uses **minimal shadows** to maintain the flat, modern aesthetic of the dark theme.

**Elevation Strategy:**
- Primary elevation: **Border + background color difference**
- Secondary elevation: **Subtle shadows** on interactive elements

**Shadow Classes (Tailwind defaults):**
- `shadow-sm`: Very subtle, used on inputs and small cards
- `shadow`: Standard shadow for modals and popovers
- `shadow-md`: Medium shadow for dropdown menus
- `shadow-lg`: Larger shadow for dialogs and major overlays
- `shadow-none`: Removes shadow

**Application:**
- **Cards on Dashboard:** No shadow, elevation via border and background
- **Dialogs/Modals:** `shadow-lg` for depth separation
- **Dropdowns/Popovers:** `shadow-md` for floating appearance
- **Buttons:** No shadow in default state; optional subtle shadow on hover

### Scrollbars

Custom scrollbar styling for a polished experience:

```css
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: var(--muted-foreground);
}
```

**Usage:** Applied to scrollable areas like Recent Activity list, long tables, and overflow containers.

---

**END OF SECTION 4**

_Continuing with sections 5-9..._
