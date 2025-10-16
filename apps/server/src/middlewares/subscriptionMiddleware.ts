import { PlanType, prisma, SubscriptionStatus } from '@repo/database';
import { NextFunction, Request, Response } from 'express';
import { razorpay } from '../services/init';

export default async function subscriptionMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const subscription = await razorpay.get_subscription_status(user.id);

        if (!subscription) {
            res.status(404).json({
                success: false,
                message: 'Internal server error',
            });
            return;
        }

        // only approve if the subsciption-status is pending
        if (
            subscription.status === SubscriptionStatus.PENDING &&
            (subscription.plan === PlanType.PREMIUM ||
                subscription.plan === PlanType.PREMIUM_PLUS) &&
            subscription.end &&
            subscription.end > new Date()
        ) {
            next();
        } else {
            res.status(401).json({
                success: false,
                message: 'Plan invalidated',
            });
            return;
        }
    } catch (error) {
        console.error('Error in subscription middleware: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
}
