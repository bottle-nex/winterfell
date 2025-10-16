import { Router } from 'express';
import signInController from '../controllers/user-controller/signInController';
import startChatController from '../controllers/chat-controller/startChatController';
import getFilesController from '../controllers/chat-controller/getFilesController';
import authMiddleware from '../middlewares/authMiddleware';
import createOrderController from '../controllers/payment-controller/createOrderController';
import updateSubscriptionController from '../controllers/payment-controller/updateSubscriptionController';
import subscriptionMiddleware from '../middlewares/subscriptionMiddleware';
import getUserPlanController from '../controllers/payment-controller/getUserPlanController';

const router: Router = Router();

// user-routes
router.post('/sign-in', signInController);

// code-routes
router.post('/new', authMiddleware, startChatController);
router.get('/files/:contractId', authMiddleware, getFilesController);

// payment-routes
router.post('/subscription/create-subscription-order', authMiddleware, createOrderController);
router.post(
    '/subscription/update-subscription',
    authMiddleware,
    subscriptionMiddleware,
    updateSubscriptionController,
);
router.get('/subscription/plan', authMiddleware, getUserPlanController);

export default router;
