import { CREATE_ORDER_URL, GET_PLAN_URL, UPDATE_URL } from '@/routes/api_routes';
import { PlanType } from '@/src/types/prisma-types';
import axios from 'axios';
import PLANS from '../plans';

export default class RazorpayServer {
    public async createOrder(plan: PlanType, token: string) {
        try {
            const { data } = await axios.post(
                CREATE_ORDER_URL,
                { plan },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!data.success) {
                console.error('Server returned unsuccessfull response: ', data.message);
                return null;
            }

            // contains -> plan, orderId, amount, currency, interval
            return data.plan;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // this should be called outside when a button is clicked
    public static async checkout(name: string, email: string, token: string, plan: PlanType) {
        try {
            const razorpayServer = new RazorpayServer();
            const order = await razorpayServer.createOrder(plan, token);

            if (!order || order?.orderId) throw new Error('Error creating order');

            const selectedPlan = PLANS[plan];

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: selectedPlan.amount * 100,
                currency: selectedPlan.currency,
                name: 'Winter Fell subscription',
                description: `Subscribing to ${plan}`,
                order_id: order.orderId,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handler: async (response: any) => {
                    try {
                        const verified = await razorpayServer.updateSubscription(
                            token,
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature,
                        );
                        if (verified) {
                            // show the toast that payment was a success
                        } else {
                            // show payment verification failed
                        }
                    } catch (error) {
                        console.error(error);
                    }
                },
                prefill: {
                    // this is for testing purposes
                    name: name,
                    email: email,
                    contact: '999999999',
                },
                theme: {
                    color: '#FF4D67',
                },
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public async updateSubscription(
        token: string,
        orderId: string,
        paymentId: string,
        signature: string,
    ): Promise<boolean> {
        try {
            const { data } = await axios.post(
                UPDATE_URL,
                { orderId, paymentId, signature },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!data.success) {
                console.error('Server returned unsuccessfull response: ', data.message);
                return false;
            }

            // else it was a success
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public static async getPlan(token: string) {
        try {
            const { data } = await axios.get(GET_PLAN_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!data.success) {
                console.error('Server returned unsuccessfull response: ', data.message);
                return null;
            }

            // contains -> plan, status, start?, end?, auto_renew?
            return data.subscription;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
