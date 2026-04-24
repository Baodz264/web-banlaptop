import axiosClient from "./axios.config";

const postProductService = {

  // GET LIST
  getPostProducts(params) {
    return axiosClient.get("/post-products", { params });
  },

  // GET DETAIL
  getPostProduct(post_id, product_id) {
    return axiosClient.get(`/post-products/${post_id}/${product_id}`);
  },

  // CREATE
  createPostProduct(data) {
    return axiosClient.post("/post-products", data);
  },

  // DELETE
  deletePostProduct(post_id, product_id) {
    return axiosClient.delete(`/post-products/${post_id}/${product_id}`);
  },

};

export default postProductService;