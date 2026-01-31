'use client';

import Link from 'next/link';
import { ButtonLink } from '@/components/ui/button-link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Nav } from '@/components/layout/nav';
import { Music, Upload, DollarSign, TrendingUp, Play, ShoppingBag } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-background to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              DirtyBucket
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              The modern marketplace for beats. Sell your sound, find your vibe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonLink size="lg" className="text-lg" href="/marketplace">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse Beats
              </ButtonLink>
              <ButtonLink size="lg" variant="outline" className="text-lg" href="/register">
                <Upload className="mr-2 h-5 w-5" />
                Start Selling
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground text-lg">
              Built for producers and artists
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Upload className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Easy Upload</CardTitle>
                <CardDescription>
                  Direct-to-S3 uploads with automatic processing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Flexible Pricing</CardTitle>
                <CardDescription>
                  Set your own prices for Basic, Premium, and Exclusive licenses
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Play className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Preview Player</CardTitle>
                <CardDescription>
                  Let buyers preview your beats before purchasing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Track your sales, plays, and revenue in real-time
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-12 text-center">
              <Music className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to start selling?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of producers already making money from their beats
              </p>
              <ButtonLink size="lg" href="/register">
                Create Free Account
              </ButtonLink>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              <span className="font-semibold">DirtyBucket</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 DirtyBucket. Modern beat marketplace.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
