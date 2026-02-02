import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={cn(
        'relative px-3 py-2 text-sm font-medium transition-colors',
        isActive ? 'text-foreground' : 'text-foreground/60 hover:text-foreground',
        className
      )}
    >
      {children}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-color rounded-full"
          layoutId="activeNav"
          style={{
            boxShadow: '0 0 8px var(--accent-glow)',
          }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 30,
          }}
        />
      )}
    </Link>
  );
}
