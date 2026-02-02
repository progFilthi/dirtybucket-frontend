import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Nav } from '@/components/layout/nav';
import { LayoutDashboard, Music, CreditCard, Settings, Upload } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto px-4 py-8 flex-1 flex gap-8">
        <aside className="w-64 hidden md:block space-y-4">
          <div className="font-semibold text-lg px-4 mb-2">Dashboard</div>
          <nav className="space-y-2">
            <Link href="/dashboard/library">
              <Button variant="ghost" className="w-full justify-start">
                <Music className="mr-2 h-4 w-4" />
                Library
              </Button>
            </Link>
            <Link href="/dashboard/billing">
              <Button variant="ghost" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
             <Link href="/producer/upload">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <Upload className="mr-2 h-4 w-4" />
                Upload (Producer)
              </Button>
            </Link>
          </nav>
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
