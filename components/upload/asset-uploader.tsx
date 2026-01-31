'use client';

import { useCallback, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { AssetType, ProcessingStatus } from '@/lib/types';
import { uploadManager } from '@/lib/upload/upload-manager';
import {
    usePresignAssetUpload,
    useCompleteAssetUpload,
    useAssetStatus,
} from '@/lib/hooks/use-asset-queries';
import { toast } from 'sonner';

interface AssetUploaderProps {
    beatId: string;
    assetType: AssetType;
    label: string;
    accept: string;
    maxSize?: string;
    onUploadComplete?: (assetId: string) => void;
    required?: boolean;
}

interface UploadState {
    file: File | null;
    progress: number;
    status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
    assetId?: string;
    error?: string;
}

export function AssetUploader({
    beatId,
    assetType,
    label,
    accept,
    maxSize = '100MB',
    onUploadComplete,
    required = false,
}: AssetUploaderProps) {
    const [uploadState, setUploadState] = useState<UploadState>({
        file: null,
        progress: 0,
        status: 'idle',
    });

    const presignMutation = usePresignAssetUpload(beatId);
    const completeMutation = useCompleteAssetUpload(beatId);

    // Poll asset status when processing
    const { data: assetStatus } = useAssetStatus(
        beatId,
        uploadState.assetId || '',
        {
            enabled: uploadState.status === 'processing' && !!uploadState.assetId,
            refetchInterval: 2000, // Poll every 2 seconds
        }
    );

    // Update status based on asset processing
    if (
        assetStatus &&
        uploadState.status === 'processing' &&
        assetStatus.processingStatus === ProcessingStatus.READY
    ) {
        setUploadState((prev) => ({ ...prev, status: 'complete' }));
        onUploadComplete?.(assetStatus.id);
        toast.success(`${label} processed successfully`);
    }

    if (
        assetStatus &&
        uploadState.status === 'processing' &&
        assetStatus.processingStatus === ProcessingStatus.FAILED
    ) {
        setUploadState((prev) => ({
            ...prev,
            status: 'error',
            error: 'Processing failed',
        }));
        toast.error(`${label} processing failed`);
    }

    const handleFileSelect = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            // Validate file
            const validation = uploadManager.validateFile(file, assetType);
            if (!validation.valid) {
                toast.error(validation.error);
                return;
            }

            setUploadState({
                file,
                progress: 0,
                status: 'uploading',
            });

            try {
                // Step 1: Get presigned URL
                const presignResponse = await presignMutation.mutateAsync({
                    type: assetType,
                    fileName: file.name,
                    mimeType: file.type,
                });

                // Step 2: Upload to S3
                await uploadManager.retryUpload(
                    file,
                    presignResponse.presignedUrl,
                    3,
                    (progress) => {
                        setUploadState((prev) => ({ ...prev, progress }));
                    }
                );

                // Step 3: Mark upload complete
                await completeMutation.mutateAsync(presignResponse.assetId);

                // Step 4: Start polling for processing status
                setUploadState((prev) => ({
                    ...prev,
                    progress: 100,
                    status: 'processing',
                    assetId: presignResponse.assetId,
                }));

                toast.info(`${label} uploaded, processing...`);
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : 'Upload failed';
                setUploadState((prev) => ({
                    ...prev,
                    status: 'error',
                    error: errorMessage,
                }));
                toast.error(errorMessage);
            }
        },
        [assetType, beatId, presignMutation, completeMutation, label, onUploadComplete]
    );

    const handleRemove = () => {
        setUploadState({
            file: null,
            progress: 0,
            status: 'idle',
        });
    };

    const handleRetry = () => {
        if (uploadState.file) {
            const event = {
                target: { files: [uploadState.file] },
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleFileSelect(event);
        }
    };

    return (
        <Card className="p-4">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <label className="text-sm font-medium">
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                            Max size: {maxSize}
                        </p>
                    </div>

                    {uploadState.status !== 'idle' && (
                        <Badge
                            variant={
                                uploadState.status === 'complete'
                                    ? 'default'
                                    : uploadState.status === 'error'
                                        ? 'destructive'
                                        : 'secondary'
                            }
                        >
                            {uploadState.status === 'uploading' && 'Uploading'}
                            {uploadState.status === 'processing' && 'Processing'}
                            {uploadState.status === 'complete' && 'Ready'}
                            {uploadState.status === 'error' && 'Failed'}
                        </Badge>
                    )}
                </div>

                {uploadState.status === 'idle' && (
                    <div className="relative">
                        <input
                            type="file"
                            accept={accept}
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            id={`upload-${assetType}`}
                        />
                        <label
                            htmlFor={`upload-${assetType}`}
                            className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary transition-colors"
                        >
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                Click to upload or drag and drop
                            </span>
                        </label>
                    </div>
                )}

                {uploadState.file && uploadState.status !== 'idle' && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="truncate flex-1">{uploadState.file.name}</span>
                            <div className="flex items-center gap-2 ml-2">
                                {uploadState.status === 'complete' && (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                )}
                                {uploadState.status === 'processing' && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                {uploadState.status === 'error' && (
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                )}
                                {uploadState.status !== 'uploading' &&
                                    uploadState.status !== 'processing' && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleRemove}
                                            className="h-6 w-6 p-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                            </div>
                        </div>

                        {(uploadState.status === 'uploading' ||
                            uploadState.status === 'processing') && (
                                <Progress value={uploadState.progress} />
                            )}

                        {uploadState.status === 'error' && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-red-500">{uploadState.error}</span>
                                <Button size="sm" variant="outline" onClick={handleRetry}>
                                    Retry
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
