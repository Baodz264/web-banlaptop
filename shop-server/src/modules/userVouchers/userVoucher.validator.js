import { body } from "express-validator";

export const createUserVoucherValidator = [
  body("user_id")
    .trim()
    .notEmpty()
    .withMessage("ID người dùng là bắt buộc")
    .isInt()
    .withMessage("ID người dùng phải là số")
    .toInt(),

  body("voucher_id")
    .trim()
    .notEmpty()
    .withMessage("ID voucher là bắt buộc")
    .isInt()
    .withMessage("ID voucher phải là số")
    .toInt(),
];

export const updateUserVoucherValidator = [
  body("is_used")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("Trạng thái sử dụng phải là 0 hoặc 1")
    .toInt(),
];
