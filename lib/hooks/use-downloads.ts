import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import {
    downloadLogResponseSchema,
    downloadRequestSchema,
    type DownloadLogResponse,
    type DownloadRequest,
} from '@/lib/api/schemas';
import { subscriptionKeys } from './use-subscription';

// ============================================
// Query Keys
// ============================================

export const downloadKeys = {
    all: ['downloads'] as const,
    history: () => [...downloadKeys.all, 'history'] as const,
};

// ============================================
// Hooks
// ============================================

/**
 * Get user's download history
 */
export function useDownloadHistory() {
    return useQuery({
        queryKey: downloadKeys.history(),
        queryFn: async () => {
            const response = await apiClient.get<DownloadLogResponse[]>('/api/v1/downloads/history');
            return response.map((log) => downloadLogResponseSchema.parse(log));
        },
        retry: 1,
    });
}

/**
 * Download a beat (requires active subscription)
 */
export function useDownloadBeat() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (beatId: string) => {
            const validated = downloadRequestSchema.parse({ beatId });
            const response = await apiClient.post<{ downloadUrl: string }>(
                '/api/v1/downloads/beat',
                validated
            );
            return response;
        },
        onSuccess: () => {
            // Invalidate download history and stats
            queryClient.invalidateQueries({ queryKey: downloadKeys.all });
            queryClient.invalidateQueries({ queryKey: subscriptionKeys.stats() });
        },
    });
}

/**
 * Check if user has already downloaded a specific beat
 */
export function useHasDownloaded(beatId: string) {
    const { data: history } = useDownloadHistory();
    return history?.some((log) => log.beatId === beatId) ?? false;
}
