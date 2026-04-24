import { body } from "express-validator";

export const createShipmentProofValidator = [
  body("shipment_id")
    .notEmpty()
    .withMessage("Shipment id không được để trống")
    .isInt()
    .withMessage("Shipment id phải là số")
    .toInt(),

  body("image")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Đường dẫn hình ảnh tối đa 255 ký tự"),

  body("note")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Ghi chú tối đa 255 ký tự")
    .escape(),
];

export const updateShipmentProofValidator = [
  body("image")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Đường dẫn hình ảnh tối đa 255 ký tự"),

  body("note")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Ghi chú tối đa 255 ký tự")
    .escape(),
];
