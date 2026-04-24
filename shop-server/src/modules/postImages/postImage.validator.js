import { body } from "express-validator";

export const createPostImageValidator = [
  body("post_id")
    .trim()
    .notEmpty()
    .withMessage("Post id không được để trống")
    .isInt()
    .withMessage("Post id phải là số")
    .toInt(),

  body("image")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Đường dẫn ảnh tối đa 255 ký tự")
    .escape(),
];

export const updatePostImageValidator = [
  body("post_id")
    .optional()
    .trim()
    .isInt()
    .withMessage("Post id phải là số")
    .toInt(),

  body("image")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Đường dẫn ảnh tối đa 255 ký tự")
    .escape(),
];
