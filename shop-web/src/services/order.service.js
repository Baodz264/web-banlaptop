import axiosClient from "./axios.config";

const OrderService = {

  // Lấy danh sách đơn hàng
  getOrders: (params) => {
    return axiosClient.get("/orders", { params });
  },

  // Lấy chi tiết đơn hàng
  getOrderById: (id) => {
    return axiosClient.get(`/orders/${id}`);
  },

  // Tạo đơn hàng
  createOrder: (data) => {
    return axiosClient.post("/orders", data);
  },

  // Cập nhật đơn hàng (admin)
  updateOrder: (id, data) => {
    return axiosClient.put(`/orders/${id}`, data);
  },

  // Xóa đơn hàng (admin)
  deleteOrder: (id) => {
    return axiosClient.delete(`/orders/${id}`);
  }

};

export default OrderService;
