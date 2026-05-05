# @cph/ui-components

Reusable UI components for the Mini Shop e-commerce demo monorepo.

## Styles (required in apps)

In each Vite app entry (for example `src/main.tsx`):

```ts
import '@cph/ui-components/styles.css';
```

This applies the shared **dark theme**, typography, form controls, and layout helpers (`cph-app`, `cph-grid-shop`, etc.).

## Exported Components
- `PrimaryButton`
- `SecondaryButton`
- `DataCard`
- `FormField`
- `StatusBadge`
- `Panel`

## Usage
```tsx
import { DataCard, PrimaryButton } from '@cph/ui-components';

<DataCard title="Demo">
  <PrimaryButton>Click me</PrimaryButton>
</DataCard>;
```
