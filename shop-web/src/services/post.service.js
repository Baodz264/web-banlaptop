import axiosClient from "./axios.config";

const postService = {

  // GET LIST
  getPosts(params) {
    return axiosClient.get("/posts", { params });
  },

  // GET DETAIL BY ID
  getPostById(id) {
    return axiosClient.get(`/posts/${id}`);
  },

  // GET DETAIL BY SLUG
  getPostBySlug(slug) {
    return axiosClient.get(`/posts/slug/${slug}`);
  },

  // CREATE
  createPost(data) {
    return axiosClient.post("/posts", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // UPDATE
  updatePost(id, data) {
    return axiosClient.put(`/posts/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // DELETE
  deletePost(id) {
    return axiosClient.delete(`/posts/${id}`);
  },

};

export default postService;
