'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/api/schemas';
import { useAuth } from '@/lib/providers/auth-provider';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success('Welcome to DirtyBucket');
      router.push('/producer/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="marketing-page min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      {/* Subtle gradient orb */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, oklch(0.60 0.10 185), transparent 70%)',
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-3 tracking-tight">Create account</h1>
          <p className="text-foreground/50">Start your subscription</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-foreground/70 mb-2"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="producer_name"
                {...register('username')}
                disabled={isLoading}
                className="h-11 bg-foreground/5 border-foreground/10 focus:border-foreground/20 focus:bg-foreground/[0.02]"
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1.5">{errors.username.message}</p>
              )}
            </div>

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
              <p className="text-xs text-foreground/40 mt-1.5">Must be at least 8 characters</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md font-medium disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-sm text-center text-foreground/50">
            Already have an account?{' '}
            <Link href="/login" className="text-foreground hover:text-foreground/80 transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
