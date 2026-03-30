# Connection Exhaustion Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent PostgreSQL error 53300 by isolating ElectricSQL behind a dedicated database role with enforced connection limits.

**Architecture:** Create a `electric_user` PostgreSQL role (via Supabase Dashboard) with `CONNECTION LIMIT 15`, `REPLICATION`, and `BYPASSRLS`. A migration grants minimal table access and adds cleanup functions. Docker config is updated to use the new role and adds healthcheck/restart.

**Tech Stack:** PostgreSQL (Supabase managed), Docker Compose, ElectricSQL

**Spec:** `docs/superpowers/specs/2026-03-24-supabase-connection-exhaustion-design.md`

---

### Task 1: Immediate Remediation — Clear Exhausted Connections

This is a manual step. The user must run these queries in the Supabase SQL Editor to unblock the database before any other work can proceed.

**Files:** None (Supabase SQL Editor)

- [ ] **Step 1: Check current connection state**

Run in Supabase SQL Editor:

```sql
SELECT usename, state, COUNT(*)
FROM pg_stat_activity
GROUP BY usename, state
ORDER BY count DESC;
```

Note the output — this confirms the exhaustion pattern and which users/states are consuming connections.

- [ ] **Step 2: Terminate idle connections**

Run in Supabase SQL Editor:

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
  AND pid <> pg_backend_pid();
```

- [ ] **Step 3: Drop stale replication slots**

Run in Supabase SQL Editor:

```sql
SELECT slot_name, active FROM pg_replication_slots;
```

For each inactive slot, run:

```sql
SELECT pg_drop_replication_slot('<slot_name>');
```

- [ ] **Step 4: Stop the ElectricSQL Docker container**

```bash
docker compose stop electric
```

This prevents ElectricSQL from immediately re-exhausting connections while we set up the new role.

---

### Task 2: Create `electric_user` Role via Supabase Dashboard

This is a manual step. The role cannot be created via migrations on managed Supabase.

**Files:** None (Supabase Dashboard)

- [ ] **Step 1: Navigate to Database > Roles in the Supabase Dashboard**

URL: `https://supabase.com/dashboard/project/qedjccrexwvmcbzvcejh/database/roles`

- [ ] **Step 2: Create new role with these settings**

| Setting          | Value                                                          |
| ---------------- | -------------------------------------------------------------- |
| Name             | `electric_user`                                                |
| Password         | Generate a secure password (save it — needed for `.env.local`) |
| Connection limit | `15`                                                           |
| Can login        | Yes                                                            |
| Replication      | Yes                                                            |
| Bypass RLS       | Yes                                                            |

- [ ] **Step 3: Verify the role was created**

Run in Supabase SQL Editor:

```sql
SELECT rolname, rolconnlimit, rolreplication, rolbypassrls
FROM pg_roles
WHERE rolname = 'electric_user';
```

Expected output: one row with `rolconnlimit = 15`, `rolreplication = t`, `rolbypassrls = t`.

---

### Task 3: Create Supabase Migration — Grants and Cleanup Functions

**Files:**

- Create: `supabase/migrations/20260324120000_electric_user_grants.sql`

Note: The timestamp prefix `20260324120000` avoids collision with existing migration `20260324_get_budgets_overview.sql`. Supabase CLI orders migrations by this prefix.

- [ ] **Step 1: Create the migration file**

Create `supabase/migrations/20260324120000_electric_user_grants.sql` with the following content:

```sql
-- Grant minimal required access to electric_user (role created via Dashboard)
GRANT USAGE ON SCHEMA public TO electric_user;
GRANT SELECT ON debts TO electric_user;
GRANT SELECT ON debt_payments TO electric_user;

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

- [ ] **Step 2: Push the migration to Supabase**

```bash
npx supabase db push
```

Expected: Migration applies successfully with no errors.

- [ ] **Step 3: Verify grants were applied**

Run in Supabase SQL Editor:

```sql
SELECT grantee, privilege_type, table_name
FROM information_schema.table_privileges
WHERE grantee = 'electric_user';
```

Expected: Two rows — `SELECT` on `debts` and `SELECT` on `debt_payments`.

- [ ] **Step 4: Verify cleanup functions exist**

Run in Supabase SQL Editor:

```sql
SELECT routine_name, security_type
FROM information_schema.routines
WHERE routine_name IN ('terminate_idle_electric_connections', 'drop_inactive_electric_replication_slots');
```

Expected: Two rows, both with `security_type = DEFINER`.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260324120000_electric_user_grants.sql
git commit -m "Add migration: electric_user grants and cleanup functions"
```

---

### Task 4: Update Environment Configuration

**Files:**

- Modify: `.env.local` (gitignored, not committed)
- Modify: `.env` (template file, committed)

**Important:** `.env` is the committed template. It currently contains a real `SUPABASE_DB_URL` credential that should not be committed. This task also cleans that up.

- [ ] **Step 1: Add `ELECTRIC_DB_URL` to `.env.local`**

Add this line to `.env.local` (replace `<password>` with the password you generated in Task 2):

```
ELECTRIC_DB_URL=postgresql://electric_user:<password>@db.qedjccrexwvmcbzvcejh.supabase.co:5432/postgres
```

- [ ] **Step 2: Update `.env` template — add `ELECTRIC_DB_URL` and remove real credentials**

Replace the contents of `.env` with empty placeholders only:

```
VITE_GOOGLE_CLIENT_ID=
VITE_REDIRECT_URI=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_CLERK_PUBLISHABLE_KEY=
SUPABASE_DB_URL=
ELECTRIC_DB_URL=
```

This adds the new `ELECTRIC_DB_URL` variable and removes the real `SUPABASE_DB_URL` credential that was previously committed. `SUPABASE_DB_URL` remains in the template for Supabase CLI migrations — the real value stays only in `.env.local` (gitignored).

- [ ] **Step 3: Commit the `.env` template change**

```bash
git add .env
git commit -m "Clean up env template: add ELECTRIC_DB_URL, remove real credentials"
```

---

### Task 5: Update Docker Compose Configuration

**Prerequisite:** Task 4 must be completed first — `ELECTRIC_DB_URL` must exist in `.env.local` before Docker can reference it.

**Files:**

- Modify: `docker-compose.yml`

- [ ] **Step 1: Update the `electric` service**

Replace the entire `electric` service block in `docker-compose.yml` with:

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

Changes from current:

- `DATABASE_URL` references `ELECTRIC_DB_URL` instead of `SUPABASE_DB_URL`
- Removed `depends_on: - app` (ElectricSQL depends on external Supabase, not the Vite dev server)
- Added `healthcheck` block
- Added `restart: unless-stopped`

Note: `SUPABASE_DB_URL` remains in `.env.local` for Supabase CLI use (`npx supabase db push`, etc.) — it is no longer referenced by any Docker service.

- [ ] **Step 2: Commit**

```bash
git add docker-compose.yml
git commit -m "Isolate ElectricSQL to dedicated role with healthcheck"
```

---

### Task 6: Verify End-to-End

- [ ] **Step 1: Start ElectricSQL with new config**

```bash
docker compose up electric -d
```

- [ ] **Step 2: Verify ElectricSQL connects with `electric_user`**

Run in Supabase SQL Editor:

```sql
SELECT usename, state, COUNT(*)
FROM pg_stat_activity
WHERE usename = 'electric_user'
GROUP BY usename, state;
```

Expected: A few rows showing `electric_user` connections (should be under 15 total).

- [ ] **Step 3: Verify no `postgres` connections from ElectricSQL**

```sql
SELECT usename, application_name, state, COUNT(*)
FROM pg_stat_activity
WHERE usename = 'postgres'
GROUP BY usename, application_name, state;
```

Expected: No ElectricSQL-related connections under `postgres`.

- [ ] **Step 4: Start the full stack and test the debt-calculator route**

```bash
docker compose up -d
```

Open the app in the browser, navigate to the debt-calculator route, and verify data loads correctly.

- [ ] **Step 5: Verify healthcheck is working**

Find the container name and check its health:

```bash
docker compose ps --format '{{.Name}}'
docker inspect --format='{{json .State.Health}}' $(docker compose ps -q electric)
```

Expected: `Status: "healthy"`.

- [ ] **Step 6: Monitor connections over time**

Leave the dev environment running for 15-30 minutes. Periodically check:

```sql
SELECT usename, state, COUNT(*)
FROM pg_stat_activity
WHERE usename = 'electric_user'
GROUP BY usename, state;
```

Expected: Connection count stays stable and under 15.

---

### Rollback

If something goes wrong at any stage:

- **Docker:** Restore original `electric` service block (revert to `SUPABASE_DB_URL`, add back `depends_on: - app`, remove healthcheck/restart)
- **Environment:** Remove `ELECTRIC_DB_URL` from `.env.local`
- **Migration:** Run `npx supabase migration repair <version> --status reverted` and manually drop the grants/functions via SQL Editor
- **Role:** Delete `electric_user` via Supabase Dashboard > Database > Roles
