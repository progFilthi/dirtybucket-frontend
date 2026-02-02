'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/api/schemas';
import { useAuth } from '@/lib/providers/auth-provider';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success('Welcome back');
      router.push('/producer/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="marketing-page min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      {/* Subtle gradient orb */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, oklch(0.70 0.12 183), transparent 70%)',
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-3 tracking-tight">Sign in</h1>
          <p className="text-foreground/50">Continue to DirtyBucket</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground/70 mb-2"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                disabled={isLoading}
                className="h-11 bg-foreground/5 border-foreground/10 focus:border-foreground/20 focus:bg-foreground/[0.02]"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground/70 mb-2"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
                className="h-11 bg-foreground/5 border-foreground/10 focus:border-foreground/20 focus:bg-foreground/[0.02]"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1.5">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md font-medium disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-sm text-center text-foreground/50">
            Don't have an account?{' '}
            <Link href="/register" className="text-foreground hover:text-foreground/80 transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
