// services/review.service.js
import axiosClient from "./axios.config";

const ReviewService = {

  // 📌 Lấy danh sách review + filter
  async getReviews(params = {}) {
    try {
      const res = await axiosClient.get("/reviews", {
        params: {
          ...params,
         
          rating: Array.isArray(params.rating)
            ? params.rating.join(",")
            : params.rating,
        },
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📌 Lấy chi tiết 1 review
  async getReviewById(id) {
    try {
      const res = await axiosClient.get(`/reviews/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ⭐ NEW: lấy thống kê rating
  async getRatingSummary(product_id) {
    try {
      const res = await axiosClient.get("/reviews/rating-summary", {
        params: { product_id },
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ➕ Tạo review
  async createReview(data, config = {}) {
    try {
      const res = await axiosClient.post(
        "/reviews",
        {
          product_id: data.product_id,
          rating: data.rating,
          comment: data.comment,
        },
        config
      );
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ✏️ Update review
  async updateReview(id, data, config = {}) {
    try {
      const res = await axiosClient.put(`/reviews/${id}`, data, config);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ❌ Delete review
  async deleteReview(id, config = {}) {
    try {
      const res = await axiosClient.delete(`/reviews/${id}`, config);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default ReviewService;
