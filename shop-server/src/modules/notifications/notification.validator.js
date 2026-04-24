import { body } from "express-validator";

export const createNotificationValidator = [
  body("user_id")
    .notEmpty()
    .withMessage("User id không được để trống"),

  body("title")
    .notEmpty()
    .withMessage("Tiêu đề không được để trống"),

  body("type")
    .optional()
];
