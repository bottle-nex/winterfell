import { Request, Response } from 'express';
import { razorpay } from '../../services/init';

export default async function getUserPlanController(req: Request, res: Response) {
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

        if (!subscription) throw new Error('Error while fetching subscription');

        res.status(200).json({
            success: true,
            message: 'Subscription details fetched',
            subscription: subscription,
        });
        return;
    } catch (error) {
        console.error('Error while verifying subscription: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
}
