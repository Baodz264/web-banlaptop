import { body } from "express-validator";

export const createOrderVoucherValidator = [
  body("order_id")
    .trim()
    .notEmpty()
    .withMessage("Order id không được để trống")
    .isInt()
    .withMessage("Order id phải là số")
    .toInt(),

  body("voucher_id")
    .trim()
    .notEmpty()
    .withMessage("Voucher id không được để trống")
    .isInt()
    .withMessage("Voucher id phải là số")
    .toInt(),

  body("discount_amount")
    .trim()
    .notEmpty()
    .withMessage("Số tiền giảm giá không được để trống")
    .isFloat({ min: 0 })
    .withMessage("Số tiền giảm giá phải là số dương")
    .toFloat(),
];

export const updateOrderVoucherValidator = [
  body("discount_amount")
    .optional()
    .trim()
    .isFloat({ min: 0 })
    .withMessage("Số tiền giảm giá phải là số dương")
    .toFloat(),
];
