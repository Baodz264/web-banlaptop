import { body } from "express-validator";

export const createBannerValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tiêu đề tối đa 255 ký tự"),

  body("image")
    .optional()
    .trim()
    // bỏ isURL để tránh lỗi khi upload file hoặc path local
    .isLength({ max: 255 })
    .withMessage("Ảnh tối đa 255 ký tự"),

  body("link")
    .optional()
    .trim()
    // chỉ check nếu có giá trị
    .custom((value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error("Link không hợp lệ");
      }
    }),

  body("position")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Vị trí tối đa 100 ký tự"),
];

export const updateBannerValidator = createBannerValidator;
