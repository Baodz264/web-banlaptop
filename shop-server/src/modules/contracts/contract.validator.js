import { body } from "express-validator";

export const createContractValidator = [

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Tiêu đề không được để trống")
    .isLength({ min: 1, max: 255 })
    .withMessage("Tiêu đề phải từ 1 đến 255 ký tự")
    .escape(),

  body("supplier_id")
    .trim()
    .notEmpty()
    .withMessage("Supplier id không được để trống")
    .isInt()
    .withMessage("Supplier id phải là số")
    .toInt(),
];

export const updateContractValidator = [

  body("title")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tiêu đề tối đa 255 ký tự")
    .escape(),

  body("status")
    .optional()
    .trim()
    .isIn(["active", "expired", "cancelled"])
    .withMessage("Trạng thái phải là active, expired hoặc cancelled"),
];
