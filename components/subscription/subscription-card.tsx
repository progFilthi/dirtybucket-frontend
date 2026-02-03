'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSubscription, useCancelSubscription, useReactivateSubscription } from '@/lib/hooks/use-subscription';
import { SubscriptionStatus, SubscriptionTier } from '@/lib/types';
import { Calendar, Crown, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function SubscriptionCard() {
    const { data: subscription, isLoading } = useSubscription();
    const cancelMutation = useCancelSubscription();
    const reactivateMutation = useReactivateSubscription();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const handleCancel = async () => {
        try {
            await cancelMutation.mutateAsync();
            toast.success('Subscription will cancel at period end');
            setShowCancelConfirm(false);
        } catch (error) {
            toast.error('Failed to cancel subscription');
        }
    };

    const handleReactivate = async () => {
        try {
            await reactivateMutation.mutateAsync();
            toast.success('Subscription reactivated');
        } catch (error) {
            toast.error('Failed to reactivate subscription');
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Loading...</p>
                </CardContent>
            </Card>
        );
    }

    if (!subscription || subscription.status === SubscriptionStatus.NONE) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Active Subscription</CardTitle>
                    <CardDescription>Subscribe to unlock unlimited beat downloads</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <a href="/pricing">View Plans</a>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const tierLabels = {
        [SubscriptionTier.FREE]: 'Free',
        [SubscriptionTier.CREATOR]: 'Creator',
        [SubscriptionTier.PRO]: 'Pro',
    };

    const statusColors = {
        [SubscriptionStatus.ACTIVE]: 'bg-green-500',
        [SubscriptionStatus.PAST_DUE]: 'bg-yellow-500',
        [SubscriptionStatus.CANCELED]: 'bg-red-500',
        [SubscriptionStatus.NONE]: 'bg-gray-500',
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Crown className="h-5 w-5 text-primary" />
                            {tierLabels[subscription.tier]} Plan
                        </CardTitle>
                        <CardDescription>Manage your subscription</CardDescription>
                    </div>
                    <Badge className={statusColors[subscription.status]}>
                        {subscription.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Renewal Date */}
                <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">
                            {subscription.cancelAtPeriodEnd ? 'Expires on' : 'Renews on'}
                        </p>
                        <p className="font-medium">
                            {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                </div>

                {/* Cancellation Warning */}
                {subscription.cancelAtPeriodEnd && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">Subscription Ending</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Your subscription will end on{' '}
                                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    {subscription.cancelAtPeriodEnd ? (
                        <Button
                            onClick={handleReactivate}
                            disabled={reactivateMutation.isPending}
                            className="flex-1"
                        >
                            {reactivateMutation.isPending ? 'Reactivating...' : 'Reactivate Subscription'}
                        </Button>
                    ) : (
                        <>
                            {!showCancelConfirm ? (
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCancelConfirm(true)}
                                    className="flex-1"
                                >
                                    Cancel Subscription
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="destructive"
                                        onClick={handleCancel}
                                        disabled={cancelMutation.isPending}
                                        className="flex-1"
                                    >
                                        {cancelMutation.isPending ? 'Canceling...' : 'Confirm Cancel'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowCancelConfirm(false)}
                                        className="flex-1"
                                    >
                                        Keep Subscription
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
