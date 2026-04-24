import NotificationRepository from "./notification.repository.js";

class NotificationService {

  // ADMIN: lấy tất cả thông báo
  static async getAllNotifications() {
    return await NotificationRepository.findAll();
  }

  // USER: lấy thông báo của user
  static async getNotifications(user_id) {
    return await NotificationRepository.findAllByUser(user_id);
  }

  static async getNotificationById(id) {

    const notification = await NotificationRepository.findById(id);

    if (!notification) {
      throw new Error("Không tìm thấy thông báo");
    }

    return notification;
  }

  static async createNotification(data) {
    return await NotificationRepository.create(data);
  }

  static async markAsRead(id) {

    const notification = await NotificationRepository.findById(id);

    if (!notification) {
      throw new Error("Không tìm thấy thông báo");
    }

    return await NotificationRepository.markAsRead(id);
  }

  static async deleteNotification(id) {

    const notification = await NotificationRepository.findById(id);

    if (!notification) {
      throw new Error("Không tìm thấy thông báo");
    }

    return await NotificationRepository.delete(id);
  }

}

export default NotificationService;
