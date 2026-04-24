import { body } from "express-validator";

export const createBrandValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên thương hiệu không được để trống")
    .isLength({ min: 1, max: 150 })
    .withMessage("Tên thương hiệu phải từ 1 đến 150 ký tự")
    .escape(),
];

export const updateBrandValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Tên thương hiệu tối đa 150 ký tự")
    .escape(),
];
