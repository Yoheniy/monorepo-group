import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('system-a app', () => {
  it('renders dashboard heading', () => {
    render(<App />);
    expect(screen.getByText('System A: Event-Heavy Dashboard')).toBeTruthy();
  });
});
