import Razorpay from "razorpay";
import { Orders } from "razorpay/dist/types/orders";
import env from "../configs/env";
import { PlanType, prisma, SubscriptionStatus } from "@repo/database";
import PLANS from "../configs/plans";
import crypto from "crypto";

export default class RazorpayGateway {

    private razorpay: Razorpay;

    constructor() {
        this.razorpay = new Razorpay({
            key_id: env.SERVER_RAZORPAY_KEY_ID,
            key_secret: env.SERVER_RAZORPAY_KEY_SECRET,
        });
    }

    public async create_order(plan_type: PlanType, email: string): Promise<Orders.RazorpayOrder> {
        const plan = PLANS[plan_type as keyof typeof PLANS];

        const options = {
            amount: plan.amount * 100,
            currency: plan.currency,
            receipt: `receipt_${Date.now()}`,
            notes: {
                plan: plan_type,
                userEmail: email,
            },
        };

        const order = await this.razorpay.orders.create(options);
        return order;
    }

    public verify(order_id: string, payment_id: string, signature: string): boolean {
        const sign = this.get_sign(order_id, payment_id);

        const expected_signature = this.get_expected_signature(sign);

        const is_valid = expected_signature === signature;

        if (!is_valid) return false;

        return true;

    }

    public async verify_and_update(
        order_id: string,
        payment_id: string,
        signature: string,
        subscription_id: string,
        user_id: string,
        plan_type: PlanType,
    ): Promise<{ success: boolean, message?: string }> {
        const sign = this.get_sign(order_id, payment_id);

        const expected_signature = this.get_expected_signature(sign);

        const is_valid = expected_signature === signature;

        if (!is_valid) {
            return {
                success: false,
                message: 'Invalid signature',
            };
        }

        const start = new Date();
        const end = new Date(start);
        end.setMonth(start.getMonth() + 1);

        await prisma.subscription.update({
            where: {
                id: subscription_id,
                userId: user_id,
            },
            data: {
                plan: plan_type,
                status: SubscriptionStatus.ACTIVE,
                razorpayOrderId: order_id,
                razorpayPaymentId: payment_id,
                razorpaySignature: signature,
                start: start,
                end: end,
            },
        });

        return {
            success: true,
        };
    }

    private get_sign(order_id: string, payment_id: string): string {
        return order_id + '|' + payment_id;
    }

    private get_expected_signature(sign: string): string {
        const expected_signature = crypto
            .createHmac('sha256', env.SERVER_RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        return expected_signature;
    }

}