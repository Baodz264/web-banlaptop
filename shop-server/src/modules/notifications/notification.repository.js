import Notification from "../../database/mongo/notification/notification.schema.js";

class NotificationRepository {

  // lấy tất cả thông báo
  static async findAll() {
    return await Notification.find().sort({ created_at: -1 });
  }

  // lấy theo user
  static async findAllByUser(user_id) {
    return await Notification.find({ user_id }).sort({ created_at: -1 });
  }

  // tìm theo id
  static async findById(id) {
    return await Notification.findById(id);
  }

  // tạo
  static async create(data) {
    return await Notification.create(data);
  }

  // đánh dấu đã đọc
  static async markAsRead(id) {
    return await Notification.findByIdAndUpdate(
      id,
      { is_read: true },
      { new: true }
    );
  }

  // xóa
  static async delete(id) {
    return await Notification.findByIdAndDelete(id);
  }

}

export default NotificationRepository;
