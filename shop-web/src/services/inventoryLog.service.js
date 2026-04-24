import axiosClient from "./axios.config";

const inventoryLogService = {

  getLogs(params) {
    return axiosClient.get("/inventory-logs", { params });
  },

  getLogById(id) {
    return axiosClient.get(`/inventory-logs/${id}`);
  },

  createLog(data) {
    return axiosClient.post("/inventory-logs", data);
  }

};

export default inventoryLogService;