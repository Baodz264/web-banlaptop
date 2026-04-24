import { body } from "express-validator";

export const createPaymentValidator = [
  body("order_id")
    .trim()
    .notEmpty()
    .withMessage("Order id không được để trống")
    .isInt()
    .withMessage("Order id phải là số")
    .toInt(),

  body("method")
    .trim()
    .notEmpty()
    .withMessage("Phương thức thanh toán không được để trống")
    .isIn(["cod", "vnpay", "momo", "paypal", "stripe"])
    .withMessage("Phương thức thanh toán không hợp lệ"),

  body("amount")
    .trim()
    .notEmpty()
    .withMessage("Số tiền thanh toán không được để trống")
    .isFloat({ min: 0 })
    .withMessage("Số tiền phải là số dương")
    .toFloat(),
];

export const updatePaymentValidator = [
  body("status")
    .optional()
    .trim()
    .isIn(["pending", "paid", "failed", "refunded"])
    .withMessage("Trạng thái phải là pending, paid, failed hoặc refunded"),

  body("paid_at")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("Thời gian thanh toán không hợp lệ")
    .toDate(),
];
