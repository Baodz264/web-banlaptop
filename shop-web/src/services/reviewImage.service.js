import axiosClient from "./axios.config";

const ReviewImageService = {
  // Lấy danh sách ảnh theo review
  getImagesByReview: (review_id) => {
    return axiosClient.get(`/review-images/review/${review_id}`);
  },

  // Upload ảnh review
  createImage: (formData, config = {}) => {
    return axiosClient.post("/review-images", formData, {
      ...config,
      headers: {
        ...config.headers,
        // QUAN TRỌNG: Ép kiểu multipart/form-data để Multer ở Backend nhận diện được
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Xóa ảnh review
  deleteImage: (id) => {
    return axiosClient.delete(`/review-images/${id}`);
  },
};

export default ReviewImageService;