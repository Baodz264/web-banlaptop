import axiosClient from "./axios.config";

const productImageService = {

  getByProduct: (product_id) => {
    return axiosClient.get(`/product-images/product/${product_id}`);
  },

  create: (data) => {
    return axiosClient.post("/product-images", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

  delete: (id) => {
    return axiosClient.delete(`/product-images/${id}`);
  }

};

export default productImageService;