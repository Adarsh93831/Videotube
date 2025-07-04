import express from "express";
import { verifyJWT,isAdmin } from "../middlewares/auth.middleware.js";
import {
  getAllUsers,
  deleteUser,
  getAllVideos,
  deleteVideo,
  getAnalytics,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(verifyJWT, isAdmin); // Protect all admin routes
router
  .route("/users")
  .get(getAllUsers);

router
  .route("/user/:id")
  .delete(deleteUser);


router
  .route("/videos")
  .get(getAllVideos);

router
  .route("/video/:id")
  .delete(deleteVideo);


router
  .route("/analytics")
  .get(getAnalytics);

  
export default router;