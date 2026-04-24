import express from "express";
import NotificationController from "./notification.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

import validate from "../../middlewares/validate.middleware.js";
import { createNotificationValidator } from "./notification.validator.js";

const router = express.Router();

// USER: thông báo của mình
router.get(
  "/",
  authMiddleware,
  NotificationController.getNotifications
);

// ADMIN: tất cả thông báo
router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("admin"),
  NotificationController.getAllNotifications
);

// chi tiết
router.get(
  "/:id",
  authMiddleware,
  NotificationController.getNotificationById
);

// tạo
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createNotificationValidator,
  validate,
  NotificationController.createNotification
);

// đánh dấu đọc
router.put(
  "/:id/read",
  authMiddleware,
  NotificationController.markAsRead
);

// xóa
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  NotificationController.deleteNotification
);

export default router;
