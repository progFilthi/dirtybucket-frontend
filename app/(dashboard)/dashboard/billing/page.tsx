'use client';

import { SubscriptionCard } from '@/components/subscription/subscription-card';
import { useDownloadStats } from '@/lib/hooks/use-subscription';
import { useDownloadHistory } from '@/lib/hooks/use-downloads';
import { Nav } from '@/components/layout/nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Download, Calendar, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BillingPage() {
  const { data: stats, isLoading: statsLoading } = useDownloadStats();
  const { data: downloads, isLoading: downloadsLoading } = useDownloadHistory();

  const isLoading = statsLoading || downloadsLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription and view usage statistics
          </p>
        </div>

        {/* Subscription Card */}
        <div className="mb-8">
          <SubscriptionCard />
        </div>

        {/* Usage Statistics */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Download Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Download Usage
              </CardTitle>
              <CardDescription>Current billing period</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : stats ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">
                        {stats.downloadsThisPeriod}/{stats.downloadLimit}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((stats.downloadsThisPeriod / stats.downloadLimit) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(stats.downloadsThisPeriod / stats.downloadLimit) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stats.downloadLimit - stats.downloadsThisPeriod} downloads remaining
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No subscription active</p>
              )}
            </CardContent>
          </Card>

          {/* Billing Period */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Billing Period
              </CardTitle>
              <CardDescription>Current subscription period</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : stats ? (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Period Start</p>
                    <p className="font-medium">
                      {new Date(stats.periodStart).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Period End</p>
                    <p className="font-medium">
                      {new Date(stats.periodEnd).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No subscription active</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Downloads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Downloads
            </CardTitle>
            <CardDescription>Your latest beat downloads</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : downloads && downloads.length > 0 ? (
              <div className="space-y-3">
                {downloads.slice(0, 5).map((download) => (
                  <div
                    key={download.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{download.beat?.title || 'Unknown Beat'}</p>
                      <p className="text-sm text-muted-foreground">
                        {download.beat?.producer?.username || 'Unknown Producer'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(download.downloadedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No downloads yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
