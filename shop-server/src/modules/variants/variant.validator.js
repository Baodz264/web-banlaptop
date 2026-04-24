import { body } from "express-validator";

export const createVariantValidator = [
  body("product_id")
    .trim()
    .notEmpty()
    .withMessage("ID sản phẩm là bắt buộc")
    .isInt()
    .withMessage("ID sản phẩm phải là số")
    .toInt(),

  body("price")
    .trim()
    .notEmpty()
    .withMessage("Giá là bắt buộc")
    .isFloat({ min: 0 })
    .withMessage("Giá phải là số dương")
    .toFloat(),

  body("stock")
    .optional()
    .trim()
    .isInt({ min: 0 })
    .withMessage("Số lượng tồn kho phải là số dương")
    .toInt(),
];

export const updateVariantValidator = [
  body("price")
    .optional()
    .trim()
    .isFloat({ min: 0 })
    .withMessage("Giá phải là số dương")
    .toFloat(),

  body("stock")
    .optional()
    .trim()
    .isInt({ min: 0 })
    .withMessage("Số lượng tồn kho phải là số dương")
    .toInt(),
];
