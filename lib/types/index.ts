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


export enum SubscriptionTier {
    FREE = 'FREE',
    CREATOR = 'CREATOR',
    PRO = 'PRO',
}

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    PAST_DUE = 'PAST_DUE',
    CANCELED = 'CANCELED',
    NONE = 'NONE',
}

// User Types
export interface UserSubscription {
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    profileImageUrl?: string;
    subscription?: UserSubscription;
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
    // Pricing is optional/deprecated for Subscription MVP, but kept for legacy or future one-offs
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

// Pricing Types (Kept for reference or future hybrid model)
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
    uploadUrl?: string; // Standardize this if needed
}

// Download/Access Types
export interface DownloadLog {
    id: string;
    beatId: string;
    beat?: Beat;
    userId: string;
    user?: User;
    licenseType: LicenseType; // The license granted by the subscription download
    downloadedAt: string;
}

