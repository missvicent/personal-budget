# Database Schema - Personal Budget App

## Overview
PostgreSQL database schema optimized for a manual-entry personal budget application. No bank integrations - all data is user-entered.

**Database**: PostgreSQL 14+ (via Supabase)
**Key Principles**:
- User data isolation via RLS
- Optimized for manual entry workflows
- Real-time capable
- Audit-friendly

## Core Schema

### 1. Users & Profiles

```sql
-- Extends Supabase auth.users
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR ALL USING (auth.uid() = id);
```

### 2. Accounts

```sql
CREATE TABLE public.accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'checking', 'savings', 'credit_card', 'cash', 'investment'
    )),
    balance DECIMAL(12, 2) DEFAULT 0,  -- Current balance (manually updated)
    initial_balance DECIMAL(12, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    color VARCHAR(7),  -- For UI display
    icon VARCHAR(50),  -- For UI display
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_accounts_active ON accounts(user_id, is_active);

-- RLS Policy
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own accounts" ON accounts
    FOR ALL USING (auth.uid() = user_id);
```

### 3. Categories

```sql
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    icon VARCHAR(50),
    color VARCHAR(7),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_system BOOLEAN DEFAULT false,  -- Default categories
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name, parent_id)
);

CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(user_id, type);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own categories" ON categories
    FOR ALL USING (auth.uid() = user_id);
```

### 4. Transactions (Manual Entry - Simplified)

```sql
CREATE TABLE public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    description TEXT,
    merchant VARCHAR(255),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Essential indexes for stories
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);

-- RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own transactions" ON transactions
    FOR ALL USING (auth.uid() = user_id);
```

### 5. Budgets

```sql
CREATE TABLE public.budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    period VARCHAR(20) NOT NULL DEFAULT 'monthly' CHECK (period = 'monthly'),
    start_date DATE NOT NULL,
    end_date DATE,

    -- Alert settings
    alert_enabled BOOLEAN DEFAULT true,
    alert_threshold INTEGER DEFAULT 80,  -- Percentage

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, category_id, period, start_date)
);

CREATE INDEX idx_budgets_user ON budgets(user_id);
CREATE INDEX idx_budgets_active ON budgets(user_id, is_active, start_date);

-- RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own budgets" ON budgets
    FOR ALL USING (auth.uid() = user_id);
```

### 6. Goals

```sql
CREATE TABLE public.goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(12, 2) DEFAULT 0,
    target_date DATE,
    category VARCHAR(50),  -- 'savings', 'debt_payoff', 'purchase', etc.
    notes TEXT,
    is_achieved BOOLEAN DEFAULT false,
    achieved_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_goals_active ON goals(user_id, is_achieved);

-- RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own goals" ON goals
    FOR ALL USING (auth.uid() = user_id);
```

## Database Functions

### Calculate Account Balance

```sql
CREATE OR REPLACE FUNCTION calculate_account_balance(p_account_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    v_balance DECIMAL;
BEGIN
    SELECT
        COALESCE(a.initial_balance, 0) +
        COALESCE(SUM(
            CASE
                WHEN t.type = 'income' AND t.account_id = p_account_id THEN t.amount
                WHEN t.type = 'expense' AND t.account_id = p_account_id THEN -t.amount
                WHEN t.type = 'transfer' AND t.account_id = p_account_id THEN -t.amount
                WHEN t.type = 'transfer' AND t.transfer_to_account_id = p_account_id THEN t.amount
                ELSE 0
            END
        ), 0)
    INTO v_balance
    FROM accounts a
    LEFT JOIN transactions t ON (
        t.account_id = a.id OR
        t.transfer_to_account_id = a.id
    )
    WHERE a.id = p_account_id
    GROUP BY a.id, a.initial_balance;

    RETURN v_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Get Budget Progress (Simplified)

```sql
CREATE OR REPLACE FUNCTION get_budget_progress(p_budget_id UUID, p_start_date DATE, p_end_date DATE)
RETURNS TABLE (
    spent_amount DECIMAL,
    budget_amount DECIMAL,
    remaining_amount DECIMAL,
    percentage_used INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(t.amount), 0) as spent_amount,
        b.amount as budget_amount,
        b.amount - COALESCE(SUM(t.amount), 0) as remaining_amount,
        CASE
            WHEN b.amount > 0 THEN
                ROUND((COALESCE(SUM(t.amount), 0) / b.amount * 100)::numeric)::INTEGER
            ELSE 0
        END as percentage_used
    FROM budgets b
    LEFT JOIN transactions t ON
        t.category_id = b.category_id AND
        t.user_id = b.user_id AND
        t.type = 'expense' AND
        t.transaction_date >= p_start_date AND
        t.transaction_date <= p_end_date
    WHERE b.id = p_budget_id
    GROUP BY b.amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Triggers

### Update Timestamp Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- Repeat for other tables...
```

### Create Default Categories for New Users

```sql
CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO categories (user_id, name, type, icon, color, is_system, display_order)
    VALUES
        -- Income
        (NEW.id, 'Salary', 'income', 'briefcase', '#10B981', true, 1),
        (NEW.id, 'Freelance', 'income', 'laptop', '#3B82F6', true, 2),
        (NEW.id, 'Other Income', 'income', 'plus-circle', '#6B7280', true, 3),

        -- Expenses
        (NEW.id, 'Housing', 'expense', 'home', '#EF4444', true, 1),
        (NEW.id, 'Transportation', 'expense', 'car', '#F59E0B', true, 2),
        (NEW.id, 'Food & Dining', 'expense', 'utensils', '#10B981', true, 3),
        (NEW.id, 'Utilities', 'expense', 'zap', '#3B82F6', true, 4),
        (NEW.id, 'Shopping', 'expense', 'shopping-bag', '#EC4899', true, 5),
        (NEW.id, 'Healthcare', 'expense', 'heart', '#EF4444', true, 6),
        (NEW.id, 'Entertainment', 'expense', 'film', '#8B5CF6', true, 7);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_categories AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_default_categories();
```

## Essential Views

### Category Spending Summary (for Story 5.2)

```sql
CREATE VIEW v_category_spending AS
SELECT
    t.user_id,
    c.name as category_name,
    c.type as category_type,
    SUM(t.amount) as total_amount,
    COUNT(*) as transaction_count
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type IN ('income', 'expense')
GROUP BY t.user_id, c.id, c.name, c.type;

GRANT SELECT ON v_category_spending TO authenticated;
```

## Implementation Guide for Simple Budget App

### Essential Indexes (Story-Focused)

**Must-Have Indexes**:
- `transactions(user_id, transaction_date DESC)` - Story 2.1 & 3.2
- `transactions(user_id, category_id)` - Story 4.2 & 5.2
- `budgets(user_id, is_active)` - Story 4.1 & 4.2
- `categories(user_id, type)` - All stories

### Simple Query Patterns

**Dashboard Queries (Story 2.1)**:
```sql
-- Current month pattern (calculate dates in application)
WHERE transaction_date >= '2024-01-01' AND transaction_date <= '2024-01-31'

-- Today only
WHERE transaction_date = CURRENT_DATE

-- This month (calculated in app, passed as parameters)
WHERE transaction_date >= $1 AND transaction_date <= $2
```

### Data Validation for Manual Entry

**Transaction Validation**:
- Amount must be positive
- Description required for expenses
- Category required for budgeting
- Date defaults to today

**Budget Validation**:
- Monthly period only
- Amount must be positive
- One budget per category

### Security Essentials

**RLS Policies** (Copy-paste ready):
```sql
-- Apply this pattern to all tables
CREATE POLICY "Users manage own data" ON table_name
    FOR ALL USING (auth.uid() = user_id);
```

**Required for Production**:
- All tables have RLS enabled
- No shared data between users
- Use auth.uid() in all policies

### Simple Migration Order

1. Create profiles table + trigger
2. Create categories table + default data trigger
3. Create accounts table
4. Create transactions table
5. Create budgets table
6. Create goals table
7. Create essential views
8. Enable RLS policies

### Performance Tips for Small Apps

**Good Enough Until 10k+ Transactions**:
- Keep all indexes listed above
- Use LIMIT 50 for transaction lists
- Cache category lists in frontend
- Don't over-optimize initially

**When to Add More**:
- Slow dashboard → Add materialized view
- Slow transaction list → Add pagination
- Multiple users → Add user-specific indexes

## Story-Specific Queries

### Story 2.1: Dashboard Queries

```sql
-- Get total account balances for dashboard
SELECT
    SUM(calculate_account_balance(id)) as total_balance
FROM accounts
WHERE user_id = auth.uid() AND is_active = true;

-- Get today's spending for dashboard
SELECT
    COALESCE(SUM(amount), 0) as todays_spending
FROM transactions
WHERE user_id = auth.uid()
  AND type = 'expense'
  AND transaction_date = CURRENT_DATE;
```

### Story 3.1: Add Transaction

```sql
-- Insert new transaction
INSERT INTO transactions (user_id, account_id, category_id, type, amount, description, transaction_date)
VALUES (auth.uid(), $1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE));
```

### Story 3.2: Transaction List

```sql
-- Get recent transactions with category info
SELECT
    t.id, t.amount, t.description, t.transaction_date, t.type,
    c.name as category_name, c.icon as category_icon, c.color as category_color,
    a.name as account_name
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN accounts a ON t.account_id = a.id
WHERE t.user_id = auth.uid()
ORDER BY t.transaction_date DESC, t.created_at DESC
LIMIT 50;
```

### Story 4.1: Create Budget

```sql
-- Create monthly budget
INSERT INTO budgets (user_id, name, category_id, amount, start_date)
VALUES (auth.uid(), $1, $2, $3, DATE_TRUNC('month', CURRENT_DATE));
```

### Story 4.2: Budget Progress

```sql
-- Get budget progress for current month (simplified date range)
SELECT
    b.name, b.amount as budget_amount,
    COALESCE(SUM(t.amount), 0) as spent_amount,
    b.amount - COALESCE(SUM(t.amount), 0) as remaining_amount,
    CASE
        WHEN b.amount > 0 THEN ROUND((COALESCE(SUM(t.amount), 0) / b.amount * 100)::numeric, 0)
        ELSE 0
    END as percentage_used
FROM budgets b
LEFT JOIN transactions t ON
    t.category_id = b.category_id
    AND t.user_id = b.user_id
    AND t.type = 'expense'
    AND t.transaction_date >= b.start_date
    AND (b.end_date IS NULL OR t.transaction_date <= b.end_date)
WHERE b.user_id = auth.uid() AND b.is_active = true
GROUP BY b.id, b.name, b.amount;
```

### Story 5.2: Category Breakdown

```sql
-- Get spending by category (use date parameters in application)
SELECT
    c.name as category_name,
    c.color as category_color,
    SUM(t.amount) as total_amount,
    COUNT(t.id) as transaction_count
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.user_id = auth.uid()
  AND t.type = 'expense'
  AND t.transaction_date >= $1  -- Start date parameter
  AND t.transaction_date <= $2  -- End date parameter
GROUP BY c.id, c.name, c.color
ORDER BY total_amount DESC;
```

---

*Last Updated: 2025-01-20*
*Database: PostgreSQL 14+ via Supabase*
*Focus: Story-driven manual budget tracking with 6 core tables*
*Optimized for: Single-user dashboard, manual transaction entry, monthly budgets*