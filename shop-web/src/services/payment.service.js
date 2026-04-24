import axiosClient from "./axios.config";

const PaymentService = {

  // Lấy danh sách payment (admin)
  getPayments: (params) => {
    return axiosClient.get("/payments", { params });
  },

  // Lấy payment theo id
  getPaymentById: (id) => {
    return axiosClient.get(`/payments/${id}`);
  },

  // Tạo payment (COD / manual)
  createPayment: (data) => {
    return axiosClient.post("/payments", data);
  },

  // Cập nhật payment
  updatePayment: (id, data) => {
    return axiosClient.put(`/payments/${id}`, data);
  },

  // Xóa payment
  deletePayment: (id) => {
    return axiosClient.delete(`/payments/${id}`);
  },

  
  createVNPayPayment: (data) => {
    return axiosClient.post("/payments/vnpay/create", data);
  }
  // createVNPayPayment: (data) => {
  //   return axiosClient.post("/vnpay/create", data);
  // },


};

export default PaymentService;
