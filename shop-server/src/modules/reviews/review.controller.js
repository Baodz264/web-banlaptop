import ReviewService from "./review.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class ReviewController {

  getReviews = asyncHandler(async (req, res) => {
    const reviews = await ReviewService.getReviews(req.query);
    return response.success(res, reviews);
  });

  getReviewById = asyncHandler(async (req, res) => {
    const review = await ReviewService.getReviewById(req.params.id);
    return response.success(res, review);
  });

  createReview = asyncHandler(async (req, res) => {
    const data = {
      ...req.body,
      user_id: req.user.id,
    };

    const review = await ReviewService.createReview(data);
    return response.success(res, review, "Review created");
  });

  updateReview = asyncHandler(async (req, res) => {
    const review = await ReviewService.updateReview(req.params.id, req.body);
    return response.success(res, review, "Review updated");
  });

  deleteReview = asyncHandler(async (req, res) => {
    await ReviewService.deleteReview(req.params.id);
    return response.success(res, null, "Review deleted");
  });

  // ⭐ NEW: thống kê rating
  getRatingSummary = asyncHandler(async (req, res) => {
    const { product_id } = req.query;

    if (!product_id) {
      throw new Error("Thiếu product_id");
    }

    const data = await ReviewService.getRatingSummary(product_id);
    return response.success(res, data);
  });
}

export default new ReviewController();
