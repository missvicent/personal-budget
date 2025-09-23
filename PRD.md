# Product Requirements Document (PRD)
## Personal Budget Management Application

### 1. Executive Summary

The Personal Budget Management Application is a modern, manual-entry web-based financial tracking tool designed to help individuals manage their personal finances effectively. Built with React 19, TypeScript, Supabase, and Google OAuth authentication, the application provides users with comprehensive budget tracking, expense categorization, and financial insights without requiring bank account connections.

**Key Constraint**: All financial data is manually entered by users - no bank integrations or automatic transaction imports.

### 2. Product Vision & Goals

#### Vision
To create an intuitive, secure, and feature-rich personal finance management tool that empowers users to take control of their financial health through data-driven insights and simplified budget tracking.

#### Primary Goals
- Enable users to track income and expenses with minimal friction
- Provide real-time budget monitoring and alerts
- Offer actionable financial insights through data visualization
- Ensure data security and privacy through robust authentication
- Support multi-device accessibility with responsive design

### 3. User Personas

#### Primary Persona: Budget-Conscious Professional
- **Age**: 25-45
- **Tech Savvy**: Moderate to High
- **Goals**: Track monthly expenses, save for specific goals, understand spending patterns
- **Pain Points**: Manual expense tracking, lack of financial visibility, difficulty sticking to budgets

#### Secondary Persona: Financial Planner
- **Age**: 30-55
- **Tech Savvy**: High
- **Goals**: Detailed financial planning, investment tracking, long-term financial goals
- **Pain Points**: Scattered financial data, lack of comprehensive reporting, manual calculations

### 4. Core Features

#### 4.1 Authentication & User Management
- Google OAuth integration for seamless sign-up/sign-in
- User profile management
- Multi-session support
- Account settings and preferences

#### 4.2 Budget Management
- Create multiple budget categories
- Set monthly/weekly/annual budget limits
- Budget templates for quick setup
- Budget sharing (future enhancement)

#### 4.3 Transaction Management
- Manual transaction entry
- Transaction categorization
- Recurring transaction support
- Transaction notes and tags
- File attachments (receipts, invoices)

#### 4.4 Reporting & Analytics
- Dashboard with key metrics
- Spending trends visualization
- Category-wise expense breakdown
- Budget vs. actual comparison
- Monthly/yearly reports
- Export capabilities (CSV, PDF)

#### 4.5 Alerts & Notifications
- Budget threshold warnings
- Bill payment reminders
- Unusual spending alerts
- Weekly/monthly summary emails

### 5. Database Structure

#### 5.1 Core Entities

##### Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    profile_picture_url TEXT,
    currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
```

##### Categories
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    icon VARCHAR(50),
    color VARCHAR(7),
    parent_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name, parent_category_id)
);

CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_parent ON categories(parent_category_id);
```

##### Accounts
```sql
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('checking', 'savings', 'credit_card', 'cash', 'investment')),
    balance DECIMAL(12, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    institution_name VARCHAR(100),
    account_number_last4 VARCHAR(4),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_type ON accounts(type);
```

##### Budgets
```sql
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    alert_threshold DECIMAL(5, 2) DEFAULT 80.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);
CREATE INDEX idx_budgets_dates ON budgets(start_date, end_date);
```

##### Transactions
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    transaction_time TIME,
    merchant VARCHAR(255),
    location VARCHAR(255),
    is_recurring BOOLEAN DEFAULT false,
    recurring_transaction_id UUID REFERENCES recurring_transactions(id) ON DELETE SET NULL,
    tags TEXT[],
    notes TEXT,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_tags ON transactions USING GIN(tags);
```

##### Recurring Transactions
```sql
CREATE TABLE recurring_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT NOT NULL,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    day_of_month INTEGER CHECK (day_of_month BETWEEN 1 AND 31),
    start_date DATE NOT NULL,
    end_date DATE,
    last_processed_date DATE,
    next_due_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recurring_transactions_user_id ON recurring_transactions(user_id);
CREATE INDEX idx_recurring_transactions_next_due ON recurring_transactions(next_due_date);
```

##### Attachments
```sql
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_transaction_id ON attachments(transaction_id);
```

##### Goals
```sql
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0,
    target_date DATE,
    category VARCHAR(50),
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    is_achieved BOOLEAN DEFAULT false,
    achieved_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_target_date ON goals(target_date);
```

##### Notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
```

#### 5.2 Supporting Tables

##### Budget History (for tracking budget changes)
```sql
CREATE TABLE budget_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    changed_by UUID REFERENCES users(id),
    change_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_budget_history_budget_id ON budget_history(budget_id);
```

##### User Sessions
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
```

##### Audit Log
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

### 6. Data Relationships

#### Primary Relationships
- **Users → Transactions**: One-to-Many
- **Users → Categories**: One-to-Many
- **Users → Accounts**: One-to-Many
- **Users → Budgets**: One-to-Many
- **Categories → Transactions**: One-to-Many
- **Categories → Budgets**: One-to-Many
- **Accounts → Transactions**: One-to-Many
- **Transactions → Attachments**: One-to-Many
- **Recurring Transactions → Transactions**: One-to-Many

#### Cascading Rules
- Deleting a user cascades to all related data
- Deleting a category sets NULL in transactions (preserves history)
- Deleting an account sets NULL in transactions (preserves history)
- Deleting a transaction cascades to attachments

### 7. Security Considerations

#### Data Protection
- All sensitive data encrypted at rest
- SSL/TLS for data in transit
- OAuth 2.0 for authentication
- Session management with secure tokens
- Rate limiting on API endpoints

#### Privacy Compliance
- GDPR compliance for EU users
- Data export functionality
- Account deletion with data purge
- Transparent data usage policies
- Audit logging for all data modifications

### 8. Performance Optimization

#### Database Optimization
- Indexed columns for frequent queries
- Partitioning for large tables (transactions)
- Materialized views for reporting
- Connection pooling
- Query optimization and caching

#### Application Performance
- Lazy loading for route components
- Pagination for large datasets
- Debounced search inputs
- Optimistic UI updates
- Service worker for offline capabilities

### 9. Future Enhancements

#### Phase 2 Features
- Bank account integration (Plaid API)
- Bill splitting functionality
- Investment portfolio tracking
- Tax preparation assistance
- Mobile applications (iOS/Android)

#### Phase 3 Features
- AI-powered spending insights
- Automated categorization
- Family budget sharing
- Cryptocurrency tracking
- Advanced forecasting models

### 10. Success Metrics

#### Key Performance Indicators (KPIs)
- User retention rate (target: >60% after 3 months)
- Daily active users (DAU)
- Average transactions per user per month
- Budget adherence rate
- User satisfaction score (NPS)

#### Technical Metrics
- Page load time (<2 seconds)
- API response time (<200ms)
- System uptime (>99.9%)
- Error rate (<0.1%)
- Database query performance

### 11. Implementation Timeline

#### Phase 1: MVP (3 months)
- Month 1: Core authentication, user management, basic UI
- Month 2: Transaction management, categories, accounts
- Month 3: Basic budgets, simple reporting, testing

#### Phase 2: Enhanced Features (2 months)
- Month 4: Advanced reporting, recurring transactions
- Month 5: Goals, notifications, mobile responsiveness

#### Phase 3: Polish & Launch (1 month)
- Month 6: Performance optimization, security audit, deployment

### 12. Technology Stack & Implementation

#### Frontend Stack
- **React 19** with TypeScript for type safety
- **TanStack Router** for file-based routing with type safety
- **TanStack Query** for server state management
- **Tailwind CSS v4** for styling with design system
- **Vite** for build tooling and development
- **Vitest** for testing with jsdom
- **React Hook Form + Zod** for form validation
- **Recharts** for data visualization
- **Lucide React** for icons

#### Backend Stack (Supabase BaaS)
- **Supabase** as Backend-as-a-Service
- **PostgreSQL 14+** with Row Level Security
- **Supabase Auth** for Google OAuth
- **Supabase Storage** for receipt uploads
- **Real-time subscriptions** for live updates
- **Edge Functions** for serverless logic

#### Development Tools
- **TypeScript** strict mode with path aliases
- **ESLint + Prettier** with TanStack config
- **Husky** for git hooks
- **Lint-staged** for pre-commit checks

### 13. UI/UX Requirements

#### Design System
**Color Palette:**
- Primary: Blue (#3B82F6) for actions and navigation
- Success: Green (#10B981) for income and positive states
- Warning: Orange (#F59E0B) for budget alerts
- Error: Red (#EF4444) for expenses and errors
- Neutral: Gray scale for text and backgrounds

**Typography:**
- System font stack with Inter fallback
- Heading scale: text-3xl, text-2xl, text-xl, text-lg
- Body text: text-base (16px) for readability
- Small text: text-sm for metadata

**Component Standards:**
- Consistent spacing using Tailwind's spacing scale
- Rounded corners: rounded-lg for cards, rounded-md for inputs
- Shadow system: shadow-sm to shadow-xl
- Focus states with ring utilities for accessibility

#### Key User Flows

**Onboarding Flow:**
1. Google OAuth sign-in
2. Welcome screen with app overview
3. Create first account (checking/savings)
4. Add initial balance
5. Quick tour of main features

**Transaction Entry Flow:**
1. Click "Add Transaction" button
2. Select transaction type (income/expense/transfer)
3. Choose account and category
4. Enter amount and description
5. Set date (defaults to today)
6. Optional: Add receipt, notes, tags
7. Save with optimistic UI update

**Budget Creation Wizard:**
1. Select category to budget
2. Choose time period (monthly/quarterly/yearly)
3. Set budget amount
4. Configure alert threshold
5. Review and create

#### Mobile-First Design
- Touch-friendly button sizes (min 44px)
- Swipe gestures for quick actions
- Bottom navigation for main sections
- Responsive breakpoints: sm (640px), md (768px), lg (1024px)

#### Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation for all interactions
- Screen reader support with proper ARIA labels
- Color contrast ratio >4.5:1
- Focus indicators on interactive elements

### 14. Implementation Architecture

#### Component Structure
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/
│   │   ├── DashboardCard.tsx
│   │   ├── BalanceOverview.tsx
│   │   └── RecentTransactions.tsx
│   ├── transactions/
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionList.tsx
│   │   └── TransactionFilters.tsx
│   ├── budgets/
│   │   ├── BudgetCard.tsx
│   │   ├── BudgetProgress.tsx
│   │   └── BudgetWizard.tsx
│   ├── shared/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   └── layouts/
│       ├── AppLayout.tsx
│       └── AuthLayout.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useTransactions.ts
│   ├── useBudgets.ts
│   └── useAccounts.ts
├── lib/
│   ├── supabase.ts
│   ├── validations.ts
│   └── utils.ts
├── services/
│   ├── auth.service.ts
│   ├── transaction.service.ts
│   └── budget.service.ts
├── types/
│   ├── database.types.ts
│   ├── api.types.ts
│   └── ui.types.ts
└── utils/
    ├── currency.ts
    ├── date.ts
    └── format.ts
```

#### State Management Strategy
- **Server State**: TanStack Query for caching and synchronization
- **Auth State**: React Context with Supabase auth
- **Form State**: React Hook Form with Zod validation
- **UI State**: Local useState and reducer hooks
- **URL State**: TanStack Router search params

#### Data Flow Patterns
1. **Optimistic Updates**: Immediate UI feedback before server confirmation
2. **Real-time Sync**: Supabase subscriptions for balance updates
3. **Cache Invalidation**: Automatic query invalidation on mutations
4. **Error Boundaries**: Graceful error handling with retry options

### 15. Performance & Optimization

#### Performance Targets
- Initial load: <3 seconds on 3G
- Time to interactive: <2 seconds
- First contentful paint: <1.5 seconds
- Core Web Vitals: All metrics in "Good" range

#### Optimization Strategies
- **Code Splitting**: Route-based with TanStack Router
- **Image Optimization**: WebP format with lazy loading
- **Bundle Analysis**: Monitor bundle size with Vite
- **Caching**: Service worker for offline capabilities
- **Database**: Efficient queries with proper indexing

#### Monitoring & Analytics
- **Error Tracking**: Implement error boundaries and logging
- **Performance Metrics**: Core Web Vitals monitoring
- **User Analytics**: Feature usage and conversion tracking
- **Database Monitoring**: Query performance and slow queries

### 16. Security & Privacy

#### Authentication & Authorization
- Google OAuth 2.0 with secure token handling
- Row Level Security for data isolation
- Session management with automatic refresh
- Secure logout with token invalidation

#### Data Protection
- HTTPS enforcement for all communications
- Input validation on client and server
- XSS protection with Content Security Policy
- Data encryption at rest via Supabase

#### Privacy Compliance
- GDPR-compliant data handling
- User data export functionality
- Complete data deletion on account closure
- Clear privacy policy and terms of service

### 17. Testing Strategy

#### Testing Pyramid
```
E2E Tests (10%)
├── Critical user journeys
├── Cross-browser compatibility
└── Mobile responsiveness

Integration Tests (20%)
├── API integration
├── Database operations
└── Authentication flows

Unit Tests (70%)
├── Component logic
├── Utility functions
├── Custom hooks
└── Business logic
```

#### Testing Tools & Coverage
- **Unit Tests**: Vitest with React Testing Library
- **Integration Tests**: Vitest with MSW for API mocking
- **E2E Tests**: Playwright for critical paths
- **Coverage Target**: >80% for critical business logic
- **Accessibility Tests**: axe-core integration

### 18. Deployment & DevOps

#### Development Workflow
1. Feature branch from main
2. Local development with hot reload
3. Type checking and linting on save
4. Pre-commit hooks run tests and formatting
5. Pull request with automated checks
6. Code review and approval
7. Merge to main triggers deployment

#### Environment Strategy
- **Development**: Local with Supabase local setup
- **Staging**: Production-like environment for testing
- **Production**: Supabase hosted with CDN

#### Monitoring & Maintenance
- Automated dependency updates
- Security vulnerability scanning
- Performance monitoring and alerts
- Regular backup testing and recovery drills

---

*Document Version: 2.0*
*Last Updated: 2025-01-20*
*Status: Ready for Implementation*
*Focus: Manual-entry personal budget tracking*