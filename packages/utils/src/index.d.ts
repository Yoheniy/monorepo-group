export declare function formatDate(date: string | Date): string;
export declare function capitalizeWords(input: string): string;
export declare function truncateText(value: string, maxLength?: number): string;
export type ApiResponse<T> = {
    ok: boolean;
    data?: T;
    error?: string;
};
export declare function apiClient<T>(request: () => Promise<T>): Promise<ApiResponse<T>>;
//# sourceMappingURL=index.d.ts.map