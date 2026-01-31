'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/lib/types';
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

            // Map to User type (assuming role comes from JWT, we'll need to add this endpoint)
            setUser({
                ...validated,
                role: UserRole.PRODUCER, // TODO: Get from backend response
            });
        } catch (error) {
            // Not authenticated or error
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
            role: UserRole.PRODUCER, // TODO: Extract from JWT or response
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
            role: UserRole.PRODUCER, // Backend sets PRODUCER by default
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
