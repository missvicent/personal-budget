# Secure ElectricSQL Deployment — Design Spec

## Problem

ElectricSQL connects directly to the Supabase dev database with `ELECTRIC_INSECURE=true` and no authentication. The Electric endpoint is publicly accessible, allowing anyone to query shapes and potentially abuse the database connection. This needs to be secured without removing ElectricSQL or TanStack DB.

## Decision

Deploy the Electric hub behind an authenticated reverse proxy on Fly.io (free tier). Caddy validates Clerk JWTs and enforces user_id scoping before forwarding requests to Electric. Security is enforced through layered defenses with different scopes (see Security Model).

## Architecture

```
Browser (React app on AWS CloudFront/S3)
  |
  |  HTTPS + Clerk JWT in Authorization header
  v
Fly.io (single machine, 256MB free tier)
  +-- s6-overlay (process manager, supervises both services)
  +-- Caddy (reverse proxy, port 443, publicly exposed)
  |     +-- Validates Clerk JWT signature via JWKS
  |     +-- Extracts user_id from JWT sub claim
  |     +-- Validates where param user_id matches JWT sub (strict regex)
  |     +-- CORS headers for CloudFront origin
  |     +-- Rate limiting
  |     +-- Structured request logging
  |     +-- Forwards valid requests to Electric
  +-- Electric Hub (port 3000, internal only)
        +-- Connects to Supabase via DATABASE_URL (electric_reader role, not postgres)
        +-- Configured with ELECTRIC_PUBLICATION=electric_debt_pub
        +-- Serves shapes only for published tables (debts, debt_payments)
```

### Data Flow

```
Client request (JWT + shape params)
  -> Caddy validates JWT signature + expiry (Layer 1)
  -> Caddy extracts sub from JWT, validates where param via strict regex (Layer 1)
  -> Electric serves shape for published tables only (Layer 2)
  -> Supabase RLS enforces row-level user_id check via electric_reader role (Layer 3)
  -> Response
```

## Security Model — Layered Defenses

Each layer mitigates a different scope of threat. Layers 1 and 2 are fully independent. Layer 3 provides read-only + table restriction but does NOT independently scope by user_id (see Layer 3 notes). User isolation is enforced by Layer 1 (Caddy).

### Layer 1: Caddy Proxy (network level)

- Validates Clerk JWT signature against JWKS endpoint
- Rejects expired or malformed tokens
- Extracts `sub` claim from JWT (Clerk user_id)
- Validates `where` parameter via strict regex (see Where Parameter Validation below)
- Rate limiting to prevent abuse (requires `caddy-ratelimit` plugin — custom Caddy build in Dockerfile, e.g., 60 req/min per IP)
- Structured logging of all requests and auth failures

#### Where Parameter Validation

The `where` parameter is a SQL-fragment string sent by the client. Caddy validates it with a strict regex that allows ONLY the exact expected format:

```
^"user_id"\s*=\s*'(user_[a-zA-Z0-9]+)'$
```

This regex:

- Requires the exact column name `"user_id"`
- Allows only a single equality comparison
- Matches Clerk user*id format (`user*` followed by alphanumeric chars)
- Rejects any additional SQL predicates (e.g., `OR 1=1`, `AND`, `;`)
- Rejects missing or empty `where` parameters

After regex extraction, the captured user_id is compared against the JWT `sub` claim. Mismatch returns 403.

**URL encoding**: Caddy's `query` matcher automatically decodes percent-encoded query parameters before matching, so `%22user_id%22` is decoded to `"user_id"` before the regex runs.

**Multiple `where` params**: If the client sends multiple `where` query parameters, Caddy rejects the request (only one is allowed).

**Client-proxy coupling**: The exact `where` format in `tanstack-db.ts` (`"user_id" = '${userId}'`) must match the Caddy regex. Add a code comment in `tanstack-db.ts` referencing this constraint so future changes don't silently break proxy validation.

### Layer 2: Electric Publication (table level)

- Electric is configured with `ELECTRIC_PUBLICATION=electric_debt_pub`
- This publication restricts Electric to only `debts` and `debt_payments` tables
- Requests for any other table (e.g., `profiles`, `transactions`) are rejected
- No raw SQL accepted — clients can only request predefined shapes

### Layer 3: Supabase RLS via restricted DB role (row level)

**Critical: Electric must NOT connect as the `postgres` superuser.** The `postgres` role bypasses RLS entirely.

A new `electric_reader` PostgreSQL role is created with:

- `SELECT` only on `debts` and `debt_payments` (no INSERT/UPDATE/DELETE)
- RLS enforced (not a superuser, not bypassrls)
- `REPLICATION` privilege (required for Electric's logical replication)

```sql
-- New migration: create restricted role for Electric
CREATE ROLE electric_reader WITH LOGIN PASSWORD '<secure_password>' REPLICATION;
GRANT USAGE ON SCHEMA public TO electric_reader;
GRANT SELECT ON debts, debt_payments TO electric_reader;
-- RLS applies automatically since electric_reader is not a superuser

-- Grant publication access for logical replication
-- (verify exact grants needed against your Supabase PostgreSQL version)
GRANT pg_read_all_data TO electric_reader;  -- may be needed for replication slot access
```

RLS policies already enforce `(auth.jwt()->>'sub') = user_id`. However, since Electric connects as `electric_reader` (not through Supabase auth), the RLS policies need adjustment for this role. Options:

**Option A (recommended)**: Add a separate RLS policy for `electric_reader` that allows SELECT on all rows. Caddy enforces user_id filtering before requests reach Electric.

```sql
CREATE POLICY "Electric reader access" ON debts
  FOR SELECT TO electric_reader USING (true);
CREATE POLICY "Electric reader access" ON debt_payments
  FOR SELECT TO electric_reader USING (true);
```

**Option B**: Skip RLS for Electric entirely (the `electric_reader` role is read-only and publication-restricted). Layer 1 and Layer 2 provide the isolation.

**Important trade-off**: With either option, Layer 3 does NOT independently scope by user_id — it only restricts to read-only access on published tables. User-level data isolation depends entirely on Layer 1 (Caddy's JWT + regex validation). This is acceptable because:

- `electric_reader` is read-only (no data modification possible)
- Only 2 tables are accessible (publication restriction)
- Caddy's strict regex makes bypass extremely difficult
- If stronger isolation is needed in the future, investigate whether Electric supports PostgreSQL session variables (`SET request.jwt.sub = ...`) to enable per-user RLS

### What This Prevents

| Threat                         | Blocked By                                                   |
| ------------------------------ | ------------------------------------------------------------ |
| Unauthenticated access         | Layer 1 (Caddy JWT validation)                               |
| Changing `where` to `1=1`      | Layer 1 (strict regex rejects non-matching patterns)         |
| Adding `OR 1=1` to `where`     | Layer 1 (regex allows only single equality, no operators)    |
| Multiple `where` params        | Layer 1 (Caddy rejects duplicate params)                     |
| Requesting another user's data | Layer 1 (JWT sub must match where user_id) — primary defense |
| Accessing non-debt tables      | Layer 2 (publication + Electric config restrict to 2 tables) |
| SQL injection                  | Electric only accepts shape params, not raw SQL              |
| DDoS                           | Fly.io built-in protection + Caddy rate limiting             |
| Data modification via Electric | Layer 3 (electric_reader has SELECT only)                    |

## Token Refresh Strategy

Electric uses SSE (Server-Sent Events) for long-lived shape subscriptions. When the Clerk JWT expires mid-stream:

**Prerequisites (verify before implementation):**

- Confirm `@tanstack/electric-db-collection` `shapeOptions` accepts a `headers` function (not just a static object). Check the library source/docs. If only static objects are supported, use an alternative approach: wrap the underlying fetch, or recreate collections on token refresh.
- `clerk.session.getToken()` returns `Promise<string | null>` (async). If `headers` must be synchronous, implement a proactive token cache: refresh the token before expiry and serve from cache synchronously.

**Approach (assuming `headers` supports async or function):**

- `tanstack-db.ts` accepts a `getToken` async callback instead of a static auth token
- On each shape request/reconnection, the callback fetches a fresh Clerk token
- If the token expires during an active SSE stream, Electric's client library automatically reconnects, triggering a new request with a fresh token from the callback

```ts
// Pseudocode for tanstack-db.ts change
shapeOptions: {
  url: `${electricUrl}/v1/shape`,
  headers: async () => ({
    Authorization: `Bearer ${await getToken()}`,
  }),
  params: { table: 'debts', where: `"user_id" = '${userId}'` },
}
```

**Fallback (if `headers` only accepts static objects):**

- Cache the Clerk token in a ref, refresh proactively before expiry
- Recreate collections when the token changes
- This is more complex but achieves the same result

## Fly.io Setup Requirements

### Account and CLI

- Create Fly.io account (credit card may be required even for free tier — verify at signup)
- Install `flyctl`: `brew install flyctl`
- Login: `fly auth login`
- Free tier limits (as of 2026-03): 3 shared VMs, 256MB each — verify current terms at https://fly.io/docs/about/pricing/ as these change periodically

### App Configuration

- Create app: `fly launch`
- Region: pick closest to your Supabase project region (check Supabase dashboard -> Project Settings -> General -> Region)
- Machine size: `shared-cpu-1x`, 256MB RAM (free tier)
- Note: Electric + Caddy together may approach the 256MB limit. Monitor with `fly logs` and `fly machine status`. If OOM-killed, upgrade to 512MB ($3.50/month)

### Secrets (set BEFORE first deploy)

| Secret              | Where to Find                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`      | Supabase dashboard -> Project Settings -> Database -> Connection string, but using `electric_reader` role instead of `postgres` |
| `CLERK_JWKS_URL`    | Clerk dashboard -> API Keys -> JWKS URL (`https://<your-clerk-domain>/.well-known/jwks.json`)                                   |
| `CLOUDFRONT_ORIGIN` | Your CloudFront distribution URL (e.g., `https://d1234abc.cloudfront.net`)                                                      |

### Networking

- Fly.io auto-provisions HTTPS with certificate on `<app-name>.fly.dev`
- No custom domain needed
- Internal port 3000 for Electric (not exposed)
- External port 443 for Caddy (exposed via Fly.io)

### CORS Configuration (in Caddyfile)

```
header {
  Access-Control-Allow-Origin {env.CLOUDFRONT_ORIGIN}
  Access-Control-Allow-Headers "Authorization, Content-Type"
  Access-Control-Allow-Methods "GET, OPTIONS"
}
```

### Health Check (in fly.toml)

```toml
[[services.http_checks]]
  interval = 30000
  timeout = 5000
  path = "/health"
  method = "GET"
```

Caddy exposes a `/health` endpoint that checks both itself and Electric's availability.

## Process Management

The Dockerfile uses `s6-overlay` to supervise both Caddy and Electric:

- If Electric crashes, s6 restarts it automatically
- If Caddy crashes, s6 restarts it automatically
- If either fails repeatedly, the container exits and Fly.io restarts it
- Prevents the half-working state (Caddy up / Electric down or vice versa)

## Local Development

`docker-compose.yml` keeps `ELECTRIC_INSECURE=true` for local dev — this is intentional and safe because:

- Local Electric is only accessible on `localhost:3001`
- No Caddy proxy needed locally
- `.env.local` sets `VITE_ELECTRIC_URL=http://localhost:3001`
- Production uses `.env.production` pointing to Fly.io

The `docker-compose.yml` change is only to document that insecure mode is dev-only (add a comment).

## Credential Hygiene

**Prerequisite before deployment**: If `.env` or `.env.local` files containing database passwords have been committed to git history, rotate the following credentials:

- Supabase database password
- Supabase API keys (anon + service role)
- Any other secrets in `.env` files

After rotation, update Fly.io secrets and local env files. Add `.env` and `.env.local` to `.gitignore` if not already present.

## Codebase Changes

### Modified Files

| File                                                     | Change                                                                      |
| -------------------------------------------------------- | --------------------------------------------------------------------------- |
| `docker-compose.yml`                                     | Add comment that `ELECTRIC_INSECURE=true` is dev-only                       |
| `.env.production` (new)                                  | `VITE_ELECTRIC_URL=https://<app-name>.fly.dev`                              |
| `src/lib/tanstack-db.ts`                                 | Accept `getToken` callback, pass as `headers` function to shape requests    |
| `src/routes/_app/debt-calculator/-hooks/use-debt-db.tsx` | Pass Clerk `getToken` to `createDebtCollections` instead of static URL only |

### New Files

| File                                                         | Purpose                                                                                |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `fly/Dockerfile`                                             | Multi-service container: Electric + Caddy + s6-overlay                                 |
| `fly/Caddyfile`                                              | Reverse proxy: JWT validation, user_id regex enforcement, CORS, rate limiting, logging |
| `fly/fly.toml`                                               | Fly.io deployment config with health checks                                            |
| `supabase/migrations/<next>_create_electric_reader_role.sql` | Restricted DB role for Electric                                                        |
| `docs/electric-sql-deployment.md`                            | Full deployment and security documentation                                             |

### Unchanged

- All debt-calculator components
- `debt.service.ts`
- Route-colocated hooks (`use-debts.ts`, `use-debt-payments.ts`, `use-debt-mutations.ts`)
- TanStack DB collection schemas
- Existing Supabase migrations and RLS policies

## Cost

| Component                 | Service                     | Cost         |
| ------------------------- | --------------------------- | ------------ |
| Electric hub + Caddy + s6 | Fly.io shared-cpu-1x, 256MB | Free         |
| HTTPS certificate         | Fly.io auto-provisioned     | Free         |
| Container image           | Fly.io built-in registry    | Free         |
| **Total**                 |                             | **$0/month** |

If 256MB is insufficient: upgrade to 512MB for ~$3.50/month.

## Rollback Plan

If the deployment fails or causes issues:

1. Revert `VITE_ELECTRIC_URL` in `.env.production` to remove the Fly.io URL
2. Redeploy the React app to CloudFront (falls back to no Electric in production)
3. Debt-calculator will not load real-time data until the proxy is fixed
4. Local development is unaffected (uses `docker-compose.yml` directly)
5. `fly machine stop` to stop the Fly.io machine while debugging

## Implementation Checklist

- [ ] **Prerequisites (before any implementation)**
- [ ] Verify `@tanstack/electric-db-collection` `shapeOptions.headers` supports a function (not just static object)
- [ ] Rotate credentials if `.env` files were committed to git history
- [ ] Verify `.env` and `.env.local` are in `.gitignore`
- [ ] Create `electric_reader` PostgreSQL role via new Supabase migration
- [ ] Test `electric_reader` role can access replication slot and publication (adjust grants if needed)
- [ ] Create Fly.io account and install CLI
- [ ] Set Fly.io secrets BEFORE first deploy (`fly secrets set DATABASE_URL=... CLERK_JWKS_URL=... CLOUDFRONT_ORIGIN=...`)
- [ ] Create `fly/Dockerfile` (Electric + Caddy + s6-overlay)
- [ ] Create `fly/Caddyfile` (JWT validation + user_id regex enforcement + CORS + rate limiting + logging)
- [ ] Create `fly/fly.toml` (deployment config + health checks)
- [ ] Update `src/lib/tanstack-db.ts` to accept `getToken` callback for auth headers
- [ ] Update `use-debt-db.tsx` to pass Clerk `getToken` to collection config
- [ ] Add comment to `docker-compose.yml` documenting dev-only insecure mode
- [ ] Add `.env.production` with Fly.io URL
- [ ] Deploy to Fly.io (`fly deploy`)
- [ ] Test: unauthenticated request returns 401
- [ ] Test: request with tampered user_id returns 403
- [ ] Test: request with `where=1=1` returns 403
- [ ] Test: request with `OR` injection returns 403
- [ ] Test: request for unpublished table returns error
- [ ] Test: valid authenticated request returns correct data
- [ ] Test: token expiry and reconnection works
- [ ] Monitor memory usage (`fly logs`, `fly machine status`)
- [ ] Update `README.md` with deployment instructions
- [ ] Write `docs/electric-sql-deployment.md`
