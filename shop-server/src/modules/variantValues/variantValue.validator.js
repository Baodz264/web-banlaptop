import { body } from "express-validator";

export const createVariantValueValidator = [
  body("variant_id")
    .trim()
    .notEmpty()
    .withMessage("ID biến thể là bắt buộc")
    .isInt()
    .withMessage("ID biến thể phải là số")
    .toInt(),

  body("attribute_value_id")
    .trim()
    .notEmpty()
    .withMessage("ID giá trị thuộc tính là bắt buộc")
    .isInt()
    .withMessage("ID giá trị thuộc tính phải là số")
    .toInt(),
];
