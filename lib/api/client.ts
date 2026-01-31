const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const { params, ...fetchOptions } = options;

        // Build URL with query params
        let url = `${this.baseUrl}${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }

        // Default headers
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
        };

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers,
                credentials: 'include', // Important: Send cookies with requests
            });

            // Handle non-JSON responses (like 204 No Content)
            if (response.status === 204) {
                return {} as T;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(
                    response.status,
                    data.message || 'An error occurred',
                    data
                );
            }

            return data as T;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            // Network or other errors
            throw new ApiError(
                0,
                error instanceof Error ? error.message : 'Network error',
                error
            );
        }
    }

    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T>(
        endpoint: string,
        body?: any,
        options?: RequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async put<T>(
        endpoint: string,
        body?: any,
        options?: RequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async patch<T>(
        endpoint: string,
        body?: any,
        options?: RequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }

    // Special method for file uploads to S3 (no JSON, no auth headers)
    async uploadToS3(presignedUrl: string, file: File): Promise<void> {
        const response = await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (!response.ok) {
            throw new ApiError(
                response.status,
                'Failed to upload file to S3',
                await response.text()
            );
        }
    }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
