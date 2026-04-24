import { body } from "express-validator";

export const createInventoryValidator = [
  body("variant_id")
    .trim()
    .notEmpty()
    .withMessage("Variant id không được để trống")
    .isInt()
    .withMessage("Variant id phải là số")
    .toInt(),

  body("quantity")
    .optional()
    .trim()
    .isInt({ min: 0 })
    .withMessage("Số lượng phải là số nguyên không âm")
    .toInt(),

  body("cost_price")
    .optional()
    .trim()
    .isFloat({ min: 0 })
    .withMessage("Giá nhập phải là số dương")
    .toFloat(),
];

export const updateInventoryValidator = [
  body("variant_id")
    .optional()
    .trim()
    .isInt()
    .withMessage("Variant id phải là số")
    .toInt(),

  body("quantity")
    .optional()
    .trim()
    .isInt({ min: 0 })
    .withMessage("Số lượng phải là số nguyên không âm")
    .toInt(),

  body("cost_price")
    .optional()
    .trim()
    .isFloat({ min: 0 })
    .withMessage("Giá nhập phải là số dương")
    .toFloat(),
];
