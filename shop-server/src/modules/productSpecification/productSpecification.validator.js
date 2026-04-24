import { body } from "express-validator";

export const createSpecificationValidator = [
  body("product_id")
    .trim()
    .notEmpty()
    .withMessage("Product id không được để trống")
    .isInt()
    .withMessage("Product id phải là số")
    .toInt(),

  body("spec_name")
    .trim()
    .notEmpty()
    .withMessage("Tên thông số kỹ thuật không được để trống")
    .isLength({ min: 1, max: 150 })
    .withMessage("Tên thông số phải từ 1 đến 150 ký tự")
    .escape(),

  body("spec_value")
    .trim()
    .notEmpty()
    .withMessage("Giá trị thông số không được để trống")
    .isLength({ min: 1, max: 255 })
    .withMessage("Giá trị thông số phải từ 1 đến 255 ký tự")
    .escape(),
];

export const updateSpecificationValidator = [
  body("spec_name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Tên thông số tối đa 150 ký tự")
    .escape(),

  body("spec_value")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Giá trị thông số tối đa 255 ký tự")
    .escape(),
];
