import { body } from "express-validator";

export const createOrderValidator = [
  body("user_id")
    .trim()
    .notEmpty()
    .withMessage("User id không được để trống")
    .isInt()
    .withMessage("User id phải là số")
    .toInt(),

  body("address_id")
    .optional()
    .isInt()
    .withMessage("Address id phải là số nếu có"),

  body("total")
    .trim()
    .notEmpty()
    .withMessage("Tổng tiền không được để trống")
    .isFloat({ min: 0 })
    .withMessage("Tổng tiền phải là số dương")
    .toFloat(),

  body("shipping_fee")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Phí ship phải là số dương")
    .toFloat(),

  body("discount_total")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Giảm giá phải là số dương")
    .toFloat(),
    
  body("shipping_address")
    .notEmpty()
    .withMessage("Phải có địa chỉ giao hàng")
    .custom((value) => {
      if (!value.lat || !value.lng) {
        throw new Error("Phải có tọa độ lat/lng");
      }
      return true;
    }),

  // ❌ Bỏ kiểm tra grand_total vì Service sẽ tự tính
  // body("grand_total")...
];

export const updateOrderValidator = [
  body("status")
    .optional()
    .trim()
    .isIn([
      "pending",
      "confirmed",
      "shipping",
      "delivered",
      "cancelled",
      "returned",
    ])
    .withMessage(
      "Trạng thái phải là pending, confirmed, shipping, delivered, cancelled hoặc returned",
    ),
];
