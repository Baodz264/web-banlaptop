import axiosClient from "./axios.config";

const BundleItemService = {

  getItems: () => {
    return axiosClient.get("/product-bundle-items");
  },

  getItemsByBundle: (bundle_id) => {
    return axiosClient.get(`/product-bundle-items/bundle/${bundle_id}`);
  },

  createItem: (data) => {
    return axiosClient.post("/product-bundle-items", data);
  },

  deleteItem: (bundle_id, variant_id) => {
    return axiosClient.delete(`/product-bundle-items/${bundle_id}/${variant_id}`);
  },

};

export default BundleItemService;
