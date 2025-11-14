import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
    Features,
    PLAN_FEATURES,
    PlanType,
    Subscription,
    SubscriptionStatus,
    SubscriptionUsage,
} from '../types/subscription_types';
import { useUserSessionStore } from '../store/user/useUserSessionStore';

interface SubscriptionContextType {
    subscription: Subscription | null;
    subscriptionUsage: SubscriptionUsage | null;
    isLoading: boolean;
    hasFeature: (feature: Features) => boolean;
    isPremium: () => boolean;
    isPremiumPlus: () => boolean;
    canGenerateContract: () => boolean;
    canRunCommand: () => boolean;
    getRemainingContractCount: () => number;
    getRemainingCommandCount: () => number;
    refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export default function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [subscriptionUsage, setSubscriptionUsage] = useState<SubscriptionUsage | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { session } = useUserSessionStore();

    async function fetchSubscriptionData(): Promise<void> {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/subscription', {
                headers: { Authorization: `Bearer ${session?.user?.token}` },
            });
            if (!data) return;
            setSubscription(data.subscription);
            setSubscriptionUsage(data.subscriptionUsage);
        } catch (err) {
            console.error('Error fetching subscription. Falling back to base plan:', err);
            setSubscription({
                plan: PlanType.FREE,
                status: SubscriptionStatus.ACTIVE,
            });
            setSubscriptionUsage({
                contractsUsed: 0,
                contractsLimit: 3,
                contractsRemaining: 3,
                canGenerateContract: true,
                commandsUsed: 0,
                commandsLimit: 0,
                commandsRemaining: 0,
                canRunCommand: false,
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (session?.user?.token) fetchSubscriptionData();
    }, [session?.user?.token]);

    function isPremium(): boolean {
        if (loading || !subscription) return false;
        return subscription.plan === PlanType.PREMIUM;
    }

    function isPremiumPlus(): boolean {
        if (loading || !subscription) return false;
        return subscription.plan === PlanType.PREMIUM_PLUS;
    }

    function hasFeature(feature: Features): boolean {
        if (loading || !subscription) return false;
        return PLAN_FEATURES[subscription.plan].includes(feature);
    }

    function canGenerateContract(): boolean {
        if (loading || !subscriptionUsage) return false;
        return subscriptionUsage.canGenerateContract ?? false;
    }

    function canRunCommand(): boolean {
        if (loading || !subscriptionUsage) return false;
        return subscriptionUsage.canRunCommand ?? false;
    }

    function getRemainingCommandCount(): number {
        if (loading || !subscriptionUsage) return 0;
        return subscriptionUsage.commandsRemaining ?? 0;
    }

    function getRemainingContractCount(): number {
        if (loading || !subscriptionUsage) return 0;
        return subscriptionUsage.contractsRemaining ?? 0;
    }

    async function refreshSubscription() {
        await fetchSubscriptionData();
    }

    const value: SubscriptionContextType = {
        subscription,
        subscriptionUsage,
        isLoading: loading,
        hasFeature,
        isPremium,
        isPremiumPlus,
        canGenerateContract,
        canRunCommand,
        getRemainingContractCount,
        getRemainingCommandCount,
        refreshSubscription,
    };

    return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export const useSubscription = () => {
    const ctx = useContext(SubscriptionContext);
    if (!ctx) throw new Error('error while fetching the subcription details');
    return ctx;
};
