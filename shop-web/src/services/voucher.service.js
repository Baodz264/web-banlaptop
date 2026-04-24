import axiosClient from "./axios.config";

const VoucherService = {
  // Lấy danh sách voucher
  getVouchers: (params) => {
    return axiosClient.get("/vouchers", { params });
  },

  // Lấy chi tiết voucher
  getVoucherById: (id) => {
    return axiosClient.get(`/vouchers/${id}`);
  },

  // Tạo voucher
  createVoucher: (data) => {
    return axiosClient.post("/vouchers", data);
  },

  // Cập nhật voucher
  updateVoucher: (id, data) => {
    return axiosClient.put(`/vouchers/${id}`, data);
  },

  // Xóa voucher
  deleteVoucher: (id) => {
    return axiosClient.delete(`/vouchers/${id}`);
  },
};

export default VoucherService;
