import express from "express";
import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import postRoute from "./postRoutes.js";
import notificationRoute from "./notificationRoutes.js";

// Create a new router
const router = express.Router();

// Use the routes
router.use(`/auth`, authRoute); //auth/register
router.use(`/users`, userRoute); //users/
router.use(`/posts`, postRoute); //posts/
router.use(`/notifications`, notificationRoute); //notifications/

export default router;