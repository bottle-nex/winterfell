import { Router } from "express";
import signInController from "../controllers/user-controller/signInController";

const router: Router = Router();

// user-routes
router.post('/sign-in', signInController);

export default router;