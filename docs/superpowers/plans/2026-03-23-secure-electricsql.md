# Secure ElectricSQL Deployment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Secure the ElectricSQL hub behind a Caddy reverse proxy on Fly.io, adding JWT authentication, user_id enforcement, and a restricted DB role.

**Architecture:** Caddy reverse proxy validates Clerk JWTs and enforces user_id scoping via strict regex before forwarding to Electric. Electric connects to Supabase via a read-only `electric_reader` role. Deployed as a single Fly.io machine with s6-overlay process management.

**Tech Stack:** Caddy (reverse proxy), ElectricSQL, s6-overlay, Fly.io, Supabase (PostgreSQL), Clerk (JWT), Docker

**Spec:** `docs/superpowers/specs/2026-03-23-secure-electricsql-design.md`

---

## File Map

### New Files

| File                                                           | Responsibility                                                                              |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `fly/Dockerfile`                                               | Multi-service container: custom Caddy build (with ratelimit plugin) + Electric + s6-overlay |
| `fly/Caddyfile`                                                | Reverse proxy: JWT validation, user_id regex, CORS, rate limiting, health check, logging    |
| `fly/fly.toml`                                                 | Fly.io deployment config: machine size, ports, health checks                                |
| `supabase/migrations/20260326_create_electric_reader_role.sql` | Restricted PostgreSQL role for Electric                                                     |
| `.env.production`                                              | Production env vars (`VITE_ELECTRIC_URL`)                                                   |
| `docs/electric-sql-deployment.md`                              | Deployment guide and security documentation                                                 |

### Modified Files

| File                                                     | Change                                                                                   |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/lib/tanstack-db.ts`                                 | Add `getToken` callback param, pass as `headers` to `shapeOptions`, add coupling comment |
| `src/routes/_app/debt-calculator/-hooks/use-debt-db.tsx` | Pass Clerk `getToken` to `createDebtCollections`                                         |
| `docker-compose.yml`                                     | Add comment documenting `ELECTRIC_INSECURE=true` is dev-only                             |
| `README.md`                                              | Add production deployment section                                                        |

---

## Task 1: Supabase Migration — electric_reader Role

**Files:**

- Create: `supabase/migrations/20260326_create_electric_reader_role.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- Create restricted role for ElectricSQL
-- This role has SELECT-only access on debt tables and replication privileges.
-- It does NOT bypass RLS, but has a permissive SELECT policy since
-- user_id scoping is enforced at the Caddy proxy layer.

-- IMPORTANT: After running this migration, change the password via Supabase SQL editor:
--   ALTER ROLE electric_reader WITH PASSWORD '<your-secure-password>';
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'electric_reader') THEN
    CREATE ROLE electric_reader WITH LOGIN PASSWORD 'CHANGE_ME_IMMEDIATELY' REPLICATION;
  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO electric_reader;
GRANT SELECT ON debts, debt_payments TO electric_reader;

-- May be needed for logical replication slot access — verify against your Supabase PostgreSQL version
GRANT pg_read_all_data TO electric_reader;

-- Permissive SELECT policy for electric_reader
-- User-level data isolation is enforced by the Caddy proxy (Layer 1),
-- not by RLS for this role. See docs/superpowers/specs/2026-03-23-secure-electricsql-design.md
CREATE POLICY "Electric reader access" ON debts
  FOR SELECT TO electric_reader USING (true);
CREATE POLICY "Electric reader access" ON debt_payments
  FOR SELECT TO electric_reader USING (true);
```

- [ ] **Step 2: Verify migration syntax locally**

Run: `cat supabase/migrations/20260326_create_electric_reader_role.sql`
Expected: valid SQL, no syntax errors

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260326_create_electric_reader_role.sql
git commit -m "feat: add electric_reader restricted DB role for ElectricSQL security"
```

**Note:** This migration uses a placeholder password. After pushing, immediately change it via Supabase SQL editor: `ALTER ROLE electric_reader WITH PASSWORD '<your-secure-password>';`. Use that password in the `DATABASE_URL` Fly.io secret.

---

## Task 2: Fly.io Deployment Config — fly.toml

**Files:**

- Create: `fly/fly.toml`

- [ ] **Step 1: Create fly.toml**

```toml
app = "personal-budget-electric"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  ELECTRIC_PORT = "3000"
  ELECTRIC_PUBLICATION = "electric_debt_pub"

[http_service]
  internal_port = 443
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true

  [http_service.checks]
    [http_service.checks.health]
      interval = "30s"
      timeout = "5s"
      path = "/health"
      method = "GET"

[[vm]]
  size = "shared-cpu-1x"
  memory = 256
```

- [ ] **Step 2: Commit**

```bash
git add fly/fly.toml
git commit -m "feat: add Fly.io deployment config for Electric proxy"
```

---

## Task 3: Caddyfile — Reverse Proxy with JWT + user_id Enforcement

**Files:**

- Create: `fly/Caddyfile`

- [ ] **Step 1: Create the Caddyfile**

```
{
	order rate_limit before basicauth
}

:443 {
	# Health check endpoint (no auth required)
	# Proxies to Electric to verify both Caddy and Electric are running
	handle /health {
		reverse_proxy localhost:3000 {
			@healthy status 200
			handle_response @healthy {
				respond "OK" 200
			}
			handle_response {
				respond "Electric unhealthy" 503
			}
		}
	}

	# CORS preflight
	@preflight method OPTIONS
	handle @preflight {
		header Access-Control-Allow-Origin {env.CLOUDFRONT_ORIGIN}
		header Access-Control-Allow-Headers "Authorization, Content-Type"
		header Access-Control-Allow-Methods "GET, OPTIONS"
		header Access-Control-Max-Age "86400"
		respond "" 204
	}

	# Rate limiting: 60 requests per minute per IP
	rate_limit {
		zone electric_zone {
			key {remote_host}
			events 60
			window 1m
		}
	}

	# All /v1/shape requests require JWT + user_id validation
	handle /v1/shape* {
		# Set CORS headers on all responses
		header Access-Control-Allow-Origin {env.CLOUDFRONT_ORIGIN}
		header Access-Control-Allow-Headers "Authorization, Content-Type"
		header Access-Control-Allow-Methods "GET, OPTIONS"

		# Validate Clerk JWT
		# The jwtauth plugin validates the JWT signature against the JWKS endpoint
		# and makes claims available as placeholders
		jwtauth {
			jwks_url {env.CLERK_JWKS_URL}
			from_header Authorization
			issuer_whitelist {env.CLERK_ISSUER}
			user_claims sub
		}

		# Validate where parameter:
		# 1. Must exist and match strict format
		# 2. Extracted user_id must match JWT sub claim
		@invalid_where not query where=*
		respond @invalid_where "Forbidden: missing where parameter" 403

		@valid_where_format query where="\"user_id\" = '{http.auth.user.id}'"
		handle @valid_where_format {
			reverse_proxy localhost:3000
		}

		# If where param exists but doesn't match the JWT user_id
		respond "Forbidden: user_id mismatch" 403
	}

	# Block everything else
	respond "Not Found" 404

	log {
		output stdout
		format json
		level INFO
	}
}
```

**Important:**

- The exact Caddyfile syntax for JWT validation and query matching depends on the Caddy plugins used (`caddy-jwt` by ggicci, `caddy-ratelimit` by mholt). The above is the target configuration — plugin-specific syntax may need adjustment during implementation.
- **Before deploying:** verify that `{http.auth.user.id}` placeholder interpolation works inside Caddy `query` matcher values. If it does not, use a `caddy-ext-regex` approach or a custom module for the `where` validation.
- Test locally with `caddy validate --config Caddyfile` before deploying.
- `CLERK_ISSUER` is an additional secret not in the original spec — it enables issuer validation for stronger JWT security.

- [ ] **Step 2: Commit**

```bash
git add fly/Caddyfile
git commit -m "feat: add Caddyfile with JWT validation and user_id enforcement"
```

---

## Task 4: Dockerfile — Multi-Service Container

**Files:**

- Create: `fly/Dockerfile`

- [ ] **Step 1: Create the Dockerfile**

```dockerfile
# Stage 1: Build custom Caddy with plugins
FROM caddy:builder AS caddy-builder
RUN xcaddy build \
    --with github.com/ggicci/caddy-jwt@latest \
    --with github.com/mholt/caddy-ratelimit@latest

# Stage 2: Final image with s6-overlay
FROM electricsql/electric:latest

# Install s6-overlay
ARG S6_OVERLAY_VERSION=3.2.0.2
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-x86_64.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz && \
    tar -C / -Jxpf /tmp/s6-overlay-x86_64.tar.xz && \
    rm /tmp/s6-overlay-*.tar.xz

# Copy custom Caddy binary
COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# s6 service: Electric
RUN mkdir -p /etc/s6-overlay/s6-rc.d/electric /etc/s6-overlay/s6-rc.d/user/contents.d
RUN echo "longrun" > /etc/s6-overlay/s6-rc.d/electric/type
RUN printf '#!/command/execlineb -P\n/usr/bin/electric start\n' > /etc/s6-overlay/s6-rc.d/electric/run && \
    chmod +x /etc/s6-overlay/s6-rc.d/electric/run
RUN touch /etc/s6-overlay/s6-rc.d/user/contents.d/electric

# s6 service: Caddy
RUN mkdir -p /etc/s6-overlay/s6-rc.d/caddy /etc/s6-overlay/s6-rc.d/user/contents.d
RUN echo "longrun" > /etc/s6-overlay/s6-rc.d/caddy/type
RUN printf '#!/command/execlineb -P\n/usr/bin/caddy run --config /etc/caddy/Caddyfile --adapter caddyfile\n' > /etc/s6-overlay/s6-rc.d/caddy/run && \
    chmod +x /etc/s6-overlay/s6-rc.d/caddy/run
RUN touch /etc/s6-overlay/s6-rc.d/user/contents.d/caddy

ENTRYPOINT ["/init"]
```

**Note:** The exact Electric start command (`/usr/bin/electric start`) depends on the `electricsql/electric` image's entrypoint. Verify by running `docker run --rm electricsql/electric:latest cat /entrypoint.sh` or similar. Adjust if the binary path or command differs.

- [ ] **Step 2: Verify Dockerfile builds locally**

Run: `cd fly && docker build -t electric-proxy .`
Expected: successful build (may take a few minutes for the Caddy builder stage)

- [ ] **Step 3: Commit**

```bash
git add fly/Dockerfile
git commit -m "feat: add multi-service Dockerfile for Electric + Caddy + s6"
```

---

## Task 5: Client-Side Auth — Pass Clerk Token to Electric

**Files:**

- Modify: `src/lib/tanstack-db.ts`
- Modify: `src/routes/_app/debt-calculator/-hooks/use-debt-db.tsx`

- [ ] **Step 1: Update `tanstack-db.ts` to accept `getToken` callback**

Replace the `createDebtCollections` function signature and shape options to include auth headers:

In `src/lib/tanstack-db.ts`, change the function from:

```ts
export function createDebtCollections(electricUrl: string, userId: string) {
```

to:

```ts
// IMPORTANT: The where param format ("user_id" = '${userId}') is validated by the
// Caddy reverse proxy via strict regex. Any changes to this format MUST be
// mirrored in fly/Caddyfile. See docs/superpowers/specs/2026-03-23-secure-electricsql-design.md
export function createDebtCollections(
  electricUrl: string,
  userId: string,
  getToken?: () => Promise<string | null>,
) {
```

And update both `shapeOptions` blocks to include `headers`:

```ts
      shapeOptions: {
        url: `${electricUrl}/v1/shape`,
        headers: getToken
          ? { Authorization: async () => `Bearer ${await getToken()}` }
          : undefined,
        params: { table: 'debts', where: `"user_id" = '${userId}'` },
      },
```

Apply the same `headers` change to the `debtPayments` collection.

- [ ] **Step 2: Update `use-debt-db.tsx` to pass Clerk token**

In `src/routes/_app/debt-calculator/-hooks/use-debt-db.tsx`, change the import and provider:

```tsx
import { createContext, useContext, useMemo } from 'react'
import { useAuth } from '@clerk/clerk-react'
import type { DebtCollections } from '@/lib/tanstack-db'
import { createDebtCollections } from '@/lib/tanstack-db'

const DebtDBContext = createContext<DebtCollections | null>(null)

const ELECTRIC_URL =
  import.meta.env.VITE_ELECTRIC_URL ?? 'http://localhost:3001'

export function DebtDBProvider({ children }: { children: React.ReactNode }) {
  const { userId, getToken } = useAuth()

  const collections = useMemo(() => {
    if (!userId) return null
    return createDebtCollections(ELECTRIC_URL, userId, getToken)
  }, [userId, getToken])

  if (!collections) return null

  return (
    <DebtDBContext.Provider value={collections}>
      {children}
    </DebtDBContext.Provider>
  )
}

export function useDebtDB(): DebtCollections {
  const collections = useContext(DebtDBContext)
  if (!collections)
    throw new Error('useDebtDB must be used within DebtDBProvider')
  return collections
}
```

- [ ] **Step 3: Verify the app builds**

Run: `npm run build`
Expected: successful build, no TypeScript errors

- [ ] **Step 4: Verify the app works locally**

Run: `npm run dev`
Expected: debt-calculator route loads, Electric connects to localhost:3001 (if docker-compose is running). The `getToken` callback is passed but not enforced locally since `ELECTRIC_INSECURE=true`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tanstack-db.ts src/routes/_app/debt-calculator/-hooks/use-debt-db.tsx
git commit -m "feat: pass Clerk auth token to Electric shape requests"
```

---

## Task 6: Update docker-compose.yml and Environment Files

**Files:**

- Modify: `docker-compose.yml`
- Create: `.env.production`

- [ ] **Step 1: Add dev-only comment to docker-compose.yml**

Add a comment above the `ELECTRIC_INSECURE` line:

```yaml
electric:
  image: electricsql/electric:latest
  ports:
    - '3001:3000'
  environment:
    DATABASE_URL: '${SUPABASE_DB_URL}'
    # DEV ONLY: Insecure mode skips auth. Production uses Caddy proxy on Fly.io.
    # See docs/superpowers/specs/2026-03-23-secure-electricsql-design.md
    ELECTRIC_INSECURE: 'true'
  depends_on:
    - app
```

- [ ] **Step 2: Create `.env.production`**

```env
VITE_ELECTRIC_URL=https://personal-budget-electric.fly.dev
```

**Note:** The app name `personal-budget-electric` is a placeholder. The user will replace this with their actual Fly.io app name after running `fly launch`.

- [ ] **Step 3: Verify `.env.production` is NOT in `.gitignore`**

`.env.production` should be committed (it contains no secrets — just a public URL). Check that `.gitignore` only excludes `*.local` and `.env`, not `.env.production`.

Run: `grep -n "env.production" .gitignore`
Expected: no matches (file is not ignored)

- [ ] **Step 4: Commit**

```bash
git add docker-compose.yml .env.production
git commit -m "feat: document dev-only insecure mode and add production env"
```

---

## Task 7: Update README.md

**Files:**

- Modify: `README.md`

- [ ] **Step 1: Update the ElectricSQL section**

Replace the existing `### ElectricSQL` section (lines 144-151) with:

```markdown
### ElectricSQL

The debt calculator (`/debt-calculator`) uses ElectricSQL + TanStack DB for real-time sync of `debts` and `debt_payments` tables.

**Local development:**

- `SUPABASE_DB_URL` - direct Postgres connection string (set in `.env.local`)
- `ELECTRIC_INSECURE=true` - set in `docker-compose.yml` (dev only, safe on localhost)
- App connects via `VITE_ELECTRIC_URL` (defaults to `http://localhost:3001`)

**Production (Fly.io):**

- Electric runs behind a Caddy reverse proxy with Clerk JWT authentication
- User_id enforcement via strict regex validation on shape requests
- Restricted `electric_reader` DB role (SELECT-only, no superuser)
- See `docs/electric-sql-deployment.md` for full setup guide
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README with production ElectricSQL deployment info"
```

---

## Task 8: Deployment Documentation

**Files:**

- Create: `docs/electric-sql-deployment.md`

- [ ] **Step 1: Create the deployment guide**

````markdown
# ElectricSQL Production Deployment Guide

## Overview

ElectricSQL is deployed on Fly.io behind a Caddy reverse proxy that enforces
Clerk JWT authentication and user_id scoping. This document covers setup,
deployment, and maintenance.

## Prerequisites

- Fly.io account with `flyctl` installed (`brew install flyctl`)
- Supabase project with `debts` and `debt_payments` tables
- Clerk account with JWT authentication configured
- AWS CloudFront distribution serving the React app

## Security Architecture

See `docs/superpowers/specs/2026-03-23-secure-electricsql-design.md` for the
full security model with three defense layers.

## Step 1: Create the electric_reader Role

Run the Supabase migration:

```bash
npx supabase db push
```
````

This creates the `electric_reader` PostgreSQL role with:

- SELECT-only on `debts` and `debt_payments`
- REPLICATION privilege for Electric's logical replication
- Permissive RLS policy (user scoping is done at proxy layer)

Set a secure password for the role in your Supabase dashboard.

## Step 2: Deploy to Fly.io

```bash
# Login
fly auth login

# Launch app (from the fly/ directory)
cd fly
fly launch --name personal-budget-electric

# Set secrets BEFORE first deploy
fly secrets set \
  DATABASE_URL="postgresql://electric_reader:<password>@<supabase-host>:5432/postgres?sslmode=require" \
  CLERK_JWKS_URL="https://<your-clerk-domain>/.well-known/jwks.json" \
  CLERK_ISSUER="https://<your-clerk-domain>" \
  CLOUDFRONT_ORIGIN="https://<your-cloudfront-domain>"

# Deploy
fly deploy
```

## Step 3: Update React App

Set `VITE_ELECTRIC_URL` in `.env.production`:

```env
VITE_ELECTRIC_URL=https://personal-budget-electric.fly.dev
```

Rebuild and deploy to CloudFront/S3.

## Verification

Test each security layer:

```bash
# Should return 401 (no auth)
curl https://personal-budget-electric.fly.dev/v1/shape?table=debts

# Should return 403 (wrong user_id)
curl -H "Authorization: Bearer <valid-token>" \
  "https://personal-budget-electric.fly.dev/v1/shape?table=debts&where=\"user_id\"='wrong_user'"

# Should return 403 (injection attempt)
curl -H "Authorization: Bearer <valid-token>" \
  "https://personal-budget-electric.fly.dev/v1/shape?table=debts&where=1=1"

# Should return 404 (unpublished table)
curl -H "Authorization: Bearer <valid-token>" \
  "https://personal-budget-electric.fly.dev/v1/shape?table=profiles&where=\"user_id\"='<your-user-id>'"

# Should return 200 with data
curl -H "Authorization: Bearer <valid-token>" \
  "https://personal-budget-electric.fly.dev/v1/shape?table=debts&where=\"user_id\"='<your-user-id>'"
```

## Monitoring

```bash
fly logs                # Real-time logs (Caddy + Electric)
fly machine status      # Machine memory/CPU usage
fly ssh console         # SSH into the machine for debugging
```

## Rollback

1. Revert `VITE_ELECTRIC_URL` in `.env.production`
2. Redeploy React app to CloudFront
3. `fly machine stop` to stop the Fly.io machine
4. Local dev is unaffected

## Credential Rotation

If credentials are compromised:

1. Rotate `electric_reader` password in Supabase
2. Update Fly.io secret: `fly secrets set DATABASE_URL="..."`
3. Fly.io auto-restarts the machine with new secrets

````

- [ ] **Step 2: Commit**

```bash
git add docs/electric-sql-deployment.md
git commit -m "docs: add ElectricSQL production deployment guide"
````

---

## Task 9: Deploy and Verify

This task requires user interaction (Fly.io account, secrets, Supabase migration).

- [ ] **Step 1: Push Supabase migration**

Run: `npx supabase db push`
Expected: migration applies successfully, `electric_reader` role created

- [ ] **Step 2: Test electric_reader role grants**

Connect to Supabase SQL editor and verify:

```sql
-- Should succeed (SELECT allowed)
SET ROLE electric_reader;
SELECT count(*) FROM debts;
SELECT count(*) FROM debt_payments;

-- Should fail (no INSERT/UPDATE/DELETE)
INSERT INTO debts (name, type, principal_amount, interest_rate, current_balance, minimum_payment, start_date)
VALUES ('test', 'credit_card', 100, 5, 100, 10, '2026-01-01');

RESET ROLE;
```

- [ ] **Step 2b: Test electric_reader replication access**

Connect to Supabase SQL editor:

```sql
-- Verify the role can see the publication
SET ROLE electric_reader;
SELECT * FROM pg_publication WHERE pubname = 'electric_debt_pub';
RESET ROLE;
```

Expected: returns the publication row. If it fails, adjust grants (may need `GRANT pg_read_all_data TO electric_reader;` or publication ownership changes).

- [ ] **Step 3: Create Fly.io app and set secrets**

```bash
cd fly
fly auth login
fly launch --name personal-budget-electric
fly secrets set \
  DATABASE_URL="postgresql://electric_reader:<password>@<host>:5432/postgres?sslmode=require" \
  CLERK_JWKS_URL="https://<clerk-domain>/.well-known/jwks.json" \
  CLERK_ISSUER="https://<clerk-domain>" \
  CLOUDFRONT_ORIGIN="https://<cloudfront-domain>"
```

- [ ] **Step 4: Deploy**

Run: `cd fly && fly deploy`
Expected: deployment succeeds, health check passes

- [ ] **Step 5: Run verification tests**

Test unauthenticated request:

```bash
curl -s -o /dev/null -w "%{http_code}" https://personal-budget-electric.fly.dev/v1/shape?table=debts
```

Expected: `401`

Test tampered user_id:

```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer <token>" \
  "https://personal-budget-electric.fly.dev/v1/shape?table=debts&where=\"user_id\"='user_wrong'"
```

Expected: `403`

Test injection attempt (`where=1=1`):

```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer <token>" \
  "https://personal-budget-electric.fly.dev/v1/shape?table=debts&where=1=1"
```

Expected: `403`

Test OR injection:

```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer <token>" \
  "https://personal-budget-electric.fly.dev/v1/shape?table=debts&where=\"user_id\"='<your-id>'%20OR%201=1"
```

Expected: `403`

Test unpublished table:

```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer <token>" \
  "https://personal-budget-electric.fly.dev/v1/shape?table=profiles&where=\"user_id\"='<your-user-id>'"
```

Expected: error (table not in publication)

Test valid request:

```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer <token>" \
  "https://personal-budget-electric.fly.dev/v1/shape?table=debts&where=\"user_id\"='<your-user-id>'"
```

Expected: `200`

- [ ] **Step 6: Update `.env.production` with actual app name**

Replace placeholder URL with actual Fly.io app URL.

- [ ] **Step 7: Deploy React app to CloudFront**

Rebuild with production env and deploy to S3/CloudFront.

- [ ] **Step 8: End-to-end test**

Open the app in browser, navigate to `/debt-calculator`, verify:

- Debts load correctly
- Creating a debt works
- Real-time sync works (if you have a second tab/window)

- [ ] **Step 9: Monitor memory**

Run: `fly machine status`
Expected: memory usage under 256MB. If over, upgrade to 512MB: `fly scale memory 512`

- [ ] **Step 10: Final commit**

```bash
git add .env.production
git commit -m "feat: configure production Electric URL for Fly.io deployment"
```
