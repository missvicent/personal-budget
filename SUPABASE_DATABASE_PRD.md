# Supabase Implementation Guide

## Personal Budget App - Backend Setup

### Overview

This guide provides the complete Supabase configuration for a manual-entry personal budget application. Focus on simplicity, security, and manual data workflows.

**Platform**: Supabase (PostgreSQL 15+)

**Key Features**:
- Google OAuth authentication
- Row Level Security for data isolation
- Real-time subscriptions for live updates
- File storage for receipts
- Edge functions for automation

---

## 1. Project Setup

### Initial Configuration

```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Initialize project
supabase init

# Start local development
supabase start

# Link to remote project
supabase link --project-ref YOUR_PROJECT_REF
```

### Environment Variables

```env
# .env.local
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# For development
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 2. Authentication Setup

### Enable Google OAuth

1. Go to Authentication > Providers in Supabase dashboard
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set redirect URLs:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

### User Profile Setup

```sql
-- Create profiles table
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

-- Policy for users to manage their own profile
CREATE POLICY "Users can manage own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 3. Core Tables

### Categories Table

```sql
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    icon VARCHAR(50),
    color VARCHAR(7),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_system BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name, parent_id)
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own categories" ON categories
    FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(user_id, type);
```

### Accounts Table

```sql
CREATE TABLE public.accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'checking', 'savings', 'credit_card', 'cash', 'investment'
    )),
    balance DECIMAL(12, 2) DEFAULT 0,
    initial_balance DECIMAL(12, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    color VARCHAR(7),
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own accounts" ON accounts
    FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_accounts_active ON accounts(user_id, is_active);
```

### Transactions Table

```sql
CREATE TABLE public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    description TEXT,
    merchant VARCHAR(255),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,

    -- For transfers
    transfer_to_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,

    -- Metadata
    tags TEXT[],
    notes TEXT,
    receipt_url TEXT,

    -- Tracking
    is_recurring BOOLEAN DEFAULT false,
    recurring_id UUID REFERENCES recurring_transactions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CHECK (
        (type = 'transfer' AND transfer_to_account_id IS NOT NULL) OR
        (type != 'transfer' AND transfer_to_account_id IS NULL)
    )
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own transactions" ON transactions
    FOR ALL USING (auth.uid() = user_id);

-- Optimized indexes for common queries
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_month ON transactions(user_id, DATE_TRUNC('month', transaction_date));
```

### Budgets Table

```sql
CREATE TABLE public.budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    period VARCHAR(20) NOT NULL CHECK (period IN ('monthly', 'quarterly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    alert_enabled BOOLEAN DEFAULT true,
    alert_threshold INTEGER DEFAULT 80,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, category_id, period, start_date)
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own budgets" ON budgets
    FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_budgets_user ON budgets(user_id);
CREATE INDEX idx_budgets_active ON budgets(user_id, is_active, start_date);
```

---

## 4. Database Functions

### Account Balance Calculation

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

### Budget Progress Function

```sql
CREATE OR REPLACE FUNCTION get_budget_progress(p_budget_id UUID)
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
        t.transaction_date >= b.start_date AND
        (b.end_date IS NULL OR t.transaction_date <= b.end_date)
    WHERE b.id = p_budget_id
    GROUP BY b.amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. Storage Setup

### Create Storage Bucket

```sql
-- Create receipts bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false);

-- Storage policies
CREATE POLICY "Users can upload receipts" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'receipts' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own receipts" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'receipts' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own receipts" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'receipts' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
```

---

## 6. Real-time Configuration

### Enable Real-time for Key Tables

```sql
-- Enable real-time for important tables
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE budgets;
```

### Frontend Real-time Setup

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Subscribe to changes
export function subscribeToTransactions(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('transactions')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}
```

---

## 7. Migration Scripts

### Create Default Categories

```sql
-- Function to create default categories for new users
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

-- Trigger to create categories for new users
CREATE TRIGGER create_user_categories AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_default_categories();
```

### Update Timestamp Triggers

```sql
-- Generic function for updating timestamps
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

CREATE TRIGGER set_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 8. Frontend Integration

### TypeScript Types

```typescript
// types/database.types.ts
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          currency: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Insert>
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment'
          balance: number
          initial_balance: number
          currency: string
          color: string | null
          icon: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Insert>
      }
      // ... other tables
    }
  }
}
```

### Custom Hooks

```typescript
// hooks/useAccounts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      return data
    }
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (account: Database['public']['Tables']['accounts']['Insert']) => {
      const { data, error } = await supabase
        .from('accounts')
        .insert(account)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    }
  })
}
```

---

## 9. Security Best Practices

### Row Level Security Checklist

- ✅ All tables have RLS enabled
- ✅ Policies use `auth.uid()` for user isolation
- ✅ No direct foreign key to `auth.users` except in profiles
- ✅ Service role used only for admin functions

### Data Validation

```sql
-- Example: Prevent negative account balances for non-credit accounts
ALTER TABLE accounts ADD CONSTRAINT positive_balance_check
    CHECK (
        (type = 'credit_card') OR
        (balance >= 0)
    );

-- Ensure transaction amounts are positive
ALTER TABLE transactions ADD CONSTRAINT positive_amount_check
    CHECK (amount > 0);
```

---

## 10. Development Workflow

### Local Development

```bash
# Start Supabase locally
supabase start

# Reset database (careful!)
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > src/types/database.types.ts

# Run migrations
supabase db push

# Stop local instance
supabase stop
```

### Migration Management

```bash
# Create new migration
supabase migration new add_goals_table

# Apply migrations to remote
supabase db push

# Pull remote changes
supabase db pull
```

---

## 11. Performance Tips

### Query Optimization

```typescript
// Good: Use specific selects
const { data } = await supabase
  .from('transactions')
  .select('id, amount, description, transaction_date')
  .eq('user_id', userId)
  .order('transaction_date', { ascending: false })
  .limit(50)

// Good: Use filters to reduce data transfer
const { data } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
  .gte('transaction_date', startDate)
  .lte('transaction_date', endDate)
```

### Caching Strategy

```typescript
// Cache account balances for 5 minutes
export function useAccountBalance(accountId: string) {
  return useQuery({
    queryKey: ['account-balance', accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('calculate_account_balance', { p_account_id: accountId })

      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
```

---

## 12. Deployment

### Environment Setup

```yaml
# Production environment variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_GOOGLE_CLIENT_ID=your-production-google-client-id
```

### Database Backup

```bash
# Manual backup
supabase db dump -f backup.sql

# Automated backup via Supabase dashboard:
# Settings > Database > Automated backups
```

---

*Last Updated: 2025-01-20*
*Platform: Supabase with PostgreSQL 15+*
*Focus: Manual-entry budget tracking*