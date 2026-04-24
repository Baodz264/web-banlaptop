import { body } from "express-validator";

export const createPromotionValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên chương trình khuyến mãi không được để trống")
    .isLength({ min: 1, max: 255 })
    .withMessage("Tên chương trình phải từ 1 đến 255 ký tự")
    .escape(),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Loại khuyến mãi không được để trống")
    .isIn(["percent", "fixed"])
    .withMessage("Loại khuyến mãi phải là percent hoặc fixed"),

  body("value")
    .trim()
    .notEmpty()
    .withMessage("Giá trị khuyến mãi không được để trống")
    .isFloat({ min: 0 })
    .withMessage("Giá trị phải là số dương")
    .toFloat(),

  body("value").custom((value, { req }) => {
    if (req.body.type === "percent" && value > 100) {
      throw new Error("Khuyến mãi phần trăm không được vượt quá 100%");
    }
    return true;
  }),
];

export const updatePromotionValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tên chương trình tối đa 255 ký tự")
    .escape(),

  body("type")
    .optional()
    .trim()
    .isIn(["percent", "fixed"])
    .withMessage("Loại khuyến mãi phải là percent hoặc fixed"),

  body("value")
    .optional()
    .trim()
    .isFloat({ min: 0 })
    .withMessage("Giá trị phải là số dương")
    .toFloat(),
];
