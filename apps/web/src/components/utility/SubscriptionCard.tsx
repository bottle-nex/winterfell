import { LiaServicestack } from "react-icons/lia";
import { Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "../ui/button";


type PlanType = "FREE" | "PREMIUM" | "PREMIUM_PLUS";

interface SubscriptionCardProps {
    plan: PlanType;
    price: string;
    features: string[];
    isBest?: boolean;
}

const planStyles: Record<PlanType, string> = {
    FREE: "bg-neutral-900 text-neutral-300 border-neutral-700/50",
    PREMIUM: "bg-neutral-200 text-neutral-900 border-neutral-400/30",
    PREMIUM_PLUS: "bg-primary text-light border-primary-light/20",
};

const planAccents: Record<PlanType, string> = {
    FREE: "bg-gradient-to-br from-neutral-700/30 to-transparent",
    PREMIUM: "bg-gradient-to-br from-neutral-400/20 to-transparent",
    PREMIUM_PLUS: "bg-gradient-to-br from-white/10 to-transparent",
};

function SubscriptionCard({ plan, price, features, isBest = false }: SubscriptionCardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl relative overflow-hidden border backdrop-blur-sm",
                "transition-all duration-500 hover:scale-105 hover:shadow-2xl",
                isBest ? "w-[460px] h-[285px]" : "w-[420px] h-[260px]",
                planStyles[plan],
                isBest && "shadow-[0_0_40px_rgba(255,255,255,0.2)] ring-2 ring-white/20"
            )}
            style={{
                aspectRatio: "1.586 / 1",
            }}
        >
            {/* Credit card gradient overlay */}
            <div className={cn("absolute inset-0 opacity-60", planAccents[plan])} />
            
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-black/10 blur-3xl" />

            {/* Card content */}
            <div className="relative z-10 h-full flex flex-col p-7">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="text-xs font-medium opacity-70 uppercase tracking-wider mb-1">
                            Winterfell
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {plan === "PREMIUM_PLUS" ? "Premium+" : plan}
                        </h2>
                    </div>
                    <div className={cn(
                        "p-2.5 rounded-xl backdrop-blur-sm",
                        plan === "FREE" && "bg-neutral-800/50",
                        plan === "PREMIUM" && "bg-white/20",
                        plan === "PREMIUM_PLUS" && "bg-white/15"
                    )}>
                        <LiaServicestack className="size-7" />
                    </div>
                </div>

                {/* Features chip design */}
                <div className="flex-1 mb-5">
                    <div className="flex flex-wrap gap-1.5">
                        {features.slice(0, 4).map((feature, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
                                    plan === "FREE" && "bg-neutral-800/60",
                                    plan === "PREMIUM" && "bg-white/25",
                                    plan === "PREMIUM_PLUS" && "bg-white/15"
                                )}
                            >
                                <Check className="size-3" />
                                <span className="whitespace-nowrap">{feature}</span>
                            </div>
                        ))}
                    </div>
                    {features.length > 4 && (
                        <div className="mt-1.5 text-xs opacity-60">
                            +{features.length - 4} more features
                        </div>
                    )}
                </div>

                <div className="flex items-end justify-between pt-2">
                    <div className="pb-1 flex items-center gap-x-3">
                        <div className="text-3xl font-bold tracking-tight">{price}</div>
                        <div className="text-xs opacity-60 mt-1">per month</div>
                    </div>
                    <Button
                        size="sm"
                        className={cn(
                            "px-6 py-2 rounded-lg font-semibold transition-all shadow-lg",
                            plan === "FREE" && "bg-primary hover:bg-primary/90 text-white",
                            plan === "PREMIUM" && "bg-primary hover:bg-primary/90 text-white",
                            plan === "PREMIUM_PLUS" && "bg-neutral-900 hover:bg-neutral-800 text-white"
                        )}
                    >
                        {plan === "FREE" ? "Start Free" : "Upgrade"}
                    </Button>
                </div>
            </div>

            {/* Card number decoration */}
            <div className="absolute bottom-4 left-7 flex gap-2 opacity-20 pointer-events-none">
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
    return (
        <section className="w-full min-h-screen bg-[#0a0b0d] text-center text-white relative flex flex-col items-center justify-center z-20">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-900/20 to-transparent" />
            <div className="relative z-10 my-32">
                <h1 className="text-5xl font-extrabold tracking-tight text-light">
                    Choose Your Winterfell Plan
                </h1>
                <p className="mt-4 text-neutral-400 max-w-2xl mx-auto text-lg">
                    Winterfell is an AI-powered platform for building, editing, and deploying 
                    Solana smart contracts using Anchor — from generation to frontend integration.
                </p>
            </div>

            <div className="relative z-10 flex justify-center items-center gap-8 flex-wrap px-4">
                <SubscriptionCard
                    plan="FREE"
                    price="₹0"
                    features={[
                        "1 Contract / Week",
                        "30 AI Messages",
                        "Devnet Only",
                        "Basic Support",
                    ]}
                />
                <SubscriptionCard
                    plan="PREMIUM_PLUS"
                    price="₹1,999"
                    features={[
                        "Unlimited Contracts",
                        "Unlimited AI Chat",
                        "Mainnet Access",
                        "10+ Deployments",
                        "Fast Build Priority",
                        "Priority Support",
                    ]}
                    isBest
                />
                <SubscriptionCard
                    plan="PREMIUM"
                    price="₹799"
                    features={[
                        "10 Contracts / Month",
                        "300 AI Messages",
                        "Devnet + Testnet",
                        "Standard Support",
                    ]}
                />
            </div>
        </section>
    );
}