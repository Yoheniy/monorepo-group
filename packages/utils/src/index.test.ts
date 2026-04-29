import { describe, expect, it } from 'vitest';
import { apiClient, capitalizeWords, formatDate, truncateText } from './index';

describe('utils', () => {
  it('formats date as readable text', () => {
    expect(formatDate('2026-04-29T00:00:00Z')).toContain('2026');
  });

  it('capitalizes words safely', () => {
    expect(capitalizeWords('cAMPUS productivity HUB')).toBe('Campus Productivity Hub');
  });

  it('truncates long text', () => {
    expect(truncateText('abcdefghijklmnopqrstuvwxyz', 10)).toBe('abcdefg...');
  });

  it('wraps successful api calls', async () => {
    const result = await apiClient(async () => ({ done: true }));
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ done: true });
  });
});
