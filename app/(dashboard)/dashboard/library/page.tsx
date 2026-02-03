'use client';

import { useDownloadHistory } from '@/lib/hooks/use-downloads';
import { Nav } from '@/components/layout/nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Music } from 'lucide-react';
import Link from 'next/link';
import { SubscriptionCard } from '@/components/subscription/subscription-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LibraryPage() {
  const { data: downloads, isLoading } = useDownloadHistory();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Library</h1>
          <p className="text-muted-foreground mt-1">
            Your downloaded beats and subscription
          </p>
        </div>

        {/* Subscription Status */}
        <div className="mb-8">
          <SubscriptionCard />
        </div>

        {/* Downloads Section */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Downloaded Beats</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isLoading ? 'Loading...' : `${downloads?.length || 0} beats in your library`}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : downloads && downloads.length > 0 ? (
          <div className="space-y-4">
            {downloads.map((download) => (
              <Card key={download.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{download.beat?.title || 'Unknown Beat'}</CardTitle>
                      <CardDescription>
                        by {download.beat?.producer?.username || 'Unknown Producer'}
                      </CardDescription>
                    </div>
                    <Badge>{download.licenseType}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Downloaded on {new Date(download.downloadedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <Link
                      href={`/browse/${download.beatId}`}
                      className="h-7 gap-1 px-2 text-xs/relaxed inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-primary text-primary-foreground hover:bg-primary/80 transition-all"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Re-download
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Music className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No downloads yet</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Browse beats and start downloading to build your library
              </p>
              <Link href="/browse" className="h-8 gap-1 px-2.5 text-xs/relaxed inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-primary text-primary-foreground hover:bg-primary/80 transition-all">
                Browse Beats
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
