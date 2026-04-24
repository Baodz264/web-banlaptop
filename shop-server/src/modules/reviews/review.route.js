import express from "express";
import ReviewController from "./review.controller.js";
import { createReviewValidator, updateReviewValidator } from "./review.validator.js";
import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * ===============================
 * 📌 PUBLIC APIs
 * ===============================
 */

// ⭐ Lấy danh sách review + filter (rating, product_id,...)
router.get("/", ReviewController.getReviews);

// ⭐ NEW: thống kê rating (average, count từng sao)
router.get("/rating-summary", ReviewController.getRatingSummary);

// 📌 Lấy chi tiết 1 review
router.get("/:id", ReviewController.getReviewById);


/**
 * ===============================
 * 🔐 PROTECTED APIs (cần login)
 * ===============================
 */

// ➕ Tạo review
router.post(
  "/",
  authMiddleware,
  createReviewValidator,
  validate,
  ReviewController.createReview
);

// ✏️ Cập nhật review
router.put(
  "/:id",
  authMiddleware,
  updateReviewValidator,
  validate,
  ReviewController.updateReview
);

// ❌ Xoá review
router.delete(
  "/:id",
  authMiddleware,
  ReviewController.deleteReview
);

export default router;
