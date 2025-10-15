import { Request, Response } from "express";
import PLANS from "../../configs/plans";
import { razorpay } from "../../services/init";
import { prisma, SubscriptionStatus } from "@repo/database";

export default async function createOrderController(req: Request, res: Response) {
    try {

        const { planType } = req.body;
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const plan = PLANS[planType as keyof typeof PLANS];
        if (!plan) {
            res.status(400).json({
                success: false,
                message: 'Invalid plan',
            });
            return;
        }

        const order = await razorpay.create_order(planType, user.email);

        // upserting the subscription in the DB
        await prisma.subscription.upsert({
            where: {
                userId: user.id,
            },
            update: {
                plan: planType,
                status: SubscriptionStatus.PENDING,
                razorpayOrderId: order.id,
            },
            create: {
                userId: user.id,
                plan: planType,
                status: SubscriptionStatus.PENDING,
                razorpayOrderId: order.id,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            plan: {
                plan: planType,
                orderId: order.id,
                amount: plan.amount,
                currency: plan.currency,
                interval: plan.interval,
            }
        });
        return;

    } catch (err) {
        console.error('Error while creating order: ', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
}