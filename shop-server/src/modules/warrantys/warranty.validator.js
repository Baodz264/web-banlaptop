import { body } from "express-validator";

export const createWarrantyValidator = [
  body("order_item_id")
    .trim()
    .notEmpty()
    .withMessage("ID sản phẩm trong đơn hàng là bắt buộc")
    .isInt()
    .withMessage("ID sản phẩm trong đơn hàng phải là số")
    .toInt(),

  body("status")
    .optional()
    .trim()
    .isIn(["active", "expired", "processing", "completed"])
    .withMessage("Trạng thái bảo hành không hợp lệ"),
];

export const updateWarrantyValidator = [
  body("status")
    .optional()
    .trim()
    .isIn(["active", "expired", "processing", "completed"])
    .withMessage("Trạng thái bảo hành không hợp lệ"),
];
