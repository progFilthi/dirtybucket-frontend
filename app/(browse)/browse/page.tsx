'use client';

import { useState } from 'react';
import { useBeats } from '@/lib/hooks/use-beat-queries';
import { BeatCard } from '@/components/beats/beat-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Nav } from '@/components/layout/nav';
import { Search, SlidersHorizontal } from 'lucide-react';

import { DownloadLimitBadge } from '@/components/subscription/download-limit-badge';

const GENRES = [
  'All',
  'Hip Hop',
  'Trap',
  'R&B',
  'Pop',
  'Electronic',
  'Rock',
  'Jazz',
  'Lo-Fi',
  'Drill',
  'Afrobeat',
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [bpmRange, setBpmRange] = useState({ min: '', max: '' });

  const { data: beats, isLoading } = useBeats({
    status: 'PUBLISHED',
    genre: selectedGenre !== 'All' ? selectedGenre : undefined,
    minBpm: bpmRange.min ? parseInt(bpmRange.min) : undefined,
    maxBpm: bpmRange.max ? parseInt(bpmRange.max) : undefined,
  });

  const filteredBeats = beats?.filter((beat) =>
    beat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    beat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Browse Beats</h1>
              <p className="text-muted-foreground">
                Discover and download beats with your subscription
              </p>
            </div>
            <DownloadLimitBadge />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-5 w-5" />
            <h2 className="font-semibold">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search beats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Genre */}
            <div>
              <Select value={selectedGenre} onValueChange={(val) => setSelectedGenre(val || 'All')}>
                <SelectTrigger>
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* BPM Range */}
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min BPM"
                value={bpmRange.min}
                onChange={(e) => setBpmRange({ ...bpmRange, min: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Max BPM"
                value={bpmRange.max}
                onChange={(e) => setBpmRange({ ...bpmRange, max: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `${filteredBeats?.length || 0} beats found`}
          </p>
        </div>

        {/* Beat Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        ) : filteredBeats && filteredBeats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBeats.map((beat) => (
              <BeatCard key={beat.id} beat={beat} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No beats found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
