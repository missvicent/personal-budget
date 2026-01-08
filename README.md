# Personal Budget

A modern personal finance management application that helps you track expenses, manage budgets, and gain insights into your spending habits.

## Features

- **Dashboard** - Overview of your financial status with visual analytics
- **Transactions** - Log and categorize your expenses and income
- **Budget Management** - Set monthly budgets by category with visual progress indicators
- **Recurring Expenses** - Track and manage recurring payments
- **Goal Tracker** - Set and monitor your financial goals
- **AI Insights** - Smart spending analysis and projections (coming soon)

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Routing**: TanStack Router (file-based routing)
- **Data Fetching**: TanStack Query
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, Lucide Icons
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Authentication**: Clerk
- **Database**: Supabase
- **Testing**: Vitest

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev
```

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run serve    # Preview production build
npm run test     # Run tests
npm run lint     # Run ESLint
npm run format   # Check formatting with Prettier
npm run check    # Fix linting and formatting issues
```

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build locally
npm run serve
```

The build command runs `vite build && tsc` to bundle the app and verify TypeScript types.

## Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) with [lint-staged](https://github.com/lint-staged/lint-staged) to ensure code quality before commits.

On every commit, the following checks run automatically:

- **JS/TS files**: Prettier formatting + ESLint fixes
- **JSON/MD/HTML/CSS files**: Prettier formatting

## Testing

This project uses [Vitest](https://vitest.dev/) for testing.

```bash
npm run test     # Run all tests
```

Place test files alongside components or in dedicated `__tests__` directories.

## Project Structure

```text
src/
├── components/
│   ├── common/          # Shared components (Header, Sidebar, Footer)
│   ├── features/        # Feature-specific components
│   ├── ui/              # UI primitives (Button, Card, Input, etc.)
│   └── user/            # User-related components
│
├── contexts/            # React contexts (AuthContext)
│
├── hooks/               # Custom React hooks with TanStack Query
│   ├── use-supabase.ts
│   └── use-sync-user.ts
│
├── lib/                 # Utility libraries
│   ├── supabaseClient.ts
│   └── utils.ts
│
├── routes/              # File-based routes (TanStack Router)
│   ├── _app/            # Protected app routes
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── budget/
│   │   ├── recurring-expenses/
│   │   ├── goal-tracker/
│   │   └── ia-insights/
│   ├── _public/         # Public routes
│   └── auth/            # Authentication routes
│
├── services/            # API service functions (Supabase queries)
│   ├── account.service.ts
│   └── profiles.service.ts
│
└── types/               # TypeScript type definitions
    ├── database.types.ts
    └── user.ts
```

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## License

MIT
