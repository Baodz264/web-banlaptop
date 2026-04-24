import axiosClient from "./axios.config";

const warrantyService = {

  getWarranties(params) {
    return axiosClient.get("/warranties", { params });
  },

  getWarrantyById(id) {
    return axiosClient.get(`/warranties/${id}`);
  },

  createWarranty(data) {
    return axiosClient.post("/warranties", data);
  },

  updateWarranty(id, data) {
    return axiosClient.put(`/warranties/${id}`, data);
  },

  deleteWarranty(id) {
    return axiosClient.delete(`/warranties/${id}`);
  }

};

export default warrantyService;