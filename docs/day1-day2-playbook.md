# Day 1-2 Playbook

Use these exact steps to create pushable commits for both members.

## Member A (Day 1)

```bash
git checkout main && git pull
git checkout -b feat/member-a-ui-utils
# edit only packages/ui-components
git add packages/ui-components
git commit -m "chore(ui-components): scaffold package structure and exports"
git push -u origin feat/member-a-ui-utils
```

## Member B (Day 1)

```bash
git checkout main && git pull
git checkout -b feat/member-b-features-apps
# edit only packages/feature-x and packages/feature-y skeleton files
git add packages/feature-x packages/feature-y
git commit -m "chore(features): scaffold feature-x and feature-y packages"
git push -u origin feat/member-b-features-apps
```

## Member A (Day 2)

```bash
git checkout feat/member-a-ui-utils
# edit only packages/utils and related tests
git add packages/utils
git commit -m "feat(utils): add date, string, and api helper functions"
git push
```

## Member B (Day 2)

```bash
git checkout feat/member-b-features-apps
# edit only Feature X composition files
git add packages/feature-x
git commit -m "feat(feature-x): add EventBoard composition with shared components"
git push
```

## PRs to Open

- PR-1 from `feat/member-a-ui-utils` (Day 1-2 work)
- PR-2 from `feat/member-b-features-apps` (Day 1-2 work)
