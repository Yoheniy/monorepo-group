# GitHub Commands Cheat Sheet (2 Members)

## Start a Work Session

```bash
git checkout main
git pull
```

## Create/Use Member Branches

```bash
git checkout -b feat/member-a-ui-utils
git checkout -b feat/member-b-features-apps
```

## Commit and Push

```bash
git add <target-files>
git commit -m "feat(scope): concise change summary"
git push -u origin HEAD
```

## Keep Branch Updated

```bash
git checkout main
git pull
git checkout <member-branch>
git merge main
```

## Pre-PR Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
