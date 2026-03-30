# Pre-Push Build Validation

**Date:** 2026-03-24
**Status:** Draft

## Problem

The project uses pnpm with a lockfile (`pnpm-lock.yaml`). When `package.json` changes but `pnpm install` isn't run, the lockfile falls out of sync. This causes:

- Docker builds fail with `ERR_PNPM_OUTDATED_LOCKFILE` during `pnpm install --frozen-lockfile`
- CI/CD builds fail on GitHub Actions for the same reason
- TypeScript errors or build failures only surface after pushing

There is no automated gate to catch these issues before code leaves the developer's machine.

## Solution

Add two automated validation layers that run before every push:

### 1. Git pre-push hook (`.husky/pre-push`)

A shell script managed by husky (already used for pre-commit) that runs:

1. **Lockfile sync check:** `pnpm install --frozen-lockfile` — fails immediately if lockfile doesn't match `package.json`
2. **Full production build:** `npm run build` (runs `vite build && tsc`) — catches TypeScript errors and build failures

If either check fails, the push is blocked with a descriptive error message.

### 2. Claude Code PreToolUse hook

A hook in `.claude/settings.local.json` that matches `Bash(git push*)` and runs the same lockfile + build validation. Blocks Claude from pushing if checks fail.

## Scope

### In scope

- Git pre-push hook with lockfile + build checks
- Claude Code hook for push interception
- Fix the current lockfile desync (run `pnpm install`)

### Out of scope

- Modifying the existing pre-commit hook (lint-staged)
- Adding test execution to the pre-push hook
- Changes to the GitHub Actions deploy workflow
- Changes to the Dockerfile

## Design decisions

- **Why pre-push and not pre-commit?** Build validation is slow (~10-20s). Running it on every commit would be disruptive. Pre-push is the right gate — it runs less frequently and is the last check before code leaves the machine.
- **Why `--frozen-lockfile` instead of `--check`?** `--frozen-lockfile` is the standard pnpm flag for CI-like validation. It fails if the lockfile needs updating, which is exactly the check we need.
- **Why both git hook and Claude Code hook?** The git pre-push hook covers manual pushes and any tool that uses git. The Claude Code hook provides an additional safety layer specifically for AI-assisted pushes.
