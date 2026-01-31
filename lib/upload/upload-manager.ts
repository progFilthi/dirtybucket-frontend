import { AssetType } from '@/lib/types';

export interface UploadProgress {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
    error?: string;
    assetId?: string;
    s3Key?: string;
}

export interface UploadTask {
    file: File;
    type: AssetType;
    onProgress: (progress: number) => void;
    onComplete: (assetId: string) => void;
    onError: (error: string) => void;
}

export class UploadManager {
    private uploads: Map<string, UploadProgress> = new Map();

    async uploadFile(
        file: File,
        presignedUrl: string,
        onProgress?: (progress: number) => void
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    onProgress?.(percentComplete);
                }
            });

            // Handle completion
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });

            // Handle errors
            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });

            xhr.addEventListener('abort', () => {
                reject(new Error('Upload aborted'));
            });

            // Start upload
            xhr.open('PUT', presignedUrl);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.send(file);
        });
    }

    async retryUpload(
        file: File,
        presignedUrl: string,
        maxRetries: number = 3,
        onProgress?: (progress: number) => void
    ): Promise<void> {
        let lastError: Error | undefined;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                await this.uploadFile(file, presignedUrl, onProgress);
                return; // Success
            } catch (error) {
                lastError = error as Error;
                // Wait before retry (exponential backoff)
                if (attempt < maxRetries - 1) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, Math.pow(2, attempt) * 1000)
                    );
                }
            }
        }

        throw lastError || new Error('Upload failed after retries');
    }

    validateFile(file: File, type: AssetType): { valid: boolean; error?: string } {
        // Audio file validation
        if (type === AssetType.ORIGINAL_AUDIO || type === AssetType.PREVIEW_AUDIO) {
            const validAudioTypes = [
                'audio/mpeg',
                'audio/mp3',
                'audio/wav',
                'audio/wave',
                'audio/x-wav',
                'audio/aac',
                'audio/flac',
            ];

            if (!validAudioTypes.includes(file.type)) {
                return {
                    valid: false,
                    error: 'Invalid audio format. Supported: MP3, WAV, AAC, FLAC',
                };
            }

            // Max 100MB for audio
            const maxSize = 100 * 1024 * 1024;
            if (file.size > maxSize) {
                return {
                    valid: false,
                    error: 'Audio file too large. Maximum size: 100MB',
                };
            }
        }

        // Image file validation
        if (type === AssetType.THUMBNAIL_IMAGE || type === AssetType.COVER_IMAGE) {
            const validImageTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/webp',
            ];

            if (!validImageTypes.includes(file.type)) {
                return {
                    valid: false,
                    error: 'Invalid image format. Supported: JPEG, PNG, WebP',
                };
            }

            // Max 10MB for images
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                return {
                    valid: false,
                    error: 'Image file too large. Maximum size: 10MB',
                };
            }
        }

        return { valid: true };
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}

export const uploadManager = new UploadManager();
