import { z } from 'zod';

// ============================================
// Date Transformer
// ============================================

// Spring Boot LocalDateTime is serialized as [year, month, day, hour, minute, second, nano]
// We need to transform it to ISO string
const dateTransformer = z.union([
    z.string(), // Already a string (ISO format)
    z.array(z.number()).transform((arr) => {
        // Convert [year, month, day, hour, minute, second, nano] to ISO string
        const [year, month, day, hour = 0, minute = 0, second = 0] = arr;
        const date = new Date(year, month - 1, day, hour, minute, second);
        return date.toISOString();
    }),
]);

// ============================================
// Auth Schemas
// ============================================

export const registerSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const userResponseSchema = z.object({
    id: z.string().uuid(),
    username: z.string(),
    email: z.string().email(),
    createdAt: dateTransformer,
    updatedAt: dateTransformer,
});

// ============================================
// Beat Schemas
// ============================================

export const createBeatSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    bpm: z.number().min(1).max(300).optional(),
    musicalKey: z.string().optional(),
    genre: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export const beatResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().optional(),
    bpm: z.number().optional(),
    musicalKey: z.string().optional(),
    genre: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
    producerId: z.string().uuid(),
    createdAt: dateTransformer,
    updatedAt: dateTransformer,
});

// ============================================
// Asset Schemas
// ============================================

export const presignAssetRequestSchema = z.object({
    type: z.enum(['ORIGINAL_AUDIO', 'PREVIEW_AUDIO', 'THUMBNAIL_IMAGE', 'COVER_IMAGE']),
    fileName: z.string(),
    mimeType: z.string(),
});

export const presignedUploadResponseSchema = z.object({
    assetId: z.string().uuid(),
    presignedUrl: z.string().url(),
    s3Key: z.string(),
});

export const assetResponseSchema = z.object({
    id: z.string().uuid(),
    beatId: z.string().uuid(),
    type: z.enum(['ORIGINAL_AUDIO', 'PREVIEW_AUDIO', 'THUMBNAIL_IMAGE', 'COVER_IMAGE']),
    fileName: z.string(),
    mimeType: z.string(),
    s3Key: z.string(),
    url: z.string().url().optional(),
    processingStatus: z.enum(['UPLOADING', 'UPLOADED', 'PROCESSING', 'READY', 'FAILED']),
    createdAt: dateTransformer,
    updatedAt: dateTransformer,
});

// ============================================
// Pricing Schemas
// ============================================

export const pricingSchema = z.object({
    licenseType: z.enum(['BASIC', 'PREMIUM', 'EXCLUSIVE']),
    price: z.number().min(0),
});

export const beatPricingResponseSchema = z.object({
    id: z.string().uuid(),
    beatId: z.string().uuid(),
    licenseType: z.enum(['BASIC', 'PREMIUM', 'EXCLUSIVE']),
    price: z.number(),
    createdAt: dateTransformer,
    updatedAt: dateTransformer,
});

// ============================================
// Type Inference
// ============================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;

export type CreateBeatInput = z.infer<typeof createBeatSchema>;
export type BeatResponse = z.infer<typeof beatResponseSchema>;

export type PresignAssetRequest = z.infer<typeof presignAssetRequestSchema>;
export type PresignedUploadResponse = z.infer<typeof presignedUploadResponseSchema>;
export type AssetResponse = z.infer<typeof assetResponseSchema>;

export type PricingInput = z.infer<typeof pricingSchema>;
export type BeatPricingResponse = z.infer<typeof beatPricingResponseSchema>;
