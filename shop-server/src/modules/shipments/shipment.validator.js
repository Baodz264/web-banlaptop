import { body } from "express-validator";

export const createShipmentValidator = [

  body("order_id")
    .trim()
    .notEmpty()
    .withMessage("Order id không được để trống")
    .isInt()
    .withMessage("Order id phải là số")
    .toInt(),

  body("shipping_status")
    .optional()
    .trim()
    .isIn(["pending", "picked", "shipping", "delivered", "failed"])
    .withMessage("Trạng thái giao hàng không hợp lệ"),

  body("tracking_code")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Mã vận đơn tối đa 100 ký tự"),

  body("carrier")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Tên đơn vị vận chuyển tối đa 100 ký tự"),
];

export const updateShipmentValidator = [

  body("shipping_status")
    .optional()
    .trim()
    .isIn(["pending", "picked", "shipping", "delivered", "failed"])
    .withMessage("Trạng thái giao hàng không hợp lệ"),

  body("tracking_code")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Mã vận đơn tối đa 100 ký tự"),

  body("carrier")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Tên đơn vị vận chuyển tối đa 100 ký tự"),
];
