'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, UserSubscription } from '@/lib/types';
import { apiClient } from '@/lib/api/client';
import {
    registerSchema,
    loginSchema,
    userResponseSchema,
    type RegisterInput,
    type LoginInput,
    type UserResponse
} from '@/lib/api/schemas';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
    hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check auth status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Try to get current user from /api/v1/users/me
            const response = await apiClient.get<UserResponse>('/api/v1/users/me');
            const validated = userResponseSchema.parse(response);

            // Try to get subscription data if user is authenticated
            let subscription: UserSubscription | undefined = undefined;
            try {
                const subResponse = await apiClient.get('/api/v1/subscriptions/me');
                // Parse subscription response with schema
                const { subscriptionResponseSchema } = await import('@/lib/api/schemas');
                subscription = subscriptionResponseSchema.parse(subResponse);
            } catch (error) {
                // Subscription fetch failed - user might not have one
                console.debug('Subscription fetch failed:', error);
            }

            // Set user from backend response (role now comes from response)
            setUser({
                ...validated,
                role: validated.role || UserRole.PRODUCER,
                subscription,
            });
        } catch (error) {
            // Not authenticated or error - silently fail
            console.debug('Auth check failed:', error instanceof Error ? error.message : 'Unknown error');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginInput) => {
        const validated = loginSchema.parse(credentials);
        const response = await apiClient.post<UserResponse>(
            '/api/v1/auth/login',
            validated
        );

        const user = userResponseSchema.parse(response);
        setUser({
            ...user,
            role: user.role || UserRole.PRODUCER,
        });
    };

    const register = async (data: RegisterInput) => {
        const validated = registerSchema.parse(data);
        const response = await apiClient.post<UserResponse>(
            '/api/v1/auth/register',
            validated
        );

        const user = userResponseSchema.parse(response);
        setUser({
            ...user,
            role: user.role || UserRole.PRODUCER,
        });
    };

    const logout = async () => {
        await apiClient.post('/api/v1/auth/logout');
        setUser(null);
    };

    const hasRole = (role: UserRole): boolean => {
        return user?.role === role;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                hasRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
