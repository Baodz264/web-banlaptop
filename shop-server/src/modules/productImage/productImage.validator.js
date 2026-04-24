import { body } from "express-validator";

export const createProductImageValidator = [
  body("product_id")
    .trim()
    .notEmpty()
    .withMessage("Product id không được để trống")
    .isInt()
    .withMessage("Product id phải là số")
    .toInt(),

  body("image")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Đường dẫn hình ảnh tối đa 255 ký tự"),
];
