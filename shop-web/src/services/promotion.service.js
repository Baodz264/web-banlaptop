import axiosClient from "./axios.config";

const promotionService = {

  getPromotions(params) {
    return axiosClient.get("/promotions", { params });
  },

  getPromotionById(id) {
    return axiosClient.get(`/promotions/${id}`);
  },

  createPromotion(data) {
    return axiosClient.post("/promotions", data);
  },

  updatePromotion(id, data) {
    return axiosClient.put(`/promotions/${id}`, data);
  },

  deletePromotion(id) {
    return axiosClient.delete(`/promotions/${id}`);
  }

};

export default promotionService;