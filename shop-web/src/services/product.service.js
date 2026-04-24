import axiosClient from "./axios.config";

const productService = {

  getProducts(params) {
    return axiosClient.get("/products", { params });
  },

  getProductById(id) {
    return axiosClient.get(`/products/${id}`);
  },

  createProduct(data) {
    return axiosClient.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  updateProduct(id, data) {
    return axiosClient.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  deleteProduct(id) {
    return axiosClient.delete(`/products/${id}`);
  },
    getProductBySlug(slug) {
    return axiosClient.get(`/products/slug/${slug}`);
  },
  getRelated: (category_id) => {
    return axiosClient.get("/products", {
      params: { category_id, limit: 8 }
    });
  },
  //thêm bằng excel
  createBulkProducts(data) {
    return axiosClient.post("/products/bulk", data);
  }

};

export default productService;