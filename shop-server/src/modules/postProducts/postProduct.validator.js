import { body } from "express-validator";

export const createPostProductValidator = [
  body("post_id")
    .trim()
    .notEmpty()
    .withMessage("Post id không được để trống")
    .isInt()
    .withMessage("Post id phải là số")
    .toInt(),

  body("product_id")
    .trim()
    .notEmpty()
    .withMessage("Product id không được để trống")
    .isInt()
    .withMessage("Product id phải là số")
    .toInt(),
];
