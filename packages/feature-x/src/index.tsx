import React from 'react';
import { DataCard, FormField, Panel, PrimaryButton, SecondaryButton, StatusBadge } from '@cph/ui-components';
import { capitalizeWords, formatCurrency, truncateText } from '@cph/utils';

export type Product = {
  id: string;
  name: string;
  description: string;
  /** Price in minor units (cents) for USD-style formatting */
  priceCents: number;
  category: 'Electronics' | 'Apparel' | 'Home' | 'Books';
};

export type ProductCatalogProps = {
  title: string;
  products: Product[];
  searchQuery: string;
  activeCategory: 'All' | Product['category'];
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: 'All' | Product['category']) => void;
  onAddToCart: (product: Product) => void;
};

export function ProductCatalog({
  title,
  products,
  searchQuery,
  activeCategory,
  onSearchChange,
  onCategoryChange,
  onAddToCart
}: ProductCatalogProps) {
  const q = searchQuery.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const haystack = `${product.name} ${product.description}`.toLowerCase();
    const matchesSearch = q.length === 0 || haystack.includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <DataCard title={title} subtitle="Browse, filter, and add items — powered by shared UI + utils.">
      <FormField label="Search catalog">
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="headphones, notebook…"
        />
      </FormField>
      <div className="cph-cluster">
        <SecondaryButton onClick={() => onCategoryChange('All')}>All</SecondaryButton>
        <SecondaryButton onClick={() => onCategoryChange('Electronics')}>Electronics</SecondaryButton>
        <SecondaryButton onClick={() => onCategoryChange('Apparel')}>Apparel</SecondaryButton>
        <SecondaryButton onClick={() => onCategoryChange('Home')}>Home</SecondaryButton>
        <SecondaryButton onClick={() => onCategoryChange('Books')}>Books</SecondaryButton>
      </div>
      <div className="cph-stack">
        {filtered.map((product) => (
          <Panel key={product.id} heading={capitalizeWords(product.name)}>
            <div className="cph-row-between">
              <StatusBadge label={product.category} tone="neutral" />
              <span className="cph-price">{formatCurrency(product.priceCents)}</span>
            </div>
            <p className="cph-desc">{truncateText(product.description, 140)}</p>
            <PrimaryButton onClick={() => onAddToCart(product)}>Add to cart</PrimaryButton>
          </Panel>
        ))}
      </div>
    </DataCard>
  );
}
