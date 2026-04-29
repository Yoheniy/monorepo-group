import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataCard, PrimaryButton, StatusBadge } from './index';

describe('ui-components', () => {
  it('renders primary button text', () => {
    render(<PrimaryButton>Save</PrimaryButton>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
  });

  it('renders card metadata', () => {
    render(
      <DataCard title="Card Title" subtitle="Card subtitle">
        <div>Body</div>
      </DataCard>
    );
    expect(screen.getByText('Card Title')).toBeTruthy();
    expect(screen.getByText('Card subtitle')).toBeTruthy();
  });

  it('shows status badge label', () => {
    render(<StatusBadge label="High" tone="warning" />);
    expect(screen.getByText('High')).toBeTruthy();
  });
});
