# @cph/feature-y

Feature package for **shopping cart** and **demo checkout form** (no payment processing).

## Exports

- `CartPanel`
- `CheckoutForm`
- `CartLine` type

## Integration

This package composes shared visuals from `@cph/ui-components` and helpers from `@cph/utils` (`capitalizeWords`, `formatCurrency`). Checkout validation is typically implemented in the app using `isValidEmail` and `apiClient`.
