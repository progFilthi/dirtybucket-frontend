'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useBeat } from '@/lib/hooks/use-beat-queries';
import { AudioPlayer } from '@/components/audio/audio-player';
import { Nav } from '@/components/layout/nav';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { AssetType, ProcessingStatus, LicenseType } from '@/lib/types';
import { ShoppingCart, User } from 'lucide-react';

export default function BeatDetailPage() {
  const params = useParams();
  const beatId = params.beatId as string;

  const { data: beat, isLoading } = useBeat(beatId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!beat) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Beat not found</h2>
            <ButtonLink href="/browse" className="mt-4">
              Back to Browse
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  const coverAsset = beat.assets?.find(
    (asset) => asset.type === AssetType.COVER_IMAGE && asset.processingStatus === ProcessingStatus.READY
  );

  const thumbnailAsset = beat.assets?.find(
    (asset) => asset.type === AssetType.THUMBNAIL_IMAGE && asset.processingStatus === ProcessingStatus.READY
  );

  const previewAsset = beat.assets?.find(
    (asset) => asset.type === AssetType.PREVIEW_AUDIO && asset.processingStatus === ProcessingStatus.READY
  );

  const displayImage = coverAsset || thumbnailAsset;

  const getLicenseDescription = (type: LicenseType) => {
    switch (type) {
      case LicenseType.BASIC:
        return 'MP3 download, non-exclusive rights';
      case LicenseType.PREMIUM:
        return 'WAV download, trackout stems, non-exclusive';
      case LicenseType.EXCLUSIVE:
        return 'Full exclusive rights, all files';
      default:
        return 'Standard license';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Cover Art */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {displayImage?.url ? (
              <Image
                src={displayImage.url}
                alt={beat.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <span className="text-6xl font-bold text-muted-foreground">
                  {beat.title.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Right: Beat Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{beat.title}</h1>
              <Link
                href={`/producer/${beat.producerId}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <User className="h-4 w-4" />
                <span>{beat.producer?.username || 'Unknown Producer'}</span>
              </Link>
            </div>

            {beat.description && (
              <p className="text-muted-foreground">{beat.description}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {beat.genre && <Badge variant="secondary">{beat.genre}</Badge>}
              {beat.bpm && <Badge variant="outline">{beat.bpm} BPM</Badge>}
              {beat.musicalKey && <Badge variant="outline">{beat.musicalKey}</Badge>}
              {beat.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <Separator />

            {/* Audio Player */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <AudioPlayer
                  src={previewAsset?.url}
                  title={beat.title}
                  artist={beat.producer?.username}
                  isProcessing={previewAsset?.processingStatus === ProcessingStatus.PROCESSING}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* License Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>License Options</CardTitle>
            <CardDescription>
              Choose the license that fits your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {beat.pricing && beat.pricing.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {beat.pricing.map((pricing) => (
                  <Card key={pricing.id} className="relative">
                    <CardHeader>
                      <CardTitle className="text-lg">{pricing.licenseType}</CardTitle>
                      <CardDescription>
                        {getLicenseDescription(pricing.licenseType as LicenseType)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-3xl font-bold">
                        ${pricing.price.toFixed(2)}
                      </div>
                      <Button className="w-full">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Purchase
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Pricing not available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
