import { body } from "express-validator";

export const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên danh mục không được để trống")
    .isLength({ min: 1, max: 150 })
    .withMessage("Tên danh mục phải từ 1 đến 150 ký tự")
    .escape(),
];

export const updateCategoryValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Tên danh mục tối đa 150 ký tự")
    .escape(),
];
