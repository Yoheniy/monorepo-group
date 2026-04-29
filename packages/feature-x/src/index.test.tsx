import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EventBoard } from './index';

describe('feature-x', () => {
  it('renders filtered events based on category', () => {
    render(
      <EventBoard
        title="Events"
        activeCategory="Academic"
        onCategoryChange={vi.fn()}
        events={[
          {
            id: '1',
            title: 'algorithms review',
            description: 'Session details',
            date: '2026-05-02',
            location: 'Lab',
            category: 'Academic'
          },
          {
            id: '2',
            title: 'career talk',
            description: 'Industry panel',
            date: '2026-05-03',
            location: 'Hall',
            category: 'Career'
          }
        ]}
      />
    );

    expect(screen.getByText('Algorithms Review')).toBeTruthy();
  });
});
