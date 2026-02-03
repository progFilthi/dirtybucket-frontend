import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import {
    subscriptionResponseSchema,
    downloadStatsSchema,
    type SubscriptionResponse,
    type DownloadStats,
} from '@/lib/api/schemas';

// ============================================
// Query Keys
// ============================================

export const subscriptionKeys = {
    all: ['subscription'] as const,
    status: () => [...subscriptionKeys.all, 'status'] as const,
    stats: () => [...subscriptionKeys.all, 'stats'] as const,
};

// ============================================
// Hooks
// ============================================

/**
 * Get current user's subscription status
 */
export function useSubscription() {
    return useQuery({
        queryKey: subscriptionKeys.status(),
        queryFn: async () => {
            const response = await apiClient.get<SubscriptionResponse>('/api/v1/subscriptions/me');
            return subscriptionResponseSchema.parse(response);
        },
        retry: 1,
    });
}

/**
 * Get download statistics for current billing period
 */
export function useDownloadStats() {
    return useQuery({
        queryKey: subscriptionKeys.stats(),
        queryFn: async () => {
            const response = await apiClient.get<DownloadStats>('/api/v1/subscriptions/download-stats');
            return downloadStatsSchema.parse(response);
        },
        retry: 1,
    });
}

/**
 * Cancel subscription (will cancel at period end)
 */
export function useCancelSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await apiClient.post('/api/v1/subscriptions/cancel');
        },
        onSuccess: () => {
            // Invalidate subscription queries to refetch
            queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
        },
    });
}

/**
 * Reactivate a canceled subscription
 */
export function useReactivateSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await apiClient.post('/api/v1/subscriptions/reactivate');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
        },
    });
}

/**
 * Upgrade/downgrade subscription tier
 */
export function useUpdateSubscriptionTier() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tier: 'CREATOR' | 'PRO') => {
            await apiClient.post('/api/v1/subscriptions/update-tier', { tier });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
        },
    });
}
