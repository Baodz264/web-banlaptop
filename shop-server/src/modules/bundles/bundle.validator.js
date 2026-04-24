import { body } from "express-validator";

export const createBundleValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên bundle không được để trống")
    .isLength({ min: 1, max: 255 })
    .withMessage("Tên bundle phải từ 1 đến 255 ký tự")
    .escape(),

  body("discount_type")
    .trim()
    .notEmpty()
    .withMessage("Loại giảm giá không được để trống")
    .isIn(["percent", "fixed"])
    .withMessage("Loại giảm giá phải là percent hoặc fixed"),

  body("discount_value")
    .trim()
    .notEmpty()
    .withMessage("Giá trị giảm giá không được để trống")
    .isFloat({ min: 0 })
    .withMessage("Giá trị giảm giá phải là số dương")
    .toFloat(),
];

export const updateBundleValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tên bundle tối đa 255 ký tự")
    .escape(),

  body("discount_type")
    .optional()
    .trim()
    .isIn(["percent", "fixed"])
    .withMessage("Loại giảm giá phải là percent hoặc fixed"),

  body("discount_value")
    .optional()
    .trim()
    .isFloat({ min: 0 })
    .withMessage("Giá trị giảm giá phải là số dương")
    .toFloat(),
];
