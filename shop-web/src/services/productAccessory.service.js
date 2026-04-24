import axiosClient from "./axios.config";



const productAccessoryService = {

  getByProduct(product_id) {
    return axiosClient.get(`/product-accessories/product/${product_id}`);
  },

  add(data) {
    return axiosClient.post("/product-accessories", data);
  },

  delete(product_id, accessory_id) {
    return axiosClient.delete(`/product-accessories/${product_id}/${accessory_id}`);
  }

};

export default productAccessoryService;