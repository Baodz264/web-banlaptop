import axiosClient from "./axios.config";

const BundleService = {

  getBundles: (params) => {
    return axiosClient.get("/product-bundles", { params });
  },

  getBundleById: (id) => {
    return axiosClient.get(`/product-bundles/${id}`);
  },

  createBundle: (data) => {
    return axiosClient.post("/product-bundles", data);
  },

  updateBundle: (id, data) => {
    return axiosClient.put(`/product-bundles/${id}`, data);
  },

  deleteBundle: (id) => {
    return axiosClient.delete(`/product-bundles/${id}`);
  },

};

export default BundleService;
