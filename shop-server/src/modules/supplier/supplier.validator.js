import { body } from "express-validator";

export const createSupplierValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên nhà cung cấp là bắt buộc")
    .isLength({ min: 1, max: 255 })
    .withMessage("Tên nhà cung cấp phải từ 1 đến 255 ký tự")
    .escape(),

  body("phone")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Số điện thoại phải ít hơn 20 ký tự")
    .matches(/^[0-9+()-\s]+$/)
    .withMessage("Định dạng số điện thoại không hợp lệ"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email phải đúng định dạng")
    .normalizeEmail(),
];

export const updateSupplierValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tên nhà cung cấp phải ít hơn 255 ký tự")
    .escape(),

  body("phone")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Số điện thoại phải ít hơn 20 ký tự")
    .matches(/^[0-9+()-\s]+$/)
    .withMessage("Định dạng số điện thoại không hợp lệ"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email phải đúng định dạng")
    .normalizeEmail(),
];
