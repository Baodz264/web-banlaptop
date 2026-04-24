import { body } from "express-validator";

export const createInventoryLogValidator = [
  body("variant_id")
    .trim()
    .notEmpty()
    .withMessage("Variant id không được để trống")
    .isInt()
    .withMessage("Variant id phải là số")
    .toInt(),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Loại giao dịch không được để trống")
    .isIn(["import", "export", "adjust"])
    .withMessage("Loại giao dịch phải là import, export hoặc adjust"),

  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Số lượng không được để trống")
    .isInt({ min: 1 })
    .withMessage("Số lượng phải lớn hơn 0")
    .toInt(),
];
