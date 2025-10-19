import { Router } from 'express';
import signInController from '../controllers/user-controller/signInController';
import startChatController from '../controllers/chat-controller/startChatController';
import getFilesController from '../controllers/chat-controller/getFilesController';
import authMiddleware from '../middlewares/authMiddleware';
import createOrderController from '../controllers/payment-controller/createOrderController';
import updateSubscriptionController from '../controllers/payment-controller/updateSubscriptionController';
import subscriptionMiddleware from '../middlewares/subscriptionMiddleware';
import getUserPlanController from '../controllers/payment-controller/getUserPlanController';
import syncFilesController from '../controllers/files/syncFilesController';

const router: Router = Router();

// user-routes
router.post('/sign-in', signInController);

// code-routes
router.post('/new', startChatController);

// file-routes
router.get('/files/:contractId', authMiddleware, getFilesController);
// use this or write a ws layer to share directly to kubernetes
router.get('/files/sync', authMiddleware, syncFilesController);

// payment-routes
router.post('/subscription/create-order', authMiddleware, createOrderController);
router.post(
    '/subscription/update',
    authMiddleware,
    subscriptionMiddleware,
    updateSubscriptionController,
);
router.get('/subscription/get-plan', authMiddleware, getUserPlanController);

export default router;
