# Planning Guide

A client profile page mockup for a pet service business (grooming/vet/boarding) displaying comprehensive client and pet information with financial, appointment, and behavioral metrics.

**Experience Qualities**: 
1. **Professional** - Clean data presentation that inspires confidence in business operations
2. **Informative** - Dense with relevant metrics without feeling overwhelming
3. **Actionable** - Quick access to booking and contact features for immediate client management

**Complexity Level**: Light Application (multiple features with basic state)
This is a static mockup displaying client information with interactive elements like buttons, but no complex state management or data persistence beyond displaying mock data.

## Essential Features

**Client Header**
- Functionality: Displays client name, join date, and primary action buttons
- Purpose: Provides immediate client identification and quick access to key actions
- Trigger: Page load
- Progression: Page loads → Header displays with name, date, action buttons
- Success criteria: Clear client identification with accessible CTAs

**Financial Metrics Widget (3 metrics)**
- Functionality: Shows lifetime spend, average tip, and average $ per visit
- Purpose: Provides financial overview of client value
- Trigger: Page load
- Progression: Page loads → Widget displays three financial metrics in card format
- Success criteria: Clear monetary values with proper formatting

**Appointment Issues Widget (3 metrics)**
- Functionality: Displays no-shows, late cancels, and cancels counts
- Purpose: Tracks client reliability and appointment behavior
- Trigger: Page load
- Progression: Page loads → Widget shows appointment issue counts
- Success criteria: Clear numerical display of appointment problems

**Visit Frequency Widget (3 metrics)**
- Functionality: Shows total appointments, average interval between visits, and days since last visit
- Purpose: Tracks client engagement and visit patterns
- Trigger: Page load
- Progression: Page loads → Widget displays visit frequency data
- Success criteria: Clear display of visit metrics with appropriate units

**Last Visit Section**
- Functionality: Shows information about most recent visit with rebook option
- Purpose: Quick reference to last interaction
- Trigger: Page load
- Progression: Page loads → Displays last visit info or empty state
- Success criteria: Clear empty state or visit details

**Pet Profile Card**
- Functionality: Displays pet information with management actions
- Purpose: Shows pet details, temperament, appointments, and notes
- Trigger: Page load
- Progression: Page loads → Card shows pet avatar, name, type, status, and action buttons
- Success criteria: Comprehensive pet information display with clear CTAs

## Edge Case Handling

- **No Visit Data**: Display "No completed visits yet" message in last visit section
- **Zero Values**: Show $0 or 0 for metrics with no data
- **Long Names**: Truncate or wrap client/pet names appropriately
- **Missing Pet Info**: Handle optional fields gracefully with dash placeholders

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

Animations should be subtle and functional, reinforcing interactions without creating delays—gentle hover states on buttons (scale 1.02 and brightness increase), smooth transitions for state changes (200ms), and micro-interactions on icon buttons.

## Component Selection

- **Components**: 
  - Card (shadcn) - For metric widgets and main content sections, with custom dark backgrounds
  - Button (shadcn) - Primary (cyan accent), Secondary (navy with border), Ghost (icon buttons)
  - Avatar (shadcn) - For pet profile with icon fallback
  - Separator (shadcn) - Subtle dividers between sections
  
- **Customizations**: 
  - Metric cards with glowing border effect on the accent color
  - Custom grid layout for 3-column widget display
  - Icon buttons with circular backgrounds in the top-right corners
  
- **States**: 
  - Buttons: Default (solid or bordered), Hover (scale + brightness), Active (slight scale down), Disabled (opacity 50%)
  - Cards: Static with subtle border glow
  - Interactive elements: Smooth 200ms transitions
  
- **Icon Selection**: 
  - ArrowLeft (back navigation)
  - PencilSimple (edit actions)
  - DotsThree (menu/options)
  - PawPrint (pet indicator)
  
- **Spacing**: 
  - Page padding: p-6 (24px)
  - Card padding: p-6 (24px)
  - Gap between widgets: gap-4 (16px)
  - Metric internal spacing: gap-2 (8px)
  
- **Mobile**: 
  - Stack widgets vertically (grid-cols-1 on mobile, grid-cols-3 on desktop)
  - Reduce header button sizes and stack if needed
  - Maintain readability with consistent padding
  - Full-width cards with preserved internal spacing
