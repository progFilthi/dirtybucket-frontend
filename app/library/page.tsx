'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { Nav } from '@/components/layout/nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Music } from 'lucide-react';
import Link from 'next/link';

// Mock data - would come from API in production
const mockPurchases = [
  // {
  //   id: '1',
  //   beat: {
  //     title: 'Dark Trap Beat',
  //     producer: 'ProducerName',
  //   },
  //   licenseType: 'PREMIUM',
  //   price: 99.99,
  //   purchasedAt: '2026-01-15',
  //   downloadUrl: '#',
  // },
];

export default function LibraryPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Library</h1>
          <p className="text-muted-foreground mt-1">
            Your purchased beats and licenses
          </p>
        </div>

        {mockPurchases.length > 0 ? (
          <div className="space-y-4">
            {mockPurchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{purchase.beat.title}</CardTitle>
                      <CardDescription>
                        by {purchase.beat.producer}
                      </CardDescription>
                    </div>
                    <Badge>{purchase.licenseType}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Purchased on {new Date(purchase.purchasedAt).toLocaleDateString()}
                      {' • '}
                      ${purchase.price.toFixed(2)}
                    </div>
                    <Button asChild>
                      <a href={purchase.downloadUrl} download>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Music className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Browse the marketplace to find beats and start building your library
              </p>
              <Button asChild size="lg">
                <Link href="/marketplace">
                  Browse Marketplace
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
