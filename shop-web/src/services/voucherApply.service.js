import axiosClient from "./axios.config";

const VoucherApplyService = {
  // Lấy danh sách cấu hình áp dụng voucher
  getVoucherApplies: (params) => {
    return axiosClient.get("/voucher-applies", { params });
  },

  // Lấy chi tiết voucher apply
  getVoucherApplyById: (id) => {
    return axiosClient.get(`/voucher-applies/${id}`);
  },

  // Tạo cấu hình áp dụng voucher
  createVoucherApply: (data) => {
    return axiosClient.post("/voucher-applies", data);
  },

  // Cập nhật cấu hình áp dụng voucher
  updateVoucherApply: (id, data) => {
    return axiosClient.put(`/voucher-applies/${id}`, data);
  },

  // Xóa cấu hình áp dụng voucher
  deleteVoucherApply: (id) => {
    return axiosClient.delete(`/voucher-applies/${id}`);
  },
};

export default VoucherApplyService;
