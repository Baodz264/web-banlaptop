import { body } from "express-validator";

export const addAccessoryValidator = [
  body("product_id")
    .trim()
    .notEmpty()
    .withMessage("Product id không được để trống")
    .isInt()
    .withMessage("Product id phải là số")
    .toInt(),

  body("accessory_id")
    .trim()
    .notEmpty()
    .withMessage("Accessory id không được để trống")
    .isInt()
    .withMessage("Accessory id phải là số")
    .toInt(),

  body().custom((value, { req }) => {
    if (req.body.product_id === req.body.accessory_id) {
      throw new Error("Sản phẩm không thể là phụ kiện của chính nó");
    }
    return true;
  }),
];
