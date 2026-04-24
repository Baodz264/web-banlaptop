import axiosClient from "./axios.config";

const NotificationService = {

  // USER: lấy thông báo của user đang đăng nhập
  getNotifications: () => {
    return axiosClient.get("/notifications");
  },

  // ADMIN: lấy tất cả thông báo của tất cả user
  getAllNotifications: () => {
    return axiosClient.get("/notifications/admin/all");
  },

  // lấy thông báo theo id
  getNotificationById: (id) => {
    return axiosClient.get(`/notifications/${id}`);
  },

  // tạo thông báo
  createNotification: (data) => {
    return axiosClient.post("/notifications", data);
  },

  // đánh dấu đã đọc
  markAsRead: (id) => {
    return axiosClient.put(`/notifications/${id}/read`);
  },

  // xóa thông báo
  deleteNotification: (id) => {
    return axiosClient.delete(`/notifications/${id}`);
  }

};

export default NotificationService;
