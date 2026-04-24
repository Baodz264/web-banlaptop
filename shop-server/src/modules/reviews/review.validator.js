import { body } from "express-validator";

export const createReviewValidator = [
  body("product_id")
    .trim()
    .notEmpty()
    .withMessage("Product id không được để trống")
    .isInt()
    .withMessage("Product id phải là số")
    .toInt(),

  body("rating")
    .trim()
    .notEmpty()
    .withMessage("Rating không được để trống")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating phải từ 1 đến 5 sao")
    .toInt(),

  body("comment")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Bình luận tối đa 1000 ký tự")
    .escape(),
];

export const updateReviewValidator = [
  body("rating")
    .optional()
    .trim()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating phải từ 1 đến 5 sao")
    .toInt(),

  body("comment")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Bình luận tối đa 1000 ký tự")
    .escape(),
];
