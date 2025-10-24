import { useState } from 'react';
import { LiaServicestack } from 'react-icons/lia';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';
import NavItems, { NavItemsType } from '../nav/NavItems';
import UnclickableTicker from '../tickers/UnclickableTicker';

type PlanType = 'FREE' | 'PREMIUM' | 'PREMIUM_PLUS';
type BillingPeriod = 'MONTHLY' | 'YEARLY';

interface Plan {
    plan: PlanType;
    priceMonthly: string;
    priceYearly: string;
    features: string[];
    isBest?: boolean;
}

const planItems: NavItemsType[] = [
    { name: 'Monthly', link: '#pricing' },
    { name: 'Yearly', link: '#features' },
];

const planStyles = {
    FREE: 'bg-neutral-900 text-neutral-300 border-neutral-700/50',
    PREMIUM: 'bg-neutral-200 text-neutral-900 border-neutral-400/30',
    PREMIUM_PLUS: 'bg-primary text-light border-primary-light/20',
};

const planAccents = {
    FREE: 'bg-gradient-to-br from-neutral-700/30 to-transparent',
    PREMIUM: 'bg-gradient-to-br from-neutral-400/20 to-transparent',
    PREMIUM_PLUS: 'bg-gradient-to-br from-white/10 to-transparent',
};

function SubscriptionCard({
    plan,
    price,
    billing,
    features,
    isBest = false,
}: {
    plan: PlanType;
    price: string;
    billing: BillingPeriod;
    features: string[];
    isBest?: boolean;
}) {
    return (
        <div
            className={`rounded-2xl relative overflow-hidden border backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl
            ${isBest ? 'md:w-[480px] md:h-[285px]' : 'md:w-[480px] md:h-[260px]'} 
            w-full max-w-[420px] h-auto 
            ${planStyles[plan]} 
            ${isBest && 'shadow-[0_0_40px_rgba(255,255,255,0.2)] ring-2 ring-white/20'}
            `}
        >
            <div className={`absolute inset-0 opacity-60 ${planAccents[plan]}`} />

            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-black/10 blur-3xl" />

            <div className="relative z-10 h-full flex flex-col p-6 sm:p-7">
                <div className="flex justify-between items-start mb-5 sm:mb-6">
                    <div>
                        <div className="text-[10px] sm:text-xs font-medium opacity-70 uppercase tracking-wider mb-1">
                            Winterfell
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                            {plan === 'PREMIUM_PLUS' ? 'Premium+' : plan}
                        </h2>
                    </div>
                    <div
                        className={`p-2.5 rounded-xl backdrop-blur-sm ${plan === 'FREE'
                            ? 'bg-neutral-800/50'
                            : plan === 'PREMIUM'
                                ? 'bg-white/20'
                                : 'bg-white/15'
                            }`}
                    >
                        <LiaServicestack className="size-6 sm:size-7" />
                    </div>
                </div>

                <div className="flex-1 mb-4 sm:mb-5">
                    <div className="flex flex-wrap gap-1.5">
                        {features.slice(0, 4).map((feature, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${plan === 'FREE'
                                    ? 'bg-neutral-800/60'
                                    : plan === 'PREMIUM'
                                        ? 'bg-white/25'
                                        : 'bg-white/15'
                                    }`}
                            >
                                <Check className="size-3" />
                                <span className="whitespace-nowrap">{feature}</span>
                            </div>
                        ))}
                    </div>
                    {features.length > 4 && (
                        <div className="mt-1.5 text-[10px] sm:text-xs opacity-60">
                            +{features.length - 4} more features
                        </div>
                    )}
                </div>

                <div className="flex items-end justify-between pt-2 flex-wrap gap-3 sm:gap-0">
                    <div className="pb-1 flex items-center gap-x-2 sm:gap-x-3">
                        <div className="text-2xl sm:text-3xl font-bold tracking-tight">{price}</div>
                        <div className="text-[10px] sm:text-xs opacity-60 mt-1">
                            {billing === 'MONTHLY' ? 'per month' : 'per year'}
                        </div>
                    </div>
                    <Button
                        className={`px-5 py-1.5 rounded-lg font-semibold transition-all shadow-lg ${plan === 'FREE' || plan === 'PREMIUM'
                            ? 'bg-[#7049FC] hover:bg-[#754fff] text-white'
                            : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                            }`}
                    >
                        {plan === 'FREE' ? 'Start Free' : 'Upgrade'}
                    </Button>
                </div>
            </div>

            <div className="absolute bottom-4 left-7 hidden sm:flex gap-2 opacity-20 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-1">
                        {[...Array(4)].map((_, j) => (
                            <div key={j} className="w-1.5 h-1.5 rounded-full bg-current" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SubscriptionPlans() {
    const [billing, setBilling] = useState<BillingPeriod>('MONTHLY');

    const plans: Plan[] = [
        {
            plan: 'FREE',
            priceMonthly: '₹0',
            priceYearly: '₹0',
            features: ['1 Contract / Week', '30 AI Messages', 'Devnet Only', 'Basic Support'],
        },
        {
            plan: 'PREMIUM_PLUS',
            priceMonthly: '₹1,999',
            priceYearly: '₹19,990',
            features: [
                'Unlimited Contracts',
                'Unlimited AI Chat',
                'Mainnet Access',
                '10+ Deployments',
                'Fast Build Priority',
                'Priority Support',
            ],
            isBest: true,
        },
        {
            plan: 'PREMIUM',
            priceMonthly: '₹799',
            priceYearly: '₹7,990',
            features: [
                '10 Contracts / Month',
                '300 AI Messages',
                'Devnet + Testnet',
                'Standard Support',
            ],
        },
    ];

    return (
        <section
            id="pricing"
            className="relative w-full min-h-screen bg-gradient-to-b to-dark-base from-[#0a0c0d] text-center text-white flex flex-col items-center justify-center z-20 px-4 border-t border-neutral-800"
        >
            <UnclickableTicker className='absolute -top-[14px] right-[35%]'>frequent asked questions</UnclickableTicker>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-900/20 to-transparent" />

            <div className="relative z-10 mt-28 sm:mt-32 mb-12 sm:mb-15">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-light">
                    Choose Your Winterfell Plan
                </h1>
                <div className="mt-3 sm:mt-4 text-light/60 max-w-2xl mx-auto text-sm sm:text-lg tracking-wide px-2">
                    Get access to premium features designed to boost productivity and simplify your
                    workflow with seamless performance
                </div>
            </div>

            <NavItems
                items={planItems.map((item, index) => {
                    if (index === 0) {
                        return { ...item, onClick: () => setBilling('MONTHLY') };
                    }
                    if (index === 1) {
                        return { ...item, onClick: () => setBilling('YEARLY') };
                    }
                    return item;
                })}
            />

            <span className="mb-12 sm:mb-15 tracking-wider text-light/60 text-xs sm:text-sm">
                {billing === 'YEARLY'
                    ? 'Save up to 10% off with yearly billing'
                    : 'Switch to yearly for better savings'}
            </span>

            <div className="relative z-10 flex justify-center items-center gap-6 sm:gap-8 flex-wrap px-2 sm:px-4 mb-16 sm:mb-20">
                {plans.map((planData) => (
                    <SubscriptionCard
                        key={planData.plan}
                        plan={planData.plan}
                        price={billing === 'MONTHLY' ? planData.priceMonthly : planData.priceYearly}
                        billing={billing}
                        features={planData.features}
                        isBest={planData.isBest}
                    />
                ))}
            </div>
        </section>
    );
}
