import {Router} from "express"
import { moderateComment } from "../controllers/moderation.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router= Router();

router.route("/").post(verifyJWT,moderateComment);

export default router;
