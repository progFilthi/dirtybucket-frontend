'use client';

import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';
import { useDownloadBeat, useHasDownloaded } from '@/lib/hooks/use-downloads';
import { SubscriptionGate } from '@/components/subscription/subscription-gate';
import { toast } from 'sonner';
import { useState } from 'react';

interface BeatDownloadButtonProps {
    beatId: string;
    beatTitle: string;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
}

export function BeatDownloadButton({
    beatId,
    beatTitle,
    variant = 'default',
    size = 'default',
    className,
}: BeatDownloadButtonProps) {
    const downloadMutation = useDownloadBeat();
    const hasDownloaded = useHasDownloaded(beatId);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const result = await downloadMutation.mutateAsync(beatId);
            
            // Trigger browser download
            if (result.downloadUrl) {
                const link = document.createElement('a');
                link.href = result.downloadUrl;
                link.download = `${beatTitle}.wav`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                toast.success(`Downloading "${beatTitle}"`);
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to download beat');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <SubscriptionGate onAuthorized={handleDownload}>
            {({ onClick, canDownload, isLoading }) => (
                <Button
                    variant={hasDownloaded ? 'outline' : variant}
                    size={size}
                    className={className}
                    onClick={onClick}
                    disabled={isLoading || isDownloading || !canDownload}
                >
                    {hasDownloaded ? (
                        <>
                            <Check className="mr-2 h-4 w-4" />
                            Downloaded
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-4 w-4" />
                            {isDownloading ? 'Downloading...' : 'Download'}
                        </>
                    )}
                </Button>
            )}
        </SubscriptionGate>
    );
}
