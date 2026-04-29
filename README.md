# Campus Productivity Hub Monorepo

A modular monorepo project that demonstrates reusable package development, feature composition, and individual system assembly.

## Monorepo Structure

- `packages/ui-components`: shared reusable UI components
- `packages/utils`: shared utility functions
- `packages/feature-x`: Event & Schedule Manager feature package
- `packages/feature-y`: Study Task Tracker feature package
- `apps/system-a`: individual assembly (event-heavy)
- `apps/system-b`: individual assembly (task-heavy)
- `docs/architecture.md`: architecture and data flow documentation

## Tech Stack

- npm workspaces
- TypeScript
- React + Vite
- Vitest + Testing Library
- ESLint

## Setup

```bash
npm install
```

## Run

```bash
npm run dev:system-a
npm run dev:system-b
```

## Quality Scripts

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Package Reuse Rules

- `feature-x` and `feature-y` consume `@cph/ui-components` and `@cph/utils`
- `system-a` and `system-b` import composites from feature packages
- system apps perform configuration and assembly only (no duplicated feature logic)

## Contribution Map (2 Members)

- Member A: `packages/ui-components`, `packages/utils`, shared quality fixes, package docs
- Member B: `packages/feature-x`, `packages/feature-y`, `apps/system-a`, `apps/system-b`, root submission docs

## Git Workflow (Teacher Verification)

- Use branches only; do not push directly to `main`
- Member A branch: `feat/member-a-ui-utils`
- Member B branch: `feat/member-b-features-apps`
- Minimum cadence: 1 commit per member per day for 5 days (10 total commits minimum)
- Every PR must include summary, test proof, and teammate review comment

### Guides (start here)

| Doc | Purpose |
| --- | --- |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Ownership, branches, PR rules, commit style |
| [docs/two-member-5-day-commit-plan.md](docs/two-member-5-day-commit-plan.md) | Day-by-day scopes and example messages |
| [docs/day1-day2-playbook.md](docs/day1-day2-playbook.md) | Copy-paste git commands for Days 1–2 |
| [docs/day3-day4-playbook.md](docs/day3-day4-playbook.md) | Copy-paste git commands for Days 3–4 |
| [docs/day5-finalization-playbook.md](docs/day5-finalization-playbook.md) | Day 5 quality + docs + PR-5 merge |
| [docs/github-commands-cheatsheet.md](docs/github-commands-cheatsheet.md) | Short git reference |
| [docs/contribution-tracker.md](docs/contribution-tracker.md) | Fill SHAs and PR links for your teacher |
| [docs/commit-execution-checklist.md](docs/commit-execution-checklist.md) | Checkbox progress against the plan |

GitHub PR template: [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)

## Submission Checklist

- [x] Monorepo with required package layout
- [x] Shared utilities implemented
- [x] Shared UI components implemented
- [x] Feature-X and Feature-Y integrated with shared packages
- [x] Individual systems assembled by configuration/composition
- [x] Root and package READMEs present
- [x] Lint, typecheck, tests, and build passing
