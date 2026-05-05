import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CartPanel } from './index';

describe('feature-y', () => {
  it('renders cart line and subtotal', () => {
    render(
      <CartPanel
        title="Cart"
        subtotalCents={4998}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
        onRemove={vi.fn()}
        lines={[
          {
            lineId: 'l1',
            productId: 'p1',
            name: 'notebook bundle',
            unitPriceCents: 2499,
            quantity: 2
          }
        ]}
      />
    );

    expect(screen.getByText('Notebook Bundle')).toBeTruthy();
    const subtotalMatches = screen.getAllByText('$49.98');
    expect(subtotalMatches.length).toBeGreaterThanOrEqual(1);
  });
});
