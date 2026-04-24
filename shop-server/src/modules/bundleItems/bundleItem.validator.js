import { body } from "express-validator";

export const createBundleItemValidator = [
  body("bundle_id")
    .trim()
    .notEmpty()
    .withMessage("Bundle id không được để trống")
    .isInt()
    .withMessage("Bundle id phải là số")
    .toInt(),

  body("variant_id")
    .trim()
    .notEmpty()
    .withMessage("Variant id không được để trống")
    .isInt()
    .withMessage("Variant id phải là số")
    .toInt(),
];
