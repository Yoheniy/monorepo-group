import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaskBoard } from './index';

describe('feature-y', () => {
  it('renders task labels', () => {
    render(
      <TaskBoard
        title="Tasks"
        onToggleTask={vi.fn()}
        tasks={[
          {
            id: '1',
            title: 'prepare exam notes',
            dueDate: '2026-05-04',
            priority: 'High',
            completed: false
          }
        ]}
      />
    );

    expect(screen.getByText('Prepare Exam Notes')).toBeTruthy();
  });
});
