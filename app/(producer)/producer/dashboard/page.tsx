'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { useBeats } from '@/lib/hooks/use-beat-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Skeleton } from '@/components/ui/skeleton';
import { Music, DollarSign, Play, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProducerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: beats, isLoading } = useBeats({
    producerId: user?.id,
    status: 'PUBLISHED',
  });

  // Mock stats - these would come from API in production
  const stats = {
    totalSales: 0,
    totalPlays: 0,
    revenue: 0,
    beats: beats?.length || 0,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Producer Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.username}
          </p>
        </div>
        <ButtonLink size="lg" href="/producer/beats/new">
          <Plus className="mr-2 h-5 w-5" />
          Create Beat
        </ButtonLink>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beats</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.beats}</div>
            <p className="text-xs text-muted-foreground">
              Published beats
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              All-time sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlays}</div>
            <p className="text-xs text-muted-foreground">
              Preview plays
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Beats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Beats</CardTitle>
              <CardDescription>Your latest published beats</CardDescription>
            </div>
            <ButtonLink variant="outline" href="/producer/beats">
              View All
            </ButtonLink>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : beats && beats.length > 0 ? (
            <div className="space-y-3">
              {beats.slice(0, 5).map((beat) => (
                <div
                  key={beat.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/producer/beats/${beat.id}`)}
                >
                  <div>
                    <h4 className="font-medium">{beat.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {beat.genre} • {beat.bpm} BPM
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(beat.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No beats yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first beat
              </p>
              <ButtonLink href="/producer/beats/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Beat
              </ButtonLink>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
