import axiosClient from "./axios.config";

const OrderVoucherService = {

  // Lấy danh sách voucher đã áp dụng cho đơn hàng
  getOrderVouchers: () => {
    return axiosClient.get("/order-vouchers");
  },

  // Lấy voucher theo id
  getOrderVoucherById: (id) => {
    return axiosClient.get(`/order-vouchers/${id}`);
  },

  // Tạo voucher cho đơn hàng
  createOrderVoucher: (data) => {
    return axiosClient.post("/order-vouchers", data);
  },

  // Cập nhật voucher của đơn hàng
  updateOrderVoucher: (id, data) => {
    return axiosClient.put(`/order-vouchers/${id}`, data);
  },

  // Xóa voucher khỏi đơn hàng
  deleteOrderVoucher: (id) => {
    return axiosClient.delete(`/order-vouchers/${id}`);
  }

};

export default OrderVoucherService;
