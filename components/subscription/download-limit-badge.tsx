'use client';

import { Badge } from '@/components/ui/badge';
import { useDownloadStats } from '@/lib/hooks/use-subscription';
import { Download } from 'lucide-react';

export function DownloadLimitBadge() {
    const { data: stats, isLoading } = useDownloadStats();

    if (isLoading || !stats) {
        return null;
    }

    const percentage = (stats.downloadsThisPeriod / stats.downloadLimit) * 100;
    const isNearLimit = percentage >= 80;
    const isAtLimit = stats.downloadsThisPeriod >= stats.downloadLimit;

    return (
        <Badge
            variant={isAtLimit ? 'destructive' : isNearLimit ? 'default' : 'secondary'}
            className="gap-1.5"
        >
            <Download className="h-3 w-3" />
            {stats.downloadsThisPeriod}/{stats.downloadLimit} downloads
        </Badge>
    );
}
