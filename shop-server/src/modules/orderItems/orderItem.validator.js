import { body } from "express-validator";

/**
 * Validator cho việc tạo Order Item
 * - Phải có ít nhất `variant_id` hoặc `bundle_id`
 * - Kiểm tra kiểu dữ liệu số
 * - Quantity và price bắt buộc
 */
export const createOrderItemValidator = [
  body("order_id")
    .trim()
    .notEmpty()
    .withMessage("Order id không được để trống")
    .isInt()
    .withMessage("Order id phải là số")
    .toInt(),

  // Custom validator để cho phép variant hoặc bundle
  body()
    .custom((value) => {
      const hasVariant = value.variant_id !== undefined && value.variant_id !== null;
      const hasBundle = value.bundle_id !== undefined && value.bundle_id !== null;

      if (!hasVariant && !hasBundle) {
        throw new Error("Phải có variant_id hoặc bundle_id");
      }

      if (hasVariant && isNaN(value.variant_id)) {
        throw new Error("Variant id phải là số");
      }

      if (hasBundle && isNaN(value.bundle_id)) {
        throw new Error("Bundle id phải là số");
      }

      return true;
    }),

  body("price")
    .trim()
    .notEmpty()
    .withMessage("Giá không được để trống")
    .isFloat({ min: 0 })
    .withMessage("Giá phải là số dương")
    .toFloat(),

  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Số lượng không được để trống")
    .isInt({ min: 1 })
    .withMessage("Số lượng phải lớn hơn 0")
    .toInt(),
];

/**
 * Validator cho việc cập nhật Order Item
 * - Price và quantity là tùy chọn
 */
export const updateOrderItemValidator = [
  body("price")
    .optional()
    .trim()
    .isFloat({ min: 0 })
    .withMessage("Giá phải là số dương")
    .toFloat(),

  body("quantity")
    .optional()
    .trim()
    .isInt({ min: 1 })
    .withMessage("Số lượng phải lớn hơn 0")
    .toInt(),
];
