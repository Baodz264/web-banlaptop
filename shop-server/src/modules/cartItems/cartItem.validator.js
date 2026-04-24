import { body } from "express-validator";

export const addCartItemValidator = [
  // Validate cart_id
  body("cart_id")
    .trim()
    .notEmpty()
    .withMessage("Cart id không được để trống")
    .isInt()
    .withMessage("Cart id phải là số")
    .toInt(),

  // Validate variant_id hoặc bundle_id
  body().custom((value) => {
    const { variant_id, bundle_id } = value;

    // Phải có ít nhất 1 trong 2
    if (!variant_id && !bundle_id) {
      throw new Error("Phải có variant hoặc bundle");
    }

    // Không được có cả 2
    if (variant_id && bundle_id) {
      throw new Error("Chỉ được chọn 1: variant hoặc bundle");
    }

    // Nếu có variant_id → phải là số
    if (variant_id && isNaN(Number(variant_id))) {
      throw new Error("Variant id phải là số");
    }

    // Nếu có bundle_id → phải là số
    if (bundle_id && isNaN(Number(bundle_id))) {
      throw new Error("Bundle id phải là số");
    }

    return true;
  }),

  // Validate quantity
  body("quantity")
    .optional() // quantity không bắt buộc, default ở service là 1
    .isInt({ min: 1 })
    .withMessage("Số lượng phải lớn hơn 0")
    .toInt(),
];

export const updateCartItemValidator = [
  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Số lượng không được để trống")
    .isInt({ min: 1 })
    .withMessage("Số lượng phải lớn hơn 0")
    .toInt(),
];
