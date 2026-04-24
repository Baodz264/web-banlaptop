import axiosClient from "./axios.config";

const postImageService = {

  // GET LIST
  getPostImages(params) {
    return axiosClient.get("/post-images", { params });
  },

  // GET DETAIL
  getPostImageById(id) {
    return axiosClient.get(`/post-images/${id}`);
  },

  // UPLOAD IMAGE
  uploadImage(postId, file) {

    const formData = new FormData();

    formData.append("post_id", postId);
    formData.append("image", file);

    return axiosClient.post("/post-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

  },

  // DELETE IMAGE
  deletePostImage(id) {
    return axiosClient.delete(`/post-images/${id}`);
  },

};

export default postImageService;