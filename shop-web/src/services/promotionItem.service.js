import axiosClient from "./axios.config";

const promotionItemService = {

  getItems(params) {
    return axiosClient.get("/promotion-items", { params });
  },

  getItemById(id) {
    return axiosClient.get(`/promotion-items/${id}`);
  },

  createItem(data) {
    return axiosClient.post("/promotion-items", data);
  },

  updateItem(id, data) {
    return axiosClient.put(`/promotion-items/${id}`, data);
  },

  deleteItem(id) {
    return axiosClient.delete(`/promotion-items/${id}`);
  }

};

export default promotionItemService;