# Day 3-4 Playbook

## Member A (Day 3)

```bash
git checkout feat/member-a-ui-utils
# edit reusable UI components and tests/docs
git add packages/ui-components
git commit -m "feat(ui-components): add FormField, StatusBadge, and Panel components"
git push
```

## Member B (Day 3)

```bash
git checkout feat/member-b-features-apps
# edit feature-y task flows and tests
git add packages/feature-y
git commit -m "feat(feature-y): implement TaskBoard and TaskCreator flows"
git push
```

## Member A (Day 4)

```bash
git checkout feat/member-a-ui-utils
# improve package docs and consistency
git add packages/ui-components/README.md packages/utils/README.md
git commit -m "docs(packages): add usage examples and API references"
git push
```

## Member B (Day 4)

```bash
git checkout feat/member-b-features-apps
# assemble app systems using feature imports only
git add apps/system-a apps/system-b
git commit -m "feat(apps): assemble system-a and system-b by configuration"
git push
```

## PRs to Open

- PR-3 from `feat/member-a-ui-utils` (Day 3-4 work)
- PR-4 from `feat/member-b-features-apps` (Day 3-4 work)
