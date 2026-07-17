import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", userAuth, getNotifications);
router.post("/read-all", userAuth, markAllNotificationsRead);
router.post("/:id/read", userAuth, markNotificationRead);

export default router;
