import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import {
    createBeatSchema,
    beatResponseSchema,
    type CreateBeatInput,
    type BeatResponse,
} from '@/lib/api/schemas';
import { Beat } from '@/lib/types';

// ============================================
// Query Keys
// ============================================

export const beatKeys = {
    all: ['beats'] as const,
    lists: () => [...beatKeys.all, 'list'] as const,
    list: (filters?: any) => [...beatKeys.lists(), filters] as const,
    details: () => [...beatKeys.all, 'detail'] as const,
    detail: (id: string) => [...beatKeys.details(), id] as const,
};

// ============================================
// Create Beat
// ============================================

export function useCreateBeat() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateBeatInput) => {
            const validated = createBeatSchema.parse(data);
            const response = await apiClient.post<{ beatId: string }>(
                '/api/v1/beats',
                validated
            );
            return response;
        },
        onSuccess: () => {
            // Invalidate beats list
            queryClient.invalidateQueries({ queryKey: beatKeys.lists() });
        },
    });
}

// ============================================
// Get Beat by ID
// ============================================

interface UseBeatOptions {
    enabled?: boolean;
    refetchInterval?: number | false;
}

export function useBeat(beatId: string, options?: UseBeatOptions) {
    return useQuery({
        queryKey: beatKeys.detail(beatId),
        queryFn: async () => {
            const response = await apiClient.get<BeatResponse>(
                `/api/v1/beats/${beatId}`
            );
            return beatResponseSchema.parse(response);
        },
        enabled: options?.enabled !== false && !!beatId,
        refetchInterval: options?.refetchInterval,
    });
}

// ============================================
// Get Beats List
// ============================================

interface BeatsFilters {
    genre?: string;
    minBpm?: number;
    maxBpm?: number;
    status?: string;
    producerId?: string;
}

export function useBeats(filters?: BeatsFilters) {
    return useQuery({
        queryKey: beatKeys.list(filters),
        queryFn: async () => {
            const params: Record<string, string> = {};

            if (filters?.genre) params.genre = filters.genre;
            if (filters?.minBpm) params.minBpm = filters.minBpm.toString();
            if (filters?.maxBpm) params.maxBpm = filters.maxBpm.toString();
            if (filters?.status) params.status = filters.status;
            if (filters?.producerId) params.producerId = filters.producerId;

            const response = await apiClient.get<BeatResponse[]>(
                '/api/v1/beats',
                { params }
            );

            return response.map(beat => beatResponseSchema.parse(beat));
        },
    });
}

// ============================================
// Update Beat
// ============================================

export function useUpdateBeat(beatId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<CreateBeatInput>) => {
            const response = await apiClient.put<BeatResponse>(
                `/api/v1/beats/${beatId}`,
                data
            );
            return beatResponseSchema.parse(response);
        },
        onSuccess: (data) => {
            // Update cache
            queryClient.setQueryData(beatKeys.detail(beatId), data);
            queryClient.invalidateQueries({ queryKey: beatKeys.lists() });
        },
    });
}

// ============================================
// Publish Beat
// ============================================

export function usePublishBeat(beatId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await apiClient.post<BeatResponse>(
                `/api/v1/beats/${beatId}/publish`
            );
            return beatResponseSchema.parse(response);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(beatKeys.detail(beatId), data);
            queryClient.invalidateQueries({ queryKey: beatKeys.lists() });
        },
    });
}

// ============================================
// Delete Beat
// ============================================

export function useDeleteBeat() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (beatId: string) => {
            await apiClient.delete(`/api/v1/beats/${beatId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: beatKeys.lists() });
        },
    });
}
