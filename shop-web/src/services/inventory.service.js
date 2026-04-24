import axiosClient from "./axios.config";

const inventoryService = {

  getInventories(params) {
    return axiosClient.get("/inventories", { params });
  },

  getInventoryById(id) {
    return axiosClient.get(`/inventories/${id}`);
  },

  createInventory(data) {
    return axiosClient.post("/inventories", data);
  },

  updateInventory(id, data) {
    return axiosClient.put(`/inventories/${id}`, data);
  },

  deleteInventory(id) {
    return axiosClient.delete(`/inventories/${id}`);
  }

};

export default inventoryService;