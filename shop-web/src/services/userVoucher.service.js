import axiosClient from "./axios.config";

const UserVoucherService = {
  // Lấy danh sách voucher của user
  getUserVouchers: (params) => {
    return axiosClient.get("/user-vouchers", { params });
  },

  // Lấy chi tiết user voucher
  getUserVoucherById: (id) => {
    return axiosClient.get(`/user-vouchers/${id}`);
  },

  // Tạo user voucher (gán voucher cho user)
  createUserVoucher: (data) => {
    return axiosClient.post("/user-vouchers", data);
  },

  // Cập nhật user voucher (ví dụ: đánh dấu đã sử dụng)
  updateUserVoucher: (id, data) => {
    return axiosClient.put(`/user-vouchers/${id}`, data);
  },

  // Xóa user voucher
  deleteUserVoucher: (id) => {
    return axiosClient.delete(`/user-vouchers/${id}`);
  },
};

export default UserVoucherService;
