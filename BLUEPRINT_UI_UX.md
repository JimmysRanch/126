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

---

## 8) Interaction States

This section documents all interactive element states, their visual treatments, and touch target requirements.

### Button States

**Primary Button (`variant="default"`):**

```tsx
<Button>Label</Button>
```

- **Default (Rest):**
  - Background: `bg-primary` (teal oklch(0.75 0.15 195))
  - Text: `text-primary-foreground` (dark blue-gray)
  - Border: None
  - Shadow: None
  - Cursor: `cursor-pointer`

- **Hover:**
  - Background: Slightly lighter teal (handled by shadcn internal hover state)
  - Visual: Subtle brightness increase
  - Transition: 200ms ease
  - Cursor: `cursor-pointer`

- **Active/Pressed:**
  - Background: Slightly darker than default
  - Visual: Appears depressed
  - Scale: No scale transform used
  - Duration: Instant feedback

- **Focus (Keyboard):**
  - Outline: `ring-2 ring-ring ring-offset-2`
  - Ring Color: `--ring` (teal oklch(0.75 0.15 195))
  - Ring Offset: 2px background-colored gap
  - Visible focus indicator for accessibility

- **Disabled:**
  - Background: `bg-muted` (desaturated)
  - Text: `text-muted-foreground` (dimmed)
  - Opacity: 50% (`opacity-50`)
  - Cursor: `cursor-not-allowed`
  - No hover effects
  - Non-interactive

- **Loading:**
  - Background: Same as default
  - Icon: Spinner or loading icon replaces or prepends text
  - Cursor: `cursor-wait` or `cursor-not-allowed`
  - Button remains pressable or disabled depending on implementation

**Secondary Button (`variant="secondary"`):**

- **Default:** `bg-secondary` / `text-secondary-foreground`
- **Hover:** Slightly lighter background
- **Active:** Slightly darker background
- **Focus:** Same ring treatment as primary
- **Disabled:** Same as primary disabled state

**Outline Button (`variant="outline"`):**

- **Default:**
  - Background: Transparent
  - Border: `border border-input`
  - Text: `text-foreground`

- **Hover:**
  - Background: `bg-accent` (teal accent)
  - Border: Same
  - Text: `text-accent-foreground`

- **Active:** Slightly darker background
- **Focus:** Same ring treatment
- **Disabled:** Muted border and text

**Ghost Button (`variant="ghost"`):**

- **Default:**
  - Background: Transparent
  - Border: None
  - Text: `text-foreground`

- **Hover:**
  - Background: `bg-accent` (subtle teal highlight)
  - Text: `text-accent-foreground`

- **Active:** Slightly darker background
- **Focus:** Same ring treatment
- **Disabled:** Muted text only

**Destructive Button (`variant="destructive"`):**

- **Default:** `bg-destructive` / `text-destructive-foreground` (red-orange)
- **Hover:** Slightly lighter or more saturated red
- **Active:** Darker red
- **Focus:** Ring with destructive color or standard ring
- **Disabled:** Muted, non-interactive

**Link Button (`variant="link"`):**

- **Default:**
  - Background: Transparent
  - Text: `text-primary` (teal, underlined)
  - Underline: `underline-offset-4`

- **Hover:**
  - Text: Slightly lighter or no change
  - Underline: Remains

- **Active:** Darker text
- **Focus:** Ring around text area
- **Disabled:** Muted text, no underline

**Touch Targets:**
- Minimum height: `h-10` (40px) for default size
- Small buttons: `h-9` (36px) - still meets accessibility minimums with padding
- Large buttons: `h-11` or `h-12` (44px–48px)
- Horizontal padding ensures adequate width for tap targets

### Input Field States

**Text Input (`<Input />`):**

```tsx
<Input placeholder="Enter text" />
```

- **Default (Rest):**
  - Background: Transparent or `bg-background`
  - Border: `border border-input` (subtle gray)
  - Text: `text-foreground`
  - Placeholder: `text-muted-foreground`
  - Padding: `px-3 py-2`

- **Hover:**
  - Border: Slightly lighter or same (minimal change)
  - Cursor: `cursor-text`

- **Focus (Active Input):**
  - Border: `border-input` (no color change)
  - Ring: `ring-2 ring-ring` (teal focus ring)
  - Outline: None (replaced by ring)
  - Background: Same as default

- **Filled (Has Value):**
  - Visual: Same as default
  - Text: `text-foreground`

- **Error/Invalid:**
  - Border: `border-destructive` (red-orange)
  - Ring (on focus): `ring-destructive`
  - Text: `text-destructive` (optional for error message below)

- **Disabled:**
  - Background: `bg-muted` or slightly darker
  - Border: `border-border` (dimmed)
  - Text: `text-muted-foreground`
  - Cursor: `cursor-not-allowed`
  - Non-editable

- **Read-Only:**
  - Background: Slightly different from default (optional)
  - Border: Same as default
  - Cursor: `cursor-default`
  - Non-editable but appears active

**Textarea (`<Textarea />`):**
- States identical to `<Input />`
- Min-height: Typically `min-h-[80px]` or larger
- Resizable: `resize-y` or `resize-none` depending on use case

**Touch Targets:**
- Input height: `h-10` (40px) minimum
- Vertical padding ensures comfortable tap area
- Label click targets extend to input via `<Label htmlFor="...">`

### Select / Dropdown States

**Select Trigger (`<Select />`):**

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Choose option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

- **Default (Closed):**
  - Background: Transparent or `bg-background`
  - Border: `border border-input`
  - Text: `text-foreground` or `text-muted-foreground` (placeholder)
  - Icon: Down chevron icon

- **Hover (Closed):**
  - Background: Slight highlight
  - Border: Same

- **Focus (Closed, Keyboard):**
  - Ring: `ring-2 ring-ring`

- **Open (Active):**
  - Border: `border-input`
  - Ring: `ring-2 ring-ring`
  - Icon: Up chevron (rotated)
  - Popover: Dropdown menu appears below/above trigger

- **Disabled:**
  - Background: `bg-muted`
  - Text: `text-muted-foreground`
  - Icon: Dimmed
  - Cursor: `cursor-not-allowed`

**Select Items (Options in Dropdown):**

- **Default:**
  - Background: Transparent
  - Text: `text-foreground`
  - Padding: `px-2 py-1.5`

- **Hover:**
  - Background: `bg-accent` (teal highlight)
  - Text: `text-accent-foreground`

- **Selected:**
  - Background: `bg-accent` (persistent)
  - Text: `text-accent-foreground`
  - Checkmark icon: Visible indicator

- **Focus (Keyboard):**
  - Background: Same as hover
  - Outline: Minimal or none (handled by parent popover)

### Checkbox States

**Checkbox (`<Checkbox />`):**

```tsx
<Checkbox id="terms" />
```

- **Unchecked (Default):**
  - Background: Transparent
  - Border: `border border-input` (gray)
  - Size: `h-4 w-4` (16×16px)
  - Icon: None

- **Unchecked Hover:**
  - Border: Slightly lighter or same
  - Background: Subtle highlight

- **Unchecked Focus:**
  - Ring: `ring-2 ring-ring`

- **Checked:**
  - Background: `bg-primary` (teal)
  - Border: `border-primary`
  - Icon: White checkmark (Phosphor `Check` icon)

- **Checked Hover:**
  - Background: Slightly lighter teal

- **Checked Focus:**
  - Background: `bg-primary`
  - Ring: `ring-2 ring-ring`

- **Indeterminate (Partial):**
  - Background: `bg-primary`
  - Icon: Dash/minus icon
  - Used for: "Select all" with partial selection

- **Disabled (Unchecked):**
  - Background: `bg-muted`
  - Border: `border-border` (dimmed)
  - Cursor: `cursor-not-allowed`

- **Disabled (Checked):**
  - Background: Dimmed primary color
  - Icon: Dimmed checkmark
  - Cursor: `cursor-not-allowed`

**Touch Targets:**
- Checkbox itself: 16×16px
- Click target extended by label: Full `<label>` area (typically 44×44px minimum with padding)

### Switch States

**Switch (`<Switch />`):**

```tsx
<Switch id="notifications" />
```

- **Off (Default):**
  - Track Background: `bg-input` (gray)
  - Thumb: White circle, positioned left
  - Size: `h-6 w-11` (24×44px)

- **Off Hover:**
  - Track: Slightly lighter

- **Off Focus:**
  - Ring: `ring-2 ring-ring`

- **On:**
  - Track Background: `bg-primary` (teal)
  - Thumb: White circle, positioned right
  - Animation: Smooth slide transition (150-200ms)

- **On Hover:**
  - Track: Slightly lighter teal

- **On Focus:**
  - Track: `bg-primary`
  - Ring: `ring-2 ring-ring`

- **Disabled (Off):**
  - Track: `bg-muted`
  - Thumb: Dimmed
  - Cursor: `cursor-not-allowed`

- **Disabled (On):**
  - Track: Dimmed teal
  - Thumb: Dimmed
  - Cursor: `cursor-not-allowed`

**Touch Targets:**
- Switch dimensions (24×44px) exceed minimum requirements

### Radio Button States

**Radio Group (`<RadioGroup />`):**

```tsx
<RadioGroup>
  <RadioGroupItem value="option1" id="opt1" />
</RadioGroup>
```

- **Unselected (Default):**
  - Background: Transparent
  - Border: `border border-input` (gray circle)
  - Size: `h-4 w-4` (16×16px)
  - Dot: None

- **Unselected Hover:**
  - Border: Slightly lighter

- **Unselected Focus:**
  - Ring: `ring-2 ring-ring`

- **Selected:**
  - Border: `border-primary` (teal)
  - Dot: Filled teal circle inside (60-70% of diameter)

- **Selected Hover:**
  - Border: Slightly lighter teal

- **Selected Focus:**
  - Border: `border-primary`
  - Ring: `ring-2 ring-ring`

- **Disabled (Unselected):**
  - Border: `border-border` (dimmed)
  - Cursor: `cursor-not-allowed`

- **Disabled (Selected):**
  - Border: Dimmed primary
  - Dot: Dimmed
  - Cursor: `cursor-not-allowed`

**Touch Targets:**
- Radio button: 16×16px
- Extended by label click area

### Link States

**Navigation Link (`<Link>` from react-router-dom):**

```tsx
<Link to="/clients">Clients</Link>
```

- **Default:**
  - Text: `text-foreground` or `text-primary` (depending on context)
  - Underline: None (navigation links) or `underline` (inline links)
  - Cursor: `cursor-pointer`

- **Hover:**
  - Text: `text-primary` or slightly lighter
  - Underline: Appears if not present, or remains
  - Background: Optional subtle highlight for nav items

- **Active (Current Page):**
  - Text: `text-primary` (teal)
  - Font Weight: `font-semibold` or `font-bold`
  - Background: `bg-accent` (in navigation bar)
  - Underline: Optional

- **Focus (Keyboard):**
  - Outline: `ring-2 ring-ring`
  - Offset: `ring-offset-2`

- **Visited:**
  - Same as default (no color change)

- **Disabled:**
  - Text: `text-muted-foreground`
  - Cursor: `cursor-not-allowed`
  - No underline
  - No hover effects

### Card Interactive States

**Card (Clickable/Interactive):**

Some cards act as navigation elements (e.g., PetCard, StatWidget with drill-down):

- **Default:**
  - Background: `bg-card`
  - Border: `border border-border`
  - Shadow: None
  - Cursor: `cursor-default` (non-interactive) or `cursor-pointer` (interactive)

- **Hover (Interactive):**
  - Background: Slightly lighter (`bg-accent` or subtle highlight)
  - Border: `border-primary` (teal) or same as default
  - Shadow: `shadow-sm` or `shadow-md` (optional)
  - Transition: 200ms ease

- **Active/Pressed (Interactive):**
  - Background: Slightly darker
  - Scale: No scale effect (maintains layout stability)

- **Focus (Keyboard, Interactive):**
  - Ring: `ring-2 ring-ring`

- **Selected/Active (State-based):**
  - Border: `border-primary` (teal, thicker: `border-2`)
  - Background: `bg-accent` or same as default
  - Indicator: Optional checkmark or icon

### Table Row States

**Table Row (`<TableRow>`):**

- **Default:**
  - Background: Transparent or `bg-card`
  - Border: `border-b border-border`
  - Text: `text-foreground`

- **Hover (if clickable):**
  - Background: `bg-accent` (subtle teal highlight)
  - Cursor: `cursor-pointer`
  - Transition: 150ms ease

- **Selected:**
  - Background: `bg-accent` (persistent)
  - Border: Same or slightly emphasized
  - Checkmark: In first column (if multi-select)

- **Focus (Keyboard):**
  - Outline: `ring-2 ring-ring` (inset or around row)

- **Active/Pressed:**
  - Background: Slightly darker than hover

### Badge States

**Badge (`<Badge />`):**

Badges are typically non-interactive, but can be dismissible:

- **Default:**
  - Background: `bg-primary` or variant color
  - Text: `text-primary-foreground`
  - Padding: `px-2.5 py-0.5`
  - Border Radius: `rounded-full`

- **Hover (Dismissible):**
  - Background: Slightly lighter
  - Cursor: `cursor-pointer` (on close icon)

- **Active/Pressed (Dismissible):**
  - Background: Slightly darker

- **Disabled:**
  - Background: `bg-muted`
  - Text: `text-muted-foreground`

### Icon Button States

**Icon-Only Button (Common Pattern):**

```tsx
<Button variant="ghost" size="icon">
  <PencilSimple />
</Button>
```

- **Default:**
  - Background: Transparent
  - Icon Color: `text-foreground` or `text-muted-foreground`
  - Size: `h-10 w-10` (40×40px)

- **Hover:**
  - Background: `bg-accent` (teal)
  - Icon Color: `text-accent-foreground`

- **Active/Pressed:**
  - Background: Darker accent

- **Focus:**
  - Ring: `ring-2 ring-ring`

- **Disabled:**
  - Icon Color: `text-muted-foreground`
  - Cursor: `cursor-not-allowed`

**Touch Targets:**
- Icon buttons: Minimum `h-10 w-10` (40×40px)
- Larger if needed: `h-11 w-11` or `h-12 w-12`

### Tab States

**Tab Trigger (`<TabsTrigger />`):**

```tsx
<TabsTrigger value="tab1">Label</TabsTrigger>
```

- **Inactive (Default):**
  - Background: Transparent
  - Text: `text-muted-foreground`
  - Border: None
  - Cursor: `cursor-pointer`

- **Inactive Hover:**
  - Background: `bg-muted` (subtle)
  - Text: `text-foreground`

- **Active (Selected):**
  - Background: `bg-background` or `bg-card`
  - Text: `text-foreground`
  - Border Bottom: `border-b-2 border-primary` (teal underline)
  - Font Weight: `font-medium` or `font-semibold`

- **Focus (Keyboard):**
  - Ring: `ring-2 ring-ring`

- **Disabled:**
  - Text: `text-muted-foreground`
  - Cursor: `cursor-not-allowed`
  - No hover effects

### Accordion States

**Accordion Trigger (`<AccordionTrigger />`):**

- **Collapsed (Default):**
  - Background: Transparent
  - Icon: Down chevron
  - Text: `text-foreground`
  - Cursor: `cursor-pointer`

- **Collapsed Hover:**
  - Background: `bg-muted` (subtle)
  - Text: Same

- **Expanded:**
  - Background: Same as collapsed
  - Icon: Up chevron (rotated 180°)
  - Content: AccordionContent visible below

- **Focus:**
  - Ring: `ring-2 ring-ring`

### Toast Notification States

**Toast (Sonner `toast()`):**

Toasts are non-interactive (except dismiss button):

- **Visible:**
  - Background: `bg-card` or `bg-background`
  - Border: `border border-border`
  - Shadow: `shadow-lg`
  - Position: Bottom-right or top-right
  - Animation: Slide in from right, fade in

- **Hover (on Dismiss Button):**
  - Close Icon: `text-muted-foreground` → `text-foreground`
  - Background: Slight highlight on icon

- **Dismissing:**
  - Animation: Slide out to right, fade out
  - Duration: 200-300ms

### Calendar/Date Picker States

**Calendar Day Cell:**

- **Default (Selectable):**
  - Background: Transparent
  - Text: `text-foreground`
  - Cursor: `cursor-pointer`

- **Hover:**
  - Background: `bg-accent` (teal)
  - Text: `text-accent-foreground`

- **Selected:**
  - Background: `bg-primary` (teal)
  - Text: `text-primary-foreground`
  - Font Weight: `font-medium`

- **Today (Unselected):**
  - Border: `border border-primary` (teal outline)
  - Background: Transparent

- **Disabled/Unavailable:**
  - Text: `text-muted-foreground`
  - Cursor: `cursor-not-allowed`
  - No hover effects

- **Focus (Keyboard):**
  - Ring: `ring-2 ring-ring`

### Slider States

**Slider (`<Slider />`):**

- **Default:**
  - Track: `bg-secondary` (gray)
  - Filled Track: `bg-primary` (teal, up to thumb position)
  - Thumb: White circle with `border-2 border-primary`
  - Size: Track height `h-2`, thumb `h-5 w-5`

- **Hover:**
  - Thumb: Slightly larger or highlighted
  - Cursor: `cursor-pointer`

- **Active/Dragging:**
  - Thumb: `ring-2 ring-ring`
  - Cursor: `cursor-grab` or `cursor-grabbing`

- **Focus (Keyboard):**
  - Thumb: `ring-2 ring-ring`

- **Disabled:**
  - Track: `bg-muted`
  - Filled Track: Dimmed primary
  - Thumb: Dimmed, `cursor-not-allowed`

### Progress Bar States

**Progress (`<Progress />`):**

Non-interactive component with visual states:

- **Default:**
  - Background: `bg-secondary` (gray track)
  - Filled: `bg-primary` (teal, percentage-based width)
  - Height: `h-2` or `h-4`

- **Indeterminate (Loading):**
  - Animated sliding bar or pulse effect
  - Filled bar moves left-to-right repeatedly

- **Complete (100%):**
  - Filled: `bg-primary` (full width)
  - Optional: Brief pulse or color change animation

### Dropdown Menu States

**Dropdown Menu Item (`<DropdownMenuItem />`):**

```tsx
<DropdownMenuItem>Action</DropdownMenuItem>
```

- **Default:**
  - Background: Transparent
  - Text: `text-foreground`
  - Padding: `px-2 py-1.5`

- **Hover:**
  - Background: `bg-accent` (teal)
  - Text: `text-accent-foreground`

- **Active/Pressed:**
  - Background: Darker accent

- **Focus (Keyboard):**
  - Background: Same as hover
  - Outline: Minimal (handled by menu container)

- **Disabled:**
  - Text: `text-muted-foreground`
  - Cursor: `cursor-not-allowed`
  - No hover effects

- **Destructive:**
  - Text: `text-destructive` (red)
  - Hover Background: `bg-destructive` with `text-destructive-foreground`

### Touch Target Summary

All interactive elements meet or exceed WCAG 2.1 minimum touch target size of **44×44px**:

- **Buttons:** `h-10` (40px) minimum, with adequate horizontal padding
- **Input Fields:** `h-10` (40px) minimum
- **Checkboxes/Radios:** 16×16px visual, extended by label click area to 44×44px
- **Icon Buttons:** `h-10 w-10` (40×40px) or larger
- **Switches:** `h-6 w-11` (24×44px)
- **Tabs:** Adequate padding ensures 44px minimum height
- **Table Rows (clickable):** Minimum row height `h-12` or `h-14` (48-56px)

---

## 9) Motion & Animation

This section defines all animation durations, easing functions, and triggers throughout the application.

### Animation Philosophy

The application uses **subtle, purposeful animations** to:
- **Orient users** during navigation and state changes
- **Provide feedback** for interactions (button clicks, form submissions)
- **Guide attention** to important changes (new data, notifications)
- **Establish relationships** between elements (accordion expand, dialog open)

Animations should be **felt rather than seen** — quick, smooth, and never blocking user actions.

### Global Timing Standards

**Duration Guidelines:**

```css
/* Quick actions (50-150ms) */
--duration-instant: 50ms;   /* Icon rotations, checkbox checks */
--duration-fast: 100ms;     /* Button press feedback */
--duration-quick: 150ms;    /* Hover states, ripple effects */

/* Standard transitions (200-300ms) */
--duration-normal: 200ms;   /* Default for most state changes */
--duration-smooth: 250ms;   /* Card hovers, background changes */
--duration-comfortable: 300ms; /* Accordions, collapsibles */

/* Page transitions (300-500ms) */
--duration-page: 350ms;     /* Route changes, view transitions */
--duration-modal: 400ms;    /* Dialog/modal open/close */
--duration-slow: 500ms;     /* Major layout shifts (rarely used) */
```

**Easing Functions:**

```css
/* CSS easing curves */
ease-linear: linear;              /* Continuous motion (progress bars) */
ease-in: cubic-bezier(0.4, 0, 1, 1);       /* Accelerating (exit animations) */
ease-out: cubic-bezier(0, 0, 0.2, 1);      /* Decelerating (entrance animations) - DEFAULT */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* Smooth start/end (state changes) */

/* Custom easing (if using framer-motion) */
spring-default: { type: "spring", stiffness: 300, damping: 30 }
spring-gentle: { type: "spring", stiffness: 200, damping: 25 }
spring-bouncy: { type: "spring", stiffness: 400, damping: 20 }
```

**Default Easing:**
- **Entrances (elements appearing):** `ease-out` — starts fast, ends slow
- **Exits (elements disappearing):** `ease-in` — starts slow, ends fast
- **State changes (hovers, toggles):** `ease-in-out` — smooth symmetry
- **Continuous (progress bars):** `linear` — constant speed

### Component-Specific Animations

**Button Press (100ms):**

```tsx
<Button className="transition-colors duration-100">
```

- **Property:** Background color, text color
- **Duration:** 100ms
- **Easing:** `ease-in-out`
- **Trigger:** `:hover`, `:active`, `:focus`
- **Effect:** Smooth color shift to hover/pressed state

**Input Focus (150ms):**

```tsx
<Input className="transition-shadow duration-150" />
```

- **Property:** Box shadow (focus ring)
- **Duration:** 150ms
- **Easing:** `ease-out`
- **Trigger:** `:focus`
- **Effect:** Ring appears smoothly on focus

**Card Hover (200ms):**

```tsx
<Card className="transition-all duration-200 hover:shadow-md hover:border-primary">
```

- **Property:** Border color, box shadow, background
- **Duration:** 200ms
- **Easing:** `ease-in-out`
- **Trigger:** `:hover`
- **Effect:** Subtle elevation and border highlight

**Switch Toggle (150ms):**

```tsx
<Switch />
```

- **Property:** Thumb position (translate-x), track background
- **Duration:** 150ms
- **Easing:** `ease-in-out`
- **Trigger:** State change (on/off)
- **Effect:** Thumb slides smoothly from left to right

**Checkbox/Radio Check (100ms):**

```tsx
<Checkbox />
```

- **Property:** Background color, checkmark opacity/scale
- **Duration:** 100ms
- **Easing:** `ease-out`
- **Trigger:** State change (checked/unchecked)
- **Effect:** Checkmark appears with subtle scale-up

**Accordion Expand/Collapse (300ms):**

```tsx
<Accordion />
```

- **Property:** Content height (0 → auto)
- **Duration:** 300ms
- **Easing:** `ease-out` (expand), `ease-in` (collapse)
- **Trigger:** AccordionTrigger click
- **Effect:** Smooth reveal/hide of content

```css
/* From main.css */
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}

--animate-accordion-down: accordion-down 0.2s ease-out;
--animate-accordion-up: accordion-up 0.2s ease-out;
```

**Note:** Actual duration is 200ms (0.2s) per CSS definition.

**Tab Switch (200ms):**

```tsx
<TabsTrigger />
```

- **Property:** Background color, border-bottom (active indicator)
- **Duration:** 200ms
- **Easing:** `ease-in-out`
- **Trigger:** Tab click
- **Effect:** Active underline slides/fades in, background changes

**Dropdown Menu Open/Close (150ms):**

```tsx
<DropdownMenu />
```

- **Property:** Opacity, scale (subtle zoom-in)
- **Duration:** 150ms
- **Easing:** `ease-out` (open), `ease-in` (close)
- **Trigger:** Trigger button click, outside click (close)
- **Effect:** Menu appears with subtle scale and fade

**Dialog/Modal Open/Close (400ms):**

```tsx
<Dialog />
```

- **Property:** Opacity (overlay), scale + opacity (content)
- **Duration:** 400ms
- **Easing:** `ease-out` (open), `ease-in` (close)
- **Trigger:** Dialog state change
- **Effect:**
  - **Open:** Overlay fades in, content scales from 95% to 100% with fade-in
  - **Close:** Content scales down to 95% with fade-out, overlay fades out

**Drawer Open/Close (Mobile, 300ms):**

```tsx
<Drawer />
```

- **Property:** Transform (translate-y), overlay opacity
- **Duration:** 300ms
- **Easing:** `ease-out` (open), `ease-in` (close)
- **Trigger:** Drawer state change, swipe gesture
- **Effect:** Drawer slides up from bottom (mobile), overlay fades in

**Toast Notification Enter/Exit (250ms):**

```tsx
toast("Message")
```

- **Property:** Transform (translate-x), opacity
- **Duration:** 250ms
- **Easing:** `ease-out` (enter), `ease-in` (exit)
- **Trigger:** `toast()` call, auto-dismiss, manual dismiss
- **Effect:**
  - **Enter:** Slides in from right with fade-in
  - **Exit:** Slides out to right with fade-out

**Tooltip Show/Hide (100ms):**

```tsx
<Tooltip />
```

- **Property:** Opacity, slight translate-y
- **Duration:** 100ms
- **Easing:** `ease-out` (show), `ease-in` (hide)
- **Trigger:** Hover (200ms delay before show), mouse leave
- **Effect:** Tooltip fades in with subtle upward movement

**Popover Open/Close (150ms):**

```tsx
<Popover />
```

- **Property:** Opacity, scale (subtle)
- **Duration:** 150ms
- **Easing:** `ease-out` (open), `ease-in` (close)
- **Trigger:** Trigger click, outside click (close)
- **Effect:** Popover appears with subtle scale and fade

**Progress Bar Fill (300ms):**

```tsx
<Progress value={percentage} />
```

- **Property:** Width of filled portion
- **Duration:** 300ms
- **Easing:** `ease-out`
- **Trigger:** Value prop change
- **Effect:** Smooth width transition to new percentage

**Skeleton Pulse (1500ms loop):**

```tsx
<Skeleton />
```

- **Property:** Opacity (pulse effect)
- **Duration:** 1500ms (looping)
- **Easing:** `ease-in-out`
- **Trigger:** Component mount (auto-plays)
- **Effect:** Continuous gentle pulse to indicate loading

```css
/* Tailwind default: */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

**Badge Dismiss (100ms):**

```tsx
<Badge dismissible />
```

- **Property:** Opacity, scale
- **Duration:** 100ms
- **Easing:** `ease-in`
- **Trigger:** Close icon click
- **Effect:** Badge shrinks slightly and fades out

**Icon Rotation (150ms):**

Used for chevrons, expand/collapse indicators:

```tsx
<ChevronDown className="transition-transform duration-150" />
```

- **Property:** Transform (rotate)
- **Duration:** 150ms
- **Easing:** `ease-in-out`
- **Trigger:** State change (open/close)
- **Effect:** Smooth 180° rotation (down → up)

**Hover Elevation (Card, 200ms):**

```tsx
<Card className="transition-shadow duration-200 hover:shadow-md">
```

- **Property:** Box shadow
- **Duration:** 200ms
- **Easing:** `ease-in-out`
- **Trigger:** `:hover`
- **Effect:** Subtle shadow appears, creating elevation

**Page Transition (Route Change, 350ms):**

Not explicitly implemented in current routing, but recommended pattern:

```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.35, ease: "easeOut" }}
>
  {children}
</motion.div>
```

- **Property:** Opacity, transform (translate-y)
- **Duration:** 350ms
- **Easing:** `ease-out`
- **Trigger:** Route change
- **Effect:** New page fades in with subtle upward movement, old page fades out downward

### Loading States & Skeletons

**Skeleton Loader:**

```tsx
<Skeleton className="h-4 w-32" />
```

- **Animation:** Continuous pulse (opacity 1 ↔ 0.5)
- **Duration:** 2000ms (Tailwind default pulse)
- **Easing:** `ease-in-out`
- **Trigger:** Auto-play on mount
- **Usage:** Placeholder for loading content (text, images, cards)

**Spinner (Button Loading):**

```tsx
<Button disabled>
  <Loader2 className="animate-spin" />
  Loading...
</Button>
```

- **Animation:** 360° rotation (continuous)
- **Duration:** 1000ms per rotation
- **Easing:** `linear`
- **Trigger:** Loading state active
- **Usage:** Button loading state, full-page loaders

```css
/* Tailwind default: */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### Reduced Motion (Accessibility)

All animations respect user preferences via `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Effect:**
- Users with motion sensitivity settings enabled will see instant state changes
- All animations are effectively disabled (1ms = imperceptible)
- Functionality remains intact, only visual motion is removed

### Animation Triggers Summary

**User Interactions:**
- Mouse hover → Hover state animations (200ms)
- Button click → Press feedback (100ms)
- Keyboard focus → Focus ring (150ms)
- Form submit → Loading spinner, button disabled state
- Checkbox/switch toggle → State change animation (100-150ms)

**State Changes:**
- Accordion expand/collapse → Height animation (300ms)
- Tab switch → Active indicator animation (200ms)
- Dialog open/close → Scale + fade (400ms)
- Toast appear/dismiss → Slide + fade (250ms)
- Progress update → Width transition (300ms)

**System Events:**
- Route change → Page transition (350ms, if implemented)
- Data loading → Skeleton pulse (2000ms loop)
- Auto-dismiss toast → Exit animation after delay (250ms)

**Scroll Events:**
- Sticky header → No animation (instant)
- Infinite scroll → New content fades in (200ms, optional)

### Framer Motion Usage

Framer Motion is installed but used sparingly. Recommended for:

- **Page transitions** (route changes)
- **Complex gestures** (drag-to-reorder, swipe-to-dismiss)
- **Orchestrated animations** (staggered list items)

Example pattern:

```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  {content}
</motion.div>
```

**Default pattern for staggered children:**

```tsx
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}
```

### Performance Considerations

**Prefer CSS Transitions:**
- Use Tailwind `transition-*` utilities for simple state changes
- CSS transitions are more performant than JS animations
- GPU-accelerated properties: `transform`, `opacity`

**Avoid Animating:**
- `width`, `height` (use `scale` or `max-height` with caution)
- `margin`, `padding` (use `transform` instead)
- `background-position` (expensive repaints)

**Optimize for 60fps:**
- Keep animations under 300ms for snappy feel
- Use `will-change` sparingly for complex animations
- Debounce scroll-triggered animations

---

**END OF SECTIONS 8-9**



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

---

## 8) Interaction States

This section documents all interactive element states, their visual treatments, and touch target requirements.

### Button States

**Primary Button (`variant="default"`):**

```tsx
<Button>Label</Button>
```

- **Default (Rest):**
  - Background: `bg-primary` (teal oklch(0.75 0.15 195))
  - Text: `text-primary-foreground` (dark blue-gray)
  - Border: None
  - Shadow: None
  - Cursor: `cursor-pointer`

- **Hover:**
  - Background: Slightly lighter teal (handled by shadcn internal hover state)
  - Visual: Subtle brightness increase
  - Transition: 200ms ease
  - Cursor: `cursor-pointer`

- **Active/Pressed:**
  - Background: Slightly darker than default
  - Visual: Appears depressed
  - Scale: No scale transform used
  - Duration: Instant feedback

- **Focus (Keyboard):**
  - Outline: `ring-2 ring-ring ring-offset-2`
  - Ring Color: `--ring` (teal oklch(0.75 0.15 195))
  - Ring Offset: 2px background-colored gap
  - Visible focus indicator for accessibility

- **Disabled:**
  - Background: `bg-muted` (desaturated)
  - Text: `text-muted-foreground` (dimmed)
  - Opacity: 50% (`opacity-50`)
  - Cursor: `cursor-not-allowed`
  - No hover effects
  - Non-interactive

- **Loading:**
  - Background: Same as default
  - Icon: Spinner or loading icon replaces or prepends text
  - Cursor: `cursor-wait` or `cursor-not-allowed`
  - Button remains pressable or disabled depending on implementation

**Secondary Button (`variant="secondary"`):**

- **Default:** `bg-secondary` / `text-secondary-foreground`
- **Hover:** Slightly lighter background
- **Active:** Slightly darker background
- **Focus:** Same ring treatment as primary
- **Disabled:** Same as primary disabled state

**Outline Button (`variant="outline"`):**

- **Default:**
  - Background: Transparent
  - Border: `border border-input`
  - Text: `text-foreground`

- **Hover:**
  - Background: `bg-accent` (teal accent)
  - Border: Same
  - Text: `text-accent-foreground`

- **Active:** Slightly darker background
- **Focus:** Same ring treatment
- **Disabled:** Muted border and text

**Ghost Button (`variant="ghost"`):**

- **Default:**
  - Background: Transparent
  - Border: None
  - Text: `text-foreground`

- **Hover:**
  - Background: `bg-accent` (subtle teal highlight)
  - Text: `text-accent-foreground`

- **Active:** Slightly darker background
- **Focus:** Same ring treatment
- **Disabled:** Muted text only

**Destructive Button (`variant="destructive"`):**

- **Default:** `bg-destructive` / `text-destructive-foreground` (red-orange)
- **Hover:** Slightly lighter or more saturated red
- **Active:** Darker red
- **Focus:** Ring with destructive color or standard ring
- **Disabled:** Muted, non-interactive

**Link Button (`variant="link"`):**

- **Default:**
  - Background: Transparent
  - Text: `text-primary` (teal, underlined)
  - Underline: `underline-offset-4`

- **Hover:**
  - Text: Slightly lighter or no change
  - Underline: Remains

- **Active:** Darker text
- **Focus:** Ring around text area
- **Disabled:** Muted text, no underline

**Touch Targets:**
- Minimum height: `h-10` (40px) for default size
- Small buttons: `h-9` (36px) - still meets accessibility minimums with padding
- Large buttons: `h-11` or `h-12` (44px–48px)
- Horizontal padding ensures adequate width for tap targets

### Input Field States

**Text Input (`<Input />`):**

```tsx
<Input placeholder="Enter text" />
```

- **Default (Rest):**
  - Background: Transparent or `bg-background`
  - Border: `border border-input` (subtle gray)
  - Text: `text-foreground`
  - Placeholder: `text-muted-foreground`
  - Padding: `px-3 py-2`

- **Hover:**
  - Border: Slightly lighter or same (minimal change)
  - Cursor: `cursor-text`

- **Focus (Active Input):**
  - Border: `border-input` (no color change)
  - Ring: `ring-2 ring-ring` (teal focus ring)
  - Outline: None (replaced by ring)
  - Background: Same as default

- **Filled (Has Value):**
  - Visual: Same as default
  - Text: `text-foreground`

- **Error/Invalid:**
  - Border: `border-destructive` (red-orange)
  - Ring (on focus): `ring-destructive`
  - Text: `text-destructive` (optional for error message below)

- **Disabled:**
  - Background: `bg-muted` or slightly darker
  - Border: `border-border` (dimmed)
  - Text: `text-muted-foreground`
  - Cursor: `cursor-not-allowed`
  - Non-editable

- **Read-Only:**
  - Background: Slightly different from default (optional)
  - Border: Same as default
  - Cursor: `cursor-default`
  - Non-editable but appears active

**Textarea (`<Textarea />`):**
- States identical to `<Input />`
- Min-height: Typically `min-h-[80px]` or larger
- Resizable: `resize-y` or `resize-none` depending on use case

**Touch Targets:**
- Input height: `h-10` (40px) minimum
- Vertical padding ensures comfortable tap area
- Label click targets extend to input via `<Label htmlFor="...">`

### Select / Dropdown States

**Select Trigger (`<Select />`):**

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Choose option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

- **Default (Closed):**
  - Background: Transparent or `bg-background`
  - Border: `border border-input`
  - Text: `text-foreground` or `text-muted-foreground` (placeholder)
  - Icon: Down chevron icon

- **Hover (Closed):**
  - Background: Slight highlight
  - Border: Same

- **Focus (Closed, Keyboard):**
  - Ring: `ring-2 ring-ring`

- **Open (Active):**
  - Border: `border-input`
  - Ring: `ring-2 ring-ring`
  - Icon: Up chevron (rotated)
  - Popover: Dropdown menu appears below/above trigger

- **Disabled:**
  - Background: `bg-muted`
  - Text: `text-muted-foreground`
  - Icon: Dimmed
  - Cursor: `cursor-not-allowed`

**Select Items (Options in Dropdown):**

- **Default:**
  - Background: Transparent
  - Text: `text-foreground`
  - Padding: `px-2 py-1.5`

- **Hover:**
  - Background: `bg-accent` (teal highlight)
  - Text: `text-accent-foreground`

- **Selected:**
  - Background: `bg-accent` (persistent)
  - Text: `text-accent-foreground`
  - Checkmark icon: Visible indicator

- **Focus (Keyboard):**
  - Background: Same as hover
  - Outline: Minimal or none (handled by parent popover)

### Checkbox States

**Checkbox (`<Checkbox />`):**

```tsx
<Checkbox id="terms" />
```

- **Unchecked (Default):**
  - Background: Transparent
  - Border: `border border-input` (gray)
  - Size: `h-4 w-4` (16×16px)
  - Icon: None

- **Unchecked Hover:**
  - Border: Slightly lighter or same
  - Background: Subtle highlight

- **Unchecked Focus:**
  - Ring: `ring-2 ring-ring`

- **Checked:**
  - Background: `bg-primary` (teal)
  - Border: `border-primary`
  - Icon: White checkmark (Phosphor `Check` icon)

- **Checked Hover:**
  - Background: Slightly lighter teal

- **Checked Focus:**
  - Background: `bg-primary`
  - Ring: `ring-2 ring-ring`

- **Indeterminate (Partial):**
  - Background: `bg-primary`
  - Icon: Dash/minus icon
  - Used for: "Select all" with partial selection

- **Disabled (Unchecked):**
  - Background: `bg-muted`
  - Border: `border-border` (dimmed)
  - Cursor: `cursor-not-allowed`

- **Disabled (Checked):**
  - Background: Dimmed primary color
  - Icon: Dimmed checkmark
  - Cursor: `cursor-not-allowed`

**Touch Targets:**
- Checkbox itself: 16×16px
- Click target extended by label: Full `<label>` area (typically 44×44px minimum with padding)

### Switch States

**Switch (`<Switch />`):**

```tsx
<Switch id="notifications" />
```

- **Off (Default):**
  - Track Background: `bg-input` (gray)
  - Thumb: White circle, positioned left
  - Size: `h-6 w-11` (24×44px)

- **Off Hover:**
  - Track: Slightly lighter

- **Off Focus:**
  - Ring: `ring-2 ring-ring`

- **On:**
  - Track Background: `bg-primary` (teal)
  - Thumb: White circle, positioned right
  - Animation: Smooth slide transition (150-200ms)

- **On Hover:**
  - Track: Slightly lighter teal

- **On Focus:**
  - Track: `bg-primary`
  - Ring: `ring-2 ring-ring`

- **Disabled (Off):**
  - Track: `bg-muted`
  - Thumb: Dimmed
  - Cursor: `cursor-not-allowed`

- **Disabled (On):**
  - Track: Dimmed teal
  - Thumb: Dimmed
  - Cursor: `cursor-not-allowed`

**Touch Targets:**
- Switch dimensions (24×44px) exceed minimum requirements

### Radio Button States

**Radio Group (`<RadioGroup />`):**

```tsx
<RadioGroup>
  <RadioGroupItem value="option1" id="opt1" />
</RadioGroup>
```

- **Unselected (Default):**
  - Background: Transparent
  - Border: `border border-input` (gray circle)
  - Size: `h-4 w-4` (16×16px)
  - Dot: None

- **Unselected Hover:**
  - Border: Slightly lighter

- **Unselected Focus:**
  - Ring: `ring-2 ring-ring`

- **Selected:**
  - Border: `border-primary` (teal)
  - Dot: Filled teal circle inside (60-70% of diameter)

- **Selected Hover:**
  - Border: Slightly lighter teal

- **Selected Focus:**
  - Border: `border-primary`
  - Ring: `ring-2 ring-ring`

- **Disabled (Unselected):**
  - Border: `border-border` (dimmed)
  - Cursor: `cursor-not-allowed`

- **Disabled (Selected):**
  - Border: Dimmed primary
  - Dot: Dimmed
  - Cursor: `cursor-not-allowed`

**Touch Targets:**
- Radio button: 16×16px
- Extended by label click area

### Link States

**Navigation Link (`<Link>` from react-router-dom):**

```tsx
<Link to="/clients">Clients</Link>
```

- **Default:**
  - Text: `text-foreground` or `text-primary` (depending on context)
  - Underline: None (navigation links) or `underline` (inline links)
  - Cursor: `cursor-pointer`

- **Hover:**
  - Text: `text-primary` or slightly lighter
  - Underline: Appears if not present, or remains
  - Background: Optional subtle highlight for nav items

- **Active (Current Page):**
  - Text: `text-primary` (teal)
  - Font Weight: `font-semibold` or `font-bold`
  - Background: `bg-accent` (in navigation bar)
  - Underline: Optional

- **Focus (Keyboard):**
  - Outline: `ring-2 ring-ring`
  - Offset: `ring-offset-2`

- **Visited:**
  - Same as default (no color change)

- **Disabled:**
  - Text: `text-muted-foreground`
  - Cursor: `cursor-not-allowed`
  - No underline
  - No hover effects

### Card Interactive States

**Card (Clickable/Interactive):**

Some cards act as navigation elements (e.g., PetCard, StatWidget with drill-down):

- **Default:**
  - Background: `bg-card`
  - Border: `border border-border`
  - Shadow: None
  - Cursor: `cursor-default` (non-interactive) or `cursor-pointer` (interactive)

- **Hover (Interactive):**
  - Background: Slightly lighter (`bg-accent` or subtle highlight)
  - Border: `border-primary` (teal) or same as default
  - Shadow: `shadow-sm` or `shadow-md` (optional)
  - Transition: 200ms ease

- **Active/Pressed (Interactive):**
  - Background: Slightly darker
  - Scale: No scale effect (maintains layout stability)

- **Focus (Keyboard, Interactive):**
  - Ring: `ring-2 ring-ring`

- **Selected/Active (State-based):**
  - Border: `border-primary` (teal, thicker: `border-2`)
  - Background: `bg-accent` or same as default
  - Indicator: Optional checkmark or icon

### Table Row States

**Table Row (`<TableRow>`):**

- **Default:**
  - Background: Transparent or `bg-card`
  - Border: `border-b border-border`
  - Text: `text-foreground`

- **Hover (if clickable):**
  - Background: `bg-accent` (subtle teal highlight)
  - Cursor: `cursor-pointer`
  - Transition: 150ms ease

- **Selected:**
  - Background: `bg-accent` (persistent)
  - Border: Same or slightly emphasized
  - Checkmark: In first column (if multi-select)

- **Focus (Keyboard):**
  - Outline: `ring-2 ring-ring` (inset or around row)

- **Active/Pressed:**
  - Background: Slightly darker than hover

### Badge States

**Badge (`<Badge />`):**

Badges are typically non-interactive, but can be dismissible:

- **Default:**
  - Background: `bg-primary` or variant color
  - Text: `text-primary-foreground`
  - Padding: `px-2.5 py-0.5`
  - Border Radius: `rounded-full`

- **Hover (Dismissible):**
  - Background: Slightly lighter
  - Cursor: `cursor-pointer` (on close icon)

- **Active/Pressed (Dismissible):**
  - Background: Slightly darker

- **Disabled:**
  - Background: `bg-muted`
  - Text: `text-muted-foreground`

### Icon Button States

**Icon-Only Button (Common Pattern):**

```tsx
<Button variant="ghost" size="icon">
  <PencilSimple />
</Button>
```

- **Default:**
  - Background: Transparent
  - Icon Color: `text-foreground` or `text-muted-foreground`
  - Size: `h-10 w-10` (40×40px)

- **Hover:**
  - Background: `bg-accent` (teal)
  - Icon Color: `text-accent-foreground`

- **Active/Pressed:**
  - Background: Darker accent

- **Focus:**
  - Ring: `ring-2 ring-ring`

- **Disabled:**
  - Icon Color: `text-muted-foreground`
  - Cursor: `cursor-not-allowed`

**Touch Targets:**
- Icon buttons: Minimum `h-10 w-10` (40×40px)
- Larger if needed: `h-11 w-11` or `h-12 w-12`

### Tab States

**Tab Trigger (`<TabsTrigger />`):**

```tsx
<TabsTrigger value="tab1">Label</TabsTrigger>
```

- **Inactive (Default):**
  - Background: Transparent
  - Text: `text-muted-foreground`
  - Border: None
  - Cursor: `cursor-pointer`

- **Inactive Hover:**
  - Background: `bg-muted` (subtle)
  - Text: `text-foreground`

- **Active (Selected):**
  - Background: `bg-background` or `bg-card`
  - Text: `text-foreground`
  - Border Bottom: `border-b-2 border-primary` (teal underline)
  - Font Weight: `font-medium` or `font-semibold`

- **Focus (Keyboard):**
  - Ring: `ring-2 ring-ring`

- **Disabled:**
  - Text: `text-muted-foreground`
  - Cursor: `cursor-not-allowed`
  - No hover effects

### Accordion States

**Accordion Trigger (`<AccordionTrigger />`):**

- **Collapsed (Default):**
  - Background: Transparent
  - Icon: Down chevron
  - Text: `text-foreground`
  - Cursor: `cursor-pointer`

- **Collapsed Hover:**
  - Background: `bg-muted` (subtle)
  - Text: Same

- **Expanded:**
  - Background: Same as collapsed
  - Icon: Up chevron (rotated 180°)
  - Content: AccordionContent visible below

- **Focus:**
  - Ring: `ring-2 ring-ring`

### Toast Notification States

**Toast (Sonner `toast()`):**

Toasts are non-interactive (except dismiss button):

- **Visible:**
  - Background: `bg-card` or `bg-background`
  - Border: `border border-border`
  - Shadow: `shadow-lg`
  - Position: Bottom-right or top-right
  - Animation: Slide in from right, fade in

- **Hover (on Dismiss Button):**
  - Close Icon: `text-muted-foreground` → `text-foreground`
  - Background: Slight highlight on icon

- **Dismissing:**
  - Animation: Slide out to right, fade out
  - Duration: 200-300ms

### Calendar/Date Picker States

**Calendar Day Cell:**

- **Default (Selectable):**
  - Background: Transparent
  - Text: `text-foreground`
  - Cursor: `cursor-pointer`

- **Hover:**
  - Background: `bg-accent` (teal)
  - Text: `text-accent-foreground`

- **Selected:**
  - Background: `bg-primary` (teal)
  - Text: `text-primary-foreground`
  - Font Weight: `font-medium`

- **Today (Unselected):**
  - Border: `border border-primary` (teal outline)
  - Background: Transparent

- **Disabled/Unavailable:**
  - Text: `text-muted-foreground`
  - Cursor: `cursor-not-allowed`
  - No hover effects

- **Focus (Keyboard):**
  - Ring: `ring-2 ring-ring`

### Slider States

**Slider (`<Slider />`):**

- **Default:**
  - Track: `bg-secondary` (gray)
  - Filled Track: `bg-primary` (teal, up to thumb position)
  - Thumb: White circle with `border-2 border-primary`
  - Size: Track height `h-2`, thumb `h-5 w-5`

- **Hover:**
  - Thumb: Slightly larger or highlighted
  - Cursor: `cursor-pointer`

- **Active/Dragging:**
  - Thumb: `ring-2 ring-ring`
  - Cursor: `cursor-grab` or `cursor-grabbing`

- **Focus (Keyboard):**
  - Thumb: `ring-2 ring-ring`

- **Disabled:**
  - Track: `bg-muted`
  - Filled Track: Dimmed primary
  - Thumb: Dimmed, `cursor-not-allowed`

### Progress Bar States

**Progress (`<Progress />`):**

Non-interactive component with visual states:

- **Default:**
  - Background: `bg-secondary` (gray track)
  - Filled: `bg-primary` (teal, percentage-based width)
  - Height: `h-2` or `h-4`

- **Indeterminate (Loading):**
  - Animated sliding bar or pulse effect
  - Filled bar moves left-to-right repeatedly

- **Complete (100%):**
  - Filled: `bg-primary` (full width)
  - Optional: Brief pulse or color change animation

### Dropdown Menu States

**Dropdown Menu Item (`<DropdownMenuItem />`):**

```tsx
<DropdownMenuItem>Action</DropdownMenuItem>
```

- **Default:**
  - Background: Transparent
  - Text: `text-foreground`
  - Padding: `px-2 py-1.5`

- **Hover:**
  - Background: `bg-accent` (teal)
  - Text: `text-accent-foreground`

- **Active/Pressed:**
  - Background: Darker accent

- **Focus (Keyboard):**
  - Background: Same as hover
  - Outline: Minimal (handled by menu container)

- **Disabled:**
  - Text: `text-muted-foreground`
  - Cursor: `cursor-not-allowed`
  - No hover effects

- **Destructive:**
  - Text: `text-destructive` (red)
  - Hover Background: `bg-destructive` with `text-destructive-foreground`

### Touch Target Summary

All interactive elements meet or exceed WCAG 2.1 minimum touch target size of **44×44px**:

- **Buttons:** `h-10` (40px) minimum, with adequate horizontal padding
- **Input Fields:** `h-10` (40px) minimum
- **Checkboxes/Radios:** 16×16px visual, extended by label click area to 44×44px
- **Icon Buttons:** `h-10 w-10` (40×40px) or larger
- **Switches:** `h-6 w-11` (24×44px)
- **Tabs:** Adequate padding ensures 44px minimum height
- **Table Rows (clickable):** Minimum row height `h-12` or `h-14` (48-56px)

---

## 9) Motion & Animation

This section defines all animation durations, easing functions, and triggers throughout the application.

### Animation Philosophy

The application uses **subtle, purposeful animations** to:
- **Orient users** during navigation and state changes
- **Provide feedback** for interactions (button clicks, form submissions)
- **Guide attention** to important changes (new data, notifications)
- **Establish relationships** between elements (accordion expand, dialog open)

Animations should be **felt rather than seen** — quick, smooth, and never blocking user actions.

### Global Timing Standards

**Duration Guidelines:**

```css
/* Quick actions (50-150ms) */
--duration-instant: 50ms;   /* Icon rotations, checkbox checks */
--duration-fast: 100ms;     /* Button press feedback */
--duration-quick: 150ms;    /* Hover states, ripple effects */

/* Standard transitions (200-300ms) */
--duration-normal: 200ms;   /* Default for most state changes */
--duration-smooth: 250ms;   /* Card hovers, background changes */
--duration-comfortable: 300ms; /* Accordions, collapsibles */

/* Page transitions (300-500ms) */
--duration-page: 350ms;     /* Route changes, view transitions */
--duration-modal: 400ms;    /* Dialog/modal open/close */
--duration-slow: 500ms;     /* Major layout shifts (rarely used) */
```

**Easing Functions:**

```css
/* CSS easing curves */
ease-linear: linear;              /* Continuous motion (progress bars) */
ease-in: cubic-bezier(0.4, 0, 1, 1);       /* Accelerating (exit animations) */
ease-out: cubic-bezier(0, 0, 0.2, 1);      /* Decelerating (entrance animations) - DEFAULT */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* Smooth start/end (state changes) */

/* Custom easing (if using framer-motion) */
spring-default: { type: "spring", stiffness: 300, damping: 30 }
spring-gentle: { type: "spring", stiffness: 200, damping: 25 }
spring-bouncy: { type: "spring", stiffness: 400, damping: 20 }
```

**Default Easing:**
- **Entrances (elements appearing):** `ease-out` — starts fast, ends slow
- **Exits (elements disappearing):** `ease-in` — starts slow, ends fast
- **State changes (hovers, toggles):** `ease-in-out` — smooth symmetry
- **Continuous (progress bars):** `linear` — constant speed

### Component-Specific Animations

**Button Press (100ms):**

```tsx
<Button className="transition-colors duration-100">
```

- **Property:** Background color, text color
- **Duration:** 100ms
- **Easing:** `ease-in-out`
- **Trigger:** `:hover`, `:active`, `:focus`
- **Effect:** Smooth color shift to hover/pressed state

**Input Focus (150ms):**

```tsx
<Input className="transition-shadow duration-150" />
```

- **Property:** Box shadow (focus ring)
- **Duration:** 150ms
- **Easing:** `ease-out`
- **Trigger:** `:focus`
- **Effect:** Ring appears smoothly on focus

**Card Hover (200ms):**

```tsx
<Card className="transition-all duration-200 hover:shadow-md hover:border-primary">
```

- **Property:** Border color, box shadow, background
- **Duration:** 200ms
- **Easing:** `ease-in-out`
- **Trigger:** `:hover`
- **Effect:** Subtle elevation and border highlight

**Switch Toggle (150ms):**

```tsx
<Switch />
```

- **Property:** Thumb position (translate-x), track background
- **Duration:** 150ms
- **Easing:** `ease-in-out`
- **Trigger:** State change (on/off)
- **Effect:** Thumb slides smoothly from left to right

**Checkbox/Radio Check (100ms):**

```tsx
<Checkbox />
```

- **Property:** Background color, checkmark opacity/scale
- **Duration:** 100ms
- **Easing:** `ease-out`
- **Trigger:** State change (checked/unchecked)
- **Effect:** Checkmark appears with subtle scale-up

**Accordion Expand/Collapse (300ms):**

```tsx
<Accordion />
```

- **Property:** Content height (0 → auto)
- **Duration:** 300ms
- **Easing:** `ease-out` (expand), `ease-in` (collapse)
- **Trigger:** AccordionTrigger click
- **Effect:** Smooth reveal/hide of content

```css
/* From main.css */
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}

--animate-accordion-down: accordion-down 0.2s ease-out;
--animate-accordion-up: accordion-up 0.2s ease-out;
```

**Note:** Actual duration is 200ms (0.2s) per CSS definition.

**Tab Switch (200ms):**

```tsx
<TabsTrigger />
```

- **Property:** Background color, border-bottom (active indicator)
- **Duration:** 200ms
- **Easing:** `ease-in-out`
- **Trigger:** Tab click
- **Effect:** Active underline slides/fades in, background changes

**Dropdown Menu Open/Close (150ms):**

```tsx
<DropdownMenu />
```

- **Property:** Opacity, scale (subtle zoom-in)
- **Duration:** 150ms
- **Easing:** `ease-out` (open), `ease-in` (close)
- **Trigger:** Trigger button click, outside click (close)
- **Effect:** Menu appears with subtle scale and fade

**Dialog/Modal Open/Close (400ms):**

```tsx
<Dialog />
```

- **Property:** Opacity (overlay), scale + opacity (content)
- **Duration:** 400ms
- **Easing:** `ease-out` (open), `ease-in` (close)
- **Trigger:** Dialog state change
- **Effect:**
  - **Open:** Overlay fades in, content scales from 95% to 100% with fade-in
  - **Close:** Content scales down to 95% with fade-out, overlay fades out

**Drawer Open/Close (Mobile, 300ms):**

```tsx
<Drawer />
```

- **Property:** Transform (translate-y), overlay opacity
- **Duration:** 300ms
- **Easing:** `ease-out` (open), `ease-in` (close)
- **Trigger:** Drawer state change, swipe gesture
- **Effect:** Drawer slides up from bottom (mobile), overlay fades in

**Toast Notification Enter/Exit (250ms):**

```tsx
toast("Message")
```

- **Property:** Transform (translate-x), opacity
- **Duration:** 250ms
- **Easing:** `ease-out` (enter), `ease-in` (exit)
- **Trigger:** `toast()` call, auto-dismiss, manual dismiss
- **Effect:**
  - **Enter:** Slides in from right with fade-in
  - **Exit:** Slides out to right with fade-out

**Tooltip Show/Hide (100ms):**

```tsx
<Tooltip />
```

- **Property:** Opacity, slight translate-y
- **Duration:** 100ms
- **Easing:** `ease-out` (show), `ease-in` (hide)
- **Trigger:** Hover (200ms delay before show), mouse leave
- **Effect:** Tooltip fades in with subtle upward movement

**Popover Open/Close (150ms):**

```tsx
<Popover />
```

- **Property:** Opacity, scale (subtle)
- **Duration:** 150ms
- **Easing:** `ease-out` (open), `ease-in` (close)
- **Trigger:** Trigger click, outside click (close)
- **Effect:** Popover appears with subtle scale and fade

**Progress Bar Fill (300ms):**

```tsx
<Progress value={percentage} />
```

- **Property:** Width of filled portion
- **Duration:** 300ms
- **Easing:** `ease-out`
- **Trigger:** Value prop change
- **Effect:** Smooth width transition to new percentage

**Skeleton Pulse (1500ms loop):**

```tsx
<Skeleton />
```

- **Property:** Opacity (pulse effect)
- **Duration:** 1500ms (looping)
- **Easing:** `ease-in-out`
- **Trigger:** Component mount (auto-plays)
- **Effect:** Continuous gentle pulse to indicate loading

```css
/* Tailwind default: */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

**Badge Dismiss (100ms):**

```tsx
<Badge dismissible />
```

- **Property:** Opacity, scale
- **Duration:** 100ms
- **Easing:** `ease-in`
- **Trigger:** Close icon click
- **Effect:** Badge shrinks slightly and fades out

**Icon Rotation (150ms):**

Used for chevrons, expand/collapse indicators:

```tsx
<ChevronDown className="transition-transform duration-150" />
```

- **Property:** Transform (rotate)
- **Duration:** 150ms
- **Easing:** `ease-in-out`
- **Trigger:** State change (open/close)
- **Effect:** Smooth 180° rotation (down → up)

**Hover Elevation (Card, 200ms):**

```tsx
<Card className="transition-shadow duration-200 hover:shadow-md">
```

- **Property:** Box shadow
- **Duration:** 200ms
- **Easing:** `ease-in-out`
- **Trigger:** `:hover`
- **Effect:** Subtle shadow appears, creating elevation

**Page Transition (Route Change, 350ms):**

Not explicitly implemented in current routing, but recommended pattern:

```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.35, ease: "easeOut" }}
>
  {children}
</motion.div>
```

- **Property:** Opacity, transform (translate-y)
- **Duration:** 350ms
- **Easing:** `ease-out`
- **Trigger:** Route change
- **Effect:** New page fades in with subtle upward movement, old page fades out downward

### Loading States & Skeletons

**Skeleton Loader:**

```tsx
<Skeleton className="h-4 w-32" />
```

- **Animation:** Continuous pulse (opacity 1 ↔ 0.5)
- **Duration:** 2000ms (Tailwind default pulse)
- **Easing:** `ease-in-out`
- **Trigger:** Auto-play on mount
- **Usage:** Placeholder for loading content (text, images, cards)

**Spinner (Button Loading):**

```tsx
<Button disabled>
  <Loader2 className="animate-spin" />
  Loading...
</Button>
```

- **Animation:** 360° rotation (continuous)
- **Duration:** 1000ms per rotation
- **Easing:** `linear`
- **Trigger:** Loading state active
- **Usage:** Button loading state, full-page loaders

```css
/* Tailwind default: */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### Reduced Motion (Accessibility)

All animations respect user preferences via `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Effect:**
- Users with motion sensitivity settings enabled will see instant state changes
- All animations are effectively disabled (1ms = imperceptible)
- Functionality remains intact, only visual motion is removed

### Animation Triggers Summary

**User Interactions:**
- Mouse hover → Hover state animations (200ms)
- Button click → Press feedback (100ms)
- Keyboard focus → Focus ring (150ms)
- Form submit → Loading spinner, button disabled state
- Checkbox/switch toggle → State change animation (100-150ms)

**State Changes:**
- Accordion expand/collapse → Height animation (300ms)
- Tab switch → Active indicator animation (200ms)
- Dialog open/close → Scale + fade (400ms)
- Toast appear/dismiss → Slide + fade (250ms)
- Progress update → Width transition (300ms)

**System Events:**
- Route change → Page transition (350ms, if implemented)
- Data loading → Skeleton pulse (2000ms loop)
- Auto-dismiss toast → Exit animation after delay (250ms)

**Scroll Events:**
- Sticky header → No animation (instant)
- Infinite scroll → New content fades in (200ms, optional)

### Framer Motion Usage

Framer Motion is installed but used sparingly. Recommended for:

- **Page transitions** (route changes)
- **Complex gestures** (drag-to-reorder, swipe-to-dismiss)
- **Orchestrated animations** (staggered list items)

Example pattern:

```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  {content}
</motion.div>
```

**Default pattern for staggered children:**

```tsx
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}
```

### Performance Considerations

**Prefer CSS Transitions:**
- Use Tailwind `transition-*` utilities for simple state changes
- CSS transitions are more performant than JS animations
- GPU-accelerated properties: `transform`, `opacity`

**Avoid Animating:**
- `width`, `height` (use `scale` or `max-height` with caution)
- `margin`, `padding` (use `transform` instead)
- `background-position` (expensive repaints)

**Optimize for 60fps:**
- Keep animations under 300ms for snappy feel
- Use `will-change` sparingly for complex animations
- Debounce scroll-triggered animations

---

**END OF SECTIONS 8-9**

_Additional sections will be added per user instruction._

---

## 10) Screen-by-Screen Blueprint

This section documents the UI structure, layout, and interactive elements for every route in the application.

### `/` - Dashboard

**Purpose:** Main overview displaying key business metrics.

**Layout:** 11-card grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3`)

**Cards:** Revenue, Clients, Appointments, Pets Groomed, Average Ticket, Services, Activity, Staff Performance, Quick Actions

---

### `/appointments` - Appointments Management

**Tabs:** Groomers View | List View | Calendar View

**Groomers:** Grid of groomer cards with daily appointments
**List:** Sortable table with filters
**Calendar:** Full calendar with color-coded appointments

**Actions:** New Appointment, Edit, Cancel, Complete

---

### `/appointments/new` - New Appointment

**Multi-step form:** Select Client → Pet → Service → Date/Time → Groomer → Notes → Confirm

**Footer:** Back, Next/Submit, Cancel

---

### `/appointments/:id/edit` - Edit Appointment

**Form fields:** Client (read-only), Pet (read-only), Service, Date/Time, Groomer, Status, Notes

**Actions:** Save, Cancel, Delete

---

### `/clients` - Client Directory

**Table columns:** Name, Email, Phone, # Pets, Last Visit, Total Spent

**Actions:** Add Client, Search, Edit, View Profile

---

### `/clients/new` - Add Client

**Sections:** Personal Info, Address, Preferences

**Fields:** Name, Email, Phone, Address, Contact Method, Notes

---

### `/clients/:id` - Client Profile

**Sections:** Client Info, Pets Grid, Appointment History, Payment Summary

**Actions:** Edit Client, Add Pet, View Payments, Contact

---

### `/clients/:id/edit` - Edit Client

Same form as Add Client, pre-filled with data

---

### `/clients/:id/add-pet` - Add Pet

**Fields:** Name, Breed (searchable), Age, Weight, Gender, Color, Medical Notes, Grooming Preferences, Photo

---

### `/clients/:id/payment-history` - Payment History

**Table:** Date, Appointment, Amount, Payment Method, Status

**Filters:** Date range, Payment method

---

### `/clients/:id/contact` - Contact Info

Full contact details with copy-to-clipboard buttons

---

### `/staff` - Staff Management

**Tabs:** Staff List | Payroll

**Staff List:** Table with Add Staff action
**Payroll:** Summary cards and breakdown by staff member

---

### `/staff/:id` - Staff Profile

**Sections:** Personal Info, Schedule, Performance, Payroll Summary

**Actions:** Edit, View Schedule, Delete

---

### `/staff/:id/payroll-breakdown` - Payroll Detail

Earnings breakdown, deductions, net pay, payment history

---

### `/pos` - Point of Sale

**Layout:** Product selection (left) | Cart & checkout (right)

**Actions:** Add items, select client, choose payment method, complete sale

---

### `/inventory` - Inventory Management

**Table:** Items with quantity, price, reorder levels

**Actions:** Add Item, Edit, Delete, Adjust Quantity

---

### `/finances` - Financial Dashboard

**Tabs:** Dashboard | Expenses | Payments | Payroll | Taxes

**Dashboard:** Chart + metric cards
**Other tabs:** Tables with filters and export options

---

### `/settings` - Settings

**Tabs:** Business Info | Staff Positions | Payment Methods

Configure business details, manage positions, enable payment methods

---

### `/messages` & `/reports` - Placeholders

Coming soon pages with PlaceholderPage component

---

### Common Patterns

**Navigation:** TopNav + breadcrumbs on detail pages
**Responsive:** Grids collapse to 1 column, tables scroll horizontally
**Loading:** Skeletons + spinners + toast notifications
**Empty States:** Friendly messages with CTAs
**Errors:** Inline validation + toast notifications

---

**END OF SECTION 10**


_Additional sections will be added per user instruction._

---

## 10) Screen-by-Screen Blueprint

This section documents the UI structure, layout, and interactive elements for every route in the application.

### `/` - Dashboard

**Purpose:** Main overview displaying key business metrics.

**Layout:** 11-card grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3`)

**Cards:** Revenue, Clients, Appointments, Pets Groomed, Average Ticket, Services, Activity, Staff Performance, Quick Actions

---

### `/appointments` - Appointments Management

**Tabs:** Groomers View | List View | Calendar View

**Groomers:** Grid of groomer cards with daily appointments
**List:** Sortable table with filters
**Calendar:** Full calendar with color-coded appointments

**Actions:** New Appointment, Edit, Cancel, Complete

---

### `/appointments/new` - New Appointment

**Multi-step form:** Select Client → Pet → Service → Date/Time → Groomer → Notes → Confirm

**Footer:** Back, Next/Submit, Cancel

---

### `/appointments/:id/edit` - Edit Appointment

**Form fields:** Client (read-only), Pet (read-only), Service, Date/Time, Groomer, Status, Notes

**Actions:** Save, Cancel, Delete

---

### `/clients` - Client Directory

**Table columns:** Name, Email, Phone, # Pets, Last Visit, Total Spent

**Actions:** Add Client, Search, Edit, View Profile

---

### `/clients/new` - Add Client

**Sections:** Personal Info, Address, Preferences

**Fields:** Name, Email, Phone, Address, Contact Method, Notes

---

### `/clients/:id` - Client Profile

**Sections:** Client Info, Pets Grid, Appointment History, Payment Summary

**Actions:** Edit Client, Add Pet, View Payments, Contact

---

### `/clients/:id/edit` - Edit Client

Same form as Add Client, pre-filled with data

---

### `/clients/:id/add-pet` - Add Pet

**Fields:** Name, Breed (searchable), Age, Weight, Gender, Color, Medical Notes, Grooming Preferences, Photo

---

### `/clients/:id/payment-history` - Payment History

**Table:** Date, Appointment, Amount, Payment Method, Status

**Filters:** Date range, Payment method

---

### `/clients/:id/contact` - Contact Info

Full contact details with copy-to-clipboard buttons

---

### `/staff` - Staff Management

**Tabs:** Staff List | Payroll

**Staff List:** Table with Add Staff action
**Payroll:** Summary cards and breakdown by staff member

---

### `/staff/:id` - Staff Profile

**Sections:** Personal Info, Schedule, Performance, Payroll Summary

**Actions:** Edit, View Schedule, Delete

---

### `/staff/:id/payroll-breakdown` - Payroll Detail

Earnings breakdown, deductions, net pay, payment history

---

### `/pos` - Point of Sale

**Layout:** Product selection (left) | Cart & checkout (right)

**Actions:** Add items, select client, choose payment method, complete sale

---

### `/inventory` - Inventory Management

**Table:** Items with quantity, price, reorder levels

**Actions:** Add Item, Edit, Delete, Adjust Quantity

---

### `/finances` - Financial Dashboard

**Tabs:** Dashboard | Expenses | Payments | Payroll | Taxes

**Dashboard:** Chart + metric cards
**Other tabs:** Tables with filters and export options

---

### `/settings` - Settings

**Tabs:** Business Info | Staff Positions | Payment Methods

Configure business details, manage positions, enable payment methods

---

### `/messages` & `/reports` - Placeholders

Coming soon pages with PlaceholderPage component

---

### Common Patterns

**Navigation:** TopNav + breadcrumbs on detail pages
**Responsive:** Grids collapse to 1 column, tables scroll horizontally
**Loading:** Skeletons + spinners + toast notifications
**Empty States:** Friendly messages with CTAs
**Errors:** Inline validation + toast notifications

---

**END OF SECTION 10**


