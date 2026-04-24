import axiosClient from "./axios.config";

const OrderItemService = {

  // Lấy danh sách order items (filter theo order_id, variant_id)
  getOrderItems: (params) => {
    return axiosClient.get("/order-items", { params });
  },

  // Lấy order item theo id
  getOrderItemById: (id) => {
    return axiosClient.get(`/order-items/${id}`);
  },

  // Tạo order item
  createOrderItem: (data) => {
    return axiosClient.post("/order-items", data);
  },

  // Cập nhật order item
  updateOrderItem: (id, data) => {
    return axiosClient.put(`/order-items/${id}`, data);
  },

  // Xóa order item
  deleteOrderItem: (id) => {
    return axiosClient.delete(`/order-items/${id}`);
  }

};

export default OrderItemService;
