// Enums
export enum AssetType {
    ORIGINAL_AUDIO = 'ORIGINAL_AUDIO',
    PREVIEW_AUDIO = 'PREVIEW_AUDIO',
    THUMBNAIL_IMAGE = 'THUMBNAIL_IMAGE',
    COVER_IMAGE = 'COVER_IMAGE',
}

export enum ProcessingStatus {
    UPLOADING = 'UPLOADING',
    UPLOADED = 'UPLOADED',
    PROCESSING = 'PROCESSING',
    READY = 'READY',
    FAILED = 'FAILED',
}

export enum BeatStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

export enum LicenseType {
    BASIC = 'BASIC',
    PREMIUM = 'PREMIUM',
    EXCLUSIVE = 'EXCLUSIVE',
}

export enum UserRole {
    PRODUCER = 'PRODUCER',
    ARTIST = 'ARTIST',
    ADMIN = 'ADMIN',
}

// User Types
export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    profileImageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

// Beat Types
export interface Beat {
    id: string;
    title: string;
    description?: string;
    bpm?: number;
    musicalKey?: string;
    genre?: string;
    tags?: string[];
    status: BeatStatus;
    producerId: string;
    producer?: User;
    assets?: Asset[];
    pricing?: BeatPricing[];
    createdAt: string;
    updatedAt: string;
}

// Asset Types
export interface Asset {
    id: string;
    beatId: string;
    type: AssetType;
    fileName: string;
    mimeType: string;
    s3Key: string;
    url?: string;
    processingStatus: ProcessingStatus;
    createdAt: string;
    updatedAt: string;
}

// Pricing Types
export interface BeatPricing {
    id: string;
    beatId: string;
    licenseType: LicenseType;
    price: number;
    createdAt: string;
    updatedAt: string;
}

// Upload Types
export interface PresignedUploadResponse {
    assetId: string;
    presignedUrl: string;
    s3Key: string;
}

// Purchase Types
export interface Purchase {
    id: string;
    beatId: string;
    beat?: Beat;
    userId: string;
    user?: User;
    licenseType: LicenseType;
    price: number;
    downloadUrl?: string;
    createdAt: string;
}
