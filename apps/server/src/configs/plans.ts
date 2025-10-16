const PLANS = {
    FREE: { amount: 0, currency: 'INR', interval: 'month' },
    PREMIUM: { amount: 799, currency: 'INR', interval: 'month' },
    PREMIUM_PLUS: { amount: 1599, currency: 'INR', interval: 'month' },
} as const;

export default PLANS;
