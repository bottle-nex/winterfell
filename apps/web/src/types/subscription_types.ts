export enum PlanType {
    FREE = 'FREE',
    PREMIUM = 'PREMIUM',
    PREMIUM_PLUS = 'PREMIUM_PLUS'
}

export enum Features {
    GENERATE_CONTRACT = 'GENERATE_CONTRACT',
    EDITOR_ACCESS = 'EDITOR_ACCESS',
    ACCESS_TERMINAL = 'ACCESS_TERMINAL',
}

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
    EXPIRED = 'EXPIRED',
    TRIALING = 'TRIALING'
}

export interface Subscription {
    plan: PlanType;
    status: SubscriptionStatus;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionUsage {
    contractsUsed: number;
    contractsLimit: number;
    contractsRemaining: number;
    canGenerateContract: boolean;

    commandsUsed: number;
    commandsLimit: number;
    commandsRemaining: number;
    canRunCommand: boolean;
}

export interface SubscriptionData {
    subscription: Subscription;
    usage: SubscriptionUsage;
}

export const PLAN_FEATURES: Record<PlanType, Features[]> = {
    [PlanType.FREE]: [
        Features.GENERATE_CONTRACT
    ],
    [PlanType.PREMIUM]: [
        Features.GENERATE_CONTRACT,
        Features.ACCESS_TERMINAL,
    ],
    [PlanType.PREMIUM_PLUS]: [
        Features.GENERATE_CONTRACT,
        Features.EDITOR_ACCESS,
        Features.ACCESS_TERMINAL,
    ],
}

export interface PlanLimits {
    contractCount: number;
    commandCount: number;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    [PlanType.FREE]: {
        contractCount: 3,
        commandCount: 0
    },
    [PlanType.PREMIUM]: {
        contractCount: 12,
        commandCount: 60
    },
    [PlanType.PREMIUM_PLUS]: {
        contractCount: 50,
        commandCount: 300
    }
};

export const PLAN_DETAILS = {
    [PlanType.FREE]: {
        name: 'Free',
        price: 0,
        description: 'Perfect for getting started'
    },
    [PlanType.PREMIUM]: {
        name: 'Premium',
        price: 49,
        description: 'For professionals'
    },
    [PlanType.PREMIUM_PLUS]: {
        name: 'Premium Plus',
        price: 99,
        description: 'For power users'
    }
};