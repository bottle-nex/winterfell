import { Request, Response } from 'express';
import { razorpay } from '../../services/init';
import { prisma } from '@repo/database';

export default async function updateSubscriptionController(req: Request, res: Response) {
    try {
        const { paymentId, signature } = req.body;
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const userSubscription = await prisma.subscription.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (!userSubscription || userSubscription.razorpayOrderId) {
            res.status(404).json({
                success: false,
                message: 'No subscription found',
            });
            return;
        }

        const { success, message } = await razorpay.verify_and_update(
            userSubscription.razorpayOrderId!,
            paymentId,
            signature,
            userSubscription.id,
            user.id,
            userSubscription.plan,
        );

        if (!success) {
            res.status(401).json({
                success: false,
                message: message,
            });
            return;
        }

        res.status(201).json({
            success: true,
            message: 'Subscription updated successfully',
        });
        return;
    } catch (error) {
        console.error('Error while verifying payment: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
}
