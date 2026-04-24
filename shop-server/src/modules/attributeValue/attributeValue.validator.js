import { body } from "express-validator";

export const createAttributeValueValidator = [
  body("attribute_id")
    .trim()
    .notEmpty()
    .withMessage("Attribute id không được để trống")
    .isInt()
    .withMessage("Attribute id phải là số"),

  body("value")
    .trim()
    .notEmpty()
    .withMessage("Giá trị không được để trống")
    .isLength({ min: 1, max: 100 })
    .withMessage("Giá trị phải từ 1 đến 100 ký tự")
    .escape(),
];

export const updateAttributeValueValidator = [
  body("value")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Giá trị tối đa 100 ký tự")
    .escape(),
];
