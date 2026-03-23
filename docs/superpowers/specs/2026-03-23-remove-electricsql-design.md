# Secure ElectricSQL Deployment — Design Spec

## Problem

ElectricSQL connects directly to the Supabase dev database with `ELECTRIC_INSECURE=true` and no authentication. The Electric endpoint is publicly accessible, allowing anyone to query shapes and potentially abuse the database connection. This needs to be secured without removing ElectricSQL or TanStack DB.

## Decision

Deploy the Electric hub behind an authenticated reverse proxy on Fly.io (free tier). Caddy validates Clerk JWTs and enforces user_id scoping before forwarding requests to Electric. Three independent security layers protect the database.

## Architecture

```
Browser (React app on AWS CloudFront/S3)
  |
  |  HTTPS + Clerk JWT in Authorization header
  v
Fly.io (single machine, 256MB free tier)
  +-- Caddy (reverse proxy, port 443, publicly exposed)
  |     +-- Validates Clerk JWT signature via JWKS
  |     +-- Extracts user_id from JWT sub claim
  |     +-- Validates where param user_id matches JWT sub
  |     +-- Rate limiting
  |     +-- Forwards valid requests to Electric
  +-- Electric Hub (port 3000, internal only)
        +-- Connects to Supabase via DATABASE_URL
        +-- Serves shapes only for published tables
```

### Data Flow

```
Client request (JWT + shape params)
  -> Caddy validates JWT (Layer 1)
  -> Caddy validates user_id in where param matches JWT sub (Layer 1)
  -> Electric serves shape for published tables only (Layer 2)
  -> Supabase RLS enforces row-level user_id check (Layer 3)
  -> Response
```

## Security Model — Three Independent Layers

### Layer 1: Caddy Proxy (network level)

- Validates Clerk JWT signature against JWKS endpoint
- Rejects expired or malformed tokens
- Extracts `sub` claim from JWT (Clerk user_id)
- Validates that the `where` parameter's `user_id` matches the JWT `sub`
- Rejects requests with mismatched, missing, or tampered `where` clauses (e.g., `1=1`)
- Rate limiting to prevent abuse

### Layer 2: Electric Publication (table level)

- PostgreSQL publication restricts Electric to only `debts` and `debt_payments` tables
- Requests for any other table (e.g., `profiles`, `transactions`) are rejected by Electric
- No raw SQL accepted — clients can only request predefined shapes

### Layer 3: Supabase RLS (row level)

- Existing RLS policies enforce `auth.uid() = user_id` on every row
- Even if proxy and Electric are bypassed, unauthorized data access is blocked
- No changes needed — already in place

### What This Prevents

| Threat                         | Blocked By                                       |
| ------------------------------ | ------------------------------------------------ |
| Unauthenticated access         | Layer 1 (Caddy JWT validation)                   |
| Changing `where` to `1=1`      | Layer 1 (Caddy user_id enforcement)              |
| Requesting another user's data | Layer 1 (JWT sub mismatch) + Layer 3 (RLS)       |
| Accessing non-debt tables      | Layer 2 (publication restricts to 2 tables)      |
| SQL injection                  | Electric only accepts shape params, not raw SQL  |
| DDoS                           | Fly.io built-in protection + Caddy rate limiting |

## Fly.io Setup Requirements

### Account and CLI

- Create Fly.io account (free, no credit card required for free tier)
- Install `flyctl`: `brew install flyctl`
- Login: `fly auth login`

### App Configuration

- Create app: `fly launch`
- Region: pick closest to your Supabase project region (check Supabase dashboard -> Project Settings -> General -> Region)
- Machine size: `shared-cpu-1x`, 256MB RAM (free tier)

### Secrets

| Secret           | Where to Find                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`   | Supabase dashboard -> Project Settings -> Database -> Connection string (use `?sslmode=require`) |
| `CLERK_JWKS_URL` | Clerk dashboard -> API Keys -> JWKS URL (`https://<your-clerk-domain>/.well-known/jwks.json`)    |

### Networking

- Fly.io auto-provisions HTTPS with certificate on `<app-name>.fly.dev`
- No custom domain needed
- Internal port 3000 for Electric (not exposed)
- External port 443 for Caddy (exposed via Fly.io)
- CORS configured in Caddy to allow your CloudFront domain

## Codebase Changes

### Modified Files

| File                                                     | Change                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------- |
| `docker-compose.yml`                                     | Remove `ELECTRIC_INSECURE=true`, keep for local dev only            |
| `.env.local`                                             | `VITE_ELECTRIC_URL=http://localhost:3001` (dev only)                |
| `.env.production`                                        | `VITE_ELECTRIC_URL=https://<app-name>.fly.dev`                      |
| `src/routes/_app/debt-calculator/-hooks/use-debt-db.tsx` | Add Clerk token to Electric shape requests via Authorization header |
| `src/lib/tanstack-db.ts`                                 | Pass auth token through to shape request headers                    |

### New Files

| File                              | Purpose                                                          |
| --------------------------------- | ---------------------------------------------------------------- |
| `fly/Dockerfile`                  | Multi-service container: Electric + Caddy                        |
| `fly/Caddyfile`                   | Reverse proxy config with JWT validation and user_id enforcement |
| `fly/fly.toml`                    | Fly.io deployment configuration                                  |
| `docs/electric-sql-deployment.md` | Full deployment and security documentation                       |

### Unchanged

- All debt-calculator components
- `debt.service.ts`
- All hooks using `useLiveQuery`
- `src/routes/_app/debt-calculator/-hooks/use-debts.ts`
- `src/routes/_app/debt-calculator/-hooks/use-debt-payments.ts`
- `src/routes/_app/debt-calculator/-hooks/use-debt-mutations.ts`
- Supabase migrations (publication stays)
- TanStack DB collections and schemas

## Cost

| Component            | Service                     | Cost         |
| -------------------- | --------------------------- | ------------ |
| Electric hub + Caddy | Fly.io shared-cpu-1x, 256MB | Free         |
| HTTPS certificate    | Fly.io auto-provisioned     | Free         |
| Container image      | Fly.io built-in registry    | Free         |
| **Total**            |                             | **$0/month** |

## Implementation Checklist

- [ ] Create Fly.io account and install CLI
- [ ] Create `fly/Dockerfile` (Electric + Caddy multi-service)
- [ ] Create `fly/Caddyfile` (JWT validation + user_id enforcement + CORS + rate limiting)
- [ ] Create `fly/fly.toml` (deployment config)
- [ ] Update `src/lib/tanstack-db.ts` to pass auth headers to shape requests
- [ ] Update `use-debt-db.tsx` to inject Clerk token into collection config
- [ ] Update `docker-compose.yml` (remove `ELECTRIC_INSECURE=true`)
- [ ] Add `.env.production` with Fly.io URL
- [ ] Deploy to Fly.io (`fly deploy`)
- [ ] Set secrets (`fly secrets set DATABASE_URL=... CLERK_JWKS_URL=...`)
- [ ] Test: unauthenticated request returns 401
- [ ] Test: request with tampered user_id returns 403
- [ ] Test: request for unpublished table returns error
- [ ] Test: valid authenticated request returns correct data
- [ ] Update `README.md` with deployment instructions
- [ ] Write `docs/electric-sql-deployment.md`
