'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
    src?: string;
    title?: string;
    artist?: string;
    className?: string;
    autoPlay?: boolean;
    isProcessing?: boolean;
}

export function AudioPlayer({
    src,
    title,
    artist,
    className,
    autoPlay = false,
    isProcessing = false,
}: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleDurationChange = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);
        const handleLoadStart = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('loadstart', handleLoadStart);
        audio.addEventListener('canplay', handleCanPlay);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('loadstart', handleLoadStart);
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = () => {
        if (!audioRef.current || !src) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (value: number | readonly number[]) => {
        if (!audioRef.current) return;
        const newTime = Array.isArray(value) ? value[0] : value;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (value: number | readonly number[]) => {
        const newVolume = Array.isArray(value) ? value[0] : value;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            setVolume(1);
            setIsMuted(false);
        } else {
            setVolume(0);
            setIsMuted(true);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (isProcessing) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center p-6 bg-muted/50 rounded-lg',
                    className
                )}
            >
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Processing audio...</span>
                </div>
            </div>
        );
    }

    if (!src) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center p-6 bg-muted/50 rounded-lg',
                    className
                )}
            >
                <span className="text-sm text-muted-foreground">No audio available</span>
            </div>
        );
    }

    return (
        <div className={cn('space-y-4', className)}>
            <audio ref={audioRef} src={src} preload="metadata" />

            {(title || artist) && (
                <div>
                    {title && <h3 className="font-semibold">{title}</h3>}
                    {artist && (
                        <p className="text-sm text-muted-foreground">{artist}</p>
                    )}
                </div>
            )}

            <div className="space-y-3">
                {/* Progress Bar */}
                <div className="space-y-1">
                    <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={0.1}
                        onValueChange={handleSeek}
                        disabled={!src || isLoading}
                        className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <Button
                        size="icon"
                        variant="default"
                        onClick={togglePlay}
                        disabled={!src || isLoading}
                        className="h-10 w-10"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isPlaying ? (
                            <Pause className="w-5 h-5" />
                        ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                        )}
                    </Button>

                    <div className="flex items-center gap-2 flex-1 max-w-[150px]">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={toggleMute}
                            className="h-8 w-8"
                        >
                            {isMuted || volume === 0 ? (
                                <VolumeX className="w-4 h-4" />
                            ) : (
                                <Volume2 className="w-4 h-4" />
                            )}
                        </Button>
                        <Slider
                            value={[volume]}
                            max={1}
                            step={0.01}
                            onValueChange={handleVolumeChange}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
