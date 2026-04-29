# Contributing Guide (Two-Member Team)

This guide enforces a teacher-check-friendly contribution history for a 2-member group.

## Ownership Boundaries

- Member A owns:
  - `packages/ui-components`
  - `packages/utils`
  - Shared package tests/docs and quality fixes
- Member B owns:
  - `packages/feature-x`
  - `packages/feature-y`
  - `apps/system-a`
  - `apps/system-b`
  - Root integration docs (`README.md`, `docs/architecture.md`)

## Branch and PR Policy

- Protected branch target: `main`
- Working branches:
  - `feat/member-a-ui-utils`
  - `feat/member-b-features-apps`
  - Optional: `chore/integration-fixes`
- No direct commits to `main`.
- Open PR for every mini-scope.
- Each PR must be reviewed by teammate before merge.

## Commit Requirements

- Minimum 5 commits per member across 5 days.
- Minimum 10 total commits.
- One logical change per commit (no unrelated files bundled together).
- Required commit style examples:
  - `feat(ui-components): add DataCard and button primitives`
  - `feat(utils): add formatDate and truncateText helpers`
  - `feat(feature-x): compose event board from shared packages`
  - `test(feature-y): add task board rendering tests`
  - `docs(submission): finalize contribution map and architecture`

## Mandatory PR Checklist

Before requesting review, include:

- 2-4 bullet summary of change
- Commands run and results:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
- Screenshot/GIF if UI changed
- Link to updated daily contribution tracker

## Daily Collaboration Rules

- Start day with `git checkout main && git pull`
- Rebase or merge latest `main` before opening PR
- Reviewer leaves at least one meaningful comment
- Merge only after checks are green

## Anti-Patterns (Will hurt grading)

- Single large end-of-week commit
- Direct push to `main`
- Missing tests/docs in history
- Copy-pasting feature logic inside `apps/system-*`
