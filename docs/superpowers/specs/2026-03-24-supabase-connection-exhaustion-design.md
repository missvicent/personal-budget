# Supabase Connection Exhaustion Fix: ElectricSQL Connection Isolation

**Date:** 2026-03-24
**Status:** Approved
**Scope:** ElectricSQL connection management, PostgreSQL role isolation, Docker configuration

## Problem

PostgreSQL error `53300: remaining connection slots are reserved for roles with the SUPERUSER attribute` on Supabase Pro (200 connection limit). The error occurs after running the development environment for a while, indicating a connection leak.

### Root Cause

ElectricSQL connects to Supabase using the `postgres` superuser with no connection limit. Over time — especially with Docker container restarts and Vite hot reloads — connections accumulate without being released. Stale replication slots and orphaned connections eventually exhaust all 200 slots.

### Current Setup

- **Supabase JS client**: Uses REST API via `VITE_SUPABASE_URL` (already pooled through Supavisor) — not the problem
- **ElectricSQL**: Connects directly to PostgreSQL on port `5432` using `SUPABASE_DB_URL` with `postgres` superuser credentials — the problem
- **ElectricSQL config**: `ELECTRIC_INSECURE: true`, no connection limits, no healthcheck
- **Existing publication**: `electric_debt_pub` for tables `debts` and `debt_payments` (created in `20260313_create_debt_tables.sql`)

## Design

### 1. Dedicated ElectricSQL Database Role

Create a new PostgreSQL role `electric_user` with enforced connection limits.

**Manual step (Supabase Dashboard):** Supabase's managed PostgreSQL does not allow `CREATE ROLE` in migrations. The `electric_user` role must be created via the Supabase Dashboard under Database > Roles:

- **Name:** `electric_user`
- **Password:** Generate a secure password
- **Connection limit:** 15
- **Attributes:** `LOGIN`, `REPLICATION`, `BYPASSRLS`

**Why created via Dashboard:** Supabase restricts `CREATE ROLE` and `ALTER ROLE ... REPLICATION` to platform-level operations. Migrations run as the `postgres` role which lacks `CREATEROLE` on managed Supabase.

**Why `BYPASSRLS`:** The `debts` and `debt_payments` tables have RLS policies that check `auth.jwt()->>'sub'`. ElectricSQL connects as a regular PostgreSQL role without a Supabase JWT, so `auth.jwt()` returns `null` and RLS would block all reads. ElectricSQL's logical replication operates at the WAL level (bypasses RLS), but its HTTP shape endpoint bootstraps data via direct SQL queries that are subject to RLS. `BYPASSRLS` ensures both paths work. This is safe because ElectricSQL already filters rows via `WHERE` clauses in its shape definitions, and the Electric API is only accessible locally in development.

**Supabase migration (grants only):**

```sql
-- Grant minimal required access to electric_user (role created via Dashboard)
GRANT USAGE ON SCHEMA public TO electric_user;
GRANT SELECT ON debts TO electric_user;
GRANT SELECT ON debt_payments TO electric_user;
```

**Why `CONNECTION LIMIT 15`:** ElectricSQL maintains one replication connection plus additional connections per active shape subscription. With two shapes (`debts` and `debt_payments`), typical usage is 3-5 connections. 15 provides headroom for multiple browser tabs and shape reconnections while leaving 185 connections for everything else. If the debt-calculator route shows empty data, this limit may need increasing — check with: `SELECT COUNT(*) FROM pg_stat_activity WHERE usename = 'electric_user';`

**Why `SELECT` only:** ElectricSQL only reads data for shape subscriptions. All writes go through the Supabase JS client (REST API).

**Why `REPLICATION`:** ElectricSQL requires logical replication to stream changes. It creates its own replication slots against the existing `electric_debt_pub` publication (created in `20260313_create_debt_tables.sql`). ElectricSQL names its slots with an `electric_` prefix, which the cleanup functions (Section 2) use for filtering.

### 2. Stale Connection & Replication Slot Cleanup

A safety net for development — hot reloads and unclean container shutdowns leave orphaned connections and replication slots.

**Supabase migration:**

```sql
-- Function to clean up idle ElectricSQL connections
CREATE OR REPLACE FUNCTION terminate_idle_electric_connections(idle_threshold INTERVAL DEFAULT '5 minutes')
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  terminated INTEGER;
BEGIN
  WITH terminated_pids AS (
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE usename = 'electric_user'
      AND state = 'idle'
      AND state_change < NOW() - idle_threshold
      AND pid <> pg_backend_pid()
  )
  SELECT COUNT(*) INTO terminated FROM terminated_pids;

  RETURN terminated;
END;
$$;

-- Function to drop inactive replication slots from ElectricSQL
CREATE OR REPLACE FUNCTION drop_inactive_electric_replication_slots()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  dropped INTEGER := 0;
  slot RECORD;
BEGIN
  FOR slot IN
    SELECT slot_name
    FROM pg_replication_slots
    WHERE NOT active
      AND slot_name LIKE 'electric_%'
  LOOP
    PERFORM pg_drop_replication_slot(slot.slot_name);
    dropped := dropped + 1;
  END LOOP;

  RETURN dropped;
END;
$$;

-- Restrict cleanup functions to postgres role only
REVOKE EXECUTE ON FUNCTION terminate_idle_electric_connections(INTERVAL) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION drop_inactive_electric_replication_slots() FROM PUBLIC;
```

`SECURITY DEFINER` is required because `pg_terminate_backend` and `pg_drop_replication_slot` are superuser-level operations. `REVOKE EXECUTE FROM PUBLIC` ensures only the `postgres` role (owner) can call them — prevents any authenticated database user from terminating connections.

These functions can be called manually via the Supabase SQL editor when needed. They are a safety net — the connection limit on the role is the primary guard.

### 3. Environment Configuration

Separate ElectricSQL credentials from the admin superuser connection.

**Add to `.env.local`:**

```
ELECTRIC_DB_URL=postgresql://electric_user:<password>@db.qedjccrexwvmcbzvcejh.supabase.co:5432/postgres
```

**Keep existing in `.env.local`:**

```
SUPABASE_DB_URL=postgresql://postgres:<password>@db.qedjccrexwvmcbzvcejh.supabase.co:5432/postgres
```

`SUPABASE_DB_URL` remains for Supabase CLI migrations only — not used at runtime by the app or ElectricSQL.

### 4. Docker Configuration Changes

Update `docker-compose.yml`:

```yaml
electric:
  image: electricsql/electric:latest
  ports:
    - '3001:3000'
  environment:
    DATABASE_URL: '${ELECTRIC_DB_URL}'
    ELECTRIC_INSECURE: 'true'
  healthcheck:
    test: ['CMD', 'curl', '-f', 'http://localhost:3000/v1/health']
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 10s
  restart: unless-stopped
```

**Changes:**

- `DATABASE_URL` uses `ELECTRIC_DB_URL` (dedicated role) instead of `SUPABASE_DB_URL` (superuser)
- Removed `depends_on: - app` — ElectricSQL depends on the external Supabase database, not the Vite dev server. The previous dependency was logically incorrect and added unnecessary startup delay.
- `healthcheck` detects unresponsive ElectricSQL and triggers restart via `restart: unless-stopped`
- `restart: unless-stopped` ensures automatic recovery from crashes

## Immediate Remediation

Before implementing the full solution, clear the current connection exhaustion by running in the Supabase SQL Editor:

```sql
-- Check current connection state
SELECT usename, state, COUNT(*)
FROM pg_stat_activity
GROUP BY usename, state
ORDER BY count DESC;

-- Terminate all idle connections (emergency fix)
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
  AND pid <> pg_backend_pid();

-- Drop stale replication slots
SELECT slot_name, active FROM pg_replication_slots;
-- For each inactive slot:
-- SELECT pg_drop_replication_slot('<slot_name>');
```

## Prerequisites

1. **Create `electric_user` role via Supabase Dashboard** (Database > Roles) before running the migration
2. **Stop the ElectricSQL Docker container** before changing credentials
3. **Clear existing stale connections** using the immediate remediation queries above

## Files Changed

| File                                                       | Change                                                                |
| ---------------------------------------------------------- | --------------------------------------------------------------------- |
| `supabase/migrations/<timestamp>_electric_user_grants.sql` | New migration: grants and cleanup functions                           |
| `.env.local`                                               | Add `ELECTRIC_DB_URL`                                                 |
| `docker-compose.yml`                                       | Use `ELECTRIC_DB_URL`, remove `depends_on`, add healthcheck + restart |

## Out of Scope

- Removing ElectricSQL entirely (separate initiative, see existing spec)
- Supavisor configuration changes (app queries already go through REST API)
- Production deployment changes (this targets the development environment)
- Changes to the existing `electric_debt_pub` publication

## Success Criteria

- `electric_user` role exists with `CONNECTION LIMIT 15` and `REPLICATION` + `BYPASSRLS`
- ElectricSQL connects with `electric_user` instead of `postgres` superuser
- Running the dev environment for extended periods no longer triggers error 53300
- Container restarts cleanly reconnect without leaking connections
- Cleanup functions available for manual use via SQL editor
- `SELECT COUNT(*) FROM pg_stat_activity WHERE usename = 'electric_user'` stays under 15
