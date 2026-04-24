import { body } from "express-validator";

export const createVoucherValidator = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Mã voucher là bắt buộc")
    .isLength({ max: 50 })
    .withMessage("Mã voucher phải ít hơn 50 ký tự")
    .toUpperCase(),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên voucher là bắt buộc")
    .isLength({ max: 255 })
    .withMessage("Tên voucher phải ít hơn 255 ký tự")
    .escape(),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Loại voucher là bắt buộc")
    .isIn(["order", "shipping"])
    .withMessage("Loại voucher phải là order hoặc shipping"),

  body("discount_type")
    .trim()
    .notEmpty()
    .withMessage("Loại giảm giá là bắt buộc")
    .isIn(["percent", "fixed"])
    .withMessage("Loại giảm giá phải là percent hoặc fixed"),

  body("discount_value")
    .trim()
    .notEmpty()
    .withMessage("Giá trị giảm giá là bắt buộc")
    .isFloat({ min: 0 })
    .withMessage("Giá trị giảm giá phải là số dương")
    .toFloat(),

  body("discount_value").custom((value, { req }) => {
    if (req.body.discount_type === "percent" && value > 100) {
      throw new Error("Giảm giá theo phần trăm không được vượt quá 100%");
    }
    return true;
  }),
];

export const updateVoucherValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tên voucher phải ít hơn 255 ký tự")
    .escape(),

  body("discount_value")
    .optional()
    .trim()
    .isFloat({ min: 0 })
    .withMessage("Giá trị giảm giá phải là số dương")
    .toFloat(),
];
