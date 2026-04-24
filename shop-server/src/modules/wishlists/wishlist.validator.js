import { body } from "express-validator";

export const addWishlistValidator = [
  body("product_id")
    .trim()
    .notEmpty()
    .withMessage("ID sản phẩm là bắt buộc")
    .isInt()
    .withMessage("ID sản phẩm phải là số")
    .toInt(),
];
