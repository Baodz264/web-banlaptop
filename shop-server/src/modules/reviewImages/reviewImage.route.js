import express from "express";
import ReviewImageController from "./reviewImage.controller.js";

import validate from "../../middlewares/validate.middleware.js";
import createUploader from "../../middlewares/upload.middleware.js";
import { createReviewImageValidator } from "./reviewImage.validator.js";

const router = express.Router();

const uploadReviewImage = createUploader("reviews");

router.get(
  "/review/:review_id",
  ReviewImageController.getImagesByReview
);

router.post(
  "/",
  uploadReviewImage.single("image"),
  createReviewImageValidator,
  validate,
  ReviewImageController.createImage
);

router.delete(
  "/:id",
  ReviewImageController.deleteImage
);

export default router;
