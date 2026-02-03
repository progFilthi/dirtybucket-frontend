'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause } from 'lucide-react';
import { Beat, AssetType, ProcessingStatus } from '@/lib/types';
import { BeatDownloadButton } from './beat-download-button';

interface BeatCardProps {
  beat: Beat;
}

export function BeatCard({ beat }: BeatCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailAsset = beat.assets?.find(
    (asset) => asset.type === AssetType.THUMBNAIL_IMAGE && asset.processingStatus === ProcessingStatus.READY
  );

  const previewAsset = beat.assets?.find(
    (asset) => asset.type === AssetType.PREVIEW_AUDIO && asset.processingStatus === ProcessingStatus.READY
  );

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement global audio player state
    setIsPlaying(!isPlaying);
  };

  return (
    <Link href={`/beats/${beat.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {thumbnailAsset?.url ? (
            <Image
              src={thumbnailAsset.url}
              alt={beat.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-4xl font-bold text-muted-foreground">
                {beat.title.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}

          {/* Play Button Overlay */}
          {previewAsset && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                size="icon"
                variant="secondary"
                className="h-14 w-14 rounded-full"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-1">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {beat.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
            {beat.producer?.username || 'Unknown Producer'}
          </p>

          <div className="flex flex-wrap gap-2">
            {beat.genre && (
              <Badge variant="secondary" className="text-xs">
                {beat.genre}
              </Badge>
            )}
            {beat.bpm && (
              <Badge variant="outline" className="text-xs">
                {beat.bpm} BPM
              </Badge>
            )}
            {beat.musicalKey && (
              <Badge variant="outline" className="text-xs">
                {beat.musicalKey}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <BeatDownloadButton
            beatId={beat.id}
            beatTitle={beat.title}
            variant="default"
            size="sm"
            className="w-full"
          />
        </CardFooter>
      </Card>
    </Link>
  );
}
