'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/providers/auth-provider';
import { useSubscription, useDownloadStats } from '@/lib/hooks/use-subscription';
import { UserRole, SubscriptionStatus } from '@/lib/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface SubscriptionGateProps {
    children: (props: { onClick: () => void; canDownload: boolean; isLoading: boolean }) => ReactNode;
    onAuthorized: () => void;
}

export function SubscriptionGate({ children, onAuthorized }: SubscriptionGateProps) {
    const { user, isAuthenticated } = useAuth();
    const { data: subscription, isLoading: subLoading } = useSubscription();
    const { data: stats, isLoading: statsLoading } = useDownloadStats();

    const isLoading = subLoading || statsLoading;

    // Check if user can download
    const canDownload = () => {
        if (!isAuthenticated) return false;
        if (user?.role !== UserRole.ARTIST) return false;
        if (!subscription) return false;
        if (subscription.status !== SubscriptionStatus.ACTIVE) return false;
        if (!stats) return false;
        if (stats.downloadsThisPeriod >= stats.downloadLimit) return false;
        return true;
    };

    const handleClick = () => {
        if (canDownload()) {
            onAuthorized();
        }
    };

    // Determine gate reason
    const getGateReason = () => {
        if (!isAuthenticated) return 'not-authenticated';
        if (user?.role !== UserRole.ARTIST) return 'wrong-role';
        if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) return 'no-subscription';
        if (stats && stats.downloadsThisPeriod >= stats.downloadLimit) return 'limit-reached';
        return null;
    };

    const gateReason = getGateReason();
    const showGate = gateReason !== null;

    return (
        <>
            {children({ onClick: handleClick, canDownload: canDownload(), isLoading })}

            {/* Gate Dialog */}
            <Dialog open={showGate && !isLoading}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {gateReason === 'limit-reached' ? (
                                <>
                                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                                    Download Limit Reached
                                </>
                            ) : (
                                <>
                                    <Crown className="h-5 w-5 text-primary" />
                                    Subscription Required
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {gateReason === 'not-authenticated' && (
                                'Please sign in to download beats.'
                            )}
                            {gateReason === 'wrong-role' && (
                                'Only artists can download beats. Producers can upload beats.'
                            )}
                            {gateReason === 'no-subscription' && (
                                'Subscribe to unlock unlimited beat downloads. Get access to our entire library with a simple monthly subscription.'
                            )}
                            {gateReason === 'limit-reached' && (
                                `You've reached your download limit of ${stats?.downloadLimit} beats for this billing period. Your limit will reset on ${stats?.periodEnd ? new Date(stats.periodEnd).toLocaleDateString() : 'your next billing date'}.`
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        {gateReason === 'not-authenticated' && (
                            <Link href="/login">
                                <Button>Sign In</Button>
                            </Link>
                        )}
                        {gateReason === 'no-subscription' && (
                            <Link href="/pricing">
                                <Button>View Plans</Button>
                            </Link>
                        )}
                        {gateReason === 'limit-reached' && (
                            <Link href="/dashboard/billing">
                                <Button>Manage Subscription</Button>
                            </Link>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
