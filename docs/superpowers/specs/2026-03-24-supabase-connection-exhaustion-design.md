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

## Design

### 1. Dedicated ElectricSQL Database Role

Create a new PostgreSQL role `electric_user` with enforced connection limits.

**Supabase migration:**

```sql
-- Create dedicated role for ElectricSQL
CREATE ROLE electric_user WITH
  LOGIN
  PASSWORD '<secure-password>'
  CONNECTION LIMIT 10
  REPLICATION;

-- Grant minimal required access
GRANT USAGE ON SCHEMA public TO electric_user;
GRANT SELECT ON debts TO electric_user;
GRANT SELECT ON debt_payments TO electric_user;
```

**Why `CONNECTION LIMIT 10`:** ElectricSQL needs a few connections for logical replication and shape serving. 10 provides headroom for multiple shapes while leaving 190 connections for everything else. This is the hard guard — even if ElectricSQL leaks, it cannot exhaust the pool.

**Why `SELECT` only:** ElectricSQL only reads data via logical replication for shape subscriptions. All writes go through the Supabase JS client (which uses the REST API).

**Why `REPLICATION`:** ElectricSQL requires logical replication to stream changes to shape subscribers.

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
```

These functions can be called manually via the Supabase SQL editor or scheduled via `pg_cron` if needed. They are a safety net — the connection limit on the role is the primary guard.

### 3. Environment Configuration

Separate ElectricSQL credentials from the admin superuser connection.

**New `.env` variable:**

```
ELECTRIC_DB_URL=postgresql://electric_user:<password>@db.<ref>.supabase.co:5432/postgres
```

**Keep existing:**

```
SUPABASE_DB_URL=postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres
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
  depends_on:
    - app
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
- `healthcheck` detects unresponsive ElectricSQL and triggers restart
- `restart: unless-stopped` ensures automatic recovery

### 5. `.env.example` Update

Add `ELECTRIC_DB_URL` to `.env.example` so future setup includes the dedicated role.

## Files Changed

| File                                                       | Change                                           |
| ---------------------------------------------------------- | ------------------------------------------------ |
| `supabase/migrations/<timestamp>_create_electric_user.sql` | New migration: role, grants, cleanup functions   |
| `.env`                                                     | Add `ELECTRIC_DB_URL`                            |
| `.env.example` (if exists)                                 | Add `ELECTRIC_DB_URL` template                   |
| `docker-compose.yml`                                       | Use `ELECTRIC_DB_URL`, add healthcheck + restart |

## Out of Scope

- Removing ElectricSQL entirely (separate initiative, see existing spec)
- Supavisor configuration changes (app queries already go through REST API)
- Production deployment changes (this targets the development environment)

## Success Criteria

- ElectricSQL connects with `electric_user` role limited to 10 connections
- Running the dev environment for extended periods no longer triggers error 53300
- Container restarts cleanly reconnect without leaking connections
- Cleanup functions available for manual use when needed
