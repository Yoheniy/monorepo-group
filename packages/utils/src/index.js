export function formatDate(date) {
    const value = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(value);
}
export function capitalizeWords(input) {
    return input
        .trim()
        .split(/\s+/)
        .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
export function truncateText(value, maxLength = 80) {
    if (value.length <= maxLength) {
        return value;
    }
    return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}
export async function apiClient(request) {
    try {
        const data = await request();
        return { ok: true, data };
    }
    catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
//# sourceMappingURL=index.js.map