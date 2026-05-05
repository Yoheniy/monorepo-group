# @cph/utils

Shared utility functions for feature and app packages.

## Exports

- `formatDate(date)`
- `formatCurrency(amountCents, currency?)`
- `capitalizeWords(input)`
- `truncateText(value, maxLength)`
- `isValidEmail(value)`
- `apiClient(request)`

## Usage

```ts
import { formatCurrency, truncateText, isValidEmail } from '@cph/utils';

formatCurrency(1299);
truncateText('Long description text', 30);
isValidEmail('you@school.edu');
```
