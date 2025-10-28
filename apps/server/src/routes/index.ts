import { Request, Response, Router } from 'express';
import signInController from '../controllers/user-controller/signInController';
import startChatController from '../controllers/chat-controller/startChatController';
import getFilesController from '../controllers/chat-controller/getFilesController';
import authMiddleware from '../middlewares/authMiddleware';
import createOrderController from '../controllers/payment-controller/createOrderController';
import updateSubscriptionController from '../controllers/payment-controller/updateSubscriptionController';
import subscriptionMiddleware from '../middlewares/subscriptionMiddleware';
import getUserPlanController from '../controllers/payment-controller/getUserPlanController';
import syncFilesController from '../controllers/files/syncFilesController';
import runCommandController from '../controllers/contract-controller/runCommandController';
import { githubCodePushController } from '../controllers/github-deploy-controller/githubCodePushController';

const router: Router = Router();

// user-routes
router.post('/sign-in', signInController);
router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Server is running' });
});

// code-routes
router.post('/new', authMiddleware, startChatController);
router.post('/contract/run-command', authMiddleware, runCommandController);
router.post('/contract/export', authMiddleware, githubCodePushController);

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
