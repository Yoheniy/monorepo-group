import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProductCatalog } from './index';

describe('feature-x', () => {
  it('renders products filtered by category', () => {
    render(
      <ProductCatalog
        title="Catalog"
        searchQuery=""
        activeCategory="Electronics"
        onSearchChange={vi.fn()}
        onCategoryChange={vi.fn()}
        onAddToCart={vi.fn()}
        products={[
          {
            id: '1',
            name: 'usb hub',
            description: 'Compact powered hub for laptops.',
            priceCents: 2499,
            category: 'Electronics'
          },
          {
            id: '2',
            name: 'cotton tee',
            description: 'Plain shirt.',
            priceCents: 1999,
            category: 'Apparel'
          }
        ]}
      />
    );

    expect(screen.getByText('Usb Hub')).toBeTruthy();
    expect(screen.queryByText('Cotton Tee')).toBeNull();
  });
});
