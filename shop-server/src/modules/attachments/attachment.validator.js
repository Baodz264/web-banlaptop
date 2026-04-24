import { body } from "express-validator";

export const createAttachmentValidator = [
  body("message_id")
    .trim()
    .notEmpty()
    .withMessage("Message id không được để trống")
    .isLength({ max: 100 })
    .withMessage("Message id không hợp lệ"),

  body("file_type")
    .trim()
    .notEmpty()
    .withMessage("Loại file không được để trống")
    .isIn(["image", "video", "file"])
    .withMessage("Loại file phải là image, video hoặc file"),

  body("file_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("Đường dẫn file không hợp lệ"),

  body("file_name")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tên file tối đa 255 ký tự"),
];
