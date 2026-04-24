import axiosClient from "./axios.config";

const OrderStatusLogService = {

  // Lấy danh sách log trạng thái đơn hàng
  getLogs: (params) => {
    return axiosClient.get("/order-status-logs", { params });
  },

  // Lấy log theo id
  getLogById: (id) => {
    return axiosClient.get(`/order-status-logs/${id}`);
  },

  // Tạo log trạng thái đơn hàng
  createLog: (data) => {
    return axiosClient.post("/order-status-logs", data);
  }

};

export default OrderStatusLogService;
