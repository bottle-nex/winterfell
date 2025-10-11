import { Router } from 'express';
import signInController from '../controllers/user-controller/signInController';
import startChatController from '../controllers/chat-controller/startChatController';

const router: Router = Router();

// user-routes
router.post('/sign-in', signInController);
router.post('/new', startChatController);
export default router;
