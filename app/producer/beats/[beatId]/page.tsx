'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBeat, usePublishBeat } from '@/lib/hooks/use-beat-queries';
import { AssetUploader } from '@/components/upload/asset-uploader';
import { AudioPlayer } from '@/components/audio/audio-player';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AssetType, ProcessingStatus, BeatStatus } from '@/lib/types';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function BeatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const beatId = params.beatId as string;

  const { data: beat, isLoading } = useBeat(beatId, { refetchInterval: 5000 });
  const publishBeat = usePublishBeat(beatId);

  const [pricing, setPricing] = useState({
    basic: '',
    premium: '',
    exclusive: '',
  });

  const getAssetByType = (type: AssetType) => {
    return beat?.assets?.find((asset) => asset.type === type);
  };

  const isAssetReady = (type: AssetType) => {
    const asset = getAssetByType(type);
    return asset?.processingStatus === ProcessingStatus.READY;
  };

  const canPublish = () => {
    return (
      isAssetReady(AssetType.ORIGINAL_AUDIO) &&
      isAssetReady(AssetType.PREVIEW_AUDIO) &&
      beat?.status === BeatStatus.DRAFT
    );
  };

  const handlePublish = async () => {
    if (!canPublish()) {
      toast.error('Please upload required assets before publishing');
      return;
    }

    try {
      await publishBeat.mutateAsync();
      toast.success('Beat published successfully!');
      router.push('/producer/beats');
    } catch (error) {
      toast.error('Failed to publish beat');
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!beat) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Beat not found</h2>
          <ButtonLink className="mt-4" href="/producer/beats">
            Back to Beats
          </ButtonLink>
        </div>
      </div>
    );
  }

  const previewAsset = getAssetByType(AssetType.PREVIEW_AUDIO);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <ButtonLink variant="ghost" size="icon" href="/producer/beats">
          <ArrowLeft className="h-5 w-5" />
        </ButtonLink>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{beat.title}</h1>
            <Badge variant={beat.status === BeatStatus.PUBLISHED ? 'default' : 'secondary'}>
              {beat.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {beat.genre} • {beat.bpm} BPM • {beat.musicalKey}
          </p>
        </div>
        {beat.status === BeatStatus.DRAFT && (
          <Button
            size="lg"
            onClick={handlePublish}
            disabled={!canPublish() || publishBeat.isPending}
          >
            {publishBeat.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-5 w-5" />
            )}
            Publish Beat
          </Button>
        )}
      </div>

      <Tabs defaultValue="assets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audio Files</CardTitle>
              <CardDescription>
                Upload your original and preview audio files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AssetUploader
                beatId={beatId}
                assetType={AssetType.ORIGINAL_AUDIO}
                label="Original Audio (Full Track)"
                accept="audio/*"
                maxSize="100MB"
                required
              />
              <AssetUploader
                beatId={beatId}
                assetType={AssetType.PREVIEW_AUDIO}
                label="Preview Audio (30-60s)"
                accept="audio/*"
                maxSize="50MB"
                required
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Art</CardTitle>
              <CardDescription>
                Upload thumbnail and cover images for your beat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AssetUploader
                beatId={beatId}
                assetType={AssetType.THUMBNAIL_IMAGE}
                label="Thumbnail (Square, 500x500px recommended)"
                accept="image/*"
                maxSize="10MB"
              />
              <AssetUploader
                beatId={beatId}
                assetType={AssetType.COVER_IMAGE}
                label="Cover Image (1920x1080px recommended)"
                accept="image/*"
                maxSize="10MB"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>License Pricing</CardTitle>
              <CardDescription>
                Set prices for different license types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="basic">Basic License</Label>
                <Input
                  id="basic"
                  type="number"
                  placeholder="29.99"
                  value={pricing.basic}
                  onChange={(e) => setPricing({ ...pricing, basic: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  MP3 download, non-exclusive rights
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="premium">Premium License</Label>
                <Input
                  id="premium"
                  type="number"
                  placeholder="99.99"
                  value={pricing.premium}
                  onChange={(e) => setPricing({ ...pricing, premium: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  WAV download, trackout stems, non-exclusive
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exclusive">Exclusive License</Label>
                <Input
                  id="exclusive"
                  type="number"
                  placeholder="499.99"
                  value={pricing.exclusive}
                  onChange={(e) => setPricing({ ...pricing, exclusive: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Full exclusive rights, all files
                </p>
              </div>

              <Button className="w-full">Save Pricing</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Beat Preview</CardTitle>
              <CardDescription>
                Listen to how your beat will sound to buyers
              </CardDescription>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
