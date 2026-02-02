import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-foreground/5 bg-background/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-8 text-sm text-foreground/40">
            <Link href="/terms" className="hover:text-foreground/60 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground/60 transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-foreground/60 transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-xs text-foreground/30">© 2026 DirtyBucket</p>
        </div>
      </div>
    </footer>
  );
}
