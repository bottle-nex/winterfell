import { Router } from 'express';
import signInController from '../controllers/user-controller/signInController';
import startChatController from '../controllers/chat-controller/startChatController';
import getFilesController from '../controllers/chat-controller/getFilesController';

const router: Router = Router();

// user-routes
router.post('/sign-in', signInController);
router.post('/new', startChatController);
router.get('/files/:contractId', getFilesController);

export default router;
