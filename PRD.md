# Planning Guide

A comprehensive pet grooming business management application with client profiles, appointment scheduling, POS system, inventory management, financial analytics, and multi-page navigation for complete business operations.

**Experience Qualities**: 
1. **Professional** - Clean data presentation that inspires confidence in business operations
2. **Efficient** - Quick navigation between pages with intuitive structure and fast appointment creation
3. **Actionable** - Real-time pricing, easy checkout, and streamlined workflows for everyday use

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a comprehensive multi-page business management application with navigation between Dashboard, Appointments (calendar/list/groomer views), Clients List, individual Client Profiles, Staff Management, POS System, Inventory Management, and other business modules. Features appointment scheduling with real-time pricing, groomer workload balancing, complete POS system with retail sales, inventory tracking with low-stock alerts, client data management, financial analytics with interactive widgets, photo galleries, medical records, and payment history.

## Essential Features

**Top Navigation Bar**
- Functionality: Global navigation across all major sections of the application
- Purpose: Provides quick access to Dashboard, Appointments, Messages, Clients, Staff, POS, Inventory, Finances, Reports, and Settings
- Trigger: Page load
- Progression: Page loads → Navigation bar displays with active state highlighting → Click tab → Navigate to corresponding page with smooth transition
- Success criteria: Clear active state indication, smooth page transitions, persistent navigation across all pages

**Dashboard Page**
- Functionality: Overview of business metrics and quick stats
- Purpose: Provides at-a-glance view of today's appointments, monthly revenue, active clients, and pets groomed
- Trigger: App launch or clicking Dashboard tab
- Progression: Navigate to dashboard → Page loads → Overview cards display with key metrics
- Success criteria: Clear metric presentation, quick load time, actionable insights

**Clients List Page**
- Functionality: Searchable list of all clients with their pets and key information
- Purpose: Browse and search all clients, quick access to individual client profiles
- Trigger: Click Clients tab in navigation
- Progression: Navigate to Clients → List displays with search bar → Type in search → Filter results by client name, pet name, or breed → Click client card → Navigate to client profile
- Success criteria: Fast search, clear client information display, smooth navigation to profiles

**Client Header**
- Functionality: Displays client name, join date, and primary action buttons
- Purpose: Provides immediate client identification and quick access to key actions
- Trigger: Page load on client profile
- Progression: Page loads → Header displays with name, date, action buttons including Add Appointment, Add Pet, Payment History, Contact, and Edit
- Success criteria: Clear client identification with accessible CTAs

**Financial & Appointment Metrics Widgets (5 widgets with interactive stats)**
- Functionality: Shows various client metrics in compact, clickable widgets
- Purpose: Provides at-a-glance analytics about client spending, visit patterns, and reliability
- Trigger: Page load on client profile
- Progression: Page loads → Widgets display with values → Click widget → View detailed breakdown or charts
- Success criteria: Compact display with clear hierarchy, smooth interactions, accurate data visualization

**Pet Profile Cards (Multiple pets per client)**
- Functionality: Displays pet information with flip animation to show grooming preferences
- Purpose: Shows pet details, temperament, appointments, and grooming preferences
- Trigger: Page load on client profile
- Progression: Page loads → Cards display in grid (2-3 per row) → Click card → Card flips to show grooming preferences on back → Edit icon in corner for modifications
- Success criteria: Equal height cards, smooth flip animation, comprehensive pet information display

**Photo Gallery (Before/After Grooming)**
- Functionality: Displays before/after photo pairs from grooming sessions with upload capability
- Purpose: Visual proof of grooming transformations and portfolio for business
- Trigger: Page load or photo upload
- Progression: Page loads → Grid of square photo pairs displays → Click photo → Modal opens with before/after comparison → Upload new photos → Photos save and display in gallery
- Success criteria: Square image format, smooth image loading, intuitive upload flow, clear visual labels for before/after

**Service History (Per Pet)**
- Functionality: Shows chronological list of grooming appointments with details
- Purpose: Track services provided, costs, groomers, and appointment notes
- Trigger: Select pet tab
- Progression: Select pet → Service history displays → Click service entry → View full appointment details in expanded view
- Success criteria: Clear chronological ordering, detailed service breakdown, clickable for full details

**Medical Information Card (Per Pet)**
- Functionality: Displays vaccinations, allergies, medications, and special notes
- Purpose: Critical health information for safe grooming practices
- Trigger: Select pet tab
- Progression: Select pet → Medical info displays → View vaccination schedules, allergy alerts, and medication information
- Success criteria: Clear health alerts, up-to-date vaccination tracking, prominent display of critical information

**Payment History Dialog**
- Functionality: Complete payment history showing all transactions with service breakdowns
- Purpose: Financial tracking including totals, tips, payment methods, and multi-pet billing
- Trigger: Click Payment History button
- Progression: Click button → Dialog opens → Scrollable list of payments displays → View breakdown by pet and service → Close dialog
- Success criteria: Clear transaction history, accurate totals, clear multi-pet billing breakdown

**Appointments System**
- Functionality: Multi-view appointment management with calendar, list, and groomer-specific views
- Purpose: Schedule, track, and manage all grooming appointments with real-time pricing
- Trigger: Navigate to Appointments tab
- Progression: View appointments → Switch between calendar/list/groomer views → Create new appointment → Select client & pet → Choose main service (prices auto-calculate based on pet weight) → Add optional add-ons (price updates in real-time) → Assign groomer or auto-balance → Set date/time → Review total → Create → Track status (scheduled → checked-in → in-progress → completed)
- Success criteria: Fast appointment creation (under 60 seconds), accurate weight-based pricing, groomer workload balancing, clear status tracking, requested groomer data capture

**Point of Sale System**
- Functionality: Complete POS for processing transactions including appointment services and retail products
- Purpose: Handle checkouts, apply discounts/fees, process payments, track all transactions
- Trigger: Navigate to POS tab
- Progression: Select appointment (auto-loads services) → Add retail products → Adjust quantities → Apply discount or additional fees → Select payment method → Review total → Complete transaction → Record to history
- Success criteria: Quick checkout flow, accurate totals, flexible payment options, transaction history tracking

**Inventory Management**
- Functionality: Track retail products and supplies with stock levels and reorder alerts
- Purpose: Manage inventory for both retail sales and internal grooming supplies
- Trigger: Navigate to Inventory tab
- Progression: View all items → Filter by retail/supply → Search items → Add/edit items → Adjust quantities → View low stock alerts → Reorder items
- Success criteria: Clear stock visibility, automatic low-stock warnings, easy quantity adjustments, retail vs supply categorization

## Edge Case Handling

- **No Visit Data**: Display "No completed visits yet" message in service history
- **Zero Values**: Show $0 or 0 for metrics with no data
- **Long Names**: Truncate or wrap client/pet names appropriately
- **Missing Pet Info**: Handle optional fields gracefully with dash placeholders
- **No Search Results**: Display helpful "No clients found" message when search returns empty
- **Single Pet vs Multiple Pets**: Adapt grid layout for varying number of pets per client
- **Empty Photo Gallery**: Show upload prompt when no photos exist
- **Navigation Between Pages**: Maintain smooth transitions and preserve scroll position when appropriate
- **No Appointments**: Display empty state with helpful message in all appointment views
- **Auto-Groomer Assignment**: Evenly distribute appointments across groomers when auto-assign is selected
- **Weight Category Pricing**: Automatically calculate service prices based on pet weight (small/medium/large/giant)
- **Empty Cart**: Disable checkout button and show empty state in POS
- **Low Stock Items**: Highlight items at or below reorder level with warnings
- **Out of Stock**: Disable product selection in POS when quantity is 0
- **Missing Required Fields**: Show validation errors for incomplete forms
- **Duplicate SKUs**: Prevent adding items with duplicate SKU codes in inventory

## Design Direction

The design should evoke a sense of professional competence and modern efficiency, with a dark, sophisticated aesthetic that feels premium and tech-forward—like software built for serious professionals who value both aesthetics and functionality.

## Color Selection

A deep navy/midnight blue palette with bright cyan accents creates a professional, tech-forward aesthetic perfect for business software.

- **Primary Color**: Deep Navy (`oklch(0.18 0.04 250)`) - Conveys professionalism and trustworthiness
- **Secondary Colors**: Dark blue variations (`oklch(0.22 0.04 250)` for cards) - Creates depth and hierarchy
- **Accent Color**: Bright Cyan (`oklch(0.75 0.15 195)`) - Eye-catching for CTAs and important actions, energetic and modern
- **Foreground/Background Pairings**: 
  - Background (Deep Navy #0a0f2c): White text (#FFFFFF) - Ratio 14.2:1 ✓
  - Cards (Dark Blue #141b3d): White text (#FFFFFF) - Ratio 11.8:1 ✓
  - Accent (Bright Cyan #5dd9e8): Dark Navy text (#0a0f2c) - Ratio 8.1:1 ✓
  - Secondary buttons (Navy Blue #2d3a6e): White text (#FFFFFF) - Ratio 7.2:1 ✓

## Font Selection

Modern, legible sans-serif that balances technical precision with approachability—Inter for its excellent readability at all sizes and professional character.

- **Typographic Hierarchy**: 
  - H1 (Client Name): Inter Bold/32px/tight letter-spacing (-0.02em)
  - H2 (Section Titles): Inter Semibold/20px/normal letter-spacing
  - Body (Metric Values): Inter Bold/24px for numbers, Medium/14px for labels
  - Small (Metadata): Inter Regular/12px/uppercase for "CLIENT SINCE" type labels
  - Button Text: Inter Semibold/14px

## Animations

Animations should be subtle and functional, reinforcing interactions without creating delays—gentle hover states on buttons (scale 1.02 and brightness increase), smooth transitions for state changes (200ms), and micro-interactions on icon buttons. Pet cards feature a 3D flip animation when clicked to reveal grooming preferences on the back. Navigation transitions are smooth with no jarring page reloads. Interactive stat widgets respond to clicks with subtle feedback. Photo gallery modals animate in smoothly.

## Component Selection

- **Components**: 
  - Card (shadcn) - For metric widgets, client cards, appointment cards, inventory tables, and main content sections
  - Button (shadcn) - Primary (cyan accent), Secondary (navy with border), Ghost (icon buttons)
  - Input (shadcn) - Search bars with icon, quantity inputs, price inputs
  - Badge (shadcn) - Pet indicators, service tags, status badges, before/after labels, stock levels
  - Tabs (shadcn) - Per-pet information switching, appointment views (calendar/list/groomer), inventory categories
  - Dialog (shadcn) - Full-screen photo comparison modal, payment history, appointment details, create appointment, checkout confirmation, add/edit inventory
  - Avatar (shadcn) - For pet profile with icon fallback
  - Separator (shadcn) - Subtle dividers between sections
  - Select (shadcn) - Client/pet selection, groomer assignment, time slots, payment methods, categories
  - Checkbox (shadcn) - Add-on service selection
  - Textarea (shadcn) - Appointment notes, product descriptions
  - Calendar integration - Week view with time slots for appointment scheduling
  - Table - Inventory listing with inline quantity adjustments
  - Navigation - Custom top navigation bar with active state highlighting
  - Router (react-router-dom) - Page navigation and routing
  
- **Customizations**: 
  - Metric cards with compact spacing and divider lines
  - Custom grid layout for 3-column pet card display
  - Icon buttons with circular backgrounds in top-right corners
  - Flip animation for pet cards using framer-motion or CSS transforms
  - Active navigation state with bottom border highlight
  - Real-time price calculator display in appointment creation
  - Receipt-style summary panel with live updates
  - Calendar grid with time slots and drag-drop support
  - Low-stock warning badges and alerts
  - Quick quantity adjustment buttons (+/-) for inventory and cart
  
- **States**: 
  - Buttons: Default (solid or bordered), Hover (scale + brightness), Active (slight scale down), Disabled (opacity 50%)
  - Cards: Static with hover border color change for client list cards
  - Interactive elements: Smooth 200ms transitions
  - Navigation: Active state with border-bottom and color change
  - Pet Cards: Front (default info) and Back (grooming preferences) with flip transition
  - Appointments: Scheduled (blue), Checked-in (yellow), In-Progress (purple), Completed (green), Cancelled (red)
  - Inventory: Normal stock, Low stock (warning), Out of stock (disabled)
  - Cart Items: Add animation, remove animation, quantity transitions
  
- **Icon Selection**: 
  - ArrowLeft (back navigation)
  - PencilSimple (edit actions)
  - Plus/Minus (add actions, quantity adjustments)
  - PawPrint (pet indicators throughout app)
  - MagnifyingGlass (search functionality)
  - Calendar (appointment scheduling)
  - Clock (appointment times)
  - User (groomer selection, client info)
  - ShoppingCart (POS cart)
  - Receipt (checkout, transactions)
  - CurrencyDollar (pricing, payments)
  - Package (inventory items)
  - Warning (low stock alerts)
  - Trash (delete actions)
  - CaretLeft/CaretRight (navigation arrows)
  
- **Spacing**: 
  - Page padding: p-3 sm:p-6 (12px mobile, 24px desktop)
  - Card padding: p-4 to p-5 (16-20px)
  - Gap between widgets: gap-3 sm:gap-4 (12-16px)
  - Navigation height: Auto with py-4 padding
  - List item spacing: gap-2 to gap-3 (8-12px)
  - Modal/Dialog padding: p-6 (24px)
  
- **Mobile**: 
  - Stack all widgets vertically on mobile
  - Single column for client list and pet cards on mobile
  - Navigation tabs scroll horizontally on small screens
  - Reduce header button sizes and wrap if needed
  - Maintain readability with consistent padding
  - Full-width cards with preserved internal spacing
  - Collapsible appointment calendar to list view on mobile
  - Touch-friendly buttons and controls (min 44px touch targets)
  - Simplified POS layout with cart as bottom sheet or separate view
