# Day 5 Finalization Playbook

## Member A (Quality/Stability Commit)

```bash
git checkout feat/member-a-ui-utils
# quality fixes in shared packages
npm run lint && npm run typecheck && npm run test && npm run build
git add packages package.json tsconfig.base.json eslint.config.js
git commit -m "fix(quality): resolve lint and type issues in shared packages"
git push
```

## Member B (Submission Docs Commit)

```bash
git checkout feat/member-b-features-apps
# finalize submission docs and architecture updates
git add README.md docs/architecture.md apps/system-a/README.md apps/system-b/README.md
git commit -m "docs(submission): finalize architecture, setup, and contribution mapping"
git push
```

## PR-5 Joint Final Polish

1. Open PR-5 (can be from either member branch after syncing latest `main`).
2. Fill PR template completely.
3. Confirm checklist:
   - lint/typecheck/test/build passed
   - contribution tracker fully filled
   - reviewer comment from teammate exists
4. Merge PR-5 to `main`.

## Final Teacher-Check Package

Before submission, verify:

- 5 commits from Member A and 5 commits from Member B
- Non-overlapping ownership reflected in changed files
- PR comments and approvals from both members
- `docs/contribution-tracker.md` contains commit SHAs and PR links
