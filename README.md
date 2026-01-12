# ✨ Welcome to Your Spark Template!
You've just launched your brand-new Spark Template Codespace — everything's fired up and ready for you to explore, build, and create with Spark!

This template is your blank canvas. It comes with a minimal setup to help you get started quickly with Spark development.

## 🚀 What's Inside?
- A clean, minimal Spark environment
- Pre-configured for local development
- Ready to scale with your ideas

## 🛠️ Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Verify Spark is installed:
   ```bash
   npm ls @github/spark
   ```
   You should see `@github/spark@0.44.15` (or higher)

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5000

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📋 Configuration

### Spark Configuration
The application uses Spark for data persistence via the key-value store. The Spark app ID is configured in `runtime.config.json`.

### Business Settings
Configure important business settings through the application UI:
- **Settings > Business Information**: Set timezone, business hours, contact info
- **Settings > Services**: Configure grooming services and pricing
- **Settings > Payment Methods**: Enable/disable payment options

⚠️ **Important**: Configure the business timezone in Settings to ensure correct date/time handling across appointments, schedules, and reports.

### Environment Variables
See `.env.example` for configuration options.

## 🏗️ Architecture

### Key Technologies
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Spark** for data persistence
- **shadcn/ui** for UI components
- **React Router** for navigation

### Date/Time Handling
The application uses timezone-aware date utilities (`src/lib/date-utils.ts`) to prevent timezone-related bugs:
- All appointment times use business timezone
- Dates are consistently formatted across the app
- Prevents off-by-one date errors in different timezones
  
## 🧠 What Can You Do?

Right now, this is just a starting point — the perfect place to begin building and testing your Spark applications.

## 🧹 Just Exploring?
No problem! If you were just checking things out and don't need to keep this code:

- Simply delete your Spark.
- Everything will be cleaned up — no traces left behind.

## 📄 License For Spark Template Resources 

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
