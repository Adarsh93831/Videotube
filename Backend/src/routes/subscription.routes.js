import { Router } from "express";
import{
    toggleSubscription,
    getMySubscribers,
    getMySubscribedChannels
} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/c/:channelId").post(toggleSubscription);
router.route("/getMySubscribers").get(getMySubscribers);
router.route("/getMySubscribedChannels").get(getMySubscribedChannels);

export default router;