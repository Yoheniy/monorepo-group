import { describe, expect, it } from 'vitest';
import { apiClient, capitalizeWords, formatCurrency, formatDate, isValidEmail, truncateText } from './index';

describe('utils', () => {
  it('formats date as readable text', () => {
    expect(formatDate('2026-04-29T00:00:00Z')).toContain('2026');
  });

  it('capitalizes words safely', () => {
    expect(capitalizeWords('mini SHOP demo')).toBe('Mini Shop Demo');
  });

  it('truncates long text', () => {
    expect(truncateText('abcdefghijklmnopqrstuvwxyz', 10)).toBe('abcdefg...');
  });

  it('wraps successful api calls', async () => {
    const result = await apiClient(async () => ({ done: true }));
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ done: true });
  });

  it('formats currency from cents', () => {
    expect(formatCurrency(1299)).toBe('$12.99');
  });

  it('validates email shape', () => {
    expect(isValidEmail('a@b.co')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
  });
});
