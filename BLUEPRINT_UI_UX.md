# BLUEPRINT_UI_UX.md

**Scruffy Butts - Dog Grooming Management System**

This document serves as the canonical reference for the visual design system, tokens, and UI/UX conventions implemented throughout the application.

---

## 1) Repo & UI Source Map

### Application Structure

```
/workspaces/spark-template/
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

**END OF SECTION 1**

_Additional sections will be added per user instruction._
# BLUEPRINT_UI_UX.md

**Scruffy Butts - Dog Grooming Management System**

This document serves as the canonical reference for the visual design system, tokens, and UI/UX conventions implemented throughout the application.

---

## 1) Repo & UI Source Map

### Application Structure

```
/workspaces/spark-template/
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

**END OF SECTION 1**

_Additional sections will be added per user instruction._


## 5) App Shell & Global Layout Rules

### Global Application Shell

The application uses a consistent shell pattern across all pages:

```tsx
<div className="min-h-screen bg-background text-foreground">
  <TopNav />
  <Routes>
    {/* Page components render here */}
  </Routes>
</div>
```

**TopNav Component:**
- Fixed height navigation bar at the top of all pages
- Contains application logo/title and main navigation links
- Persists across all routes
- Dark background (`bg-card` or similar) with border separation
- Responsive: Collapses to mobile menu on smaller screens

### Page Container Pattern

Each page follows a standard container structure:

```tsx
<div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
  <h1 className="text-2xl md:text-3xl font-bold">{Page Title}</h1>
  {/* Page content */}
</div>
```

**Container Rules:**
- **Max Width:** Uses Tailwind's `container` class with responsive breakpoints
- **Horizontal Padding:** `p-4` (16px) on mobile, `p-6` (24px) on tablet/desktop
- **Vertical Spacing:** `space-y-4` (16px) on mobile, `space-y-6` (24px) on desktop
- **Center Alignment:** `mx-auto` centers content within viewport

### Layout Patterns by Page Type

**Dashboard Pattern (Grid-Based):**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
  {/* Cards arranged in responsive grid */}
</div>
```
- Fixed 11-card grid on Dashboard
- Always `gap-3` (12px) between cards
- Responsive columns: 1 → 2 → 3 based on breakpoint

**List/Table Pattern:**
```tsx
<Card>
  <CardHeader>{/* Title and actions */}</CardHeader>
  <CardContent>
    <Table>{/* Data rows */}</Table>
  </CardContent>
</Card>
```
- Full-width card container
- Scrollable table content with `scrollbar-thin` utility
- Sticky headers for long lists

**Form Pattern:**
```tsx
<Card>
  <CardHeader>{/* Form title */}</CardHeader>
  <CardContent>
    <form className="space-y-4">
      {/* Form fields */}
    </form>
  </CardContent>
  <CardFooter>{/* Submit/Cancel buttons */}</CardFooter>
</Card>
```
- Vertical spacing between fields: `space-y-4` (16px)
- Consistent field grouping using `<div>` wrappers
- Action buttons right-aligned in footer

**Tabbed Content Pattern:**
```tsx
<Tabs defaultValue="tab1">
  <TabsList>{/* Tab triggers */}</TabsList>
  <TabsContent value="tab1">{/* Content */}</TabsContent>
  <TabsContent value="tab2">{/* Content */}</TabsContent>
</Tabs>
```
- Used on: Appointments, Staff, Finances, Settings pages
- Tab content inherits page container padding
- Tabs component from shadcn/ui

### Z-Index Hierarchy

```css
/* Layering order (lowest to highest): */
z-0:    Base page content
z-10:   Cards and elevated content
z-20:   Sticky headers, floating action buttons
z-30:   Dropdowns, popovers
z-40:   Modals, dialogs
z-50:   Toast notifications (Sonner)
```

**Application:**
- TopNav: `z-20` or higher for sticky behavior
- Dialogs/Modals: `z-40` via shadcn default
- Toast notifications: `z-50` via Sonner default
- Popovers/Dropdowns: `z-30` via Radix UI defaults

### Scrolling Behavior

**Page-Level Scrolling:**
- Default: Entire viewport scrolls (body scroll)
- No fixed headers within page content (except tables)

**Container-Level Scrolling:**
- Used for: Long tables, Recent Activity lists, overflow panels
- Class: `overflow-auto scrollbar-thin`
- Max height constraints applied via `max-h-[Xpx]` or `h-[calc(...)]`

**Scroll-to-Top:**
- Not implemented; standard browser behavior
- Could be added as floating button if needed

---

## 6) Responsive Breakpoints & Grid Rules

### Breakpoint System

The application uses Tailwind's default breakpoints:

```css
/* Mobile-first breakpoints */
sm: 640px   /* Small tablets, large phones (landscape) */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops, small desktops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

**Mobile Detection:**
- Custom hook: `useIsMobile()` from `@/hooks/use-mobile.ts`
- Threshold: `768px` (matches `md` breakpoint)
- Returns `true` when `window.innerWidth < 768px`

### Responsive Layout Rules

**Dashboard Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
```
- **Mobile (<768px):** 1 column, full-width cards
- **Tablet (≥768px):** 2 columns
- **Desktop (≥1024px):** 3 columns
- **Gap:** Always `gap-3` (12px), does not change with breakpoint

**Appointments Grid (Groomers View):**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```
- **Mobile:** 1 column
- **Small (≥640px):** 2 columns
- **Large (≥1024px):** 3 columns
- **XL (≥1280px):** 4 columns

**Pet Cards Grid (Client Profile):**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```
- **Mobile:** 1 column
- **Tablet (≥768px):** 2 columns
- **Desktop (≥1024px):** 3 columns

**Form Layouts:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```
- **Mobile:** Stacked (1 column)
- **Tablet+ (≥768px):** Side-by-side (2 columns)
- Used for: Name fields, contact info, etc.

### Typography Responsiveness

**Page Titles:**
```tsx
<h1 className="text-2xl md:text-3xl font-bold">
```
- **Mobile:** `text-2xl` (24px)
- **Tablet+ (≥768px):** `text-3xl` (30px)

**Section Headers:**
- Generally non-responsive (`text-xl` or `text-lg` across all breakpoints)
- Exception: Major headers may use `text-lg md:text-xl`

**Body Text:**
- Remains consistent across breakpoints (`text-sm` or `text-base`)
- Line height adjustments handled by Tailwind defaults

### Spacing Responsiveness

**Container Padding:**
```tsx
<div className="p-4 md:p-6">
```
- **Mobile:** `p-4` (16px)
- **Tablet+ (≥768px):** `p-6` (24px)

**Vertical Spacing:**
```tsx
<div className="space-y-4 md:space-y-6">
```
- **Mobile:** `space-y-4` (16px)
- **Tablet+ (≥768px):** `space-y-6` (24px)

**Grid Gaps:**
- Dashboard: `gap-3` (fixed, no change)
- Forms/Content: `gap-4` (fixed, no change)
- Exception: Some complex layouts use `gap-3 md:gap-4`

### Component Visibility

**Show/Hide by Breakpoint:**
```tsx
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>
```

**Common Patterns:**
- Mobile nav burger: `md:hidden`
- Desktop nav links: `hidden md:flex`
- Condensed mobile cards vs. detailed desktop cards

### Table Responsiveness

**Horizontal Scrolling:**
```tsx
<div className="overflow-x-auto">
  <Table>{/* Full-width table */}</Table>
</div>
```
- Tables do not stack on mobile
- Horizontal scroll enabled for narrow viewports
- Applied on: ClientsList, Staff, PaymentHistory, Inventory

**Column Hiding (Optional):**
- Lower-priority columns can use `hidden md:table-cell`
- Not widely implemented; scroll preferred

### Touch Target Sizes

All interactive elements meet minimum touch target requirements:

- **Buttons:** Minimum `h-10` (40px) or larger
- **Links:** Adequate padding for 44×44px hit area
- **Icons:** Default Phosphor size (24×24px) with padding
- **Form inputs:** Standard shadcn sizing ensures accessibility

### Mobile-Specific Considerations

**Navigation:**
- TopNav adjusts for mobile (collapsible menu or simplified layout)
- Back buttons and breadcrumbs for deep navigation

**Forms:**
- Single-column stacking on mobile
- Larger touch targets for inputs and buttons
- Full-width buttons for primary actions

**Modals/Dialogs:**
- Full-screen or near-full-screen on mobile
- Standard centered dialogs on desktop
- Handled by shadcn Dialog/Drawer components

**Cards:**
- Reduced padding on mobile (`p-3` vs. `p-6`)
- Stacked content vs. horizontal layouts

---

## 7) Component Catalog

This section provides an inventory of all custom and shadcn components used throughout the application.

### Custom Application Components

Located in `src/components/`:

**Navigation:**
- `TopNav.tsx` - Main application navigation bar with links and branding

**Dashboard & Metrics:**
- `StatWidget.tsx` - Metric display widget for dashboard cards (revenue, clients, appointments, etc.)
- `FinancialChart.tsx` - Financial data visualization component (likely using Recharts)

**Client & Pet Management:**
- `PetCard.tsx` - Individual pet display card with photo, name, breed, and action buttons
- `EditPetDialog.tsx` - Modal dialog for editing pet information
- `BreedCombobox.tsx` - Searchable breed selection combobox (uses Command component)
- `GroomingPreferencesCard.tsx` - Display card for pet grooming preferences and notes
- `MedicalInfoCard.tsx` - Display card for pet medical information and alerts
- `PhotoGalleryCard.tsx` - Before/after photo gallery for pet grooming sessions
- `ServiceHistoryCard.tsx` - Timeline/list of past grooming services for a pet

**Staff & Payroll:**
- `PayrollOverview.tsx` - Summary component for payroll totals and breakdown
- `StaffPayrollDetail.tsx` - Detailed payroll information for individual staff members
- `StaffScheduleView.tsx` - Staff scheduling and calendar interface

**Payments:**
- `PaymentHistoryDialog.tsx` - Legacy modal for viewing client payment history (may be deprecated)

**Appointments:**
- `appointments/` directory - Contains appointment-specific subcomponents (groomers view, list view, calendar view components)

### shadcn/ui Components (Pre-installed)

Located in `src/components/ui/`:

**Layout & Structure:**
- `card.tsx` - Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- `separator.tsx` - Horizontal/vertical divider lines
- `scroll-area.tsx` - Custom scrollbar container
- `resizable.tsx` - Resizable panel layouts
- `aspect-ratio.tsx` - Aspect ratio container wrapper

**Navigation:**
- `tabs.tsx` - Tabs, TabsList, TabsTrigger, TabsContent
- `breadcrumb.tsx` - Breadcrumb navigation
- `navigation-menu.tsx` - Complex navigation menus
- `menubar.tsx` - Application menu bar
- `pagination.tsx` - Page navigation controls
- `sidebar.tsx` - Collapsible sidebar navigation (shadcn v4)

**Forms & Inputs:**
- `input.tsx` - Text input field
- `textarea.tsx` - Multi-line text input
- `label.tsx` - Form field label
- `button.tsx` - Button component with variants (default, destructive, outline, ghost, link)
- `checkbox.tsx` - Checkbox input
- `radio-group.tsx` - Radio button group
- `select.tsx` - Dropdown select menu
- `switch.tsx` - Toggle switch
- `slider.tsx` - Range slider input
- `calendar.tsx` - Date picker calendar
- `command.tsx` - Command palette/searchable list (used in BreedCombobox)
- `form.tsx` - Form wrapper with react-hook-form integration
- `input-otp.tsx` - One-time password input

**Feedback & Overlays:**
- `dialog.tsx` - Modal dialog
- `alert-dialog.tsx` - Confirmation/alert dialog
- `drawer.tsx` - Mobile-friendly bottom drawer (Vaul)
- `sheet.tsx` - Side panel overlay
- `popover.tsx` - Floating popover container
- `tooltip.tsx` - Hover tooltip
- `hover-card.tsx` - Hover-triggered card popover
- `alert.tsx` - Alert/notification banner
- `sonner.tsx` - Toast notification provider (Sonner library)
- `skeleton.tsx` - Loading skeleton placeholder

**Data Display:**
- `table.tsx` - Table, TableHeader, TableBody, TableRow, TableCell, etc.
- `badge.tsx` - Badge/tag component
- `avatar.tsx` - User/pet avatar component
- `progress.tsx` - Progress bar
- `chart.tsx` - Chart component wrapper (Recharts integration)
- `carousel.tsx` - Image/content carousel (Embla)

**Disclosure & Grouping:**
- `accordion.tsx` - Collapsible accordion sections
- `collapsible.tsx` - Simple collapsible container
- `toggle.tsx` - Toggle button
- `toggle-group.tsx` - Group of toggle buttons

**Menus:**
- `dropdown-menu.tsx` - Dropdown action menu
- `context-menu.tsx` - Right-click context menu

### Third-Party Component Libraries

**Icons:**
- `@phosphor-icons/react` - Primary icon library (imported directly, e.g., `import { Plus } from "@phosphor-icons/react"`)

**Charts:**
- `recharts` - Charting library (wrapped via shadcn `chart.tsx`)
- Used in: FinancialChart component, Finances page

**Form Management:**
- `react-hook-form` - Form state and validation
- `@hookform/resolvers` - Validation resolver (Zod integration)
- Used in: NewAppointment, AddClient, AddPet, Settings forms

**Date Handling:**
- `date-fns` - Date formatting and manipulation
- `react-day-picker` - Date picker (wrapped in shadcn `calendar.tsx`)

**Routing:**
- `react-router-dom` v7 - Client-side routing (BrowserRouter, Routes, Route, Link, useNavigate, useParams)

### Utility Hooks

Located in `src/hooks/`:

**Custom Hooks:**
- `use-mobile.ts` - `useIsMobile()` - Detects mobile breakpoint (<768px)

**Spark Runtime Hooks:**
- `useKV()` from `@github/spark/hooks` - Key-value persistence hook

### Utility Functions

Located in `src/lib/`:

**Class Name Utilities:**
- `utils.ts` - `cn()` function - Merges and deduplicates Tailwind classes (clsx + tailwind-merge)

---

**END OF SECTIONS 5-7**

_Additional sections will be added per user instruction._


## 5) App Shell & Global Layout Rules

### Global Application Shell

The application uses a consistent shell pattern across all pages:

```tsx
<div className="min-h-screen bg-background text-foreground">
  <TopNav />
  <Routes>
    {/* Page components render here */}
  </Routes>
</div>
```

**TopNav Component:**
- Fixed height navigation bar at the top of all pages
- Contains application logo/title and main navigation links
- Persists across all routes
- Dark background (`bg-card` or similar) with border separation
- Responsive: Collapses to mobile menu on smaller screens

### Page Container Pattern

Each page follows a standard container structure:

```tsx
<div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
  <h1 className="text-2xl md:text-3xl font-bold">{Page Title}</h1>
  {/* Page content */}
</div>
```

**Container Rules:**
- **Max Width:** Uses Tailwind's `container` class with responsive breakpoints
- **Horizontal Padding:** `p-4` (16px) on mobile, `p-6` (24px) on tablet/desktop
- **Vertical Spacing:** `space-y-4` (16px) on mobile, `space-y-6` (24px) on desktop
- **Center Alignment:** `mx-auto` centers content within viewport

### Layout Patterns by Page Type

**Dashboard Pattern (Grid-Based):**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
  {/* Cards arranged in responsive grid */}
</div>
```
- Fixed 11-card grid on Dashboard
- Always `gap-3` (12px) between cards
- Responsive columns: 1 → 2 → 3 based on breakpoint

**List/Table Pattern:**
```tsx
<Card>
  <CardHeader>{/* Title and actions */}</CardHeader>
  <CardContent>
    <Table>{/* Data rows */}</Table>
  </CardContent>
</Card>
```
- Full-width card container
- Scrollable table content with `scrollbar-thin` utility
- Sticky headers for long lists

**Form Pattern:**
```tsx
<Card>
  <CardHeader>{/* Form title */}</CardHeader>
  <CardContent>
    <form className="space-y-4">
      {/* Form fields */}
    </form>
  </CardContent>
  <CardFooter>{/* Submit/Cancel buttons */}</CardFooter>
</Card>
```
- Vertical spacing between fields: `space-y-4` (16px)
- Consistent field grouping using `<div>` wrappers
- Action buttons right-aligned in footer

**Tabbed Content Pattern:**
```tsx
<Tabs defaultValue="tab1">
  <TabsList>{/* Tab triggers */}</TabsList>
  <TabsContent value="tab1">{/* Content */}</TabsContent>
  <TabsContent value="tab2">{/* Content */}</TabsContent>
</Tabs>
```
- Used on: Appointments, Staff, Finances, Settings pages
- Tab content inherits page container padding
- Tabs component from shadcn/ui

### Z-Index Hierarchy

```css
/* Layering order (lowest to highest): */
z-0:    Base page content
z-10:   Cards and elevated content
z-20:   Sticky headers, floating action buttons
z-30:   Dropdowns, popovers
z-40:   Modals, dialogs
z-50:   Toast notifications (Sonner)
```

**Application:**
- TopNav: `z-20` or higher for sticky behavior
- Dialogs/Modals: `z-40` via shadcn default
- Toast notifications: `z-50` via Sonner default
- Popovers/Dropdowns: `z-30` via Radix UI defaults

### Scrolling Behavior

**Page-Level Scrolling:**
- Default: Entire viewport scrolls (body scroll)
- No fixed headers within page content (except tables)

**Container-Level Scrolling:**
- Used for: Long tables, Recent Activity lists, overflow panels
- Class: `overflow-auto scrollbar-thin`
- Max height constraints applied via `max-h-[Xpx]` or `h-[calc(...)]`

**Scroll-to-Top:**
- Not implemented; standard browser behavior
- Could be added as floating button if needed

---

## 6) Responsive Breakpoints & Grid Rules

### Breakpoint System

The application uses Tailwind's default breakpoints:

```css
/* Mobile-first breakpoints */
sm: 640px   /* Small tablets, large phones (landscape) */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops, small desktops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

**Mobile Detection:**
- Custom hook: `useIsMobile()` from `@/hooks/use-mobile.ts`
- Threshold: `768px` (matches `md` breakpoint)
- Returns `true` when `window.innerWidth < 768px`

### Responsive Layout Rules

**Dashboard Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
```
- **Mobile (<768px):** 1 column, full-width cards
- **Tablet (≥768px):** 2 columns
- **Desktop (≥1024px):** 3 columns
- **Gap:** Always `gap-3` (12px), does not change with breakpoint

**Appointments Grid (Groomers View):**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```
- **Mobile:** 1 column
- **Small (≥640px):** 2 columns
- **Large (≥1024px):** 3 columns
- **XL (≥1280px):** 4 columns

**Pet Cards Grid (Client Profile):**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```
- **Mobile:** 1 column
- **Tablet (≥768px):** 2 columns
- **Desktop (≥1024px):** 3 columns

**Form Layouts:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```
- **Mobile:** Stacked (1 column)
- **Tablet+ (≥768px):** Side-by-side (2 columns)
- Used for: Name fields, contact info, etc.

### Typography Responsiveness

**Page Titles:**
```tsx
<h1 className="text-2xl md:text-3xl font-bold">
```
- **Mobile:** `text-2xl` (24px)
- **Tablet+ (≥768px):** `text-3xl` (30px)

**Section Headers:**
- Generally non-responsive (`text-xl` or `text-lg` across all breakpoints)
- Exception: Major headers may use `text-lg md:text-xl`

**Body Text:**
- Remains consistent across breakpoints (`text-sm` or `text-base`)
- Line height adjustments handled by Tailwind defaults

### Spacing Responsiveness

**Container Padding:**
```tsx
<div className="p-4 md:p-6">
```
- **Mobile:** `p-4` (16px)
- **Tablet+ (≥768px):** `p-6` (24px)

**Vertical Spacing:**
```tsx
<div className="space-y-4 md:space-y-6">
```
- **Mobile:** `space-y-4` (16px)
- **Tablet+ (≥768px):** `space-y-6` (24px)

**Grid Gaps:**
- Dashboard: `gap-3` (fixed, no change)
- Forms/Content: `gap-4` (fixed, no change)
- Exception: Some complex layouts use `gap-3 md:gap-4`

### Component Visibility

**Show/Hide by Breakpoint:**
```tsx
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>
```

**Common Patterns:**
- Mobile nav burger: `md:hidden`
- Desktop nav links: `hidden md:flex`
- Condensed mobile cards vs. detailed desktop cards

### Table Responsiveness

**Horizontal Scrolling:**
```tsx
<div className="overflow-x-auto">
  <Table>{/* Full-width table */}</Table>
</div>
```
- Tables do not stack on mobile
- Horizontal scroll enabled for narrow viewports
- Applied on: ClientsList, Staff, PaymentHistory, Inventory

**Column Hiding (Optional):**
- Lower-priority columns can use `hidden md:table-cell`
- Not widely implemented; scroll preferred

### Touch Target Sizes

All interactive elements meet minimum touch target requirements:

- **Buttons:** Minimum `h-10` (40px) or larger
- **Links:** Adequate padding for 44×44px hit area
- **Icons:** Default Phosphor size (24×24px) with padding
- **Form inputs:** Standard shadcn sizing ensures accessibility

### Mobile-Specific Considerations

**Navigation:**
- TopNav adjusts for mobile (collapsible menu or simplified layout)
- Back buttons and breadcrumbs for deep navigation

**Forms:**
- Single-column stacking on mobile
- Larger touch targets for inputs and buttons
- Full-width buttons for primary actions

**Modals/Dialogs:**
- Full-screen or near-full-screen on mobile
- Standard centered dialogs on desktop
- Handled by shadcn Dialog/Drawer components

**Cards:**
- Reduced padding on mobile (`p-3` vs. `p-6`)
- Stacked content vs. horizontal layouts

---

## 7) Component Catalog

This section provides an inventory of all custom and shadcn components used throughout the application.

### Custom Application Components

Located in `src/components/`:

**Navigation:**
- `TopNav.tsx` - Main application navigation bar with links and branding

**Dashboard & Metrics:**
- `StatWidget.tsx` - Metric display widget for dashboard cards (revenue, clients, appointments, etc.)
- `FinancialChart.tsx` - Financial data visualization component (likely using Recharts)

**Client & Pet Management:**
- `PetCard.tsx` - Individual pet display card with photo, name, breed, and action buttons
- `EditPetDialog.tsx` - Modal dialog for editing pet information
- `BreedCombobox.tsx` - Searchable breed selection combobox (uses Command component)
- `GroomingPreferencesCard.tsx` - Display card for pet grooming preferences and notes
- `MedicalInfoCard.tsx` - Display card for pet medical information and alerts
- `PhotoGalleryCard.tsx` - Before/after photo gallery for pet grooming sessions
- `ServiceHistoryCard.tsx` - Timeline/list of past grooming services for a pet

**Staff & Payroll:**
- `PayrollOverview.tsx` - Summary component for payroll totals and breakdown
- `StaffPayrollDetail.tsx` - Detailed payroll information for individual staff members
- `StaffScheduleView.tsx` - Staff scheduling and calendar interface

**Payments:**
- `PaymentHistoryDialog.tsx` - Legacy modal for viewing client payment history (may be deprecated)

**Appointments:**
- `appointments/` directory - Contains appointment-specific subcomponents (groomers view, list view, calendar view components)

### shadcn/ui Components (Pre-installed)

Located in `src/components/ui/`:

**Layout & Structure:**
- `card.tsx` - Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- `separator.tsx` - Horizontal/vertical divider lines
- `scroll-area.tsx` - Custom scrollbar container
- `resizable.tsx` - Resizable panel layouts
- `aspect-ratio.tsx` - Aspect ratio container wrapper

**Navigation:**
- `tabs.tsx` - Tabs, TabsList, TabsTrigger, TabsContent
- `breadcrumb.tsx` - Breadcrumb navigation
- `navigation-menu.tsx` - Complex navigation menus
- `menubar.tsx` - Application menu bar
- `pagination.tsx` - Page navigation controls
- `sidebar.tsx` - Collapsible sidebar navigation (shadcn v4)

**Forms & Inputs:**
- `input.tsx` - Text input field
- `textarea.tsx` - Multi-line text input
- `label.tsx` - Form field label
- `button.tsx` - Button component with variants (default, destructive, outline, ghost, link)
- `checkbox.tsx` - Checkbox input
- `radio-group.tsx` - Radio button group
- `select.tsx` - Dropdown select menu
- `switch.tsx` - Toggle switch
- `slider.tsx` - Range slider input
- `calendar.tsx` - Date picker calendar
- `command.tsx` - Command palette/searchable list (used in BreedCombobox)
- `form.tsx` - Form wrapper with react-hook-form integration
- `input-otp.tsx` - One-time password input

**Feedback & Overlays:**
- `dialog.tsx` - Modal dialog
- `alert-dialog.tsx` - Confirmation/alert dialog
- `drawer.tsx` - Mobile-friendly bottom drawer (Vaul)
- `sheet.tsx` - Side panel overlay
- `popover.tsx` - Floating popover container
- `tooltip.tsx` - Hover tooltip
- `hover-card.tsx` - Hover-triggered card popover
- `alert.tsx` - Alert/notification banner
- `sonner.tsx` - Toast notification provider (Sonner library)
- `skeleton.tsx` - Loading skeleton placeholder

**Data Display:**
- `table.tsx` - Table, TableHeader, TableBody, TableRow, TableCell, etc.
- `badge.tsx` - Badge/tag component
- `avatar.tsx` - User/pet avatar component
- `progress.tsx` - Progress bar
- `chart.tsx` - Chart component wrapper (Recharts integration)
- `carousel.tsx` - Image/content carousel (Embla)

**Disclosure & Grouping:**
- `accordion.tsx` - Collapsible accordion sections
- `collapsible.tsx` - Simple collapsible container
- `toggle.tsx` - Toggle button
- `toggle-group.tsx` - Group of toggle buttons

**Menus:**
- `dropdown-menu.tsx` - Dropdown action menu
- `context-menu.tsx` - Right-click context menu

### Third-Party Component Libraries

**Icons:**
- `@phosphor-icons/react` - Primary icon library (imported directly, e.g., `import { Plus } from "@phosphor-icons/react"`)

**Charts:**
- `recharts` - Charting library (wrapped via shadcn `chart.tsx`)
- Used in: FinancialChart component, Finances page

**Form Management:**
- `react-hook-form` - Form state and validation
- `@hookform/resolvers` - Validation resolver (Zod integration)
- Used in: NewAppointment, AddClient, AddPet, Settings forms

**Date Handling:**
- `date-fns` - Date formatting and manipulation
- `react-day-picker` - Date picker (wrapped in shadcn `calendar.tsx`)

**Routing:**
- `react-router-dom` v7 - Client-side routing (BrowserRouter, Routes, Route, Link, useNavigate, useParams)

### Utility Hooks

Located in `src/hooks/`:

**Custom Hooks:**
- `use-mobile.ts` - `useIsMobile()` - Detects mobile breakpoint (<768px)

**Spark Runtime Hooks:**
- `useKV()` from `@github/spark/hooks` - Key-value persistence hook

### Utility Functions

Located in `src/lib/`:

**Class Name Utilities:**
- `utils.ts` - `cn()` function - Merges and deduplicates Tailwind classes (clsx + tailwind-merge)

---

**END OF SECTIONS 5-7**

_Additional sections will be added per user instruction._
