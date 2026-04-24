import { body } from "express-validator";

export const createVoucherApplyValidator = [
  body("voucher_id")
    .trim()
    .notEmpty()
    .withMessage("ID voucher là bắt buộc")
    .isInt()
    .withMessage("ID voucher phải là số")
    .toInt(),

  body("apply_type")
    .trim()
    .notEmpty()
    .withMessage("Loại áp dụng là bắt buộc")
    .isIn(["all", "category", "product"])
    .withMessage("Loại áp dụng phải là: all, category hoặc product"),

  body("apply_id")
    .optional()
    .isInt()
    .withMessage("ID áp dụng phải là số")
    .toInt(),
];

export const updateVoucherApplyValidator = [
  body("apply_type")
    .optional()
    .trim()
    .isIn(["all", "category", "product"])
    .withMessage("Loại áp dụng phải là: all, category hoặc product"),

  body("apply_id")
    .optional()
    .isInt()
    .withMessage("ID áp dụng phải là số")
    .toInt(),
];
