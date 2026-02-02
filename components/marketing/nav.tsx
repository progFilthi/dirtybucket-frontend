'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function MarketingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/5 bg-background/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-base font-medium text-foreground hover:text-foreground/80 transition-colors"
          >
            DirtyBucket
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="#pricing"
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/login"
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
