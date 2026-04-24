import { body } from "express-validator";

export const createTopicValidator = [
  body("name")
    .notEmpty().withMessage("Tên chủ đề là bắt buộc"),

  body("slug")
    .optional()
    .isSlug().withMessage("Slug không hợp lệ"),

  body("status")
    .optional()
    .isInt({ min: 0, max: 1 }).withMessage("Status phải là 0 hoặc 1"),
];

export const updateTopicValidator = [
  body("name")
    .optional(),

  body("slug")
    .optional()
    .isSlug().withMessage("Slug không hợp lệ"),

  body("status")
    .optional()
    .isInt({ min: 0, max: 1 }).withMessage("Status phải là 0 hoặc 1"),
];
