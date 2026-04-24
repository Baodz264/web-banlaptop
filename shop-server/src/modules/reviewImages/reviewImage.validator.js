import { body } from "express-validator";

export const createReviewImageValidator = [
  body("review_id")
    .trim()
    .notEmpty()
    .withMessage("Review id không được để trống")
    .isInt()
    .withMessage("Review id phải là số")
    .toInt(),

];
