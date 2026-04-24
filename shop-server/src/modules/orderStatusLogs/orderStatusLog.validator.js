import { body } from "express-validator";

export const createOrderStatusLogValidator = [
  body("order_id")
    .trim()
    .notEmpty()
    .withMessage("Order id không được để trống")
    .isInt()
    .withMessage("Order id phải là số")
    .toInt(),

  body("new_status")
    .trim()
    .notEmpty()
    .withMessage("Trạng thái mới không được để trống")
    .isIn([
      "pending",
      "confirmed",
      "shipping",
      "delivered",
      "cancelled",
      "returned"
    ])
    .withMessage(
      "Trạng thái phải là pending, confirmed, shipping, delivered, cancelled hoặc returned"
    ),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Ghi chú tối đa 500 ký tự")
    .escape(),
];
