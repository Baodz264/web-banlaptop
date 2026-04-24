import axiosClient from "./axios.config";

const supplierService = {

  getSuppliers(params) {
    return axiosClient.get("/suppliers", { params });
  },

  getSupplierById(id) {
    return axiosClient.get(`/suppliers/${id}`);
  },

  createSupplier(data) {
    return axiosClient.post("/suppliers", data);
  },

  updateSupplier(id, data) {
    return axiosClient.put(`/suppliers/${id}`, data);
  },

  deleteSupplier(id) {
    return axiosClient.delete(`/suppliers/${id}`);
  }

};

export default supplierService;