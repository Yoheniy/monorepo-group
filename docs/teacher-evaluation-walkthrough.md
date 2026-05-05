# Teacher Evaluation Walkthrough (ASTU Sport Monorepo)

## 1) Monorepo structure proof
Show that code is now split into:
- app layer: `apps/web`, `apps/api`
- shared package layer: `packages/*`

## 2) One command orchestration proof
From repo root:

```bash
npm run dev
```

Explain that Turborepo orchestrates both app processes.

## 3) Two-system integration proof (admin + user)

### Step A (admin action)
Login as admin and perform one operation (e.g. create/update tournament, match, poll, injury).

### Step B (user verification)
Switch to user flow and show the corresponding data reflected on user pages.

### Statement to make
"These are two role-based systems using the same backend and data model, not two disconnected projects."

## 4) Architecture quality proof
Call out:
- `packages/eslint-config` and `packages/typescript-config` for shared tooling
- `packages/ui-components` and feature packages for reuse
- env-driven API base URL (`VITE_API_URL`) replacing hardcoded URLs

## 5) Validation proof
Run:

```bash
npm run lint
npm run typecheck
npm run build
```

and mention all pass.

## 6) What changed from old structure
Before:
- `frontend/` and `backends/` were separate codebases with duplicated setup

After:
- monorepo with clear boundaries, shared tooling, and coordinated scripts
