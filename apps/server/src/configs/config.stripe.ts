import Stripe from 'stripe';
import env from './config.env';

const stripe = new Stripe(env.SERVER_STRIPE_SECRET_KEY, {
    typescript: true,
    apiVersion: '2025-10-29.clover'
});

