import { body } from "express-validator";

export const createSettingValidator = [
  body("key")
    .trim()
    .notEmpty()
    .withMessage("Key không được để trống")
    .isLength({ max: 150 })
    .withMessage("Key tối đa 150 ký tự")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("Key chỉ được chứa chữ, số, ., -, _")
    .escape(),

  body("value")
    .optional()
    .trim()
    .isString()
    .withMessage("Value phải là chuỗi")
];

export const updateSettingValidator = [
  body("key")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Key tối đa 150 ký tự")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("Key chỉ được chứa chữ, số, ., -, _")
    .escape(),

  body("value")
    .optional()
    .trim()
    .isString()
    .withMessage("Value phải là chuỗi")
];
