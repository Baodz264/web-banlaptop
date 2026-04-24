import NotificationService from "./notification.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class NotificationController {

  // USER: thông báo của mình
  getNotifications = asyncHandler(async (req, res) => {

    const user_id = req.user.id;

    const notifications =
      await NotificationService.getNotifications(user_id);

    return response.success(res, notifications);

  });

  // ADMIN: tất cả thông báo
  getAllNotifications = asyncHandler(async (req, res) => {

    const notifications =
      await NotificationService.getAllNotifications();

    return response.success(res, notifications);

  });

  getNotificationById = asyncHandler(async (req, res) => {

    const notification =
      await NotificationService.getNotificationById(req.params.id);

    return response.success(res, notification);

  });

  createNotification = asyncHandler(async (req, res) => {

    const notification =
      await NotificationService.createNotification(req.body);

    return response.success(res, notification, "Notification created");

  });

  markAsRead = asyncHandler(async (req, res) => {

    const notification =
      await NotificationService.markAsRead(req.params.id);

    return response.success(res, notification, "Marked as read");

  });

  deleteNotification = asyncHandler(async (req, res) => {

    await NotificationService.deleteNotification(req.params.id);

    return response.success(res, null, "Notification deleted");

  });

}

export default new NotificationController();
