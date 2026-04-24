import { body } from "express-validator";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên sản phẩm không được để trống")
    .isLength({ min: 1, max: 255 })
    .withMessage("Tên sản phẩm phải từ 1 đến 255 ký tự")
    .escape(),

  body("category_id")
    .trim()
    .notEmpty()
    .withMessage("Category id không được để trống")
    .isInt()
    .withMessage("Category id phải là số")
    .toInt(),

  body("brand_id")
    .trim()
    .notEmpty()
    .withMessage("Brand id không được để trống")
    .isInt()
    .withMessage("Brand id phải là số")
    .toInt(),

  body("product_type")
    .optional()
    .isIn(["main", "accessory"])
    .withMessage("Loại sản phẩm phải là main hoặc accessory"),

  body("description")
    .optional()
    .trim(),
];

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tên sản phẩm tối đa 255 ký tự")
    .escape(),

  body("product_type")
    .optional()
    .isIn(["main", "accessory"])
    .withMessage("Loại sản phẩm phải là main hoặc accessory"),

  body("description")
    .optional()
    .trim(),
];


// ===== BULK VALIDATE =====
export const bulkProductValidator = [
  body()
    .isArray({ min: 1 })
    .withMessage("Dữ liệu phải là mảng"),

  body("*.name")
    .notEmpty()
    .withMessage("Tên sản phẩm không được để trống")
    .isLength({ max: 255 })
    .withMessage("Tên tối đa 255 ký tự"),

  body("*.category_id")
    .notEmpty()
    .withMessage("Category không được để trống")
    .isInt()
    .withMessage("Category phải là số")
    .toInt(),

  body("*.brand_id")
    .notEmpty()
    .withMessage("Brand không được để trống")
    .isInt()
    .withMessage("Brand phải là số")
    .toInt(),

  body("*.product_type")
    .optional()
    .isIn(["main", "accessory"])
    .withMessage("Loại sản phẩm không hợp lệ"),

  body("*.description")
    .optional()
    .isString()
];