import { body } from "express-validator";

export const createAttributeValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên thuộc tính không được để trống")
    .isLength({ min: 1, max: 100 })
    .withMessage("Tên thuộc tính phải từ 1 đến 100 ký tự")
    .escape(),
];

export const updateAttributeValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Tên thuộc tính tối đa 100 ký tự")
    .escape(),
];
