import { body } from "express-validator";

export const createPromotionItemValidator = [
  body("promotion_id")
    .trim()
    .notEmpty()
    .withMessage("Promotion id không được để trống")
    .isInt()
    .withMessage("Promotion id phải là số")
    .toInt(),

  body("apply_type")
    .trim()
    .notEmpty()
    .withMessage("Loại áp dụng không được để trống")
    .isIn(["all", "category", "product", "variant", "brand"])
    .withMessage("Loại áp dụng phải là all, category, product, variant hoặc brand"),

  body("apply_id")
    .optional()
    .isInt()
    .withMessage("Apply id phải là số")
    .toInt(),
];

export const updatePromotionItemValidator = [
  body("apply_type")
    .optional()
    .trim()
    .isIn(["all", "category", "product", "variant", "brand"])
    .withMessage("Loại áp dụng phải là all, category, product, variant hoặc brand"),

  body("apply_id")
    .optional()
    .isInt()
    .withMessage("Apply id phải là số")
    .toInt(),
];
