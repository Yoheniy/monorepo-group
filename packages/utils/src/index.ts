export function formatDate(date: string | Date): string {
  const value = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(value);
}

export function capitalizeWords(input: string): string {
  return input
    .trim()
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function truncateText(value: string, maxLength = 80): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}

export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export async function apiClient<T>(request: () => Promise<T>): Promise<ApiResponse<T>> {
  try {
    const data = await request();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
