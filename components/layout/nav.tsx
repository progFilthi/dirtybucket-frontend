'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/mode-toggle';
import { Music, ShoppingBag, User, LogOut, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Music className="h-6 w-6" />
            <span className="font-bold text-xl">DirtyBucket</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/marketplace"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/marketplace')
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Marketplace
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/producer/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/producer')
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  Producer
                </Link>
                <Link
                  href="/library"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/library')
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  Library
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <ModeToggle />

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "relative h-10 w-10 rounded-full")}>
                  <Avatar>
                    <AvatarFallback>
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/producer/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/library')}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    My Library
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/producer/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <ButtonLink variant="ghost" href="/login">
                  Sign In
                </ButtonLink>
                <ButtonLink href="/register">
                  Sign Up
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
