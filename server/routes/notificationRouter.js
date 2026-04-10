import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  getNotifications,
  markAllRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.put("/mark-read", isAuthenticated, markAllRead);
router.delete("/:id", isAuthenticated, deleteNotification);

export default router;