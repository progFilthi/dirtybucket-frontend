import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import {
    presignAssetRequestSchema,
    presignedUploadResponseSchema,
    assetResponseSchema,
    type PresignAssetRequest,
    type PresignedUploadResponse,
    type AssetResponse,
} from '@/lib/api/schemas';
import { beatKeys } from './use-beat-queries';

// ============================================
// Presign Asset Upload
// ============================================

export function usePresignAssetUpload(beatId: string) {
    return useMutation({
        mutationFn: async (request: PresignAssetRequest) => {
            const validated = presignAssetRequestSchema.parse(request);
            const response = await apiClient.post<PresignedUploadResponse>(
                `/api/v1/beats/${beatId}/assets/presign`,
                validated
            );
            return presignedUploadResponseSchema.parse(response);
        },
    });
}

// ============================================
// Upload File to S3
// ============================================

export function useUploadToS3() {
    return useMutation({
        mutationFn: async ({
            presignedUrl,
            file,
        }: {
            presignedUrl: string;
            file: File;
        }) => {
            await apiClient.uploadToS3(presignedUrl, file);
        },
    });
}

// ============================================
// Complete Asset Upload
// ============================================

export function useCompleteAssetUpload(beatId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (assetId: string) => {
            const response = await apiClient.post<{ success: boolean }>(
                `/api/v1/beats/${beatId}/assets/${assetId}/complete`
            );
            return response;
        },
        onSuccess: () => {
            // Invalidate beat query to get updated assets
            queryClient.invalidateQueries({ queryKey: beatKeys.detail(beatId) });
        },
    });
}

// ============================================
// Get Asset Status (for polling)
// ============================================

export function useAssetStatus(
    beatId: string,
    assetId: string,
    options?: { enabled?: boolean; refetchInterval?: number }
) {
    return useQuery({
        queryKey: ['assets', beatId, assetId],
        queryFn: async () => {
            const response = await apiClient.get<AssetResponse>(
                `/api/v1/beats/${beatId}/assets/${assetId}`
            );
            return assetResponseSchema.parse(response);
        },
        enabled: options?.enabled !== false && !!beatId && !!assetId,
        refetchInterval: options?.refetchInterval || false,
    });
}

// ============================================
// Delete Asset
// ============================================

export function useDeleteAsset(beatId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (assetId: string) => {
            await apiClient.delete(`/api/v1/beats/${beatId}/assets/${assetId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: beatKeys.detail(beatId) });
        },
    });
}
